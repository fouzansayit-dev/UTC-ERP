import React, { useState, useEffect } from 'react';
import '../../student/Student.css';
import AbroadStudentTimeline from './AbroadStudentTimeline';
import ModuleGuide from '../../../components/ModuleGuide.jsx';

/* ─── 14 Stages ─────────────────────────────────────────────── */
export const STAGES = [
  { id: 1,  label: 'Enquiry & Programme Selection' },
  { id: 2,  label: 'Country & University Finalisation' },
  { id: 3,  label: 'Agent Linkage' },
  { id: 4,  label: 'Document Collection Checklist' },
  { id: 5,  label: 'Application to University' },
  { id: 6,  label: 'Provisional Admission / Invitation Letter' },
  { id: 7,  label: 'University Fee Remittance' },
  { id: 8,  label: 'Visa Application' },
  { id: 9,  label: 'Pre-Departure Checklist' },
  { id: 10, label: 'Departure' },
  { id: 11, label: 'On-Campus Monitoring' },
  { id: 12, label: 'Annual Return Visit' },
  { id: 13, label: 'NMC Internship (Final Year)' },
  { id: 14, label: 'Graduation & Alumni' },
];

const LIFECYCLE_STEPS = [
  { title: "Select Destination & University", desc: "Consult with the student, review criteria, select country (e.g. Russia, Georgia), and assign university." },
  { title: "Link Agent & Documents", desc: "Select the mediating agency and gather checklists (NEET scorecard, Passport, medical clearances)." },
  { title: "University Admission & Visa", desc: "Submit provisional requests, remit university fee, and track visa stamping progress." },
  { title: "Pre-departure & Campus Monitoring", desc: "Perform departure briefing, arrange ticketing, coordinate on-campus monitoring, and track graduation status." }
];
const LIFECYCLE_TIPS = [
  "Advance students to subsequent stages by clicking 'Advance →' in the actions column.",
  "Click 'Timeline' to inspect sub-details for documents, checklists, and counselor notes."
];

