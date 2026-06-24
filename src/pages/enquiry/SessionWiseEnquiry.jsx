import React, { useState, useEffect } from 'react';
import './Enquiry.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;
const FormField = ({ label, children }) => (
  <div className="form-field">
    <label className="form-label">{label}</label>
    {children}
  </div>
);
const Select = ({ children, ...props }) => (
  <select className="form-input" {...props}>{children}</select>
);

export default function SessionWiseEnquiry() {
  const [filters, setFilters] = useState({ session: '', course: '', counselor: '' });
  const [enquiries, setEnquiries] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/api/enquiries')
      .then(res => res.json())
      .then(data => {
        setEnquiries(data);
        setResults(data);
      })
      .catch(err => console.error('Error loading enquiries:', err));
  }, []);

  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    let out = enquiries;
    if (filters.session) out = out.filter(x => x.session === filters.session);
    if (filters.course) out = out.filter(x => x.courseInterested === filters.course || x.course === filters.course);
    if (filters.counselor) out = out.filter(x => x.counselor === filters.counselor);
    setResults(out);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    fetch(`/api/enquiries/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        setEnquiries(prev => prev.filter(x => x.id !== id));
        setResults(prev => prev.filter(x => x.id !== id));
      })
      .catch(err => alert(err.message));
  };

  const handleReset  = () => {
    setFilters({ session: '', course: '', counselor: '' });
    setResults(enquiries);
  };

  return (
    <div className="hr-form">

      {/* ── FILTERS ── */}
      <div className="enq-filter-bar">
        <form onSubmit={handleSearch}>
          <div className="form-grid">
            <FormField label="Session">
              <Select value={filters.session} onChange={set('session')}>
                <option value="">-- Select Session --</option>
                <option>2024-25</option>
                <option>2025-26</option>
                <option>2026-27</option>
              </Select>
            </FormField>
            <FormField label="Course">
              <Select value={filters.course} onChange={set('course')}>
                <option value="">-- All Courses --</option>
                <option>MBBS - Domestic</option>
                <option>MBBS - Abroad</option>
                <option>MD</option>
                <option>BDS</option>
                <option>BAMS</option>
                <option>BHMS</option>
              </Select>
            </FormField>
            <FormField label="Counselor">
              <Select value={filters.counselor} onChange={set('counselor')}>
                <option value="">-- All Counselors --</option>
                <option>Counselor 1</option>
                <option>Counselor 2</option>
                <option>Counselor 3</option>
              </Select>
            </FormField>
          </div>
          <div className="enq-filter-actions">
            <button type="submit" className="btn-primary">Search</button>
            <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>

      {/* ── TABLE ── */}
      <SectionTitle title="Session Wise Enquiry Records" />
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Session</th>
              <th>Counselor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-table-msg">
                  No records found.
                </td>
              </tr>
            ) : (
              results.map((r) => (
                <tr key={r.id}>
                  <td>ENQ-{String(r.id).padStart(3, '0')}</td>
                  <td style={{ fontWeight: 600 }}>{r.name || r.studentName}</td>
                  <td>{r.courseInterested || r.course || '—'}</td>
                  <td>{r.session}</td>
                  <td>{r.counselor || '—'}</td>
                  <td>
                    <span className={`stu-badge ${(r.status || 'pending').toLowerCase() === 'pending' ? 'stu-badge-blue' : 'stu-badge-green'}`}>
                      {r.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDelete(r.id)}
                      style={{
                        background: '#dc2626', color: '#fff', border: 'none',
                        borderRadius: 4, padding: '4px 8px', fontSize: 12,
                        cursor: 'pointer', fontWeight: 600
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
