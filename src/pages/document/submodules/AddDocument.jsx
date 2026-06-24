import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function AddDocument() {
  const [form, setForm] = useState({ title: '', document: null });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.title) return;
    setRows(p => [...p, {
      id: Date.now(),
      title: form.title,
      fileName: form.document ? form.document.name : '',
    }]);
    setForm({ title: '', document: null });
    // reset file input
    const fi = document.getElementById('doc-file-input');
    if (fi) fi.value = '';
  };

  const handleDelete = (id) => setRows(p => p.filter(r => r.id !== id));

  const filtered = rows.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Add Document</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', maxWidth: 650,
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-field">
            <label className="form-label">Title <span className="req">*</span></label>
            <textarea
              className="form-input form-textarea"
              placeholder="Document title"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              style={{ minHeight: 72 }}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Document <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 12 }}>(Max 10MB)</span></label>
            <input
              id="doc-file-input"
              className="form-input"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
              onChange={e => set('document', e.target.files[0] || null)}
            />
          </div>
        </div>

        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Copy', 'CSV', 'Print'].map(b => (
            <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'AddDocument'); else handlePrint('Add Document'); }}>{b}</button>
          ))}
        </div>
        <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              {['S.No', 'Title', 'Document', 'Delete'].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="empty-table-msg">No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.title}</td>
                <td>
                  {r.fileName
                    ? <button className="tbl-btn view" style={{ color: '#4361ee' }} onClick={() => alert("View record")}>{r.fileName}</button>
                    : '—'}
                </td>
                <td>
                  <button className="tbl-btn del" style={{ fontSize: 15, padding: '4px 10px' }}
                    onClick={() => handleDelete(r.id)}>🗑</button>
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
  );
}
