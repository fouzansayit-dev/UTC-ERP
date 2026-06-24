import React, { useState, useEffect } from 'react';
import '../Student.css';

const DUMMY = [];

export default function StudentSearch() {
  const [filters, setFilters] = useState({
    course: '', branch: '', batch: '',
    searchBy: 'Name', searchVal: ''
  });
  const [allStudents, setAllStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const load = () => {
      fetch('/api/students')
        .then(res => res.json())
        .then(data => setAllStudents(data))
        .catch(err => console.error('Error loading students:', err));
    };
    load();
    window.addEventListener('uct_data_update', load);
    return () => window.removeEventListener('uct_data_update', load);
  }, []);

  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const handleSearch = () => {
    const q = filters.searchVal.toLowerCase().trim();
    let out = allStudents;
    if (q) {
      if (filters.searchBy === 'Name')         out = out.filter((s) => (s.name || '').toLowerCase().includes(q));
      else if (filters.searchBy === 'Roll No')  out = out.filter((s) => (s.rollNo || s.roll_no || '').toLowerCase().includes(q));
      else if (filters.searchBy === 'Passport') out = out.filter((s) => (s.passportNo || s.passport_no || '').toLowerCase().includes(q));
    }
    if (filters.course) out = out.filter((s) => s.course === filters.course);
    setResults(out);
    setSearched(true);
  };

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Search Student (Name / Scholar No / Passport)</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Course</label>
              <select value={filters.course} onChange={set('course')}>
                <option value="">All</option>
                <option>MBBS</option><option>BDS</option><option>MD</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Branch Name</label>
              <select value={filters.branch} onChange={set('branch')}>
                <option value="">All</option><option>General</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Batch</label>
              <select value={filters.batch} onChange={set('batch')}>
                <option value="">All</option><option>Batch A</option>
              </select>
            </div>
          </div>
          <div className="stu-filter-row">
            <div className="stu-field" style={{ flex: '0 0 160px' }}>
              <label>Search By</label>
              <select value={filters.searchBy} onChange={set('searchBy')}>
                <option>Name</option>
                <option>Roll No</option>
                <option>Passport</option>
              </select>
            </div>
            <div className="stu-field" style={{ flex: '1 1 260px' }}>
              <label>Search Value</label>
              <input
                type="text"
                value={filters.searchVal}
                onChange={set('searchVal')}
                placeholder={`Enter ${filters.searchBy}...`}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="stu-field" style={{ flex: '0 0 auto', justifyContent: 'flex-end' }}>
              <label>&nbsp;</label>
              <button className="stu-btn stu-btn-primary" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
      </div>

      {searched && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Results ({results.length} found)</div>
          {results.length === 0
            ? <div className="stu-empty">No students found matching your search criteria.</div>
            : (
              <div style={{ overflowX: 'auto' }}>
                <table className="stu-table">
                  <thead>
                    <tr>
                      <th>S.No</th><th>Name</th><th>Roll No</th><th>Passport No</th>
                      <th>Course</th><th>Year/Sem</th><th>Programme</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{r.name}</td>
                        <td>{r.rollNo || r.roll_no || '—'}</td>
                        <td>{r.passportNo || r.passport_no || '—'}</td>
                        <td>{r.course}</td>
                        <td>{r.yearSem || r.year_sem || 'I-Year'}</td>
                        <td><span className={`stu-badge ${r.type === 'Abroad' ? 'stu-badge-blue' : 'stu-badge-green'}`}>{r.type || 'Domestic'}</span></td>
                        <td>
                          <span className={`stu-badge ${(r.status || '').toLowerCase() === 'active' ? 'stu-badge-green' : 'stu-badge-red'}`}>
                            {r.status}
                          </span>
                        </td>
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
