const express = require('express');
const router = express.Router();
const { db } = require('../database');

// 1. POST /api/automations/run-fee-reminders
router.post('/run-fee-reminders', (req, res) => {
  if (req.user.role !== 'Administrator' && req.user.role !== 'Accounts') {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }

  db.all('SELECT id, name, scholar_no, email, mobile, due_fee FROM students WHERE due_fee > 0', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Simulate sending SMS/WhatsApp/Email notifications
    const logs = rows.map(student => {
      const message = `Dear ${student.name} (${student.scholar_no}), this is a reminder that your pending balance of $${student.due_fee} is due. Please clear it at the accounts office.`;
      console.log(`[AUTOMATED NOTIFICATION] Sent to ${student.mobile || student.email || student.name}: "${message}"`);
      return {
        studentId: student.id,
        scholarNo: student.scholar_no,
        name: student.name,
        amount: student.due_fee,
        sentTo: student.mobile || student.email || 'System Log',
        status: 'Sent'
      };
    });

    res.json({
      success: true,
      message: `Successfully generated and dispatched ${rows.length} fee due reminder(s).`,
      dispatched: logs
    });
  });
});

// 2. POST /api/automations/run-attendance-checks
router.post('/run-attendance-checks', (req, res) => {
  if (req.user.role !== 'Administrator' && req.user.role !== 'Staff/Faculty') {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }

  // Fetch all students
  db.all('SELECT id, name, scholar_no, course, branch, batch FROM students', [], (err, students) => {
    if (err) return res.status(500).json({ error: err.message });

    // Fetch student-attendance records from generic store
    db.get("SELECT json_data FROM generic_store WHERE module_key = 'student-attendance' AND record_id = 'records'", [], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      let records = [];
      if (row && row.json_data) {
        try {
          records = JSON.parse(row.json_data);
        } catch (e) {
          records = [];
        }
      }

      const warnings = [];

      students.forEach(student => {
        let present = 0;
        let total = 0;

        records.forEach(session => {
          // Check if session belongs to student's course/branch/batch
          if (
            session.course === student.course &&
            session.branch === student.branch &&
            session.batch === student.batch
          ) {
            // Find student's attendance status in this session
            const record = session.records && session.records.find(r => String(r.scholarNo || r.id) === String(student.scholar_no || student.id));
            if (record) {
              total++;
              if (record.status === 'P') present++;
            }
          }
        });

        const pct = total > 0 ? Math.round((present / total) * 100) : 100;
        if (pct < 75 && total > 0) {
          warnings.push({
            studentId: student.id,
            scholarNo: student.scholar_no,
            name: student.name,
            course: student.course,
            branch: student.branch,
            batch: student.batch,
            presentCount: present,
            totalClasses: total,
            percentage: pct
          });
        }
      });

      // Save list of warnings to generic_store under automations/attendance-warnings
      const dataStr = JSON.stringify(warnings);
      db.run(
        `INSERT OR REPLACE INTO generic_store (module_key, record_id, json_data) 
         VALUES ('automations', 'attendance-warnings', ?)`,
        [dataStr],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          
          res.json({
            success: true,
            message: `Scanned ${students.length} students. Flagged ${warnings.length} with low attendance (<75%).`,
            warnings
          });
        }
      );
    });
  });
});

