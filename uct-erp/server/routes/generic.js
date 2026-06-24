const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/generic/:module_key/:record_id
router.get('/:module_key/:record_id', (req, res) => {
  const { module_key, record_id } = req.params;

  db.get(
    'SELECT json_data FROM generic_store WHERE module_key = ? AND record_id = ?',
    [module_key, record_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) {
        // Return empty array or empty object as default
        return res.json([]);
      }
      try {
        res.json(JSON.parse(row.json_data));
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse stored JSON data.' });
      }
    }
  );
});

// POST /api/generic/:module_key/:record_id
router.post('/:module_key/:record_id', (req, res) => {
  const { module_key, record_id } = req.params;
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
