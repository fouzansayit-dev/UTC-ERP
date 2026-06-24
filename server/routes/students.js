const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/students
router.get('/', (req, res) => {
  let query = 'SELECT * FROM students';
  let params = [];

  if (req.user.role === 'Student') {
    query = 'SELECT * FROM students WHERE scholar_no = ?';
    params = [req.user.username];
  } else if (req.user.role !== 'Administrator' && req.user.role !== 'Staff/Faculty') {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }

  db.all(query, params, (err, rows) => {
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
  if (req.user.role !== 'Administrator' && req.user.role !== 'Staff/Faculty') {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }
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
    enroll_no || null, 
    roll_no || null, 
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
      if (!row) {
        return res.status(404).json({ error: 'Failed to retrieve the created student record.' });
      }
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
  if (req.user.role !== 'Administrator' && req.user.role !== 'Staff/Faculty') {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }
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
  const params = [scholar_no, enroll_no || null, roll_no || null, name, course, branch, batch, category, caste, religion, admission_date, status, due_fee, json_details, id];

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get('SELECT * FROM students WHERE id = ?', [id], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      if (!row) {
        return res.status(404).json({ error: 'Failed to retrieve the updated student record.' });
      }
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
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ error: 'Access forbidden. Only Administrators can delete student records.' });
  }
  const { id } = req.params;
  db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Student with id ${id} deleted successfully.` });
  });
});

// POST /api/students/scan-attendance-qr
router.post('/scan-attendance-qr', (req, res) => {
  if (req.user.role !== 'Student') {
    return res.status(403).json({ error: 'Access forbidden. Only students can scan attendance QR codes.' });
  }

  const { qrValue } = req.body;
  if (!qrValue) {
    return res.status(400).json({ error: 'QR value is required.' });
  }

  // Parse QR value: e.g. "MBBS|Medicine|2024-2030|Anatomy|2026-06-23"
  const parts = qrValue.split('|');
  if (parts.length < 5) {
    return res.status(400).json({ error: 'Invalid QR code format.' });
  }

  const [course, branch, batch, subject, date] = parts;
  const username = req.user.username; // scholar_no

  // 1. Fetch student info to verify matching details
  db.get('SELECT * FROM students WHERE scholar_no = ?', [username], (stuErr, student) => {
    if (stuErr) return res.status(500).json({ error: stuErr.message });
    if (!student) return res.status(404).json({ error: 'Student record not found.' });

    // Validate that student belongs to this group
    if (
      student.course.toLowerCase() !== course.toLowerCase() ||
      student.branch.toLowerCase() !== branch.toLowerCase() ||
      student.batch.toLowerCase() !== batch.toLowerCase()
    ) {
      return res.status(400).json({ error: 'You are not registered in this classroom/group.' });
    }

    // 2. Fetch attendance records from generic_store
    db.get(
      "SELECT json_data FROM generic_store WHERE module_key = 'student-attendance' AND record_id = 'records'",
      [],
      (genErr, row) => {
        if (genErr) return res.status(500).json({ error: genErr.message });

        let list = [];
        if (row && row.json_data) {
          try {
            list = JSON.parse(row.json_data);
          } catch (e) {
            list = [];
          }
        }

        // Find existing session
        let session = list.find(s => 
          s.date === date &&
          s.course.toLowerCase() === course.toLowerCase() &&
          s.branch.toLowerCase() === branch.toLowerCase() &&
          s.batch.toLowerCase() === batch.toLowerCase() &&
          s.subject.toLowerCase() === subject.toLowerCase()
        );

        if (session) {
          // Find student in records
          let record = session.records.find(r => r.id === student.id || r.name === student.name);
          if (record) {
            record.status = 'P';
          } else {
            session.records.push({
              id: student.id,
              name: student.name,
              mobile: student.phone || '—',
              father: '—',
              category: student.category || 'General',
              status: 'P'
            });
          }
          saveUpdatedRecords(list);
        } else {
          // If session doesn't exist, initialize it.
          // Fetch all students in the same group to default their status to 'A' (absent), and this student to 'P'
          db.all(
            'SELECT * FROM students WHERE course = ? AND branch = ? AND batch = ?',
            [student.course, student.branch, student.batch],
            (allErr, studentRows) => {
              if (allErr) return res.status(500).json({ error: allErr.message });

              const records = studentRows.map(s => {
                let extra = {};
                if (s.json_details) {
                  try { extra = JSON.parse(s.json_details); } catch (e) {}
                }
                const fullStu = { ...extra, ...s };
                return {
                  id: fullStu.id,
                  name: fullStu.name,
                  mobile: fullStu.mobile || fullStu.phone || '—',
                  father: fullStu.father_name || fullStu.father || '—',
                  category: fullStu.category || 'General',
                  status: fullStu.scholar_no === username ? 'P' : 'A'
                };
              });

              const newSession = {
                id: Date.now().toString(),
                date,
                course,
                branch,
                batch,
                subject,
                records
              };

              list.push(newSession);
              saveUpdatedRecords(list);
            }
          );
        }

        function saveUpdatedRecords(updatedList) {
          const dataString = JSON.stringify(updatedList);
          db.run(
            `INSERT INTO generic_store (module_key, record_id, json_data) 
             VALUES ('student-attendance', 'records', ?)
             ON CONFLICT(module_key, record_id) DO UPDATE SET json_data = ?`,
            [dataString, dataString],
            function(saveErr) {
              if (saveErr) return res.status(500).json({ error: saveErr.message });
              return res.json({ 
                success: true, 
                message: `Attendance marked present for ${student.name} in ${subject} (${date}).` 
              });
            }
          );
        }
      }
    );
  });
});

module.exports = router;