// 3. POST /api/automations/biometric-terminal-sync (Direct RFID logs)
router.post('/biometric-terminal-sync', (req, res) => {
  const { empId, timestamp, direction, deviceId } = req.body;
  if (!empId || !direction || !deviceId) {
    return res.status(400).json({ error: 'empId, direction, and deviceId are required.' });
  }

  // Create biometric table if it doesn't exist
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS biometric_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emp_id TEXT NOT NULL,
        direction TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        device_id TEXT NOT NULL
      )
    `);

    // Insert log
    db.run(
      'INSERT INTO biometric_logs (emp_id, direction, timestamp, device_id) VALUES (?, ?, ?, ?)',
      [empId, direction, timestamp || new Date().toISOString(), deviceId],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });

        // Auto mark employee attendance in generic_store for today
        const todayDate = (timestamp || new Date().toISOString()).split('T')[0];
        
        db.get('SELECT * FROM employees WHERE emp_id = ? OR id = ?', [empId, empId], (err, emp) => {
          if (err || !emp) {
            return res.json({ success: true, message: 'Log inserted, but no matching employee found.', logId: this.lastID });
          }

          // Fetch current HR attendance sheet
          db.get("SELECT json_data FROM generic_store WHERE module_key = 'hr' AND record_id = 'attendance'", [], (err, row) => {
            let attendanceRecords = [];
            if (row && row.json_data) {
              try {
                attendanceRecords = JSON.parse(row.json_data);
              } catch (e) {}
            }

            // Find or create record for todayDate
            let dayRecord = attendanceRecords.find(r => r.date === todayDate);
            if (!dayRecord) {
              dayRecord = { date: todayDate, list: [] };
              attendanceRecords.push(dayRecord);
            }

            // Find or create employee entry in this date's list
            let empEntry = dayRecord.list.find(e => String(e.id) === String(emp.id));
            if (!empEntry) {
              empEntry = {
                id: emp.id,
                name: emp.name,
                department: emp.department,
                designation: emp.designation,
                status: 'Absent',
                inTime: '',
                outTime: ''
              };
              dayRecord.list.push(empEntry);
            }

            // Update details based on biometric direction
            if (direction === 'IN') {
              empEntry.status = 'Present';
              empEntry.inTime = (timestamp || new Date().toISOString()).split('T')[1]?.slice(0, 5) || '09:00';
            } else if (direction === 'OUT') {
              empEntry.outTime = (timestamp || new Date().toISOString()).split('T')[1]?.slice(0, 5) || '17:00';
            }

            // Save back to generic store
            db.run(
              "INSERT OR REPLACE INTO generic_store (module_key, record_id, json_data) VALUES ('hr', 'attendance', ?)",
              [JSON.stringify(attendanceRecords)],
              (err) => {
                if (err) return res.status(500).json({ error: err.message });
                
                // Update employee table last active status
                db.run(
                  "UPDATE employees SET attendance_status = ? WHERE id = ?",
                  [empEntry.status, emp.id],
                  () => {
                    res.json({
                      success: true,
                      message: `RFID check-in processed for ${emp.name}. Status: ${empEntry.status}.`,
                      logId: this.lastID,
                      employee: emp.name
                    });
                  }
                );
              }
            );
          });
        });
      }
    );
  });
});

// 4. GET /api/automations/admin/db-explorer (Admin only table explorer)
router.get('/admin/db-explorer', (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }

  const { table, search } = req.query;
  const allowedTables = [
    'users', 'students', 'employees', 'fee_transactions', 
    'enquiries', 'generic_store', 'country_master', 
    'university_master', 'consultants', 'biometric_logs'
  ];

  if (!table || !allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid or missing database table parameter.' });
  }

  let query = `SELECT * FROM ${table}`;
  let params = [];

  if (search) {
    // Basic search filtering across columns depending on table
    if (table === 'students') {
      query += ' WHERE name LIKE ? OR scholar_no LIKE ? OR course LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    } else if (table === 'employees') {
      query += ' WHERE name LIKE ? OR department LIKE ? OR email LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    } else if (table === 'users') {
      query += ' WHERE username LIKE ? OR role LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    } else if (table === 'generic_store') {
      query += ' WHERE module_key LIKE ? OR record_id LIKE ? OR json_data LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    } else if (table === 'enquiries') {
      query += ' WHERE name LIKE ? OR phone LIKE ? OR session LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    } else if (table === 'consultants') {
      query += ' WHERE name LIKE ? OR code LIKE ? OR email LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    } else if (table === 'biometric_logs') {
      query += ' WHERE emp_id LIKE ? OR device_id LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    } else if (table === 'country_master') {
      query += ' WHERE name LIKE ? OR currency_code LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    } else if (table === 'university_master') {
      query += ' WHERE name LIKE ? OR coordinator_name LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    } else {
      query += ' WHERE id LIKE ?';
      params = [`%${search}%`];
    }
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
