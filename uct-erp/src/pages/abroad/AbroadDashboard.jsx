import React from 'react';
import '../student/Student.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

/* ───────── Dummy Data ───────── */
const ALL_STUDENTS = [];

/* ───────── Stages ───────── */
const STAGES = [
  'Enquiry & Programme Selection', 'Country & University Finalisation', 'Agent Linkage',
  'Document Collection', 'Application to University', 'Provisional Admission',
  'Fee Remittance', 'Visa Application', 'Pre-Departure',
  'Departure', 'On-Campus Monitoring', 'Annual Return Visit',
  'NMC Internship', 'Graduation & Alumni',
];

/* ───────── Stage Color ───────── */
function stageColor(s) {
  if (s <= 3) return '#1d4ed8';
  if (s <= 6) return '#d97706';
  if (s <= 9) return '#ea580c';
  if (s <= 11) return '#16a34a';
  if (s <= 13) return '#7c3aed';
  return '#059669';
}

/* ───────── KPI Card ───────── */
function MetricCard({ value, label, sub, color = "#2563eb", trend }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderLeft: `4px solid ${color}`,
        borderRadius: 10,
        padding: '18px 20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, color: '#1e293b' }}>
        {value}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 4 }}>
        {label}
      </div>

      {sub && (
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
          {sub}
        </div>
      )}

      {trend !== undefined && (
        <div style={{
          fontSize: 12,
          marginTop: 6,
          fontWeight: 600,
          color: trend >= 0 ? '#16a34a' : '#dc2626'
        }}>
          {trend >= 0 ? `+${trend}% ↑` : `${trend}% ↓`}
        </div>
      )}
    </div>
  );
}

/* ───────── Tooltip ───────── */
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12
      }}>
        <div style={{ fontWeight: 600 }}>
          Stage {d.stage}: {d.label}
        </div>
        <div>
          Students: <strong>{d.count}</strong>
        </div>
      </div>
    );
  }
  return null;
}

/* ───────── Main Component ───────── */
export default function AbroadDashboard() {

  const totalStudents = ALL_STUDENTS.length;
  const activeSession = ALL_STUDENTS.filter(s => s.session === '2024-2025').length;
  const visaExpiring = 0;
  const graduated = ALL_STUDENTS.filter(s => s.stage === 14).length;

  const stageData = Array.from({ length: 14 }, (_, i) => ({
    stage: i + 1,
    label: STAGES[i],
    shortLabel: `S${i + 1}`,
    count: ALL_STUDENTS.filter(s => s.stage === i + 1).length
  }));

  const countryCounts = Object.entries(
    ALL_STUDENTS.reduce((acc, s) => {
      acc[s.country] = (acc[s.country] || 0) + 1;
      return acc;
    }, {})
  );

  const recent = [...ALL_STUDENTS].slice(0, 5);

  const panelStyle = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  };

  return (
    <div>

      {/* KPI CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14,
        marginBottom: 20
      }}>
        <MetricCard value={totalStudents} label="Total Abroad Students" sub="All time" trend={12} />
        <MetricCard value={activeSession} label="Active This Session" sub="2024-2025" trend={8} color="#16a34a" />
        <MetricCard value={visaExpiring} label="Visa Expiring Soon" sub="Within 30 days" trend={-3} color="#ea580c" />
        <MetricCard value={graduated} label="Graduated Alumni" sub="Stage 14 complete" trend={5} color="#7c3aed" />
      </div>

      {/* CHART + COUNTRY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Stage Chart */}
        <div style={panelStyle}>
          <div className="stu-table-title">Stage-wise Distribution</div>
          <div style={{ padding: 16 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortLabel" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count">
                  {stageData.map((entry) => (
                    <Cell key={entry.stage} fill={stageColor(entry.stage)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country */}
        <div style={panelStyle}>
          <div className="stu-table-title">Country-wise Students</div>
          <div style={{ padding: 16 }}>
            {countryCounts.map(([country, count]) => (
              <div key={country}>{country}: {count}</div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT */}
      <div style={{ ...panelStyle, marginTop: 16 }}>
        <div className="stu-table-title">Recent Activity</div>
        <div style={{ padding: 16 }}>
          {recent.map((s, i) => (
            <div key={i}>{s.name}</div>
          ))}
        </div>
      </div>

    </div>
  );
}
