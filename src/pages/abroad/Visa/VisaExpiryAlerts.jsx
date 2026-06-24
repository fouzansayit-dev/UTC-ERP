import React, { useState } from 'react';
import '../../student/Student.css';

const VISA_EXPIRY_DATA = [];

const ALERT_BANDS = [
  { key: 'critical', label: 'Critical',  days: [0,  30], bg: '#fef2f2', border: '#fca5a5', badgeBg: '#dc2626', tagBg: '#fee2e2', tagColor: '#b91c1c' },
  { key: 'warning',  label: 'Warning',   days: [31, 60], bg: '#fffbeb', border: '#fcd34d', badgeBg: '#d97706', tagBg: '#fef3c7', tagColor: '#92400e' },
  { key: 'upcoming', label: 'Upcoming',  days: [61, 90], bg: '#eff6ff', border: '#93c5fd', badgeBg: '#2563eb', tagBg: '#dbeafe', tagColor: '#1d4ed8' },
];

function daysDiff(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateStr) - today) / (1000 * 60 * 60 * 24));
}

export default function VisaExpiryAlerts() {
  const [filter, setFilter] = useState('all');

  const tagged = VISA_EXPIRY_DATA
    .map((s) => ({ ...s, daysLeft: daysDiff(s.expiryDate) }))
    .filter((s) => s.daysLeft >= 0 && s.daysLeft <= 90)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const bands = ALERT_BANDS.map((band) => ({
    ...band,
    students: tagged.filter((s) => s.daysLeft >= band.days[0] && s.daysLeft <= band.days[1]),
  }));

  const visibleBands = filter === 'all' ? bands : bands.filter((b) => b.key === filter);

  return (
    <>
      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[{ key: 'all', label: 'All Expiring', count: tagged.length, bg: '#f3f4f6', color: '#374151', active: '#1e293b' },
          ...bands.map((b) => ({ key: b.key, label: b.label, count: b.students.length, bg: b.tagBg, color: b.tagColor, active: b.badgeBg }))
        ].map((item) => (
          <div key={item.key}
            onClick={() => setFilter(item.key)}
            style={{ background: filter === item.key ? item.active : item.bg, color: filter === item.key ? '#fff' : item.color, border: `1px solid ${filter === item.key ? item.active : item.color + '55'}`, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 700, textAlign: 'center', minWidth: 100, transition: 'all 0.15s' }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 2 }}>{item.count}</div>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="stu-filter-card" style={{ marginBottom: 16 }}>
        <div className="stu-filter-header" style={{ background: '#7c3aed' }}>
          Visa Expiry Alerts — Next 90 Days
        </div>
        <div style={{ padding: '10px 16px', background: '#f5f3ff', fontSize: 13, color: '#5b21b6' }}>
          Students whose visa expires within the next 90 days. Initiate renewal at least 60 days before expiry.
        </div>
      </div>

      {tagged.length === 0 ? (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '40px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#15803d', fontSize: 15, marginBottom: 6 }}>No visa expirations in the next 90 days</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>Connect backend to populate visa expiry data.</div>
        </div>
      ) : (
        visibleBands.map((band) => (
          <div key={band.key} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, background: band.bg, border: `1px solid ${band.border}`, borderRadius: 8, padding: '10px 16px' }}>
              <div>
                <div style={{ fontWeight: 700, color: band.badgeBg, fontSize: 14 }}>
                  {band.label} — {band.days[0]}–{band.days[1]} Days
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>
                  {band.students.length} student{band.students.length !== 1 ? 's' : ''} in this window
                </div>
              </div>
            </div>

            {band.students.length === 0 ? (
              <div style={{ background: '#f9fafb', border: '1px dashed #e5e7eb', borderRadius: 8, padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                No students in this expiry window.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                {band.students.map((s) => (
                  <div key={s.id} style={{ background: '#fff', border: `1px solid ${band.border}`, borderLeft: `4px solid ${band.badgeBg}`, borderRadius: 8, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.country} — {s.university}</div>
                      </div>
                      <div style={{ background: band.tagBg, color: band.tagColor, borderRadius: 6, padding: '4px 10px', textAlign: 'center', minWidth: 64 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{s.daysLeft}</div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>days left</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#374151', marginBottom: 10, flexWrap: 'wrap' }}>
                      <span>Expires: <strong>{s.expiryDate}</strong></span>
                      <span>Stage {s.stage}: {s.stageLabel}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="stu-btn stu-btn-sm" style={{ background: band.badgeBg, color: '#fff', flex: 1 }} onClick={() => alert("Action")}>Initiate Renewal</button>
                      <button className="stu-btn stu-btn-sm stu-btn-secondary" onClick={() => alert("Action")}>View Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
}
