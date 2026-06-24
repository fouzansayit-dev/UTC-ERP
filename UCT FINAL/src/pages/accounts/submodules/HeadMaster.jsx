import React, { useState } from 'react';
import { iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

const DEFAULT_HEADS = [
  { id:1, head:'Construction', status:'Active' },
  { id:2, head:'Expenses',     status:'Active' },
  { id:3, head:'Salary',       status:'Active' },
  { id:4, head:'Unio Hostel',  status:'Active' },
  { id:5, head:'Agent Commission',     status:'Active' },
  { id:6, head:'Forex Remittance',     status:'Active' },
  { id:7, head:'Abroad University Fee',status:'Active' },
];

export default function HeadMaster() {
  const [form,   setForm]   = useState({ head:'' });
  const [rows,   setRows]   = useState(DEFAULT_HEADS);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  const handleSubmit = () => {
    if (!form.head.trim()) { alert('Head name is required.'); return; }
    if (editId) {
      setRows(p => p.map(r => r.id === editId ? { ...r, head: form.head } : r));
      setEditId(null);
    } else {
      setRows(p => [...p, { id: Date.now(), head: form.head, status:'Active' }]);
    }
    setForm({ head:'' });
  };

  const filtered = rows.filter(r => r.head.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="hr-form">
      <div className="section-title">Head Master</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title={editId ? 'Edit Head' : 'Add New Head'} />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}>
            <span style={lbS}>Head</span>
            <div style={{ flex:1, maxWidth:340 }}>
              <input style={iS} value={form.head} onChange={e => setForm({ head: e.target.value })} placeholder="e.g. Construction" />
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm({ head:'' }); }}
                style={{ padding:'8px 16px', border:'1px solid #d1d5db', borderRadius:6, background:'#fff', cursor:'pointer', fontSize:13 }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <TableToolbar search={search} onSearch={setSearch} />
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Head</th><th>Status</th><th>Edit</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <EmptyRow cols={4} /> : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td><td>{r.head}</td>
                <td><span style={{ background:'#dcfce7', color:'#16a34a', padding:'2px 8px', borderRadius:10, fontSize:11 }}>{r.status}</span></td>
                <td>
                  <button className="tbl-btn view" style={{ background:'#e0f2fe', color:'#0369a1' }}
                    onClick={() => { setEditId(r.id); setForm({ head: r.head }); }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing {filtered.length} of {rows.length} entries</div>
      </div>
    </div>
  );
}
