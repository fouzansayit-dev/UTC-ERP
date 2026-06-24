import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function VisitorReport() {
  const [form, setForm] = useState({ startDate: today(), endDate: today() });
  const [submitted, setSubmitted] = useState(false);
  const [rows] = useState([]);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSubmit = () => setSubmitted(true);

  const filtered = rows.filter(r =>
    (r.contactName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.visitingType || '').toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (d) => d.replaceAll('-', '/');

  return (
    <div className="hr-form">
      <div className="section-title">Visitor Report</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', maxWidth: 500,
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
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
          <div style={{
            background: '#1e293b', color: '#fff', padding: '14px 20px',
            borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15,
          }}>
            Visitor Report ({fmt(form.startDate)} &ndash; {fmt(form.endDate)})
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Copy', 'CSV', 'Print'].map(b => (
                <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'VisitorReport'); else handlePrint('Visitor Report'); }}>{b}</button>
              ))}
            </div>
            <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
            <table className="hr-table">
              <thead>
                <tr>
                  {['S.No', 'Edit', 'Image', 'Visiting Type', 'Person To Meet', 'Date', 'Visiting Date', 'Visiting Time', 'Contact Name', 'Contact Number', 'Email', 'Address', 'Vehicle Number', 'Remark'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={14} className="empty-table-msg">No data available in table</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td><button className="tbl-btn edit" onClick={() => alert("Edit record")}>Edit</button></td>
                    <td>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#64748b' }}>
                        IMG
                      </div>
                    </td>
                    <td>{r.visitingType}</td>
                    <td>{r.personToMeet}</td>
                    <td>{r.date}</td>
                    <td>{r.visitingDate}</td>
                    <td>{r.visitingTime}</td>
                    <td>{r.contactName}</td>
                    <td>{r.contactNumber}</td>
                    <td>{r.email}</td>
                    <td>{r.address}</td>
                    <td>{r.vehicleNumber}</td>
                    <td>{r.remark}</td>
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
