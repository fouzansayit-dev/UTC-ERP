const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/generic/:module_key/:record_id
router.get('/:module_key/:record_id', (req, res) => {
  const { module_key, record_id } = req.params;
  const role = req.user.role;
  const username = req.user.username;

  // Authorization check
  const isAllowed = () => {
    if (role === 'Administrator') return true;
    if (module_key === 'circulars') return true;
    if (role === 'Student') {
      return ['hostel', 'student-attendance', 'timetable', 'lesson-plan', 'certificate', 'document'].includes(module_key);
    }
    if (role === 'Staff/Faculty') {
      return ['hostel', 'student-attendance', 'timetable', 'lesson-plan', 'certificate', 'document'].includes(module_key);
    }
    if (role === 'Accounts') {
      return ['accounts', 'fees'].includes(module_key);
    }
    if (role === 'Transport') {
      return ['transport'].includes(module_key);
    }
    if (role === 'HR') {
      return ['hr'].includes(module_key);
    }
    return false;
  };

  if (!isAllowed()) {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }

  db.get(
    'SELECT json_data FROM generic_store WHERE module_key = ? AND record_id = ?',
    [module_key, record_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) {
        return res.json([]);
      }
      try {
        let parsed = JSON.parse(row.json_data);

        // Data isolation filtering for students
        if (role === 'Student') {
          // Get student details first
          db.get('SELECT name, scholar_no, course FROM students WHERE scholar_no = ?', [username], (stuErr, student) => {
            if (stuErr || !student) {
              return res.json([]);
            }
            const studentName = student.name;

            if (module_key === 'student-attendance') {
              // Filter attendance records to only include student's own status
              if (Array.isArray(parsed)) {
                parsed = parsed.map(session => {
                  if (session.records) {
                    return {
                      ...session,
                      records: session.records.filter(r => r.name === studentName)
                    };
                  }
                  return session;
                });
              }
            } else if (module_key === 'hostel') {
              // Filter hostel allocations
              if (Array.isArray(parsed)) {
                parsed = parsed.filter(alloc => 
                  alloc.studentName === studentName || 
                  alloc.scholarNo === username ||
                  alloc.student_name === studentName
                );
              }
            } else if (module_key === 'circulars') {
              // Filter circulars to only show target ALL or the student's specific course
              if (Array.isArray(parsed)) {
                parsed = parsed.filter(circ => {
                  const target = String(circ.course || 'ALL').toUpperCase();
                  const studentCourse = String(student.course || '').toUpperCase();
                  return target === 'ALL' || target === studentCourse;
                });
              }
            }
            res.json(parsed);
          });
        } else {
          res.json(parsed);
        }
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse stored JSON data.' });
      }
    }
  );
});

// POST /api/generic/:module_key/:record_id
router.post('/:module_key/:record_id', (req, res) => {
  const { module_key, record_id } = req.params;
  const role = req.user.role;

  // Authorization check for writing
  const isAllowedToWrite = () => {
    if (role === 'Administrator') return true;
    if (module_key === 'circulars') {
      return ['Staff/Faculty', 'HR', 'Accounts'].includes(role);
    }
    if (role === 'Staff/Faculty') {
      return ['student-attendance', 'timetable', 'lesson-plan'].includes(module_key);
    }
    if (role === 'Accounts') {
      return ['accounts', 'fees'].includes(module_key);
    }
    if (role === 'Transport') {
      return ['transport'].includes(module_key);
    }
    if (role === 'HR') {
      return ['hr'].includes(module_key);
    }
    return false;
  };

  if (!isAllowedToWrite()) {
    return res.status(403).json({ error: 'Access forbidden. Insufficient write permissions.' });
  }

  const dataString = JSON.stringify(req.body);

  db.run(
    `INSERT INTO generic_store (module_key, record_id, json_data) 
     VALUES (?, ?, ?)
     ON CONFLICT(module_key, record_id) DO UPDATE SET json_data = ?`,
    [module_key, record_id, dataString, dataString],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: `Generic data saved for ${module_key}/${record_id}.` });
    }
  );
});

module.exports = router;
