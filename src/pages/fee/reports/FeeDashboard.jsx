import React, { useState } from 'react';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  kpiCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderLeft: '4px solid',
  },
  kpiLabel: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
    fontWeight: '600',
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  kpiChange: {
    fontSize: '12px',
    marginBottom: '10px',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
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
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
  },
};

export default function FeeDashboard() {
  const [filters, setFilters] = useState({
    month: 'March',
    year: '2026',
    batch: 'All',
  });

  // KPI Data
  const kpis = [
    {
      label: 'Total Fee Collected',
      value: '₹45,65,000',
      change: '+8.5%',
      positive: true,
      color: '#28a745',
    },
    {
      label: 'Pending Fees',
      value: '₹12,34,000',
      change: '-2.3%',
      positive: false,
      color: '#dc3545',
    },
    {
      label: 'Collection Rate',
      value: '78.7%',
      change: '+5.2%',
      positive: true,
      color: '#007bff',
    },
    {
      label: 'Refunds Processed',
      value: '₹3,45,000',
      change: '+12.1%',
      positive: true,
      color: '#17a2b8',
    },
    {
      label: 'Overdue Fees',
      value: '₹8,90,000',
      change: '+3.4%',
      positive: false,
      color: '#ffc107',
    },
    {
      label: 'Average Fee/Student',
      value: '₹1,12,500',
      change: '0%',
      positive: true,
      color: '#6f42c1',
    },
  ];

  // Collection by Fee Head
  const collectionByHead = [
    { head: 'Tuition Fee', collected: 28000000, pending: 5000000, percentage: 84.8 },
    { head: 'Hostel Fee', collected: 8000000, pending: 2000000, percentage: 80.0 },
    { head: 'Exam Fee', collected: 4500000, pending: 1000000, percentage: 81.8 },
    { head: 'Miscellaneous', collected: 3150000, pending: 2340000, percentage: 57.4 },
    { head: 'Caution Deposit', collected: 2000000, pending: 2000000, percentage: 50.0 },
  ];

  // Pending Student Details
  const pendingStudents = [
    {
      id: 1,
      studentId: 'STU001',
      name: 'Raj Kumar',
      batch: '2025',
      pendingAmount: 125000,
      overdueDays: 15,
      status: 'Overdue',
    },
    {
      id: 2,
      studentId: 'STU002',
      name: 'Priya Singh',
      batch: '2024',
      pendingAmount: 280000,
      overdueDays: 45,
      status: 'Overdue',
    },
    {
      id: 3,
      studentId: 'STU005',
      name: 'Aditya Mehta',
      batch: '2025',
      pendingAmount: 56000,
      overdueDays: 5,
      status: 'Due Soon',
    },
    {
      id: 4,
      studentId: 'STU008',
      name: 'Ananya Patel',
      batch: '2026',
      pendingAmount: 340000,
      overdueDays: 0,
      status: 'Pending',
    },
    {
      id: 5,
      studentId: 'STU012',
      name: 'Vikram Sharma',
      batch: '2024',
      pendingAmount: 450000,
      overdueDays: 60,
      status: 'Critical',
    },
  ];

  // Monthly Trend
  const monthlyTrend = [
    { month: 'January', collected: 42000000, pending: 8000000 },
    { month: 'February', collected: 43200000, pending: 10500000 },
    { month: 'March', collected: 45650000, pending: 12340000 },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Fee Dashboard</div>
        <div style={styles.subtitle}>Track fee collection, pending amounts, and KPI metrics</div>
      </div>

      {/* Filters */}
      <div style={{ ...styles.chartContainer, marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Month:</label>
            <select
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '150px' }}
            >
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Year:</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '150px' }}
            >
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Batch:</label>
            <select
              value={filters.batch}
              onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '150px' }}
            >
              <option>All</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={styles.gridContainer}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ ...styles.kpiCard, borderLeftColor: kpi.color }}>
            <div style={styles.kpiLabel}>{kpi.label}</div>
            <div style={{ ...styles.kpiValue, color: kpi.color }}>{kpi.value}</div>
            <div style={{ ...styles.kpiChange, color: kpi.positive ? '#28a745' : '#dc3545' }}>
              {kpi.change} from last month
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>Last updated: Today</div>
          </div>
        ))}
      </div>

      {/* Collection by Fee Head */}
      <div style={styles.chartContainer}>
        <div style={styles.chartTitle}>Collection by Fee Head</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Fee Head</th>
              <th style={styles.th}>Collected</th>
              <th style={styles.th}>Pending</th>
              <th style={styles.th}>Collection %</th>
              <th style={styles.th}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {collectionByHead.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{item.head}</td>
                <td style={styles.td}>₹{(item.collected / 1000000).toFixed(1)}M</td>
                <td style={styles.td}>₹{(item.pending / 1000000).toFixed(1)}M</td>
                <td style={styles.td}>
                  <strong>{item.percentage}%</strong>
                </td>
                <td style={styles.td}>
                  <div style={{ backgroundColor: '#e9ecef', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
                    <div
                      style={{
                        backgroundColor: item.percentage > 80 ? '#28a745' : item.percentage > 60 ? '#ffc107' : '#dc3545',
                        height: '100%',
                        width: `${item.percentage}%`,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Trend */}
      <div style={styles.chartContainer}>
        <div style={styles.chartTitle}>Monthly Trend</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Month</th>
              <th style={styles.th}>Collected</th>
              <th style={styles.th}>Pending</th>
              <th style={styles.th}>Total Fee</th>
            </tr>
          </thead>
          <tbody>
            {monthlyTrend.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{item.month}</td>
                <td style={styles.td}>₹{(item.collected / 1000000).toFixed(1)}M</td>
                <td style={styles.td}>₹{(item.pending / 1000000).toFixed(1)}M</td>
                <td style={styles.td}>₹{((item.collected + item.pending) / 1000000).toFixed(1)}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Students */}
      <div style={styles.tableContainer}>
        <div style={styles.chartTitle}>Pending Fees by Student</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Batch</th>
              <th style={styles.th}>Pending Amount</th>
              <th style={styles.th}>Overdue (Days)</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingStudents.map((student) => (
              <tr key={student.id}>
                <td style={styles.td}>{student.studentId}</td>
                <td style={styles.td}>{student.name}</td>
                <td style={styles.td}>{student.batch}</td>
                <td style={styles.td}>₹{(student.pendingAmount / 100000).toFixed(1)}L</td>
                <td style={styles.td}>{student.overdueDays}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor:
                        student.status === 'Critical'
                          ? '#f8d7da'
                          : student.status === 'Overdue'
                          ? '#fff3cd'
                          : student.status === 'Due Soon'
                          ? '#cce5ff'
                          : '#d4edda',
                      color:
                        student.status === 'Critical'
                          ? '#721c24'
                          : student.status === 'Overdue'
                          ? '#856404'
                          : student.status === 'Due Soon'
                          ? '#004085'
                          : '#155724',
                    }}
                  >
                    {student.status}
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
