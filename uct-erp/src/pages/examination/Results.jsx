import React, { useState } from 'react';

const SEM_OPTS     = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];
const SESSION_OPTS = ['University Exam 2024','University Exam 2025','Supplementary 2024','Supplementary 2025','Internal Assessment 2025'];
const SUBJECTS     = ['Anatomy','Physiology','Biochemistry','Pathology','Pharmacology','Microbiology','Forensic Medicine','Community Medicine','Ophthalmology','ENT','Medicine','Surgery','Obstetrics & Gynaecology','Paediatrics'];
const VIEWS        = ['Add Result','Result Sheet','Result Summary'];

const PASS_CUTOFF = 0.5; /* 50% to pass each subject */

export default function Results() {
  const [view, setView]       = useState('Add Result');
  const [results, setResults] = useState([]);
  const [semFilter, setSemFilter]         = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [search, setSearch]               = useState('');
  const [form, setForm] = useState({
    rollNo:'', name:'', semester:'', batch:'', session:'', subject:'',
    theory:'', practical:'', cce:'', maxTheory:'200', maxPractical:'70', maxCCE:'60',
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg]       = useState({ text:'', type:'' });

  const validate = () => {
    const e = {};
    if (!form.rollNo.trim())  e.rollNo   = 'Roll No is required.';
    if (!form.name.trim())    e.name     = 'Student name is required.';
    if (!form.semester)       e.semester = 'Semester is required.';
    if (!form.batch.trim())   e.batch    = 'Batch is required.';
    if (!form.session)        e.session  = 'Session is required.';
    if (!form.subject)        e.subject  = 'Subject is required.';
    if (form.theory === '')   e.theory   = 'Theory marks required.';
    return e;
  };

  const calcResult = (theory, practical, cce, maxTheory, maxPractical, maxCCE) => {
    const t = Number(theory)||0, p = Number(practical)||0, c = Number(cce)||0;
    const mt = Number(maxTheory)||200, mp = Number(maxPractical)||70, mc = Number(maxCCE)||60;
    const total = t + p + c;
    const max   = mt + mp + mc;
    const pct   = max > 0 ? Math.round((total / max) * 100) : 0;
    const theoryPass    = mt > 0 ? t >= mt * PASS_CUTOFF : true;
    const practicalPass = mp > 0 ? p >= mp * PASS_CUTOFF : true;
    const ccePass       = mc > 0 ? c >= mc * PASS_CUTOFF : true;
    const pass = theoryPass && practicalPass && ccePass;
    return { total, max, pct, pass };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const dup = results.find(r => r.rollNo===form.rollNo && r.session===form.session && r.subject===form.subject);
    if (dup) { setMsg({ text:'Result for this student, subject and session already exists.', type:'error' }); return; }
    const { total, max, pct, pass } = calcResult(form.theory, form.practical, form.cce, form.maxTheory, form.maxPractical, form.maxCCE);
    setResults(prev => [...prev, {
      id: prev.length+1, rollNo:form.rollNo, name:form.name,
      semester:form.semester, batch:form.batch, session:form.session, subject:form.subject,
      theory:Number(form.theory)||0, practical:Number(form.practical)||0, cce:Number(form.cce)||0,
      maxTheory:Number(form.maxTheory), maxPractical:Number(form.maxPractical), maxCCE:Number(form.maxCCE),
      total, max, pct, result: pass ? 'Pass' : 'Fail',
      addedOn: new Date().toLocaleDateString(),
    }]);
    setForm({ rollNo:'', name:'', semester:'', batch:'', session:'', subject:'', theory:'', practical:'', cce:'', maxTheory:'200', maxPractical:'70', maxCCE:'60' });
    setErrors({});
    setMsg({ text:'Result added successfully.', type:'success' });
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const filtered = results.filter(r =>
    (semFilter     ? r.semester === semFilter     : true) &&
    (sessionFilter ? r.session  === sessionFilter : true) &&
    (search ? r.name.toLowerCase().includes(search.toLowerCase()) || r.rollNo.toLowerCase().includes(search.toLowerCase()) : true)
  );

  /* summary stats */
  const totalStudents = [...new Set(filtered.map(r => r.rollNo))].length;
  const byRoll = filtered.reduce((acc, r) => {
    acc[r.rollNo] = acc[r.rollNo] || { pass: true, name: r.name, rollNo: r.rollNo };
    if (r.result === 'Fail') acc[r.rollNo].pass = false;
    return acc;
  }, {});
  const passCount = Object.values(byRoll).filter(r => r.pass).length;
  const failCount = totalStudents - passCount;
  const subjectStats = SUBJECTS.map(s => {
    const sub = filtered.filter(r => r.subject === s);
    const p = sub.filter(r => r.result === 'Pass').length;
    return { subject:s, total:sub.length, pass:p, fail:sub.length-p };
  }).filter(s => s.total > 0);

  return (
    <div className="exam-section">
      <div className="exam-card" style={{ padding:'12px 20px' }}>
        <div className="exam-row-flex" style={{ gap:8 }}>
          {VIEWS.map(v => <button key={v} className={`exam-btn ${view===v?'primary':'secondary'}`} onClick={() => setView(v)}>{v}</button>)}
        </div>
      </div>

      {/* ── ADD RESULT ── */}
      {view === 'Add Result' && (
        <div className="exam-card">
          <div className="exam-card-title">Add Student Result</div>
          <p className="exam-hint" style={{ marginBottom:14 }}>Enter marks for each subject separately. Pass criteria: 50% in each component (Theory / Practical / CCE).</p>
          {msg.text && <div className={`exam-alert ${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleSubmit} className="exam-form-grid">
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
              <label>Subject <span className="req">*</span></label>
              <select value={form.subject} onChange={e => setForm({...form,subject:e.target.value})}>
                <option value="">-- Select --</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}
              </select>
              {errors.subject && <span className="exam-error">{errors.subject}</span>}
            </div>
            {/* marks row */}
            <div className="exam-field">
              <label>Theory Marks <span className="req">*</span></label>
              <input type="number" min={0} max={Number(form.maxTheory)} value={form.theory} onChange={e => setForm({...form,theory:e.target.value})} placeholder="Obtained" />
              {errors.theory && <span className="exam-error">{errors.theory}</span>}
            </div>
            <div className="exam-field">
              <label>Max Theory Marks</label>
              <input type="number" min={0} value={form.maxTheory} onChange={e => setForm({...form,maxTheory:e.target.value})} />
            </div>
            <div className="exam-field">
              <label>Practical Marks</label>
              <input type="number" min={0} max={Number(form.maxPractical)} value={form.practical} onChange={e => setForm({...form,practical:e.target.value})} placeholder="Obtained" />
            </div>
            <div className="exam-field">
              <label>Max Practical Marks</label>
              <input type="number" min={0} value={form.maxPractical} onChange={e => setForm({...form,maxPractical:e.target.value})} />
            </div>
            <div className="exam-field">
              <label>CCE Marks</label>
              <input type="number" min={0} max={Number(form.maxCCE)} value={form.cce} onChange={e => setForm({...form,cce:e.target.value})} placeholder="Obtained" />
            </div>
            <div className="exam-field">
              <label>Max CCE Marks</label>
              <input type="number" min={0} value={form.maxCCE} onChange={e => setForm({...form,maxCCE:e.target.value})} />
            </div>
            <div className="exam-actions">
              <button type="submit" className="exam-btn primary">Save Result</button>
              <button type="button" className="exam-btn secondary" onClick={() => { setForm({rollNo:'',name:'',semester:'',batch:'',session:'',subject:'',theory:'',practical:'',cce:'',maxTheory:'200',maxPractical:'70',maxCCE:'60'}); setErrors({}); }}>Reset</button>
            </div>
          </form>
        </div>
      )}

      {/* ── RESULT SHEET ── */}
      {view === 'Result Sheet' && (
        <div className="exam-card">
          <div className="exam-card-title">Result Sheet</div>
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
            <div className="exam-field" style={{ minWidth:200 }}>
              <label>Search Name / Roll No</label>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type to search..." />
            </div>
          </div>
          <div className="exam-table-wrap">
            <table className="exam-table">
              <thead>
                <tr>
                  <th>Roll No</th><th>Student Name</th><th>Semester</th><th>Batch</th>
                  <th>Session</th><th>Subject</th>
                  <th>Theory</th><th>Practical</th><th>CCE</th>
                  <th>Total</th><th>%</th><th>Result</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={12} className="exam-no-data">No results added yet.</td></tr>
                  : filtered.map((r,i) => (
                    <tr key={i}>
                      <td>{r.rollNo}</td><td>{r.name}</td><td>{r.semester}</td><td>{r.batch}</td>
                      <td style={{ fontSize:12 }}>{r.session}</td><td>{r.subject}</td>
                      <td>{r.theory}/{r.maxTheory}</td>
                      <td>{r.practical}/{r.maxPractical}</td>
                      <td>{r.cce}/{r.maxCCE}</td>
                      <td><strong>{r.total}/{r.max}</strong></td>
                      <td>{r.pct}%</td>
                      <td><span className={`exam-badge ${r.result==='Pass'?'pass':'fail'}`}>{r.result}</span></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="exam-meta">Total Records: {filtered.length}</div>
        </div>
      )}

      {/* ── RESULT SUMMARY ── */}
      {view === 'Result Summary' && (
        <>
          <div className="exam-card">
            <div className="exam-card-title">Overall Summary</div>
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
            <div className="exam-summary-grid">
              <div className="exam-summary-box"><div className="exam-summary-label">Total Students</div><div className="exam-summary-value">{totalStudents}</div></div>
              <div className="exam-summary-box" style={{ background:'#f0fdf4', borderColor:'#bbf7d0' }}><div className="exam-summary-label">Pass</div><div className="exam-summary-value" style={{ color:'#166534' }}>{passCount}</div></div>
              <div className="exam-summary-box" style={{ background:'#fef2f2', borderColor:'#fecaca' }}><div className="exam-summary-label">Fail</div><div className="exam-summary-value" style={{ color:'#991b1b' }}>{failCount}</div></div>
              <div className="exam-summary-box"><div className="exam-summary-label">Pass %</div><div className="exam-summary-value">{totalStudents > 0 ? Math.round((passCount/totalStudents)*100) : 0}%</div></div>
              <div className="exam-summary-box"><div className="exam-summary-label">Total Records</div><div className="exam-summary-value">{filtered.length}</div></div>
            </div>
          </div>
          {subjectStats.length > 0 && (
            <div className="exam-card">
              <div className="exam-card-title">Subject-wise Result</div>
              <div className="exam-table-wrap">
                <table className="exam-table">
                  <thead><tr><th>Subject</th><th>Total</th><th>Pass</th><th>Fail</th><th>Pass %</th></tr></thead>
                  <tbody>
                    {subjectStats.map((s,i) => (
                      <tr key={i}>
                        <td>{s.subject}</td><td>{s.total}</td>
                        <td><span className="exam-badge pass">{s.pass}</span></td>
                        <td><span className="exam-badge fail">{s.fail}</span></td>
                        <td>{s.total > 0 ? Math.round((s.pass/s.total)*100) : 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
