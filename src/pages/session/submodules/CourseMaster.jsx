import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, TblToolbar } from './SessionComponents.jsx';

const INIT = [
  { id:1, college:'UNIVERSIDADE CATOLICA TIMORENSE', course:'MBBS', type:'UG', examType:'Semester-Yearly', noSem:2 },
  { id:2, college:'UNIVERSIDADE CATOLICA TIMORENSE', course:'MBBS', type:'UG', examType:'Semester', noSem:2 },
];

export default function CourseMaster() {
  const [data, setData]     = useState(INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ college:'UNIVERSIDADE CATOLICA TIMOR', course:'', courseType:'UG', examType:'Semester', noSem:'', yearSem:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r => r.course.toLowerCase().includes(search.toLowerCase()) || r.college.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!form.course) return alert('Course name is required.');
    if (editId) {
      setData(d => d.map(r => r.id === editId ? { ...r, college: form.college, course: form.course, type: form.courseType, examType: form.examType, noSem: form.noSem } : r));
      setEditId(null);
    } else {
      setData(d => [...d, { id: Date.now(), college: form.college, course: form.course.toUpperCase(), type: form.courseType, examType: form.examType, noSem: form.noSem }]);
    }
    setForm({ college:'UNIVERSIDADE CATOLICA TIMOR', course:'', courseType:'UG', examType:'Semester', noSem:'', yearSem:'' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add Course" />
        <div className="form-grid">
          <FormField label="College"><Select value={form.college} onChange={set('college')}><option>UNIVERSIDADE CATOLICA TIMOR</option><option>Other College</option></Select></FormField>
          <FormField label="Course" required><Input value={form.course} onChange={set('course')} placeholder="Course name" /></FormField>
          <FormField label="Course Type"><Select value={form.courseType} onChange={set('courseType')}><option>UG</option><option>PG</option><option>Diploma</option></Select></FormField>
          <FormField label="Exam Type"><Select value={form.examType} onChange={set('examType')}><option>Semester</option><option>Yearly</option><option>Semester-Yearly</option></Select></FormField>
          <FormField label="No of Semester/Year"><Input value={form.noSem} onChange={set('noSem')} placeholder="e.g. 2" /></FormField>
          <FormField label="Year/Semester"><Select value={form.yearSem} onChange={set('yearSem')}><option value="">None selected</option><option>I Year</option><option>II Year</option><option>III Year</option></Select></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setForm({ college:'UNIVERSIDADE CATOLICA TIMOR', course:'', courseType:'UG', examType:'Semester', noSem:'', yearSem:'' }); }}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Edit</th><th>College</th><th>Course</th><th>Course Type</th><th>Exam Type</th><th>No of Sem/Year</th></tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td>
                <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setForm({ college:r.college, course:r.course, courseType:r.type, examType:r.examType, noSem:r.noSem, yearSem:'' }); }}>✎ Edit</span></td>
                <td>{r.college}</td><td style={{ fontWeight:600 }}>{r.course}</td><td>{r.type}</td><td>{r.examType}</td><td>{r.noSem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}
