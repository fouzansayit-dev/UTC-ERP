import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function BiometricLogs({ onBack }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ startDate: today, endDate: today });
  const [rows, setRows] = useState(null);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => setRows([]);

  const filtered = (rows || []).filter(r =>
    Object.values(r).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const dateRange = rows !== null
    ? `${form.startDate.split('-').reverse().join('-')} - ${form.endDate.split('-').reverse().join('-')}`
    : '';

  return (
    <div className="hr-form">
      <div className="section-title">Biometric Logs</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', marginBottom: 24 }}>
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
        <div style={{ marginTop: 16 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {rows !== null && (
        <div className="table-wrap">
          {dateRange && (
            <div style={{ fontWeight: 500, fontSize: 15, color: '#1e293b', marginBottom: 12 }}>
              Biometric Logs ({dateRange})
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Copy', 'CSV', 'Print'].map(b => (
                <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }}
                  onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'BiometricLogs'); else handlePrint('Biometric Logs'); }}>{b}</button>
              ))}
            </div>
            <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <table className="hr-table">
            <thead>
              <tr>{['Sno', 'Date', 'RFID', 'Time', 'Status', 'Type'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 20 }}>No data available in table</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.date}</td>
                  <td>{r.rfid}</td>
                  <td>{r.time}</td>
                  <td>{r.status}</td>
                  <td>{r.type}</td>
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
      )}
    </div>
  );
}
