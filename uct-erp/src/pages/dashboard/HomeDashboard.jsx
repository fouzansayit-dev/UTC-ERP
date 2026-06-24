import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const studentData = [];

const KPI_DATA = [
  { label: 'Registered Students',    color: '#4361ee' },
  { label: 'Active Students',         color: '#16a34a' },
  { label: 'New Students',            color: '#0891b2' },
  { label: 'Old Students',            color: '#7c3aed' },
  { label: 'Total Faculty',           color: '#d97706' },
  { label: 'Registered Employees',    color: '#dc2626' },
  { label: 'Today Present Students',  color: '#16a34a' },
  { label: 'Today Absent Students',   color: '#dc2626' },
  { label: 'Today Present Employee',  color: '#0891b2' },
  { label: 'Today Absent Employee',   color: '#d97706' },
  { label: 'Departments',             color: '#7c3aed' },
  { label: 'Pending Fees',            color: '#dc2626' },
  { label: 'Fee Collected',           color: '#16a34a' },
  { label: 'Active Rotations',        color: '#4361ee' },
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

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
export default function HomeDashboard() {
  useInjectStyles();
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
    fetch('/api/dashboard-summary')
      .then(res => res.json())
      .then(data => setSummary(prev => ({ ...prev, ...data })))
      .catch(err => console.error('Error loading dashboard summary:', err));
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

  return (
    <div className="home-dashboard">

      {/* KPI CARDS */}
      <SectionTitle title="Dashboard Overview" delay={0} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
        gap: 18, marginBottom: 28, marginTop: 12,
      }}>
        {KPI_DATA.map((kpi, i) => (
          <KpiCard key={kpi.label} kpi={kpi} index={i} value={getKpiValue(kpi.label)} />
        ))}
      </div>

      {/* ANALYTICS */}
      <SectionTitle title="Analytics" delay={100} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div className="chart-card" style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
          padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', animationDelay: '150ms',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>Students by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <YAxis tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 4 }} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
              <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
          {studentData.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, marginTop: -300 }}>
              <p style={{ fontSize: 14, color: '#9ca3af' }}>No data available</p>
            </div>
          )}
        </div>

        <div className="chart-card" style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
          padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          minHeight: 350, animationDelay: '220ms',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>Attendance Summary</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 14, color: '#9ca3af' }}>No attendance data yet</p>
          </div>
        </div>
      </div>

      {/* FEE COLLECTION */}
      <SectionTitle title="Fee Collection" delay={200} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div className="chart-card" style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
          padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', animationDelay: '250ms',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>Last 7 Days Collection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={LAST7_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <YAxis tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 4 }}
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Collection']}
              />
              <Bar dataKey="amount" fill="#4361ee" radius={[6, 6, 0, 0]} isAnimationActive />
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
          padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', animationDelay: '320ms',
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

      {/* UNIVERSITY DETAILS */}
      <SectionTitle title="University Details" delay={300} />
      <UniversityDetails />

      {/* ENQUIRY SEARCH */}
      <SectionTitle title="Enquiry Search" delay={400} />
      <EnquirySearch />

      {/* ── NEW PANELS ── */}
      <SectionTitle title="Abroad & Visa Overview" delay={500} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 20, marginBottom: 28 }}>
        <VisaStatusPanel   delay={550} />
        <AbroadStudentPanel delay={620} />
      </div>

      <SectionTitle title="Agent & Finance Overview" delay={680} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 20, marginBottom: 28 }}>
        <AgentPerformancePanel delay={730} />
        <ForexRemittancePanel  delay={800} />
      </div>

    </div>
  );
}
