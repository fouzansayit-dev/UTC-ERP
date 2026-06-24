import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, MONTHS, TblToolbar } from './SessionComponents.jsx';

const INIT = [
  { id: 1, session: '2024-2025', startMonth: 'July', endMonth: 'June', code: '001', status: 'N' },
  { id: 2, session: '2025-2026', startMonth: 'July', endMonth: 'June', code: '002', status: 'Y' },
];

export default function SessionMaster() {
  const [data, setData]     = useState(INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ startYear: '', endYear: '', startMonth: '', endMonth: '', code: '' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r => r.session.includes(search) || r.code.includes(search));

  const submit = e => {
    e.preventDefault();
    if (!form.startYear || !form.endYear) return alert('Start Year and End Year are required.');
    const session = `${form.startYear}-${form.endYear}`;
    if (editId) {
      setData(d => d.map(r => r.id === editId ? { ...r, session, startMonth: form.startMonth, endMonth: form.endMonth, code: form.code } : r));
      setEditId(null);
    } else {
      setData(d => [...d, { id: Date.now(), session, startMonth: form.startMonth, endMonth: form.endMonth, code: form.code, status: 'N' }]);
    }
    setForm({ startYear: '', endYear: '', startMonth: '', endMonth: '', code: '' });
  };

  const startEdit = r => {
    const [sy, ey] = r.session.split('-');
    setForm({ startYear: sy, endYear: ey, startMonth: r.startMonth, endMonth: r.endMonth, code: r.code });
    setEditId(r.id);
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title={editId ? 'Edit Session' : 'Session Master'} />
        <div className="form-grid">
          <FormField label="Start Year" required><Input value={form.startYear} onChange={set('startYear')} placeholder="e.g. 2025" /></FormField>
          <FormField label="End Year"   required><Input value={form.endYear}   onChange={set('endYear')}   placeholder="e.g. 2026" /></FormField>
          <FormField label="Start Month"><Select value={form.startMonth} onChange={set('startMonth')}><option value="">-- Select Month --</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</Select></FormField>
          <FormField label="End Month"><Select value={form.endMonth} onChange={set('endMonth')}><option value="">-- Select Month --</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</Select></FormField>
          <FormField label="Session Code" required><Input value={form.code} onChange={set('code')} placeholder="e.g. 003" /></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setForm({ startYear:'', endYear:'', startMonth:'', endMonth:'', code:'' }); }}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Edit</th><th>Session</th><th>Start Month</th><th>End Month</th><th>Code</th><th>Session Status</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={7} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td><span className="tbl-btn edit" onClick={() => startEdit(r)}>✎ Edit</span></td>
                  <td>{r.session}</td><td>{r.startMonth}</td><td>{r.endMonth}</td>
                  <td style={{ color:'#d97706', fontWeight:600 }}>{r.code}</td>
                  <td style={{ color: r.status==='Y'?'#16a34a':'#dc2626', fontWeight:600 }}>{r.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}
