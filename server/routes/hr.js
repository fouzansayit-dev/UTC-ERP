const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../database');

// Generate a random alphanumeric password
function generatePassword(len = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#';
  let pwd = '';
  for (let i = 0; i < len; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}

// Map employee department to portal role
function deptToRole(department) {
  if (!department) return 'Staff/Faculty';
  const d = department.toLowerCase();
  if (d.includes('hr'))          return 'HR';
  if (d.includes('account'))     return 'Accounts';
  if (d.includes('transport'))   return 'Transport';
  if (d.includes('admin'))       return 'Administrator';
  // Academics / Library / Hostel / International all map to Staff/Faculty
  return 'Staff/Faculty';
}

// GET /api/hr
router.get('/', (req, res) => {
  let query = 'SELECT * FROM employees';
  let params = [];

  if (req.user.role === 'Staff/Faculty') {
    query = 'SELECT * FROM employees WHERE email = ?';
    params = [req.user.username];
  } else if (req.user.role !== 'Administrator' && req.user.role !== 'HR') {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }

  db.all(query, params, (err, rows) => {
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
  if (req.user.role !== 'Administrator' && req.user.role !== 'HR') {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }
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
    
    const empId = this.lastID;
    db.get('SELECT * FROM employees WHERE id = ?', [empId], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      let extra = {};
      if (row.json_details) {
        try { extra = JSON.parse(row.json_details); } catch(e) {}
      }
      const empObj = { ...extra, ...row };

      // Auto-generate login credentials
      const role = deptToRole(department);
      // Use email as username if provided, otherwise generate EMP-<id>
      const loginUsername = (email && email.trim()) ? email.trim() : `EMP-${empId}`;
      const plainPassword  = generatePassword(10);
      const passwordHash   = bcrypt.hashSync(plainPassword, 10);

      db.run(
        `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
        [loginUsername, passwordHash, role],
        function(userErr) {
          if (userErr) {
            return res.status(201).json({
              ...empObj,
              credentialWarning: 'Employee saved but login account could not be created: ' + userErr.message
            });
          }
          return res.status(201).json({
            ...empObj,
            credentials: {
              username: loginUsername,
              password: plainPassword,
              role: role,
              portal: role + ' Portal'
            }
          });
        }
      );
    });
  });
});

// PUT /api/hr/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;

  const runUpdate = () => {
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
  };

  if (req.user.role === 'Staff/Faculty') {
    db.get('SELECT email FROM employees WHERE id = ?', [id], (err, emp) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!emp || emp.email !== req.user.username) {
        return res.status(403).json({ error: 'Access forbidden. You can only update your own profile.' });
      }
      runUpdate();
    });
  } else if (req.user.role === 'Administrator' || req.user.role === 'HR') {
    runUpdate();
  } else {
    res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }
});

// DELETE /api/hr/:id
router.delete('/:id', (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ error: 'Access forbidden. Only Administrators can delete employee records.' });
  }
  const { id } = req.params;
  db.run('DELETE FROM employees WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Employee record with id ${id} deleted successfully.` });
  });
});

module.exports = router;
