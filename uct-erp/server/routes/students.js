const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/students
router.get('/', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const mapped = rows.map(r => {
      let extra = {};
      if (r.json_details) {
        try {
          extra = JSON.parse(r.json_details);
        } catch (e) {
          // ignore
        }
      }
      return { ...extra, ...r };
    });
    res.json(mapped);
  });
});

// POST /api/students
router.post('/', (req, res) => {
  const scholar_no = req.body.scholar_no || req.body.scholarNo;
  const enroll_no = req.body.enroll_no || req.body.enrollmentNo;
  const roll_no = req.body.roll_no || req.body.rollNo;
  const name = req.body.name;
  const course = req.body.course;
  const branch = req.body.branch || req.body.branchName;
  const batch = req.body.batch;
  const category = req.body.category;
  const caste = req.body.caste;
  const religion = req.body.religion;
  const admission_date = req.body.admission_date || req.body.admissionDate;
  const status = req.body.status;
  const due_fee = req.body.due_fee !== undefined ? req.body.due_fee : req.body.dueFee;

  if (!scholar_no || !name || !course || !branch || !batch) {
    return res.status(400).json({ error: 'Please enter all required student fields (Scholar No, Name, Course, Branch, Batch).' });
  }

  const json_details = JSON.stringify(req.body);

  const query = `INSERT INTO students (scholar_no, enroll_no, roll_no, name, course, branch, batch, category, caste, religion, admission_date, status, due_fee, json_details)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    scholar_no, 
    enroll_no || '', 
    roll_no || '', 
    name, 
    course, 
    branch, 
    batch, 
    category || 'General', 
    caste || 'General', 
    religion || 'Christian', 
    admission_date || new Date().toISOString().split('T')[0], 
    status || 'active', 
    due_fee || 0,
    json_details
  ];

  db.run(query, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Student with this Scholar Number or Enrollment Number already exists.' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    // Return the newly created student object
    db.get('SELECT * FROM students WHERE id = ?', [this.lastID], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      let extra = {};
      if (row.json_details) {
        try { extra = JSON.parse(row.json_details); } catch(e) {}
      }
      res.status(201).json({ ...extra, ...row });
    });
  });
});

// PUT /api/students/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const scholar_no = req.body.scholar_no || req.body.scholarNo;
  const enroll_no = req.body.enroll_no || req.body.enrollmentNo;
  const roll_no = req.body.roll_no || req.body.rollNo;
  const name = req.body.name;
  const course = req.body.course;
  const branch = req.body.branch || req.body.branchName;
  const batch = req.body.batch;
  const category = req.body.category;
  const caste = req.body.caste;
  const religion = req.body.religion;
  const admission_date = req.body.admission_date || req.body.admissionDate;
  const status = req.body.status;
  const due_fee = req.body.due_fee !== undefined ? req.body.due_fee : req.body.dueFee;

  const json_details = JSON.stringify(req.body);

  const query = `UPDATE students SET 
                 scholar_no = ?, 
                 enroll_no = ?, 
                 roll_no = ?, 
                 name = ?, 
                 course = ?, 
                 branch = ?, 
                 batch = ?, 
                 category = ?, 
                 caste = ?, 
                 religion = ?, 
                 admission_date = ?, 
                 status = ?, 
                 due_fee = ?,
                 json_details = ?
                 WHERE id = ?`;
  const params = [scholar_no, enroll_no, roll_no, name, course, branch, batch, category, caste, religion, admission_date, status, due_fee, json_details, id];

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get('SELECT * FROM students WHERE id = ?', [id], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      let extra = {};
      if (row.json_details) {
        try { extra = JSON.parse(row.json_details); } catch(e) {}
      }
      res.json({ ...extra, ...row });
    });
  });
});

// DELETE /api/students/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Student with id ${id} deleted successfully.` });
  });
});

module.exports = router;
