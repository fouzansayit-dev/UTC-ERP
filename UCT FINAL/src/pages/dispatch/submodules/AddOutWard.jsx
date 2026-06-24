import React, { useState } from 'react';

export default function AddOutWard({ onBack }) {
  const today = new Date().toISOString().split('T')[0];
  const dispatchNo = `${today.replace(/-/g, '').slice(2)}-${Math.floor(Math.random() * 900) + 100}`;

  const [form, setForm] = useState({
    date: today,
    section: '',
    dispatch: dispatchNo,
    subject: '',
    to: '',
    upload: null,
    copy: [],
  });

  const copyOptions = ['Principal', 'Vice Principal', 'Registrar', 'Dean', 'HOD', 'Admin'];
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleCopy = (val) => {
    setForm(p => ({
      ...p,
      copy: p.copy.includes(val) ? p.copy.filter(c => c !== val) : [...p.copy, val]
    }));
  };

  const handleSubmit = () => {
    alert('Out Ward record saved successfully.');
    setForm({ date: today, section: '', dispatch: dispatchNo, subject: '', to: '', upload: null, copy: [] });
  };

  return (
    <div className="hr-form">
      <div className="section-title">Add Out Ward</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px' }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>

          <div className="form-field">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Section</label>
            <select className="form-input" value={form.section} onChange={e => set('section', e.target.value)}>
              <option value="">Select</option>
              <option>Administration</option>
              <option>Accounts</option>
              <option>Academic</option>
              <option>HR</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Dispatch</label>
            <input className="form-input" value={form.dispatch} readOnly style={{ background: '#f8fafc' }} />
          </div>

          <div className="form-field">
            <label className="form-label">Subject</label>
            <input className="form-input" value={form.subject} onChange={e => set('subject', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">To</label>
            <input className="form-input" value={form.to} onChange={e => set('to', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Upload</label>
            <input className="form-input" type="file" onChange={e => set('upload', e.target.files[0])} />
          </div>

          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Copy</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
              {copyOptions.map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.copy.includes(opt)} onChange={() => toggleCopy(opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

        </div>
        <div style={{ marginTop: 20 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
