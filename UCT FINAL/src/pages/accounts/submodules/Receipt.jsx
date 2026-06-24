import React, { useState } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, SecHead } from './accountsConfig.jsx';

const HEADS = ['Construction','Expenses','Salary','Unio Hostel','Agent Commission','Forex Remittance','Abroad University Fee'];
let rcptCounter = 1;

export default function Receipt() {
  const [form, setForm] = useState({ head:'', subhead:'', partyType:'Party', party:'', voucherNo:'RV/UCT/1', date:TODAY, amount:'', payMode:'', bank:'', chequeNo:'', chequDate:'', depositBank:'', depositDate:TODAY, remarks:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.head || !form.amount) { alert('Head and Amount are required.'); return; }
    const entry = { id: Date.now(), type: 'Credit', ...form, reference: form.voucherNo };
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(existing => {
        const all = Array.isArray(existing) ? [...existing, entry] : [entry];
        return fetch('/api/generic/accounts/cashbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(all)
        });
      })
      .then(() => {
        rcptCounter++;
        setForm(p => ({ ...p, head:'', subhead:'', party:'', amount:'', chequeNo:'', remarks:'', voucherNo:`RV/UCT/${rcptCounter}` }));
        alert('Receipt recorded in cashbook ledger.');
      })
      .catch(err => alert('Failed to save receipt: ' + err.message));
  };

  return (
    <div className="hr-form">
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Receipt" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:620 }}><select style={iS}><option>{COLLEGE}</option></select></div></div>
          <div style={rS}><span style={lbS}>Head Name</span>
            <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, maxWidth:620 }}>
              <select style={iS} value={form.head} onChange={set('head')}><option value="">Select</option>{HEADS.map(h => <option key={h}>{h}</option>)}</select>
              <select style={iS} value={form.subhead} onChange={set('subhead')}><option value="">Subhead</option></select>
            </div>
          </div>
          <div style={rS}><span style={lbS}>Party Type</span>
            <div style={{ flex:1, maxWidth:620, display:'flex', gap:16, flexWrap:'wrap' }}>
              {['Other','Party','Employee','Supplier','Student'].map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer' }}>
                  <input type="radio" name="rtype" checked={form.partyType===t} onChange={() => setForm(p => ({ ...p, partyType:t }))} />{t}
                </label>
              ))}
            </div>
          </div>
          <div style={rS}><span style={{ ...lbS, color:'#dc2626' }}>Party Name</span><div style={{ flex:1, maxWidth:620 }}><select style={iS} value={form.party} onChange={set('party')}><option value="">Select Party</option></select></div></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:14 }}>
            <div style={rS}><span style={lbS}>Voucher No</span><div style={{ flex:1 }}><input style={iS} value={form.voucherNo} readOnly /></div></div>
            <div style={rS}><span style={lbS}>Amount</span><div style={{ flex:1 }}><input style={iS} type="number" value={form.amount} onChange={set('amount')} /></div></div>
            <div style={rS}><span style={lbS}>Date</span><div style={{ flex:1 }}><input style={iS} type="date" value={form.date} onChange={set('date')} /></div></div>
            <div style={rS}><span style={lbS}>Payment Mode</span><div style={{ flex:1 }}><select style={iS} value={form.payMode} onChange={set('payMode')}><option value="">Select</option><option>Cash</option><option>Cheque</option><option>Online/NEFT</option><option>DD</option></select></div></div>
            <div style={rS}><span style={lbS}>Bank Name</span><div style={{ flex:1 }}><input style={iS} value={form.bank} onChange={set('bank')} /></div></div>
            <div style={rS}><span style={lbS}>Cheque/Tran No</span><div style={{ flex:1 }}><input style={iS} value={form.chequeNo} onChange={set('chequeNo')} /></div></div>
            <div style={rS}><span style={lbS}>Cheque/Tran Date</span><div style={{ flex:1 }}><input style={iS} type="date" value={form.chequDate} onChange={set('chequDate')} /></div></div>
            <div style={rS}><span style={lbS}>Remarks</span><div style={{ flex:1 }}><textarea style={{ ...iS, height:60 }} value={form.remarks} onChange={set('remarks')} /></div></div>
            <div style={rS}><span style={lbS}>Deposit Bank</span><div style={{ flex:1 }}><select style={iS} value={form.depositBank} onChange={set('depositBank')}><option value="">Select</option><option>UCT Main Account</option></select></div></div>
            <div style={rS}><span style={lbS}>Deposit Date</span><div style={{ flex:1 }}><input style={iS} type="date" value={form.depositDate} onChange={set('depositDate')} /></div></div>
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
