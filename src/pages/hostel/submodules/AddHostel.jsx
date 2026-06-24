import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';
import '../Hostel.css';

const HOSTEL_TYPES = ['Boys', 'Girls', 'Co-Ed'];
const COLLEGES     = ['UNIVERSIDADE CATOLICA TIMORENSE'];

const INIT = {
  college: '', hostelType: 'Boys', hostelCode: '', hostelName: '',
  roomCapacity: '', regNo: '', contactNo: '', pin: '', emailId: '',
  date: new Date().toISOString().split('T')[0], order: '',
  remarks: '', address: '', warden: '', securityGuard: '', cookingBoy: '',
};

import { useEffect } from 'react';

export default function AddHostel() {
  const [form, setForm]     = useState(INIT);
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch]   = useState('');

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadRecords = () => {
    fetch('/api/generic/hostel/hostels')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Error loading hostels:', err));
  };

  const saveRecords = (newRecords) => {
    fetch('/api/generic/hostel/hostels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecords)
    })
      .then(res => res.json())
      .then(() => loadRecords())
      .catch(err => alert('Failed to save hostel record: ' + err.message));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.hostelName.trim()) { alert('Hostel Name is required.'); return; }
    let updated;
    if (editing !== null) {
      updated = records.map(r => r._id === editing ? { ...r, ...form } : r);
      setEditing(null);
    } else {
      updated = [...records, { ...form, _id: Date.now(), sno: records.length + 1 }];
    }
    setForm(INIT);
    saveRecords(updated);
  };

  const handleEdit = (r) => {
    setForm({ ...r });
    setEditing(r._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this hostel record?')) return;
    const updated = records.filter(r => r._id !== id);
    saveRecords(updated);
  };

  const filtered = records.filter(r =>
    r.hostelName.toLowerCase().includes(search.toLowerCase()) ||
    (r.hostelCode || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hostel-wrapper">

      {/* ── Form Card ── */}
      <div className="hostel-card">
        <div className="hostel-card-title">Add Hostel</div>

        <form onSubmit={handleSubmit}>
          <div className="hostel-form-grid">
            <div className="hostel-field">
              <label>College</label>
              <select value={form.college} onChange={set('college')}>
                <option value="">None selected</option>
                {COLLEGES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="hostel-field">
              <label>Hostel Type</label>
              <select value={form.hostelType} onChange={set('hostelType')}>
                {HOSTEL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="hostel-field">
              <label>Hostel Code</label>
              <input value={form.hostelCode} onChange={set('hostelCode')} placeholder="e.g. UNIO2501" />
            </div>

            <div className="hostel-field">
              <label>Hostel Name <span className="req">*</span></label>
              <input value={form.hostelName} onChange={set('hostelName')} placeholder="Enter hostel name" />
            </div>

            <div className="hostel-field">
              <label>Room Capacity</label>
              <input type="number" min="0" value={form.roomCapacity} onChange={set('roomCapacity')} placeholder="e.g. 20" />
            </div>

            <div className="hostel-field">
              <label>Reg. No.</label>
              <input value={form.regNo} onChange={set('regNo')} />
            </div>

            <div className="hostel-field">
              <label>Contact No.</label>
              <input value={form.contactNo} onChange={set('contactNo')} placeholder="e.g. 73877271" />
            </div>

            <div className="hostel-field">
              <label>PIN</label>
              <input value={form.pin} onChange={set('pin')} />
            </div>

            <div className="hostel-field">
              <label>Email Id</label>
              <input type="email" value={form.emailId} onChange={set('emailId')} />
            </div>

            <div className="hostel-field">
              <label>Date</label>
              <input type="date" value={form.date} onChange={set('date')} />
            </div>

            <div className="hostel-field">
              <label>Order</label>
              <input type="number" min="0" value={form.order} onChange={set('order')} />
            </div>

            <div className="hostel-field span2">
              <label>Remarks</label>
              <textarea value={form.remarks} onChange={set('remarks')} rows={2} />
            </div>

            <div className="hostel-field span2">
              <label>Address</label>
              <textarea value={form.address} onChange={set('address')} rows={2} />
            </div>

            <div className="hostel-field">
              <label>Warden</label>
              <select value={form.warden} onChange={set('warden')}>
                <option value="">None selected</option>
                <option>Warden A</option>
                <option>Warden B</option>
              </select>
            </div>

            <div className="hostel-field">
              <label>Security Guard</label>
              <select value={form.securityGuard} onChange={set('securityGuard')}>
                <option value="">None selected</option>
                <option>Guard A</option>
                <option>Guard B</option>
              </select>
            </div>

            <div className="hostel-field">
              <label>Cooking Boy</label>
              <select value={form.cookingBoy} onChange={set('cookingBoy')}>
                <option value="">None selected</option>
                <option>Staff A</option>
                <option>Staff B</option>
              </select>
            </div>
          </div>

          <div className="hostel-btn-row">
            <button type="submit" className="hostel-btn-primary">
              {editing !== null ? 'Update' : 'Submit'}
            </button>
            <button type="button" className="hostel-btn-secondary"
              onClick={() => { setForm(INIT); setEditing(null); }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* ── Records Table ── */}
      <div className="hostel-card">
        <div className="hostel-table-toolbar">
          <div className="hostel-table-actions">
            <button className="hostel-tbl-tool-btn" onClick={e => handleCopy(e.currentTarget)}>Copy</button>
            <button className="hostel-tbl-tool-btn" onClick={e => handleCSV(e.currentTarget, 'AddHostel')}>CSV</button>
            <button className="hostel-tbl-tool-btn" onClick={() => handlePrint('Add Hostel')}>Print</button>
          </div>
          <input
            className="hostel-search-input"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="hostel-table-wrap">
          <table className="hostel-table">
            <thead>
              <tr>
                <th>SNo.</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>College</th>
                <th>Hostel Type</th>
                <th>Hostel Code</th>
                <th>Hostel Name</th>
                <th>Room Capacity</th>
                <th>Reg. No.</th>
                <th>Contact No.</th>
                <th>PIN</th>
                <th>Email Id</th>
                <th>Date</th>
                <th>Warden</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={14} className="hostel-empty">No hostel records found.</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td><button className="tbl-edit-btn" onClick={() => handleEdit(r)}>Edit</button></td>
                  <td><button className="tbl-del-btn" onClick={() => handleDelete(r._id)}>Delete</button></td>
                  <td>{r.college}</td>
                  <td>{r.hostelType}</td>
                  <td>{r.hostelCode}</td>
                  <td style={{ fontWeight: 600 }}>{r.hostelName}</td>
                  <td>{r.roomCapacity}</td>
                  <td>{r.regNo}</td>
                  <td>{r.contactNo}</td>
                  <td>{r.pin}</td>
                  <td>{r.emailId}</td>
                  <td>{r.date}</td>
                  <td>{r.warden}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div style={{ fontSize: 13.5, color: '#64748b', marginTop: 10 }}>
            Showing 1 to {filtered.length} of {filtered.length} entries
          </div>
        )}
      </div>
    </div>
  );
}
