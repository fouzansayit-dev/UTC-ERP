import React from 'react';

export default function DateField({ label, name, value, onChange, readOnly = false, required = false }) {
  return (
    <div className="visa-field">
      <label>{label}{required && <span style={{ color: '#dc2626', marginLeft: 2 }}>*</span>}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
        style={readOnly ? { background: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' } : {}}
      />
    </div>
  );
}
