import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, SecHead, TableToolbar } from './accountsConfig.jsx';

const HEADS = ['Construction','Expenses','Salary','Unio Hostel','Agent Commission','Forex Remittance','Abroad University Fee'];
let counter = 1;

export default function Payment() {
  const [form, setForm] = useState({ head:'', subhead:'', partyType:'Party', party:'', voucherNo:'JV/UCT/0001', date:TODAY, amount:'', payMode:'', bank:'', chequeNo:'', remarks:'' });
  const [rows, setRows] = useState([]);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadEntries = () => {
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => setRows(Array.isArray(data) ? data.filter(r => r.type === 'Debit') : []))
      .catch(err => console.error('Error loading cashbook:', err));
  };

  useEffect(() => { loadEntries(); }, []);

  const handleSubmit = () => {
    if (!form.head || !form.amount) { alert('Head and Amount are required.'); return; }
    const entry = { id: Date.now(), type: 'Debit', ...form, reference: form.voucherNo };
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
        loadEntries();
        counter++;
        setForm(p => ({ ...p, head:'', subhead:'', party:'', amount:'', chequeNo:'', remarks:'', voucherNo:`JV/UCT/${String(counter).padStart(4,'0')}` }));
        alert('Payment recorded in cashbook ledger.');
      })
      .catch(err => alert('Failed to save payment: ' + err.message));
  };

  return (
    <div className="hr-form">
      <div className="section-title">Payment</div>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Payment" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:620 }}><select style={iS}><option>{COLLEGE}</option></select></div></div>
          <div style={rS}>
            <span style={lbS}>Head Name</span>
            <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, maxWidth:620 }}>
              <select style={iS} value={form.head} onChange={set('head')}><option value="">Select</option>{HEADS.map(h => <option key={h}>{h}</option>)}</select>
              <select style={iS} value={form.subhead} onChange={set('subhead')}><option value="">Subhead</option></select>
            </div>
          </div>
          <div style={rS}><span style={lbS}>Party Type</span>
            <div style={{ flex:1, maxWidth:620, display:'flex', gap:16, flexWrap:'wrap' }}>
              {['Other','Party','Employee','Supplier','Student'].map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer' }}>
                  <input type="radio" name="ptype_pay" checked={form.partyType===t} onChange={() => setForm(p => ({ ...p, partyType:t }))} />{t}
                </label>
              ))}
            </div>
          </div>
          <div style={rS}><span style={lbS}>Party Name</span><div style={{ flex:1, maxWidth:620 }}><select style={iS} value={form.party} onChange={set('party')}><option value="">Select Party</option></select></div></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:14 }}>
            {[['voucherNo','Voucher No',false],['amount','Amount',true],['date','Date','date'],['payMode','Payment Mode','select']].map(([k,label,type]) => (
              <div key={k} style={rS}>
                <span style={lbS}>{label}</span>
                <div style={{ flex:1 }}>
                  {type === 'select' ? (
                    <select style={iS} value={form[k]} onChange={set(k)}>
                      <option value="">Select</option><option>Cash</option><option>Cheque</option><option>Online/NEFT</option><option>DD</option><option>Forex/SWIFT</option><option>Agent Commission</option>
                    </select>
                  ) : <input style={iS} type={type === true ? 'number' : type || 'text'} value={form[k]} onChange={set(k)} readOnly={k==='voucherNo'} />}
                </div>
              </div>
            ))}
            <div style={rS}><span style={lbS}>Bank Name</span><div style={{ flex:1 }}><select style={iS} value={form.bank} onChange={set('bank')}><option value="">Select</option><option>UCT Main Account</option></select></div></div>
            <div style={rS}><span style={lbS}>Cheque/Tran No</span><div style={{ flex:1 }}><input style={iS} value={form.chequeNo} onChange={set('chequeNo')} /></div></div>
          </div>
          <div style={rS}><span style={lbS}>Remarks</span><div style={{ flex:1, maxWidth:620 }}><textarea style={{ ...iS, height:70 }} value={form.remarks} onChange={set('remarks')} /></div></div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      {rows.length > 0 && (
        <div className="table-wrap">
          <TableToolbar />
          <table className="hr-table">
            <thead><tr><th>SNo.</th><th>Voucher No</th><th>Date</th><th>Head</th><th>Party</th><th>Amount</th><th>Pay Mode</th><th>Remarks</th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={r.id}><td>{i+1}</td><td>{r.voucherNo}</td><td>{r.date}</td><td>{r.head}</td><td>{r.party}</td><td>₹{r.amount}</td><td>{r.payMode}</td><td>{r.remarks}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
