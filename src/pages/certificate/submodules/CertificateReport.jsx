import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function CertificateReport() {
  const [form, setForm] = useState({
    college: 'All', startDate: today(), endDate: today(),
  });
  const [submitted, setSubmitted] = useState(false);
  const [rows] = useState([]);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSubmit = () => setSubmitted(true);

  const filtered = rows.filter(r =>
    (r.student || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.type || '').toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (d) => d.replaceAll('-', '/');

  return (
    <div className="hr-form">
      <div className="section-title">Certificate Report</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', maxWidth: 700,
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">College</label>
            <select className="form-input" value={form.college} onChange={e => set('college', e.target.value)}>
              <option>All</option>
              <option>UNIVERSIDADE CATOLICA TIMORENSE</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Start Date</label>
            <input className="form-input" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">End Date</label>
            <input className="form-input" type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
          </div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {submitted && (
        <div style={{ marginTop: 28 }}>
          {/* Report Header */}
          <div style={{
            background: '#1e293b', color: '#fff', padding: '14px 20px',
            borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15,
          }}>
            Certificate Report ({fmt(form.startDate)} &ndash; {fmt(form.endDate)})
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Copy', 'CSV', 'Print'].map(b => (
                <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'CertificateReport'); else handlePrint('Certificate Report'); }}>{b}</button>
              ))}
            </div>
            <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
            <table className="hr-table">
              <thead>
                <tr>
                  {['Sno', 'Delete', 'Edit', 'Print', 'Certificate No', 'Type', 'Student', 'Session', 'Date', 'User'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="empty-table-msg">No data available in table</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td><button className="tbl-btn del" style={{ fontSize: 15, padding: '4px 10px' }} onClick={() => { if(window.confirm("Delete this record?")) alert("Record deleted") }}>🗑</button></td>
                    <td><button className="tbl-btn edit" onClick={() => alert("Edit record")}>Edit</button></td>
                    <td><button className="tbl-btn view" onClick={() => handlePrint('Certificate Report')}>Print</button></td>
                    <td>{r.certNo}</td>
                    <td>{r.type}</td>
                    <td>{r.student}</td>
                    <td>{r.session}</td>
                    <td>{r.date}</td>
                    <td>{r.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
            Showing {filtered.length === 0 ? '0 to 0 of 0' : `1 to ${filtered.length} of ${filtered.length}`} entries
          </div>
        </div>
      )}
    </div>
  );
}
