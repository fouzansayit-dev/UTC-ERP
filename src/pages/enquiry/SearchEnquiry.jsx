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

export default function SearchEnquiry() {
  const [filters, setFilters] = useState({
    enquiryId: '', studentName: '', mobile: '', course: '',
    country: '', agentName: '', fromDate: '', toDate: '',
  });
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
    if (filters.enquiryId) out = out.filter(x => x.id.toString() === filters.enquiryId || `ENQ-${String(x.id).padStart(3, '0')}`.includes(filters.enquiryId));
    if (filters.studentName) out = out.filter(x => (x.name || x.studentName || '').toLowerCase().includes(filters.studentName.toLowerCase()));
    if (filters.mobile) out = out.filter(x => (x.phone || x.mobile || '').includes(filters.mobile));
    if (filters.course) out = out.filter(x => x.courseInterested === filters.course || x.course === filters.course);
    if (filters.country) out = out.filter(x => x.countryPreference === filters.country || x.country === filters.country);
    if (filters.agentName) out = out.filter(x => (x.agentId || '').toLowerCase().includes(filters.agentName.toLowerCase()));
    if (filters.fromDate) out = out.filter(x => (x.enquiryDate || x.session) >= filters.fromDate);
    if (filters.toDate) out = out.filter(x => (x.enquiryDate || x.session) <= filters.toDate);
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
    setFilters({
      enquiryId: '', studentName: '', mobile: '', course: '',
      country: '', agentName: '', fromDate: '', toDate: '',
    });
    setResults(enquiries);
  };

  return (
    <div className="hr-form">

      {/* ── FILTERS ── */}
      <div className="enq-filter-bar">
        <form onSubmit={handleSearch}>
          <div className="form-grid">
            <FormField label="Enquiry ID">
              <Input value={filters.enquiryId} onChange={set('enquiryId')} placeholder="Enter enquiry ID" />
            </FormField>
            <FormField label="Student Name">
              <Input value={filters.studentName} onChange={set('studentName')} placeholder="Enter student name" />
            </FormField>
            <FormField label="Mobile Number">
              <Input type="tel" value={filters.mobile} onChange={set('mobile')} placeholder="Enter mobile number" maxLength={10} />
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
            <FormField label="Country">
              <Select value={filters.country} onChange={set('country')}>
                <option value="">-- All Countries --</option>
                <option>India</option>
                <option>Russia</option>
                <option>Ukraine</option>
                <option>Kazakhstan</option>
                <option>Philippines</option>
                <option>Georgia</option>
                <option>Bangladesh</option>
                <option>Nepal</option>
                <option>China</option>
              </Select>
            </FormField>
            <FormField label="Agent Name">
              <Input value={filters.agentName} onChange={set('agentName')} placeholder="Enter agent name" />
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

      {/* ── RESULTS TABLE ── */}
      <SectionTitle title="Search Results" />
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Student Name</th>
              <th>Mobile Number</th>
              <th>Course</th>
              <th>Country</th>
              <th>Counselor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-table-msg">
                  No records found.
                </td>
              </tr>
            ) : (
              results.map((r) => (
                <tr key={r.id}>
                  <td>ENQ-{String(r.id).padStart(3, '0')}</td>
                  <td style={{ fontWeight: 600 }}>{r.name || r.studentName}</td>
                  <td>{r.phone || r.mobile}</td>
                  <td>{r.courseInterested || r.course || '—'}</td>
                  <td>{r.countryPreference || r.country || '—'}</td>
                  <td>{r.counselor || '—'}</td>
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
