import React, { useState } from 'react';

const SUBJECTS = ['Anatomy','Physiology','Biochemistry','Pathology','Pharmacology','Microbiology','Forensic Medicine','Community Medicine'];

const blankForm = () => Object.fromEntries([['id',''],['name',''],...SUBJECTS.map(s=>[s,''])]);

export default function ScholarRegister() {
  const [records, setRecords] = useState([]);
  const [search, setSearch]   = useState('');
  const [form, setForm]       = useState(blankForm());
  const [errors, setErrors]   = useState({});
  const [msg, setMsg]         = useState('');

  const filtered = records.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.id.trim())   errs.id   = 'Roll No is required.';
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const subjectMarks = Object.fromEntries(SUBJECTS.map(s=>[s,Number(form[s])||0]));
    const total = Object.values(subjectMarks).reduce((a,b)=>a+b,0);
    const result = total >= SUBJECTS.length*200*0.5 ? 'Pass' : 'Fail';
    setRecords(prev=>[...prev,{id:form.id,name:form.name,...subjectMarks,result}]);
    setForm(blankForm()); setErrors({});
    setMsg('Scholar register entry added.');
    setTimeout(()=>setMsg(''),3000);
  };

  return (
    <div className="exam-section">
      <div className="exam-card">
        <div className="exam-card-title">Add Student Record</div>
        {msg && <div className="exam-alert success">{msg}</div>}
        <form onSubmit={handleSubmit} className="exam-form-grid">
          <div className="exam-field">
            <label>Roll No <span className="req">*</span></label>
            <input value={form.id} onChange={e=>setForm({...form,id:e.target.value})} />
            {errors.id && <span className="exam-error">{errors.id}</span>}
          </div>
          <div className="exam-field">
            <label>Student Name <span className="req">*</span></label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            {errors.name && <span className="exam-error">{errors.name}</span>}
          </div>
          {SUBJECTS.map(s=>(
            <div key={s} className="exam-field">
              <label>{s} (max 200)</label>
              <input type="number" min={0} max={200} value={form[s]} onChange={e=>setForm({...form,[s]:e.target.value})} />
            </div>
          ))}
          <div className="exam-actions">
            <button type="submit" className="exam-btn primary">Add to Register</button>
            <button type="button" className="exam-btn secondary" onClick={()=>{setForm(blankForm());setErrors({});}}>Reset</button>
          </div>
        </form>
      </div>

      <div className="exam-card">
        <div className="exam-field" style={{marginBottom:14,maxWidth:300}}>
          <label>Search by Name / Roll No</label>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Type to search..." />
        </div>
        <div className="exam-table-wrap">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Roll No</th><th>Student Name</th>
                {SUBJECTS.map(s=><th key={s}>{s} (200)</th>)}
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={SUBJECTS.length+3} className="exam-no-data">No records found.</td></tr>
                : filtered.map((row,i)=>(
                  <tr key={i}>
                    <td>{row.id}</td><td>{row.name}</td>
                    {SUBJECTS.map(s=><td key={s}>{row[s]}</td>)}
                    <td><span className={`exam-badge ${row.result==='Pass'?'pass':'fail'}`}>{row.result}</span></td>
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
