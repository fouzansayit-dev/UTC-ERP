import React from 'react';
import './Dashboard.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;
const FormField = ({ label, required, children }) => (
  <div className="form-field">
    <label className="form-label">{label}{required && <span className="req"> *</span>}</label>
    {children}
  </div>
);
const Input  = (props)              => <input  className="form-input" {...props} />;
const Select = ({ children, ...p }) => <select className="form-input" {...p}>{children}</select>;

export default function RFIDDashboard() {
  const handleSubmit = (e) => { e.preventDefault(); };
  return (
    <form className="hr-form" onSubmit={handleSubmit}>
      <SectionTitle title="RFID Attendance Filter" />
      <div className="form-grid">
        <FormField label="Department">
          <Select defaultValue="">
            <option value="">-- All Departments --</option>
            <option>HR</option>
            <option>Academics</option>
            <option>Accounts</option>
            <option>Admin</option>
          </Select>
        </FormField>
        <FormField label="Device / Location">
          <Select defaultValue="">
            <option value="">-- All Devices --</option>
            <option>Main Gate</option>
            <option>Block A</option>
            <option>Block B</option>
            <option>Admin Block</option>
            <option>Library</option>
          </Select>
        </FormField>
        <FormField label="From Date" required>
          <Input type="date" />
        </FormField>
        <FormField label="To Date" required>
          <Input type="date" />
        </FormField>
      </div>
      <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="submit-btn">Fetch Logs</button>
        <button type="reset" className="submit-btn" style={{ background: '#6b7280' }} onClick={() => {}}>Reset</button>
      </div>
    </form>
  );
}
