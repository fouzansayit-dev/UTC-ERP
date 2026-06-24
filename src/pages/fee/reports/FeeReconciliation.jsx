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
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
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
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #dee2e6',
  },
  statusBadge: (status) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: status === 'Matched' ? '#d4edda' : status === 'Mismatch' ? '#fff3cd' : '#f8d7da',
    color: status === 'Matched' ? '#155724' : status === 'Mismatch' ? '#856404' : '#721c24',
  }),
};

export default function FeeReconciliation() {
  const [reconciliationData] = useState([]);

  const [monthlyTrend] = useState([]);

  const totalExpected = reconciliationData.reduce((sum, r) => sum + r.expectedAmount, 0);
  const totalCollected = reconciliationData.reduce((sum, r) => sum + r.collectedAmount, 0);
  const totalDifference = totalCollected - totalExpected;
  const collectionRate = ((totalCollected / totalExpected) * 100).toFixed(2);

  const handleReconcile = (id) => {
    alert(`Reconciling record ${id}...`);
  };

  const handleGenerateReport = () => {
    alert('Generating reconciliation report...');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Fee Reconciliation</div>
        <p style={{ color: '#666', fontSize: '14px' }}>Match expected fee collection with actual receipts</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #007bff' }}>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '10px' }}>TOTAL EXPECTED</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>₹{(totalExpected / 1000000).toFixed(1)}M</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #28a745' }}>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '10px' }}>TOTAL COLLECTED</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>₹{(totalCollected / 1000000).toFixed(1)}M</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #dc3545' }}>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '10px' }}>VARIANCE</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: totalDifference < 0 ? '#dc3545' : '#28a745' }}>₹{(totalDifference / 100000).toFixed(1)}L</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #ffc107' }}>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '10px' }}>COLLECTION RATE</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107' }}>{collectionRate}%</div>
        </div>
      </div>

      {/* Reconciliation Details */}
      <div style={styles.tableContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#333' }}>Fee Head Reconciliation</h3>
          <button
            onClick={handleGenerateReport}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Generate Report
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Fee Head</th>
              <th style={styles.th}>Student Count</th>
              <th style={styles.th}>Expected</th>
              <th style={styles.th}>Collected</th>
              <th style={styles.th}>Difference</th>
              <th style={styles.th}>% Collected</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Remarks</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reconciliationData.map((row) => {
              const percentage = ((row.collectedAmount / row.expectedAmount) * 100).toFixed(2);
              return (
                <tr key={row.id}>
                  <td style={styles.td}>{row.feeHead}</td>
                  <td style={styles.td}>{row.studentCount}</td>
                  <td style={styles.td}>₹{(row.expectedAmount / 100000).toFixed(1)}L</td>
                  <td style={styles.td}>₹{(row.collectedAmount / 100000).toFixed(1)}L</td>
                  <td style={{ ...styles.td, color: row.difference < 0 ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
                    ₹{(row.difference / 100000).toFixed(1)}L
                  </td>
                  <td style={styles.td}>{percentage}%</td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(row.status)}>{row.status}</span>
                  </td>
                  <td style={styles.td}>{row.remarks}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleReconcile(row.id)}
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Monthly Trend */}
      <div style={styles.tableContainer}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>Monthly Reconciliation Trend</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Month</th>
              <th style={styles.th}>Expected Collection</th>
              <th style={styles.th}>Actual Collection</th>
              <th style={styles.th}>Variance %</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {monthlyTrend.map((row, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{row.month}</td>
                <td style={styles.td}>₹{(row.expected / 1000000).toFixed(1)}M</td>
                <td style={styles.td}>₹{(row.collected / 1000000).toFixed(1)}M</td>
                <td style={{ ...styles.td, color: row.variance < 0 ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
                  {row.variance}%
                </td>
                <td style={styles.td}>
                  <span style={styles.statusBadge(row.variance > -2 ? 'Matched' : 'Mismatch')}>
                    {row.variance > -2 ? 'Good' : 'Review'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
