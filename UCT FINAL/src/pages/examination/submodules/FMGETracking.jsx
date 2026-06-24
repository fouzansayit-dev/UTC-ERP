import React, { useState } from 'react';

const REG_STATUS_OPTS = ['Registered','Not Registered','Applied'];
const RESULT_OPTS     = ['Pass','Fail','Pending','N/A'];

export default function FMGETracking() {
  const [students, setStudents] = useState([]);
  const [records, setRecords]   = useState([]);
  const [studentForm, setStudentForm] = useState({ id:'', name:'' });
  const [form, setForm]   = useState({ studentId:'', registrationStatus:'', attemptDate:'', result:'' });
  const [errors, setErrors] = useState({});
  const [msg, setMsg]     = useState({ text:'', type:'' });

  const studentOpts = students.map(s=>({value:s.id,label:`${s.id} — ${s.name}`}));

  const addStudent = (e) => {
    e.preventDefault();
    if (!studentForm.id.trim()||!studentForm.name.trim()) return;
    setStudents(prev=>[...prev,{id:studentForm.id,name:studentForm.name}]);
    setStudentForm({id:'',name:''});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs={};
    if (!form.studentId)          errs.studentId          = 'Student is required.';
    if (!form.registrationStatus) errs.registrationStatus = 'Registration status is required.';
    if (!form.result)             errs.result             = 'Result status is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const student = students.find(s=>s.id===form.studentId);
    const newRec  = {id:student.id,name:student.name,registrationStatus:form.registrationStatus,attemptDate:form.attemptDate||'—',result:form.result};
    const idx = records.findIndex(r=>r.id===form.studentId);
    if (idx>=0) { const u=[...records]; u[idx]=newRec; setRecords(u); }
    else setRecords(prev=>[...prev,newRec]);
    setForm({studentId:'',registrationStatus:'',attemptDate:'',result:''});
    setErrors({});
    setMsg({text:`FMGE/NExT record saved for ${student.name}.`,type:'success'});
    setTimeout(()=>setMsg({text:'',type:''}),3000);
  };

  return (
    <div className="exam-section">
      <div className="exam-card">
        <div className="exam-card-title">Add Abroad Student</div>
        <form onSubmit={addStudent} className="exam-form-grid">
          <div className="exam-field"><label>Roll No <span className="req">*</span></label><input value={studentForm.id} onChange={e=>setStudentForm({...studentForm,id:e.target.value})} /></div>
          <div className="exam-field"><label>Student Name <span className="req">*</span></label><input value={studentForm.name} onChange={e=>setStudentForm({...studentForm,name:e.target.value})} /></div>
          <div className="exam-actions"><button type="submit" className="exam-btn primary">Add Student</button></div>
        </form>
      </div>

      <div className="exam-card">
        <div className="exam-card-title">Add / Update Tracking Record <span className="exam-new-badge"></span></div>
        <p className="exam-hint">Track screening exam registration, attempt date, and pass/fail status for returning abroad students.</p>
        {msg.text && <div className={`exam-alert ${msg.type}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit} className="exam-form-grid">
          <div className="exam-field">
            <label>Select Student <span className="req">*</span></label>
            <select value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})}>
              <option value="">-- Select --</option>{studentOpts.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.studentId&&<span className="exam-error">{errors.studentId}</span>}
          </div>
          <div className="exam-field">
            <label>Registration Status <span className="req">*</span></label>
            <select value={form.registrationStatus} onChange={e=>setForm({...form,registrationStatus:e.target.value})}>
              <option value="">-- Select --</option>{REG_STATUS_OPTS.map(s=><option key={s}>{s}</option>)}
            </select>
            {errors.registrationStatus&&<span className="exam-error">{errors.registrationStatus}</span>}
          </div>
          <div className="exam-field">
            <label>Attempt Date</label>
            <input type="date" value={form.attemptDate} onChange={e=>setForm({...form,attemptDate:e.target.value})} />
          </div>
          <div className="exam-field">
            <label>Pass / Fail Status <span className="req">*</span></label>
            <select value={form.result} onChange={e=>setForm({...form,result:e.target.value})}>
              <option value="">-- Select --</option>{RESULT_OPTS.map(s=><option key={s}>{s}</option>)}
            </select>
            {errors.result&&<span className="exam-error">{errors.result}</span>}
          </div>
          <div className="exam-actions">
            <button type="submit" className="exam-btn primary">Save Record</button>
            <button type="button" className="exam-btn secondary" onClick={()=>{setForm({studentId:'',registrationStatus:'',attemptDate:'',result:''});setErrors({});}}>Reset</button>
          </div>
        </form>
      </div>

      <div className="exam-card">
        <div className="exam-card-title">FMGE / NExT Student Records</div>
        <div className="exam-table-wrap">
          <table className="exam-table">
            <thead><tr><th>Roll No</th><th>Student Name</th><th>Registration Status</th><th>Attempt Date</th><th>Result</th></tr></thead>
            <tbody>
              {records.length===0
                ? <tr><td colSpan={5} className="exam-no-data">No records yet.</td></tr>
                : records.map((r,i)=>(
                  <tr key={i}>
                    <td>{r.id}</td><td>{r.name}</td><td>{r.registrationStatus}</td><td>{r.attemptDate}</td>
                    <td><span className={`exam-badge ${r.result==='Pass'?'pass':r.result==='Fail'?'fail':'info'}`}>{r.result}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="exam-meta">
          Registered: {records.filter(r=>r.registrationStatus==='Registered').length} &nbsp;|&nbsp;
          Pass: {records.filter(r=>r.result==='Pass').length} &nbsp;|&nbsp;
          Fail: {records.filter(r=>r.result==='Fail').length}
        </div>
      </div>
    </div>
  );
}
