import React, { useState } from 'react';

const SEM_OPTS = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];
const VIEWS = ['New Form Accept','Form Accept Details','Form Accept Summary'];

export default function FormAccept() {
  const [view, setView]             = useState('New Form Accept');
  const [students, setStudents]     = useState([]);
  const [sessions, setSessions]     = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [studentForm, setStudentForm] = useState({ id:'', name:'', semester:'', batch:'', accountsClear:'Yes' });
  const [sessionForm, setSessionForm] = useState({ name:'', semester:'' });
  const [form, setForm]             = useState({ studentId:'', sessionId:'', remarks:'' });
  const [errors, setErrors]         = useState({});
  const [msg, setMsg]               = useState({ text:'', type:'' });

  const studentOpts = students.map(s => ({ value: s.id, label: `${s.id} — ${s.name}` }));
  const sessionOpts = sessions.map(s => ({ value: s.id, label: s.name }));

  const addStudent = (e) => {
    e.preventDefault();
    if (!studentForm.id.trim() || !studentForm.name.trim() || !studentForm.semester || !studentForm.batch.trim()) return;
    setStudents(prev => [...prev, { ...studentForm, accountsClear: studentForm.accountsClear === 'Yes' }]);
    setStudentForm({ id:'', name:'', semester:'', batch:'', accountsClear:'Yes' });
  };

  const addSession = (e) => {
    e.preventDefault();
    if (!sessionForm.name.trim() || !sessionForm.semester) return;
    setSessions(prev => [...prev, { id: prev.length + 1, ...sessionForm }]);
    setSessionForm({ name:'', semester:'' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.studentId) errs.studentId = 'Student is required.';
    if (!form.sessionId) errs.sessionId = 'Exam session is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const student = students.find(s => s.id === form.studentId);
    if (!student.accountsClear) {
      setMsg({ text: `⚠ Accounts clearance pending for ${student.name}. Form cannot be accepted.`, type: 'error' });
      return;
    }
    const session = sessions.find(s => String(s.id) === String(form.sessionId));
    setSubmissions(prev => [...prev, {
      studentId: student.id, studentName: student.name, session: session.name,
      semester: student.semester, batch: student.batch,
      remarks: form.remarks || '—', status: 'Accepted',
      acceptedOn: new Date().toLocaleDateString(),
    }]);
    setForm({ studentId:'', sessionId:'', remarks:'' });
    setErrors({});
    setMsg({ text: `Form accepted for ${student.name}.`, type: 'success' });
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const semByCount = submissions.reduce((a, s) => { a[s.semester] = (a[s.semester]||0)+1; return a; }, {});

  return (
    <div className="exam-section">
      {/* Quick-add student */}
      <div className="exam-card">
        <div className="exam-card-title">Add Student</div>
        <form onSubmit={addStudent} className="exam-form-grid">
          <div className="exam-field"><label>Roll No <span className="req">*</span></label><input value={studentForm.id} onChange={e => setStudentForm({...studentForm,id:e.target.value})} /></div>
          <div className="exam-field"><label>Name <span className="req">*</span></label><input value={studentForm.name} onChange={e => setStudentForm({...studentForm,name:e.target.value})} /></div>
          <div className="exam-field"><label>Semester <span className="req">*</span></label>
            <select value={studentForm.semester} onChange={e => setStudentForm({...studentForm,semester:e.target.value})}>
              <option value="">-- Select --</option>{SEM_OPTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="exam-field"><label>Batch <span className="req">*</span></label><input value={studentForm.batch} onChange={e => setStudentForm({...studentForm,batch:e.target.value})} placeholder="e.g. 2024-25" /></div>
          <div className="exam-field"><label>Accounts Clear</label>
            <select value={studentForm.accountsClear} onChange={e => setStudentForm({...studentForm,accountsClear:e.target.value})}>
              <option>Yes</option><option>No</option>
            </select>
          </div>
          <div className="exam-actions"><button type="submit" className="exam-btn primary">Add Student</button></div>
        </form>
      </div>

      {/* Quick-add session */}
      <div className="exam-card">
        <div className="exam-card-title">Add Exam Session</div>
        <form onSubmit={addSession} className="exam-form-grid">
          <div className="exam-field"><label>Session Name <span className="req">*</span></label><input value={sessionForm.name} onChange={e => setSessionForm({...sessionForm,name:e.target.value})} placeholder="e.g. University Exam 2025" /></div>
          <div className="exam-field"><label>Semester <span className="req">*</span></label>
            <select value={sessionForm.semester} onChange={e => setSessionForm({...sessionForm,semester:e.target.value})}>
              <option value="">-- Select --</option>{SEM_OPTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="exam-actions"><button type="submit" className="exam-btn primary">Add Session</button></div>
        </form>
      </div>

      {/* View tabs */}
      <div className="exam-card">
        <div className="exam-row-flex" style={{ gap: 8 }}>
          {VIEWS.map(v => <button key={v} className={`exam-btn ${view===v?'primary':'secondary'}`} onClick={() => setView(v)}>{v}</button>)}
        </div>
      </div>

      {view === 'New Form Accept' && (
        <div className="exam-card">
          <div className="exam-card-title">New Form Acceptance</div>
          {msg.text && <div className={`exam-alert ${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleSubmit} className="exam-form-grid">
            <div className="exam-field">
              <label>Select Student <span className="req">*</span></label>
              <select value={form.studentId} onChange={e => setForm({...form,studentId:e.target.value})}>
                <option value="">-- Select --</option>
                {studentOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.studentId && <span className="exam-error">{errors.studentId}</span>}
            </div>
            <div className="exam-field">
              <label>Exam Session <span className="req">*</span></label>
              <select value={form.sessionId} onChange={e => setForm({...form,sessionId:e.target.value})}>
                <option value="">-- Select --</option>
                {sessionOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.sessionId && <span className="exam-error">{errors.sessionId}</span>}
            </div>
            <div className="exam-field" style={{ gridColumn: '1/-1' }}>
              <label>Remarks</label>
              <textarea rows={2} value={form.remarks} onChange={e => setForm({...form,remarks:e.target.value})} />
            </div>
            <div className="exam-actions">
              <button type="submit" className="exam-btn primary">Accept Form</button>
              <button type="button" className="exam-btn secondary" onClick={() => { setForm({studentId:'',sessionId:'',remarks:''}); setErrors({}); }}>Reset</button>
            </div>
          </form>
          <p className="exam-hint" style={{ marginTop: 10 }}>Accounts clearance is checked automatically before accepting the form.</p>
        </div>
      )}

      {view === 'Form Accept Details' && (
        <div className="exam-card">
          <div className="exam-card-title">Form Accept Details</div>
          {submissions.length === 0
            ? <div className="exam-alert info">No accepted forms yet.</div>
            : <div className="exam-table-wrap">
                <table className="exam-table">
                  <thead><tr><th>Roll No</th><th>Name</th><th>Session</th><th>Semester</th><th>Batch</th><th>Remarks</th><th>Status</th><th>Accepted On</th></tr></thead>
                  <tbody>{submissions.map((r,i)=>(
                    <tr key={i}><td>{r.studentId}</td><td>{r.studentName}</td><td>{r.session}</td><td>{r.semester}</td><td>{r.batch}</td><td>{r.remarks}</td><td><span className="exam-badge pass">{r.status}</span></td><td>{r.acceptedOn}</td></tr>
                  ))}</tbody>
                </table>
              </div>
          }
        </div>
      )}

      {view === 'Form Accept Summary' && (
        <div className="exam-card">
          <div className="exam-card-title">Form Accept Summary</div>
          <div className="exam-summary-grid">
            <div className="exam-summary-box"><div className="exam-summary-label">Total Accepted</div><div className="exam-summary-value">{submissions.length}</div></div>
            {Object.entries(semByCount).map(([sem, count]) => (
              <div key={sem} className="exam-summary-box"><div className="exam-summary-label">Semester {sem}</div><div className="exam-summary-value">{count}</div></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
