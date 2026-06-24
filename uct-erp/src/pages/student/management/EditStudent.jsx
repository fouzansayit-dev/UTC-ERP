import { handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useEffect } from 'react';
import '../Student.css';
import StudentForm from './StudentForm.jsx';

export default function EditStudent() {
  const [filters, setFilters] = useState({ college: 'All', course: '', branch: '', batch: '' });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [viewing, setViewing]   = useState(null);

  const set = (k) => (e) => setFilters(p => ({ ...p, [k]: e.target.value }));

  const loadStudents = () => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        // Apply filters
        let filtered = data.map(stu => ({
          ...stu,
          scholarNo: stu.scholar_no,
          enrollmentNo: stu.enroll_no,
          rollNo: stu.roll_no,
          branchName: stu.branch,
          admissionDate: stu.admission_date
        }));
        
        if (filters.course) {
          filtered = filtered.filter(s => s.course === filters.course);
        }
        if (filters.branch) {
          filtered = filtered.filter(s => (s.branch || s.branchName) === filters.branch);
        }
        if (filters.batch) {
          filtered = filtered.filter(s => s.batch === filters.batch);
        }
        setResults(filtered);
        setSearched(true);
      })
      .catch(err => console.error('Error fetching students:', err));
  };

  const handleEditSubmit = (data) => {
    fetch(`/api/students/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async res => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to update student');
        setEditing(null);
        loadStudents();
      })
      .catch(err => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      fetch(`/api/students/${id}`, {
        method: 'DELETE'
      })
        .then(async res => {
          const body = await res.json();
          if (!res.ok) throw new Error(body.error || 'Failed to delete student');
          loadStudents();
        })
        .catch(err => alert(err.message));
    }
  };

  const male   = results.filter(r => r.gender === 'Male').length;
  const female = results.filter(r => r.gender === 'Female').length;

  /* ── Edit view ── */
  if (editing) return (
    <div className="stu-filter-card">
      <div className="stu-filter-header">Edit Student — {editing.name}</div>
      <div className="stu-filter-body">
        <StudentForm initialData={editing} submitLabel="Save Changes" onSubmit={handleEditSubmit} />
        <div className="stu-btn-row">
          <button className="stu-btn stu-btn-secondary" onClick={() => setEditing(null)}>← Back</button>
        </div>
      </div>
    </div>
  );

  /* ── Detail view ── */
  if (viewing) return (
    <div className="stu-filter-card">
      <div className="stu-filter-header">Student Details — {viewing.name}</div>
      <div className="stu-filter-body">
        <StudentForm initialData={viewing} readOnly submitLabel="" />
        <div className="stu-btn-row">
          <button className="stu-btn stu-btn-secondary" onClick={() => setViewing(null)}>← Back</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">View / Edit Student</div>
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
                <option value="">Select Batch</option>
                <option>2024-2030</option><option>2025-2031</option>
              </select>
            </div>
          </div>
          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={loadStudents}>Submit</button>
          </div>
        </div>
      </div>

      {searched && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Student List ({results.length})</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Edit</th>
                  <th>Print</th>
                  <th>Details</th>
                  <th>Delete</th>
                  <th>Schemes Category</th>
                  <th>Schemes</th>
                  <th>Course</th>
                  <th>Branch</th>
                  <th>Batch</th>
                  <th>Scholar No.</th>
                  <th>Roll No.</th>
                  <th>Enrollment No</th>
                  <th>University</th>
                  <th>RFID(UID)</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr><td colSpan={16} className="stu-empty">No records found</td></tr>
                ) : results.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>
                      <button className="stu-btn stu-btn-primary stu-btn-sm" onClick={() => setEditing(r)}>✎ Edit</button>
                    </td>
                    <td>
                      <button className="stu-btn stu-btn-secondary stu-btn-sm" onClick={() => handlePrint('Edit Student')}>🖶</button>
                    </td>
                    <td>
                      <button className="stu-btn stu-btn-success stu-btn-sm" onClick={() => setViewing(r)}>A Details</button>
                    </td>
                    <td>
                      <button className="stu-btn stu-btn-danger stu-btn-sm" onClick={() => handleDelete(r.id)}>🗑</button>
                    </td>
                    <td>{r.schemesCategory || '—'}</td>
                    <td style={{ fontSize: 12 }}>{r.schemes || '—'}</td>
                    <td>{r.course}</td>
                    <td>{r.branch || '—'}</td>
                    <td>{r.batch || '—'}</td>
                    <td>{r.scholarNo || '—'}</td>
                    <td>{r.rollNo || '—'}</td>
                    <td>{r.enrollmentNo || '—'}</td>
                    <td style={{ fontSize: 12 }}>{r.university || '—'}</td>
                    <td>{r.rfidUid || '—'}</td>
                    <td>{r.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 16px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', fontSize: 13, color: '#374151', display: 'flex', gap: 32 }}>
            <span>Male – {male}</span>
            <span>Female – {female}</span>
            <span>Total – {results.length}</span>
          </div>
        </div>
      )}
    </>
  );
}
