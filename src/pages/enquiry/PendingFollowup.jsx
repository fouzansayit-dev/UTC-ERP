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

export default function PendingFollowup() {
  const [filters, setFilters] = useState({ counselor: '', course: '' });
  const [enquiries, setEnquiries] = useState([]);
  const [results, setResults] = useState([]);

  const loadEnquiries = () => {
    fetch('/api/enquiries')
      .then(res => res.json())
      .then(data => {
        const pending = data.filter(x => (x.status || 'pending').toLowerCase() === 'pending');
        setEnquiries(pending);
        setResults(pending);
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
    if (filters.counselor) out = out.filter(x => x.counselor === filters.counselor);
    if (filters.course) out = out.filter(x => x.courseInterested === filters.course || x.course === filters.course);
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
    setFilters({ counselor: '', course: '' });
    setResults(enquiries);
  };

  return (
    <div className="hr-form">

      <div className="enq-filter-bar">
        <form onSubmit={handleSearch}>
          <div className="form-grid">
            <FormField label="Counselor">
              <Select value={filters.counselor} onChange={set('counselor')}>
                <option value="">-- All Counselors --</option>
                <option>Counselor 1</option>
                <option>Counselor 2</option>
                <option>Counselor 3</option>
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
              </Select>
            </FormField>
          </div>
          <div className="enq-filter-actions">
            <button type="submit" className="btn-primary">Search</button>
            <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>

      <SectionTitle title="Pending Follow-up Records" />
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Student Name</th>
              <th>Mobile Number</th>
              <th>Counselor</th>
              <th>Enquiry Date</th>
              <th>Next Follow-up Details</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-table-msg">
                  No pending follow-up records found.
                </td>
              </tr>
            ) : (
              results.map((r) => (
                <tr key={r.id}>
                  <td>ENQ-{String(r.id).padStart(3, '0')}</td>
                  <td style={{ fontWeight: 600 }}>{r.name || r.studentName}</td>
                  <td>{r.phone || r.mobile}</td>
                  <td>{r.counselor || '—'}</td>
                  <td>{r.enquiryDate || r.session}</td>
                  <td>{r.pending_followup || '—'}</td>
                  <td>
                    <span className="stu-badge stu-badge-blue">
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

      <div style={{
        marginTop: 16, padding: '12px 16px',
        background: '#f8fafc', border: '1px solid #e5e7eb',
        borderRadius: 8, fontSize: 12, color: '#555',
      }}>
        <strong>Actions Shortcut:</strong>&nbsp;
        <span style={{ color: '#4361ee', fontWeight: 600 }}>Add Follow-up / Call / WhatsApp</span> options are accessible by editing individual enquiries.
      </div>

    </div>
  );
}
