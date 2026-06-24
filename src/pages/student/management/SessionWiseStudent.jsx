import React, { useState, useEffect } from 'react';
import '../Student.css';

const ABROAD_COUNTRIES = [
  'Russia',
  'Philippines',
  'Kazakhstan',
  'Georgia',
  'Kyrgyzstan',
  'Bangladesh',
  'Ukraine',
];

export default function SessionWiseStudent() {
  const [filters, setFilters] = useState({
    course: 'All', branch: 'All', year: 'All', session: '2024-2025',
    programmeFilter: 'All', country: 'All'
  });
  const [allStudents, setAllStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setAllStudents(data))
      .catch(err => console.error('Error loading students:', err));
  }, []);

  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    let out = allStudents;
    if (filters.course !== 'All') out = out.filter((s) => s.course === filters.course);
    if (filters.branch !== 'All') out = out.filter((s) => s.branch === filters.branch);
    if (filters.year   !== 'All') out = out.filter((s) => (s.yearSem || s.year_sem) === filters.year);
    if (filters.programmeFilter === 'Domestic') out = out.filter((s) => s.type === 'Domestic');
    if (filters.programmeFilter === 'Abroad')   out = out.filter((s) => s.type === 'Abroad');
    if (filters.country !== 'All') out = out.filter((s) => s.country === filters.country);
    setResults(out);
    setSearched(true);
  };

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Session Wise Student</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Course</label>
              <select value={filters.course} onChange={set('course')}>
                <option>All</option><option>MBBS</option><option>BDS</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Branch Name</label>
              <select value={filters.branch} onChange={set('branch')}>
                <option>All</option><option>General</option><option>International</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Year</label>
              <select value={filters.year} onChange={set('year')}>
                <option>All</option>
                <option>I-Year</option><option>II-Year</option><option>III-Year</option>
                <option>IV-Year</option><option>V-Year</option><option>VI-Year</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Session</label>
              <select value={filters.session} onChange={set('session')}>
                <option>2024-2025</option><option>2025-2026</option>
              </select>
            </div>
          </div>
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Filter by Programme</label>
              <select value={filters.programmeFilter} onChange={set('programmeFilter')}>
                <option>All</option><option>Domestic</option><option>Abroad</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Filter by Country (Abroad)</label>
              <select value={filters.country} onChange={set('country')}>
                <option value="All">All</option>
                {ABROAD_COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>

      {searched && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Session Wise Students — {filters.session} ({results.length} records)</div>
          {results.length === 0
            ? <div className="stu-empty">No records found for selected filters.</div>
            : (
              <div style={{ overflowX: 'auto' }}>
                <table className="stu-table">
                  <thead>
                    <tr>
                      <th>S.No</th><th>Name</th><th>Roll No</th><th>Course</th>
                      <th>Branch</th><th>Year/Sem</th><th>Session</th>
                      <th>Programme</th><th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td>{r.name}</td>
                        <td>{r.rollNo || r.roll_no || '—'}</td>
                        <td>{r.course}</td>
                        <td>{r.branch}</td>
                        <td>{r.yearSem || r.year_sem || 'I-Year'}</td>
                        <td>{r.session || '2024-2025'}</td>
                        <td><span className={`stu-badge ${r.type === 'Abroad' ? 'stu-badge-blue' : 'stu-badge-green'}`}>{r.type || 'Domestic'}</span></td>
                        <td>{r.country || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      )}
    </>
  );
}
