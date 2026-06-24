import React, { useState } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function BankDeposit() {
  const [form, setForm] = useState({ bank:'', date:TODAY, amount:'', status:'Cleared', payMode:'Cash', chequeNo:'', remarks:'' });
  const [rows, setRows] = useState([]);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.bank || !form.amount) { alert('Bank Name and Amount are required.'); return; }
    setRows(p => [...p, { id: Date.now(), ...form }]);
    setForm({ bank:'', date:TODAY, amount:'', status:'Cleared', payMode:'Cash', chequeNo:'', remarks:'' });
  };

  return (
    <div className="hr-form">
      <div className="section-title">Bank Deposit</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Bank Deposit" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:420 }}><select style={iS}><option>{COLLEGE}</option></select></div></div>
          <div style={rS}><span style={lbS}>Bank Name</span><div style={{ flex:1, maxWidth:420 }}><select style={iS} value={form.bank} onChange={set('bank')}><option value="">Select</option><option>UCT Main Account</option></select></div></div>
          <div style={rS}><span style={lbS}>Date</span><div style={{ flex:1, maxWidth:420 }}><input style={iS} type="date" value={form.date} onChange={set('date')} /></div></div>
          <div style={rS}><span style={lbS}>Amount</span><div style={{ flex:1, maxWidth:420 }}><input style={iS} type="number" value={form.amount} onChange={set('amount')} /></div></div>
          <div style={rS}><span style={lbS}>Status</span><div style={{ flex:1, maxWidth:420 }}><select style={iS} value={form.status} onChange={set('status')}><option>Cleared</option><option>Pending</option><option>Bounced</option></select></div></div>
          <div style={rS}><span style={lbS}>Payment Mode</span><div style={{ flex:1, maxWidth:420 }}><select style={iS} value={form.payMode} onChange={set('payMode')}><option>Cash</option><option>Cheque</option><option>Online</option></select></div></div>
          <div style={rS}><span style={lbS}>Cheque No</span><div style={{ flex:1, maxWidth:420 }}><input style={iS} value={form.chequeNo} onChange={set('chequeNo')} /></div></div>
          <div style={rS}><span style={lbS}>Remarks</span><div style={{ flex:1, maxWidth:420 }}><textarea style={{ ...iS, height:70 }} value={form.remarks} onChange={set('remarks')} /></div></div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="table-wrap">
        <TableToolbar />
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Bank Name</th><th>Date</th><th>Amount</th><th>Status</th><th>Pay Mode</th><th>Cheque No</th><th>Remarks</th><th>Print</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <EmptyRow cols={9} /> : rows.map((r, i) => (
              <tr key={r.id}><td>{i+1}</td><td>{r.bank}</td><td>{r.date}</td><td>₹{r.amount}</td><td>{r.status}</td><td>{r.payMode}</td><td>{r.chequeNo}</td><td>{r.remarks}</td>
                <td><button className="tbl-btn view" style={{ background:'#f0fdf4', color:'#16a34a' }}>Print</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing {rows.length} entries</div>
      </div>
    </div>
  );
}
