import React from 'react';
export function Field({ label, children, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
      <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--black3)' }}>
        {label}{required && <span style={{ color: '#f43f5e' }}> *</span>}
      </label>
      {children}
    </div>
  );
}
export function Input(props) {
  return (
    <input
      style={{
        padding: '9px 12px',
        border: '1px solid var(--gray2)',
        borderRadius: 'var(--radius-md)',
        fontSize: '13.5px',
        color: 'var(--black2)',
        background: '#fff',
        outline: 'none',
        transition: 'all 0.2s ease',
      }}
      {...props}
    />
  );
}
export function Select({ children, ...props }) {
  return (
    <select
      style={{
        padding: '9px 12px',
        border: '1px solid var(--gray2)',
        borderRadius: 'var(--radius-md)',
        fontSize: '13.5px',
        color: 'var(--black2)',
        background: '#fff',
        outline: 'none',
        transition: 'all 0.2s ease',
      }}
      {...props}
    >
      {children}
    </select>
  );
}
