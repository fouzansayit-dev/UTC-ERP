import React, { useState } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, TableToolbar, EmptyRow } from './accountsConfig.jsx';

export default function BankReport() {
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY });
  const [shown,  setShown]  = useState(false);
  const sf = k => e => setFilter(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="hr-form">
      <div className="section-title">Bank Report</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:400 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>Start Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.start} onChange={sf('start')} /></div></div>
        <div style={rS}><span style={lbS}>End Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
        <div style={rS}><span style={lbS}>Bank Name</span><div style={{ flex:1, maxWidth:400 }}><select style={iS}><option>All</option><option>UCT Main Account</option></select></div></div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar />
          <table className="hr-table">
            <thead><tr><th>SNo.</th><th>Date</th><th>Bank Name</th><th>Particular</th><th>Debit (₹)</th><th>Credit (₹)</th><th>Balance (₹)</th></tr></thead>
            <tbody><EmptyRow cols={7} /></tbody>
          </table>
          <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Showing 0 entries — connect backend API to load data</div>
        </div>
      )}
    </div>
  );
}
