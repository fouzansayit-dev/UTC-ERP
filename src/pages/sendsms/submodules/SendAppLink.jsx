import React, { useState } from 'react';

export default function SendAppLink() {
  const [form, setForm] = useState({
    course: '', branchName: '', batch: '', session: 'All',
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="hr-form">
      <div className="section-title">Send APP Link</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', maxWidth: 700,
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Course</label>
            <select className="form-input" value={form.course} onChange={e => set('course', e.target.value)}>
              <option value="">Select</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Branch Name</label>
            <select className="form-input" value={form.branchName} onChange={e => set('branchName', e.target.value)}>
              <option value="">None selected</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Batch</label>
            <select className="form-input" value={form.batch} onChange={e => set('batch', e.target.value)}>
              <option value="">Select Batch</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Session</label>
            <select className="form-input" value={form.session} onChange={e => set('session', e.target.value)}>
              <option>All</option>
              <option>2025-2026</option>
              <option>2024-2025</option>
            </select>
          </div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={() => setSubmitted(true)}>Submit</button>
        </div>
      </div>

      {submitted && (
        <div style={{ marginTop: 20, padding: '14px 20px', background: '#dcfce7', borderRadius: 8, color: '#166534', fontSize: 14 }}>
          APP link sent successfully.
        </div>
      )}
    </div>
  );
}
