import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

/* ─── Global keyframe styles injected once ─── */
const ANIM_STYLES = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes rowSlide {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .kpi-card {
    opacity: 0;
    animation: scaleIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;
    transition: transform 0.22s ease, box-shadow 0.22s ease !important;
  }
  .kpi-card:hover {
    transform: translateY(-5px) scale(1.04) !important;
    box-shadow: 0 10px 28px rgba(0,0,0,0.14) !important;
    z-index: 2;
  }
  .section-anim {
    opacity: 0;
    animation: fadeSlideUp 0.5s ease forwards;
  }
  .chart-card {
    opacity: 0;
    animation: fadeSlideUp 0.55s ease forwards;
    transition: box-shadow 0.22s ease, transform 0.22s ease;
  }
  .chart-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.13) !important;
    transform: translateY(-3px);
  }
  .uni-card {
    opacity: 0;
    animation: scaleIn 0.45s ease forwards;
  }
  .animated-row {
    opacity: 0;
    animation: rowSlide 0.35s ease forwards;
  }
  .animated-row:hover {
    background: #f0f7ff !important;
  }
  .enquiry-wrap {
    opacity: 0;
    animation: fadeSlideUp 0.5s ease forwards;
  }
  .search-input:focus {
    border-color: #4361ee !important;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.15) !important;
    outline: none !important;
  }
  .uni-select:focus {
    border-color: #4361ee !important;
    box-shadow: 0 0 0 3px rgba(0,110,255,0.15) !important;
    outline: none;
  }
  .panel-card {
    opacity: 0;
    animation: fadeSlideUp 0.5s ease forwards;
    transition: box-shadow 0.22s ease, transform 0.22s ease;
  }
  .panel-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.13) !important;
    transform: translateY(-2px);
  }
  @keyframes scannerLaser {
    0% { top: 0%; opacity: 0.8; }
    50% { top: 100%; opacity: 0.8; }
    100% { top: 0%; opacity: 0.8; }
  }
  @keyframes scanPulse {
    0% { opacity: 0.4; }
    50% { opacity: 0.7; }
    100% { opacity: 0.4; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function useInjectStyles() {
  useEffect(() => {
    if (document.getElementById('hd-anim-styles')) return;
    const el = document.createElement('style');
    el.id = 'hd-anim-styles';
    el.textContent = ANIM_STYLES;
    document.head.appendChild(el);
  }, []);
}

/* ─── Section title ─── */
const SectionTitle = ({ title, delay = 0 }) => (
  <div className="section-anim" style={{ animationDelay: `${delay}ms` }}>
    <div className="section-title">{title}</div>
  </div>
);

const ACADEMIC_KPIS = [
  { label: 'Registered Students',    color: '#0d5ef4' },
  { label: 'Active Students',         color: '#16a34a' },
  { label: 'New Students',            color: '#0891b2' },
  { label: 'Old Students',            color: '#7c3aed' },
];

const STAFF_KPIS = [
  { label: 'Registered Employees',    color: '#f59e0b' },
  { label: 'Total Faculty',           color: '#ef4444' },
  { label: 'Departments',             color: '#7c3aed' },
];

const ATTENDANCE_KPIS = [
  { label: 'Today Present Students',  color: '#16a34a' },
  { label: 'Today Absent Students',   color: '#dc2626' },
  { label: 'Today Present Employee',  color: '#0d5ef4' },
  { label: 'Today Absent Employee',   color: '#f59e0b' },
  { label: 'Active Rotations',        color: '#7c3aed' },
];

const FINANCE_KPIS = [
  { label: 'Fee Collected',           color: '#16a34a' },
  { label: 'Pending Fees',            color: '#dc2626' },
];

const LAST7_DATA = [
  { day: 'Day 1', date: '12 Mar', amount: 0 },
  { day: 'Day 2', date: '13 Mar', amount: 0 },
  { day: 'Day 3', date: '14 Mar', amount: 0 },
  { day: 'Day 4', date: '15 Mar', amount: 0 },
  { day: 'Day 5', date: '16 Mar', amount: 0 },
  { day: 'Day 6', date: '17 Mar', amount: 0 },
  { day: 'Day 7', date: '18 Mar', amount: 0 },
];

const TODAY_COLLECTION = [
  { label: 'Cash',   amount: 0 },
  { label: 'Online', amount: 0 },
  { label: 'Cheque', amount: 0 },
  { label: 'DD',     amount: 0 },
];

const KPI_ICONS = {
  'Registered Students': "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8-2a4 4 0 00-4-4h-.18a4.93 4.93 0 010 8H13a4 4 0 004-4z",
  'Active Students': "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  'New Students': "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  'Old Students': "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  'Total Faculty': "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  'Registered Employees': "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  'Today Present Students': "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  'Today Absent Students': "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
  'Today Present Employee': "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  'Today Absent Employee': "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
  'Departments': "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  'Pending Fees': "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  'Fee Collected': "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  'Active Rotations': "M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15.89M21 21v-5h-5.281"
};

/* ─── Animated KPI Card ─── */
function KpiCard({ kpi, index, value }) {
  const path = KPI_ICONS[kpi.label] || "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
  return (
    <div
      className="kpi-card"
      style={{
        background: 'var(--white)',
        border: '1px solid var(--gray2)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        boxShadow: 'var(--shadow-premium)',
        cursor: 'pointer',
        animationDelay: `${index * 40}ms`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{kpi.label}</span>
        <span style={{
          fontSize: 18, fontWeight: 800, color: 'var(--black)',
          fontFamily: 'var(--font-ui)',
          animation: `countUp 0.4s ease ${index * 40 + 150}ms both`,
        }}>
          {value}
        </span>
      </div>
      <div style={{
        width: 38, height: 38, borderRadius: 'var(--radius-md)',
        background: `${kpi.color}12`, color: kpi.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
      </div>
    </div>
  );
}

/* ─── Enquiry Search ─── */
function EnquirySearch() {
  const [filters, setFilters] = React.useState({
    course: 'All', branchName: '', batch: '',
    searchBy: 'Application Id', searchValue: '',
  });
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 4 };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#6b7280' };
  const inputStyle = {
    padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6,
    fontSize: 13, color: '#374151', background: '#fff', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div className="enquiry-wrap" style={{
      border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px',
      background: '#fff', marginBottom: 24, animationDelay: '600ms',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px 32px', alignItems: 'end' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Course</label>
          <select value={filters.course} onChange={set('course')} className="search-input" style={inputStyle}>
            <option value="All">All</option>
            <option>MBBS - Domestic</option><option>MBBS - Abroad</option>
            <option>MD</option><option>BDS</option>
          </select>
        </div>
        <div />
        <div style={fieldStyle}>
          <label style={labelStyle}>Branch Name</label>
          <select value={filters.branchName} onChange={set('branchName')} className="search-input" style={inputStyle}>
            <option value="">Select Branch</option>
            <option>Main Campus</option><option>North Branch</option><option>South Branch</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Batch</label>
          <select value={filters.batch} onChange={set('batch')} className="search-input" style={inputStyle}>
            <option value="">Select Batch</option>
            <option>2023-24</option><option>2024-25</option><option>2025-26</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>&nbsp;</label>
          <select value={filters.searchBy} onChange={set('searchBy')} className="search-input" style={inputStyle}>
            <option>Application Id</option><option>Student Name</option>
            <option>Mobile</option><option>Email</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>&nbsp;</label>
          <input
            value={filters.searchValue} onChange={set('searchValue')}
            placeholder={`Enter ${filters.searchBy}`}
            className="search-input" style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── University Details ─── */
const UNIVERSITIES = [
  { name: 'UNIVERSIDADE CATOLICA TIMORENSE', iYear:{m:0,f:0}, iiYear:{m:0,f:0}, iiiYear:{m:0,f:0}, ivYear:{m:0,f:0}, vYear:{m:0,f:0} },
  { name: 'SAMPLE UNIVERSITY 2',             iYear:{m:0,f:0}, iiYear:{m:0,f:0}, iiiYear:{m:0,f:0}, ivYear:{m:0,f:0}, vYear:{m:0,f:0} },
];

const uniHeaderStyle = {
  background: 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)',
  color: '#fff', fontWeight: 700, padding: '12px 18px', fontSize: 14,
  borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 8,
};

const groupTh = (extra = {}) => ({
  background: '#4361ee', color: '#fff', padding: '8px 14px', textAlign: 'center',
  fontWeight: 700, fontSize: 12, border: '1px solid #3a0ca3', whiteSpace: 'nowrap', ...extra,
});
const td = (extra = {}) => ({
  padding: '8px 14px', textAlign: 'center', border: '1px solid #e2e8f0',
  color: '#374151', fontSize: 13, ...extra,
});
const totalTd = (extra = {}) => ({
  ...td(), color: '#dc2626', fontWeight: 700, background: '#fff8f8', ...extra,
});
const labelTd = (extra = {}) => ({
  ...td(), fontWeight: 600, color: '#1e293b', background: '#f8faff',
  textAlign: 'left', paddingLeft: 18, ...extra,
});
const totalLabelTd = (extra = {}) => ({
  ...labelTd(), color: '#dc2626', background: '#fff5f5', ...extra,
});

const emptyTh  = groupTh({ background: '#3651c9', opacity: 0.4, border: '1px solid #2d45b0' });
const emptyTd  = td({ background: '#f0f3fa', borderColor: '#dde3f0' });
const emptyTdF = td({ background: '#eef0f8', borderColor: '#dde3f0' });
const emptyTdT = td({ background: '#fff0f0', borderColor: '#fdd' });

const MAX_COLS = 5;

function UniversityCard({ uni }) {
  const { name, iYear, iiYear, iiiYear, ivYear, vYear } = uni;
  const zero = { m: 0, f: 0 };

  const tracks = [
    {
      label: 'Track 1 — Full Programme',
      cols: [
        { header: 'I-Year',   data: iYear,   colIndex: 0 },
        { header: 'II-Year',  data: iiYear,  colIndex: 1 },
        { header: 'III-Year', data: iiiYear, colIndex: 2 },
        { header: 'IV-Year',  data: ivYear,  colIndex: 3 },
        { header: 'V-Year',   data: vYear,   colIndex: 4 },
      ],
    },
    {
      label: 'Track 2 — II Year',
      cols: [
        { header: 'II-Year',  data: iiYear,  colIndex: 1 },
        { header: 'III-SEM',  data: zero,    colIndex: 2 },
        { header: 'IV-SEM',   data: zero,    colIndex: 3 },
      ],
    },
    {
      label: 'Track 3 — III Year',
      cols: [
        { header: 'III-Year', data: iiiYear, colIndex: 2 },
        { header: 'V-SEM',    data: zero,    colIndex: 3 },
        { header: 'VI-SEM',   data: zero,    colIndex: 4 },
      ],
    },
    {
      label: 'Track 4 — IV Year',
      cols: [
        { header: 'VII-SEM',  data: zero,    colIndex: 2 },
        { header: 'VIII-SEM', data: zero,    colIndex: 3 },
      ],
    },
    {
      label: 'Track 5 — Final Year',
      cols: [
        { header: 'V-Year',   data: vYear,   colIndex: 4 },
      ],
    },
  ];

  return (
    <div className="uni-card" style={{
      border: '1px solid #c7d0ee', borderRadius: 10, marginBottom: 24,
      overflow: 'hidden', boxShadow: '0 4px 16px rgba(67,97,238,0.1)',
    }}>
      <div style={uniHeaderStyle}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.85 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3h8"/>
        </svg>
        <span style={{ opacity: 0.8, fontWeight: 400, fontSize: 13 }}>University Name :</span>
        <span style={{ fontSize: 14 }}>{name}</span>
      </div>

      <div style={{ background: '#f8faff', padding: '20px 20px 8px' }}>
        {tracks.map((track, ti) => {
          const cols = track.cols;
          const mTot = cols.reduce((a, c) => a + c.data.m, 0);
          const fTot = cols.reduce((a, c) => a + c.data.f, 0);
          const tTot = cols.reduce((a, c) => a + c.data.m + c.data.f, 0);
          const rightFill = 0;

          return (
            <div key={ti} style={{ marginBottom: 16 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: '#eef0fd', border: '1px solid #c7d0ee',
                borderRadius: 5, padding: '3px 10px', marginBottom: 6,
                fontSize: 12, fontWeight: 700, color: '#4361ee', letterSpacing: '0.04em',
              }}>
                {track.label}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '18%' }} />
                  {Array.from({ length: MAX_COLS }).map((_, i) => (
                    <col key={i} style={{ width: `${64 / MAX_COLS}%` }} />
                  ))}
                  <col style={{ width: '18%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={groupTh({ textAlign: 'left', paddingLeft: 18 })}>MBBS</th>
                    {cols.map((c) => (
                      <th key={c.header} style={groupTh()}>{c.header}</th>
                    ))}
                    {rightFill > 0 && (
                      <th colSpan={rightFill} style={emptyTh}></th>
                    )}
                    <th style={groupTh()}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="animated-row" style={{ animationDelay: `${ti * 80}ms` }}>
                    <td style={labelTd()}>Male</td>
                    {cols.map((c, i) => <td key={i} style={td()}>{c.data.m}</td>)}
                    {rightFill > 0 && <td colSpan={rightFill} style={emptyTd}></td>}
                    <td style={td({ fontWeight: 600, color: '#1e293b' })}>{mTot}</td>
                  </tr>
                  <tr className="animated-row" style={{ animationDelay: `${ti * 80 + 50}ms` }}>
                    <td style={labelTd({ background: '#fafcff' })}>Female</td>
                    {cols.map((c, i) => <td key={i} style={td({ background: '#fafcff' })}>{c.data.f}</td>)}
                    {rightFill > 0 && <td colSpan={rightFill} style={emptyTdF}></td>}
                    <td style={td({ fontWeight: 600, color: '#1e293b', background: '#fafcff' })}>{fTot}</td>
                  </tr>
                  <tr className="animated-row" style={{ animationDelay: `${ti * 80 + 100}ms` }}>
                    <td style={totalLabelTd()}>Total</td>
                    {cols.map((c, i) => <td key={i} style={totalTd()}>{c.data.m + c.data.f}</td>)}
                    {rightFill > 0 && <td colSpan={rightFill} style={emptyTdT}></td>}
                    <td style={totalTd({ fontSize: 14 })}>{tTot}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UniversityDetails() {
  const [selected, setSelected] = useState(UNIVERSITIES[0].name);
  const uni = UNIVERSITIES.find((u) => u.name === selected) || UNIVERSITIES[0];
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginRight: 8 }}>Select University:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="uni-select"
          style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, outline: 'none' }}
        >
          {UNIVERSITIES.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
        </select>
      </div>
      <UniversityCard uni={uni} />
    </div>
  );
}

/* ─── Today's Collection table ─── */
function TodayCollectionTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ background: '#e5e7eb', padding: '8px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', border: '1px solid #d1d5db' }}>Payment Mode</th>
          <th style={{ background: '#e5e7eb', padding: '8px 14px', textAlign: 'right', fontWeight: 600, color: '#374151', border: '1px solid #d1d5db' }}>Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {TODAY_COLLECTION.map((row, i) => (
          <tr key={row.label} className="animated-row" style={{ animationDelay: `${300 + i * 70}ms` }}>
            <td style={{ padding: '8px 14px', border: '1px solid #e5e7eb', color: '#374151' }}>{row.label}</td>
            <td style={{ padding: '8px 14px', border: '1px solid #e5e7eb', color: '#374151', textAlign: 'right' }}>
              {row.amount.toLocaleString('en-IN')}
            </td>
          </tr>
        ))}
        <tr className="animated-row" style={{ animationDelay: `${300 + TODAY_COLLECTION.length * 70}ms` }}>
          <td style={{ padding: '8px 14px', border: '1px solid #e5e7eb', fontWeight: 700, color: '#1f2937', background: '#f9fafb' }}>Total</td>
          <td style={{ padding: '8px 14px', border: '1px solid #e5e7eb', fontWeight: 700, color: '#16a34a', textAlign: 'right', background: '#f9fafb' }}>
            {TODAY_COLLECTION.reduce((s, r) => s + r.amount, 0).toLocaleString('en-IN')}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/* ═══════════════════════════════════════════
   NEW PANEL 1 — Visa Status Summary
═══════════════════════════════════════════ */
const VISA_STATUS_DATA = [
  { label: 'Active Visa',      count: 0, color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
  { label: 'Renewal Due',      count: 0, color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
  { label: 'Expired',          count: 0, color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  { label: 'Pending Apply',    count: 0, color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
];

function VisaStatusPanel({ delay = 0 }) {
  return (
    <div className="panel-card" style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      animationDelay: `${delay}ms`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4361ee" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5M16 4v5"/>
        </svg>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Visa Status Summary</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {VISA_STATUS_DATA.map((item) => (
          <div key={item.label} style={{
            background: item.bg, border: `1px solid ${item.border}`,
            borderRadius: 8, padding: '14px 16px',
            borderLeft: `4px solid ${item.color}`,
          }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: item.color, marginBottom: 4 }}>
              {item.count}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{item.label}</div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

/* ═══════════════════════════════════════════
   NEW PANEL 2 — Abroad Student Status
═══════════════════════════════════════════ */
const ABROAD_COUNTRIES = [
  { country: 'Russia',      students: 0, universities: 'KSMU, PSMU', flag: '🇷🇺' },
  { country: 'Philippines', students: 0, universities: 'UV Gullas, AMA',  flag: '🇵🇭' },
  { country: 'Kazakhstan',  students: 0, universities: 'KazNMU, KAZNMU',  flag: '🇰🇿' },
  { country: 'Georgia',     students: 0, universities: 'TSMU, AKAKI',     flag: '🇬🇪' },
  { country: 'Kyrgyzstan',  students: 0, universities: 'KRSU, KSMA',      flag: '🇰🇬' },
];

function AbroadStudentPanel({ delay = 0 }) {
  return (
    <div className="panel-card" style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      animationDelay: `${delay}ms`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4361ee" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
        </svg>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Abroad Student Status</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 12, borderRadius: '4px 0 0 0' }}>Country</th>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'center', fontWeight: 600, fontSize: 12 }}>Students</th>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 12, borderRadius: '0 4px 0 0' }}>Universities</th>
          </tr>
        </thead>
        <tbody>
          {ABROAD_COUNTRIES.map((row, i) => (
            <tr key={row.country} className="animated-row" style={{
              animationDelay: `${delay + i * 60}ms`,
              background: i % 2 === 0 ? '#fff' : '#f8faff',
            }}>
              <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', color: '#1e293b', fontWeight: 500 }}>
                <span style={{ marginRight: 6 }}>{row.flag}</span>{row.country}
              </td>
              <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', textAlign: 'center', color: '#4361ee', fontWeight: 700 }}>
                {row.students}
              </td>
              <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', color: '#6b7280', fontSize: 12 }}>
                {row.universities}
              </td>
            </tr>
          ))}
          <tr style={{ background: '#eef0fd' }}>
            <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', fontWeight: 700, color: '#1e293b' }}>Total</td>
            <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', textAlign: 'center', fontWeight: 700, color: '#4361ee' }}>
              {ABROAD_COUNTRIES.reduce((s, r) => s + r.students, 0)}
            </td>
            <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb' }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NEW PANEL 3 — Agent Performance
═══════════════════════════════════════════ */
const AGENT_DATA = [
  { name: 'Agent 1', referrals: 0, converted: 0, commissionPending: 0 },
  { name: 'Agent 2', referrals: 0, converted: 0, commissionPending: 0 },
  { name: 'Agent 3', referrals: 0, converted: 0, commissionPending: 0 },
  { name: 'Agent 4', referrals: 0, converted: 0, commissionPending: 0 },
  { name: 'Agent 5', referrals: 0, converted: 0, commissionPending: 0 },
];

function AgentPerformancePanel({ delay = 0 }) {
  return (
    <div className="panel-card" style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      animationDelay: `${delay}ms`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4361ee" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Agent Performance</span>
        </div>
        <span style={{ fontSize: 11, color: '#9ca3af', background: '#f3f4f6', padding: '3px 8px', borderRadius: 12 }}>This Month</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Agent</th>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'center', fontWeight: 600, fontSize: 12 }}>Referrals</th>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'center', fontWeight: 600, fontSize: 12 }}>Converted</th>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'right', fontWeight: 600, fontSize: 12 }}>Commission Pending (₹)</th>
          </tr>
        </thead>
        <tbody>
          {AGENT_DATA.map((row, i) => {
            const rate = row.referrals > 0 ? Math.round((row.converted / row.referrals) * 100) : 0;
            return (
              <tr key={row.name} className="animated-row" style={{
                animationDelay: `${delay + i * 60}ms`,
                background: i % 2 === 0 ? '#fff' : '#f8faff',
              }}>
                <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', color: '#1e293b', fontWeight: 500 }}>{row.name}</td>
                <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', textAlign: 'center', color: '#374151' }}>{row.referrals}</td>
                <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>{row.converted}</span>
                  <span style={{ color: '#9ca3af', fontSize: 11, marginLeft: 4 }}>({rate}%)</span>
                </td>
                <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', textAlign: 'right', color: row.commissionPending > 0 ? '#dc2626' : '#374151', fontWeight: row.commissionPending > 0 ? 600 : 400 }}>
                  ₹{row.commissionPending.toLocaleString('en-IN')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NEW PANEL 4 — Forex Remittance Tracker
═══════════════════════════════════════════ */
const FOREX_DATA = [
  { country: 'Russia',      currency: 'RUB', sent: 0, pending: 0, rate: 0 },
  { country: 'Philippines', currency: 'PHP', sent: 0, pending: 0, rate: 0 },
  { country: 'Kazakhstan',  currency: 'KZT', sent: 0, pending: 0, rate: 0 },
  { country: 'Georgia',     currency: 'GEL', sent: 0, pending: 0, rate: 0 },
  { country: 'Kyrgyzstan',  currency: 'KGS', sent: 0, pending: 0, rate: 0 },
];

function ForexRemittancePanel({ delay = 0 }) {
  const totalSent    = FOREX_DATA.reduce((s, r) => s + r.sent, 0);
  const totalPending = FOREX_DATA.reduce((s, r) => s + r.pending, 0);

  return (
    <div className="panel-card" style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      animationDelay: `${delay}ms`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4361ee" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M15 9.5c-.83-1.17-2.12-1.5-3-1.5-2.21 0-4 1.79-4 4s1.79 4 4 4c.88 0 2.17-.33 3-1.5M9 12h7.5"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Forex Remittance Tracker</span>
        </div>
        <span style={{ fontSize: 11, color: '#9ca3af', background: '#f3f4f6', padding: '3px 8px', borderRadius: 12 }}>This Month (USD)</span>
      </div>

      {/* Summary strips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px' }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Total Sent</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#16a34a' }}>${totalSent.toLocaleString()}</div>
        </div>
        <div style={{ background: '#fef9ec', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px' }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Pending</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#d97706' }}>${totalPending.toLocaleString()}</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Country</th>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'center', fontWeight: 600, fontSize: 12 }}>Currency</th>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'right', fontWeight: 600, fontSize: 12 }}>Sent (USD)</th>
            <th style={{ background: '#4361ee', color: '#fff', padding: '8px 12px', textAlign: 'right', fontWeight: 600, fontSize: 12 }}>Pending (USD)</th>
          </tr>
        </thead>
        <tbody>
          {FOREX_DATA.map((row, i) => (
            <tr key={row.country} className="animated-row" style={{
              animationDelay: `${delay + i * 60}ms`,
              background: i % 2 === 0 ? '#fff' : '#f8faff',
            }}>
              <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', color: '#1e293b', fontWeight: 500 }}>{row.country}</td>
              <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <span style={{ background: '#eef0fd', color: '#4361ee', fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 10 }}>{row.currency}</span>
              </td>
              <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', textAlign: 'right', color: '#16a34a', fontWeight: 500 }}>
                ${row.sent.toLocaleString()}
              </td>
              <td style={{ padding: '9px 12px', border: '1px solid #e5e7eb', textAlign: 'right', color: row.pending > 0 ? '#d97706' : '#9ca3af' }}>
                ${row.pending.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StudentDashboardView({ user, navigateTo }) {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Anatomy");
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = (isInitial = false) => {
    if (isInitial) setLoading(true);
    
    const p1 = fetch('/api/students').then(res => res.json());
    const p2 = fetch('/api/fees').then(res => res.json());
    const p3 = fetch('/api/generic/student-attendance/records').then(res => res.json());

    Promise.all([p1, p2, p3])
      .then(([studentData, feeData, attendanceData]) => {
        if (studentData && studentData.length > 0) {
          setStudent(studentData[0]);
        }
        setFees(Array.isArray(feeData) ? feeData : []);
        setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching student details:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(true);
    const handleUpdate = () => fetchData(false);
    window.addEventListener('uct_data_update', handleUpdate);
    return () => window.removeEventListener('uct_data_update', handleUpdate);
  }, []);

  const handleScanQR = () => {
    if (!student) return;
    setScanning(true);
    setMessage("");

    const todayStr = new Date().toISOString().split('T')[0];
    const qrValue = `${student.course}|${student.branch}|${student.batch}|${selectedSubject}|${todayStr}`;

    setTimeout(() => {
      fetch('/api/students/scan-attendance-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrValue })
      })
        .then(res => res.json())
        .then(data => {
          setScanning(false);
          if (data.success) {
            setScanSuccess(true);
            setTimeout(() => {
              setScanSuccess(false);
              setScannerOpen(false);
              fetchData();
            }, 1800);
          } else {
            setMessage(data.error || "Failed to scan classroom QR.");
          }
        })
        .catch(err => {
          setScanning(false);
          setMessage("Network error. Please try again.");
          console.error(err);
        });
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 12 }}>
        <div style={{ width: 24, height: 24, border: '3px solid #eef0fd', borderTopColor: '#4361ee', borderRadius: '50%', animation: 'spin 1s infinite linear' }} />
        <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--muted)' }}>Loading Student Dashboard...</span>
      </div>
    );
  }

  const dueFee = student?.due_fee || 0;
  const paidFee = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalFee = dueFee + paidFee;
  const feeProgress = totalFee > 0 ? Math.round((paidFee / totalFee) * 100) : 0;

  let present = 0;
  let absent = 0;
  let leave = 0;
  attendance.forEach(session => {
    if (session.records && session.records.length > 0) {
      const status = session.records[0].status;
      if (status === 'P') present++;
      else if (status === 'A') absent++;
      else if (status === 'L') leave++;
    }
  });

  const totalClasses = present + absent + leave;
  const attendancePct = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;

  const chartData = [
    { name: 'Present', value: present, color: '#22c55e' },
    { name: 'Absent', value: absent, color: '#ef4444' },
    { name: 'Leave', value: leave, color: '#eab308' }
  ].filter(d => d.value > 0);

  const defaultChartData = [
    { name: 'No Classes Recorded', value: 1, color: '#e2e8f0' }
  ];

  return (
    <div style={{ animation: 'fadeSlideUp 0.4s ease' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: '#fff',
        borderRadius: 12,
        padding: '24px 28px',
        boxShadow: 'var(--shadow-premium)',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px 0' }}>Welcome back, {student?.name}! 👋</h2>
          <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>
            Scholar ID: <strong style={{ color: '#fcd34d' }}>{student?.scholar_no}</strong> | 
            Course: <strong>{student?.course} ({student?.branch})</strong> | 
            Batch: <strong>{student?.batch}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => { if(navigateTo) navigateTo('student', 'stu-edit', 'My Profile'); }}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            My Profile Details
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 28 }}>
        <div style={{
          background: '#fff',
          border: '1px solid var(--gray2)',
          borderRadius: 12,
          padding: '20px 24px',
          boxShadow: 'var(--shadow-premium)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Fee Ledger Status</span>
              <span style={{ fontSize: 12, background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: 12, fontWeight: 600 }}>Semester Fee</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 14px' }}>
                <span style={{ fontSize: 11, color: '#16a34a', display: 'block', marginBottom: 4 }}>Paid Fees</span>
                <strong style={{ fontSize: 18, color: '#15803d' }}>₹{paidFee.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ background: dueFee > 0 ? '#fef2f2' : '#f0fdf4', border: dueFee > 0 ? '1px solid #fecaca' : '1px solid #bbf7d0', borderRadius: 8, padding: '12px 14px' }}>
                <span style={{ fontSize: 11, color: dueFee > 0 ? '#dc2626' : '#16a34a', display: 'block', marginBottom: 4 }}>Remaining Due</span>
                <strong style={{ fontSize: 18, color: dueFee > 0 ? '#b91c1c' : '#15803d' }}>₹{dueFee.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#4b5563', marginBottom: 6 }}>
                <span>Payment Progress</span>
                <strong>{feeProgress}% Paid</strong>
              </div>
              <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${feeProgress}%`, background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: 4 }} />
              </div>
            </div>
          </div>

          <button
            onClick={() => { if(navigateTo) navigateTo('fee-management', 'fmgmt-ledger', 'Fee Ledger'); }}
            style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              border: 'none',
              borderRadius: 8,
              padding: '10px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
              marginTop: 10,
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
            onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
          >
            View Detailed Fee Receipts
          </button>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid var(--gray2)',
          borderRadius: 12,
          padding: '20px 24px',
          boxShadow: 'var(--shadow-premium)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Attendance Summary</span>
              <span style={{
                fontSize: 12,
                background: attendancePct >= 75 ? '#e6f4ea' : '#fce8e6',
                color: attendancePct >= 75 ? '#137333' : '#c5221f',
                padding: '3px 8px',
                borderRadius: 12,
                fontWeight: 600
              }}>
                {attendancePct}% Rate
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 130, height: 130, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.length > 0 ? chartData : defaultChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {(chartData.length > 0 ? chartData : defaultChartData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{present}</span>
                  <span style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase' }}>Present</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid #f1f5f9', paddingBottom: 4 }}>
                  <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /> Present
                  </span>
                  <strong style={{ color: '#1e293b' }}>{present} Days</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid #f1f5f9', paddingBottom: 4 }}>
                  <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Absent
                  </span>
                  <strong style={{ color: '#1e293b' }}>{absent} Days</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} /> Leave
                  </span>
                  <strong style={{ color: '#1e293b' }}>{leave} Days</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 12, padding: '6px', background: '#f8fafc', borderRadius: 6 }}>
            {attendancePct >= 75 ? "🎉 You meet the minimum academic criteria of 75%." : "⚠️ Warning: Attendance is below target (75%)."}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 28 }}>
        <div style={{
          background: '#fff',
          border: '1px solid var(--gray2)',
          borderRadius: 12,
          padding: '24px',
          boxShadow: 'var(--shadow-premium)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          {!scannerOpen ? (
            <>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#eff6ff', color: '#2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16
              }}>
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>Classroom QR Attendance Scanner</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px 0', maxWidth: 320 }}>
                Scan the classroom QR code generated by the lecture room projector to mark your attendance automatically.
              </p>
              <button
                onClick={() => setScannerOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                }}
              >
                Open Camera Scanner
              </button>
            </>
          ) : (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Scan Classroom QR</span>
                <button 
                  onClick={() => { setScannerOpen(false); setMessage(""); }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>

              <div style={{
                position: 'relative', width: 220, height: 220,
                border: '2px solid rgba(22,163,74,0.3)', borderRadius: 12,
                overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                background: '#111', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 16
              }}>
                {scanning && (
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 3,
                    background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                    boxShadow: '0 0 10px #22c55e',
                    animation: 'scannerLaser 2s infinite linear',
                  }} />
                )}

                <div style={{
                  position: 'absolute', inset: 30, border: '1px dashed rgba(255,255,255,0.15)',
                  borderRadius: 8, animation: scanning ? 'scanPulse 1.5s infinite ease' : 'none'
                }} />

                <div style={{ position: 'absolute', top: 12, left: 12, width: 16, height: 16, borderTop: '3px solid #22c55e', borderLeft: '3px solid #22c55e' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderTop: '3px solid #22c55e', borderRight: '3px solid #22c55e' }} />
                <div style={{ position: 'absolute', bottom: 12, left: 12, width: 16, height: 16, borderBottom: '3px solid #22c55e', borderLeft: '3px solid #22c55e' }} />
                <div style={{ position: 'absolute', bottom: 12, right: 12, width: 16, height: 16, borderBottom: '3px solid #22c55e', borderRight: '3px solid #22c55e' }} />

                {scanSuccess && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(34,197,94,0.95)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '13px', fontWeight: 600
                  }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginBottom: 8 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Registered Successfully!</span>
                  </div>
                )}

                {!scanning && !scanSuccess && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#6b7280', fontSize: 12 }}>
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 6 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                    <span>Camera Standby</span>
                  </div>
                )}

                {scanning && !scanSuccess && (
                  <div style={{ color: '#22c55e', fontSize: 11, fontWeight: 'bold', zIndex: 2 }}>
                    Scanning QR Code...
                  </div>
                )}
              </div>

              <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#4b5563' }}>Select Classroom Session:</label>
                  <select 
                    value={selectedSubject} 
                    onChange={e => setSelectedSubject(e.target.value)}
                    style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, background: '#fff', outline: 'none' }}
                  >
                    <option value="Anatomy">Anatomy Lecture (Dr. Domingos)</option>
                    <option value="Physiology">Physiology Lab (Prof. Elisa)</option>
                    <option value="Biochemistry">Biochemistry Seminar (Dr. Francisco)</option>
                  </select>
                </div>

                <button
                  disabled={scanning || scanSuccess}
                  onClick={handleScanQR}
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 18px',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    opacity: (scanning || scanSuccess) ? 0.6 : 1
                  }}
                >
                  {scanning ? "Processing Scan..." : "Simulate QR Scan"}
                </button>

                {message && (
                  <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 500, marginTop: 4 }}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid var(--gray2)',
          borderRadius: 12,
          padding: '24px',
          boxShadow: 'var(--shadow-premium)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0', textAlign: 'left' }}>Essential Services Shortcuts</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            <div 
              onClick={() => { if(navigateTo) navigateTo('student', 'stu-edit', 'My Profile'); }}
              style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
                padding: '12px 14px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, background 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
            >
              <div style={{ color: '#2563eb', marginBottom: 6 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block' }}>My Profile Details</span>
              <span style={{ fontSize: 11, color: '#64748b' }}>View academic record</span>
            </div>

            <div 
              onClick={() => { if(navigateTo) navigateTo('fee-management', 'fmgmt-ledger', 'Fee Receipts'); }}
              style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
                padding: '12px 14px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, background 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
            >
              <div style={{ color: '#16a34a', marginBottom: 6 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block' }}>Fee Receipts</span>
              <span style={{ fontSize: 11, color: '#64748b' }}>Print receipts/UTRs</span>
            </div>

            <div 
              onClick={() => { if(navigateTo) navigateTo('student', 'stu-leave', 'Apply Leave'); }}
              style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
                padding: '12px 14px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, background 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
            >
              <div style={{ color: '#ea580c', marginBottom: 6 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block' }}>Apply Leave</span>
              <span style={{ fontSize: 11, color: '#64748b' }}>Submit leave requests</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
export default function HomeDashboard(props) {
  useInjectStyles();
  const savedUser = sessionStorage.getItem('uct_user');
  const user = props.user || (savedUser ? JSON.parse(savedUser) : null);
  const isStudent = user?.role === 'Student';
  const isStaff = user?.role === 'Staff/Faculty';

  if (isStudent) {
    return <StudentDashboardView user={user} navigateTo={props.navigateTo} />;
  }

  const [summary, setSummary] = useState({
    registeredStudents: 0,
    activeStudents: 0,
    totalEmployees: 0,
    totalDueFees: 0,
    totalCollections: 0,
    activeEnquiries: 0,
    newStudents: 0,
    oldStudents: 0,
    faculty: 0,
    departments: 0,
    presentStudents: 0,
    absentStudents: 0,
    presentEmployees: 0,
    absentEmployees: 0,
    activeRotations: 0,
  });

  useEffect(() => {
    const load = () => {
      fetch('/api/dashboard-summary')
        .then(res => res.json())
        .then(data => setSummary(prev => ({ ...prev, ...data })))
        .catch(err => console.error('Error loading dashboard summary:', err));
    };
    load();
    window.addEventListener('uct_data_update', load);
    return () => window.removeEventListener('uct_data_update', load);
  }, []);

  const getKpiValue = (label) => {
    switch (label) {
      case 'Registered Students':   return summary.registeredStudents;
      case 'Active Students':       return summary.activeStudents;
      case 'New Students':          return summary.newStudents;
      case 'Old Students':          return summary.oldStudents;
      case 'Total Faculty':         return summary.faculty;
      case 'Registered Employees':  return summary.totalEmployees;
      case 'Today Present Students':return summary.presentStudents;
      case 'Today Absent Students': return summary.absentStudents;
      case 'Today Present Employee':return summary.presentEmployees;
      case 'Today Absent Employee': return summary.absentEmployees;
      case 'Departments':           return summary.departments;
      case 'Pending Fees':          return `₹${(summary.totalDueFees || 0).toLocaleString('en-IN')}`;
      case 'Fee Collected':         return `₹${(summary.totalCollections || 0).toLocaleString('en-IN')}`;
      case 'Active Rotations':      return summary.activeRotations;
      default: return 0;
    }
  };

  const attendanceData = [
    { name: 'Student Present', value: summary.presentStudents, color: '#16a34a' },
    { name: 'Student Absent',  value: summary.absentStudents,  color: '#dc2626' },
    { name: 'Employee Present', value: summary.presentEmployees, color: '#0d5ef4' },
    { name: 'Employee Absent',  value: summary.absentEmployees,  color: '#f59e0b' },
  ];

  return (
    <div className="home-dashboard">

      {/* KPI GROUP 1: ACADEMIC ENROLLMENT */}
      <SectionTitle title="Academic & Enrollment Overview" delay={0} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 18, marginBottom: 28, marginTop: 12,
      }}>
        {ACADEMIC_KPIS.map((kpi, i) => (
          <KpiCard key={kpi.label} kpi={kpi} index={i} value={getKpiValue(kpi.label)} />
        ))}
      </div>

      {/* KPI GROUP 2: STAFF & ADMINISTRATION */}
      {!isStaff && (
        <>
          <SectionTitle title="Staff & Administration" delay={80} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 18, marginBottom: 28, marginTop: 12,
          }}>
            {STAFF_KPIS.map((kpi, i) => (
              <KpiCard key={kpi.label} kpi={kpi} index={i + ACADEMIC_KPIS.length} value={getKpiValue(kpi.label)} />
            ))}
          </div>
        </>
      )}

      {/* KPI GROUP 3: DAILY OPERATIONS & ATTENDANCE */}
      <SectionTitle title="Daily Operations & Attendance" delay={160} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
        gap: 18, marginBottom: 28, marginTop: 12,
      }}>
        {ATTENDANCE_KPIS.map((kpi, i) => (
          <KpiCard key={kpi.label} kpi={kpi} index={i + ACADEMIC_KPIS.length + (isStaff ? 0 : STAFF_KPIS.length)} value={getKpiValue(kpi.label)} />
        ))}
      </div>

      {/* KPI GROUP 4: FINANCIAL SUMMARY */}
      {!isStaff && (
        <>
          <SectionTitle title="Financial Summary" delay={240} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 18, marginBottom: 28, marginTop: 12,
          }}>
            {FINANCE_KPIS.map((kpi, i) => (
              <KpiCard key={kpi.label} kpi={kpi} index={i + ACADEMIC_KPIS.length + (isStaff ? 0 : STAFF_KPIS.length) + ATTENDANCE_KPIS.length} value={getKpiValue(kpi.label)} />
            ))}
          </div>
        </>
      )}

      {/* ANALYTICS */}
      <SectionTitle title="Analytics & Trends" delay={300} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div className="chart-card" style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
          padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', animationDelay: '350ms',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>Students by Course</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.studentData && summary.studentData.length > 0 ? summary.studentData : [
              { name: 'MBBS', students: 5 },
              { name: 'BDS', students: 2 },
              { name: 'BAMS', students: 1 }
            ]} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} cursor={{ fill: 'rgba(13,94,244,0.02)' }} />
              <Bar dataKey="students" fill="#0d5ef4" radius={[6, 6, 0, 0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
          padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column',
          minHeight: 350, animationDelay: '420ms',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>Attendance Summary</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [v, 'People']} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* FEE COLLECTION */}
      {!isStaff && (
        <>
          <SectionTitle title="Fee Collection Status" delay={450} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 20, marginBottom: 28 }}>
            <div className="chart-card" style={{
              background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
              padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', animationDelay: '500ms',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>Last 7 Days Collection</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={LAST7_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                    formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Collection']}
                  />
                  <Bar dataKey="amount" fill="#0d5ef4" radius={[6, 6, 0, 0]} isAnimationActive />
                </BarChart>
              </ResponsiveContainer>
              {LAST7_DATA.every((d) => d.amount === 0) && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, marginTop: -300 }}>
                  <p style={{ fontSize: 14, color: '#9ca3af' }}>No collection data available</p>
                </div>
              )}
            </div>

            <div className="chart-card" style={{
              background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
              padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', animationDelay: '550ms',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>Today's Collection</h3>
              <TodayCollectionTable />
              {TODAY_COLLECTION.every((r) => r.amount === 0) && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 32 }}>
                  <p style={{ fontSize: 14, color: '#9ca3af' }}>No collection recorded today</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* UNIVERSITY DETAILS */}
      <SectionTitle title="University Details" delay={600} />
      <UniversityDetails />

      {/* ENQUIRY SEARCH */}
      <SectionTitle title="Enquiry Search" delay={650} />
      <EnquirySearch />

      {/* ── NEW PANELS ── */}
      <SectionTitle title="Abroad & Visa Overview" delay={700} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 20, marginBottom: 28 }}>
        <VisaStatusPanel   delay={750} />
        <AbroadStudentPanel delay={800} />
      </div>

      {/* AGENT & FINANCE OVERVIEW */}
      {!isStaff && (
        <>
          <SectionTitle title="Agent & Finance Overview" delay={850} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 20, marginBottom: 28 }}>
            <AgentPerformancePanel delay={900} />
            <ForexRemittancePanel  delay={950} />
          </div>
        </>
      )}

    </div>
  );
}
