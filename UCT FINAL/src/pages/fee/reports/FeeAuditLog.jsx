import React, { useState } from 'react';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
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
    gap: '15px',
    flexWrap: 'wrap',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: '600',
    fontSize: '13px',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minWidth: '150px',
    fontSize: '13px',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    color: '#333',
    fontSize: '13px',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '12px',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
};

export default function FeeAuditLog() {
  const [filters, setFilters] = useState({
    studentId: '',
    transactionType: 'All',
    module: 'All',
    fromDate: '',
    toDate: '',
  });

  const [auditLogs] = useState([]);

  const handleExportCSV = () => {
    alert('Exporting audit log as CSV...');
  };

  const handleViewDetails = (log) => {
    alert(`
Audit Log Details:
ID: ${log.id}
User: ${log.user}
Student: ${log.studentName} (${log.studentId})
Module: ${log.module}
Action: ${log.action}
Transaction Type: ${log.transactionType}
Amount: ₹${log.amount}
Details: ${log.details}
IP Address: ${log.ipAddress}
Status: ${log.status}
Timestamp: ${log.timestamp}
    `);
  };

  const getActionBadge = (action) => {
    const colors = {
      CREATE: { bg: '#d4edda', color: '#155724' },
      UPDATE: { bg: '#cce5ff', color: '#004085' },
      DELETE: { bg: '#f8d7da', color: '#721c24' },
      READ: { bg: '#e2e3e5', color: '#383d41' },
    };
    const style = colors[action] || colors.READ;
    return (
      <span
        style={{
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          backgroundColor: style.bg,
          color: style.color,
        }}
      >
        {action}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <span
        style={{
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          backgroundColor: status === 'Success' ? '#d4edda' : '#fff3cd',
          color: status === 'Success' ? '#155724' : '#856404',
        }}
      >
        {status}
      </span>
    );
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (filters.studentId && !log.studentId.toLowerCase().includes(filters.studentId.toLowerCase())) {
      return false;
    }
    if (filters.transactionType !== 'All' && log.transactionType !== filters.transactionType) {
      return false;
    }
    if (filters.module !== 'All' && log.module !== filters.module) {
      return false;
    }
    return true;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Fee Audit Log</div>
        <div style={styles.subtitle}>Complete transaction history and audit trail for compliance and investigation</div>
      </div>

      <div style={styles.filterContainer}>
        <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '16px' }}>Filters</h3>
        <div style={styles.filterRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Student ID</label>
            <input
              type="text"
              value={filters.studentId}
              onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
              placeholder="Filter by student ID"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Transaction Type</label>
            <select
              value={filters.transactionType}
              onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
              style={styles.input}
            >
              <option>All</option>
              <option>Fee Collected</option>
              <option>Discount Applied</option>
              <option>Refund Initiated</option>
              <option>Payment Received</option>
              <option>Credit Note Generated</option>
              <option>Report Generated</option>
              <option>Receipt Reversed</option>
              <option>Payment Status Updated</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Module</label>
            <select
              value={filters.module}
              onChange={(e) => setFilters({ ...filters, module: e.target.value })}
              style={styles.input}
            >
              <option>All</option>
              <option>Fee Receipt</option>
              <option>Fee Discount</option>
              <option>Fee Refund</option>
              <option>Fee Collection</option>
              <option>Credit Note</option>
              <option>Fee Summary</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>&nbsp;</label>
            <button onClick={handleExportCSV} style={styles.button}>
              📥 Export CSV
            </button>
          </div>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Module</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Transaction Type</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>IP Address</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td style={styles.td}>{log.timestamp}</td>
                <td style={styles.td}>{log.user}</td>
                <td style={styles.td}>
                  {log.studentId} - {log.studentName}
                </td>
                <td style={styles.td}>{log.module}</td>
                <td style={styles.td}>{getActionBadge(log.action)}</td>
                <td style={styles.td}>{log.transactionType}</td>
                <td style={styles.td}>
                  <span style={{ color: log.amount < 0 ? '#28a745' : log.amount > 0 ? '#dc3545' : '#666' }}>
                    ₹{log.amount}
                  </span>
                </td>
                <td style={styles.td}>{getStatusBadge(log.status)}</td>
                <td style={styles.td}>{log.ipAddress}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleViewDetails(log)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
        <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
          <strong>Total Records:</strong> {filteredLogs.length} | <strong>Last Updated:</strong> {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
