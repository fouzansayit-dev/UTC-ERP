import React from 'react';

export default function TextArea({ label, name, value, onChange, placeholder = '', rows = 3 }) {
  return (
    <div className="visa-field">
      <label>{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}
