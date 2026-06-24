import React, { useState } from 'react';

const SEM_OPTS = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];

export default function NominalRoll() {
  const [activeRoll, setActiveRoll] = useState('Nominal Roll I');
  const [semFilter, setSemFilter]   = useState('');
  const [students, setStudents]     = useState([]);
  const [form, setForm] = useState({ id: '', name: '', semester: '', batch: '', accountsClear: 'Yes' });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');

  const filtered = students.filter(s => semFilter ? s.semester === semFilter : true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.id.trim())    errs.id       = 'Roll No is required.';
    if (!form.name.trim())  errs.name     = 'Name is required.';
    if (!form.semester)     errs.semester = 'Semester is required.';
    if (!form.batch.trim()) errs.batch    = 'Batch is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStudents(prev => [...prev, {
      id: form.id, name: form.name, semester: form.semester,
      batch: form.batch, accountsClear: form.accountsClear === 'Yes' ? '✔ Yes' : '✘ No',
    }]);
    setForm({ id: '', name: '', semester: '', batch: '', accountsClear: 'Yes' });
    setErrors({});
    setMsg('Student added to Nominal Roll.');
    setTimeout(() => setMsg(''), 3000);
  };

  const colsI  = ['Roll No','Student Name','Semester','Batch'];
  const colsII = ['Roll No','Student Name','Semester','Batch','Accounts Clear'];

  return (
    <div className="exam-section">
      <div className="exam-card">
        <div className="exam-card-title">Add Student to Roll</div>
        {msg && <div className="exam-alert success">{msg}</div>}
        <form onSubmit={handleSubmit} className="exam-form-grid">
          <div className="exam-field">
            <label>Roll No <span className="req">*</span></label>
            <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
            {errors.id && <span className="exam-error">{errors.id}</span>}
          </div>
          <div className="exam-field">
            <label>Student Name <span className="req">*</span></label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
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
            <label>Accounts Clear</label>
            <select value={form.accountsClear} onChange={e => setForm({ ...form, accountsClear: e.target.value })}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="exam-actions">
            <button type="submit" className="exam-btn primary">Add Student</button>
            <button type="button" className="exam-btn secondary" onClick={() => { setForm({ id:'', name:'', semester:'', batch:'', accountsClear:'Yes' }); setErrors({}); }}>Reset</button>
          </div>
        </form>
      </div>

      <div className="exam-card">
        <div className="exam-row-flex" style={{ marginBottom: 14, gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {['Nominal Roll I','Nominal Roll II'].map(r => (
            <button key={r} className={`exam-btn ${activeRoll === r ? 'primary' : 'secondary'}`} onClick={() => setActiveRoll(r)}>{r}</button>
          ))}
          <div className="exam-field" style={{ marginLeft: 'auto', minWidth: 160 }}>
            <label>Filter by Semester</label>
            <select value={semFilter} onChange={e => setSemFilter(e.target.value)}>
              <option value="">All</option>
              {SEM_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="exam-card-title">{activeRoll} — Student List for Examination</div>
        <div className="exam-table-wrap">
          <table className="exam-table">
            <thead>
              <tr>{(activeRoll === 'Nominal Roll I' ? colsI : colsII).map(c => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} className="exam-no-data">No students added yet.</td></tr>
                : filtered.map((r, i) => (
                  <tr key={i}>
                    <td>{r.id}</td><td>{r.name}</td><td>{r.semester}</td><td>{r.batch}</td>
                    {activeRoll === 'Nominal Roll II' && <td>{r.accountsClear}</td>}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="exam-meta">Total Students: {filtered.length}</div>
      </div>
    </div>
  );
}
