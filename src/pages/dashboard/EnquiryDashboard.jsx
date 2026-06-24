import React from 'react';
import './Dashboard.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;
const FormField = ({ label, children }) => (
  <div className="form-field">
    <label className="form-label">{label}</label>
    {children}
  </div>
);
const Input  = (props)              => <input  className="form-input" {...props} />;
const Select = ({ children, ...p }) => <select className="form-input" {...p}>{children}</select>;

export default function EnquiryDashboard() {
  const handleSubmit = (e) => { e.preventDefault(); };
  return (
    <form className="hr-form" onSubmit={handleSubmit}>
      <SectionTitle title="Enquiry Report Filters" />
      <div className="form-grid">
        <FormField label="From Date">
          <Input type="date" />
        </FormField>
        <FormField label="To Date">
          <Input type="date" />
        </FormField>
        <FormField label="Course">
          <Select defaultValue="">
            <option value="">-- All Courses --</option>
            <option>MBBS - Domestic</option>
            <option>MBBS - Abroad</option>
            <option>MD</option>
            <option>BDS</option>
            <option>BAMS</option>
            <option>BHMS</option>
          </Select>
        </FormField>
        <FormField label="Program Type">
          <Select defaultValue="">
            <option value="">-- All Types --</option>
            <option>Domestic</option>
            <option>Abroad</option>
          </Select>
        </FormField>
        <FormField label="Source">
          <Select defaultValue="">
            <option value="">-- All Sources --</option>
            <option>Walk-in</option>
            <option>Phone</option>
            <option>Website</option>
            <option>Agent Referral</option>
            <option>Education Camp</option>
            <option>Social Media</option>
          </Select>
        </FormField>
        <FormField label="Counselor">
          <Select defaultValue="">
            <option value="">-- All Counselors --</option>
            <option>Counselor 1</option>
            <option>Counselor 2</option>
            <option>Counselor 3</option>
          </Select>
        </FormField>
      </div>
      <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="submit-btn">Generate Report</button>
        <button type="reset" className="submit-btn" style={{ background: '#6b7280' }} onClick={() => {}}>Reset</button>
      </div>
    </form>
  );
}
