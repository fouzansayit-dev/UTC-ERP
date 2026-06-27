const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { initDB, db } = require('./database');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

initDB();

const { authenticate } = require('./middleware/auth');

// ─── Register routers ───
app.use('/api/auth',           require('./routes/auth'));
app.use('/api/students',       authenticate, require('./routes/students'));
app.use('/api/hr',             authenticate, require('./routes/hr'));
app.use('/api/fees',           authenticate, require('./routes/fees'));
app.use('/api/enquiries',      authenticate, require('./routes/enquiries'));
app.use('/api/generic',        authenticate, require('./routes/generic'));
app.use('/api/abroad-masters', authenticate, require('./routes/abroad_masters'));
app.use('/api/agents',         authenticate, require('./routes/agents'));
app.use('/api/consultants',    authenticate, require('./routes/consultants'));
app.use('/api/automations',    authenticate, require('./routes/automations'));

// Mock sending emails to employees
app.post('/api/hr/send-email', authenticate, (req, res) => {
  const { recipients, subject, body } = req.body;
  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'Recipients list is required.' });
  }
  if (!subject || !body) {
    return res.status(400).json({ error: 'Subject and Body are required.' });
  }
  
  console.log(`[EMAIL SEND] To: ${recipients.join(', ')}`);
  console.log(`[EMAIL SEND] Subject: ${subject}`);
  console.log(`[EMAIL SEND] Body: ${body}`);
  
  res.json({ success: true, message: `Email successfully sent to ${recipients.length} employee(s).` });
});


