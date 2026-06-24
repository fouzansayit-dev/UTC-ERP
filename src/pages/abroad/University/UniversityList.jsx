import React, { useState } from 'react';
import '../../student/Student.css';

const UNIVERSITIES = [];

const COUNTRIES = ['All', 'Russia', 'Philippines', 'Kazakhstan', 'Georgia', 'Kyrgyzstan', 'Bangladesh', 'Ukraine'];

export default function UniversityList() {
  const [search,  setSearch]  = useState('');
  const [country, setCountry] = useState('All');
  const [nmc,     setNmc]     = useState('All');

  const filtered = UNIVERSITIES.filter((u) => {
    if (country !== 'All' && u.country !== country) return false;
    if (nmc !== 'All' && !u.nmc.startsWith(nmc)) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const TH = ({ children, right = false }) => (
    <th style={{ padding: '10px 14px', textAlign: right ? 'right' : 'left', fontWeight: 600, color: '#374151', fontSize: 12, background: '#f8fafc', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap' }}>{children}</th>
  );

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">University Master List</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Search University</label>
              <input type="text" placeholder="University name..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="stu-field" style={{ maxWidth: 180 }}>
              <label>Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="stu-field" style={{ maxWidth: 160 }}>
              <label>NMC Status</label>
              <select value={nmc} onChange={(e) => setNmc(e.target.value)}>
                <option value="All">All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="stu-table-wrap">
        <div className="stu-table-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Universities — {filtered.length} records</span>
          <button className="stu-btn stu-btn-sm" style={{ background: '#16a34a', color: '#fff' }} onClick={() => alert("Action")}>+ Add University</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <TH>University Name</TH><TH>Country</TH><TH>NMC Status</TH>
                <TH>Visa Type</TH><TH>Currency</TH><TH right>Duration</TH>
                <TH right>Tuition (USD)</TH><TH right>Hostel (USD)</TH><TH>Intakes</TH><TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: 13 }}>
                  No universities found. Connect backend or use Add University to create records.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
