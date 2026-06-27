import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function ExpenseRegister() {
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY });
  const [shown,  setShown]  = useState(false);
  const [rows, setRows] = useState([]);
  const sf = k => e => setFilter(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const expenses = data.filter(r => r.type === 'Debit' && r.date >= filter.start && r.date <= filter.end);
          setRows(expenses);
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
      <div className="section-title">Expense Register</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:400 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Start Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.start} onChange={sf('start')} /></div></div>
        <div style={rS}><span style={lbS}>End Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar title="UCT ERP Expense Register" />
          <table className="hr-table">
            <thead>
              <tr><th>SNo.</th><th>Date</th><th>Head</th><th>Subhead</th><th>Party</th><th>Bill No</th><th>Amount</th><th>Remarks</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 ? <EmptyRow cols={8} /> : rows.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td>{r.date}</td>
                  <td>{r.head}</td>
                  <td>{r.subhead || '-'}</td>
                  <td>{r.party || '-'}</td>
                  <td>{r.reference || r.voucherNo}</td>
                  <td>₹{parseFloat(r.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>{r.remarks || '-'}</td>
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
