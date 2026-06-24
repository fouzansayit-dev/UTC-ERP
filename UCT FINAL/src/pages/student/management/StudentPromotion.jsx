import React, { useState } from 'react';
import '../Student.css';

const YEARS = ['I-Year','II-Year','III-Year','IV-Year','V-Year','VI-Year'];

export default function StudentPromotion() {
  const [filters, setFilters]     = useState({ course: '', branch: '', batch: '', session: '2024-2025', yearSem: 'I-Year' });
  const [promoteYear, setPromoteYear] = useState({ yearSem: 'II-Year', session: '2025-2026', foreignUniversity: '' });
  const [rows, setRows]           = useState([]);
  const [viewed, setViewed]       = useState(false);

  const set  = (k) => (e) => setFilters(p => ({ ...p, [k]: e.target.value }));
  const setP = (k) => (e) => setPromoteYear(p => ({ ...p, [k]: e.target.value }));

  const handleView = () => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
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
        setRows(filtered);
        setViewed(true);
      })
      .catch(err => console.error('Error fetching students:', err));
  };

  const toggleSelect  = (id) => setRows(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  const toggleAll     = (v)  => setRows(prev => prev.map(r => ({ ...r, selected: v })));

  const handlePromote = () => {
    const sel = rows.filter(r => r.selected);
    if (!sel.length) { alert('Please select at least one student.'); return; }
    
    const promises = sel.map(stu => {
      return fetch(`/api/students/${stu.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...stu,
          batch: promoteYear.session,
          currentYearSem: promoteYear.yearSem,
          university: promoteYear.foreignUniversity || stu.university
        })
      });
    });

    Promise.all(promises)
      .then(() => {
        alert(`${sel.length} student(s) promoted to ${promoteYear.yearSem} (${promoteYear.session})!`);
        handleView();
      })
      .catch(err => alert('Failed to promote some students: ' + err.message));
  };

  const allSelected = rows.length > 0 && rows.every(r => r.selected);

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Promote Student</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
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
            <div className="stu-field">
              <label>Session</label>
              <select value={filters.session} onChange={set('session')}>
                <option>2024-2025</option><option>2025-2026</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Year/Sem</label>
              <select value={filters.yearSem} onChange={set('yearSem')}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* ── Promote Year ── */}
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', margin: '16px 0 10px' }}>Promote Year</div>
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Year/Sem</label>
              <select value={promoteYear.yearSem} onChange={setP('yearSem')}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>Session</label>
              <select value={promoteYear.session} onChange={setP('session')}>
                <option>2024-2025</option><option>2025-2026</option><option>2026-2027</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Abroad: Foreign University</label>
              <input type="text" value={promoteYear.foreignUniversity}
                onChange={setP('foreignUniversity')}
                placeholder="e.g. Kazan Federal University (for abroad batch)" />
            </div>
          </div>
          {promoteYear.foreignUniversity && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#1d4ed8', marginBottom: 8 }}>
              <strong>Note:</strong> Abroad batch promotion recorded at: {promoteYear.foreignUniversity}
            </div>
          )}

          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={handleView}>View</button>
          </div>
        </div>
      </div>

      {viewed && (
        <div className="stu-table-wrap">
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="stu-btn stu-btn-secondary stu-btn-sm" onClick={() => toggleAll(true)}>Check All</button>
            <button className="stu-btn stu-btn-secondary stu-btn-sm" onClick={() => toggleAll(false)}>Uncheck All</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={allSelected} onChange={e => toggleAll(e.target.checked)} /></th>
                  <th>S.No</th>
                  <th>NP</th>
                  <th>PR</th>
                  <th>TC</th>
                  <th>Scholar No</th>
                  <th>Course</th>
                  <th>Branch</th>
                  <th>Year</th>
                  <th>Roll No.</th>
                  <th>Enrollment No</th>
                  <th>Name</th>
                  <th>Father's Name</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={13} className="stu-empty">No records found</td></tr>
                ) : rows.map((r, i) => (
                  <tr key={r.id}>
                    <td><input type="checkbox" checked={r.selected || false} onChange={() => toggleSelect(r.id)} /></td>
                    <td>{i + 1}</td>
                    <td><input type="checkbox" checked={r.np || false} onChange={() => setRows(prev => prev.map(s => s.id === r.id ? { ...s, np: !s.np } : s))} /></td>
                    <td><input type="checkbox" checked={r.pr || false} onChange={() => setRows(prev => prev.map(s => s.id === r.id ? { ...s, pr: !s.pr } : s))} /></td>
                    <td><input type="checkbox" checked={r.tc || false} onChange={() => setRows(prev => prev.map(s => s.id === r.id ? { ...s, tc: !s.tc } : s))} /></td>
                    <td>{r.scholarNo || '—'}</td>
                    <td>{r.course}</td>
                    <td>{r.branch || '—'}</td>
                    <td>{r.yearSem || '—'}</td>
                    <td>{r.rollNo || '—'}</td>
                    <td>{r.enrollmentNo || '—'}</td>
                    <td>{r.name}</td>
                    <td>{r.fathersName || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <button className="stu-btn stu-btn-success" onClick={handlePromote}>
              Promote Student
            </button>
          </div>
        </div>
      )}
    </>
  );
}
