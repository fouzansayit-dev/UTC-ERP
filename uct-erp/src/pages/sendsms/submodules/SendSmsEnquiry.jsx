import React, { useState } from 'react';

export default function SendSmsEnquiry() {
  const [form, setForm] = useState({ course: 'All', session: '2025-2026' });
  const [lang, setLang] = useState('English');
  const [template, setTemplate] = useState('');
  const [composeSms, setComposeSms] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const charCount = composeSms.length;
  const smsCount = charCount === 0 ? 0 : Math.ceil(charCount / 160);

  return (
    <div className="hr-form">
      <div className="section-title">Send SMS Enquiry</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)',
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Course</label>
            <select className="form-input" value={form.course} onChange={e => set('course', e.target.value)}>
              <option>All</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Session</label>
            <select className="form-input" value={form.session} onChange={e => set('session', e.target.value)}>
              <option>2025-2026</option>
              <option>2024-2025</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Language</label>
            <select className="form-input" value={lang} onChange={e => setLang(e.target.value)}>
              <option>English</option>
              <option>Portuguese</option>
            </select>
          </div>
          <div className="form-field">
            <div style={{ display: 'flex', gap: 16, paddingTop: 24 }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Char count: <b>{charCount}</b></span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>SMS count: <b>{smsCount}</b></span>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Template</label>
            <select className="form-input" value={template} onChange={e => { setTemplate(e.target.value); setComposeSms(e.target.value); }}>
              <option value="">Select</option>
            </select>
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Compose SMS</label>
            <textarea className="form-input form-textarea" rows={3} value={composeSms} onChange={e => setComposeSms(e.target.value)} placeholder="Type your SMS here..." />
          </div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={() => setSubmitted(true)}>Submit</button>
        </div>
      </div>

      {submitted && (
        <div style={{ marginTop: 20, padding: '14px 20px', background: '#dcfce7', borderRadius: 8, color: '#166534', fontSize: 14 }}>
          SMS submitted successfully.
        </div>
      )}
    </div>
  );
}
