import React, { useState } from 'react';
import { COLLEGE, iS, lbS, rS, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function PartyLedger() {
  const [form, setForm] = useState({ college:'All', party:'', ledgerType:'Party' });
  const [shown, setShown] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="hr-form">
      <div className="section-title">Party Ledger</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:340 }}><select style={iS} value={form.college} onChange={set('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Ledger Type</span>
          <div style={{ flex:1, maxWidth:340, display:'flex', gap:16 }}>
            {['Party','Student'].map(t => (
              <label key={t} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer' }}>
                <input type="radio" name="ltype" checked={form.ledgerType===t} onChange={() => setForm(p => ({ ...p, ledgerType:t }))} />{t}
              </label>
            ))}
          </div>
        </div>
        <div style={rS}><span style={lbS}>Party Name</span><div style={{ flex:1, maxWidth:340 }}><select style={iS} value={form.party} onChange={set('party')}><option value="">Select Party</option></select></div></div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar />
          <table className="hr-table">
            <thead><tr><th>Date</th><th>Voucher No</th><th>Particulars</th><th>Debit (₹)</th><th>Credit (₹)</th><th>Balance (₹)</th></tr></thead>
            <tbody><EmptyRow cols={6} /></tbody>
          </table>
          <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Connect backend API to load ledger data</div>
        </div>
      )}
    </div>
  );
}
