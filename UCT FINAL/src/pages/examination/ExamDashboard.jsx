import React, { useState, useEffect } from 'react';

const ANIM_STYLES = `
  @keyframes examScaleIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes examCountUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .exam-kpi-card {
    opacity: 0;
    animation: examScaleIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;
    transition: transform 0.22s ease, box-shadow 0.22s ease !important;
  }
  .exam-kpi-card:hover {
    transform: translateY(-5px) scale(1.04) !important;
    box-shadow: 0 10px 28px rgba(0,0,0,0.14) !important;
    z-index: 2;
  }
`;

function useInjectExamStyles() {
  useEffect(() => {
    if (document.getElementById('exam-kpi-styles')) return;
    const el = document.createElement('style');
    el.id = 'exam-kpi-styles';
    el.textContent = ANIM_STYLES;
    document.head.appendChild(el);
  }, []);
}

const SEM_OPTS     = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];
const SESSION_OPTS = ['University Exam 2024','University Exam 2025','Supplementary 2024','Supplementary 2025','Internal Assessment 2025'];

/* Stat Card — matches HomeDashboard KpiCard exactly */
function StatCard({ label, value, color, index = 0 }) {
  return (
    <div
      className="exam-kpi-card"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}35`,
        borderRadius: 12,
        padding: '16px 18px',
        borderLeft: `4px solid ${color}`,
        cursor: 'pointer',
        animationDelay: `${index * 55}ms`,
        position: 'relative',
        overflow: 'hidden',
        minWidth: 150,
        flex: '1 1 150px',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, transparent 40%, ${color}08 60%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        fontSize: 28, fontWeight: 700, color,
        marginBottom: 4,
        letterSpacing: '0.02em',
        animation: `examCountUp 0.4s ease ${index * 55 + 200}ms both`,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>
        {label}
      </div>
    </div>
  );
}

export default function ExamDashboard() {
  useInjectExamStyles();
  /* Each section below accepts manual entries for demo purposes */
  const [session, setSession]   = useState('');
  const [semester, setSemester] = useState('');

  /* quick-entry counters */
  const [stats, setStats] = useState({
    sessions: 0, nominalRoll: 0, formsAccepted: 0,
    hallTickets: 0, resultsEntered: 0, fmgePass: 0, fmgeFail: 0,
    abroadUploads: 0,
  });
  const [entryForm, setEntryForm] = useState({
    sessions:'', nominalRoll:'', formsAccepted:'',
    hallTickets:'', resultsEntered:'', fmgePass:'', fmgeFail:'', abroadUploads:'',
  });
  const [msg, setMsg] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    setStats({
      sessions:      Number(entryForm.sessions)      || 0,
      nominalRoll:   Number(entryForm.nominalRoll)   || 0,
      formsAccepted: Number(entryForm.formsAccepted) || 0,
      hallTickets:   Number(entryForm.hallTickets)   || 0,
      resultsEntered:Number(entryForm.resultsEntered)|| 0,
      fmgePass:      Number(entryForm.fmgePass)      || 0,
      fmgeFail:      Number(entryForm.fmgeFail)      || 0,
      abroadUploads: Number(entryForm.abroadUploads) || 0,
    });
    setMsg('Dashboard updated.');
    setTimeout(() => setMsg(''), 3000);
  };

  const passRate = (stats.fmgePass + stats.fmgeFail) > 0
    ? Math.round((stats.fmgePass / (stats.fmgePass + stats.fmgeFail)) * 100)
    : 0;

  const ACTIVITY = [
    { label:'Exam Sessions Created',        value: stats.sessions,       color:'#6366f1' },
    { label:'Nominal Roll Students',         value: stats.nominalRoll,    color:'#0891b2' },
    { label:'Forms Accepted',                value: stats.formsAccepted,  color:'#059669' },
    { label:'Hall Tickets Issued',           value: stats.hallTickets,    color:'#d97706' },
    { label:'Result Records Entered',        value: stats.resultsEntered, color:'#7c3aed' },
    { label:'Abroad Result Uploads',         value: stats.abroadUploads,  color:'#be185d' },
    { label:'FMGE / NExT Pass',              value: stats.fmgePass,       color:'#16a34a' },
    { label:'FMGE / NExT Fail',              value: stats.fmgeFail,       color:'#dc2626' },
  ];

  const CHECKLIST = [
    { label:'Exam Session configured',     done: stats.sessions > 0 },
    { label:'Nominal Roll prepared',       done: stats.nominalRoll > 0 },
    { label:'Form Accept completed',       done: stats.formsAccepted > 0 },
    { label:'Hall Tickets issued',         done: stats.hallTickets > 0 },
    { label:'CCE / Practical marks entered', done: stats.resultsEntered > 0 },
    { label:'Theory marks entered',        done: stats.resultsEntered > 0 },
    { label:'Results published',           done: stats.resultsEntered > 0 },
    { label:'FMGE tracking updated',       done: (stats.fmgePass + stats.fmgeFail) > 0 },
  ];
  const doneCount = CHECKLIST.filter(c => c.done).length;

  return (
    <div className="exam-section">

      {/* Filter bar */}
      <div className="exam-card" style={{ padding:'12px 20px' }}>
        <div className="exam-row-flex" style={{ gap:12, alignItems:'flex-end', flexWrap:'wrap' }}>
          <div className="exam-field" style={{ minWidth:180 }}>
            <label>Session</label>
            <select value={session} onChange={e => setSession(e.target.value)}>
              <option value="">All Sessions</option>{SESSION_OPTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="exam-field" style={{ minWidth:150 }}>
            <label>Semester</label>
            <select value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="">All Semesters</option>{SEM_OPTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ fontSize:12, color:'#6b7280' }}>
            {session || semester
              ? `Showing: ${session || 'All Sessions'} · ${semester || 'All Semesters'}`
              : 'Showing all sessions & semesters'}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:14 }}>
        {ACTIVITY.map((a, i) => <StatCard key={a.label} label={a.label} value={a.value} color={a.color} index={i} />)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {/* FMGE summary */}
        <div className="exam-card">
          <div className="exam-card-title">FMGE / NExT Summary</div>
          {(stats.fmgePass + stats.fmgeFail) === 0
            ? <div className="exam-alert info">No FMGE/NExT data. Update dashboard stats below.</div>
            : (
              <>
                <div style={{ display:'flex', gap:20, marginBottom:14 }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:32, fontWeight:700, color:'#16a34a' }}>{passRate}%</div>
                    <div style={{ fontSize:11, color:'#6b7280' }}>Pass Rate</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:4, marginBottom:6 }}>
                      <div style={{ height:14, borderRadius:6, background:'#16a34a', width:`${passRate}%`, minWidth:4, transition:'width 0.4s' }} />
                      <div style={{ height:14, borderRadius:6, background:'#dc2626', flex:1 }} />
                    </div>
                    <div style={{ fontSize:12, color:'#6b7280' }}>Pass: {stats.fmgePass} &nbsp; Fail: {stats.fmgeFail}</div>
                  </div>
                </div>
              </>
            )
          }
        </div>

        {/* Process checklist */}
        <div className="exam-card">
          <div className="exam-card-title">Exam Process Checklist ({doneCount}/{CHECKLIST.length})</div>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {CHECKLIST.map((c,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
                <span style={{ width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: c.done ? '#dcfce7' : '#f3f4f6', color: c.done ? '#166534' : '#9ca3af', fontSize:11, fontWeight:700, flexShrink:0 }}>
                  {c.done ? '✓' : '○'}
                </span>
                <span style={{ color: c.done ? '#111827' : '#9ca3af', textDecoration: c.done ? 'none' : 'none' }}>{c.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, background:'#f5f3ff', borderRadius:6, height:6 }}>
            <div style={{ height:6, borderRadius:6, background:'#6366f1', width:`${Math.round((doneCount/CHECKLIST.length)*100)}%`, transition:'width 0.4s' }} />
          </div>
          <div className="exam-meta" style={{ marginTop:6 }}>{Math.round((doneCount/CHECKLIST.length)*100)}% complete</div>
        </div>
      </div>

      {/* Manual stats update */}
      <div className="exam-card">
        <div className="exam-card-title">Update Dashboard Stats</div>
        <p className="exam-hint" style={{ marginBottom:14 }}>Enter current counts from each examination submodule to reflect live status on this dashboard.</p>
        {msg && <div className="exam-alert success">{msg}</div>}
        <form onSubmit={handleUpdate} className="exam-form-grid">
          {[
            ['sessions',       'Exam Sessions'],
            ['nominalRoll',    'Nominal Roll Students'],
            ['formsAccepted',  'Forms Accepted'],
            ['hallTickets',    'Hall Tickets Issued'],
            ['resultsEntered', 'Result Records'],
            ['abroadUploads',  'Abroad Uploads'],
            ['fmgePass',       'FMGE / NExT Pass'],
            ['fmgeFail',       'FMGE / NExT Fail'],
          ].map(([key, label]) => (
            <div key={key} className="exam-field">
              <label>{label}</label>
              <input type="number" min={0} value={entryForm[key]} onChange={e => setEntryForm({...entryForm,[key]:e.target.value})} placeholder="0" />
            </div>
          ))}
          <div className="exam-actions">
            <button type="submit" className="exam-btn primary">Update Dashboard</button>
            <button type="button" className="exam-btn secondary" onClick={() => setEntryForm({sessions:'',nominalRoll:'',formsAccepted:'',hallTickets:'',resultsEntered:'',fmgePass:'',fmgeFail:'',abroadUploads:''})}>Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}
