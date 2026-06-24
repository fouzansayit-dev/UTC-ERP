import React, { useState, useEffect } from 'react';
import './Enquiry.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;
const FormField = ({ label, children }) => (
  <div className="form-field">
    <label className="form-label">{label}</label>
    {children}
  </div>
);
const Input  = (props) => <input className="form-input" {...props} />;
const Select = ({ children, ...props }) => (
  <select className="form-input" {...props}>{children}</select>
);

export default function EnquiryDetailsList() {
  const [filters, setFilters] = useState({
    session: '', course: '', programType: '', counselor: '', fromDate: '', toDate: '',
  });
  const [enquiries, setEnquiries] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const loadEnquiries = () => {
    fetch('/api/enquiries')
      .then(res => res.json())
      .then(data => {
        setEnquiries(data);
        setResults(data);
      })
      .catch(err => console.error('Error loading enquiries:', err));
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    let out = enquiries;
    if (filters.session) out = out.filter(x => x.session === filters.session);
    if (filters.course) out = out.filter(x => x.courseInterested === filters.course || x.course === filters.course);
    if (filters.programType) out = out.filter(x => x.programType === filters.programType);
    if (filters.counselor) out = out.filter(x => x.counselor === filters.counselor);
    if (filters.fromDate) out = out.filter(x => (x.enquiryDate || x.session) >= filters.fromDate);
    if (filters.toDate) out = out.filter(x => (x.enquiryDate || x.session) <= filters.toDate);
    setResults(out);
    setSearched(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry lead?')) return;
    fetch(`/api/enquiries/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete enquiry lead');
        setEnquiries(prev => prev.filter(x => x.id !== id));
        setResults(prev => prev.filter(x => x.id !== id));
      })
      .catch(err => alert(err.message));
  };

  const handleReset = () => {
    setFilters({ session: '', course: '', programType: '', counselor: '', fromDate: '', toDate: '' });
    setResults(enquiries);
    setSearched(false);
  };

  return (
    <div className="hr-form">

      {/* ── FILTERS ── */}
      <div className="enq-filter-bar">
        <form onSubmit={handleSearch}>
          <div className="form-grid">
            <FormField label="Session">
              <Select value={filters.session} onChange={set('session')}>
                <option value="">-- All Sessions --</option>
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
            <FormField label="Program Type">
              <Select value={filters.programType} onChange={set('programType')}>
                <option value="">-- All Types --</option>
                <option>Domestic</option>
                <option>Abroad</option>
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
            <FormField label="From Date">
              <Input type="date" value={filters.fromDate} onChange={set('fromDate')} />
            </FormField>
            <FormField label="To Date">
              <Input type="date" value={filters.toDate} onChange={set('toDate')} />
            </FormField>
          </div>
          <div className="enq-filter-actions">
            <button type="submit" className="btn-primary">Search</button>
            <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>

      {/* ── TABLE ── */}
      <SectionTitle title="Enquiry Records" />
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Enquiry Date</th>
              <th>Student Name</th>
              <th>Mobile Number</th>
              <th>Course Interested</th>
              <th>Program Type</th>
              <th>Assigned Counselor</th>
              <th>Follow-up Status</th>
              <th>Enquiry Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty-table-msg">
                  No records found.
                </td>
              </tr>
            ) : (
              results.map((r) => (
                <tr key={r.id}>
                  <td>ENQ-{String(r.id).padStart(3, '0')}</td>
                  <td>{r.enquiryDate || r.session}</td>
                  <td style={{ fontWeight: 600 }}>{r.name || r.studentName}</td>
                  <td>{r.phone || r.mobile}</td>
                  <td>{r.courseInterested || r.course || '—'}</td>
                  <td>{r.programType || '—'}</td>
                  <td>{r.counselor || '—'}</td>
                  <td>{r.pending_followup ? 'Pending' : 'Completed'}</td>
                  <td>
                    <span className={`stu-badge ${(r.status || 'pending').toLowerCase() === 'pending' ? 'stu-badge-blue' : 'stu-badge-green'}`}>
                      {r.status}
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
