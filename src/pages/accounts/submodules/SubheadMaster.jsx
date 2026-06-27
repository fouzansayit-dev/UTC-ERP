import React, { useState, useEffect } from 'react';
import { iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

const DEFAULT_HEADS = ['Construction','Expenses','Salary','Unio Hostel','Agent Commission','Forex Remittance','Abroad University Fee'];

export default function SubheadMaster() {
  const [form,   setForm]   = useState({ head:'', subhead:'' });
  const [rows,   setRows]   = useState([]);
  const [heads,  setHeads]  = useState([]);
  const [search, setSearch] = useState('');
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    // Load Heads
    fetch('/api/generic/accounts/heads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setHeads(data.map(h => h.head));
        } else {
          setHeads(DEFAULT_HEADS);
        }
      })
      .catch(err => {
        console.error('Error loading heads:', err);
        setHeads(DEFAULT_HEADS);
      });

    // Load Subheads
    fetch('/api/generic/accounts/subheads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRows(data);
      })
      .catch(err => console.error('Error loading subheads:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = () => {
    if (!form.head || !form.subhead) { alert('Head and Sub Head Name are required.'); return; }
    const entry = { id: Date.now(), ...form, status:'Active' };
    const updated = [...rows, entry];

    fetch('/api/generic/accounts/subheads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(res => res.json())
      .then(() => {
        setRows(updated);
        setForm({ head:'', subhead:'' });
        alert('Subhead saved successfully.');
      })
      .catch(err => alert('Failed to save subhead: ' + err.message));
  };

  const filtered = rows.filter(r => r.subhead.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="hr-form">
      <div className="section-title">Subhead Master</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Subhead Master" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>Head Name</span>
            <div style={{ flex:1, maxWidth:340 }}>
              <select style={iS} value={form.head} onChange={set('head')}>
                <option value="">Select</option>
                {heads.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
          </div>
          <div style={rS}><span style={lbS}>Sub Head Name</span><div style={{ flex:1, maxWidth:340 }}><input style={iS} value={form.subhead} onChange={set('subhead')} /></div></div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="table-wrap">
        <TableToolbar search={search} onSearch={setSearch} />
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Head</th><th>SubHead</th><th>Status</th><th>Edit</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <EmptyRow cols={5} /> : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td><td>{r.head}</td><td>{r.subhead}</td>
                <td><span style={{ background:'#dcfce7', color:'#16a34a', padding:'2px 8px', borderRadius:10, fontSize:11 }}>{r.status}</span></td>
                <td><button className="tbl-btn view" style={{ background:'#e0f2fe', color:'#0369a1' }}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing {filtered.length} entries</div>
      </div>
    </div>
  );
}
