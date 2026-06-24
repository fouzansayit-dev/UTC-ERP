import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useEffect } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}
function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function AddNewVisitor() {
  const [form, setForm] = useState({
    visitingType: '', visitingDate: today(), personToMeet: '',
    visitingTime: nowTime(), contactName: '', contactNumber: '',
    email: '', address: '', vehicleNumber: '', remark: '',
  });
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const EMPTY_FORM = { visitingType: '', visitingDate: today(), personToMeet: '', visitingTime: nowTime(), contactName: '', contactNumber: '', email: '', address: '', vehicleNumber: '', remark: '' };

  const loadVisitors = () => {
    fetch('/api/generic/reception/visitors')
      .then(res => res.json())
      .then(data => setRows(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading visitors:', err));
  };

  const saveVisitors = (updated) => {
    fetch('/api/generic/reception/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => loadVisitors())
      .catch(err => alert('Failed to save visitor: ' + err.message));
  };

  useEffect(() => { loadVisitors(); }, []);

  const handleSubmit = () => {
    if (!form.visitingType || !form.contactName || !form.contactNumber || !form.personToMeet) {
      alert('Please fill all required fields.'); return;
    }
    let updated;
    if (editId !== null) {
      updated = rows.map(r => r.id === editId ? { ...r, ...form } : r);
      setEditId(null);
    } else {
      updated = [...rows, { id: Date.now(), ...form }];
    }
    setForm(EMPTY_FORM);
    saveVisitors(updated);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({ visitingType: row.visitingType, visitingDate: row.visitingDate, personToMeet: row.personToMeet, visitingTime: row.visitingTime, contactName: row.contactName, contactNumber: row.contactNumber, email: row.email, address: row.address, vehicleNumber: row.vehicleNumber, remark: row.remark });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Remove this visitor record?')) return;
    saveVisitors(rows.filter(r => r.id !== id));
  };

  const filtered = rows.filter(r =>
    (r.contactName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.visitingType || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Add New Visitor</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)',
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Visiting Type <span className="req">*</span></label>
            <select className="form-input" value={form.visitingType} onChange={e => set('visitingType', e.target.value)}>
              <option value="">Select</option>
              <option>Parent</option>
              <option>Guardian</option>
              <option>Official</option>
              <option>Vendor</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Person To Meet <span className="req">*</span></label>
            <input className="form-input" placeholder="Person to meet" value={form.personToMeet} onChange={e => set('personToMeet', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Visiting Date <span className="req">*</span></label>
            <input className="form-input" type="date" value={form.visitingDate} onChange={e => set('visitingDate', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Visiting Time <span className="req">*</span></label>
            <input className="form-input" type="time" value={form.visitingTime} onChange={e => set('visitingTime', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Contact Name <span className="req">*</span></label>
            <input className="form-input" placeholder="Full name" value={form.contactName} onChange={e => set('contactName', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Contact Number <span className="req">*</span></label>
            <input className="form-input" placeholder="Mobile number" value={form.contactNumber} onChange={e => set('contactNumber', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="Email address" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Vehicle Number</label>
            <input className="form-input" placeholder="Vehicle number" value={form.vehicleNumber} onChange={e => set('vehicleNumber', e.target.value)} />
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Address</label>
            <textarea className="form-input form-textarea" placeholder="Address" value={form.address} onChange={e => set('address', e.target.value)} />
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Remark</label>
            <textarea className="form-input form-textarea" placeholder="Remark" value={form.remark} onChange={e => set('remark', e.target.value)} />
          </div>
        </div>
        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={handleSubmit}>{editId !== null ? 'Update' : 'Submit'}</button>
          {editId !== null && (
            <button className="submit-btn" style={{ background: '#6b7280', marginLeft: 8 }} onClick={() => { setEditId(null); setForm({ visitingType: '', visitingDate: today(), personToMeet: '', visitingTime: nowTime(), contactName: '', contactNumber: '', email: '', address: '', vehicleNumber: '', remark: '' }); }}>Cancel</button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{
          background: '#1e293b', color: '#fff', padding: '14px 20px',
          borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15,
        }}>
          Visitor List
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'AddNewVisitor'); else handlePrint('Add New Visitor'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
          <table className="hr-table">
            <thead>
              <tr>
                {['S.No', 'Edit', 'Image', 'Visiting Type', 'Person To Meet', 'Date', 'Visiting Date', 'Visiting Time', 'Contact Name', 'Contact Number', 'Email', 'Address', 'Vehicle Number', 'Remark'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={14} className="empty-table-msg">No data available in table</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td><button className="tbl-btn edit" onClick={() => handleEdit(r)}>Edit</button></td>
                  <td>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#64748b' }}>
                      IMG
                    </div>
                  </td>
                  <td>{r.visitingType}</td>
                  <td>{r.personToMeet}</td>
                  <td>{r.visitingDate}</td>
                  <td>{r.visitingDate}</td>
                  <td>{r.visitingTime}</td>
                  <td>{r.contactName}</td>
                  <td>{r.contactNumber}</td>
                  <td>{r.email}</td>
                  <td>{r.address}</td>
                  <td>{r.vehicleNumber}</td>
                  <td>{r.remark}</td>
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
