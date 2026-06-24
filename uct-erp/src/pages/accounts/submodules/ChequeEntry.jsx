import React, { useState } from 'react';
import { iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function ChequeEntry() {
  const [form, setForm] = useState({ bank:'', firstCheque:'', noOfCheque:'10' });
  const [rows, setRows] = useState([]);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.bank || !form.firstCheque) { alert('Bank Name and First Cheque No are required.'); return; }
    const qty = parseInt(form.noOfCheque) || 1;
    const newRows = Array.from({ length: qty }, (_, i) => ({
      id: Date.now() + i, bank: form.bank,
      chequeNo: String(parseInt(form.firstCheque) + i), status: 'NI'
    }));
    setRows(p => [...p, ...newRows]);
    setForm({ bank:'', firstCheque:'', noOfCheque:'10' });
  };

  return (
    <div className="hr-form">
      <div className="section-title">Cheque Entry (I: Issue &amp; NI: Not Issue)</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Add Cheque Entry" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>Bank Name</span>
            <div style={{ flex:1, maxWidth:340 }}>
              <select style={iS} value={form.bank} onChange={set('bank')}>
                <option value="">Select</option><option>UCT Main Account</option><option>UCT Savings</option>
              </select>
            </div>
          </div>
          <div style={rS}><span style={lbS}>First Cheque No</span><div style={{ flex:1, maxWidth:340 }}><input style={iS} value={form.firstCheque} onChange={set('firstCheque')} /></div></div>
          <div style={rS}><span style={lbS}>No of Cheques</span>
            <div style={{ flex:1, maxWidth:340 }}>
              <select style={iS} value={form.noOfCheque} onChange={set('noOfCheque')}>
                {[5,10,20,25,50].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="table-wrap">
        <TableToolbar />
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Bank Name</th><th>Cheque No</th><th>Status</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <EmptyRow cols={4} /> : rows.map((r, i) => (
              <tr key={r.id}><td>{i+1}</td><td>{r.bank}</td><td>{r.chequeNo}</td>
                <td><span style={{ background: r.status==='I' ? '#fee2e2':'#f3f4f6', color: r.status==='I' ? '#dc2626':'#6b7280', padding:'2px 8px', borderRadius:10, fontSize:11 }}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing {rows.length} entries</div>
      </div>
    </div>
  );
}
