import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

function nowDT() {
  const d = new Date();
  return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function GatePassEmployee() {
  const [form, setForm] = useState({
    employee: '', type: 'Temporary',
    validateDatetime: nowDT(), issueDatetime: nowDT(),
    reason: '', permittedBy: '',
  });
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.employee) return;
    if (editId !== null) {
      setRows(p => p.map(r => r.id === editId ? { ...r, ...form } : r));
      setEditId(null);
    } else {
      setRows(p => [...p, { id: Date.now(), ...form }]);
    }
    setForm({ employee: '', type: 'Temporary', validateDatetime: nowDT(), issueDatetime: nowDT(), reason: '', permittedBy: '' });
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({ employee: row.employee, type: row.type, validateDatetime: row.validateDatetime, issueDatetime: row.issueDatetime, reason: row.reason, permittedBy: row.permittedBy });
  };

  const filtered = rows.filter(r =>
    (r.employee || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Gate Pass For Employee</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', maxWidth: 700,
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Employee</label>
            <select className="form-input" value={form.employee} onChange={e => set('employee', e.target.value)}>
              <option value="">Select</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
              <option>Temporary</option>
              <option>Permanent</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Validate Date / Time</label>
            <input className="form-input" placeholder="Validate date/time" value={form.validateDatetime} onChange={e => set('validateDatetime', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Issue Date / Time</label>
            <input className="form-input" placeholder="Issue date/time" value={form.issueDatetime} onChange={e => set('issueDatetime', e.target.value)} />
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Reason</label>
            <textarea className="form-input form-textarea" placeholder="Reason for gate pass" value={form.reason} onChange={e => set('reason', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Permitted By</label>
            <input className="form-input" placeholder="Permitted by" value={form.permittedBy} onChange={e => set('permittedBy', e.target.value)} />
          </div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={handleSubmit}>{editId !== null ? 'Update' : 'Submit'}</button>
          {editId !== null && (
            <button className="submit-btn" style={{ background: '#6b7280', marginLeft: 8 }} onClick={() => { setEditId(null); setForm({ employee: '', type: 'Temporary', validateDatetime: nowDT(), issueDatetime: nowDT(), reason: '', permittedBy: '' }); }}>Cancel</button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{
          background: '#1e293b', color: '#fff', padding: '14px 20px',
          borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15,
        }}>
          Gate Pass — Employee Records
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'GatePassEmployee'); else handlePrint('Gate Pass Employee'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
          <table className="hr-table">
            <thead>
              <tr>
                {['S.No', 'Edit', 'Date', 'Name', 'Validate Date/Time', 'Issue Date/Time', 'Reason', 'Permitted By', 'Print'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="empty-table-msg">No data available in table</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td><button className="tbl-btn edit" onClick={() => handleEdit(r)}>Edit</button></td>
                  <td>{new Date().toLocaleDateString('en-GB')}</td>
                  <td>{r.employee}</td>
                  <td>{r.validateDatetime}</td>
                  <td>{r.issueDatetime}</td>
                  <td>{r.reason}</td>
                  <td>{r.permittedBy}</td>
                  <td><button className="tbl-btn view" onClick={() => handlePrint('Gate Pass Employee')}>Print</button></td>
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
