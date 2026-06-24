import React, { useState } from 'react';
import '../../student/Student.css';
import AbroadStudentTimeline from './AbroadStudentTimeline';
import { STAGES } from './AbroadStudentLifecycle';

const ALL_STUDENTS = [];

function stageColor(stageId) {
  if (stageId <= 3)  return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
  if (stageId <= 6)  return { bg: '#fefce8', color: '#92400e', border: '#fde68a' };
  if (stageId <= 9)  return { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' };
  if (stageId <= 11) return { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' };
  if (stageId <= 13) return { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' };
  return { bg: '#f0fdf4', color: '#065f46', border: '#6ee7b7' };
}

const COUNTRIES = ['All', 'Russia', 'Philippines', 'Kazakhstan', 'Georgia', 'Kyrgyzstan', 'Bangladesh', 'Ukraine'];
const SESSIONS  = ['All', '2024-2025', '2023-2024', '2022-2023', '2021-2022'];

export default function AbroadStudentList() {
  const [students]  = useState(ALL_STUDENTS);
  const [filters, setFilters]   = useState({ country: 'All', stage: 'All', session: 'All', search: '' });
  const [selected, setSelected] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const setF = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const filtered = students.filter((s) => {
    if (filters.country !== 'All' && s.country !== filters.country) return false;
    if (filters.stage   !== 'All' && s.stage !== Number(filters.stage)) return false;
    if (filters.session !== 'All' && s.session !== filters.session) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.rollNo.toLowerCase().includes(q) &&
          !s.university.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (showTimeline && selected) {
    return (
      <AbroadStudentTimeline
        student={selected}
        onBack={() => { setShowTimeline(false); setSelected(null); }}
        onAdvance={() => {}}
      />
    );
  }

  const TH = ({ children }) => (
    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 12, whiteSpace: 'nowrap', background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>{children}</th>
  );

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Abroad Student List</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Search Name / Roll No / University</label>
              <input type="text" placeholder="Type to search..." value={filters.search} onChange={setF('search')} />
            </div>
            <div className="stu-field" style={{ maxWidth: 180 }}>
              <label>Country</label>
              <select value={filters.country} onChange={setF('country')}>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="stu-field" style={{ maxWidth: 220 }}>
              <label>Stage</label>
              <select value={filters.stage} onChange={setF('stage')}>
                <option value="All">All Stages</option>
                {STAGES.map((s) => <option key={s.id} value={s.id}>{s.id}. {s.label}</option>)}
              </select>
            </div>
            <div className="stu-field" style={{ maxWidth: 160 }}>
              <label>Session</label>
              <select value={filters.session} onChange={setF('session')}>
                {SESSIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="stu-table-wrap">
        <div className="stu-table-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Students — {filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
          <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.7 }}>Click any row to view timeline</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <TH>Roll No</TH><TH>Name</TH><TH>Country</TH><TH>University</TH>
                <TH>Current Stage</TH><TH>Session</TH><TH>Agent</TH><TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: 13 }}>
                    No students found. Connect backend to populate data.
                  </td>
                </tr>
              )}
              {filtered.map((s, i) => {
                const sc = stageColor(s.stage);
                const stageName = STAGES.find((x) => x.id === s.stage)?.label || '';
                return (
                  <tr key={s.id}
                    style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafafa'}
                    onClick={() => { setSelected(s); setShowTimeline(true); }}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{s.rollNo}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: '10px 14px' }}>{s.country}</td>
                    <td style={{ padding: '10px 14px', color: '#374151', maxWidth: 200 }}>{s.university}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 4, padding: '3px 8px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {s.stage}. {stageName}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#6b7280' }}>{s.session}</td>
                    <td style={{ padding: '10px 14px', color: '#6b7280', fontStyle: s.agent ? 'normal' : 'italic' }}>{s.agent || '—'}</td>
                    <td style={{ padding: '10px 14px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="stu-btn stu-btn-sm" style={{ background: '#1d4ed8', color: '#fff' }}
                          onClick={() => { setSelected(s); setShowTimeline(true); }}>Timeline</button>
                        <button className="stu-btn stu-btn-sm stu-btn-secondary" onClick={() => alert("Action")}>Edit</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
