const express = require('express');
const router = express.Router();
const { db } = require('../database');

// --- COUNTRY MASTER ---
router.get('/countries', (req, res) => {
  db.all('SELECT * FROM country_master', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/countries', (req, res) => {
  const { name, currency, currency_code, embassy_city, nmc_status } = req.body;
  if (!name || !currency || !currency_code || !embassy_city) {
    return res.status(400).json({ error: 'Please provide all country details.' });
  }
  db.run(
    `INSERT INTO country_master (name, currency, currency_code, embassy_city, nmc_status)
     VALUES (?, ?, ?, ?, ?)`,
    [name, currency, currency_code, embassy_city, nmc_status !== undefined ? nmc_status : 1],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Country already exists.' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, name, currency, currency_code, embassy_city, nmc_status });
    }
  );
});

router.delete('/countries/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM country_master WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Country with id ${id} deleted.` });
  });
});

// --- UNIVERSITY MASTER ---
router.get('/universities', (req, res) => {
  const query = `
    SELECT u.*, c.name AS country_name 
    FROM university_master u
    JOIN country_master c ON u.country_id = c.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/universities', (req, res) => {
  const { name, country_id, ranking, nmc_approved, who_approved, annual_fee, intake_month, coordinator_name, coordinator_phone } = req.body;
  if (!name || !country_id || !annual_fee || !intake_month) {
    return res.status(400).json({ error: 'Please provide required university details (Name, Country, Fee, Intake Month).' });
  }
  db.run(
    `INSERT INTO university_master (name, country_id, ranking, nmc_approved, who_approved, annual_fee, intake_month, coordinator_name, coordinator_phone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, country_id, ranking || null, nmc_approved !== undefined ? nmc_approved : 1, who_approved !== undefined ? who_approved : 1, annual_fee, intake_month, coordinator_name || '', coordinator_phone || ''],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'University name already exists.' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, name, country_id, ranking, nmc_approved, who_approved, annual_fee, intake_month });
    }
  );
});

router.delete('/universities/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM university_master WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `University with id ${id} deleted.` });
  });
});

module.exports = router;
