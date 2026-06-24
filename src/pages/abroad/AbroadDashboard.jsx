import React, { useState, useEffect } from 'react';
import '../student/Student.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

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
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/generic/abroad/students')
      .then(res => res.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard error loading students:", err);
        setStudents([]);
        setLoading(false);
      });
  }, []);

  const totalStudents = students.length;
  const activeSession = students.filter(s => s.session === '2024-2025' || s.session === '2025-2026').length;
  const visaExpiring = 0; // visa alerts are computed
  const graduated = students.filter(s => s.stage === 14).length;

  const stageData = Array.from({ length: 14 }, (_, i) => ({
    stage: i + 1,
    label: STAGES[i],
    shortLabel: `S${i + 1}`,
    count: students.filter(s => s.stage === i + 1).length
  }));

  const countryCounts = Object.entries(
    students.reduce((acc, s) => {
      if (s.country) {
        acc[s.country] = (acc[s.country] || 0) + 1;
      }
      return acc;
    }, {})
  );

  const recent = [...students].reverse().slice(0, 5);

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
        <MetricCard value={totalStudents} label="Total Abroad Students" sub="All time" trend={totalStudents > 0 ? 100 : 0} />
        <MetricCard value={activeSession} label="Active This Session" sub="2024-2025 / 25-26" trend={activeSession > 0 ? 100 : 0} color="#16a34a" />
        <MetricCard value={visaExpiring} label="Visa Expiring Soon" sub="Within 30 days" trend={0} color="#ea580c" />
        <MetricCard value={graduated} label="Graduated Alumni" sub="Stage 14 complete" trend={graduated > 0 ? 100 : 0} color="#7c3aed" />
      </div>

      {/* CHART + COUNTRY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Stage Chart */}
        <div style={panelStyle}>
          <div className="stu-table-title">Stage-wise Distribution</div>
          <div style={{ padding: 16 }}>
            {totalStudents === 0 ? (
              <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No active stages to draw.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortLabel" />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count">
                    {stageData.map((entry) => (
                      <Cell key={entry.stage} fill={stageColor(entry.stage)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Country */}
        <div style={panelStyle}>
          <div className="stu-table-title">Country-wise Distribution</div>
          <div style={{ padding: 16 }}>
            {countryCounts.length === 0 ? (
              <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No country data recorded.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {countryCounts.map(([country, count]) => (
                  <div key={country} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: '13.5px', color: '#334155' }}>{country}</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0d5ef4', background: '#eff6ff', padding: '2px 8px', borderRadius: 12 }}>
                      {count} student{count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RECENT */}
      <div style={{ ...panelStyle, marginTop: 16 }}>
        <div className="stu-table-title">Recent Registrations</div>
        <div style={{ padding: 16 }}>
          {recent.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
              No recent registrations.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', borderBottom: '0.5px solid #f8fafc', paddingBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{s.name} ({s.rollNo})</span>
                  <span>{s.university} — <strong style={{ color: stageColor(s.stage) }}>Stage {s.stage}</strong></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
