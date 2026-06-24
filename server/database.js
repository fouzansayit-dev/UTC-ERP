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

    // 14. Consultants Table
    db.run(`CREATE TABLE IF NOT EXISTS consultants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      email TEXT,
      phone TEXT,
      commission_rate REAL DEFAULT 0,
      status TEXT DEFAULT 'Active'
    )`);

    // Seed test consultants
    db.run(`INSERT OR IGNORE INTO consultants (name, code, email, phone, commission_rate, status) VALUES 
      ('Apex Consultants', 'CONS-001', 'apex@consultants.com', '9876543210', 8.5, 'Active'),
      ('Beacon Admission Hub', 'CONS-002', 'beacon@admissions.org', '8765432109', 10.0, 'Active')
    `);

    // --- SEED PORTAL USERS (required for login) ---
    const adminHash = bcrypt.hashSync('Admin@UctErp2026', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['admin', adminHash, 'Administrator']
    );

    const studentHash = bcrypt.hashSync('Student@Uct2026', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['SCH-101', studentHash, 'Student']
    );

    const staffHash = bcrypt.hashSync('Staff@Uct2026', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['domingos@uct.edu.tl', staffHash, 'Staff/Faculty']
    );

    const hrHash = bcrypt.hashSync('Hr@Uct2026', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['anapaula@uct.edu.tl', hrHash, 'HR']
    );

    const accountsHash = bcrypt.hashSync('Accounts@Uct2026', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['carlos@uct.edu.tl', accountsHash, 'Accounts']
    );

    const transportHash = bcrypt.hashSync('Transport@Uct2026', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['transport@uct.edu.tl', transportHash, 'Transport']
    );

    const agentHash = bcrypt.hashSync('Agent@Uct2026', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['AG-001', agentHash, 'Agent']
    );

    // Seed Countries if empty
    db.get('SELECT COUNT(*) AS c FROM country_master', [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.run(`INSERT INTO country_master (name, currency, currency_code, embassy_city, nmc_status) VALUES 
          ('Russia', 'Russian Ruble', 'RUB', 'Moscow', 1),
          ('Philippines', 'Philippine Peso', 'PHP', 'Manila', 1),
          ('Kazakhstan', 'Kazakhstani Tenge', 'KZT', 'Astana', 1),
          ('Georgia', 'Georgian Lari', 'GEL', 'Tbilisi', 1),
          ('Kyrgyzstan', 'Kyrgyzstani Som', 'KGS', 'Bishkek', 1)
        `);
      }
    });

    // Seed Universities if empty
    db.get('SELECT COUNT(*) AS c FROM university_master', [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.run(`INSERT INTO university_master (name, country_id, ranking, nmc_approved, who_approved, annual_fee, intake_month, coordinator_name, coordinator_phone) VALUES 
          ('Kazan State Medical University', 1, 1200, 1, 1, 6000, 'September', 'Dr. Dmitry', '77112233'),
          ('UV Gullas College of Medicine', 2, 1800, 1, 1, 5200, 'November', 'Maria Santos', '77223344'),
          ('Asfendiyarov Kazakh National Medical University', 3, 1500, 1, 1, 4800, 'September', 'Kairat Almaty', '77334455')
        `);
      }
    });

    // Seed Agents if empty
    db.get('SELECT COUNT(*) AS c FROM agents', [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.run(`INSERT INTO agents (agent_code, firm_name, contact_person, countries_json, commission_rate, agreement_details, bank_name, bank_account, swift_code) VALUES 
          ('AG-001', 'Global Admissions Group', 'Rogerio da Silva', '["Russia", "Philippines"]', 10.0, 'Standard 10% commission on tuition', 'BNU Timor', '123-456-789', 'BNUTL22'),
          ('AG-002', 'Timor Student Placements', 'Manuel Pinto', '["Kazakhstan"]', 8.5, 'Standard 8.5% commission on tuition', 'ANZ Bank', '987-654-321', 'ANZTL22')
        `);
      }
    });

    // Seed Students if empty
    db.get('SELECT COUNT(*) AS c FROM students', [], (err, row) => {
      if (!err && row && row.c === 0) {
        const studentsSeed = [
          ['SCH-101', 'ENR-2024-001', 'ROLL-001', 'Juan Silva', 'MBBS', 'Medicine', '2024-2030', 'General', 'General', 'Christian', '2024-03-10', 'active', 15000],
          ['SCH-102', 'ENR-2024-002', 'ROLL-002', 'Maria Santos', 'MBBS', 'Surgery', '2024-2030', 'OBC', 'General', 'Christian', '2024-03-12', 'active', 0],
          ['SCH-103', 'ENR-2024-003', 'ROLL-003', 'Antonio Guterres', 'MBBS', 'Medicine', '2024-2030', 'General', 'General', 'Christian', '2024-03-15', 'active', 25000],
          ['SCH-104', 'ENR-2024-004', 'ROLL-004', 'Filomena Belo', 'BDS', 'Surgery', '2024-2030', 'General', 'General', 'Christian', '2024-03-18', 'active', 5000],
          ['SCH-105', 'ENR-2024-005', 'ROLL-005', 'Jose Ramos', 'BAMS', 'Paediatrics', '2024-2030', 'ST', 'General', 'Christian', '2024-03-20', 'active', 0],
          ['SCH-106', 'ENR-2023-010', 'ROLL-010', 'Lucia Lobato', 'MBBS', 'Medicine', '2023-2029', 'General', 'General', 'Christian', '2023-03-10', 'active', 12000],
          ['SCH-107', 'ENR-2023-011', 'ROLL-011', 'Armando da Silva', 'BDS', 'Gynaecology', '2023-2029', 'OBC', 'General', 'Christian', '2023-03-14', 'active', 8000],
          ['SCH-108', 'ENR-2022-020', 'ROLL-020', 'Beatriz Araujo', 'BAMS', 'Medicine', '2022-2028', 'General', 'General', 'Christian', '2022-03-05', 'active', 0],
        ];
        const stmt = db.prepare(`INSERT INTO students (scholar_no, enroll_no, roll_no, name, course, branch, batch, category, caste, religion, admission_date, status, due_fee, json_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        studentsSeed.forEach(s => {
          const detail = JSON.stringify({ scholarNo: s[0], enrollmentNo: s[1], rollNo: s[2], name: s[3], course: s[4], branchName: s[5], batch: s[6], category: s[7], caste: s[8], religion: s[9], admissionDate: s[10], status: s[11], dueFee: s[12] });
          stmt.run([...s, detail]);
        });
        stmt.finalize();
        console.log('Sample students seeded.');
      }
    });

    // Seed Employees if empty
    db.get('SELECT COUNT(*) AS c FROM employees', [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.run(`INSERT INTO employees (name, department, salary, pay_status, email, phone, attendance_status, json_details) VALUES 
          ('Dr. Domingos Soares', 'Academics - Anatomy', 120000, 'Paid', 'domingos@uct.edu.tl', '77112233', 'Present', '{}'),
          ('Prof. Elisa Almeida', 'Academics - Physiology', 140000, 'Paid', 'elisa@uct.edu.tl', '77223344', 'Present', '{}'),
          ('Dr. Francisco Guterres', 'Academics - Biochemistry', 115000, 'Unpaid', 'francisco@uct.edu.tl', '77334455', 'Absent', '{}'),
          ('Ana Paula', 'HR', 60000, 'Paid', 'anapaula@uct.edu.tl', '77445566', 'Present', '{}'),
          ('Carlos de Jesus', 'Accounts', 75000, 'Unpaid', 'carlos@uct.edu.tl', '77556677', 'Present', '{}'),
          ('Rosa Maria', 'Admin', 50000, 'Paid', 'rosa@uct.edu.tl', '77667788', 'Present', '{}')
        `);
      }
    });

    // Seed Fee Transactions if empty
    db.get('SELECT COUNT(*) AS c FROM fee_transactions', [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.run(`INSERT INTO fee_transactions (student_id, receipt_no, amount, payment_mode, date, head_wise_details) VALUES 
          (1, 'REC-2026-001', 45000, 'Online', '2026-06-18', '{"Tution Fee": 40000, "Registration": 5000}'),
          (2, 'REC-2026-002', 50000, 'Cash', '2026-06-19', '{"Tution Fee": 50000}'),
          (4, 'REC-2026-003', 30000, 'Online', '2026-06-20', '{"Tution Fee": 30000}'),
          (5, 'REC-2026-004', 55000, 'Cheque', '2026-06-21', '{"Tution Fee": 50000, "Library": 5000}'),
          (7, 'REC-2026-005', 20000, 'DD', '2026-06-22', '{"Tution Fee": 20000}')
        `);
      }
    });

    // Seed Enquiries if empty
    db.get('SELECT COUNT(*) AS c FROM enquiries', [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.run(`INSERT INTO enquiries (name, phone, session, status, done_followup, pending_followup, json_details) VALUES 
          ('Adelio Pinto', '77889900', '2024-25', 'pending', 'Called candidate, interested in MBBS.', 'Follow up on document verification.', '{}'),
          ('Beatriz da Costa', '77990011', '2024-25', 'admitted', 'Documents verified and fee received.', 'N/A', '{}'),
          ('Cecilia Lopez', '77119922', '2024-25', 'pending', 'SMS sent, waiting for reply.', 'Call back next Monday.', '{}'),
          ('Daniel Borges', '77229933', '2024-25', 'rejected', 'Candidate chose domestic options.', 'N/A', '{}')
        `);
      }
    });

    // Seed Visa Tracking if empty
    db.get('SELECT COUNT(*) AS c FROM visa_tracking', [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.run(`INSERT INTO visa_tracking (student_id, passport_no, passport_expiry, visa_no, visa_expiry, status) VALUES 
          (1, 'TL-000123', '2030-05-15', 'V-102030', '2027-02-28', 'Active Visa'),
          (3, 'TL-000456', '2029-08-20', 'V-204060', '2026-07-15', 'Renewal Due'),
          (6, 'TL-000789', '2025-12-01', 'V-306090', '2025-06-01', 'Expired'),
          (8, 'TL-000999', '2031-10-10', '', '', 'Pending Apply')
        `);
      }
    });

    // Seed Forex Remittances if empty
    db.get('SELECT COUNT(*) AS c FROM forex_remittances', [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.run(`INSERT INTO forex_remittances (student_id, university_id, currency, amount, exchange_rate, inr_equivalent, swift_no, rbi_purpose_code, status) VALUES 
          (1, 1, 'USD', 3000, 83.5, 250500, 'SWIFT123', 'S0103', 'Sent'),
          (2, 2, 'USD', 2500, 83.5, 208750, 'SWIFT456', 'S0103', 'Pending'),
          (4, 3, 'USD', 4000, 83.5, 334000, 'SWIFT789', 'S0103', 'Sent')
        `);
      }
    });

    // Seed Student Attendance Log if empty
    db.get("SELECT COUNT(*) AS c FROM generic_store WHERE module_key = 'student-attendance' AND record_id = 'records'", [], (err, row) => {
      if (!err && row && row.c === 0) {
        const recordsData = [
          {
            "id": "1782192000000",
            "date": new Date().toISOString().split('T')[0],
            "course": "MBBS",
            "branch": "Medicine",
            "batch": "2024-2030",
            "subject": "Anatomy",
            "records": [
              { "id": 1, "name": "Juan Silva", "mobile": "—", "father": "—", "category": "General", "status": "P" },
              { "id": 2, "name": "Maria Santos", "mobile": "—", "father": "—", "category": "OBC", "status": "A" },
              { "id": 3, "name": "Antonio Guterres", "mobile": "—", "father": "—", "category": "General", "status": "P" }
            ]
          }
        ];
        db.run(`INSERT INTO generic_store (module_key, record_id, json_data) VALUES (?, ?, ?)`,
          ['student-attendance', 'records', JSON.stringify(recordsData)]
        );
      }
    });

    console.log('Database initialized.');
  });
}

module.exports = {
  db,
  initDB
};
