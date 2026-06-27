import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, TableToolbar, EmptyRow } from './accountsConfig.jsx';

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

export default function PaymentSummary() {
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY });
  const [shown,  setShown]  = useState(false);
  const [rows, setRows] = useState([]);
  const sf = k => e => setFilter(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const payments = data.filter(r => r.type === 'Debit' && r.date >= filter.start && r.date <= filter.end);
          setRows(payments);
        }
      })
      .catch(err => console.error('Error loading cashbook:', err));
  };

  useEffect(() => {
    if (shown) {
      loadData();
    }
  }, [shown, filter.start, filter.end]);

  return (
    <div className="hr-form">
      <div className="section-title">Payment Summary</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:400 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Start Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.start} onChange={sf('start')} /></div></div>
        <div style={rS}><span style={lbS}>End Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar title="UCT ERP Payment Summary" />
          <table className="hr-table">
            <thead>
              <tr><th>SNo.</th><th>Date</th><th>Name</th><th>Particular</th><th>Vch/Rec No</th><th>Amount</th><th>Status</th><th>PMode</th><th>User</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 ? <EmptyRow cols={9} /> : rows.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td>{r.date}</td>
                  <td>{r.party || '-'}</td>
                  <td>{r.head} {r.remarks ? `(${r.remarks})` : ''}</td>
                  <td>{r.reference || r.voucherNo}</td>
                  <td>{getCurrencySymbol(r.targetCurrency || 'USD')} {parseFloat(r.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td><span style={{ background:'#dcfce7', color:'#16a34a', padding:'2px 8px', borderRadius:10, fontSize:11 }}>Paid</span></td>
                  <td>{r.payMode}</td>
                  <td>Accounts</td>
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
