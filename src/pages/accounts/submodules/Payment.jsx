import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, SecHead, TableToolbar } from './accountsConfig.jsx';

const DEFAULT_HEADS = ['Construction','Expenses','Salary','Unio Hostel','Agent Commission','Forex Remittance','Abroad University Fee'];

const EXCHANGE_RATES = {
  USD: 1.00,
  INR: 0.012,
  EUR: 1.08,
  GBP: 1.27,
  CNY: 0.14,
  AUD: 0.66
};

const getCurrencySymbol = (curr) => {
  switch (curr) {
    case 'INR': return '₹';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'CNY': return '¥';
    case 'AUD': return 'A$';
    default: return '$';
  }
};

export default function Payment() {
  const [heads, setHeads] = useState([]);
  const [subheads, setSubheads] = useState([]);
  const [parties, setParties] = useState([]);
  const [banks, setBanks] = useState([]);
  const [cashbook, setCashbook] = useState([]);
  const [rows, setRows] = useState([]);

  const [inputCurrency, setInputCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [foreignAmount, setForeignAmount] = useState('');

  const [form, setForm] = useState({
    head: '',
    subhead: '',
    partyType: 'Party',
    party: '',
    voucherNo: 'JV/UCT/0001',
    date: TODAY,
    amount: '',
    payMode: '',
    bank: '',
    chequeNo: '',
    remarks: ''
  });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // Auto exchange-rate setter
  useEffect(() => {
    if (inputCurrency === targetCurrency) {
      setExchangeRate(1);
    } else {
      const fromRate = EXCHANGE_RATES[inputCurrency] || 1;
      const toRate = EXCHANGE_RATES[targetCurrency] || 1;
      setExchangeRate(parseFloat((fromRate / toRate).toFixed(4)));
    }
  }, [inputCurrency, targetCurrency]);

  // Keep target amount updated
  useEffect(() => {
    const amt = parseFloat(foreignAmount) || 0;
    const rate = parseFloat(exchangeRate) || 0;
    setForm(p => ({ ...p, amount: (amt * rate).toFixed(2) }));
  }, [foreignAmount, exchangeRate]);

  const loadData = () => {
    // Load Heads
    fetch('/api/generic/accounts/heads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setHeads(data.map(h => h.head));
        else setHeads(DEFAULT_HEADS);
      })
      .catch(() => setHeads(DEFAULT_HEADS));

    // Load Subheads
    fetch('/api/generic/accounts/subheads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSubheads(data);
      })
      .catch(err => console.error('Error loading subheads:', err));

    // Load Parties
    fetch('/api/generic/accounts/parties')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setParties(data);
      })
      .catch(err => console.error('Error loading parties:', err));

    // Load Banks
    fetch('/api/generic/accounts/banks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBanks(data);
      })
      .catch(err => console.error('Error loading banks:', err));

    // Load Cashbook & filter Debit rows
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCashbook(data);
          const debits = data.filter(r => r.type === 'Debit');
          setRows(debits);
          setForm(p => ({ ...p, voucherNo: `JV/UCT/${String(debits.length + 1).padStart(4, '0')}` }));
        }
      })
      .catch(err => console.error('Error loading cashbook:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = () => {
    if (!form.head || !form.amount || parseFloat(form.amount) <= 0) { alert('Head and Amount are required.'); return; }
    const entry = { 
      id: Date.now(), 
      type: 'Debit', 
      ...form, 
      inputCurrency,
      targetCurrency,
      exchangeRate,
      foreignAmount,
      reference: form.voucherNo 
    };
    const updatedCashbook = [...cashbook, entry];

    fetch('/api/generic/accounts/cashbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCashbook)
    })
      .then(res => res.json())
      .then(() => {
        alert('Payment recorded in cashbook ledger.');
        loadData();
        setForeignAmount('');
        setForm(p => ({
          ...p,
          head: '',
          subhead: '',
          party: '',
          amount: '',
          chequeNo: '',
          remarks: ''
        }));
      })
      .catch(err => alert('Failed to save payment: ' + err.message));
  };

  // Filter subheads based on selected head
  const filteredSubheads = subheads.filter(s => s.head === form.head);

  // Filter parties based on selected partyType
  const filteredParties = parties.filter(p => p.type === form.partyType || (form.partyType === 'Party' && p.type !== 'Employee' && p.type !== 'Student'));

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
              <select style={iS} value={form.head} onChange={set('head')}>
                <option value="">Select Head</option>
                {heads.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select style={iS} value={form.subhead} onChange={set('subhead')}>
                <option value="">Select Subhead</option>
                {filteredSubheads.map(s => <option key={s.id} value={s.subhead}>{s.subhead}</option>)}
              </select>
            </div>
          </div>
          <div style={rS}><span style={lbS}>Party Type</span>
            <div style={{ flex:1, maxWidth:620, display:'flex', gap:16, flexWrap:'wrap' }}>
              {['Other','Party','Employee','Supplier','Student'].map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer' }}>
                  <input type="radio" name="ptype_pay" checked={form.partyType===t} onChange={() => setForm(p => ({ ...p, partyType:t, party:'' }))} />{t}
                </label>
              ))}
            </div>
          </div>
          <div style={rS}>
            <span style={lbS}>Party Name</span>
            <div style={{ flex:1, maxWidth:620 }}>
              <select style={iS} value={form.party} onChange={set('party')}>
                <option value="">Select Party</option>
                {filteredParties.map(p => (
                  <option key={p.id} value={p.name}>{p.name} {p.firm ? `(${p.firm})` : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:14 }}>
            <div style={rS}><span style={lbS}>Voucher No</span><div style={{ flex:1 }}><input style={iS} value={form.voucherNo} readOnly /></div></div>
            
            <div style={rS}>
              <span style={lbS}>Transaction Currency & Amt</span>
              <div style={{ flex:1, display:'flex', gap:8 }}>
                <select style={{ ...iS, width:90 }} value={inputCurrency} onChange={e => setInputCurrency(e.target.value)}>
                  {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input style={iS} type="number" placeholder="Enter amount" value={foreignAmount} onChange={e => setForeignAmount(e.target.value)} />
              </div>
            </div>
            
            <div style={rS}>
              <span style={lbS}>Target Currency & Ex. Rate</span>
              <div style={{ flex:1, display:'flex', gap:8 }}>
                <select style={{ ...iS, width:90 }} value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)}>
                  {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input style={{ ...iS, width:110 }} type="number" step="0.0001" placeholder="Ex Rate" value={exchangeRate} onChange={e => setExchangeRate(e.target.value)} />
                <span style={{ fontSize:12, color:'#4361ee', alignSelf:'center', minWidth:120 }}>
                  Converted: <b>{getCurrencySymbol(targetCurrency)} {form.amount}</b>
                </span>
              </div>
            </div>
            
            <div style={rS}><span style={lbS}>Date</span><div style={{ flex:1 }}><input style={iS} type="date" value={form.date} onChange={set('date')} /></div></div>
            
            <div style={rS}>
              <span style={lbS}>Payment Mode</span>
              <div style={{ flex:1 }}>
                <select style={iS} value={form.payMode} onChange={set('payMode')}>
                  <option value="">Select</option><option>Cash</option><option>Cheque</option><option>Online/NEFT</option><option>DD</option><option>Forex/SWIFT</option><option>Agent Commission</option>
                </select>
              </div>
            </div>

            <div style={rS}>
              <span style={lbS}>Bank Name</span>
              <div style={{ flex:1 }}>
                <select style={iS} value={form.bank} onChange={set('bank')}>
                  <option value="">Select Bank</option>
                  {banks.map(b => <option key={b.id} value={b.bank}>{b.bank} ({b.accNo})</option>)}
                </select>
              </div>
            </div>
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
            <tbody>{rows.map((r, i) => <tr key={r.id}><td>{i+1}</td><td>{r.voucherNo}</td><td>{r.date}</td><td>{r.head}</td><td>{r.party}</td><td>{getCurrencySymbol(r.targetCurrency || 'USD')} {r.amount}</td><td>{r.payMode}</td><td>{r.remarks}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
