import React, { useState } from 'react';

const SEM_OPTS = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];

export default function AbroadResultUpload() {
  const [students, setStudents] = useState([]);
  const [results, setResults]   = useState([]);
  const [studentForm, setStudentForm] = useState({ id:'', name:'' });
  const [form, setForm]   = useState({ studentId:'', university:'', semester:'', file:null });
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
    if (!form.studentId)         errs.studentId  = 'Student is required.';
    if (!form.university.trim()) errs.university = 'University is required.';
    if (!form.semester)          errs.semester   = 'Semester is required.';
    if (!form.file)              errs.file       = 'Grade sheet file is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const student = students.find(s=>s.id===form.studentId);
    setResults(prev=>[...prev,{
      id:student.id,name:student.name,university:form.university,
      semester:form.semester,gradeSheet:form.file.name,
      uploadedOn:new Date().toLocaleDateString(),status:'Pending',
    }]);
    setForm({studentId:'',university:'',semester:'',file:null});
    document.getElementById('abroad-file-input').value='';
    setErrors({});
    setMsg({text:'Grade sheet uploaded successfully. Stored in DMS.',type:'success'});
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
        <div className="exam-card-title">Upload Semester Result (Foreign University) <span className="exam-new-badge"></span></div>
        <p className="exam-hint">Coordinator uploads semester results received from abroad. Grade sheets are stored in Document Management System (DMS).</p>
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
            <label>Foreign University Name <span className="req">*</span></label>
            <input value={form.university} onChange={e=>setForm({...form,university:e.target.value})} />
            {errors.university&&<span className="exam-error">{errors.university}</span>}
          </div>
          <div className="exam-field">
            <label>Semester <span className="req">*</span></label>
            <select value={form.semester} onChange={e=>setForm({...form,semester:e.target.value})}>
              <option value="">-- Select --</option>{SEM_OPTS.map(s=><option key={s}>{s}</option>)}
            </select>
            {errors.semester&&<span className="exam-error">{errors.semester}</span>}
          </div>
          <div className="exam-field">
            <label>Grade Sheet (PDF/Image) <span className="req">*</span></label>
            <input id="abroad-file-input" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>setForm({...form,file:e.target.files[0]||null})} />
            {errors.file&&<span className="exam-error">{errors.file}</span>}
          </div>
          <div className="exam-actions">
            <button type="submit" className="exam-btn primary">Upload Result</button>
            <button type="button" className="exam-btn secondary" onClick={()=>{setForm({studentId:'',university:'',semester:'',file:null});setErrors({});}}>Reset</button>
          </div>
        </form>
      </div>

      <div className="exam-card">
        <div className="exam-card-title">Uploaded Results</div>
        <div className="exam-table-wrap">
          <table className="exam-table">
            <thead><tr><th>Roll No</th><th>Student Name</th><th>Foreign University</th><th>Semester</th><th>Grade Sheet File</th><th>Uploaded On</th><th>Status</th></tr></thead>
            <tbody>
              {results.length===0
                ? <tr><td colSpan={7} className="exam-no-data">No results uploaded yet.</td></tr>
                : results.map((r,i)=>(
                  <tr key={i}>
                    <td>{r.id}</td><td>{r.name}</td><td>{r.university}</td>
                    <td>{r.semester}</td><td>{r.gradeSheet}</td><td>{r.uploadedOn}</td>
                    <td><span className="exam-badge info">{r.status}</span></td>
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
