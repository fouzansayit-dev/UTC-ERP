import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function VisitingType() {
  const [form, setForm] = useState({ type: '' });
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.type.trim()) return;
    if (editId !== null) {
      setRows(p => p.map(r => r.id === editId ? { ...r, type: form.type } : r));
      setEditId(null);
    } else {
      setRows(p => [...p, { id: Date.now(), type: form.type, status: 'Active' }]);
    }
    setForm({ type: '' });
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({ type: row.type });
  };

  const filtered = rows.filter(r =>
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Visiting Type</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', maxWidth: 500,
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-field">
            <label className="form-label">Type <span className="req">*</span></label>
            <input
              className="form-input"
              placeholder="Enter visiting type"
              value={form.type}
              onChange={e => set('type', e.target.value)}
            />
          </div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={handleSubmit}>{editId !== null ? 'Update' : 'Submit'}</button>
          {editId !== null && (
            <button className="submit-btn" style={{ background: '#6b7280', marginLeft: 8 }} onClick={() => { setEditId(null); setForm({ type: '' }); }}>Cancel</button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{
          background: '#1e293b', color: '#fff', padding: '14px 20px',
          borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15,
        }}>
          Visiting Type List
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'VisitingType'); else handlePrint('Visiting Type'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
          <table className="hr-table">
            <thead>
              <tr>
                {['Sno', 'Edit', 'Type', 'Status'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="empty-table-msg">No data available in table</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td><button className="tbl-btn edit" onClick={() => handleEdit(r)}>Edit</button></td>
                  <td>{r.type}</td>
                  <td>
                    <span style={{
                      background: r.status === 'Active' ? '#dcfce7' : '#fee2e2',
                      color: r.status === 'Active' ? '#166534' : '#991b1b',
                      padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                    }}>{r.status}</span>
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
    </div>
  );
}
