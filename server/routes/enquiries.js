const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/enquiries
router.get('/', (req, res) => {
  db.all('SELECT * FROM enquiries', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const mapped = rows.map(r => {
      let extra = {};
      if (r.json_details) {
        try { extra = JSON.parse(r.json_details); } catch(e) {}
      }
      return { ...extra, ...r };
    });
    res.json(mapped);
  });
});

// POST /api/enquiries
router.post('/', (req, res) => {
  const name = req.body.name || req.body.studentName;
  const phone = req.body.phone || req.body.mobile;
  const session = req.body.session || req.body.enquiryDate || new Date().toISOString().split('T')[0];
  const status = req.body.status || 'pending';
  const done_followup = req.body.done_followup || '';
  const pending_followup = req.body.pending_followup || '';

  if (!name || !phone) {
    return res.status(400).json({ error: 'Please enter all required enquiry fields (Name, Phone).' });
  }

  const json_details = JSON.stringify(req.body);

  const query = `INSERT INTO enquiries (name, phone, session, status, done_followup, pending_followup, json_details)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    name,
    phone,
    session,
    status,
    done_followup,
    pending_followup,
    json_details
  ];

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get('SELECT * FROM enquiries WHERE id = ?', [this.lastID], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      let extra = {};
      if (row.json_details) {
        try { extra = JSON.parse(row.json_details); } catch(e) {}
      }
      res.status(201).json({ ...extra, ...row });
    });
  });
});

// PUT /api/enquiries/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const name = req.body.name || req.body.studentName;
  const phone = req.body.phone || req.body.mobile;
  const session = req.body.session || req.body.enquiryDate || new Date().toISOString().split('T')[0];
  const status = req.body.status || 'pending';
  const done_followup = req.body.done_followup || '';
  const pending_followup = req.body.pending_followup || '';

  const json_details = JSON.stringify(req.body);

  const query = `UPDATE enquiries SET 
                 name = ?, 
                 phone = ?, 
                 session = ?, 
                 status = ?, 
                 done_followup = ?, 
                 pending_followup = ?,
                 json_details = ?
                 WHERE id = ?`;
  const params = [name, phone, session, status, done_followup, pending_followup, json_details, id];

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get('SELECT * FROM enquiries WHERE id = ?', [id], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      let extra = {};
      if (row.json_details) {
        try { extra = JSON.parse(row.json_details); } catch(e) {}
      }
      res.json({ ...extra, ...row });
    });
  });
});

// DELETE /api/enquiries/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM enquiries WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Enquiry lead with id ${id} deleted successfully.` });
  });
});

module.exports = router;
