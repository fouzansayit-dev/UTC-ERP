import React, { useState } from 'react';
import { SectionTitle, TblToolbar } from './SessionComponents.jsx';

const DATA = [
  { id:1, session:'2024-2025', startMonth:'July', endMonth:'June', code:'001', status:'N', students:124, faculty:18, createdOn:'01 Jul 2024' },
  { id:2, session:'2025-2026', startMonth:'July', endMonth:'June', code:'002', status:'Y', students:98,  faculty:16, createdOn:'01 Jul 2025' },
];

const StatCard = ({ label, value, color }) => (
  <div style={{ background:`${color}10`, border:`1px solid ${color}30`, borderLeft:`4px solid ${color}`, borderRadius:8, padding:'14px 18px' }}>
    <div style={{ fontSize:24, fontWeight:700, color, marginBottom:3 }}>{value}</div>
    <div style={{ fontSize:11, color:'#6b7280' }}>{label}</div>
  </div>
);

export default function SessionReport() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const filtered = DATA.filter(r => (filter === 'All' || r.status === filter) && (r.session.includes(search) || r.code.includes(search)));

  return (
    <div className="hr-form">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:12, marginBottom:24 }}>
        <StatCard label="Total Sessions"  value={DATA.length}                           color="#2563eb" />
        <StatCard label="Active Sessions" value={DATA.filter(r=>r.status==='Y').length} color="#16a34a" />
        <StatCard label="Total Students"  value={DATA.reduce((s,r)=>s+r.students,0)}   color="#0891b2" />
        <StatCard label="Total Faculty"   value={DATA.reduce((s,r)=>s+r.faculty,0)}    color="#d97706" />
      </div>
      <SectionTitle title="Session Report" />
      <div style={{ display:'flex', gap:16, marginBottom:12, flexWrap:'wrap', alignItems:'flex-end' }}>
        <div>
          <label className="form-label" style={{ display:'block', marginBottom:4 }}>Filter by Status</label>
          <select className="form-input" style={{ width:'auto', padding:'7px 12px' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option><option value="Y">Active (Y)</option><option value="N">Inactive (N)</option>
          </select>
        </div>
        <div style={{ marginLeft:'auto' }}>
          <input className="form-input" style={{ width:190, padding:'6px 10px', fontSize:12 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Session</th><th>Start Month</th><th>End Month</th><th>Code</th><th>Students</th><th>Faculty</th><th>Created On</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={9} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td><td style={{ fontWeight:600 }}>{r.session}</td><td>{r.startMonth}</td><td>{r.endMonth}</td>
                  <td style={{ color:'#d97706', fontWeight:600 }}>{r.code}</td>
                  <td>{r.students}</td><td>{r.faculty}</td><td>{r.createdOn}</td>
                  <td style={{ color: r.status==='Y'?'#16a34a':'#dc2626', fontWeight:600 }}>{r.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}
