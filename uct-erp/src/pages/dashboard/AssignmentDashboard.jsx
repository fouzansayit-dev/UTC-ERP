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

export default function AssignmentDashboard() {
  const handleSubmit = (e) => { e.preventDefault(); alert('Assignment saved!'); };
  return (
    <form className="hr-form" onSubmit={handleSubmit}>
      <SectionTitle title="Assignment Details" />
      <div className="form-grid">
        <FormField label="Course" required>
          <Select defaultValue="">
            <option value="">-- Select Course --</option>
            <option>MBBS</option>
            <option>MD</option>
            <option>MS</option>
            <option>BDS</option>
            <option>BAMS</option>
            <option>BHMS</option>
          </Select>
        </FormField>
        <FormField label="Subject" required>
          <Select defaultValue="">
            <option value="">-- Select Subject --</option>
            <option>Anatomy</option>
            <option>Physiology</option>
            <option>Biochemistry</option>
            <option>Pathology</option>
            <option>Pharmacology</option>
            <option>Microbiology</option>
            <option>Forensic Medicine</option>
            <option>Community Medicine</option>
          </Select>
        </FormField>
        <FormField label="Faculty" required>
          <Select defaultValue="">
            <option value="">-- Select Faculty --</option>
            <option>Faculty 1</option>
            <option>Faculty 2</option>
            <option>Faculty 3</option>
          </Select>
        </FormField>
        <FormField label="Assignment Title" required>
          <Input placeholder="Enter assignment title" />
        </FormField>
        <FormField label="Due Date" required>
          <Input type="date" />
        </FormField>
        <FormField label="Description">
          <Textarea placeholder="Enter assignment instructions or description..." rows={4} />
        </FormField>
        <FormField label="Attachment">
          <Input type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
        </FormField>
      </div>
      <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="submit-btn">Save Assignment</button>
        <button type="reset" className="submit-btn" style={{ background: '#6b7280' }} onClick={() => {}}>Reset</button>
      </div>
    </form>
  );
}
