const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../database');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'uct_secret_key_2026';

// Simple in-memory rate limiting map for login
const loginAttempts = {};
const loginLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  if (loginAttempts[ip]) {
    const attempts = loginAttempts[ip].filter(t => now - t < 15 * 60 * 1000); // 15 mins window
    loginAttempts[ip] = attempts;
    if (attempts.length >= 10) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again after 15 minutes.' });
    }
  } else {
    loginAttempts[ip] = [];
  }
  loginAttempts[ip].push(now);
  next();
};

// POST /api/auth/login
router.post('/login', loginLimiter, (req, res) => {
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

      // Sign JWT token
      const token = jwt.sign(
        { username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
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
