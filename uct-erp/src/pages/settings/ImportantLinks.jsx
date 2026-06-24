import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function ImportantLinks({ onBack }) {
  const [form, setForm] = useState({ title: '', urlLink: '', order: '' });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.urlLink.trim()) return;
    setRows(p => [...p, { id: Date.now(), ...form }]);
    setForm({ title: '', urlLink: '', order: '' });
  };

  const filtered = rows.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.urlLink.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Important Link</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', marginBottom: 24 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Title</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">URL Link</label>
            <input className="form-input" value={form.urlLink} onChange={e => set('urlLink', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Order</label>
            <input className="form-input" type="number" value={form.order} onChange={e => set('order', e.target.value)} />
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
                onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'ImportantLinks'); else handlePrint('Important Links'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="hr-table">
          <thead>
            <tr>{['SNo.', 'Title', 'URL Link', 'Delete'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: 20 }}>No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.title}</td>
                <td><a href={r.urlLink} target="_blank" rel="noreferrer" style={{ color: '#4361ee' }}>{r.urlLink}</a></td>
                <td><button className="tbl-btn" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={() => setRows(p => p.filter(x => x.id !== r.id))}>Delete</button></td>
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
