import React from 'react';

export default function InputField({ label, name, value, onChange, placeholder = '', readOnly = false, required = false }) {
  return (
    <div className="visa-field">
      <label>{label}{required && <span style={{ color: '#dc2626', marginLeft: 2 }}>*</span>}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
      />
    </div>
  );
}