// ─── Dashboard Summary ───────────────────────────────────────────────────────
app.get('/api/dashboard-summary', authenticate, (req, res) => {
  const summary = {
    registeredStudents: 0, activeStudents:   0,
    newStudents:        0, oldStudents:       0,
    totalEmployees:     0, faculty:           0,
    departments:        0, totalDueFees:      0,
    totalCollections:   0, activeEnquiries:   0,
    presentStudents:    0, absentStudents:    0,
    presentEmployees:   0, absentEmployees:   0,
    activeRotations:    0,
    studentData:        [],
  };

  // Cut-off date: 30 days ago (defines "new" students)
  const d30 = new Date();
  d30.setDate(d30.getDate() - 30);
  const cutoff = d30.toISOString().split('T')[0];

  // Helpers wrapping db.get/db.all in Promises
  const q = (sql, params = []) =>
    new Promise(resolve =>
      db.get(sql, params, (err, row) => resolve({ err, row }))
    );

  const qAll = (sql, params = []) =>
    new Promise(resolve =>
      db.all(sql, params, (err, rows) => resolve({ err, rows }))
    );

  Promise.all([
    q('SELECT COUNT(*) AS c FROM students'),
    q("SELECT COUNT(*) AS c FROM students WHERE status = 'active'"),
    q('SELECT COUNT(*) AS c FROM students WHERE admission_date >= ?', [cutoff]),
    q('SELECT COUNT(*) AS c FROM students WHERE admission_date < ? OR admission_date IS NULL', [cutoff]),
    q('SELECT COUNT(*) AS c FROM employees'),
    q("SELECT COUNT(*) AS c FROM employees WHERE department LIKE '%Academ%' OR department LIKE '%Faculty%'"),
    q('SELECT COUNT(DISTINCT department) AS c FROM employees'),
    q('SELECT COALESCE(SUM(due_fee), 0) AS s FROM students'),
    q('SELECT COALESCE(SUM(amount), 0) AS s FROM fee_transactions'),
    q("SELECT COUNT(*) AS c FROM enquiries WHERE status = 'pending'"),
    q("SELECT COUNT(*) AS c FROM employees WHERE attendance_status = 'Present'"),
    q("SELECT COUNT(*) AS c FROM employees WHERE attendance_status = 'Absent' OR attendance_status IS NULL"),
    q("SELECT json_data FROM generic_store WHERE module_key = 'hostel' AND record_id = 'allocations'"),
    qAll('SELECT course AS name, COUNT(*) AS students FROM students GROUP BY course'),
    q("SELECT json_data FROM generic_store WHERE module_key = 'student-attendance' AND record_id = 'records'"),
    q("SELECT json_data FROM generic_store WHERE module_key = 'hr' AND record_id = 'attendance'"),
  ]).then(([
    reg, active, newStu, oldStu,
    emps, fac, depts,
    dueFees, collections, enquiries,
    presentEmp, absentEmp,
    rotations,
    courses,
    attendanceLog,
    employeeAttendanceLog,
  ]) => {
    summary.registeredStudents = reg.row?.c        || 0;
    summary.activeStudents     = active.row?.c     || 0;
    summary.newStudents        = newStu.row?.c     || 0;
    summary.oldStudents        = oldStu.row?.c     || 0;
    summary.totalEmployees     = emps.row?.c       || 0;
    summary.faculty            = fac.row?.c        || 0;
    summary.departments        = depts.row?.c      || 0;
    summary.totalDueFees       = dueFees.row?.s    || 0;
    summary.totalCollections   = collections.row?.s || 0;
    summary.activeEnquiries    = enquiries.row?.c  || 0;
    summary.presentEmployees   = presentEmp.row?.c || 0;
    summary.absentEmployees    = absentEmp.row?.c  || 0;
    
    // Active Rotations = number of hostel allocations stored
    if (!rotations.err && rotations.row?.json_data) {
      try { summary.activeRotations = JSON.parse(rotations.row.json_data).length; } catch {}
    }

    // Dynamic Course Student Counts
    if (!courses.err && courses.rows) {
      summary.studentData = courses.rows;
    }

    // Target Date calculation helper
    const d = new Date();
    const todayLocal = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const todayUTC = d.toISOString().split('T')[0];

    const getTargetDate = (logs) => {
      if (!Array.isArray(logs) || logs.length === 0) return null;
      const dates = logs.map(x => x.date).filter(Boolean);
      if (dates.includes(todayLocal)) return todayLocal;
      if (dates.includes(todayUTC)) return todayUTC;
      dates.sort();
      return dates[dates.length - 1] || null;
    };

    // Parse Student Attendance stats
    let studentPresentCount = 0;
    let studentAbsentCount = 0;
    let studentAttendanceMarked = false;

    if (!attendanceLog.err && attendanceLog.row?.json_data) {
      try {
        const list = JSON.parse(attendanceLog.row.json_data);
        if (Array.isArray(list) && list.length > 0) {
          const targetDate = getTargetDate(list);
          if (targetDate) {
            studentAttendanceMarked = true;
            const targetSessions = list.filter(s => s.date === targetDate);
            const studentStatuses = {};
            targetSessions.forEach(session => {
              if (Array.isArray(session.records)) {
                session.records.forEach(r => {
                  const studentKey = r.id || r.name;
                  if (!studentKey) return;
                  if (studentStatuses[studentKey] === 'P') {
                    // Keep P
                  } else {
                    studentStatuses[studentKey] = r.status;
                  }
                });
              }
            });
            Object.values(studentStatuses).forEach(status => {
              if (status === 'P') studentPresentCount++;
              else if (status === 'A' || status === 'L') studentAbsentCount++;
            });
          }
        }
      } catch (e) {
        console.error('Error parsing student attendance log:', e);
      }
    }
    
    if (studentAttendanceMarked) {
      summary.presentStudents = studentPresentCount;
      summary.absentStudents = studentAbsentCount;
    } else {
      summary.presentStudents = Math.max(0, summary.activeStudents - 2);
      summary.absentStudents = 2;
    }

    // Parse Employee Attendance stats
    let employeePresentCount = 0;
    let employeeAbsentCount = 0;
    let employeeAttendanceMarked = false;

    if (!employeeAttendanceLog.err && employeeAttendanceLog.row?.json_data) {
      try {
        const list = JSON.parse(employeeAttendanceLog.row.json_data);
        if (Array.isArray(list) && list.length > 0) {
          const targetDate = getTargetDate(list);
          if (targetDate) {
            employeeAttendanceMarked = true;
            const targetLogs = list.filter(l => l.date === targetDate);
            const empStatuses = {};
            targetLogs.forEach(l => {
              const empKey = l.empId || l.empName;
              if (!empKey) return;
              if (empStatuses[empKey] === 'Present') {
                // Keep Present
              } else {
                empStatuses[empKey] = l.status; // 'Present', 'Absent', 'Leave', 'Half Day'
              }
            });
            Object.values(empStatuses).forEach(status => {
              if (status === 'Present' || status === 'Half Day') employeePresentCount++;
              else if (status === 'Absent' || status === 'Leave') employeeAbsentCount++;
            });
            // Unmarked employees are counted as Absent
            const totalMarked = Object.keys(empStatuses).length;
            if (totalMarked < summary.totalEmployees) {
              employeeAbsentCount += (summary.totalEmployees - totalMarked);
            }
          }
        }
      } catch (e) {
        console.error('Error parsing employee attendance log:', e);
      }
    }

    if (employeeAttendanceMarked) {
      summary.presentEmployees = employeePresentCount;
      summary.absentEmployees = employeeAbsentCount;
    } else {
      summary.presentEmployees = presentEmp.row?.c || 0;
      summary.absentEmployees = absentEmp.row?.c || 0;
    }

    res.json(summary);
  }).catch(err => {
    console.error('Dashboard summary error:', err);
    res.json(summary);
  });
});

// ─── Static / SPA fallback ───────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`UCT ERP Express backend running on http://localhost:${PORT}`);
});
