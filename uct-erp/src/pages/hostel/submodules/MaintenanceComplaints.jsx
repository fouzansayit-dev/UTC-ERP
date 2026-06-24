import React, { useState } from 'react';
import '../Hostel.css';

const COMPLAINT_TYPES = [
  'Electrical', 'Plumbing', 'Carpentry', 'Cleaning',
  'AC / Cooling', 'Pest Control', 'Furniture', 'Civil Work', 'Other',
];
const PRIORITY_LIST   = ['Low', 'Medium', 'High', 'Urgent'];
const STATUS_LIST     = ['Open', 'Work In Progress', 'Resolved', 'Closed'];

const INIT = {
  complaintDate: new Date().toISOString().split('T')[0],
  studentId: '', studentName: '', hostel: '', roomNo: '',
  complaintType: '', priority: 'Medium', description: '',
  assignedTo: '', expectedResolutionDate: '',
};

export default function MaintenanceComplaints() {
  const [form, setForm]       = useState(INIT);
  const [records, setRecords] = useState([]);
  const [search, setSearch]   = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingId, setEditingId]       = useState(null);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.complaintType) { alert('Complaint Type is required.'); return; }
    if (!form.description.trim()) { alert('Description is required.'); return; }
    if (editingId !== null) {
      setRecords(p => p.map(r => r._id === editingId ? { ...r, ...form } : r));
      setEditingId(null);
    } else {
      const ticketNo = `MC-${String(records.length + 1).padStart(4, '0')}`;
      setRecords(p => [...p, { ...form, _id: Date.now(), sno: p.length + 1, ticketNo, status: 'Open', resolutionDate: '', resolutionNote: '' }]);
    }
    setForm(INIT);
  };

  const handleEdit = (r) => {
    setForm({ ...r });
    setEditingId(r._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusChange = (id, status) => {
    setRecords(p => p.map(r => r._id === id ? {
      ...r, status,
      resolutionDate: status === 'Resolved' ? new Date().toISOString().split('T')[0] : r.resolutionDate,
    } : r));
  };

  /* TAT = days from complaint date to today (or resolution date) */
  const calcTAT = (r) => {
    const start = new Date(r.complaintDate);
    const end   = r.resolutionDate ? new Date(r.resolutionDate) : new Date();
    const days  = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return days;
  };

  const statusBadgeClass = (s) => {
    if (s === 'Open')              return 'hostel-badge hostel-badge-open';
    if (s === 'Work In Progress')  return 'hostel-badge hostel-badge-wip';
    if (s === 'Resolved')          return 'hostel-badge hostel-badge-resolved';
    return 'hostel-badge hostel-badge-inactive';
  };

  const filtered = records.filter(r => {
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      (r.complaintType || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="hostel-wrapper">

      {/* ── New Complaint Form ── */}
      <div className="hostel-card">
        <div className="hostel-card-title">
          {editingId !== null ? 'Edit Complaint' : 'New Maintenance Complaint'}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="hostel-section-title">Complaint Details</div>
          <div className="hostel-form-grid">
            <div className="hostel-field">
              <label>Complaint Date</label>
              <input type="date" value={form.complaintDate} onChange={set('complaintDate')} />
            </div>
            <div className="hostel-field">
              <label>Student ID</label>
              <input value={form.studentId} onChange={set('studentId')} placeholder="e.g. STU001" />
            </div>
            <div className="hostel-field">
              <label>Student Name</label>
              <input value={form.studentName} onChange={set('studentName')} />
            </div>
            <div className="hostel-field">
              <label>Hostel</label>
              <select value={form.hostel} onChange={set('hostel')}>
                <option value="">Select Hostel</option>
                <option>UNIO GIRLS HOSTEL</option>
                <option>UNIO BOYS HOSTEL</option>
              </select>
            </div>
            <div className="hostel-field">
              <label>Room No</label>
              <input value={form.roomNo} onChange={set('roomNo')} placeholder="e.g. A-2" />
            </div>
            <div className="hostel-field">
              <label>Complaint Type <span className="req">*</span></label>
              <select value={form.complaintType} onChange={set('complaintType')}>
                <option value="">Select Type</option>
                {COMPLAINT_TYPES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="hostel-field">
              <label>Priority</label>
              <select value={form.priority} onChange={set('priority')}>
                {PRIORITY_LIST.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="hostel-field">
              <label>Assign To (Maintenance Staff)</label>
              <input value={form.assignedTo} onChange={set('assignedTo')} placeholder="Staff name" />
            </div>
            <div className="hostel-field">
              <label>Expected Resolution Date</label>
              <input type="date" value={form.expectedResolutionDate} onChange={set('expectedResolutionDate')} />
            </div>
            <div className="hostel-field span2">
              <label>Description <span className="req">*</span></label>
              <textarea value={form.description} onChange={set('description')}
                rows={3} placeholder="Describe the complaint in detail..." />
            </div>
          </div>

          <div className="hostel-btn-row">
            <button type="submit" className="hostel-btn-primary" onClick={() => alert("Action")}>
              {editingId !== null ? 'Update Complaint' : 'Submit Complaint'}
            </button>
            <button type="button" className="hostel-btn-secondary"
              onClick={() => { setForm(INIT); setEditingId(null); }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* ── Records / Tracker ── */}
      <div className="hostel-card">
        <div className="hostel-section-title">Complaint Tracker</div>

        <div className="hostel-table-toolbar">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Status:</span>
            {['All', ...STATUS_LIST].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{
                  padding: '5px 14px',
                  border: '1.5px solid',
                  borderColor: filterStatus === s ? '#4361ee' : '#e2e8f0',
                  borderRadius: 20,
                  background: filterStatus === s ? '#eef0fd' : '#fff',
                  color: filterStatus === s ? '#4361ee' : '#64748b',
                  fontSize: 13,
                  fontWeight: filterStatus === s ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: "'Nunito Sans', 'Inter', sans-serif",
                }}>
                {s}
              </button>
            ))}
          </div>
          <input className="hostel-search-input" placeholder="Search..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="hostel-table-wrap">
          <table className="hostel-table">
            <thead>
              <tr>
                <th>SNo.</th>
                <th>Ticket No</th>
                <th>Date</th>
                <th>Student Name</th>
                <th>Hostel</th>
                <th>Room No</th>
                <th>Complaint Type</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Expected Date</th>
                <th>TAT (Days)</th>
                <th>Status</th>
                <th>Resolution Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={14} className="hostel-empty">No complaints found.</td></tr>
              ) : filtered.map((r, i) => {
                const tat = calcTAT(r);
                const tatColor = tat > 7 ? '#dc2626' : tat > 3 ? '#92400e' : '#166534';
                const tatBg    = tat > 7 ? '#fee2e2' : tat > 3 ? '#fef9c3' : '#dcfce7';
                return (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 700, color: '#4361ee' }}>{r.ticketNo}</td>
                  <td>{r.complaintDate}</td>
                  <td style={{ fontWeight: 600 }}>{r.studentName || '—'}</td>
                  <td>{r.hostel}</td>
                  <td>{r.roomNo}</td>
                  <td>{r.complaintType}</td>
                  <td>
                    <span style={{
                      padding: '2px 10px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                      background: r.priority === 'Urgent' ? '#fee2e2' : r.priority === 'High' ? '#fef9c3' : '#f3f4f6',
                      color: r.priority === 'Urgent' ? '#991b1b' : r.priority === 'High' ? '#92400e' : '#374151',
                    }}>
                      {r.priority}
                    </span>
                  </td>
                  <td>{r.assignedTo || '—'}</td>
                  <td>{r.expectedResolutionDate || '—'}</td>
                  <td>
                    <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: tatBg, color: tatColor }}>
                      {tat} day{tat !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td><span className={statusBadgeClass(r.status)}>{r.status}</span></td>
                  <td>{r.resolutionDate || '—'}</td>
                  <td>
                    <select
                      value={r.status}
                      onChange={e => handleStatusChange(r._id, e.target.value)}
                      style={{ fontSize: 13, padding: '4px 8px', borderRadius: 6, border: '1.5px solid #e2e8f0', marginRight: 5 }}>
                      {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button className="tbl-edit-btn" onClick={() => handleEdit(r)}>Edit</button>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{ fontSize: 13.5, color: '#64748b', marginTop: 10 }}>
            Showing {filtered.length} complaint{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
