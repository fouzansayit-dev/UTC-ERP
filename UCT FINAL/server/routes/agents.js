const express = require('express');
const router = express.Router();
const { db } = require('../database');

// --- AGENTS ---
router.get('/', (req, res) => {
  db.all('SELECT * FROM agents', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { agent_code, firm_name, contact_person, countries_json, commission_rate, agreement_details, bank_name, bank_account, swift_code } = req.body;
  if (!agent_code || !firm_name) {
    return res.status(400).json({ error: 'Agent Code and Firm Name are required.' });
  }
  db.run(
    `INSERT INTO agents (agent_code, firm_name, contact_person, countries_json, commission_rate, agreement_details, bank_name, bank_account, swift_code)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [agent_code, firm_name, contact_person || '', countries_json || '[]', commission_rate || 0, agreement_details || '', bank_name || '', bank_account || '', swift_code || ''],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Agent Code already exists.' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, agent_code, firm_name });
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM agents WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Agent with id ${id} deleted.` });
  });
});

// --- COMMISSIONS ---
router.get('/commissions', (req, res) => {
  const query = `
    SELECT c.*, a.firm_name, a.agent_code, s.name AS student_name, s.scholar_no
    FROM agent_commissions c
    JOIN agents a ON c.agent_id = a.id
    JOIN students s ON c.student_id = s.id
  `;
  // If the agent_commissions table doesn't exist yet, we catch the error and return []
  db.all(query, [], (err, rows) => {
    if (err) {
      // Create table dynamically if not exists or return empty array
      db.run(`CREATE TABLE IF NOT EXISTS agent_commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id INTEGER,
        student_id INTEGER,
        amount_gross REAL,
        tds_rate REAL,
        tds_amount REAL,
        amount_net REAL,
        payment_status TEXT DEFAULT 'Unpaid'
      )`, () => {
        res.json([]);
      });
      return;
    }
    res.json(rows);
  });
});

router.post('/commissions', (req, res) => {
  const { agent_id, student_id, amount_gross, tds_rate, payment_status } = req.body;
  if (!agent_id || !student_id || !amount_gross) {
    return res.status(400).json({ error: 'Agent ID, Student ID, and Gross Amount are required.' });
  }
  const rate = tds_rate !== undefined ? tds_rate : 10.0; // 10% TDS default
  const tds_amount = (amount_gross * rate) / 100;
  const amount_net = amount_gross - tds_amount;

  db.run(
    `INSERT INTO agent_commissions (agent_id, student_id, amount_gross, tds_rate, tds_amount, amount_net, payment_status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [agent_id, student_id, amount_gross, rate, tds_amount, amount_net, payment_status || 'Unpaid'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, net: amount_net, tds: tds_amount });
    }
  );
});

module.exports = router;
