import React from 'react';

export default function SelectField({ label, name, value, onChange, options = [], required = false }) {
  return (
    <div className="visa-field">
      <label>{label}{required && <span style={{ color: '#dc2626', marginLeft: 2 }}>*</span>}</label>
      <select name={name} value={value} onChange={onChange} required={required}>
        <option value="">— Select —</option>
        {options.map((opt) =>
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
    </div>
  );
}
