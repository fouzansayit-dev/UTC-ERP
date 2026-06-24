import React from 'react';
import './Dashboard.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;
const FormField = ({ label, required, children }) => (
  <div className="form-field">
    <label className="form-label">{label}{required && <span className="req"> *</span>}</label>
    {children}
  </div>
);
const Input    = (props)              => <input    className="form-input" {...props} />;
const Select   = ({ children, ...p }) => <select   className="form-input" {...p}>{children}</select>;
const Textarea = (props)              => <textarea className="form-input form-textarea" {...props} />;

export default function CircularDashboard() {
  const handleSubmit = (e) => { e.preventDefault(); alert('Circular saved!'); };
  return (
    <form className="hr-form" onSubmit={handleSubmit}>
      <SectionTitle title="Circular Details" />
      <div className="form-grid">
        <FormField label="Circular Title" required>
          <Input placeholder="Enter circular title" />
        </FormField>
        <FormField label="Department" required>
          <Select defaultValue="">
            <option value="">-- Select Department --</option>
            <option>All Departments</option>
            <option>HR</option>
            <option>Academics</option>
            <option>Accounts</option>
            <option>Admin</option>
            <option>Library</option>
            <option>Hostel</option>
            <option>Transport</option>
          </Select>
        </FormField>
        <FormField label="Category" required>
          <Select defaultValue="">
            <option value="">-- Select Category --</option>
            <option>General</option>
            <option>Academic</option>
            <option>Administrative</option>
            <option>Finance</option>
            <option>Exam</option>
            <option>Holiday</option>
          </Select>
        </FormField>
        <FormField label="Publish Date" required>
          <Input type="date" />
        </FormField>
        <FormField label="Description">
          <Textarea placeholder="Enter circular description..." rows={4} />
        </FormField>
        <FormField label="Attachment">
          <Input type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
        </FormField>
      </div>
      <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="submit-btn">Publish Circular</button>
        <button type="reset" className="submit-btn" style={{ background: '#6b7280' }} onClick={() => {}}>Reset</button>
      </div>
    </form>
  );
}
