import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

const INIT_DATA = [
  { id: 1,  name: 'Business',       status: 'Active' },
  { id: 2,  name: 'Doctor',         status: 'Active' },
  { id: 3,  name: 'DRIVER',         status: 'Active' },
  { id: 4,  name: 'Farmer',         status: 'Active' },
  { id: 5,  name: 'Govt. Employee', status: 'Active' },
  { id: 6,  name: 'House wife',     status: 'Active' },
  { id: 7,  name: 'Labour',         status: 'Active' },
  { id: 8,  name: 'Others',         status: 'Active' },
  { id: 9,  name: 'SDS',            status: 'Active' },
  { id: 10, name: 'Self Employed',  status: 'Active' },
];

export default function OccupationMaster({ onBack }) {
  const [data, setData]     = useState(INIT_DATA);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ occupation: '', status: 'Active' });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.occupation.trim()) return alert('Occupation is required.');
    if (editId) {
      setData(d => d.map(r => r.id === editId ? { ...r, name: form.occupation, status: form.status } : r));
      setEditId(null);
    } else {
      setData(d => [...d, { id: Date.now(), name: form.occupation, status: 'Active' }]);
    }
    setForm({ occupation: '', status: 'Active' });
  };

  const startEdit = (r) => {
    setEditId(r.id);
    setForm({ occupation: r.name, status: r.status });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ occupation: '', status: 'Active' });
  };

  const filtered = data.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">{editId ? 'Update Occupation' : 'Add Occupation'}</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', marginBottom: 24 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Occupation</label>
            <input
              className="form-input"
              value={form.occupation}
              onChange={set('occupation')}
              placeholder="Enter occupation"
            />
          </div>
          {editId && (
            <div className="form-field">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={set('status')}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
          {editId && (
            <button className="submit-btn" style={{ background: '#6b7280' }} onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }}
                onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'OccupationMaster'); else handlePrint('Occupation Master'); }}>{b}</button>
            ))}
          </div>
          <input
            className="form-input"
            style={{ width: 200 }}
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <table className="hr-table">
          <thead>
            <tr>
              <th>SNo.</th>
              <th>Occupation</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.name}</td>
                <td style={{ color: r.status === 'Active' ? '#16a34a' : '#dc2626', fontWeight: 500 }}>{r.status}</td>
                <td>
                  <button
                    className="tbl-btn view"
                    style={{ background: '#dcfce7', color: '#166534' }}
                    onClick={() => startEdit(r)}
                  >
                    ✎ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 13, color: '#666' }}>
            Showing 1 to {filtered.length} of {filtered.length} entries
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="tbl-btn view">Previous</button>
            <button className="tbl-btn view" style={{ background: '#4361ee', color: '#fff' }}>1</button>
            <button className="tbl-btn view">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
