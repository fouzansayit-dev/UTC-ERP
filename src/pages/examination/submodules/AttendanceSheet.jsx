import React, { useState } from 'react';

const SUBJECTS = ['Anatomy','Physiology','Biochemistry','Pathology','Pharmacology','Microbiology','Forensic Medicine','Community Medicine','Ophthalmology','ENT','Medicine','Surgery','Obstetrics & Gynaecology','Paediatrics'];

export default function AttendanceSheet() {
  const [records, setRecords] = useState([]);
  const [subjectView, setSubjectView] = useState('');
  const [form, setForm]   = useState({ id:'', name:'', subject:'', total:'', attended:'' });
  const [errors, setErrors] = useState({});
  const [msg, setMsg]     = useState('');

  const filtered = records.filter(r => subjectView ? r.subject===subjectView : true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.id.trim())    errs.id       = 'Roll No is required.';
    if (!form.name.trim())  errs.name     = 'Name is required.';
    if (!form.subject)      errs.subject  = 'Subject is required.';
    if (!form.total)        errs.total    = 'Total classes required.';
    if (!form.attended)     errs.attended = 'Attended classes required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const total=Number(form.total), attended=Number(form.attended);
    const pct = total>0 ? Math.round((attended/total)*100) : 0;
    setRecords(prev=>[...prev,{id:form.id,name:form.name,subject:form.subject,total,attended,pct,eligible:pct>=75}]);
    setForm({id:'',name:'',subject:'',total:'',attended:''}); setErrors({});
    setMsg('Attendance record added.');
    setTimeout(()=>setMsg(''),3000);
  };

  return (
    <div className="exam-section">
      <div className="exam-card">
        <div className="exam-card-title">Add Attendance Record</div>
        {msg && <div className="exam-alert success">{msg}</div>}
        <form onSubmit={handleSubmit} className="exam-form-grid">
          <div className="exam-field"><label>Roll No <span className="req">*</span></label><input value={form.id} onChange={e=>setForm({...form,id:e.target.value})} />{errors.id&&<span className="exam-error">{errors.id}</span>}</div>
          <div className="exam-field"><label>Student Name <span className="req">*</span></label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />{errors.name&&<span className="exam-error">{errors.name}</span>}</div>
          <div className="exam-field"><label>Subject <span className="req">*</span></label>
            <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
              <option value="">-- Select --</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}
            </select>
            {errors.subject&&<span className="exam-error">{errors.subject}</span>}
          </div>
          <div className="exam-field"><label>Total Classes <span className="req">*</span></label><input type="number" min={0} value={form.total} onChange={e=>setForm({...form,total:e.target.value})} />{errors.total&&<span className="exam-error">{errors.total}</span>}</div>
          <div className="exam-field"><label>Classes Attended <span className="req">*</span></label><input type="number" min={0} value={form.attended} onChange={e=>setForm({...form,attended:e.target.value})} />{errors.attended&&<span className="exam-error">{errors.attended}</span>}</div>
          <div className="exam-actions">
            <button type="submit" className="exam-btn primary">Add Record</button>
            <button type="button" className="exam-btn secondary" onClick={()=>{setForm({id:'',name:'',subject:'',total:'',attended:''});setErrors({});}}>Reset</button>
          </div>
        </form>
      </div>

      <div className="exam-card">
        <div className="exam-row-flex" style={{marginBottom:14,alignItems:'flex-end',gap:12}}>
          <div className="exam-field" style={{minWidth:220}}>
            <label>Filter by Subject</label>
            <select value={subjectView} onChange={e=>setSubjectView(e.target.value)}>
              <option value="">-- All Subjects --</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="exam-table-wrap">
          <table className="exam-table">
            <thead><tr><th>Roll No</th><th>Student Name</th><th>Subject</th><th>Total Classes</th><th>Attended</th><th>Attendance %</th><th>Eligible for Exam</th></tr></thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={7} className="exam-no-data">No records. Add students above.</td></tr>
                : filtered.map((r,i)=>(
                  <tr key={i}>
                    <td>{r.id}</td><td>{r.name}</td><td>{r.subject}</td>
                    <td>{r.total}</td><td>{r.attended}</td><td>{r.pct}%</td>
                    <td><span className={`exam-badge ${r.eligible?'pass':'fail'}`}>{r.eligible?'Eligible':'Not Eligible'}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="exam-meta">
          Eligible: {filtered.filter(r=>r.eligible).length} &nbsp;|&nbsp;
          Not Eligible: {filtered.filter(r=>!r.eligible).length} &nbsp;|&nbsp;
          Minimum Attendance: 75%
        </div>
      </div>
    </div>
  );
}