/* ─── Stage badge color ──────────────────────────────────────── */
function stageColor(stageId) {
  if (stageId <= 3)  return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
  if (stageId <= 6)  return { bg: '#fefce8', color: '#92400e', border: '#fde68a' };
  if (stageId <= 9)  return { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' };
  if (stageId <= 11) return { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' };
  if (stageId <= 13) return { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' };
  return { bg: '#f0fdf4', color: '#065f46', border: '#6ee7b7' };
}

export default function AbroadStudentLifecycle() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ country: 'All', stage: 'All', session: 'All', search: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const loadStudents = () => {
    setLoading(true);
    fetch('/api/generic/abroad/students')
      .then(res => res.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setStudents([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const setF = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const filtered = students.filter((s) => {
    if (filters.country !== 'All' && s.country !== filters.country) return false;
    if (filters.stage   !== 'All' && s.stage !== Number(filters.stage)) return false;
    if (filters.session !== 'All' && s.session !== filters.session) return false;
    if (filters.search && !(s.name || '').toLowerCase().includes(filters.search.toLowerCase()) &&
        !(s.rollNo || '').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const advanceStage = (studentId) => {
    const updated = students.map((s) => s.id === studentId && s.stage < 14 ? { ...s, stage: s.stage + 1 } : s);
    setStudents(updated);
    
    fetch('/api/generic/abroad/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    .catch(err => console.error("Error saving advanced stage:", err));
  };

  const openTimeline = (student) => {
    setSelectedStudent(student);
    setShowTimeline(true);
  };

  const saveTimelineChanges = (updatedStudent) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    fetch('/api/generic/abroad/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    .catch(err => console.error("Error saving timeline updates:", err));
  };

  if (showTimeline && selectedStudent) {
    return (
      <AbroadStudentTimeline
        student={selectedStudent}
        onBack={() => { setShowTimeline(false); setSelectedStudent(null); }}
        onAdvance={() => {
          const nextStage = selectedStudent.stage < 14 ? selectedStudent.stage + 1 : 14;
          const updatedStudent = { ...selectedStudent, stage: nextStage };
          setSelectedStudent(updatedStudent);
          saveTimelineChanges(updatedStudent);
        }}
      />
    );
  }

  return (
    <>
      <ModuleGuide title="Abroad Lifecycle Management Guide" steps={LIFECYCLE_STEPS} tips={LIFECYCLE_TIPS} />

      {/* ── Filter Card ── */}
      <div className="stu-filter-card" data-tour="lifecycle-filters">
        <div className="stu-filter-header">Abroad Student Lifecycle Management</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Search Name / Roll No</label>
              <input
                type="text"
                placeholder="Type to search..."
                value={filters.search}
                onChange={setF('search')}
              />
            </div>
            <div className="stu-field">
              <label>Country</label>
              <select value={filters.country} onChange={setF('country')}>
                <option value="All">All Countries</option>
                {['Russia','Philippines','Kazakhstan','Georgia','Kyrgyzstan','Bangladesh','Ukraine'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="stu-field">
              <label>Current Stage</label>
              <select value={filters.stage} onChange={setF('stage')}>
                <option value="All">All Stages</option>
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>Stage {s.id} — {s.label}</option>
                ))}
              </select>
            </div>
            <div className="stu-field">
              <label>Session</label>
              <select value={filters.session} onChange={setF('session')}>
                <option value="All">All Sessions</option>
                <option>2021-2022</option>
                <option>2022-2023</option>
                <option>2023-2024</option>
                <option>2024-2025</option>
                <option>2025-2026</option>
              </select>
            </div>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center', marginTop:4 }}>
            <span style={{ fontSize:12, color:'#6b7280' }}>
              {loading ? "Loading database..." : `${filtered.length} student(s) found`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="stu-table-wrap">
        <div className="stu-table-title">Abroad Student List — Lifecycle Tracker</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="stu-table" data-tour="lifecycle-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Country</th>
                <th>University</th>
                <th>Session</th>
                <th>Agent</th>
                <th>Current Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign:'center', color:'#9ca3af', padding:'36px', fontSize:13 }}>
                    {loading ? "Loading students..." : "No abroad students registered. Use the 'Add Abroad Student' submodule to enroll a student."}
                  </td>
                </tr>
              ) : filtered.map((s, i) => {
                const stageName = STAGES.find((st) => st.id === s.stage)?.label || '';
                const sc = stageColor(s.stage);
                return (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>{s.rollNo}</td>
                    <td style={{ fontWeight:600 }}>{s.name || '—'}</td>
                    <td>{s.country}</td>
                    <td style={{ fontSize:12, color:'#374151' }}>{s.university}</td>
                    <td>{s.session}</td>
                    <td style={{ fontSize:12, color: s.agent ? '#374151' : '#9ca3af' }}>{s.agent || '—'}</td>
                    <td>
                      <span style={{
                        display:'inline-flex', alignItems:'center', gap:5,
                        background: sc.bg, color: sc.color,
                        border:`1px solid ${sc.border}`,
                        borderRadius:20, padding:'3px 10px',
                        fontSize:11, fontWeight:600, whiteSpace:'nowrap'
                      }}>
                        <span style={{
                          background: sc.color, color:'#fff',
                          borderRadius:'50%', width:16, height:16,
                          display:'inline-flex', alignItems:'center',
                          justifyContent:'center', fontSize:10, fontWeight:700,
                          flexShrink:0
                        }}>{s.stage}</span>
                        {stageName}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button
                          className="stu-btn stu-btn-primary stu-btn-sm"
                          onClick={() => openTimeline(s)}
                        >
                          Timeline
                        </button>
                        {s.stage < 14 && (
                          <button
                            className="stu-btn stu-btn-success stu-btn-sm"
                            data-tour="advance-stage-btn"
                            onClick={() => advanceStage(s.id)}
                          >
                            Advance →
                          </button>
                        )}
                        {s.stage === 14 && (
                          <span style={{ fontSize:11, color:'#065f46', fontWeight:600 }}>✓ Alumni</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Stage Legend ── */}
      <div style={{
        marginTop:20, background:'#fff', border:'1px solid #e5e7eb',
        borderRadius:10, padding:'16px 20px',
        boxShadow:'0 1px 4px rgba(0,0,0,0.06)'
      }} data-tour="lifecycle-legend">
        <div style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:10 }}>Stage Legend</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 16px' }}>
          {STAGES.map((st) => {
            const sc = stageColor(st.id);
            return (
              <div key={st.id} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}>
                <span style={{
                  background: sc.bg, color: sc.color, border:`1px solid ${sc.border}`,
                  borderRadius:20, padding:'2px 8px', fontWeight:600
                }}>
                  {st.id}
                </span>
                <span style={{ color:'#6b7280' }}>{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
