const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/consultants
router.get('/', (req, res) => {
  db.all('SELECT * FROM consultants', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/consultants
router.post('/', (req, res) => {
  const { name, code, email, phone, commission_rate, status } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Name and Code are required.' });
  }

  db.run(
    `INSERT INTO consultants (name, code, email, phone, commission_rate, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, code, email || '', phone || '', parseFloat(commission_rate || 0), status || 'Active'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Consultant Code already exists.' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, name, code, email, phone, commission_rate, status });
    }
  );
});

// DELETE /api/consultants/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM consultants WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Consultant with id ${id} deleted.` });
  });
});

module.exports = router;
