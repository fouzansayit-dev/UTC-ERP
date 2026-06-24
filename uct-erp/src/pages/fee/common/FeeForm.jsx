import React, { useState } from 'react';

export default function FeeForm({ title, fields, onSubmit, initialValues = {}, submitLabel = 'Submit' }) {
  const [values, setValues] = useState(() => {
    const init = {};
    fields.forEach(f => { init[f.name] = initialValues[f.name] ?? ''; });
    return init;
  });

  const handleChange = (name, value) => setValues(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...values });
  };

  const handleReset = () => {
    const reset = {};
    fields.forEach(f => { reset[f.name] = ''; });
    setValues(reset);
  };

  return (
    <div className="erp-card" style={{ marginBottom: 20 }}>
      <div className="erp-card-header">{title}</div>
      <div className="erp-card-body">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
            {fields.map(field => (
              <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>
                  {field.label}{field.required && <span style={{ color: '#ef4444' }}> *</span>}
                </label>
                {field.type === 'select' ? (
                  <select value={values[field.name]} onChange={e => handleChange(field.name, e.target.value)} required={field.required} style={inputStyle}>
                    <option value="">-- Select --</option>
                    {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'date' ? (
                  <input type="date" value={values[field.name]} onChange={e => handleChange(field.name, e.target.value)} required={field.required} style={inputStyle} />
                ) : (
                  <input type={field.type || 'text'} value={values[field.name]} placeholder={field.placeholder || ''} onChange={e => handleChange(field.name, e.target.value)} required={field.required} style={inputStyle} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
              {submitLabel}
            </button>
            <button type="button" onClick={handleReset} style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  border: '1px solid #cbd5e0', borderRadius: 4, padding: '6px 10px',
  fontSize: 12.5, fontFamily: 'inherit', color: '#333', background: '#fff',
  outline: 'none', width: '100%',
};
