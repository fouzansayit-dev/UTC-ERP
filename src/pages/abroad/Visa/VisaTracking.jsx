import React, { useState } from 'react';
import '../../student/Student.css';

const VISA_STUDENTS = [];

const STATUS_STYLE = {
  Processing: { bg: '#dbeafe', color: '#1d4ed8' },
  Approved:   { bg: '#dcfce7', color: '#15803d' },
  Rejected:   { bg: '#fee2e2', color: '#b91c1c' },
  Reapplying: { bg: '#fef9c3', color: '#92400e' },
};

const COUNTRIES = ['All', 'Russia', 'Philippines', 'Kazakhstan', 'Georgia', 'Kyrgyzstan', 'Bangladesh', 'Ukraine'];
const STATUSES  = ['All', 'Processing', 'Approved', 'Rejected', 'Reapplying'];

export default function VisaTracking() {
  const [students, setStudents] = useState(VISA_STUDENTS);
  const [country, setCountry]   = useState('All');
  const [status,  setStatus]    = useState('All');
  const [search,  setSearch]    = useState('');

  const filtered = students.filter((s) => {
    if (country !== 'All' && s.country !== country) return false;
    if (status  !== 'All' && s.status  !== status)  return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = (id, newStatus) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
  };

  const counts = ['Processing', 'Approved', 'Rejected', 'Reapplying'].reduce((acc, s) => {
    acc[s] = students.filter((x) => x.status === s).length;
    return acc;
  }, {});

  const TH = ({ children }) => (
    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 12, background: '#f8fafc', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap' }}>{children}</th>
  );

  return (
    <>
      {/* Status summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([st, ct]) => {
          const ss = STATUS_STYLE[st];
          return (
            <div key={st}
              onClick={() => setStatus(status === st ? 'All' : st)}
              style={{ background: status === st ? '#1e293b' : ss.bg, color: status === st ? '#fff' : ss.color, border: `1px solid ${status === st ? '#1e293b' : ss.color + '44'}`, borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 700, minWidth: 90, textAlign: 'center', transition: 'all 0.15s' }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{ct}</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{st}</div>
            </div>
          );
        })}
      </div>

      <div className="stu-filter-card">
        <div className="stu-filter-header">Visa Tracking — Stage 8 Students</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Search Student</label>
              <input type="text" placeholder="Student name..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="stu-field" style={{ maxWidth: 180 }}>
              <label>Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="stu-field" style={{ maxWidth: 160 }}>
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="stu-table-wrap">
        <div className="stu-table-title">Visa Applications — {filtered.length} records</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <TH>Student Name</TH><TH>Country</TH><TH>Embassy / Consulate</TH>
                <TH>Visa Type</TH><TH>Applied Date</TH><TH>Passport No.</TH>
                <TH>Status</TH><TH>Visa Expiry</TH><TH>Update Status</TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: 13 }}>
                  No visa records found. Connect backend to populate data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
