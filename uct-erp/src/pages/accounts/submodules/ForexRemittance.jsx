import React, { useState } from 'react';
import { TODAY, iS, fS, lS, SecHead, TableToolbar, EmptyRow } from './accountsConfig.jsx';

const COUNTRIES = ['Russia','Philippines','Kazakhstan','Georgia','Kyrgyzstan','Bangladesh','Ukraine'];

export default function ForexRemittance() {
  const [form, setForm] = useState({ student:'', university:'', country:'Russia', purpose:'University Fee', amountUSD:'', rate:'', amountINR:'', date:TODAY, bank:'', swift:'', remarks:'' });
  const [rows, setRows] = useState([]);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const calcINR = () => {
    if (form.amountUSD && form.rate)
      setForm(p => ({ ...p, amountINR: String((parseFloat(p.amountUSD) * parseFloat(p.rate)).toFixed(2)) }));
  };

  const handleSubmit = () => {
    if (!form.amountUSD || !form.rate) { alert('Amount (USD) and Exchange Rate are required.'); return; }
    setRows(p => [...p, { id: Date.now(), ...form }]);
    setForm({ student:'', university:'', country:'Russia', purpose:'University Fee', amountUSD:'', rate:'', amountINR:'', date:TODAY, bank:'', swift:'', remarks:'' });
  };

  return (
    <div className="hr-form">
      <div className="section-title">Forex Remittance</div>
      <div style={{ background:'#eef8ff', border:'1px solid #bae0fd', borderRadius:8, padding:'10px 16px', marginBottom:16, fontSize:13, color:'#0369a1' }}>
        Records foreign currency remittances to abroad universities — amount in USD, INR equivalent, exchange rate and SWIFT reference.
      </div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Add Forex Remittance" />
        <div style={{ padding:'20px 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div style={fS}><label style={lS}>Student Name</label><input style={iS} value={form.student} onChange={set('student')} /></div>
            <div style={fS}><label style={lS}>University</label><input style={iS} value={form.university} onChange={set('university')} placeholder="e.g. KSMU Russia" /></div>
            <div style={fS}><label style={lS}>Country</label><select style={iS} value={form.country} onChange={set('country')}>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div style={fS}><label style={lS}>Purpose</label><select style={iS} value={form.purpose} onChange={set('purpose')}><option>University Fee</option><option>Hostel Fee</option><option>Visa Fee</option><option>Pre-Departure</option><option>Other</option></select></div>
            <div style={fS}><label style={lS}>Amount (USD) <span style={{ color:'#dc2626' }}>*</span></label><input style={iS} type="number" value={form.amountUSD} onChange={set('amountUSD')} onBlur={calcINR} /></div>
            <div style={fS}><label style={lS}>Exchange Rate (₹/USD) <span style={{ color:'#dc2626' }}>*</span></label><input style={iS} type="number" value={form.rate} onChange={set('rate')} onBlur={calcINR} /></div>
            <div style={fS}><label style={lS}>Amount (INR)</label><input style={{ ...iS, background:'#f9fafb' }} value={form.amountINR} readOnly placeholder="Auto calculated" /></div>
            <div style={fS}><label style={lS}>Remittance Date</label><input style={iS} type="date" value={form.date} onChange={set('date')} /></div>
            <div style={fS}><label style={lS}>Remitting Bank</label><select style={iS} value={form.bank} onChange={set('bank')}><option value="">Select</option><option>UCT Main Account</option></select></div>
            <div style={fS}><label style={lS}>SWIFT Reference No</label><input style={iS} value={form.swift} onChange={set('swift')} /></div>
          </div>
          <div style={{ ...fS, marginTop:12 }}><label style={lS}>Remarks</label><textarea style={{ ...iS, height:70 }} value={form.remarks} onChange={set('remarks')} /></div>
          <button className="submit-btn" style={{ marginTop:12 }} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="table-wrap">
        <TableToolbar />
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Student</th><th>University</th><th>Country</th><th>Purpose</th><th>USD</th><th>Rate</th><th>INR</th><th>Date</th><th>SWIFT Ref</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <EmptyRow cols={10} /> : rows.map((r, i) => (
              <tr key={r.id}><td>{i+1}</td><td>{r.student}</td><td>{r.university}</td><td>{r.country}</td><td>{r.purpose}</td><td>${r.amountUSD}</td><td>{r.rate}</td><td>₹{r.amountINR}</td><td>{r.date}</td><td>{r.swift}</td></tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing {rows.length} entries</div>
      </div>
    </div>
  );
}
