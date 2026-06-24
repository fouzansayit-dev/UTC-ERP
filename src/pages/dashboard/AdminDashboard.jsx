import React from 'react';
import './Dashboard.css';
import DashboardGraphs from './DashboardGraphs';

const SectionTitle = ({ title }) => (
  <div className="section-title">{title}</div>
);

const FormField = ({ label, children }) => (
  <div className="form-field">
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const Input = (props) => <input className="form-input" {...props} />;

const Select = ({ children, ...props }) => (
  <select className="form-input" {...props}>
    {children}
  </select>
);



export default function AdminDashboard() {
  return (
    <div className="hr-form">

      {/* ── OVERVIEW FILTERS ── */}
      <SectionTitle title="Overview Filters" />
      <div className="form-grid">
        <FormField label="Academic Session">
          <Select defaultValue="">
            <option value="">-- Select Session --</option>
            <option>2024-25</option>
            <option>2025-26</option>
            <option>2026-27</option>
          </Select>
        </FormField>

        <FormField label="From Date">
          <Input type="date" />
        </FormField>

        <FormField label="To Date">
          <Input type="date" />
        </FormField>

        <FormField label="Department">
          <Select defaultValue="">
            <option value="">-- All Departments --</option>
            <option>HR</option>
            <option>Academics</option>
            <option>Accounts</option>
            <option>Admin</option>
          </Select>
        </FormField>
      </div>

      <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="submit-btn" onClick={() => alert("Action")}>Apply Filter</button>
        <button
          type="button"
          className="submit-btn"
          style={{ background: '#6b7280' }}
         onClick={() => alert("Action")}>
          Reset
        </button>
      </div>

      

      {/* ── VISA STATUS SUMMARY ── */}
      <SectionTitle title="Visa Status Summary" />
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="hr-table">
          <thead>
            <tr>
              <th>Active Visa</th>
              <th>Renewal Due</th>
              <th>Expired</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="empty-table-msg">
                No visa data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── ABROAD STUDENT STATUS MAP ── */}
      <SectionTitle title="Abroad Student Status Map" />
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '18px',
          marginBottom: 24,
          background: '#fafafa',
          fontSize: 12,
          color: '#9ca3af',
        }}
      >
        Country-wise active abroad student data will appear here.
      </div>

      {/* ── AGENT PERFORMANCE PANEL ── */}
      <SectionTitle title="Agent Performance Panel" />
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="hr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Agent Name</th>
              <th>Agent ID</th>
              <th>Total Referrals</th>
              <th>Converted</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="empty-table-msg">
                No agent data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── FOREX REMITTANCE TRACKER ── */}
      <SectionTitle title="Forex Remittance Tracker" />
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="hr-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Country</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="empty-table-msg">
                No remittance data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── MOBILE APP FEEDBACK SUMMARY ── */}
      <SectionTitle title="Mobile App Feedback Summary" />
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '18px',
          marginBottom: 24,
          background: '#fafafa',
          fontSize: 12,
          color: '#9ca3af',
        }}
      >
        Average rating and unread feedback count will appear here.
      </div>

    </div>
  );
}
