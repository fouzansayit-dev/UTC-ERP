import React from 'react';

export const FormField    = ({ label, required, children }) => (
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
export const TblToolbar = ({ search, onSearch }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:24, marginBottom:10 }}>
    <div>
      {['Copy','CSV','Print'].map(l => (
        <button key={l} onClick={() => {}} style={{ padding:'4px 13px', border:'1px solid #ddd', borderRadius:4, background:'#f9fafb', fontSize:12, cursor:'pointer', marginRight:4, color:'#374151' }}>{l}</button>
      ))}
    </div>
    <input className="form-input" style={{ width:200, padding:'5px 9px', fontSize:12 }}
      placeholder="Search" value={search} onChange={e => onSearch(e.target.value)} />
  </div>
);

export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const YEARS  = [2024, 2025, 2026];
