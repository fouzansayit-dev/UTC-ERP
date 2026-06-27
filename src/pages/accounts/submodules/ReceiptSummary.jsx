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

export default function ReceiptSummary() {
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY });
  const [shown,  setShown]  = useState(false);
  const [rows, setRows] = useState([]);
  const sf = k => e => setFilter(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const receipts = data.filter(r => r.type === 'Credit' && r.date >= filter.start && r.date <= filter.end);
          setRows(receipts);
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
      <div className="section-title">Receipt Summary</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:400 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Start Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.start} onChange={sf('start')} /></div></div>
        <div style={rS}><span style={lbS}>End Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar title="UCT ERP Receipt Summary" />
          <table className="hr-table">
            <thead>
              <tr><th>SNo.</th><th>Date</th><th>Party</th><th>Head</th><th>Vch No</th><th>Amount</th><th>Pay Mode</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 ? <EmptyRow cols={7} /> : rows.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td>{r.date}</td>
                  <td>{r.party || '-'}</td>
                  <td>{r.head} {r.remarks ? `(${r.remarks})` : ''}</td>
                  <td>{r.reference || r.voucherNo}</td>
                  <td>{getCurrencySymbol(r.targetCurrency || 'USD')} {parseFloat(r.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>{r.payMode}</td>
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
