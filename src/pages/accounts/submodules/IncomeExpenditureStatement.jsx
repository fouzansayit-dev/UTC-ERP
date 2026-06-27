import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function IncomeExpenditureStatement() {
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY });
  const [shown,  setShown]  = useState(false);
  const [statement, setStatement] = useState({ income: 0, expenditure: 0, net: 0 });
  const sf = k => e => setFilter(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          calculateStatement(data);
        }
      })
      .catch(err => console.error('Error loading cashbook:', err));
  };

  const calculateStatement = (data) => {
    const rangeData = data.filter(r => r.date >= filter.start && r.date <= filter.end);
    let inc = 0;
    let exp = 0;
    rangeData.forEach(r => {
      const amt = parseFloat(r.amount) || 0;
      if (r.type === 'Credit') inc += amt;
      else if (r.type === 'Debit') exp += amt;
    });
    setStatement({
      income: inc,
      expenditure: exp,
      net: inc - exp
    });
  };

  useEffect(() => {
    if (shown) {
      loadData();
    }
  }, [shown, filter.start, filter.end]);

  return (
    <div className="hr-form">
      <div className="section-title">Income & Expenditure Statement</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:400 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Start Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.start} onChange={sf('start')} /></div></div>
        <div style={rS}><span style={lbS}>End Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar title="UCT ERP Income & Expenditure Statement" />
          <table className="hr-table">
            <thead>
              <tr><th>Particulars</th><th>Amount (₹)</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Revenue / Income (Receipts)</td>
                <td>₹{statement.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td>Total Operating Expenses (Payments)</td>
                <td>₹{statement.expenditure.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                <td>Net Surplus / (Deficit)</td>
                <td style={{ color: statement.net >= 0 ? '#16a34a' : '#dc2626' }}>
                  ₹{statement.net.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
