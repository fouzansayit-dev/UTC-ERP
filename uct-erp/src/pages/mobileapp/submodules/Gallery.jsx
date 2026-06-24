import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

function today() { return new Date().toISOString().slice(0, 10); }

export default function Gallery() {
  const [form, setForm] = useState({ course: 'ALL', branchName: '', batch: '', date: today(), category: '', displayType: 'Both', details: '', order: '' });
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (editId !== null) { setRows(p => p.map(r => r.id === editId ? { ...r, ...form } : r)); setEditId(null); }
    else setRows(p => [...p, { id: Date.now(), ...form }]);
    setForm({ course: 'ALL', branchName: '', batch: '', date: today(), category: '', displayType: 'Both', details: '', order: '' });
  };
  const handleEdit = row => { setEditId(row.id); setForm({ ...row }); };
  const handleDelete = id => setRows(p => p.filter(r => r.id !== id));
  const filtered = rows.filter(r => (r.details || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="hr-form">
      <div className="section-title">Gallery</div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)' }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field"><label className="form-label">Course</label><select className="form-input" value={form.course} onChange={e => set('course', e.target.value)}><option>ALL</option></select></div>
          <div className="form-field"><label className="form-label">Branch Name</label><select className="form-input" value={form.branchName} onChange={e => set('branchName', e.target.value)}><option value="">Select</option></select></div>
          <div className="form-field"><label className="form-label">Batch</label><select className="form-input" value={form.batch} onChange={e => set('batch', e.target.value)}><option value="">Select</option></select></div>
          <div className="form-field"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
          <div className="form-field"><label className="form-label">Category</label><select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}><option value="">Select</option></select></div>
          <div className="form-field"><label className="form-label">Display Type</label><select className="form-input" value={form.displayType} onChange={e => set('displayType', e.target.value)}><option>Both</option><option>Image</option><option>Video</option></select></div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}><label className="form-label">Details</label><textarea className="form-input form-textarea" rows={2} value={form.details} onChange={e => set('details', e.target.value)} /></div>
          <div className="form-field"><label className="form-label">Gallery (Max 5MB)</label><input className="form-input" type="file" multiple /></div>
          <div className="form-field"><label className="form-label">Order</label><input className="form-input" placeholder="Order" value={form.order} onChange={e => set('order', e.target.value)} /></div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={handleSubmit}>{editId !== null ? 'Update' : 'Submit'}</button>
          {editId !== null && <button className="submit-btn" style={{ background: '#6b7280', marginLeft: 8 }} onClick={() => setEditId(null)}>Cancel</button>}
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <div style={{ background: '#1e293b', color: '#fff', padding: '14px 20px', borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15 }}>Gallery List</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div style={{ display: 'flex', gap: 8 }}>{['Copy', 'CSV', 'Print'].map(b => <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'Gallery'); else handlePrint('Gallery'); }}>{b}</button>)}</div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
          <table className="hr-table">
            <thead><tr>{['S.No','Course','Branch Name','Batch','Date','Details','Type','Order','Category','Gallery','Edit','Delete'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={12} className="empty-table-msg">No data available in table</td></tr>
                : filtered.map((r,i)=><tr key={r.id}><td>{i+1}</td><td>{r.course}</td><td>{r.branchName}</td><td>{r.batch}</td><td>{r.date}</td><td>{r.details}</td><td>{r.displayType}</td><td>{r.order}</td><td>{r.category}</td><td>—</td><td><button className="tbl-btn edit" onClick={()=>handleEdit(r)}>Edit</button></td><td><button className="tbl-btn del" onClick={()=>handleDelete(r.id)}>🗑</button></td></tr>)}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>Showing {filtered.length === 0 ? '0 to 0 of 0' : `1 to ${filtered.length} of ${filtered.length}`} entries</div>
      </div>
    </div>
  );
}
