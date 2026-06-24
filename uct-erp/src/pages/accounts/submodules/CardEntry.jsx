import React, { useState } from 'react';
import { iS, lbS, rS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function CardEntry() {
  const [form, setForm] = useState({ firstCard:'', qty:'' });
  const [rows, setRows] = useState([]);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.firstCard) { alert('First Card No is required.'); return; }
    const qty = parseInt(form.qty) || 1;
    const newRows = Array.from({ length: qty }, (_, i) => ({
      id: Date.now() + i, cardNo: String(parseInt(form.firstCard) + i), student:'—', status:'NI'
    }));
    setRows(p => [...p, ...newRows]);
    setForm({ firstCard:'', qty:'' });
  };

  return (
    <div className="hr-form">
      <div className="section-title">Card Entry (I: Issue &amp; NI: Not Issue)</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Add Card Entry" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>First Card No</span><div style={{ flex:1, maxWidth:340 }}><input style={iS} value={form.firstCard} onChange={set('firstCard')} /></div></div>
          <div style={rS}><span style={lbS}>Enter Card Qty</span><div style={{ flex:1, maxWidth:340 }}><input style={iS} type="number" value={form.qty} onChange={set('qty')} /></div></div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="table-wrap">
        <TableToolbar />
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Card No</th><th>Student</th><th>Status</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <EmptyRow cols={4} /> : rows.map((r, i) => (
              <tr key={r.id}><td>{i+1}</td><td>{r.cardNo}</td><td>{r.student}</td><td>{r.status}</td></tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing {rows.length} entries</div>
      </div>
    </div>
  );
}
