import React from 'react';

export default function FormSection({ title, children }) {
  return (
    <div>
      <div className="visa-section-title">{title}</div>
      <div>{children}</div>
    </div>
  );
}
