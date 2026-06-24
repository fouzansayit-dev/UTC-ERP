const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { initDB, db } = require('./database');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initDB();

// ─── Register routers ───
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/students',  require('./routes/students'));
app.use('/api/hr',        require('./routes/hr'));
app.use('/api/fees',      require('./routes/fees'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/generic',   require('./routes/generic'));
app.use('/api/abroad-masters', require('./routes/abroad_masters'));
app.use('/api/agents',         require('./routes/agents'));

// ─── Dashboard Summary ───────────────────────────────────────────────────────
app.get('/api/dashboard-summary', (req, res) => {
  const summary = {
    registeredStudents: 0, activeStudents:   0,
    newStudents:        0, oldStudents:       0,
    totalEmployees:     0, faculty:           0,
    departments:        0, totalDueFees:      0,
    totalCollections:   0, activeEnquiries:   0,
    presentStudents:    0, absentStudents:    0,
    presentEmployees:   0, absentEmployees:   0,
    activeRotations:    0,
  };

  // Cut-off date: 30 days ago (defines "new" students)
  const d30 = new Date();
  d30.setDate(d30.getDate() - 30);
  const cutoff = d30.toISOString().split('T')[0];

  // Helper: wrap db.get in a Promise
  const q = (sql, params = []) =>
    new Promise(resolve =>
      db.get(sql, params, (err, row) => resolve({ err, row }))
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
  ]).then(([
    reg, active, newStu, oldStu,
    emps, fac, depts,
    dueFees, collections, enquiries,
    presentEmp, absentEmp,
    rotations,
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
    // Student attendance defaults to 0 present until explicitly marked via HR module
    summary.presentStudents    = 0;
    summary.absentStudents     = summary.activeStudents;
    // Active Rotations = number of hostel allocations stored
    if (!rotations.err && rotations.row?.json_data) {
      try { summary.activeRotations = JSON.parse(rotations.row.json_data).length; } catch {}
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
