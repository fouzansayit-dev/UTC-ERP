import React, { useState } from 'react';

export default function ChangePassword({ onBack }) {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [msg, setMsg] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.current || !form.newPass || !form.confirm) {
      setMsg({ type: 'error', text: 'All fields are required.' }); return;
    }
    if (form.newPass !== form.confirm) {
      setMsg({ type: 'error', text: 'New password and confirm password do not match.' }); return;
    }
    if (form.newPass.length < 6) {
      setMsg({ type: 'error', text: 'New password must be at least 6 characters.' }); return;
    }
    setMsg({ type: 'success', text: 'Password changed successfully.' });
    setForm({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="hr-form">
      <div className="section-title">Change Password</div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '28px', maxWidth: 480 }}>
        {msg && (
          <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 6,
            background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: msg.type === 'success' ? '#166534' : '#991b1b',
            fontSize: 13, border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
            {msg.text}
          </div>
        )}
        <div className="form-field" style={{ marginBottom: 16 }}>
          <label className="form-label">Current Password</label>
          <input className="form-input" type="password" value={form.current}
            onChange={e => { set('current', e.target.value); setMsg(null); }} />
        </div>
        <div className="form-field" style={{ marginBottom: 16 }}>
          <label className="form-label">New Password</label>
          <input className="form-input" type="password" value={form.newPass}
            onChange={e => { set('newPass', e.target.value); setMsg(null); }} />
        </div>
        <div className="form-field" style={{ marginBottom: 20 }}>
          <label className="form-label">Confirm New Password</label>
          <input className="form-input" type="password" value={form.confirm}
            onChange={e => { set('confirm', e.target.value); setMsg(null); }} />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>Change Password</button>
      </div>
    </div>
  );
}
