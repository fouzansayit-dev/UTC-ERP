import React, { useState } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function SelfWithdrawal() {
  const [form,   setForm]   = useState({ bank:'', cheque:'', date:TODAY, amount:'', remarks:'' });
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY });
  const [rows,   setRows]   = useState([]);
  const [shown,  setShown]  = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const sf  = k => e => setFilter(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.bank || !form.amount) { alert('Bank Name and Amount are required.'); return; }
    setRows(p => [...p, { id: Date.now(), ...form }]);
    setForm({ bank:'', cheque:'', date:TODAY, amount:'', remarks:'' });
  };

  return (
    <div className="hr-form">
      <div className="section-title">Self Withdrawal</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Self Withdrawal" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:420 }}><select style={iS}><option>{COLLEGE}</option></select></div></div>
          <div style={rS}><span style={lbS}>Bank Name</span><div style={{ flex:1, maxWidth:420 }}><select style={iS} value={form.bank} onChange={set('bank')}><option value="">Select</option><option>UCT Main Account</option></select></div></div>
          <div style={rS}><span style={lbS}>Cheque/Trans. No</span><div style={{ flex:1, maxWidth:420 }}><input style={iS} value={form.cheque} onChange={set('cheque')} /></div></div>
          <div style={rS}><span style={lbS}>Date</span><div style={{ flex:1, maxWidth:420 }}><input style={iS} type="date" value={form.date} onChange={set('date')} /></div></div>
          <div style={rS}><span style={lbS}>Amount</span><div style={{ flex:1, maxWidth:420 }}><input style={iS} type="number" value={form.amount} onChange={set('amount')} /></div></div>
          <div style={rS}><span style={lbS}>Remarks</span><div style={{ flex:1, maxWidth:420 }}><textarea style={{ ...iS, height:70 }} value={form.remarks} onChange={set('remarks')} /></div></div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Self Withdrawal Report" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:420 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
          <div style={rS}><span style={lbS}>Start Date</span><div style={{ flex:1, maxWidth:420 }}><input style={iS} type="date" value={filter.start} onChange={sf('start')} /></div></div>
          <div style={rS}><span style={lbS}>End Date</span><div style={{ flex:1, maxWidth:420 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
          <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
        </div>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar />
          <table className="hr-table">
            <thead><tr><th>SNo.</th><th>Bank</th><th>Cheque/Trans No</th><th>Date</th><th>Amount</th><th>Remarks</th></tr></thead>
            <tbody>{rows.length === 0 ? <EmptyRow cols={6} /> : rows.map((r, i) => <tr key={r.id}><td>{i+1}</td><td>{r.bank}</td><td>{r.cheque}</td><td>{r.date}</td><td>₹{r.amount}</td><td>{r.remarks}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
