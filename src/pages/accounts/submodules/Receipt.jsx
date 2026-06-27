import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, SecHead } from './accountsConfig.jsx';

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

export default function Receipt() {
  const [heads, setHeads] = useState([]);
  const [subheads, setSubheads] = useState([]);
  const [parties, setParties] = useState([]);
  const [banks, setBanks] = useState([]);
  const [cashbook, setCashbook] = useState([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  const [inputCurrency, setInputCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [foreignAmount, setForeignAmount] = useState('');

  const [form, setForm] = useState({
    head: '',
    subhead: '',
    partyType: 'Party',
    party: '',
    voucherNo: 'RV/UCT/1',
    date: TODAY,
    amount: '',
    payMode: '',
    bank: '',
    chequeNo: '',
    chequDate: '',
    depositBank: '',
    depositDate: TODAY,
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

  const numberToWords = (num, curr = 'USD') => {
    if (num === 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const g = ['', 'Thousand', 'Million', 'Billion'];
    
    const helper = (n) => {
      let s = '';
      if (n >= 100) {
        s += a[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        s += b[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0) {
        s += a[n] + ' ';
      }
      return s.trim();
    };

    let word = '';
    let parts = [];
    let n = Math.floor(num);
    while (n > 0) {
      parts.push(n % 1000);
      n = Math.floor(n / 1000);
    }
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] > 0) {
        word = helper(parts[i]) + ' ' + g[i] + ' ' + word;
      }
    }
    const currencyNames = {
      USD: 'Dollars',
      INR: 'Rupees',
      EUR: 'Euros',
      GBP: 'Pounds',
      CNY: 'Yuan',
      AUD: 'Australian Dollars'
    };
    const name = currencyNames[curr] || 'Dollars';
    return word.trim() + ' ' + name + ' Only';
  };

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

    // Load Cashbook for voucher count
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCashbook(data);
          const creditCount = data.filter(r => r.type === 'Credit').length;
          setForm(p => ({ ...p, voucherNo: `RV/UCT/${creditCount + 1}` }));
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
      type: 'Credit', 
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
        setLastReceipt(entry);
        setShowReceiptModal(true);
        loadData(); // Re-fetch to update voucher number and local state
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
      .catch(err => alert('Failed to save receipt: ' + err.message));
  };

  const printReceipt = () => {
    window.print();
  };

  // Filter subheads based on selected head
  const filteredSubheads = subheads.filter(s => s.head === form.head);

  // Filter parties based on selected partyType
  const filteredParties = parties.filter(p => p.type === form.partyType || (form.partyType === 'Party' && p.type !== 'Employee' && p.type !== 'Student'));

  return (
    <div className="hr-form">
      <div style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
        <SecHead title="Receipt" />
        <div style={{ padding:'20px 24px' }}>
          <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:620 }}><select style={iS}><option>{COLLEGE}</option></select></div></div>
          <div style={rS}><span style={lbS}>Head Name</span>
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
                  <input type="radio" name="rtype" checked={form.partyType===t} onChange={() => setForm(p => ({ ...p, partyType:t, party:'' }))} />{t}
                </label>
              ))}
            </div>
          </div>
          <div style={rS}>
            <span style={{ ...lbS, color:'#dc2626' }}>Party Name</span>
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
            <div style={rS}><span style={lbS}>Payment Mode</span><div style={{ flex:1 }}><select style={iS} value={form.payMode} onChange={set('payMode')}><option value="">Select</option><option>Cash</option><option>Cheque</option><option>Online/NEFT</option><option>DD</option></select></div></div>
            <div style={rS}><span style={lbS}>Bank Name</span>
              <div style={{ flex:1 }}>
                <select style={iS} value={form.bank} onChange={set('bank')}>
                  <option value="">Select Bank</option>
                  {banks.map(b => <option key={b.id} value={b.bank}>{b.bank} ({b.accNo})</option>)}
                </select>
              </div>
            </div>
            <div style={rS}><span style={lbS}>Cheque/Tran No</span><div style={{ flex:1 }}><input style={iS} value={form.chequeNo} onChange={set('chequeNo')} /></div></div>
            <div style={rS}><span style={lbS}>Cheque/Tran Date</span><div style={{ flex:1 }}><input style={iS} type="date" value={form.chequDate} onChange={set('chequDate')} /></div></div>
            <div style={rS}><span style={lbS}>Remarks</span><div style={{ flex:1 }}><textarea style={{ ...iS, height:60 }} value={form.remarks} onChange={set('remarks')} /></div></div>
            <div style={rS}><span style={lbS}>Deposit Bank</span>
              <div style={{ flex:1 }}>
                <select style={iS} value={form.depositBank} onChange={set('depositBank')}>
                  <option value="">Select Bank</option>
                  {banks.map(b => <option key={b.id} value={b.bank}>{b.bank} ({b.accNo})</option>)}
                </select>
              </div>
            </div>
            <div style={rS}><span style={lbS}>Deposit Date</span><div style={{ flex:1 }}><input style={iS} type="date" value={form.depositDate} onChange={set('depositDate')} /></div></div>
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {/* ── PRINTABLE RECEIPT MODAL ── */}
      {showReceiptModal && lastReceipt && (
        <div id="receipt-modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 99999, padding: 20, overflowY: 'auto'
        }}>
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #printable-receipt-card, #printable-receipt-card * { visibility: visible; }
              #printable-receipt-card {
                position: absolute; left: 0; top: 0; width: 100%;
                border: none !important; box-shadow: none !important;
                margin: 0 !important; padding: 0 !important;
              }
              .no-print { display: none !important; }
            }
          `}</style>
          
          <div id="printable-receipt-card" style={{
            background: '#fff', width: '700px', maxWidth: '100%',
            borderRadius: '12px', border: '2px solid #0f172a',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '40px', boxSizing: 'border-box', position: 'relative'
          }}>
            {/* College Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '24px' }}>
              <img src="/uct-logo.png.jpeg" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.5px' }}>{COLLEGE}</h2>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#475569', fontWeight: 500 }}>
                  Rua de Balide, Dili, Timor-Leste &bull; Tel: +670 3310000 &bull; accounts@uct.edu.tl
                </p>
              </div>
            </div>

            {/* Receipt Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ border: '2px solid #0f172a', padding: '6px 16px', borderRadius: '4px', fontWeight: 800, fontSize: '15px', textTransform: 'uppercase', color: '#0f172a' }}>
                RECEIPT VOUCHER
              </div>
              <div style={{ textAlign: 'right', fontSize: '13px' }}>
                <div><b>Receipt No:</b> <span style={{ color: '#0d5ef4', fontWeight: 700 }}>{lastReceipt.voucherNo}</span></div>
                <div style={{ marginTop: '4px' }}><b>Date:</b> {lastReceipt.date}</div>
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: '#1e293b', marginBottom: '30px' }}>
              <div style={{ display: 'flex', borderBottom: '1px dotted #cbd5e1', paddingBottom: '6px' }}>
                <span style={{ width: '150px', fontWeight: 600, color: '#475569' }}>Received From:</span>
                <span style={{ flex: 1, fontWeight: 700 }}>{lastReceipt.party || 'General Payee'}</span>
                <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>({lastReceipt.partyType})</span>
              </div>
              
              <div style={{ display: 'flex', borderBottom: '1px dotted #cbd5e1', paddingBottom: '6px' }}>
                <span style={{ width: '150px', fontWeight: 600, color: '#475569' }}>On Account of:</span>
                <span style={{ flex: 1 }}><b>{lastReceipt.head}</b> {lastReceipt.subhead ? `› ${lastReceipt.subhead}` : ''}</span>
              </div>

              <div style={{ display: 'flex', borderBottom: '1px dotted #cbd5e1', paddingBottom: '6px' }}>
                <span style={{ width: '150px', fontWeight: 600, color: '#475569' }}>Payment Mode:</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{lastReceipt.payMode || 'Cash'}</span>
                {lastReceipt.bank && (
                  <span style={{ color: '#475569', marginLeft: '12px' }}><b>Bank:</b> {lastReceipt.bank} {lastReceipt.chequeNo ? `(Ref/Cheque No: ${lastReceipt.chequeNo})` : ''}</span>
                )}
              </div>

              <div style={{ display: 'flex', borderBottom: '1px dotted #cbd5e1', paddingBottom: '6px' }}>
                <span style={{ width: '150px', fontWeight: 600, color: '#475569' }}>Amount in Figures:</span>
                <span style={{ flex: 1, fontWeight: 800, fontSize: '15px', color: '#0d5ef4' }}>
                  {getCurrencySymbol(lastReceipt.targetCurrency || 'USD')} {parseFloat(lastReceipt.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  {lastReceipt.inputCurrency && lastReceipt.inputCurrency !== lastReceipt.targetCurrency && (
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, marginLeft: '10px' }}>
                      (Converted from {getCurrencySymbol(lastReceipt.inputCurrency)} {parseFloat(lastReceipt.foreignAmount).toLocaleString()} @ {lastReceipt.exchangeRate})
                    </span>
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', borderBottom: '1px dotted #cbd5e1', paddingBottom: '6px' }}>
                <span style={{ width: '150px', fontWeight: 600, color: '#475569' }}>Amount in Words:</span>
                <span style={{ flex: 1, fontStyle: 'italic', fontWeight: 600 }}>
                  {numberToWords(parseFloat(lastReceipt.amount) || 0, lastReceipt.targetCurrency || 'USD')}
                </span>
              </div>

              {lastReceipt.remarks && (
                <div style={{ display: 'flex', borderBottom: '1px dotted #cbd5e1', paddingBottom: '6px' }}>
                  <span style={{ width: '150px', fontWeight: 600, color: '#475569' }}>Remarks:</span>
                  <span style={{ flex: 1 }}>{lastReceipt.remarks}</span>
                </div>
              )}
            </div>

            {/* Signature Blocks */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', fontSize: '12px', color: '#475569' }}>
              <div style={{ textAlign: 'center', width: '150px' }}>
                <div style={{ height: '30px' }}></div>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '6px', fontWeight: 600 }}>Prepared By</div>
              </div>
              <div style={{ textAlign: 'center', width: '150px' }}>
                <div style={{ height: '30px' }}></div>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '6px', fontWeight: 600 }}>Receiver's Sign</div>
              </div>
              <div style={{ textAlign: 'center', width: '150px' }}>
                <div style={{ height: '30px' }}></div>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '6px', fontWeight: 700, color: '#0f172a' }}>Authorised Signatory</div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <button onClick={() => setShowReceiptModal(false)} style={{
                background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px',
                padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
              }}>
                Close
              </button>
              <button onClick={printReceipt} style={{
                background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px',
                padding: '10px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                  <path d="M6 14h12v8H6z" />
                </svg>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
