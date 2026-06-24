import React from 'react';
import './Dashboard.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;
const FormField = ({ label, children }) => (
  <div className="form-field">
    <label className="form-label">{label}</label>
    {children}
  </div>
);
const Select = ({ children, ...p }) => <select className="form-input" {...p}>{children}</select>;

export default function BirthdayDashboard() {
  return (
    <div className="hr-form">
      <SectionTitle title="Birthday Filter" />
      <div className="form-grid">
        <FormField label="Month">
          <Select defaultValue="">
            <option value="">-- Select Month --</option>
            {['January','February','March','April','May','June',
              'July','August','September','October','November','December']
              .map((m) => <option key={m}>{m}</option>)}
          </Select>
        </FormField>
        <FormField label="Department">
          <Select defaultValue="">
            <option value="">-- All Departments --</option>
            <option>HR</option>
            <option>Academics</option>
            <option>Accounts</option>
            <option>Admin</option>
            <option>Students</option>
          </Select>
        </FormField>
        <FormField label="Category">
          <Select defaultValue="">
            <option value="">-- All Categories --</option>
            <option>Employee</option>
            <option>Student</option>
            <option>Faculty</option>
          </Select>
        </FormField>
      </div>
      <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="submit-btn" onClick={() => alert("Action")}>Search</button>
        <button type="button" className="submit-btn" style={{ background: '#6b7280' }} onClick={() => alert("Action")}>Reset</button>
      </div>
    </div>
  );
}
