import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function AddSection({ onBack }) {
  const [form, setForm] = useState({ section: '', code: '' });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.section.trim()) return;
    setRows(p => [...p, { id: Date.now(), section: form.section, code: form.code }]);
    setForm({ section: '', code: '' });
  };

  const filtered = rows.filter(r =>
    r.section.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Add Section</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', marginBottom: 24 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Section</label>
            <input className="form-input" value={form.section} onChange={e => set('section', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Code</label>
            <input className="form-input" value={form.code} onChange={e => set('code', e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      <div className="table-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }}
                onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'AddSection'); else handlePrint('Add Section'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="hr-table">
          <thead>
            <tr>
              {['SNo.', 'Section', 'Code'].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: '#888', padding: 20 }}>No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.section}</td>
                <td>{r.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
          Showing 0 to {filtered.length} of {filtered.length} entries
        </div>
      </div>
    </div>
  );
}
