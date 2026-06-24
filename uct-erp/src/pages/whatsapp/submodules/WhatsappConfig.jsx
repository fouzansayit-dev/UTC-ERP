import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function WhatsappConfig() {
  const [college, setCollege] = useState('UNIVERSIDADE CATOLICA TIMORENSE');
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const handleGenerate = () => {
    if (!college.trim()) return;
    const exists = rows.find(r => r.college === college);
    if (!exists) {
      setRows(p => [...p, { id: Date.now(), college, status: 'Not Connected', result: crypto.randomUUID ? crypto.randomUUID() : 'key-' + Date.now() }]);
    }
  };

  const handleDelete = (id) => setRows(p => p.filter(r => r.id !== id));

  const filtered = rows.filter(r =>
    r.college.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">WhatsApp Configuration</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', maxWidth: 600, marginBottom: 28,
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-field">
            <label className="form-label">College</label>
            <select className="form-input" value={college} onChange={e => setCollege(e.target.value)}>
              <option>UNIVERSIDADE CATOLICA TIMORENSE</option>
            </select>
          </div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" style={{ background: '#0ea5e9' }} onClick={handleGenerate}>Generate Key</button>
        </div>
      </div>

      <div style={{
        background: '#1e293b', color: '#fff', padding: '14px 20px',
        borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15,
      }}>
        WhatsApp Configuration
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Copy', 'CSV', 'Print'].map(b => (
            <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'WhatsappConfig'); else handlePrint('Whatsapp Config'); }}>{b}</button>
          ))}
        </div>
        <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
        <table className="hr-table">
          <thead>
            <tr>
              {['SNo', 'Delete', 'Edit', 'College', 'Status', 'Action', 'Result', 'Scan QR Code'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="empty-table-msg">No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>
                  <button className="tbl-btn del" onClick={() => handleDelete(r.id)}
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>
                    🗑
                  </button>
                </td>
                <td>
                  <button className="tbl-btn edit" style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 16 }} onClick={() => alert("Edit record")}>✎</button>
                </td>
                <td>{r.college}</td>
                <td>
                  <span style={{
                    background: r.status === 'Connected' ? '#dcfce7' : '#fee2e2',
                    color: r.status === 'Connected' ? '#166534' : '#dc2626',
                    padding: '3px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                  }}>{r.status}</span>
                </td>
                <td>
                  <button className="submit-btn" style={{ background: '#0ea5e9', padding: '4px 12px', fontSize: 12 }} onClick={() => alert('Action')}>Generate Key</button>
                </td>
                <td style={{ fontSize: 11, color: '#6b7280', maxWidth: 180, wordBreak: 'break-all' }}>{r.result}</td>
                <td>
                  <button className="tbl-btn view" style={{ background: '#f59e0b', color: '#fff', borderRadius: 6 }} onClick={() => alert("View record")}>Click here</button>
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
