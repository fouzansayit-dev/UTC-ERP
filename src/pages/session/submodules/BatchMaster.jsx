import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, TblToolbar } from './SessionComponents.jsx';

const INIT = [
  { id:1, course:'MBBS', batch:'2024-2030', session:'2024-2025', status:'Active' },
  { id:2, course:'MBBS', batch:'2025-2031', session:'2025-2026', status:'Active' },
];

export default function BatchMaster() {
  const [data, setData]     = useState(INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ course:'', startBatch:'', endBatch:'', session:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r => r.batch.includes(search) || r.course.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!form.startBatch || !form.endBatch) return alert('Start and End Batch are required.');
    const batch = `${form.startBatch}-${form.endBatch}`;
    if (editId) {
      setData(d => d.map(r => r.id === editId ? { ...r, course: form.course, batch, session: form.session } : r));
      setEditId(null);
    } else {
      setData(d => [...d, { id: Date.now(), course: form.course, batch, session: form.session, status: 'Active' }]);
    }
    setForm({ course:'', startBatch:'', endBatch:'', session:'' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add New Batch" />
        <div className="form-grid">
          <FormField label="Course"><Select value={form.course} onChange={set('course')}><option value="">None selected</option><option>MBBS</option><option>BDS</option><option>B.Sc Nursing</option></Select></FormField>
          <FormField label="Start Batch" required><Input value={form.startBatch} onChange={set('startBatch')} placeholder="e.g. 2025" /></FormField>
          <FormField label="End Batch"   required><Input value={form.endBatch}   onChange={set('endBatch')}   placeholder="e.g. 2031" /></FormField>
          <FormField label="Session"><Select value={form.session} onChange={set('session')}><option value="">None selected</option><option>2024-2025</option><option>2025-2026</option></Select></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setForm({ course:'', startBatch:'', endBatch:'', session:'' }); }}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Edit</th><th>Course</th><th>Batch</th><th>Session</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td>
                <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); const [s,e]=r.batch.split('-'); setForm({ course:r.course, startBatch:s, endBatch:e, session:r.session }); }}>✎ Edit</span></td>
                <td>{r.course}</td><td style={{ fontWeight:600 }}>{r.batch}</td><td>{r.session}</td>
                <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}
