const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/fees (Get all fee transaction receipts)
router.get('/', (req, res) => {
  const query = `
    SELECT ft.*, s.name as student_name, s.scholar_no, s.course, s.batch 
    FROM fee_transactions ft
    JOIN students s ON ft.student_id = s.id
    ORDER BY ft.id DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Parse head-wise JSON details for client
    const parsedRows = rows.map(r => ({
      ...r,
      head_wise_details: r.head_wise_details ? JSON.parse(r.head_wise_details) : null
    }));
    res.json(parsedRows);
  });
});

// POST /api/fees (Collect fee / create receipt)
router.post('/', (req, res) => {
  const { student_id, amount, payment_mode, date, head_wise_details } = req.body;

  if (!student_id || !amount || !payment_mode) {
    return res.status(400).json({ error: 'Please enter all required fee receipt fields (Student ID, Amount, Payment Mode).' });
  }

  // Create a receipt number (e.g. REC-178000...)
  const receipt_no = 'REC-' + Date.now();
  const txDate = date || new Date().toISOString().split('T')[0];
  const headDetailsStr = head_wise_details ? JSON.stringify(head_wise_details) : '{}';

  // We perform two actions inside a database lock serialization
  db.serialize(() => {
    // 1. Insert fee transaction
    const insertTx = `INSERT INTO fee_transactions (student_id, receipt_no, amount, payment_mode, date, head_wise_details)
                      VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(insertTx, [student_id, receipt_no, parseFloat(amount), payment_mode, txDate, headDetailsStr], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      const lastTxId = this.lastID;

      // 2. Update student due fee (subtract paid amount from due_fee)
      const updateStudentFee = `UPDATE students SET due_fee = MAX(0, due_fee - ?) WHERE id = ?`;
      db.run(updateStudentFee, [parseFloat(amount), student_id], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });
        
        // Return full transaction details
        db.get('SELECT * FROM fee_transactions WHERE id = ?', [lastTxId], (getErr, row) => {
          if (getErr) return res.status(500).json({ error: getErr.message });
          res.status(201).json({
            ...row,
            head_wise_details: JSON.parse(row.head_wise_details)
          });
        });
      });
    });
  });
});

module.exports = router;
