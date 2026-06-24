const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'uct_erp.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database uct_erp.db');
  }
});

function initDB() {
  db.serialize(() => {
    // 1. Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL
    )`);

    // 2. Students Table (with json_details for extra fields)
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scholar_no TEXT UNIQUE NOT NULL,
      enroll_no TEXT UNIQUE,
      roll_no TEXT,
      name TEXT NOT NULL,
      course TEXT NOT NULL,
      branch TEXT NOT NULL,
      batch TEXT NOT NULL,
      category TEXT,
      caste TEXT,
      religion TEXT,
      admission_date TEXT,
      status TEXT DEFAULT 'active',
      due_fee REAL DEFAULT 0,
      json_details TEXT
    )`);

    // 3. Employees Table (with json_details for extra fields)
    db.run(`CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      salary REAL NOT NULL,
      pay_status TEXT DEFAULT 'Unpaid',
      email TEXT,
      phone TEXT,
      attendance_status TEXT DEFAULT 'Absent',
      json_details TEXT
    )`);

    // 4. Fee Transactions Table
    db.run(`CREATE TABLE IF NOT EXISTS fee_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      receipt_no TEXT UNIQUE NOT NULL,
      amount REAL NOT NULL,
      payment_mode TEXT NOT NULL,
      date TEXT NOT NULL,
      head_wise_details TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id)
    )`);

    // 5. Enquiries Table (with json_details for extra fields)
    db.run(`CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      session TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      done_followup TEXT,
      pending_followup TEXT,
      json_details TEXT
    )`);

    // 6. Generic Store Table for secondary modules (Hostel, Transport, Certificates, etc.)
    db.run(`CREATE TABLE IF NOT EXISTS generic_store (
      module_key TEXT NOT NULL,
      record_id TEXT NOT NULL,
      json_data TEXT NOT NULL,
      PRIMARY KEY (module_key, record_id)
    )`);

    // --- SEED ADMIN USER (required for login) ---
    const adminHash = bcrypt.hashSync('Admin@UctErp2026', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['admin', adminHash, 'Administrator']
    );

    console.log('Database initialized.');
  });
}

module.exports = {
  db,
  initDB
};
