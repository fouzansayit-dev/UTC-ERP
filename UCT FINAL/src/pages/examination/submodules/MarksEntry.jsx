import React, { useState } from 'react';

const SUBJECTS = ['Anatomy','Physiology','Biochemistry','Pathology','Pharmacology','Microbiology','Forensic Medicine','Community Medicine','Ophthalmology','ENT','Medicine','Surgery','Obstetrics & Gynaecology','Paediatrics'];

export default function MarksEntry() {
  const [marks, setMarks]           = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [saved, setSaved]           = useState(false);
  const [rowForm, setRowForm]       = useState({ id:'', name:'', subject:'', paper1:'', paper2:'' });
  const [rowError, setRowError]     = useState('');

  const filtered = marks.filter(m => subjectFilter ? m.subject===subjectFilter : true);

  const handleAddRow = (e) => {
    e.preventDefault();
    if (!rowForm.id.trim()||!rowForm.name.trim()||!rowForm.subject) { setRowError('Roll No, Name and Subject are required.'); return; }
    const paper1=Number(rowForm.paper1)||0, paper2=Number(rowForm.paper2)||0;
    setMarks(prev=>[...prev,{id:rowForm.id,name:rowForm.name,subject:rowForm.subject,paper1,paper2,total:paper1+paper2}]);
    setRowForm({id:'',name:'',subject:'',paper1:'',paper2:''}); setRowError('');
  };

  const handleChange=(index,field,value)=>{
    const updated=[...marks];
    const realIdx=marks.findIndex(m=>m.id===filtered[index].id&&m.subject===filtered[index].subject);
    updated[realIdx]={...updated[realIdx],[field]:Number(value)};
    updated[realIdx].total=(updated[realIdx].paper1||0)+(updated[realIdx].paper2||0);
    setMarks(updated); setSaved(false);
  };

  return (
    <div className="exam-section">
      <div className="exam-card">
        <div className="exam-card-title">Add Student Record</div>
        {rowError && <div className="exam-alert error">{rowError}</div>}
        <form onSubmit={handleAddRow} className="exam-form-grid">
          <div className="exam-field"><label>Roll No <span className="req">*</span></label><input value={rowForm.id} onChange={e=>setRowForm({...rowForm,id:e.target.value})} /></div>
          <div className="exam-field"><label>Student Name <span className="req">*</span></label><input value={rowForm.name} onChange={e=>setRowForm({...rowForm,name:e.target.value})} /></div>
          <div className="exam-field"><label>Subject <span className="req">*</span></label>
            <select value={rowForm.subject} onChange={e=>setRowForm({...rowForm,subject:e.target.value})}>
              <option value="">-- Select --</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="exam-field"><label>Paper I (max 100)</label><input type="number" min={0} max={100} value={rowForm.paper1} onChange={e=>setRowForm({...rowForm,paper1:e.target.value})} /></div>
          <div className="exam-field"><label>Paper II (max 100)</label><input type="number" min={0} max={100} value={rowForm.paper2} onChange={e=>setRowForm({...rowForm,paper2:e.target.value})} /></div>
          <div className="exam-actions"><button type="submit" className="exam-btn primary">Add Row</button></div>
        </form>
      </div>

      <div className="exam-card">
        <div className="exam-row-flex" style={{marginBottom:14,alignItems:'flex-end',gap:12}}>
          <div className="exam-field" style={{minWidth:200}}>
            <label>Filter by Subject</label>
            <select value={subjectFilter} onChange={e=>setSubjectFilter(e.target.value)}>
              <option value="">All Subjects</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {saved && <div className="exam-alert success">Theory marks saved successfully.</div>}
        <div className="exam-table-wrap">
          <table className="exam-table">
            <thead><tr><th>Roll No</th><th>Student Name</th><th>Subject</th><th>Paper I (100)</th><th>Paper II (100)</th><th>Total (200)</th></tr></thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={6} className="exam-no-data">No records. Add students above.</td></tr>
                : filtered.map((row,i)=>(
                  <tr key={i}>
                    <td>{row.id}</td><td>{row.name}</td><td>{row.subject}</td>
                    <td><input type="number" min={0} max={100} value={row.paper1} onChange={e=>handleChange(i,'paper1',e.target.value)} className="exam-mark-input" /></td>
                    <td><input type="number" min={0} max={100} value={row.paper2} onChange={e=>handleChange(i,'paper2',e.target.value)} className="exam-mark-input" /></td>
                    <td><strong>{row.total}</strong></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="exam-actions" style={{marginTop:12}}>
          <button className="exam-btn primary" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}} disabled={marks.length===0}>Save Marks</button>
        </div>
      </div>
    </div>
  );
}
