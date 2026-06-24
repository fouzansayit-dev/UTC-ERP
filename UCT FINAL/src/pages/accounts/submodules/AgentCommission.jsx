import React, { useState } from 'react';
import { TODAY, iS, fS, lS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function AgentCommission() {
  const [form, setForm] = useState({ agent:'', student:'', gross:'', tdsRate:'10', tds:'', net:'', payDate:TODAY, payMode:'NEFT', challanNo:'', remarks:'' });
  const [rows, setRows] = useState([]);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const calcTDS = () => {
    if (form.gross && form.tdsRate) {
      const tds = (parseFloat(form.gross) * parseFloat(form.tdsRate) / 100).toFixed(2);
      const net = (parseFloat(form.gross) - parseFloat(tds)).toFixed(2);
      setForm(p => ({ ...p, tds: String(tds), net: String(net) }));
    }
  };

  const handleSubmit = () => {
    if (!form.agent || !form.gross) { alert('Agent and Gross Commission are required.'); return; }
    setRows(p => [...p, { id: Date.now(), ...form }]);
    setForm({ agent:'', student:'', gross:'', tdsRate:'10', tds:'', net:'', payDate:TODAY, payMode:'NEFT', challanNo:'', remarks:'' });
  };

  return (
    <div className="hr-form">
      <div className="section-title">Agent Commission Payment</div>
      <div style={{ background:'#fff8ec', border:'1px solid #fcd34d', borderRadius:8, padding:'10px 16px', marginBottom:16, fontSize:13, color:'#92400e' }}>
        TDS deducted at source @ applicable rate. Net payable = Gross − TDS. Record challan no for quarterly 26Q filing.
      </div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Add Commission Payment" />
        <div style={{ padding:'20px 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div style={fS}><label style={lS}>Agent Name <span style={{ color:'#dc2626' }}>*</span></label><select style={iS} value={form.agent} onChange={set('agent')}><option value="">Select Agent</option><option>AGT-001</option><option>AGT-002</option></select></div>
            <div style={fS}><label style={lS}>Student (Enrolled)</label><input style={iS} value={form.student} onChange={set('student')} placeholder="Student name or ID" /></div>
            <div style={fS}><label style={lS}>Gross Commission (₹) <span style={{ color:'#dc2626' }}>*</span></label><input style={iS} type="number" value={form.gross} onChange={set('gross')} onBlur={calcTDS} /></div>
            <div style={fS}><label style={lS}>TDS Rate (%)</label><select style={iS} value={form.tdsRate} onChange={set('tdsRate')} onBlur={calcTDS}><option>0</option><option>2</option><option>5</option><option>10</option></select></div>
            <div style={fS}><label style={lS}>TDS Amount (₹)</label><input style={{ ...iS, background:'#f9fafb' }} value={form.tds} readOnly placeholder="Auto calculated" /></div>
            <div style={fS}><label style={lS}>Net Payable (₹)</label><input style={{ ...iS, background:'#f0fdf4', color:'#16a34a', fontWeight:600 }} value={form.net} readOnly placeholder="Auto calculated" /></div>
            <div style={fS}><label style={lS}>Payment Date</label><input style={iS} type="date" value={form.payDate} onChange={set('payDate')} /></div>
            <div style={fS}><label style={lS}>Payment Mode</label><select style={iS} value={form.payMode} onChange={set('payMode')}><option>NEFT</option><option>Cheque</option><option>Cash</option></select></div>
            <div style={fS}><label style={lS}>TDS Challan No</label><input style={iS} value={form.challanNo} onChange={set('challanNo')} /></div>
            <div style={fS}><label style={lS}>Remarks</label><input style={iS} value={form.remarks} onChange={set('remarks')} /></div>
          </div>
          <button className="submit-btn" style={{ marginTop:12 }} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="table-wrap">
        <TableToolbar />
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Agent</th><th>Student</th><th>Gross (₹)</th><th>TDS (₹)</th><th>Net Paid (₹)</th><th>Pay Date</th><th>Challan No</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <EmptyRow cols={8} /> : rows.map((r, i) => (
              <tr key={r.id}><td>{i+1}</td><td>{r.agent}</td><td>{r.student}</td><td>₹{r.gross}</td><td style={{ color:'#dc2626' }}>₹{r.tds}</td><td style={{ color:'#16a34a', fontWeight:600 }}>₹{r.net}</td><td>{r.payDate}</td><td>{r.challanNo}</td></tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing {rows.length} entries</div>
      </div>
    </div>
  );
}
