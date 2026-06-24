import React, { useState } from 'react';

const SEM_OPTS = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];

export default function ExamSession() {
  const [sessions, setSessions] = useState([]);
  const [form, setForm]   = useState({ name: '', semester: '', batch: '', date: '' });
  const [errors, setErrors] = useState({});
  const [msg, setMsg]     = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name     = 'Session name is required.';
    if (!form.semester)     e.semester = 'Semester is required.';
    if (!form.batch.trim()) e.batch    = 'Batch is required.';
    if (!form.date)         e.date     = 'Date is required.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSessions(prev => [...prev, { id: prev.length + 1, ...form, status: 'Active' }]);
    setForm({ name: '', semester: '', batch: '', date: '' });
    setErrors({});
    setMsg('Exam session created successfully.');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="exam-section">
      <div className="exam-card">
        <div className="exam-card-title">Create New Exam Session</div>
        {msg && <div className="exam-alert success">{msg}</div>}
        <form onSubmit={handleSubmit} className="exam-form-grid">
          <div className="exam-field">
            <label>Session Name <span className="req">*</span></label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. University Exam 2025" />
            {errors.name && <span className="exam-error">{errors.name}</span>}
          </div>
          <div className="exam-field">
            <label>Semester <span className="req">*</span></label>
            <select value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
              <option value="">-- Select --</option>
              {SEM_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.semester && <span className="exam-error">{errors.semester}</span>}
          </div>
          <div className="exam-field">
            <label>Batch <span className="req">*</span></label>
            <input value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })} placeholder="e.g. 2024-25" />
            {errors.batch && <span className="exam-error">{errors.batch}</span>}
          </div>
          <div className="exam-field">
            <label>Exam Date <span className="req">*</span></label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            {errors.date && <span className="exam-error">{errors.date}</span>}
          </div>
          <div className="exam-actions">
            <button type="submit" className="exam-btn primary">Add Session</button>
            <button type="button" className="exam-btn secondary" onClick={() => { setForm({ name:'', semester:'', batch:'', date:'' }); setErrors({}); }}>Reset</button>
          </div>
        </form>
      </div>

      <div className="exam-card">
        <div className="exam-card-title">Existing Exam Sessions</div>
        <div className="exam-table-wrap">
          <table className="exam-table">
            <thead><tr><th>S.No</th><th>Session Name</th><th>Semester</th><th>Batch</th><th>Exam Date</th><th>Status</th></tr></thead>
            <tbody>
              {sessions.length === 0
                ? <tr><td colSpan={6} className="exam-no-data">No sessions added yet.</td></tr>
                : sessions.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td><td>{r.name}</td><td>{r.semester}</td>
                    <td>{r.batch}</td><td>{r.date}</td>
                    <td><span className="exam-badge pass">{r.status}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
