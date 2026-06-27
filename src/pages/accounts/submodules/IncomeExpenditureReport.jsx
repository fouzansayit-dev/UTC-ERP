import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function IncomeExpenditureReport() {
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY });
  const [shown,  setShown]  = useState(false);
  const [rows, setRows] = useState([]);
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
    const rangeData = data.filter(r => r.date >= filter.start && r.date <= filter.end);
    
    // Group by head + '|' + subhead
    const groups = {};
    rangeData.forEach(r => {
      const h = r.head || 'Unspecified';
      const s = r.subhead || 'General';
      const key = `${h}|${s}`;
      if (!groups[key]) {
        groups[key] = { head: h, subhead: s, income: 0, expenditure: 0 };
      }
      const amt = parseFloat(r.amount) || 0;
      if (r.type === 'Credit') {
        groups[key].income += amt;
      } else {
        groups[key].expenditure += amt;
      }
    });

    const computedList = Object.values(groups).map(g => ({
      ...g,
      net: g.income - g.expenditure
    }));

    setRows(computedList);
  };

  useEffect(() => {
    if (shown) {
      loadData();
    }
  }, [shown, filter.start, filter.end]);

  return (
    <div className="hr-form">
      <div className="section-title">Income & Expenditure Report</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:400 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Start Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.start} onChange={sf('start')} /></div></div>
        <div style={rS}><span style={lbS}>End Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar title="UCT ERP Income & Expenditure Report" />
          <table className="hr-table">
            <thead>
              <tr><th>Head</th><th>Subhead</th><th>Income (₹)</th><th>Expenditure (₹)</th><th>Net (₹)</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 ? <EmptyRow cols={5} /> : rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.head}</td>
                  <td>{r.subhead}</td>
                  <td>₹{r.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>₹{r.expenditure.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ fontWeight: 600, color: r.net >= 0 ? '#16a34a' : '#dc2626' }}>
                    ₹{r.net.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
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
