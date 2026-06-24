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

    // 7. Country Master Table
    db.run(`CREATE TABLE IF NOT EXISTS country_master (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      currency TEXT NOT NULL,
      currency_code TEXT NOT NULL,
      embassy_city TEXT NOT NULL,
      nmc_status INTEGER DEFAULT 1
    )`);

    // 8. University Master Table
    db.run(`CREATE TABLE IF NOT EXISTS university_master (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      country_id INTEGER NOT NULL,
      ranking INTEGER,
      nmc_approved INTEGER DEFAULT 1,
      who_approved INTEGER DEFAULT 1,
      annual_fee REAL NOT NULL,
      intake_month TEXT NOT NULL,
      coordinator_name TEXT,
      coordinator_phone TEXT,
      FOREIGN KEY(country_id) REFERENCES country_master(id)
    )`);

    // 9. Agents Table
    db.run(`CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_code TEXT UNIQUE NOT NULL,
      firm_name TEXT NOT NULL,
      contact_person TEXT,
      countries_json TEXT,
      commission_rate REAL DEFAULT 0,
      agreement_details TEXT,
      bank_name TEXT,
      bank_account TEXT,
      swift_code TEXT
    )`);

    // 10. Visa Tracking Table
    db.run(`CREATE TABLE IF NOT EXISTS visa_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      passport_no TEXT,
      passport_expiry TEXT,
      visa_no TEXT,
      visa_expiry TEXT,
      status TEXT DEFAULT 'Invitation',
      FOREIGN KEY(student_id) REFERENCES students(id)
    )`);

    // 11. Student Fee Ledger Table
    db.run(`CREATE TABLE IF NOT EXISTS student_fee_ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      particulars TEXT NOT NULL,
      debit REAL DEFAULT 0,
      credit REAL DEFAULT 0,
      balance REAL NOT NULL,
      FOREIGN KEY(student_id) REFERENCES students(id)
    )`);

    // 12. Forex Remittances Table
    db.run(`CREATE TABLE IF NOT EXISTS forex_remittances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      university_id INTEGER NOT NULL,
      currency TEXT NOT NULL,
      amount REAL NOT NULL,
      exchange_rate REAL NOT NULL,
      inr_equivalent REAL NOT NULL,
      swift_no TEXT,
      rbi_purpose_code TEXT,
      status TEXT DEFAULT 'Pending',
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(university_id) REFERENCES university_master(id)
    )`);

    // 13. NMC Internships Table
    db.run(`CREATE TABLE IF NOT EXISTS nmc_internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      hospital_name TEXT,
      start_date TEXT,
      end_date TEXT,
      fmge_status TEXT DEFAULT 'Pending',
      registration_no TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id)
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
