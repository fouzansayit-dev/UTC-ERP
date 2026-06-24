import React, { useState, useEffect } from 'react';
import { courses, branches, batches, paymentModes } from '../feeConfig.js';
import '../../student/Student.css';
import './FeeReceiptPrint.css';

const EXCHANGE_RATES = {
  USD: 83.50,
  EUR: 90.25,
  GBP: 106.10,
  CNY: 11.50,
  RUB: 0.95,
  INR: 1.00
};

export default function FeeReceipt() {
  const [receipts, setReceipts] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  // Form states
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  
  const [feeHead, setFeeHead] = useState('Tuition Fee');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [amountINR, setAmountINR] = useState('');
  const [amountForeign, setAmountForeign] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [utrNo, setUtrNo] = useState('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);

  // Active print receipt state
  const [printReceipt, setPrintReceipt] = useState(null);

  const loadReceipts = () => {
    fetch('/api/fees')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((r, i) => ({
          ...r,
          sno: i + 1,
          receiptNo: r.receipt_no,
          studentId: r.scholar_no || r.student_id,
          studentName: r.student_name,
          feeHead: r.head_wise_details?.feeHead || 'Tuition Fee',
          currency: r.head_wise_details?.currency || 'INR',
          amountINR: r.head_wise_details?.amountINR || r.amount || 0,
          amountForeign: r.head_wise_details?.amountForeign || 0,
          paymentMode: r.payment_mode,
          utrNo: r.head_wise_details?.utrNo || '',
          exchangeRate: r.head_wise_details?.exchangeRate || EXCHANGE_RATES[r.head_wise_details?.currency] || 1
        }));
        setReceipts(mapped);
      })
      .catch(err => console.error('Error loading receipts:', err));
  };

  useEffect(() => {
    loadReceipts();
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setAllStudents(data))
      .catch(err => console.error('Error loading students:', err));
  }, []);

  // Sync Student selection
  const handleStudentChange = (val) => {
    setStudentId(val);
    if (!val) {
      setStudentName('');
      setSelectedCourse('');
      setSelectedBranch('');
      setSelectedBatch('');
      return;
    }
    const match = allStudents.find(s => 
      String(s.scholar_no) === val || 
      String(s.id) === val
    );
    if (match) {
      setStudentName(match.name);
      setSelectedCourse(match.course || match.courseName || '');
      setSelectedBranch(match.branch || match.branchName || '');
      setSelectedBatch(match.batch || '');
    }
  };

  // Auto conversion logic
  const handleForeignAmountChange = (val) => {
    setAmountForeign(val);
    const num = parseFloat(val);
    if (!isNaN(num) && selectedCurrency !== 'INR') {
      const rate = EXCHANGE_RATES[selectedCurrency] || 1;
      setAmountINR((num * rate).toFixed(2));
    } else {
      setAmountINR('');
    }
  };

  const handleCurrencyChange = (curr) => {
    setSelectedCurrency(curr);
    setAmountForeign('');
    setAmountINR('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const match = allStudents.find(s => 
      String(s.scholar_no) === studentId || 
      String(s.id) === studentId
    );

    if (!match) {
      alert('Please select a valid student.');
      return;
    }

    const finalAmount = selectedCurrency === 'INR' ? parseFloat(amountINR) : parseFloat(amountForeign);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const requestBody = {
      student_id: match.id,
      amount: parseFloat(amountINR), // Save base in INR
      payment_mode: paymentMode,
      date: receiptDate,
      head_wise_details: {
        feeHead,
        currency: selectedCurrency,
        amountINR: parseFloat(amountINR),
        amountForeign: selectedCurrency !== 'INR' ? parseFloat(amountForeign) : 0,
        exchangeRate: EXCHANGE_RATES[selectedCurrency],
        utrNo: (paymentMode === 'Online' || paymentMode === 'Cheque' || paymentMode === 'DD') ? utrNo : ''
      }
    };

    fetch('/api/fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to save fee collection');
        alert(`Fee receipt generated and saved successfully! Receipt No: ${body.receipt_no}`);
        
        // Trigger print preview
        const newReceipt = {
          receiptNo: body.receipt_no,
          studentId: match.scholar_no || match.id,
          studentName: match.name,
          course: selectedCourse,
          branch: selectedBranch,
          batch: selectedBatch,
          feeHead,
          currency: selectedCurrency,
          amountINR: parseFloat(amountINR),
          amountForeign: selectedCurrency !== 'INR' ? parseFloat(amountForeign) : 0,
          paymentMode,
          date: receiptDate,
          utrNo: (paymentMode === 'Online' || paymentMode === 'Cheque' || paymentMode === 'DD') ? utrNo : '',
          exchangeRate: EXCHANGE_RATES[selectedCurrency]
        };
        setPrintReceipt(newReceipt);

        // Reset
        setStudentId('');
        setStudentName('');
        setSelectedCourse('');
        setSelectedBranch('');
        setSelectedBatch('');
        setAmountINR('');
        setAmountForeign('');
        setUtrNo('');
        loadReceipts();
      })
      .catch(err => alert(err.message));
  };

  const handlePrint = (r) => {
    const sMatch = allStudents.find(s => String(s.scholar_no) === String(r.studentId) || s.id === r.student_id);
    const receiptToPrint = {
      ...r,
      course: sMatch ? (sMatch.course || sMatch.courseName) : (r.course || 'MBBS'),
      branch: sMatch ? (sMatch.branch || sMatch.branchName) : (r.branch || 'MEDICINE'),
      batch: sMatch ? sMatch.batch : (r.batch || '2024-2030'),
      utrNo: r.utrNo || r.head_wise_details?.utrNo || ''
    };
    setPrintReceipt(receiptToPrint);
  };

  const executePrint = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Receipt</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Fee Receipt</div>
      </div>

      {/* Form Card */}
      <div className="stu-filter-card no-print">
        <div className="stu-filter-header">Fee Receipt Entry</div>
        <div className="stu-filter-body">
          <form onSubmit={handleSubmit}>
            <div className="stu-form-grid">
              <div className="stu-field">
                <label>Select Student *</label>
                <select value={studentId} onChange={e => handleStudentChange(e.target.value)} required>
                  <option value="">-- Choose Student --</option>
                  {allStudents.map(s => (
                    <option key={s.id} value={s.scholar_no || s.id}>
                      {s.name} ({s.scholar_no || `ID: ${s.id}`})
                    </option>
                  ))}
                </select>
              </div>
              <div className="stu-field">
                <label>Student Name</label>
                <input type="text" value={studentName} readOnly placeholder="Auto-populated" />
              </div>
              <div className="stu-field">
                <label>Course</label>
                <input type="text" value={selectedCourse} readOnly placeholder="Auto-populated" />
              </div>
              <div className="stu-field">
                <label>Branch</label>
                <input type="text" value={selectedBranch} readOnly placeholder="Auto-populated" />
              </div>
              <div className="stu-field">
                <label>Batch</label>
                <input type="text" value={selectedBatch} readOnly placeholder="Auto-populated" />
              </div>
              <div className="stu-field">
                <label>Fee Head *</label>
                <input type="text" value={feeHead} onChange={e => setFeeHead(e.target.value)} required />
              </div>

              {/* Currency auto conversion */}
              <div className="stu-field">
                <label>Currency Option *</label>
                <select value={selectedCurrency} onChange={e => handleCurrencyChange(e.target.value)}>
                  {Object.keys(EXCHANGE_RATES).map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
              
              <div className="stu-field">
                <label>Amount ({selectedCurrency}) *</label>
                {selectedCurrency === 'INR' ? (
                  <input 
                    type="number" 
                    step="0.01" 
                    value={amountINR} 
                    onChange={e => setAmountINR(e.target.value)} 
                    placeholder="Enter INR amount" 
                    required 
                  />
                ) : (
                  <input 
                    type="number" 
                    step="0.01" 
                    value={amountForeign} 
                    onChange={e => handleForeignAmountChange(e.target.value)} 
                    placeholder={`Enter ${selectedCurrency} amount`} 
                    required 
                  />
                )}
              </div>

              <div className="stu-field">
                <label>Indian Currency Base (INR Equivalent)</label>
                <input 
                  type="text" 
                  value={amountINR} 
                  readOnly 
                  placeholder="INR equivalent auto-calculated" 
                  style={{ backgroundColor: '#f1f5f9', fontWeight: 600, color: '#0f172a' }} 
                />
              </div>

              <div className="stu-field">
                <label>Payment Mode *</label>
                <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} required>
                  {paymentModes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {(paymentMode === 'Online' || paymentMode === 'Cheque' || paymentMode === 'DD') && (
                <div className="stu-field">
                  <label>
                    {paymentMode === 'Online' ? 'UTR / Transaction Reference No *' : 'Cheque / DD Number *'}
                  </label>
                  <input 
                    type="text" 
                    value={utrNo} 
                    onChange={e => setUtrNo(e.target.value)} 
                    placeholder={paymentMode === 'Online' ? 'e.g. UTR1234567890' : 'e.g. CHQ-998877'}
                    required 
                  />
                </div>
              )}

              <div className="stu-field">
                <label>Receipt Date *</label>
                <input type="date" value={receiptDate} onChange={e => setReceiptDate(e.target.value)} required />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <button type="submit" className="stu-btn stu-btn-primary">Generate Receipt</button>
            </div>
          </form>
        </div>
      </div>

      {/* Receipts List Table */}
      <div className="stu-table-wrap no-print">
        <div className="stu-table-title">Fee Receipts Ledger</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="stu-table">
            <thead>
              <tr>
                <th>SNo</th>
                <th>Receipt No</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Fee Head</th>
                <th>Paid Currency</th>
                <th>Foreign Amount</th>
                <th>INR Equivalent</th>
                <th>Mode</th>
                <th>Ref / UTR</th>
                <th>Date</th>
                <th>Print</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map(r => (
                <tr key={r.id}>
                  <td>{r.sno}</td>
                  <td style={{ fontWeight: 600 }}>{r.receiptNo}</td>
                  <td>{r.studentId}</td>
                  <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                  <td>{r.feeHead}</td>
                  <td>{r.currency}</td>
                  <td>{r.amountForeign > 0 ? `${r.amountForeign.toLocaleString()}` : '—'}</td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>₹{Number(r.amountINR).toLocaleString('en-IN')}</td>
                  <td>{r.paymentMode}</td>
                  <td>{r.utrNo || '—'}</td>
                  <td>{r.date}</td>
                  <td>
                    <button className="stu-btn stu-btn-primary stu-btn-sm" onClick={() => handlePrint(r)}>Print View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Printable Modal Overlay */}
      {printReceipt && (
        <div className="print-modal-overlay">
          <div className="print-modal-box">
            <div className="print-actions no-print">
              <button className="stu-btn stu-btn-primary" onClick={executePrint}>Print Invoice</button>
              <button className="stu-btn stu-btn-secondary" onClick={() => setPrintReceipt(null)}>Close</button>
            </div>
            
            <div className="invoice-print-container">
              {/* Receipt Layout */}
              <div className="invoice-header">
                <div className="brand-logo">UCT</div>
                <div className="brand-title">
                  <h1>UNIVERSIDADE CATÓLICA TIMORENSE</h1>
                  <p>Campus de Balide, Dili, Timor-Leste</p>
                  <p>Email: admin@uct.edu.tl | Website: www.uct.edu.tl</p>
                </div>
              </div>

              <div className="invoice-title">
                <h2>OFFICIAL FEE RECEIPT</h2>
              </div>

              {/* Properly Formatted Student and Transaction Metadata Table */}
              <table className="receipt-details-table" style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse', fontSize: '12px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold', width: '18%', color: '#334155' }}>Student Name</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', width: '32%', color: '#0f172a', fontWeight: '500' }}>{printReceipt.studentName}</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold', width: '18%', color: '#334155' }}>Receipt No.</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', width: '32%', fontWeight: 'bold', color: '#1e3a8a' }}>{printReceipt.receiptNo}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold', color: '#334155' }}>Scholar No.</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }}>{printReceipt.studentId}</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold', color: '#334155' }}>Receipt Date</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }}>{printReceipt.date}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold', color: '#334155' }}>Course / Branch</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }}>{printReceipt.course} &gt; {printReceipt.branch}</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold', color: '#334155' }}>Payment Mode</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                      <span style={{ fontWeight: '500' }}>{printReceipt.paymentMode}</span>
                      {printReceipt.utrNo && (
                        <span style={{ display: 'block', fontSize: '10.5px', color: '#475569', marginTop: '2px', fontWeight: 'bold' }}>
                          Ref / UTR: {printReceipt.utrNo}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold', color: '#334155' }}>Academic Batch</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0f172a' }}>{printReceipt.batch}</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold', color: '#334155' }}>Status</td>
                    <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#16a34a', fontWeight: 'bold' }}>SUCCESS / PAID</td>
                  </tr>
                </tbody>
              </table>

              {/* Table Formatted Particulars */}
              <table className="invoice-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px', background: '#f1f5f9', fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>SNo.</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px', background: '#f1f5f9', fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Fee Particulars / Description</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '10px', background: '#f1f5f9', fontSize: '12px', fontWeight: 'bold', color: '#334155', textAlign: 'right' }}>Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #cbd5e1', padding: '12px 10px', textAlign: 'center', fontSize: '12.5px', color: '#0f172a' }}>1</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '12px 10px', fontSize: '12.5px', color: '#0f172a' }}>
                      <span style={{ fontWeight: '600', display: 'block', color: '#0f172a' }}>{printReceipt.feeHead}</span>
                      {printReceipt.currency !== 'INR' && (
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                          Original Payment: {printReceipt.currency} {printReceipt.amountForeign?.toLocaleString()} (Converted @ 1 {printReceipt.currency} = {printReceipt.exchangeRate || EXCHANGE_RATES[printReceipt.currency]} INR)
                        </span>
                      )}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: '12.5px', color: '#0f172a' }}>
                      ₹{Number(printReceipt.amountINR).toLocaleString('en-IN')} INR
                    </td>
                  </tr>
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan={2} style={{ border: '1px solid #cbd5e1', padding: '12px 10px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>Total Amount Paid:</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '12px 10px', textAlign: 'right', fontWeight: '800', color: '#1e3a8a', fontSize: '14px' }}>
                      ₹{Number(printReceipt.amountINR).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="invoice-footer">
                <div className="terms">
                  <p><strong>Important Note:</strong></p>
                  <ul>
                    <li>Fees once paid are non-refundable and non-transferable under any circumstances.</li>
                    <li>This is a computer-generated receipt and requires no physical signature.</li>
                  </ul>
                </div>
                <div className="signatures">
                  <div className="sig-line" style={{ marginTop: '20px' }}>
                    <div style={{ height: 35 }}></div>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#334155' }}>Accounts Officer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
