import React, { useState } from 'react';

export default function AddInWard({ onBack }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    receivedDate: today,
    letterNo: '',
    from: '',
    subject: '',
    upload: null,
    disposalDate: '',
    disposalNo: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    alert('In Ward record saved successfully.');
    setForm({ receivedDate: today, letterNo: '', from: '', subject: '', upload: null, disposalDate: '', disposalNo: '' });
  };

  return (
    <div className="hr-form">
      <div className="section-title">Add In Ward</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px' }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>

          <div className="form-field">
            <label className="form-label">Received Date</label>
            <input className="form-input" type="date" value={form.receivedDate} onChange={e => set('receivedDate', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Letter No</label>
            <input className="form-input" value={form.letterNo} onChange={e => set('letterNo', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">From</label>
            <input className="form-input" value={form.from} onChange={e => set('from', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Subject</label>
            <input className="form-input" value={form.subject} onChange={e => set('subject', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Upload</label>
            <input className="form-input" type="file" onChange={e => set('upload', e.target.files[0])} />
          </div>

          <div className="form-field">
            <label className="form-label">Disposal Date</label>
            <input className="form-input" type="date" value={form.disposalDate} onChange={e => set('disposalDate', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Disposal No</label>
            <input className="form-input" value={form.disposalNo} onChange={e => set('disposalNo', e.target.value)} />
          </div>

        </div>
        <div style={{ marginTop: 20 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
