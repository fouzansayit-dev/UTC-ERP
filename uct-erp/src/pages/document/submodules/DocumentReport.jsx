import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function DocumentReport() {
  const [rows] = useState([]);
  const [search, setSearch] = useState('');

  const filtered = rows.filter(r =>
    (r.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Document Report</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Copy', 'CSV', 'Print'].map(b => (
            <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'DocumentReport'); else handlePrint('Document Report'); }}>{b}</button>
          ))}
        </div>
        <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              {['S.No', 'Title', 'Document', 'Delete'].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="empty-table-msg">No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.title}</td>
                <td>
                  {r.fileName
                    ? <button className="tbl-btn view" style={{ color: '#4361ee' }} onClick={() => alert("View record")}>{r.fileName}</button>
                    : '—'}
                </td>
                <td>
                  <button className="tbl-btn del" style={{ fontSize: 15, padding: '4px 10px' }} onClick={() => { if(window.confirm("Delete this record?")) alert("Record deleted") }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
        Showing {filtered.length === 0 ? '0 to 0 of 0' : `1 to ${filtered.length} of ${filtered.length}`} entries
      </div>
    </div>
  );
}
