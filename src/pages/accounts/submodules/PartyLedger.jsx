import React, { useState, useEffect } from 'react';
import { COLLEGE, iS, lbS, rS, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function PartyLedger() {
  const [form, setForm] = useState({ college:'All', party:'', ledgerType:'Party' });
  const [shown, setShown] = useState(false);
  const [parties, setParties] = useState([]);
  const [rows, setRows] = useState([]);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // Load parties on mount
  useEffect(() => {
    fetch('/api/generic/accounts/parties')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setParties(data);
      })
      .catch(err => console.error('Error loading parties:', err));
  }, []);

  const loadLedger = () => {
    if (!form.party) { alert('Please select a party.'); return; }
    
    const fetchBills = fetch('/api/generic/accounts/bills').then(res => res.json());
    const fetchCashbook = fetch('/api/generic/accounts/cashbook').then(res => res.json());

    Promise.all([fetchBills, fetchCashbook])
      .then(([bills, cashbook]) => {
        const partyBills = Array.isArray(bills) ? bills.filter(b => b.party === form.party) : [];
        const partyCashbook = Array.isArray(cashbook) ? cashbook.filter(c => c.party === form.party) : [];

        // Map bills as Credit transactions (outstanding payable increases)
        const billTx = partyBills.map(b => ({
          id: b.id,
          date: b.billDate,
          voucherNo: b.billNo,
          particulars: `Purchase Bill (Head: ${b.head})`,
          debit: 0,
          credit: parseFloat(b.amount) || 0
        }));

        // Map cashbook entries (Debit = payments, Credit = receipts)
        const cashbookTx = partyCashbook.map(c => ({
          id: c.id,
          date: c.date,
          voucherNo: c.reference || c.voucherNo,
          particulars: c.type === 'Debit' ? `Payment (Mode: ${c.payMode})` : `Receipt (Mode: ${c.payMode})`,
          debit: c.type === 'Debit' ? parseFloat(c.amount) || 0 : 0,
          credit: c.type === 'Credit' ? parseFloat(c.amount) || 0 : 0
        }));

        // Merge and sort
        const allTx = [...billTx, ...cashbookTx].sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.id - b.id;
        });

        // Compute running balance
        let balance = 0;
        const computed = allTx.map(t => {
          balance += (t.credit - t.debit); // Credit increases payable, Debit reduces it
          return {
            ...t,
            balance
          };
        });

        setRows(computed);
      })
      .catch(err => console.error('Error loading ledger:', err));
  };

  useEffect(() => {
    if (shown) {
      loadLedger();
    }
  }, [shown, form.party]);

  // Filter parties by selected ledger type
  const filteredParties = parties.filter(p => p.type === form.ledgerType || (form.ledgerType === 'Party' && p.type !== 'Student'));

  return (
    <div className="hr-form">
      <div className="section-title">Party Ledger</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:340 }}><select style={iS} value={form.college} onChange={set('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Ledger Type</span>
          <div style={{ flex:1, maxWidth:340, display:'flex', gap:16 }}>
            {['Party','Student'].map(t => (
              <label key={t} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer' }}>
                <input type="radio" name="ltype" checked={form.ledgerType===t} onChange={() => setForm(p => ({ ...p, ledgerType:t, party:'' }))} />{t}
              </label>
            ))}
          </div>
        </div>
        <div style={rS}><span style={lbS}>Party Name</span>
          <div style={{ flex:1, maxWidth:340 }}>
            <select style={iS} value={form.party} onChange={set('party')}>
              <option value="">Select Party</option>
              {filteredParties.map(p => (
                <option key={p.id} value={p.name}>{p.name} {p.firm ? `(${p.firm})` : ''}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar title={`Party Ledger — ${form.party}`} />
          <table className="hr-table">
            <thead>
              <tr><th>Date</th><th>Voucher/Bill No</th><th>Particulars</th><th>Debit (₹)</th><th>Credit (₹)</th><th>Outstanding (₹)</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 ? <EmptyRow cols={6} /> : rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.voucherNo}</td>
                  <td>{r.particulars}</td>
                  <td>{r.debit > 0 ? `₹${r.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}</td>
                  <td>{r.credit > 0 ? `₹${r.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}</td>
                  <td style={{ fontWeight: 600 }}>₹{r.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing {rows.length} entries</div>
        </div>
      )}
    </div>
  );
}
