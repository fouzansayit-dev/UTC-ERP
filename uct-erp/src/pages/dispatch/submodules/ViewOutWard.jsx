import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function ViewOutWard({ onBack }) {
  const [rows] = useState([]);
  const [search, setSearch] = useState('');

  const filtered = rows.filter(r =>
    Object.values(r).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">View Out Ward</div>

      <div className="table-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }}
                onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'ViewOutWard'); else handlePrint('View Out Ward'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <table className="hr-table">
          <thead>
            <tr>
              {['SNo.', 'Date', 'Section', 'Serial No', 'Subject', 'To', 'Copy', 'Email', 'Edit', 'Attachment'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', color: '#888', padding: 20 }}>No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.date}</td>
                <td>{r.section}</td>
                <td>{r.serialNo}</td>
                <td>{r.subject}</td>
                <td>{r.to}</td>
                <td>{r.copy}</td>
                <td>{r.email}</td>
                <td><button className="tbl-btn view">Edit</button></td>
                <td><button className="tbl-btn view">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 13, color: '#666' }}>
            Showing 0 to {filtered.length} of {filtered.length} entries
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="tbl-btn view">Previous</button>
            <button className="tbl-btn view">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
