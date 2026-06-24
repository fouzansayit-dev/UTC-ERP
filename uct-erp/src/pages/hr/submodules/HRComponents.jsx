import React from 'react';

export const FormField = ({ label, required, children }) => (
  <div className="form-field">
    <label className="form-label">{label}{required && <span className="req"> *</span>}</label>
    {children}
  </div>
);
export const Input    = (props)              => <input    className="form-input"              {...props} />;
export const Select   = ({ children, ...p }) => <select   className="form-input"              {...p}>{children}</select>;
export const Textarea = (props)              => <textarea className="form-input form-textarea" {...props} />;
export const SectionTitle = ({ title })      => <div className="section-title">{title}</div>;
export const SubmitBtn = ({ label = 'Submit' }) => (
  <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
    <button type="submit" className="submit-btn">{label}</button>
    <button type="reset"  className="submit-btn" style={{ background: '#6b7280' }} onClick={() => {}}>Reset</button>
  </div>
);

export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const YEARS  = [2024, 2025, 2026];
export const DEPTS  = ['HR', 'Academics', 'Admin', 'Accounts', 'Library', 'Hostel', 'Transport', 'International / Abroad Cell'];
