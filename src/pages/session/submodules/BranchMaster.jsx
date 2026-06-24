import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, TblToolbar } from './SessionComponents.jsx';

const INIT = [{ id:1, course:'MBBS', branchName:'MEDICINE', branchCode:'IMBBS2024', noSeat:129 }];

export default function BranchMaster() {
  const [data, setData]     = useState(INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ course:'', branchName:'', branchCode:'', noSeat:'', subject:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r => r.branchName.toLowerCase().includes(search.toLowerCase()) || r.course.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!form.branchName || !form.branchCode) return alert('Branch Name and Code are required.');
    if (editId) {
      setData(d => d.map(r => r.id === editId ? { ...r, ...form, noSeat: +form.noSeat } : r));
      setEditId(null);
    } else {
      setData(d => [...d, { id: Date.now(), course: form.course, branchName: form.branchName.toUpperCase(), branchCode: form.branchCode, noSeat: +form.noSeat }]);
    }
    setForm({ course:'', branchName:'', branchCode:'', noSeat:'', subject:'' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add New Branch" />
        <div className="form-grid">
          <FormField label="Course"><Select value={form.course} onChange={set('course')}><option value="">Select</option><option>MBBS</option><option>BDS</option><option>B.Sc Nursing</option></Select></FormField>
          <FormField label="Branch Name" required><Input value={form.branchName} onChange={set('branchName')} placeholder="Branch name" /></FormField>
          <FormField label="Branch Code" required><Input value={form.branchCode} onChange={set('branchCode')} placeholder="e.g. IMBBS2024" /></FormField>
          <FormField label="No of Seat"><Input type="number" value={form.noSeat} onChange={set('noSeat')} placeholder="e.g. 150" /></FormField>
          <FormField label="Subject"><Select value={form.subject} onChange={set('subject')}><option value="">Select</option><option>Anatomy</option><option>Biochemistry</option><option>Physiology</option></Select></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="button" className="submit-btn" style={{ background:'#16a34a' }} onClick={() => alert("Action")}>Add Subject</button>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setForm({ course:'', branchName:'', branchCode:'', noSeat:'', subject:'' }); }}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Edit</th><th>Course</th><th>Branch Name</th><th>Branch Code</th><th>No of Seats</th></tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td>
                <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setForm({ course:r.course, branchName:r.branchName, branchCode:r.branchCode, noSeat:r.noSeat, subject:'' }); }}>✎ Edit</span></td>
                <td>{r.course}</td><td style={{ fontWeight:600 }}>{r.branchName}</td><td>{r.branchCode}</td><td>{r.noSeat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}
