import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useEffect } from 'react';
import '../Hostel.css';

const HOSTELS    = ['UNIO GIRLS HOSTEL', 'UNIO BOYS HOSTEL'];
const OCCUPANCY  = ['1', '2', '3', '4', '5', '6'];
const CATEGORIES = ['AC', 'Non-AC'];
const ROOM_TYPES = ['Single', 'Double', 'Triple'];

const INIT = {
  hostel: '', roomType: 'Single', occupancy: '1', category: 'AC',
  roomNo: '', roomCharges: '', roomLocation: '', order: '',
};

export default function AddRoom() {
  const [form, setForm]       = useState(INIT);
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch]   = useState('');

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadRecords = () => {
    fetch('/api/generic/hostel/rooms')
      .then(res => res.json())
      .then(data => setRecords(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading rooms:', err));
  };

  const saveRecords = (updated) => {
    fetch('/api/generic/hostel/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => loadRecords())
      .catch(err => alert('Failed to save room: ' + err.message));
  };

  useEffect(() => { loadRecords(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.hostel) { alert('Please select a Hostel.'); return; }
    if (!form.roomNo.trim()) { alert('Room No is required.'); return; }
    let updated;
    if (editing !== null) {
      updated = records.map(r => r._id === editing ? { ...r, ...form } : r);
      setEditing(null);
    } else {
      updated = [...records, { ...form, _id: Date.now(), sno: records.length + 1, status: 'Active', occupied: 0, capacity: parseInt(form.occupancy) || 1 }];
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
    if (!window.confirm('Delete this room?')) return;
    saveRecords(records.filter(r => r._id !== id));
  };

  const filtered = records.filter(r =>
    (r.roomNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.hostel || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hostel-wrapper">

      {/* ── Form Card ── */}
      <div className="hostel-card">
        <div className="hostel-card-title">Add Room</div>

        <form onSubmit={handleSubmit}>
          <div className="hostel-form-grid">
            <div className="hostel-field">
              <label>Hostel</label>
              <select value={form.hostel} onChange={set('hostel')}>
                <option value="">Select</option>
                {HOSTELS.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>

            <div className="hostel-field">
              <label>Room Type</label>
              <select value={form.roomType} onChange={set('roomType')}>
                {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="hostel-field">
              <label>Occupancy</label>
              <select value={form.occupancy} onChange={set('occupancy')}>
                {OCCUPANCY.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="hostel-field">
              <label>Category</label>
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="hostel-field">
              <label>Room No</label>
              <input value={form.roomNo} onChange={set('roomNo')} placeholder="e.g. A-2" />
            </div>

            <div className="hostel-field">
              <label>Room Charges</label>
              <input type="number" min="0" value={form.roomCharges} onChange={set('roomCharges')} placeholder="e.g. 250" />
            </div>

            <div className="hostel-field">
              <label>Room Location</label>
              <input value={form.roomLocation} onChange={set('roomLocation')} placeholder="e.g. MALOA" />
            </div>

            <div className="hostel-field">
              <label>Order</label>
              <input type="number" min="0" value={form.order} onChange={set('order')} />
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
            <button className="hostel-tbl-tool-btn" onClick={e => handleCSV(e.currentTarget, 'AddRoom')}>CSV</button>
            <button className="hostel-tbl-tool-btn" onClick={() => handlePrint('Add Room')}>Print</button>
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
                <th>Copy</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>Hostel Name</th>
                <th>Room Type</th>
                <th>Category</th>
                <th>Occupancy</th>
                <th>Room No</th>
                <th>Room Location</th>
                <th>Room Charges</th>
                <th>Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={13} className="hostel-empty">No rooms found.</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td><button className="tbl-copy-btn" onClick={() => {
                    navigator.clipboard?.writeText(JSON.stringify(r)).then(() => {}).catch(() => {});
                  }}>Copy</button></td>
                  <td><button className="tbl-edit-btn" onClick={() => handleEdit(r)}>Edit</button></td>
                  <td><button className="tbl-del-btn" onClick={() => handleDelete(r._id)}>Delete</button></td>
                  <td style={{ fontWeight: 600 }}>{r.hostel}</td>
                  <td>{r.roomType}</td>
                  <td>{r.category}</td>
                  <td>{r.occupancy}</td>
                  <td>{r.roomNo}</td>
                  <td>{r.roomLocation}</td>
                  <td>{r.roomCharges ? `${r.roomCharges}` : ''}</td>
                  <td>{r.order}</td>
                  <td><span className="hostel-badge hostel-badge-active">{r.status}</span></td>
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
