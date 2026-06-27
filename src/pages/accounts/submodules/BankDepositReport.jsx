import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function BankDepositReport() {
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY, bankName:'All' });
  const [shown,  setShown]  = useState(false);
  const [banks, setBanks] = useState([]);
  const [rows, setRows] = useState([]);
  const sf = k => e => setFilter(p => ({ ...p, [k]: e.target.value }));

  // Load banks list for dropdown
  useEffect(() => {
    fetch('/api/generic/accounts/banks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBanks(data);
      })
      .catch(err => console.error('Error loading banks:', err));
  }, []);

  const loadData = () => {
    fetch('/api/generic/accounts/deposits')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter(r => {
            const dateMatch = r.date >= filter.start && r.date <= filter.end;
            const bankMatch = filter.bankName === 'All' || r.bank === filter.bankName;
            return dateMatch && bankMatch;
          });
          setRows(filtered);
        }
      })
      .catch(err => console.error('Error loading deposits:', err));
  };

  useEffect(() => {
    if (shown) {
      loadData();
    }
  }, [shown, filter.start, filter.end, filter.bankName]);

  return (
    <div className="hr-form">
      <div className="section-title">Bank Deposit Report</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:400 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Start Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.start} onChange={sf('start')} /></div></div>
        <div style={rS}><span style={lbS}>End Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
        <div style={rS}><span style={lbS}>Bank Name</span>
          <div style={{ flex:1, maxWidth:400 }}>
            <select style={iS} value={filter.bankName} onChange={sf('bankName')}>
              <option value="All">All Banks</option>
              {banks.map(b => (
                <option key={b.id} value={b.bank}>{b.bank} ({b.accNo})</option>
              ))}
            </select>
          </div>
        </div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar title="UCT ERP Bank Deposit Report" />
          <table className="hr-table">
            <thead>
              <tr><th>SNo.</th><th>Date</th><th>Bank Name</th><th>Amount</th><th>Status</th><th>Pay Mode</th><th>Cheque No</th><th>Remarks</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 ? <EmptyRow cols={8} /> : rows.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td>{r.date}</td>
                  <td>{r.bank}</td>
                  <td>₹{parseFloat(r.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>{r.status}</td>
                  <td>{r.payMode}</td>
                  <td>{r.chequeNo || '-'}</td>
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
