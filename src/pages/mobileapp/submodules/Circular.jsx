import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useEffect } from 'react';

function today() { return new Date().toISOString().slice(0, 10); }

export default function Circular() {
  const [form, setForm] = useState({
    course: 'ALL', branchName: 'ALL', batch: 'ALL', date: today(), title: '',
    attachment: null, circular: '',
  });
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = () => {
      fetch('/api/generic/circulars/list')
        .then(res => res.json())
        .then(data => {
          setRows(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error('Error fetching circulars:', err));
    };
    load();
    window.addEventListener('uct_data_update', load);
    return () => window.removeEventListener('uct_data_update', load);
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.title && !form.circular) return;
    let nextRows;
    if (editId !== null) {
      nextRows = rows.map(r => r.id === editId ? { ...r, ...form } : r);
      setEditId(null);
    } else {
      nextRows = [...rows, { id: Date.now(), ...form }];
    }

    // Save to generic_store
    fetch('/api/generic/circulars/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextRows),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRows(nextRows);
        } else {
          alert('Failed to save circular: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error('Error saving circular:', err);
        alert('Network error. Failed to save circular.');
      });

    setForm({ course: 'ALL', branchName: 'ALL', batch: 'ALL', date: today(), title: '', attachment: null, circular: '' });
  };

  const handleEdit = (row) => { setEditId(row.id); setForm({ ...row }); };
  const handleDelete = (id) => {
    const nextRows = rows.filter(r => r.id !== id);
    fetch('/api/generic/circulars/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextRows),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRows(nextRows);
        } else {
          alert('Failed to delete circular: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error('Error deleting circular:', err);
        alert('Network error. Failed to delete circular.');
      });
  };

  const filtered = rows.filter(r =>
    (r.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Circular</div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)' }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Course</label>
            <select className="form-input" value={form.course} onChange={e => set('course', e.target.value)}>
              <option>ALL</option>
              <option>MBBS</option>
              <option>BDS</option>
              <option>BAMS</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Branch Name</label>
            <select className="form-input" value={form.branchName} onChange={e => set('branchName', e.target.value)}>
              <option>ALL</option>
              <option>Medicine</option>
              <option>Surgery</option>
              <option>Paediatrics</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Batch</label>
            <select className="form-input" value={form.batch} onChange={e => set('batch', e.target.value)}>
              <option>ALL</option>
              <option>2024-2030</option>
              <option>2023-2029</option>
              <option>2022-2028</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Title</label>
            <input className="form-input" placeholder="Title" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Attachment (Max 10MB)</label>
            <input className="form-input" type="file" accept=".jpg,.png,.jpeg,.gif,.webp,.pdf" onChange={e => set('attachment', e.target.files[0]?.name || null)} />
            <div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>Files Supported: JPG | PNG | JPEG | GIF | WEBP | PDF</div>
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Circular</label>
            <textarea className="form-input form-textarea" rows={4} value={form.circular} onChange={e => set('circular', e.target.value)} placeholder="Enter circular content..." />
          </div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={handleSubmit}>{editId !== null ? 'Update' : 'Submit'}</button>
          {editId !== null && <button className="submit-btn" style={{ background: '#6b7280', marginLeft: 8 }} onClick={() => { setEditId(null); setForm({ course: 'ALL', branchName: '', batch: '', date: today(), title: '', attachment: null, circular: '' }); }}>Cancel</button>}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ background: '#1e293b', color: '#fff', padding: '14px 20px', borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15 }}>Circular List</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'Circular'); else handlePrint('Circular'); }}>{b}</button>)}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
          <table className="hr-table">
            <thead>
              <tr>{['Sno', 'Edit', 'Delete', 'Course', 'Branch Name', 'Batch', 'Date', 'Title', 'Attachment', 'Circular'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="empty-table-msg">No data available in table</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td><button className="tbl-btn edit" onClick={() => handleEdit(r)}>Edit</button></td>
                  <td><button className="tbl-btn del" onClick={() => handleDelete(r.id)}>🗑</button></td>
                  <td>{r.course}</td>
                  <td>{r.branchName}</td>
                  <td>{r.batch}</td>
                  <td>{r.date}</td>
                  <td>{r.title}</td>
                  <td>{r.attachment || '—'}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.circular}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>Showing {filtered.length === 0 ? '0 to 0 of 0' : `1 to ${filtered.length} of ${filtered.length}`} entries</div>
      </div>
    </div>
  );
}
