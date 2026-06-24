import React from 'react';
export default function Card({ title, children, style }) {
  return (
    <div style={{ 
      background: '#fff', 
      border: '1px solid var(--gray2)', 
      borderRadius: 'var(--radius-lg)', 
      overflow: 'hidden', 
      marginBottom: 20, 
      boxShadow: 'var(--shadow-premium)',
      ...style 
    }}>
      {title && (
        <div style={{ 
          borderBottom: '1px solid var(--gray2)', 
          padding: '14px 20px', 
          fontSize: 14, 
          fontWeight: 700, 
          color: 'var(--black)',
          background: 'var(--gray1)'
        }}>
          {title}
        </div>
      )}
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  );
}
