import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddDriverHelper() {
  const [form, setForm] = useState({
    type: 'Driver', name: '',
    dob: '', mobileNumber: '',
    password: '123456',
    joiningDate: today(), experience: '',
    presentAdd: '', permanentAddress: '',
    licenceNumber: '', licenceRenewDate: today(),
    batchNo: '', batchRenewDate: today(),
    photo: null, submittedDocument: '', remark: '',
  });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name) return;
    setRows(p => [...p, { ...form, id: Date.now() }]);
    setForm({ type: 'Driver', name: '', dob: '', mobileNumber: '', password: '123456', joiningDate: today(), experience: '', presentAdd: '', permanentAddress: '', licenceNumber: '', licenceRenewDate: today(), batchNo: '', batchRenewDate: today(), photo: null, submittedDocument: '', remark: '' });
  };

  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => setRows(p => p.filter(r => r.id !== id));

  return (
    <div className="hr-form">
      <div className="section-title">Add Driver / Helper</div>

      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Type</label>
          <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
            <option>Driver</option>
            <option>Helper</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Name <span className="req">*</span></label>
          <input className="form-input" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">DOB</label>
          <input className="form-input" type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Mobile Number</label>
          <input className="form-input" placeholder="Mobile" value={form.mobileNumber} onChange={e => set('mobileNumber', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Password</label>
          <input className="form-input" value={form.password} onChange={e => set('password', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Joining Date</label>
          <input className="form-input" type="date" value={form.joiningDate} onChange={e => set('joiningDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Experience</label>
          <input className="form-input" placeholder="Years of experience" value={form.experience} onChange={e => set('experience', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Present Address</label>
          <textarea className="form-input form-textarea" placeholder="Current address" value={form.presentAdd} onChange={e => set('presentAdd', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Permanent Address</label>
          <textarea className="form-input form-textarea" placeholder="Permanent address" value={form.permanentAddress} onChange={e => set('permanentAddress', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Licence Number</label>
          <input className="form-input" placeholder="DL number" value={form.licenceNumber} onChange={e => set('licenceNumber', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Licence Renew Date</label>
          <input className="form-input" type="date" value={form.licenceRenewDate} onChange={e => set('licenceRenewDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Batch No</label>
          <input className="form-input" placeholder="Batch number" value={form.batchNo} onChange={e => set('batchNo', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Batch Renew Date</label>
          <input className="form-input" type="date" value={form.batchRenewDate} onChange={e => set('batchRenewDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Photo</label>
          <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 4 }}>
            Files Supported: JPG | PNG | JPEG | GIF | WEBP | PDF
          </div>
          <input className="form-input" type="file" accept=".jpg,.png,.jpeg,.gif,.webp,.pdf" onChange={e => set('photo', e.target.files[0])} />
        </div>
        <div className="form-field">
          <label className="form-label">Submitted Document</label>
          <textarea className="form-input form-textarea" placeholder="Document details" value={form.submittedDocument} onChange={e => set('submittedDocument', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Remark</label>
          <textarea className="form-input form-textarea" placeholder="Remarks" value={form.remark} onChange={e => set('remark', e.target.value)} />
        </div>
      </div>

      <div className="form-submit-row">
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Copy', 'CSV', 'Print'].map(b => (
            <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'AddDriverHelper'); else handlePrint('Add Driver Helper'); }}>{b}</button>
          ))}
        </div>
        <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              {['SNo.','Edit','Status','Image','Type','Name','DOB','Mobile Number','Password','Joining Date','Experience','Present Add','Permanent Address','Licence Number','Licence Renew Date'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={15} className="empty-table-msg">No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td><button className="tbl-btn edit" onClick={() => alert("Edit record")}>Edit</button></td>
                <td><span style={{ color: '#16a34a', fontWeight: 600 }}>Active</span></td>
                <td>—</td>
                <td>{r.type}</td>
                <td>{r.name}</td>
                <td>{r.dob || '—'}</td>
                <td>{r.mobileNumber || '—'}</td>
                <td>{r.password}</td>
                <td>{r.joiningDate}</td>
                <td>{r.experience || '—'}</td>
                <td>{r.presentAdd || '—'}</td>
                <td>{r.permanentAddress || '—'}</td>
                <td>{r.licenceNumber || '—'}</td>
                <td>{r.licenceRenewDate}</td>
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
