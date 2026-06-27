import React, { useState, useEffect } from 'react';
import { iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

const PARTY_TYPES = ['Supplier','Vendor','Foreign University','Agent','Other'];

export default function PartyMaster() {
  const [form,   setForm]   = useState({ firm:'', name:'', mobile:'', address:'', type:'Supplier' });
  const [rows,   setRows]   = useState([]);
  const [search, setSearch] = useState('');
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/generic/accounts/parties')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRows(data);
      })
      .catch(err => console.error('Error loading parties:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = () => {
    if (!form.name.trim()) { alert('Name is required.'); return; }
    const entry = { id: Date.now(), ...form, status:'Active' };
    const updated = [...rows, entry];

    fetch('/api/generic/accounts/parties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(res => res.json())
      .then(() => {
        setRows(updated);
        setForm({ firm:'', name:'', mobile:'', address:'', type:'Supplier' });
        alert('Party saved successfully.');
      })
      .catch(err => alert('Failed to save party: ' + err.message));
  };

  const filtered = rows.filter(r => (r.name + r.firm).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="hr-form">
      <div className="section-title">Party Master</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Add New Party" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>Firm Name</span><div style={{ flex:1, maxWidth:340 }}><input style={iS} value={form.firm} onChange={set('firm')} /></div></div>
          <div style={rS}><span style={lbS}>Name <span style={{ color:'#dc2626' }}>*</span></span><div style={{ flex:1, maxWidth:340 }}><input style={iS} value={form.name} onChange={set('name')} /></div></div>
          <div style={rS}><span style={lbS}>Party Type</span>
            <div style={{ flex:1, maxWidth:340 }}>
              <select style={iS} value={form.type} onChange={set('type')}>
                {PARTY_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={rS}><span style={lbS}>Mobile No</span><div style={{ flex:1, maxWidth:340 }}><input style={iS} value={form.mobile} onChange={set('mobile')} /></div></div>
          <div style={rS}><span style={lbS}>Address</span><div style={{ flex:1, maxWidth:340 }}><textarea style={{ ...iS, height:70, resize:'vertical' }} value={form.address} onChange={set('address')} /></div></div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="table-wrap">
        <TableToolbar search={search} onSearch={setSearch} />
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Firm Name</th><th>Name</th><th>Type</th><th>Mobile No</th><th>Address</th><th>Status</th><th>Edit</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <EmptyRow cols={8} /> : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td><td>{r.firm}</td><td>{r.name}</td><td>{r.type}</td><td>{r.mobile}</td><td>{r.address}</td>
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
