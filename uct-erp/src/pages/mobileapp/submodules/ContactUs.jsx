import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', contactNo: '' });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name) return;
    setRows(p => [...p, { id: Date.now(), ...form }]);
    setForm({ name: '', contactNo: '' });
  };
  const handleDelete = id => setRows(p => p.filter(r => r.id !== id));
  const filtered = rows.filter(r => (r.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="hr-form">
      <div className="section-title">Contact Us</div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', maxWidth: 500 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Name</label>
            <input className="form-input" placeholder="Name" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Contact No</label>
            <input className="form-input" placeholder="Contact number" value={form.contactNo} onChange={e => set('contactNo', e.target.value)} />
          </div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <div style={{ background: '#1e293b', color: '#fff', padding: '14px 20px', borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15 }}>Contact Us List</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div style={{ display: 'flex', gap: 8 }}>{['Copy', 'CSV', 'Print'].map(b => <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'ContactUs'); else handlePrint('Contact Us'); }}>{b}</button>)}</div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
          <table className="hr-table">
            <thead><tr>{['SNo', 'Name', 'Contact No', 'Delete'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={4} className="empty-table-msg">No data available in table</td></tr>
                : filtered.map((r, i) => <tr key={r.id}><td>{i + 1}</td><td>{r.name}</td><td>{r.contactNo}</td><td><button className="tbl-btn del" onClick={() => handleDelete(r.id)}>🗑</button></td></tr>)}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>Showing {filtered.length === 0 ? '0 to 0 of 0' : `1 to ${filtered.length} of ${filtered.length}`} entries</div>
      </div>
    </div>
  );
}
