import React, { useState } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

const HEADS = ['Construction','Expenses','Salary','Unio Hostel','Agent Commission','Forex Remittance','Abroad University Fee'];

export default function BillEntry() {
  const [form, setForm] = useState({ head:'', subhead:'', party:'', billNo:'', billDate:TODAY, amount:'', entryDate:TODAY, remarks:'' });
  const [rows, setRows] = useState([]);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.head || !form.billNo || !form.amount) { alert('Head, Bill No and Amount are required.'); return; }
    setRows(p => [...p, { id: Date.now(), ...form }]);
    setForm({ head:'', subhead:'', party:'', billNo:'', billDate:TODAY, amount:'', entryDate:TODAY, remarks:'' });
  };

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
                <option value="">Select</option>
                {HEADS.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
          </div>
          <div style={rS}><span style={lbS}>Subhead Name</span><div style={{ flex:1, maxWidth:420 }}><select style={iS} value={form.subhead} onChange={set('subhead')}><option value="">Select</option></select></div></div>
          <div style={rS}><span style={lbS}>Party Name</span>
            <div style={{ flex:1, maxWidth:420, display:'flex', gap:8 }}>
              <select style={{ ...iS, flex:1 }} value={form.party} onChange={set('party')}><option value="">Select Party</option></select>
              <button className="submit-btn" style={{ whiteSpace:'nowrap', padding:'7px 14px' }}>Add Party</button>
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
          <TableToolbar />
          <table className="hr-table">
            <thead><tr><th>SNo.</th><th>Head</th><th>Party</th><th>Bill No</th><th>Bill Date</th><th>Amount</th><th>Entry Date</th><th>Remarks</th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={r.id}><td>{i+1}</td><td>{r.head}</td><td>{r.party}</td><td>{r.billNo}</td><td>{r.billDate}</td><td>₹{r.amount}</td><td>{r.entryDate}</td><td>{r.remarks}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
