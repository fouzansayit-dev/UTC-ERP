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

export default function CashReport() {
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY });
  const [shown,  setShown]  = useState(false);
  const [rows, setRows] = useState([]);
  const [openingBal, setOpeningBal] = useState(0);
  const sf = k => e => setFilter(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          calculateReport(data);
        }
      })
      .catch(err => console.error('Error loading cashbook:', err));
  };

  const calculateReport = (data) => {
    // Sort
    const sorted = [...data].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.id - b.id;
    });

    // Cash only
    const cashData = sorted.filter(r => r.payMode === 'Cash');

    // Opening Balance for cash
    let opBal = 0;
    cashData.forEach(r => {
      if (r.date < filter.start) {
        const amt = parseFloat(r.amount) || 0;
        if (r.type === 'Credit') opBal += amt;
        else if (r.type === 'Debit') opBal -= amt;
      }
    });
    setOpeningBal(opBal);

    // Filter within range
    const filtered = cashData.filter(r => r.date >= filter.start && r.date <= filter.end);

    // Running Balance
    let currentBal = opBal;
    const computedRows = filtered.map(r => {
      const amt = parseFloat(r.amount) || 0;
      if (r.type === 'Credit') {
        currentBal += amt;
      } else {
        currentBal -= amt;
      }
      return {
        ...r,
        runningBal: currentBal
      };
    });

    setRows(computedRows);
  };

  useEffect(() => {
    if (shown) {
      loadData();
    }
  }, [shown, filter.start, filter.end]);

  return (
    <div className="hr-form">
      <div className="section-title">Cash Report</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:400 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Start Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.start} onChange={sf('start')} /></div></div>
        <div style={rS}><span style={lbS}>End Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar title="UCT ERP Cash Report" />
          <table className="hr-table">
            <thead>
              <tr><th>SNo.</th><th>Date</th><th>Particular</th><th>Vch No</th><th>Debit</th><th>Credit</th><th>Balance</th></tr>
            </thead>
            <tbody>
              {/* Opening Balance Row */}
              <tr style={{ background:'#f8fafc', fontWeight:600 }}>
                <td>-</td>
                <td>{filter.start}</td>
                <td>Opening Cash Balance</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>{getCurrencySymbol('USD')} {openingBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              {rows.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No cash transactions in this date range</td></tr>
              ) : rows.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td>{r.date}</td>
                  <td>{r.party || r.head || 'Cash Entry'} {r.remarks ? `(${r.remarks})` : ''}</td>
                  <td>{r.reference || r.voucherNo}</td>
                  <td>{r.type === 'Credit' ? `${getCurrencySymbol(r.targetCurrency || 'USD')} ${parseFloat(r.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}</td>
                  <td>{r.type === 'Debit' ? `${getCurrencySymbol(r.targetCurrency || 'USD')} ${parseFloat(r.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}</td>
                  <td>{getCurrencySymbol(r.targetCurrency || 'USD')} {r.runningBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
