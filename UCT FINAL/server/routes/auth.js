const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../database');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Please enter all credentials and choose a role portal.' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? AND role = ?',
    [username.trim(), role],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database query error.' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid username/password or incorrect portal role.' });
      }

      const isMatch = bcrypt.compareSync(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      return res.json({
        success: true,
        user: {
          username: user.username,
          role: user.role
        }
      });
    }
  );
});

// POST /api/auth/change-password
router.post('/change-password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Please fill all required password fields.' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Database query error.' });
      if (!user) return res.status(404).json({ error: 'User not found.' });

      const isMatch = bcrypt.compareSync(currentPassword, user.password_hash);
      if (!isMatch) return res.status(401).json({ error: 'Incorrect current password.' });

      const newHash = bcrypt.hashSync(newPassword, 10);
      db.run(
        'UPDATE users SET password_hash = ? WHERE username = ?',
        [newHash, username],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ error: 'Failed to update password.' });
          return res.json({ success: true, message: 'Password updated successfully.' });
        }
      );
    }
  );
});

module.exports = router;
