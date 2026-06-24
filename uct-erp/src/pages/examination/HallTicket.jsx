import React, { useState } from 'react';

const SEM_OPTS     = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];
const SESSION_OPTS = ['University Exam 2024','University Exam 2025','Supplementary 2024','Supplementary 2025','Internal Assessment 2025'];
const SUBJECTS     = ['Anatomy','Physiology','Biochemistry','Pathology','Pharmacology','Microbiology','Forensic Medicine','Community Medicine','Ophthalmology','ENT','Medicine','Surgery','Obstetrics & Gynaecology','Paediatrics'];
const VIEWS        = ['Generate Hall Ticket','Hall Ticket List'];

export default function HallTicket() {
  const [view, setView]       = useState('Generate Hall Ticket');
  const [tickets, setTickets] = useState([]);
  const [preview, setPreview] = useState(null);
  const [semFilter, setSemFilter]         = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [form, setForm] = useState({
    rollNo:'', name:'', fatherName:'', semester:'', batch:'',
    session:'', course:'MBBS', college:'UCT Medical College',
    accountsClear:'Yes', attendanceOk:'Yes',
  });
  const [subjects, setSubjects] = useState([]);
  const [errors, setErrors]    = useState({});
  const [msg, setMsg]          = useState({ text:'', type:'' });

  /* subject checkbox toggle */
  const toggleSubject = (s) => setSubjects(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);

  const validate = () => {
    const e = {};
    if (!form.rollNo.trim())    e.rollNo    = 'Roll No is required.';
    if (!form.name.trim())      e.name      = 'Student name is required.';
    if (!form.fatherName.trim())e.fatherName= "Father's name is required.";
    if (!form.semester)         e.semester  = 'Semester is required.';
    if (!form.batch.trim())     e.batch     = 'Batch is required.';
    if (!form.session)          e.session   = 'Session is required.';
    if (subjects.length === 0)  e.subjects  = 'Select at least one subject.';
    return e;
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (form.accountsClear === 'No') {
      setMsg({ text:'Hall ticket cannot be generated — Accounts clearance is pending.', type:'error' });
      return;
    }
    if (form.attendanceOk === 'No') {
      setMsg({ text:'Hall ticket cannot be generated — Attendance criteria not met (below 75%).', type:'error' });
      return;
    }
    const ticket = {
      id: tickets.length + 1,
      ticketNo: `HT-${form.session.replace(/\s/g,'').slice(0,6).toUpperCase()}-${String(tickets.length+1).padStart(4,'0')}`,
      ...form, subjects: [...subjects],
      issuedOn: new Date().toLocaleDateString(),
      status: 'Issued',
    };
    setTickets(prev => [...prev, ticket]);
    setPreview(ticket);
    setForm({ rollNo:'', name:'', fatherName:'', semester:'', batch:'', session:'', course:'MBBS', college:'UCT Medical College', accountsClear:'Yes', attendanceOk:'Yes' });
    setSubjects([]);
    setErrors({});
    setMsg({ text:'Hall ticket generated successfully.', type:'success' });
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const filtered = tickets.filter(t =>
    (semFilter     ? t.semester === semFilter     : true) &&
    (sessionFilter ? t.session  === sessionFilter : true)
  );

  return (
    <div className="exam-section">
      {/* Tabs */}
      <div className="exam-card" style={{ padding:'12px 20px' }}>
        <div className="exam-row-flex" style={{ gap:8 }}>
          {VIEWS.map(v => <button key={v} className={`exam-btn ${view===v?'primary':'secondary'}`} onClick={() => { setView(v); setPreview(null); }}>{v}</button>)}
        </div>
      </div>

      {/* ── GENERATE ── */}
      {view === 'Generate Hall Ticket' && (
        <>
          <div className="exam-card">
            <div className="exam-card-title">Student Details</div>
            {msg.text && <div className={`exam-alert ${msg.type}`}>{msg.text}</div>}
            <form onSubmit={handleGenerate} className="exam-form-grid">
              <div className="exam-field">
                <label>Roll No <span className="req">*</span></label>
                <input value={form.rollNo} onChange={e => setForm({...form,rollNo:e.target.value})} placeholder="e.g. 2024MBBS001" />
                {errors.rollNo && <span className="exam-error">{errors.rollNo}</span>}
              </div>
              <div className="exam-field">
                <label>Student Name <span className="req">*</span></label>
                <input value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
                {errors.name && <span className="exam-error">{errors.name}</span>}
              </div>
              <div className="exam-field">
                <label>Father's Name <span className="req">*</span></label>
                <input value={form.fatherName} onChange={e => setForm({...form,fatherName:e.target.value})} />
                {errors.fatherName && <span className="exam-error">{errors.fatherName}</span>}
              </div>
              <div className="exam-field">
                <label>Semester <span className="req">*</span></label>
                <select value={form.semester} onChange={e => setForm({...form,semester:e.target.value})}>
                  <option value="">-- Select --</option>{SEM_OPTS.map(s=><option key={s}>{s}</option>)}
                </select>
                {errors.semester && <span className="exam-error">{errors.semester}</span>}
              </div>
              <div className="exam-field">
                <label>Batch <span className="req">*</span></label>
                <input value={form.batch} onChange={e => setForm({...form,batch:e.target.value})} placeholder="e.g. 2024-25" />
                {errors.batch && <span className="exam-error">{errors.batch}</span>}
              </div>
              <div className="exam-field">
                <label>Exam Session <span className="req">*</span></label>
                <select value={form.session} onChange={e => setForm({...form,session:e.target.value})}>
                  <option value="">-- Select --</option>{SESSION_OPTS.map(s=><option key={s}>{s}</option>)}
                </select>
                {errors.session && <span className="exam-error">{errors.session}</span>}
              </div>
              <div className="exam-field">
                <label>Course</label>
                <input value={form.course} onChange={e => setForm({...form,course:e.target.value})} />
              </div>
              <div className="exam-field">
                <label>Accounts Clearance</label>
                <select value={form.accountsClear} onChange={e => setForm({...form,accountsClear:e.target.value})}>
                  <option>Yes</option><option>No</option>
                </select>
              </div>
              <div className="exam-field">
                <label>Attendance Criteria Met (75%+)</label>
                <select value={form.attendanceOk} onChange={e => setForm({...form,attendanceOk:e.target.value})}>
                  <option>Yes</option><option>No</option>
                </select>
              </div>

              {/* Subject selection */}
              <div className="exam-field" style={{ gridColumn:'1 / -1' }}>
                <label>Select Subjects for Exam <span className="req">*</span></label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 14px', marginTop:6 }}>
                  {SUBJECTS.map(s => (
                    <label key={s} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, cursor:'pointer', color:'#374151' }}>
                      <input type="checkbox" checked={subjects.includes(s)} onChange={() => toggleSubject(s)} />
                      {s}
                    </label>
                  ))}
                </div>
                {errors.subjects && <span className="exam-error">{errors.subjects}</span>}
              </div>

              <div className="exam-actions">
                <button type="submit" className="exam-btn primary">Generate Hall Ticket</button>
                <button type="button" className="exam-btn secondary" onClick={() => { setForm({rollNo:'',name:'',fatherName:'',semester:'',batch:'',session:'',course:'MBBS',college:'UCT Medical College',accountsClear:'Yes',attendanceOk:'Yes'}); setSubjects([]); setErrors({}); setPreview(null); }}>Reset</button>
              </div>
            </form>
          </div>

          {/* Hall Ticket Preview */}
          {preview && (
            <div className="exam-card">
              <div className="exam-card-title">Hall Ticket Preview</div>
              <div style={{ border:'2px solid #6366f1', borderRadius:8, padding:'24px 28px', maxWidth:640 }}>
                <div style={{ textAlign:'center', borderBottom:'1px solid #e5e7eb', paddingBottom:14, marginBottom:14 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:'#1e1b4b' }}>{preview.college}</div>
                  <div style={{ fontSize:12, color:'#6b7280', marginTop:3 }}>Examination Hall Ticket — {preview.session}</div>
                  <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>Ticket No: {preview.ticketNo}</div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 20px', fontSize:13, marginBottom:16 }}>
                  {[
                    ['Roll No', preview.rollNo],
                    ['Course', preview.course],
                    ['Student Name', preview.name],
                    ['Semester', preview.semester + ' Semester'],
                    ["Father's Name", preview.fatherName],
                    ['Batch', preview.batch],
                    ['Issued On', preview.issuedOn],
                    ['Session', preview.session],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <span style={{ color:'#6b7280' }}>{k}: </span>
                      <span style={{ fontWeight:500, color:'#111827' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>Subjects Appearing For:</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                  {preview.subjects.map(s => <span key={s} className="exam-badge info">{s}</span>)}
                </div>
                <div style={{ fontSize:11, color:'#9ca3af', borderTop:'1px solid #f3f4f6', paddingTop:10, textAlign:'center' }}>
                  This hall ticket must be produced at the examination hall. Mobile phones are strictly prohibited.
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── LIST VIEW ── */}
      {view === 'Hall Ticket List' && (
        <div className="exam-card">
          <div className="exam-card-title">Issued Hall Tickets</div>
          <div className="exam-row-flex" style={{ gap:12, marginBottom:14, flexWrap:'wrap', alignItems:'flex-end' }}>
            <div className="exam-field" style={{ minWidth:180 }}>
              <label>Filter by Session</label>
              <select value={sessionFilter} onChange={e => setSessionFilter(e.target.value)}>
                <option value="">All Sessions</option>{SESSION_OPTS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="exam-field" style={{ minWidth:150 }}>
              <label>Filter by Semester</label>
              <select value={semFilter} onChange={e => setSemFilter(e.target.value)}>
                <option value="">All Semesters</option>{SEM_OPTS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="exam-table-wrap">
            <table className="exam-table">
              <thead>
                <tr><th>Ticket No</th><th>Roll No</th><th>Student Name</th><th>Semester</th><th>Batch</th><th>Session</th><th>Subjects</th><th>Issued On</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={9} className="exam-no-data">No hall tickets issued yet.</td></tr>
                  : filtered.map((t,i) => (
                    <tr key={i}>
                      <td style={{ fontFamily:'monospace', fontSize:12 }}>{t.ticketNo}</td>
                      <td>{t.rollNo}</td><td>{t.name}</td><td>{t.semester}</td><td>{t.batch}</td><td>{t.session}</td>
                      <td style={{ fontSize:11 }}>{t.subjects.join(', ')}</td>
                      <td>{t.issuedOn}</td>
                      <td><span className="exam-badge pass">{t.status}</span></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="exam-meta">Total Issued: {filtered.length}</div>
        </div>
      )}
    </div>
  );
}
