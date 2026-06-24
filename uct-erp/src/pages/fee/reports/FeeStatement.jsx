import { handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  filterRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: '600',
    fontSize: '14px',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minWidth: '200px',
  },
  button: {
    padding: '10px 20px',
    marginTop: '23px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  statementContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  header: {
    borderBottom: '2px solid #333',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  schoolName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '12px',
    color: '#666',
  },
  studentInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #ddd',
  },
  infoGroup: {
    fontSize: '14px',
  },
  infoLabel: {
    fontWeight: '600',
    marginBottom: '3px',
  },
  infoValue: {
    color: '#666',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    fontSize: '13px',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '13px',
  },
  totalRow: {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
  },
  actionContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  actionButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default function FeeStatement() {
  const [filters, setFilters] = useState({
    studentId: '',
    studentName: '',
    sessionYear: '2025-2026',
    fromDate: '',
    toDate: '',
  });

  const [searchResults, setSearchResults] = useState(null);

  const studentDatabase = [
    {
      id: 'STU001',
      name: 'Raj Kumar',
      email: 'raj.kumar@email.com',
      batch: 2025,
      program: 'B.Tech - Computer Science',
    },
    {
      id: 'STU002',
      name: 'Priya Singh',
      email: 'priya.singh@email.com',
      batch: 2024,
      program: 'B.Tech - Information Technology',
    },
    {
      id: 'STU005',
      name: 'Aditya Mehta',
      email: 'aditya.mehta@email.com',
      batch: 2025,
      program: 'B.Tech - Electronics',
    },
  ];

  const feeTransactions = {
    STU001: [
      { date: '2026-01-15', description: 'Tuition Fee - Sem 1', amount: 100000, type: 'Fee', balance: 100000 },
      { date: '2026-01-20', description: 'Hostel Fee - Jan', amount: 12000, type: 'Fee', balance: 112000 },
      { date: '2026-02-10', description: 'Exam Fee', amount: 1000, type: 'Fee', balance: 113000 },
      { date: '2026-02-15', description: 'Payment Received', amount: -50000, type: 'Payment', balance: 63000 },
      { date: '2026-02-20', description: 'Hostel Fee - Feb', amount: 12000, type: 'Fee', balance: 75000 },
      { date: '2026-03-10', description: 'Payment Received', amount: -40000, type: 'Payment', balance: 35000 },
    ],
    STU002: [
      { date: '2026-01-15', description: 'Tuition Fee - Sem 1', amount: 100000, type: 'Fee', balance: 100000 },
      { date: '2026-02-10', description: 'Payment Received', amount: -100000, type: 'Payment', balance: 0 },
      { date: '2026-02-15', description: 'Hostel Fee - Feb', amount: 12000, type: 'Fee', balance: 12000 },
      { date: '2026-03-05', description: 'Payment Received', amount: -12000, type: 'Payment', balance: 0 },
    ],
    STU005: [
      { date: '2026-01-15', description: 'Tuition Fee - Sem 1', amount: 100000, type: 'Fee', balance: 100000 },
      { date: '2026-01-25', description: 'Fee Discount - Scholarship', amount: -10000, type: 'Adjustment', balance: 90000 },
      { date: '2026-02-15', description: 'Payment Received', amount: -90000, type: 'Payment', balance: 0 },
    ],
  };

  const handleSearch = () => {
    const student = studentDatabase.find(
      (s) => s.id === filters.studentId || s.name.toLowerCase().includes(filters.studentName.toLowerCase())
    );

    if (student) {
      setSearchResults({
        student,
        transactions: feeTransactions[student.id] || [],
        generatedDate: new Date().toLocaleDateString(),
      });
    } else {
      alert('Student not found');
      setSearchResults(null);
    }
  };

  const handlePrint = () => {
    handlePrint('Fee Statement');
  };

  const handleDownloadPDF = () => {
    alert('Downloading Fee Statement as PDF...');
  };

  const handleEmail = () => {
    alert(`Sending fee statement to ${searchResults.student.email}`);
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#333', marginBottom: '5px' }}>Fee Statement / Invoice</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Generate and view student fee statements and invoices</p>
      </div>

      <div style={styles.filterContainer}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Search Student</h3>
        <div style={styles.filterRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Student ID</label>
            <input
              type="text"
              value={filters.studentId}
              onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
              placeholder="Enter student ID"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>OR Student Name</label>
            <input
              type="text"
              value={filters.studentName}
              onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
              placeholder="Enter student name"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Session Year</label>
            <select
              value={filters.sessionYear}
              onChange={(e) => setFilters({ ...filters, sessionYear: e.target.value })}
              style={styles.input}
            >
              <option>2024-2025</option>
              <option>2025-2026</option>
              <option>2026-2027</option>
            </select>
          </div>
          <button onClick={handleSearch} style={styles.button}>
            Search & Generate
          </button>
        </div>
      </div>

      {searchResults && (
        <>
          <div style={styles.statementContainer}>
            <div style={styles.header}>
              <div style={styles.schoolName}>NEXUS COLLEGE</div>
              <div style={styles.subtitle}>An Educational Institution for Excellence</div>
              <div style={styles.subtitle}>Fee Statement / Invoice</div>
            </div>

            <div style={styles.studentInfo}>
              <div>
                <div style={styles.infoGroup}>
                  <div style={styles.infoLabel}>Student ID:</div>
                  <div style={styles.infoValue}>{searchResults.student.id}</div>
                </div>
                <div style={styles.infoGroup}>
                  <div style={styles.infoLabel}>Name:</div>
                  <div style={styles.infoValue}>{searchResults.student.name}</div>
                </div>
                <div style={styles.infoGroup}>
                  <div style={styles.infoLabel}>Email:</div>
                  <div style={styles.infoValue}>{searchResults.student.email}</div>
                </div>
              </div>
              <div>
                <div style={styles.infoGroup}>
                  <div style={styles.infoLabel}>Batch:</div>
                  <div style={styles.infoValue}>{searchResults.student.batch}</div>
                </div>
                <div style={styles.infoGroup}>
                  <div style={styles.infoLabel}>Program:</div>
                  <div style={styles.infoValue}>{searchResults.student.program}</div>
                </div>
                <div style={styles.infoGroup}>
                  <div style={styles.infoLabel}>Generated On:</div>
                  <div style={styles.infoValue}>{searchResults.generatedDate}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '15px', color: '#333' }}>Fee Transaction Details</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.transactions.map((trans, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>{trans.date}</td>
                      <td style={styles.td}>{trans.description}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            backgroundColor:
                              trans.type === 'Fee'
                                ? '#fff3cd'
                                : trans.type === 'Payment'
                                ? '#d4edda'
                                : '#e7d4f5',
                            color:
                              trans.type === 'Fee'
                                ? '#856404'
                                : trans.type === 'Payment'
                                ? '#155724'
                                : '#5a4e8f',
                          }}
                        >
                          {trans.type}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: trans.type === 'Payment' || trans.type === 'Adjustment' ? '#28a745' : '#dc3545' }}>
                          {trans.type === 'Payment' || trans.type === 'Adjustment' ? '(' : ''}₹{Math.abs(trans.amount)}
                          {trans.type === 'Payment' || trans.type === 'Adjustment' ? ')' : ''}
                        </span>
                      </td>
                      <td style={styles.td}>₹{trans.balance}</td>
                    </tr>
                  ))}
                  <tr style={styles.totalRow}>
                    <td colSpan="3" style={styles.td}>
                      TOTAL OUTSTANDING BALANCE
                    </td>
                    <td style={styles.td}></td>
                    <td style={styles.td}>₹{searchResults.transactions[searchResults.transactions.length - 1]?.balance || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                <strong>Note:</strong> This is an auto-generated fee statement. For any discrepancies, please contact the Finance Office.
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                Due date for payment: Within 7 days from the issue of this statement. Late payment may attract penalty as per institutional policy.
              </p>
            </div>

            <div style={styles.actionContainer}>
              <button onClick={handlePrint} style={{ ...styles.actionButton, backgroundColor: '#17a2b8' }}>
                🖨 Print
              </button>
              <button onClick={handleDownloadPDF} style={{ ...styles.actionButton, backgroundColor: '#007bff' }}>
                📥 Download PDF
              </button>
              <button onClick={handleEmail} style={{ ...styles.actionButton, backgroundColor: '#6c757d' }}>
                ✉ Email to Student
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
