import React, { useState } from 'react';

const SEM_OPTS     = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];
const SUBJECTS     = ['Anatomy','Physiology','Biochemistry','Pathology','Pharmacology','Microbiology','Forensic Medicine','Community Medicine','Ophthalmology','ENT','Medicine','Surgery','Obstetrics & Gynaecology','Paediatrics'];
const SESSION_OPTS = ['University Exam 2024','University Exam 2025','Supplementary 2024','Supplementary 2025','Internal Assessment 2025'];
const SHIFT_OPTS   = ['Morning (9:00 AM - 12:00 PM)','Afternoon (2:00 PM - 5:00 PM)','Full Day (9:00 AM - 5:00 PM)'];
const TYPE_OPTS    = ['Theory','Practical','Viva','CCE'];
const VIEWS        = ['Add Schedule','View Schedule','Timetable View'];

export default function ExamSchedule() {
  const [view, setView]           = useState('Add Schedule');
  const [schedules, setSchedules] = useState([]);
  const [semFilter, setSemFilter]           = useState('');
  const [sessionFilter, setSessionFilter]   = useState('');
  const [form, setForm] = useState({ session:'', semester:'', subject:'', examType:'', date:'', shift:'', hall:'', maxMarks:'', duration:'' });
  const [errors, setErrors] = useState({});
  const [msg, setMsg]       = useState({ text:'', type:'' });

  const validate = () => {
    const e = {};
    if (!form.session)         e.session  = 'Session is required.';
    if (!form.semester)        e.semester = 'Semester is required.';
    if (!form.subject)         e.subject  = 'Subject is required.';
    if (!form.examType)        e.examType = 'Exam type is required.';
    if (!form.date)            e.date     = 'Date is required.';
    if (!form.shift)           e.shift    = 'Shift is required.';
    if (!form.hall.trim())     e.hall     = 'Hall / Room is required.';
    if (!form.maxMarks)        e.maxMarks = 'Max marks is required.';
    if (!form.duration.trim()) e.duration = 'Duration is required.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const exists = schedules.find(s => s.session===form.session && s.semester===form.semester && s.subject===form.subject && s.examType===form.examType);
    if (exists) { setMsg({ text:'A schedule for this subject, semester and session already exists.', type:'error' }); return; }
    setSchedules(prev => [...prev, { id: prev.length+1, ...form, createdOn: new Date().toLocaleDateString() }]);
    setForm({ session:'', semester:'', subject:'', examType:'', date:'', shift:'', hall:'', maxMarks:'', duration:'' });
    setErrors({});
    setMsg({ text:'Exam schedule added successfully.', type:'success' });
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const filtered = schedules.filter(s =>
    (semFilter     ? s.semester === semFilter     : true) &&
    (sessionFilter ? s.session  === sessionFilter : true)
  );

  const byDate = filtered.reduce((acc, s) => { acc[s.date] = acc[s.date] || []; acc[s.date].push(s); return acc; }, {});
  const sortedDates = Object.keys(byDate).sort();

  return (
    <div className="exam-section">
      <div className="exam-card" style={{ padding:'12px 20px' }}>
        <div className="exam-row-flex" style={{ gap:8 }}>
          {VIEWS.map(v => <button key={v} className={`exam-btn ${view===v?'primary':'secondary'}`} onClick={() => setView(v)}>{v}</button>)}
        </div>
      </div>

      {view === 'Add Schedule' && (
        <div className="exam-card">
          <div className="exam-card-title">Add Exam Schedule</div>
          {msg.text && <div className={`exam-alert ${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleSubmit} className="exam-form-grid">
            <div className="exam-field">
              <label>Exam Session <span className="req">*</span></label>
              <select value={form.session} onChange={e => setForm({...form,session:e.target.value})}>
                <option value="">-- Select --</option>{SESSION_OPTS.map(s=><option key={s}>{s}</option>)}
              </select>
              {errors.session && <span className="exam-error">{errors.session}</span>}
            </div>
            <div className="exam-field">
              <label>Semester <span className="req">*</span></label>
              <select value={form.semester} onChange={e => setForm({...form,semester:e.target.value})}>
                <option value="">-- Select --</option>{SEM_OPTS.map(s=><option key={s}>{s}</option>)}
              </select>
              {errors.semester && <span className="exam-error">{errors.semester}</span>}
            </div>
            <div className="exam-field">
              <label>Subject <span className="req">*</span></label>
              <select value={form.subject} onChange={e => setForm({...form,subject:e.target.value})}>
                <option value="">-- Select --</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}
              </select>
              {errors.subject && <span className="exam-error">{errors.subject}</span>}
            </div>
            <div className="exam-field">
              <label>Exam Type <span className="req">*</span></label>
              <select value={form.examType} onChange={e => setForm({...form,examType:e.target.value})}>
                <option value="">-- Select --</option>{TYPE_OPTS.map(s=><option key={s}>{s}</option>)}
              </select>
              {errors.examType && <span className="exam-error">{errors.examType}</span>}
            </div>
            <div className="exam-field">
              <label>Exam Date <span className="req">*</span></label>
              <input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} />
              {errors.date && <span className="exam-error">{errors.date}</span>}
            </div>
            <div className="exam-field">
              <label>Shift <span className="req">*</span></label>
              <select value={form.shift} onChange={e => setForm({...form,shift:e.target.value})}>
                <option value="">-- Select --</option>{SHIFT_OPTS.map(s=><option key={s}>{s}</option>)}
              </select>
              {errors.shift && <span className="exam-error">{errors.shift}</span>}
            </div>
            <div className="exam-field">
              <label>Hall / Room No. <span className="req">*</span></label>
              <input value={form.hall} onChange={e => setForm({...form,hall:e.target.value})} placeholder="e.g. Hall A, Room 101" />
              {errors.hall && <span className="exam-error">{errors.hall}</span>}
            </div>
            <div className="exam-field">
              <label>Max Marks <span className="req">*</span></label>
              <input type="number" min={0} value={form.maxMarks} onChange={e => setForm({...form,maxMarks:e.target.value})} placeholder="e.g. 100" />
              {errors.maxMarks && <span className="exam-error">{errors.maxMarks}</span>}
            </div>
            <div className="exam-field">
              <label>Duration <span className="req">*</span></label>
              <input value={form.duration} onChange={e => setForm({...form,duration:e.target.value})} placeholder="e.g. 3 Hours" />
              {errors.duration && <span className="exam-error">{errors.duration}</span>}
            </div>
            <div className="exam-actions">
              <button type="submit" className="exam-btn primary">Add Schedule</button>
              <button type="button" className="exam-btn secondary" onClick={() => { setForm({session:'',semester:'',subject:'',examType:'',date:'',shift:'',hall:'',maxMarks:'',duration:''}); setErrors({}); }}>Reset</button>
            </div>
          </form>
        </div>
      )}

      {view === 'View Schedule' && (
        <div className="exam-card">
          <div className="exam-card-title">All Exam Schedules</div>
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
                <tr><th>S.No</th><th>Session</th><th>Semester</th><th>Subject</th><th>Type</th><th>Date</th><th>Shift</th><th>Hall</th><th>Max Marks</th><th>Duration</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={10} className="exam-no-data">No schedules added yet.</td></tr>
                  : filtered.map((r,i) => (
                    <tr key={r.id}>
                      <td>{i+1}</td><td>{r.session}</td><td>{r.semester}</td><td>{r.subject}</td>
                      <td><span className="exam-badge info">{r.examType}</span></td>
                      <td>{r.date}</td><td style={{ fontSize:12 }}>{r.shift}</td>
                      <td>{r.hall}</td><td>{r.maxMarks}</td><td>{r.duration}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="exam-meta">Total Schedules: {filtered.length}</div>
        </div>
      )}

      {view === 'Timetable View' && (
        <div className="exam-card">
          <div className="exam-card-title">Timetable View</div>
          <div className="exam-row-flex" style={{ gap:12, marginBottom:16, flexWrap:'wrap', alignItems:'flex-end' }}>
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
          {sortedDates.length === 0
            ? <div className="exam-alert info">No schedules to display. Add schedules first.</div>
            : sortedDates.map(date => (
              <div key={date} style={{ marginBottom:18 }}>
                <div style={{ fontWeight:600, fontSize:13, color:'#6366f1', marginBottom:8, borderLeft:'3px solid #6366f1', paddingLeft:10 }}>
                  {new Date(date).toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                </div>
                <div className="exam-table-wrap">
                  <table className="exam-table">
                    <thead><tr><th>Semester</th><th>Subject</th><th>Type</th><th>Shift</th><th>Hall</th><th>Max Marks</th><th>Duration</th></tr></thead>
                    <tbody>
                      {byDate[date].map((r,i) => (
                        <tr key={i}>
                          <td>{r.semester}</td><td>{r.subject}</td>
                          <td><span className="exam-badge info">{r.examType}</span></td>
                          <td style={{ fontSize:12 }}>{r.shift}</td>
                          <td>{r.hall}</td><td>{r.maxMarks}</td><td>{r.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
