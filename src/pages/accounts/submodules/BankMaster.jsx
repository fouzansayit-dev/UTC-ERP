import React, { useState, useEffect } from 'react';
import { COLLEGE, iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function BankMaster() {
  const [form, setForm] = useState({ holder:'', bank:'', accNo:'', opening:'', payMode:'None selected' });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/generic/accounts/banks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRows(data);
      })
      .catch(err => console.error('Error loading banks:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = () => {
    if (!form.holder || !form.bank) { alert('Account Holder Name and Bank Name are required.'); return; }
    const entry = { id: Date.now(), ...form, status:'Active', closing: form.opening || 0 };
    const updated = [...rows, entry];

    fetch('/api/generic/accounts/banks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(res => res.json())
      .then(() => {
        setRows(updated);
        setForm({ holder:'', bank:'', accNo:'', opening:'', payMode:'None selected' });
        alert('Bank saved successfully.');
      })
      .catch(err => alert('Failed to save bank: ' + err.message));
  };

  const filtered = rows.filter(r =>
    r.bank.toLowerCase().includes(search.toLowerCase()) ||
    r.holder.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Bank Master</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Add New Bank" />
        <div style={{ padding:'20px 24px', background:'#fff' }}>
          {[['holder','Account Holder Name'],['bank','Bank Name'],['accNo','Account No'],['opening','Opening Balance']].map(([k, label]) => (
            <div key={k} style={rS}>
              <span style={lbS}>{label}</span>
              <div style={{ flex:1, maxWidth:340 }}><input style={iS} value={form[k]} onChange={set(k)} /></div>
            </div>
          ))}
          <div style={rS}>
            <span style={lbS}>Payment Mode</span>
            <div style={{ flex:1, maxWidth:340 }}>
              <select style={iS} value={form.payMode} onChange={set('payMode')}>
                <option>None selected</option><option>Cash</option><option>Cheque</option><option>Online</option><option>DD</option>
              </select>
            </div>
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="table-wrap">
        <TableToolbar search={search} onSearch={setSearch} />
        <table className="hr-table">
          <thead>
            <tr><th>SNo.</th><th>Account Holder Name</th><th>Bank Name</th><th>Account No</th><th>Status</th><th>Opening Balance</th><th>Today's Closing</th><th>Payment Mode</th><th>Edit</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? <EmptyRow cols={9} /> : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td><td>{r.holder}</td><td>{r.bank}</td><td>{r.accNo}</td>
                <td><span style={{ background:'#dcfce7', color:'#16a34a', padding:'2px 8px', borderRadius:10, fontSize:11 }}>{r.status}</span></td>
                <td>₹{r.opening || 0}</td><td>₹{r.closing || 0}</td><td>{r.payMode}</td>
                <td><button className="tbl-btn view" style={{ background:'#e0f2fe', color:'#0369a1' }}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing {filtered.length} of {rows.length} entries</div>
      </div>
    </div>
  );
}
