import React, { useState, useEffect } from 'react';
import '../Student.css';

const DROPOUT_REASONS = ['Personal Reasons','Financial Issues','Medical Reasons','Transfer to Another College','Failed Exams','Abroad Transfer','Other'];

export default function DropoutManagement() {
  const [filters, setFilters] = useState({ college: 'All', course: '', branch: '', batch: '' });
  const [allStudents, setAllStudents] = useState([]);
  const [rows, setRows]       = useState([]);
  const [searched, setSearched] = useState(false);
  const [modal, setModal]     = useState(null);
  const [dropForm, setDropForm] = useState({ reason: '', date: '', refund: false, remarks: '' });

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setAllStudents(data))
      .catch(err => console.error('Error loading students:', err));
  }, []);

  const set  = (k) => (e) => setFilters(p => ({ ...p, [k]: e.target.value }));
  const setD = (k) => (e) => setDropForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSearch = () => {
    let out = allStudents;
    if (filters.course) out = out.filter(s => s.course === filters.course);
    if (filters.branch) out = out.filter(s => (s.branch || '').toLowerCase() === filters.branch.toLowerCase());
    if (filters.batch) out = out.filter(s => s.batch === filters.batch);
    setRows(out);
    setSearched(true);
  };

  const openModal = (s) => {
    setModal(s);
    setDropForm({ reason: '', date: new Date().toISOString().split('T')[0], refund: false, remarks: '' });
  };

  const confirmDropout = () => {
    if (!dropForm.reason) { alert('Please select a dropout reason.'); return; }
    
    const updatedStudent = {
      ...modal,
      status: 'dropout',
      dropoutReason: dropForm.reason,
      dropoutDate: dropForm.date,
      dropoutRemarks: dropForm.remarks,
      refundTriggered: dropForm.refund
    };

    fetch(`/api/students/${modal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStudent)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update student status');
        return res.json();
      })
      .then(saved => {
        // Update local states
        setAllStudents(prev => prev.map(s => s.id === saved.id ? saved : s));
        setRows(prev => prev.map(r => r.id === saved.id ? saved : r));
        setModal(null);
      })
      .catch(err => alert(err.message));
  };

  const male   = rows.filter(r => r.gender === 'Male').length;
  const female = rows.filter(r => r.gender === 'Female').length;

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Dropout Student</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>College</label>
              <select value={filters.college} onChange={set('college')}>
                <option>All</option><option>UNIVERSIDADE CATOLICA TIMOR</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Course</label>
              <select value={filters.course} onChange={set('course')}>
                <option value="">Select</option><option>MBBS</option><option>BDS</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Branch Name</label>
              <select value={filters.branch} onChange={set('branch')}>
                <option value="">Select</option><option>MEDICINE</option><option>SURGERY</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Batch</label>
              <select value={filters.batch} onChange={set('batch')}>
                <option value="">Select Batch</option><option>2024-2030</option>
              </select>
            </div>
          </div>
          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={handleSearch}>Submit</button>
          </div>
        </div>
      </div>

      {searched && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Dropout Student List</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Edit</th>
                  <th>Status</th>
                  <th>Scholar No</th>
                  <th>Roll No.</th>
                  <th>Enrollment No</th>
                  <th>Name</th>
                  <th>Father's Name</th>
                  <th>Mother's Name</th>
                  <th>Father's Occupation</th>
                  <th>Mother's Occupation</th>
                  <th>DOB</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={12} className="stu-empty">No records found</td></tr>
                ) : rows.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>
                      {(r.status || '').toLowerCase() === 'active'
                        ? <button className="stu-btn stu-btn-danger stu-btn-sm" onClick={() => openModal(r)}>Dropout</button>
                        : <span style={{ fontSize: 12, color: '#9ca3af' }}>{r.status}</span>}
                    </td>
                    <td>
                      <span className={`stu-badge ${(r.status || '').toLowerCase() === 'dropout' || (r.status || '').toLowerCase() === 'dropped' ? 'stu-badge-red' : 'stu-badge-green'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.scholarNo || r.scholar_no || '—'}</td>
                    <td>{r.rollNo || r.roll_no || '—'}</td>
                    <td>{r.enrollmentNo || r.enroll_no || '—'}</td>
                    <td>{r.name}</td>
                    <td>{r.fathersName || '—'}</td>
                    <td>{r.mothersName || '—'}</td>
                    <td>{r.fathersOccupation || '—'}</td>
                    <td>{r.mothersOccupation || '—'}</td>
                    <td>{r.dob || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 16px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', fontSize: 13, color: '#374151', display: 'flex', gap: 32 }}>
            <span>Male – {male}</span>
            <span>Female – {female}</span>
            <span>Total – {rows.length}</span>
          </div>
        </div>
      )}

      {/* ── Dropout Modal ── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '24px 28px', width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Dropout: {modal.name}</div>
            <div className="stu-field" style={{ marginBottom: 12 }}>
              <label>Dropout Reason *</label>
              <select value={dropForm.reason} onChange={setD('reason')}>
                <option value="">-- Select Reason --</option>
                {DROPOUT_REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="stu-field" style={{ marginBottom: 12 }}>
              <label>Dropout Date</label>
              <input type="date" value={dropForm.date} onChange={setD('date')} />
            </div>
            <div className="stu-field" style={{ marginBottom: 12 }}>
              <label>Remarks</label>
              <textarea value={dropForm.remarks} onChange={setD('remarks')} rows={2} />
            </div>
            <label className="stu-check-row" style={{ marginBottom: 16 }}>
              <input type="checkbox" checked={dropForm.refund} onChange={setD('refund')} />
              Trigger Refund on Dropout
            </label>
            {dropForm.refund && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#c2410c', marginBottom: 14 }}>
                ⚠ Refund process will be initiated automatically after dropout confirmation.
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="stu-btn stu-btn-danger"     onClick={confirmDropout}>Confirm Dropout</button>
              <button className="stu-btn stu-btn-secondary"  onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
