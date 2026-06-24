const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/hr
router.get('/', (req, res) => {
  db.all('SELECT * FROM employees', [], (err, rows) => {
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

// POST /api/hr
router.post('/', (req, res) => {
  const name = req.body.name;
  const department = req.body.department;
  const salary = parseFloat(req.body.basicSalary || req.body.salary || 0);
  const pay_status = req.body.pay_status || req.body.payStatus || 'Unpaid';
  const email = req.body.email || '';
  const phone = req.body.phone || req.body.mobile || '';
  const attendance_status = req.body.attendance_status || req.body.attendanceStatus || 'Absent';

  if (!name || !department) {
    return res.status(400).json({ error: 'Please enter all required employee fields (Name, Department).' });
  }

  const json_details = JSON.stringify(req.body);

  const query = `INSERT INTO employees (name, department, salary, pay_status, email, phone, attendance_status, json_details)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    name,
    department,
    salary,
    pay_status,
    email,
    phone,
    attendance_status,
    json_details
  ];

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get('SELECT * FROM employees WHERE id = ?', [this.lastID], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      let extra = {};
      if (row.json_details) {
        try { extra = JSON.parse(row.json_details); } catch(e) {}
      }
      res.status(201).json({ ...extra, ...row });
    });
  });
});

// PUT /api/hr/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const name = req.body.name;
  const department = req.body.department;
  const salary = parseFloat(req.body.basicSalary || req.body.salary || 0);
  const pay_status = req.body.pay_status || req.body.payStatus || 'Unpaid';
  const email = req.body.email || '';
  const phone = req.body.phone || req.body.mobile || '';
  const attendance_status = req.body.attendance_status || req.body.attendanceStatus || 'Absent';

  const json_details = JSON.stringify(req.body);

  const query = `UPDATE employees SET 
                 name = ?, 
                 department = ?, 
                 salary = ?, 
                 pay_status = ?, 
                 email = ?, 
                 phone = ?, 
                 attendance_status = ?,
                 json_details = ?
                 WHERE id = ?`;
  const params = [name, department, salary, pay_status, email, phone, attendance_status, json_details, id];

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get('SELECT * FROM employees WHERE id = ?', [id], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      let extra = {};
      if (row.json_details) {
        try { extra = JSON.parse(row.json_details); } catch(e) {}
      }
      res.json({ ...extra, ...row });
    });
  });
});

// DELETE /api/hr/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM employees WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Employee record with id ${id} deleted successfully.` });
  });
});

module.exports = router;
