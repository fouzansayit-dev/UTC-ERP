import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, SecHead } from './accountsConfig.jsx';
import './BillingReceipt.css';

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

export default function BillingReceipt() {
  // Lists
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [parties, setParties] = useState([]);
  const [banks, setBanks] = useState([]);
  const [cashbook, setCashbook] = useState([]);
  const [heads, setHeads] = useState([]);
  
  // Wizard state
  const [step, setStep] = useState(1);
  
  // Form state
  const [payerType, setPayerType] = useState('Student');
  const [selectedPayer, setSelectedPayer] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerId, setPayerId] = useState('');
  const [payerContact, setPayerContact] = useState('');
  const [payerDetails, setPayerDetails] = useState(''); // Course, Dept, Firm, Address
  
  const [receiptNo, setReceiptNo] = useState('');
  const [receiptDate, setReceiptDate] = useState(TODAY);
  const [invoiceRef, setInvoiceRef] = useState('');
  
  const [payMode, setPayMode] = useState('Cash');
  const [depositBank, setDepositBank] = useState('');
  const [bankRefNo, setBankRefNo] = useState('');
  const [bankRefDate, setBankRefDate] = useState(TODAY);
  
  // Items in bill
  const [items, setItems] = useState([
    { description: 'Tuition Fee', qty: 1, rate: '' }
  ]);
  
  const [taxRate, setTaxRate] = useState(0); // in percent
  const [discount, setDiscount] = useState(0); // flat amount
  const [remarks, setRemarks] = useState('');

  const [inputCurrency, setInputCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);

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
  
  // Load data
  useEffect(() => {
    // 1. Fetch Students
    fetch('/api/students')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setStudents(data); })
      .catch(err => console.error('Error fetching students:', err));
      
    // 2. Fetch Employees
    fetch('/api/hr')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setEmployees(data); })
      .catch(err => console.error('Error fetching employees:', err));

    // 3. Fetch Parties
    fetch('/api/generic/accounts/parties')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setParties(data); })
      .catch(err => console.error('Error fetching parties:', err));

    // 4. Fetch Banks
    fetch('/api/generic/accounts/banks')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setBanks(data); })
      .catch(err => console.error('Error fetching banks:', err));

    // 5. Fetch Heads
    fetch('/api/generic/accounts/heads')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setHeads(data); })
      .catch(err => console.error('Error fetching heads:', err));

    // 6. Fetch Cashbook & generate Receipt No
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCashbook(data);
          const billSeq = data.filter(entry => entry.voucherNo && entry.voucherNo.startsWith('BR/UCT/')).length;
          const currentYear = new Date().getFullYear();
          setReceiptNo(`BR/UCT/${currentYear}/${billSeq + 1}`);
        } else {
          const currentYear = new Date().getFullYear();
          setReceiptNo(`BR/UCT/${currentYear}/1`);
        }
      })
      .catch(() => {
        const currentYear = new Date().getFullYear();
        setReceiptNo(`BR/UCT/${currentYear}/1`);
      });
  }, []);

  // Recalculate Receipt No when cashbook changes
  const updateReceiptNo = (currentCashbook) => {
    const billSeq = currentCashbook.filter(entry => entry.voucherNo && entry.voucherNo.startsWith('BR/UCT/')).length;
    const currentYear = new Date().getFullYear();
    setReceiptNo(`BR/UCT/${currentYear}/${billSeq + 1}`);
  };

  // Sync payer selections
  const handlePayerChange = (idVal) => {
    setSelectedPayer(idVal);
    if (!idVal) {
      setPayerName('');
      setPayerId('');
      setPayerContact('');
      setPayerDetails('');
      return;
    }

    if (payerType === 'Student') {
      const match = students.find(s => String(s.scholar_no || s.id) === idVal);
      if (match) {
        setPayerName(match.name || '');
        setPayerId(match.scholar_no || String(match.id));
        setPayerContact(match.mobile || match.phone || '');
        setPayerDetails(match.course ? `${match.course} > ${match.branch || ''}` : 'Student Profile');
      }
    } else if (payerType === 'Employee') {
      const match = employees.find(e => String(e.emp_id || e.id) === idVal);
      if (match) {
        setPayerName(match.name || '');
        setPayerId(match.emp_id || String(match.id));
        setPayerContact(match.phone || match.mobile || '');
        setPayerDetails(match.designation ? `${match.designation} (${match.department || ''})` : 'Employee Profile');
      }
    } else if (payerType === 'Party') {
      const match = parties.find(p => String(p.id) === idVal);
      if (match) {
        setPayerName(match.name || '');
        setPayerId(`PRT-${match.id}`);
        setPayerContact(match.mobile || '');
        setPayerDetails(match.firm ? `${match.firm} (Vendor)` : 'Registered Party');
      }
    }
  };

  const handlePayerTypeChange = (type) => {
    setPayerType(type);
    setSelectedPayer('');
    setPayerName('');
    setPayerId('');
    setPayerContact('');
    setPayerDetails('');
  };

  // Item helpers
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { description: '', qty: 1, rate: '' }]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculations
  const subtotal = items.reduce((acc, curr) => {
    const qty = parseFloat(curr.qty) || 0;
    const rate = parseFloat(curr.rate) || 0;
    return acc + (qty * rate);
  }, 0);

  const taxAmount = subtotal * ((parseFloat(taxRate) || 0) / 100);
  const grandTotal = Math.max(0, subtotal + taxAmount - (parseFloat(discount) || 0));

  // Multi-currency to words converter
  const numberToWords = (amount, curr = 'USD') => {
    const parts = Number(amount).toFixed(2).split('.');
    const dollars = parseInt(parts[0], 10);
    const cents = parseInt(parts[1], 10);

    const convertThreeDigits = (num) => {
      const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      let str = '';
      if (num >= 100) {
        str += a[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }
      if (num >= 20) {
        str += b[Math.floor(num / 10)] + ' ';
        num %= 10;
      }
      if (num > 0) {
        str += a[num] + ' ';
      }
      return str.trim();
    };

    const convertAmount = (num) => {
      if (num === 0) return 'Zero';
      const g = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
      let word = '';
      let parts = [];
      while (num > 0) {
        parts.push(num % 1000);
        num = Math.floor(num / 1000);
      }
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] > 0) {
          word = convertThreeDigits(parts[i]) + ' ' + g[i] + ' ' + word;
        }
      }
      return word.trim();
    };

    const currencyNames = {
      USD: { main: 'Dollar', plural: 'Dollars', sub: 'Cent', subPlural: 'Cents' },
      INR: { main: 'Rupee', plural: 'Rupees', sub: 'Paisa', subPlural: 'Paise' },
      EUR: { main: 'Euro', plural: 'Euros', sub: 'Cent', subPlural: 'Cents' },
      GBP: { main: 'Pound', plural: 'Pounds', sub: 'Penny', subPlural: 'Pence' },
      CNY: { main: 'Yuan', plural: 'Yuan', sub: 'Fen', subPlural: 'Fen' },
      AUD: { main: 'Australian Dollar', plural: 'Australian Dollars', sub: 'Cent', subPlural: 'Cents' }
    };

    const cur = currencyNames[curr] || currencyNames.USD;

    if (dollars === 0 && cents === 0) return `Zero ${cur.plural} Only`;

    let dollarStr = convertAmount(dollars);
    let finalStr = dollars > 0 ? dollarStr + ' ' + (dollars === 1 ? cur.main : cur.plural) : '';
    
    if (cents > 0) {
      let centsStr = convertThreeDigits(cents);
      if (dollars > 0) {
        finalStr += ' and ' + centsStr + ' ' + (cents === 1 ? cur.sub : cur.subPlural);
      } else {
        finalStr = centsStr + ' ' + (cents === 1 ? cur.sub : cur.subPlural);
      }
    }
    
    return finalStr + ' Only';
  };

  const targetGrandTotal = grandTotal * exchangeRate;
  const grandTotalWords = numberToWords(targetGrandTotal, targetCurrency);

  // Validate steps
  const validateStep1 = () => {
    if (!payerName) {
      alert('Payer details are required. Please select or enter a payer.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!receiptNo) {
      alert('Receipt Number is required.');
      return false;
    }
    if (payMode !== 'Cash' && !depositBank) {
      alert('Please select a Deposit Bank for Bank/Cheque payments.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const invalidItem = items.some(item => !item.description || !item.rate || parseFloat(item.rate) <= 0);
    if (invalidItem) {
      alert('Please enter valid description and rates for all items.');
      return false;
    }
    if (grandTotal <= 0) {
      alert('Grand total must be greater than zero.');
      return false;
    }
    return true;
  };

  // Submit and save transaction
  const handleSaveAndPrint = () => {
    // Generate cashbook transaction details
    const itemDetails = items.map(it => `${it.description} (x${it.qty})`).join(', ');
    const userObj = JSON.parse(sessionStorage.getItem('uct_user') || '{}');
    const preparedBy = userObj.username || 'Accounts Officer';
    
    // Choose appropriate Head Name
    let mainHead = 'General Income';
    if (items[0] && items[0].description) {
      // Find matching Head in Head Master
      const match = heads.find(h => h.head.toLowerCase() === items[0].description.toLowerCase());
      if (match) {
        mainHead = match.head;
      }
    }

    const targetGrandTotalVal = parseFloat((grandTotal * exchangeRate).toFixed(2));

    const transactionEntry = {
      id: Date.now(),
      type: 'Credit',
      head: mainHead,
      subhead: items[0] ? items[0].description : 'Billing Inflow',
      partyType: payerType,
      party: payerName,
      voucherNo: receiptNo,
      date: receiptDate,
      amount: targetGrandTotalVal,
      payMode: payMode,
      bank: depositBank || 'Cash Box',
      remarks: remarks || `Billing Details: ${itemDetails}. Prepared by: ${preparedBy}`,
      reference: receiptNo,
      billingItems: items,
      taxRate,
      discount,
      inputCurrency,
      targetCurrency,
      exchangeRate,
      foreignAmount: grandTotal
    };

    const updatedCashbook = [...cashbook, transactionEntry];

    // POST to generic cashbook store
    fetch('/api/generic/accounts/cashbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCashbook)
    })
      .then(res => {
        if (!res.ok) throw new Error('Server returned an error');
        return res.json();
      })
      .then(() => {
        // Trigger browser print
        window.print();
        
        alert('Billing Receipt saved and printed successfully!');
        
        // Reset wizard
        setStep(1);
        setPayerType('Student');
        setSelectedPayer('');
        setPayerName('');
        setPayerId('');
        setPayerContact('');
        setPayerDetails('');
        setPayMode('Cash');
        setDepositBank('');
        setBankRefNo('');
        setItems([{ description: 'Tuition Fee', qty: 1, rate: '' }]);
        setTaxRate(0);
        setDiscount(0);
        setRemarks('');
        setInputCurrency('USD');
        setTargetCurrency('USD');
        setExchangeRate(1);
        
        // Reload cashbook
        fetch('/api/generic/accounts/cashbook')
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setCashbook(data);
              updateReceiptNo(data);
            }
          });
      })
      .catch(err => {
        alert('Failed to save receipt to ledger: ' + err.message);
      });
  };

  const getPayerPlaceholder = () => {
    switch (payerType) {
      case 'Student': return '-- Search Student --';
      case 'Employee': return '-- Search Employee --';
      case 'Party': return '-- Search Party/Vendor --';
      default: return '';
    }
  };

  return (
    <div className="billing-receipt-container">
      {/* ── STEPPER HEADER ── */}
      <div className="br-stepper no-print">
        {[
          { label: 'Payer Details', num: 1 },
          { label: 'Payment Setup', num: 2 },
          { label: 'Particulars', num: 3 },
          { label: 'Preview & Print', num: 4 }
        ].map(s => (
          <div key={s.num} className={`br-step ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}>
            <div className="br-step-num">{s.num}</div>
            <div className="br-step-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── STEP 1: PAYER DETAILS ── */}
      {step === 1 && (
        <div className="br-card no-print">
          <div className="br-card-header">Step 1: Choose Payer Information</div>
          <div className="br-card-body">
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8, color: '#475569' }}>Select Individual Category</label>
              <div className="br-radio-group">
                {['Student', 'Employee', 'Party', 'Other'].map(t => (
                  <label key={t} className="br-radio-label">
                    <input 
                      type="radio" 
                      name="payerType" 
                      checked={payerType === t} 
                      onChange={() => handlePayerTypeChange(t)} 
                    />
                    {t === 'Party' ? 'Vendor / Party' : t === 'Other' ? 'Other Guest' : t}
                  </label>
                ))}
              </div>
            </div>

            {payerType !== 'Other' ? (
              <div className="br-form-group" style={{ marginBottom: 20 }}>
                <label>Find Registered Individual *</label>
                <select value={selectedPayer} onChange={e => handlePayerChange(e.target.value)}>
                  <option value="">{getPayerPlaceholder()}</option>
                  {payerType === 'Student' && students.map(s => (
                    <option key={s.id} value={s.scholar_no || s.id}>{s.name} ({s.scholar_no || `ID: ${s.id}`})</option>
                  ))}
                  {payerType === 'Employee' && employees.map(e => (
                    <option key={e.id} value={e.emp_id || e.id}>{e.name} ({e.emp_id || `ID: ${e.id}`})</option>
                  ))}
                  {payerType === 'Party' && parties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} {p.firm ? `(${p.firm})` : ''}</option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="br-form-grid">
              <div className="br-form-group">
                <label>Individual Name *</label>
                <input 
                  type="text" 
                  value={payerName} 
                  onChange={e => setPayerName(e.target.value)} 
                  readOnly={payerType !== 'Other'}
                  placeholder="Enter name"
                />
              </div>
              <div className="br-form-group">
                <label>Unique ID / Reference</label>
                <input 
                  type="text" 
                  value={payerId} 
                  onChange={e => setPayerId(e.target.value)} 
                  readOnly={payerType !== 'Other'}
                  placeholder="e.g. SCH-101 / EMP-101"
                />
              </div>
              <div className="br-form-group">
                <label>Contact Number</label>
                <input 
                  type="text" 
                  value={payerContact} 
                  onChange={e => setPayerContact(e.target.value)} 
                  readOnly={payerType !== 'Other'}
                  placeholder="e.g. +670 77000000"
                />
              </div>
              <div className="br-form-group">
                <label>{payerType === 'Student' ? 'Course / Batch' : payerType === 'Employee' ? 'Designation / Department' : 'Address / Remarks'}</label>
                <input 
                  type="text" 
                  value={payerDetails} 
                  onChange={e => setPayerDetails(e.target.value)} 
                  readOnly={payerType !== 'Other'}
                  placeholder="Additional details"
                />
              </div>
            </div>

            <div className="br-actions-row">
              <div></div>
              <button 
                className="br-btn br-btn-primary" 
                onClick={() => { if (validateStep1()) setStep(2); }}
              >
                Next Step &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: RECEIPT & PAYMENT SETUP ── */}
      {step === 2 && (
        <div className="br-card no-print">
          <div className="br-card-header">Step 2: Receipt Voucher & Payment Details</div>
          <div className="br-card-body">
            <div className="br-form-grid">
              <div className="br-form-group">
                <label>Receipt Number (Sequential) *</label>
                <input 
                  type="text" 
                  value={receiptNo} 
                  onChange={e => setReceiptNo(e.target.value)} 
                />
              </div>
              <div className="br-form-group">
                <label>Receipt Date *</label>
                <input 
                  type="date" 
                  value={receiptDate} 
                  onChange={e => setReceiptDate(e.target.value)} 
                />
              </div>
              <div className="br-form-group">
                <label>Invoice Ref / Billing Reference No</label>
                <input 
                  type="text" 
                  value={invoiceRef} 
                  onChange={e => setInvoiceRef(e.target.value)} 
                  placeholder="e.g. INV/2026/08"
                />
              </div>
            </div>

            <div className="br-form-grid" style={{ marginTop: 10 }}>
              <div className="br-form-group">
                <label>Payment Mode *</label>
                <select value={payMode} onChange={e => setPayMode(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online/NEFT">Online / NEFT</option>
                  <option value="Cheque">Cheque</option>
                  <option value="DD">Demand Draft (DD)</option>
                </select>
              </div>

              {payMode !== 'Cash' && (
                <>
                  <div className="br-form-group">
                    <label>Deposit Bank Account *</label>
                    <select value={depositBank} onChange={e => setDepositBank(e.target.value)}>
                      <option value="">-- Select Bank Account --</option>
                      {banks.map(b => (
                        <option key={b.id} value={`${b.bank} (${b.accNo})`}>{b.bank} - Acc No: {b.accNo}</option>
                      ))}
                    </select>
                  </div>
                  <div className="br-form-group">
                    <label>{payMode === 'Cheque' ? 'Cheque No *' : payMode === 'DD' ? 'DD No *' : 'Transaction Ref / UTR *'}</label>
                    <input 
                      type="text" 
                      value={bankRefNo} 
                      onChange={e => setBankRefNo(e.target.value)} 
                      placeholder="e.g. UTR12345678"
                    />
                  </div>
                  <div className="br-form-group">
                    <label>Transaction/Cheque Date</label>
                    <input 
                      type="date" 
                      value={bankRefDate} 
                      onChange={e => setBankRefDate(e.target.value)} 
                    />
                  </div>
                </>
              )}
            </div>

            <div className="br-actions-row">
              <button className="br-btn br-btn-secondary" onClick={() => setStep(1)}>&larr; Back</button>
              <button className="br-btn br-btn-primary" onClick={() => { if (validateStep2()) setStep(3); }}>Next Step &rarr;</button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: BILLING PARTICULARS ── */}
      {step === 3 && (
        <div className="br-card no-print">
          <div className="br-card-header">Step 3: Billing Items & Calculations</div>
          <div className="br-card-body">
            {/* Currency Setup Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20, background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div className="br-form-group" style={{ marginBottom: 0 }}>
                <label>Billing/Input Currency</label>
                <select style={{ width: '100%', padding: '8px' }} value={inputCurrency} onChange={e => setInputCurrency(e.target.value)}>
                  {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="br-form-group" style={{ marginBottom: 0 }}>
                <label>Ledger/Target Currency</label>
                <select style={{ width: '100%', padding: '8px' }} value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)}>
                  {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="br-form-group" style={{ marginBottom: 0 }}>
                <label>Exchange Rate</label>
                <input 
                  type="number" 
                  step="0.0001" 
                  style={{ width: '100%', padding: '8px' }} 
                  value={exchangeRate} 
                  onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)} 
                />
              </div>
            </div>

            <table className="br-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>SNo</th>
                  <th style={{ width: '45%' }}>Description / Fee Head *</th>
                  <th style={{ width: '15%' }}>Quantity *</th>
                  <th style={{ width: '20%' }}>Unit Rate ({getCurrencySymbol(inputCurrency)}) *</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Total ({getCurrencySymbol(inputCurrency)})</th>
                  <th style={{ width: '5%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <input 
                        type="text" 
                        value={item.description} 
                        onChange={e => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="e.g. Tuition Fee / Admission Deposit"
                        style={{ width: '90%' }}
                        list="common-heads"
                      />
                      <datalist id="common-heads">
                        <option value="Tuition Fee" />
                        <option value="Admission Fee" />
                        <option value="Registration Fee" />
                        <option value="Hostel Accommodation Fee" />
                        <option value="Mess / Meal Plan Fee" />
                        <option value="Library Fee" />
                        <option value="Lab & Equipments Fee" />
                        <option value="Examination fee" />
                        <option value="Certificate fee" />
                        <option value="ID Card Replacement" />
                        <option value="Uniform Charges" />
                        <option value="Penalty / Late Fee Fine" />
                      </datalist>
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={item.qty} 
                        onChange={e => handleItemChange(idx, 'qty', parseInt(e.target.value) || 0)}
                        min="1"
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        step="0.01"
                        value={item.rate} 
                        onChange={e => handleItemChange(idx, 'rate', parseFloat(e.target.value) || '')}
                        placeholder="0.00"
                        style={{ width: '120px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#334155' }}>
                      {getCurrencySymbol(inputCurrency)} {((parseInt(item.qty) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}
                    </td>
                    <td>
                      <button 
                        className="br-btn br-btn-danger" 
                        style={{ padding: '6px 10px', fontSize: 11 }}
                        onClick={() => removeItemRow(idx)}
                        disabled={items.length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 14 }}>
              <button className="br-btn br-btn-secondary" style={{ padding: '6px 14px', fontSize: 12.5 }} onClick={addItemRow}>
                + Add Item Row
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 30, marginTop: 30 }}>
              <div className="br-form-group">
                <label>Remarks / Notes</label>
                <textarea 
                  value={remarks} 
                  onChange={e => setRemarks(e.target.value)} 
                  placeholder="Enter remarks to print on the bottom of the receipt..." 
                  style={{ height: 100, resize: 'none' }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13.5 }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Subtotal:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{getCurrencySymbol(inputCurrency)} {subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ color: '#475569', fontWeight: 500, fontSize: 13.5 }}>Tax Rate (%):</span>
                  <input 
                    type="number" 
                    value={taxRate} 
                    onChange={e => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    style={{ width: 60, padding: '4px 8px', fontSize: 13, textAlign: 'right' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13.5 }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>Tax Amount:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{getCurrencySymbol(inputCurrency)} {taxAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ color: '#475569', fontWeight: 500, fontSize: 13.5 }}>Discount ({getCurrencySymbol(inputCurrency)}):</span>
                  <input 
                    type="number" 
                    value={discount} 
                    onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    style={{ width: 80, padding: '4px 8px', fontSize: 13, textAlign: 'right' }}
                  />
                </div>
                <div style={{ borderTop: '2px solid #cbd5e1', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Grand Total ({inputCurrency}):</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#2563eb' }}>{getCurrencySymbol(inputCurrency)} {grandTotal.toFixed(2)}</span>
                </div>
                {inputCurrency !== targetCurrency && (
                  <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#475569' }}>Grand Total ({targetCurrency}):</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{getCurrencySymbol(targetCurrency)} {targetGrandTotal.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ marginTop: 14, fontSize: 11.5, color: '#475569', fontStyle: 'italic', background: '#fff', padding: 10, borderRadius: 6, border: '1px dotted #cbd5e1' }}>
                  <strong>Words ({targetCurrency}):</strong> {grandTotalWords}
                </div>
              </div>
            </div>

            <div className="br-actions-row">
              <button className="br-btn br-btn-secondary" onClick={() => setStep(2)}>&larr; Back</button>
              <button className="br-btn br-btn-primary" onClick={() => { if (validateStep3()) setStep(4); }}>Next: Preview Receipt &rarr;</button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: PREVIEW & PRINT ── */}
      {step === 4 && (
        <div>
          {/* Action Row at Top (Hidden in print) */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: 13.5, color: '#475569' }}>
              <strong>Previewing Billing Receipt:</strong> Please verify all details. Click "Confirm & Print Receipt" to save to database and open the print dialog.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="br-btn br-btn-secondary" onClick={() => setStep(3)}>&larr; Edit Details</button>
              <button className="br-btn br-btn-success" onClick={handleSaveAndPrint}>Confirm & Print Receipt</button>
            </div>
          </div>

          {/* GORGEOUS PRINT LAYOUT CONTAINER */}
          <div className="invoice-print-container">
            {/* Header Block */}
            <div className="invoice-header">
              <div className="brand-logo-container">UCT</div>
              <div className="brand-title">
                <h1>UNIVERSIDADE CATÓLICA TIMORENSE</h1>
                <p>Campus de Balide, Dili, Timor-Leste &bull; Tel: +670 3310000 &bull; accounts@uct.edu.tl</p>
                <p>Official Catholic University of East Timor (Universidade Católica Timorense São João Paulo II)</p>
              </div>
            </div>

            {/* Document Title */}
            <div className="invoice-title">
              <h2>OFFICIAL BILLING RECEIPT</h2>
            </div>

            {/* Payer and Receipt Details Grid */}
            <table className="receipt-details-table">
              <tbody>
                <tr>
                  <td className="label-cell">Payer Name</td>
                  <td className="value-cell" style={{ fontWeight: 700 }}>{payerName}</td>
                  <td className="label-cell">Receipt No</td>
                  <td className="value-cell" style={{ fontWeight: 700, color: '#1e3a8a' }}>{receiptNo}</td>
                </tr>
                <tr>
                  <td className="label-cell">Payer ID / Ref</td>
                  <td className="value-cell">{payerId || '—'}</td>
                  <td className="label-cell">Receipt Date</td>
                  <td className="value-cell">{receiptDate}</td>
                </tr>
                <tr>
                  <td className="label-cell">Category</td>
                  <td className="value-cell" style={{ textTransform: 'capitalize' }}>{payerType}</td>
                  <td className="label-cell">Payment Mode</td>
                  <td className="value-cell" style={{ fontWeight: 700 }}>
                    {payMode} 
                    {payMode !== 'Cash' && bankRefNo && ` (${bankRefNo})`}
                  </td>
                </tr>
                <tr>
                  <td className="label-cell">Details / Course</td>
                  <td className="value-cell">{payerDetails || '—'}</td>
                  <td className="label-cell">Billing Ref</td>
                  <td className="value-cell">{invoiceRef || '—'}</td>
                </tr>
                {payMode !== 'Cash' && (
                  <tr>
                    <td className="label-cell">Deposit Account</td>
                    <td className="value-cell">{depositBank}</td>
                    <td className="label-cell">Tx Date / Cheque Date</td>
                    <td className="value-cell">{bankRefDate}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Itemized Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th style={{ width: '10%', textAlign: 'center' }}>SNo.</th>
                  <th style={{ width: '55%' }}>Description / Particulars</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Qty</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Unit Rate ({getCurrencySymbol(inputCurrency)})</th>
                  <th style={{ width: '13%', textAlign: 'right' }}>Total ({getCurrencySymbol(inputCurrency)})</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                    <td>{item.description}</td>
                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ textAlign: 'right' }}>{getCurrencySymbol(inputCurrency)} {(parseFloat(item.rate) || 0).toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{getCurrencySymbol(inputCurrency)} {((parseInt(item.qty) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}</td>
                  </tr>
                ))}
                
                {/* Subtotal Row */}
                <tr>
                  <td colSpan={3} style={{ border: 'none' }}></td>
                  <td style={{ textAlign: 'right', fontWeight: 700, background: '#f8fafc' }}>Subtotal:</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, background: '#f8fafc' }}>{getCurrencySymbol(inputCurrency)} {subtotal.toFixed(2)}</td>
                </tr>

                {/* Tax Row */}
                {taxRate > 0 && (
                  <tr>
                    <td colSpan={3} style={{ border: 'none' }}></td>
                    <td style={{ textAlign: 'right', fontWeight: 600, background: '#f8fafc' }}>Tax ({taxRate}%):</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, background: '#f8fafc' }}>{getCurrencySymbol(inputCurrency)} {taxAmount.toFixed(2)}</td>
                  </tr>
                )}

                {/* Discount Row */}
                {discount > 0 && (
                  <tr>
                    <td colSpan={3} style={{ border: 'none' }}></td>
                    <td style={{ textAlign: 'right', fontWeight: 600, background: '#f8fafc', color: '#dc2626' }}>Discount:</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, background: '#f8fafc', color: '#dc2626' }}>- {getCurrencySymbol(inputCurrency)} {discount.toFixed(2)}</td>
                  </tr>
                )}

                {/* Net Grand Total Row */}
                <tr style={{ background: '#f1f5f9' }}>
                  <td colSpan={3} style={{ border: 'none' }}></td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: '#1e3a8a', fontSize: '13px' }}>Grand Total ({inputCurrency}):</td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: '#1e3a8a', fontSize: '14px' }}>{getCurrencySymbol(inputCurrency)} {grandTotal.toFixed(2)}</td>
                </tr>

                {/* Converted Net Grand Total Row */}
                {inputCurrency !== targetCurrency && (
                  <tr style={{ background: '#f0fdf4' }}>
                    <td colSpan={3} style={{ border: 'none' }}></td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#15803d', fontSize: '13px' }}>Grand Total ({targetCurrency}):</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#15803d', fontSize: '14px' }}>{getCurrencySymbol(targetCurrency)} {targetGrandTotal.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Words Total representation */}
            <div style={{ border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: 6, fontSize: '12px', background: '#f8fafc', marginBottom: 24 }}>
              <strong>Amount in Words ({targetCurrency}):</strong> <span style={{ fontStyle: 'italic', fontWeight: 600 }}>{grandTotalWords}</span>
              {inputCurrency !== targetCurrency && (
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  * Converted from {getCurrencySymbol(inputCurrency)} {grandTotal.toFixed(2)} at exchange rate of {exchangeRate} {targetCurrency} per {inputCurrency}
                </div>
              )}
            </div>

            {/* Remarks, if any */}
            {remarks && (
              <div style={{ marginBottom: 24, fontSize: '12px' }}>
                <strong>Remarks / Notes:</strong>
                <p style={{ margin: '4px 0 0', color: '#475569', lineHeight: 1.4 }}>{remarks}</p>
              </div>
            )}

            {/* Footer Block */}
            <div className="invoice-footer">
              <div className="terms">
                <p>Important Terms & Conditions:</p>
                <ul>
                  <li>Fees/charges collected are strictly non-refundable and non-transferable under university policy.</li>
                  <li>Please retain this official copy of the billing receipt for future verification and registrations.</li>
                  <li>This receipt is generated securely from the institutional ERP database.</li>
                </ul>
              </div>

              {/* Signatures Row */}
              <div className="signatures">
                <div className="sig-line">
                  <div style={{ height: 40 }}></div>
                  <p>Prepared By</p>
                </div>
                <div className="sig-line">
                  <div style={{ height: 40 }}></div>
                  <p>Receiver's Sign</p>
                </div>
                <div className="sig-line">
                  <div style={{ height: 40 }}></div>
                  <p>Authorised Stamp & Sign</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
