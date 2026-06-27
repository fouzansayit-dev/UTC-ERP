import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

const DEFAULT_HEADS = ['Construction','Expenses','Salary','Unio Hostel','Agent Commission','Forex Remittance','Abroad University Fee'];

export default function BillEntry() {
  const [heads, setHeads] = useState([]);
  const [subheads, setSubheads] = useState([]);
  const [parties, setParties] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ head:'', subhead:'', party:'', billNo:'', billDate:TODAY, amount:'', entryDate:TODAY, remarks:'' });
  
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    // Load Heads
    fetch('/api/generic/accounts/heads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setHeads(data.map(h => h.head));
        else setHeads(DEFAULT_HEADS);
      })
      .catch(() => setHeads(DEFAULT_HEADS));

    // Load Subheads
    fetch('/api/generic/accounts/subheads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSubheads(data);
      })
      .catch(err => console.error('Error loading subheads:', err));

    // Load Parties
    fetch('/api/generic/accounts/parties')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setParties(data);
      })
      .catch(err => console.error('Error loading parties:', err));

    // Load Bills
    fetch('/api/generic/accounts/bills')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRows(data);
      })
      .catch(err => console.error('Error loading bills:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = () => {
    if (!form.head || !form.billNo || !form.amount) { alert('Head, Bill No and Amount are required.'); return; }
    const entry = { id: Date.now(), ...form };
    const updated = [...rows, entry];

    fetch('/api/generic/accounts/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(res => res.json())
      .then(() => {
        setRows(updated);
        setForm({ head:'', subhead:'', party:'', billNo:'', billDate:TODAY, amount:'', entryDate:TODAY, remarks:'' });
        alert('Bill saved successfully.');
      })
      .catch(err => alert('Failed to save bill: ' + err.message));
  };

  const filteredSubheads = subheads.filter(s => s.head === form.head);

  return (
    <div className="hr-form">
      <div className="section-title">Bill Entry</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Bill Entry" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:420 }}><select style={iS}><option>{COLLEGE}</option></select></div></div>
          <div style={rS}><span style={lbS}>Head Name <span style={{ color:'#dc2626' }}>*</span></span>
            <div style={{ flex:1, maxWidth:420 }}>
              <select style={iS} value={form.head} onChange={set('head')}>
                <option value="">Select Head</option>
                {heads.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
          <div style={rS}><span style={lbS}>Subhead Name</span>
            <div style={{ flex:1, maxWidth:420 }}>
              <select style={iS} value={form.subhead} onChange={set('subhead')}>
                <option value="">Select Subhead</option>
                {filteredSubheads.map(s => <option key={s.id} value={s.subhead}>{s.subhead}</option>)}
              </select>
            </div>
          </div>
          <div style={rS}><span style={lbS}>Party Name</span>
            <div style={{ flex:1, maxWidth:420 }}>
              <select style={iS} value={form.party} onChange={set('party')}>
                <option value="">Select Party</option>
                {parties.map(p => <option key={p.id} value={p.name}>{p.name} {p.firm ? `(${p.firm})` : ''}</option>)}
              </select>
            </div>
          </div>
          {[['billNo','Bill No'],['billDate','Bill Date','date'],['amount','Net Amount','number'],['entryDate','Entry Date','date']].map(([k, label, type='text']) => (
            <div key={k} style={rS}><span style={lbS}>{label}</span><div style={{ flex:1, maxWidth:420 }}><input style={iS} type={type} value={form[k]} onChange={set(k)} /></div></div>
          ))}
          <div style={rS}><span style={lbS}>Remarks</span><div style={{ flex:1, maxWidth:420 }}><textarea style={{ ...iS, height:70 }} value={form.remarks} onChange={set('remarks')} /></div></div>
          <div style={rS}><span style={lbS}>Scan Bill</span>
            <div style={{ flex:1, maxWidth:420 }}>
              <input type="file" style={{ fontSize:13 }} accept=".jpg,.png,.jpeg,.gif,.webp,.pdf" />
              <div style={{ fontSize:11, color:'#dc2626', marginTop:3 }}>Files Supported: JPG | PNG | JPEG | GIF | WEBP | PDF</div>
            </div>
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      {rows.length > 0 && (
        <div className="table-wrap">
          <TableToolbar title="UCT ERP Recorded Bills" />
          <table className="hr-table">
            <thead><tr><th>SNo.</th><th>Head</th><th>Party</th><th>Bill No</th><th>Bill Date</th><th>Amount</th><th>Entry Date</th><th>Remarks</th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={r.id}><td>{i+1}</td><td>{r.head}</td><td>{r.party}</td><td>{r.billNo}</td><td>{r.billDate}</td><td>₹{parseFloat(r.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td><td>{r.entryDate}</td><td>{r.remarks}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
