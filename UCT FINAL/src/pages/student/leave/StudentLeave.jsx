import React, { useState } from 'react';
import '../Student.css';

const STUDENTS = [];

const LEAVE_TYPES = ['Medical Leave', 'Casual Leave', 'Emergency Leave', 'Academic Leave', 'Personal Leave'];

const DUMMY_LEAVES = [];

/* ── Leave Apply ── */
function LeaveApply() {
  const [form, setForm] = useState({ student: '', leaveType: '', fromDate: '', toDate: '', reason: '', docs: null });
  const [submitted, setSubmitted] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.student || !form.leaveType || !form.fromDate || !form.toDate) {
      alert('Please fill all required fields.'); return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ student: '', leaveType: '', fromDate: '', toDate: '', reason: '', docs: null });
  };

  const calcDays = () => {
    if (!form.fromDate || !form.toDate) return 0;
    const diff = new Date(form.toDate) - new Date(form.fromDate);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  return (
    <div className="stu-filter-card">
      <div className="stu-filter-header">Student Leave Application</div>
      <div className="stu-filter-body">
        {submitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 6, padding: '10px 16px', marginBottom: 16, color: '#15803d', fontSize: 13, fontWeight: 600 }}>
            ✓ Leave application submitted successfully! Awaiting approval.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="stu-form-grid">
            <div className="stu-field">
              <label>Student<span style={{ color: '#dc2626' }}> *</span></label>
              <select value={form.student} onChange={set('student')}>
                <option value="">-- Select Student --</option>
                {STUDENTS.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>Leave Type<span style={{ color: '#dc2626' }}> *</span></label>
              <select value={form.leaveType} onChange={set('leaveType')}>
                <option value="">-- Select Leave Type --</option>
                {LEAVE_TYPES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>From Date<span style={{ color: '#dc2626' }}> *</span></label>
              <input type="date" value={form.fromDate} onChange={set('fromDate')} />
            </div>
            <div className="stu-field">
              <label>To Date<span style={{ color: '#dc2626' }}> *</span></label>
              <input type="date" value={form.toDate} onChange={set('toDate')} />
            </div>
            {calcDays() > 0 && (
              <div className="stu-field">
                <label>Number of Days</label>
                <input type="text" value={`${calcDays()} day(s)`} readOnly style={{ background: '#f9fafb', color: '#2563eb', fontWeight: 600 }} />
              </div>
            )}
            <div className="stu-field" style={{ gridColumn: 'span 2' }}>
              <label>Reason for Leave</label>
              <textarea value={form.reason} onChange={set('reason')} rows={3} placeholder="Describe the reason for leave..." />
            </div>
            <div className="stu-field">
              <label>Supporting Document (optional)</label>
              <input type="file" style={{ padding: '4px 0' }} />
            </div>
          </div>
          <div className="stu-btn-row">
            <button type="submit" className="stu-btn stu-btn-primary" onClick={() => alert("Action")}>Submit Application</button>
            <button type="reset" className="stu-btn stu-btn-secondary" onClick={() => alert("Action")}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Leave Details / Approval ── */
function LeaveDetails() {
  const [leaves, setLeaves] = useState(DUMMY_LEAVES.map((l) => ({ ...l })));
  const [filters, setFilters] = useState({ status: 'All', student: '' });
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const updateStatus = (id, newStatus) =>
    setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));

  const filtered = leaves.filter((l) => {
    if (filters.status !== 'All' && l.status !== filters.status) return false;
    if (filters.student && !l.student.toLowerCase().includes(filters.student.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Leave Details & Approval</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Filter by Status</label>
              <select value={filters.status} onChange={set('status')}>
                <option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Search Student</label>
              <input type="text" value={filters.student} onChange={set('student')} placeholder="Enter student name..." />
            </div>
          </div>
        </div>
      </div>

      <div className="stu-table-wrap">
        <div className="stu-table-title">Leave Applications ({filtered.length})</div>
        {filtered.length === 0
          ? <div className="stu-empty">No leave applications found.</div>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table className="stu-table">
                <thead>
                  <tr>
                    <th>S.No</th><th>Student</th><th>Roll No</th><th>Leave Type</th>
                    <th>From</th><th>To</th><th>Days</th><th>Reason</th>
                    <th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l, i) => (
                    <tr key={l.id}>
                      <td>{i+1}</td>
                      <td style={{ fontWeight: 500 }}>{l.student}</td>
                      <td>{l.rollNo}</td>
                      <td>{l.type}</td>
                      <td>{l.from}</td>
                      <td>{l.to}</td>
                      <td>{l.days}</td>
                      <td style={{ maxWidth: 160, fontSize: 12, color: '#6b7280' }}>{l.reason}</td>
                      <td>
                        <span className={`stu-badge ${
                          l.status === 'Approved' ? 'stu-badge-green' :
                          l.status === 'Rejected' ? 'stu-badge-red' : 'stu-badge-orange'
                        }`}>{l.status}</span>
                      </td>
                      <td>
                        {l.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="stu-btn stu-btn-success stu-btn-sm" onClick={() => updateStatus(l.id, 'Approved')}>Approve</button>
                            <button className="stu-btn stu-btn-danger  stu-btn-sm" onClick={() => updateStatus(l.id, 'Rejected')}>Reject</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#9ca3af' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </>
  );
}

const LEAVE_TABS = [
  { id: 'apply',   label: 'Student Leave Apply',   Component: LeaveApply },
  { id: 'details', label: 'Student Leave Details',  Component: LeaveDetails },
];

export default function StudentLeave() {
  const [active, setActive] = useState('apply');
  const tab = LEAVE_TABS.find((t) => t.id === active);
  const PageComp = tab.Component;

  return (
    <div>
      <div className="stu-tabs">
        {LEAVE_TABS.map((t) => (
          <div key={t.id} className={`stu-tab ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
            {t.label}
          </div>
        ))}
      </div>
      <PageComp />
    </div>
  );
}
