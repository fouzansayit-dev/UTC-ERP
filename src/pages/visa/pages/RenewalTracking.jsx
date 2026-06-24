import React, { useState } from 'react';
import '../Visa.css';
import RenewalForm from '../components/RenewalForm.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const INIT = {
  studentId:      '',
  visaExpiryDate: '',
  renewalAppDate: '',
  renewalStatus:  '',
  notes:          '',
};

const STATUS_BADGE_MAP = {
  'Not Started':           'Pending',
  'Documents Collecting':  'Processing',
  'Application Submitted': 'Submitted',
  'Under Review':          'Processing',
  'Approved':              'Approved',
  'Rejected':              'Rejected',
};

function getDaysUntilExpiry(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((new Date(dateStr) - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function ExpiryCard({ visaExpiryDate }) {
  const days = getDaysUntilExpiry(visaExpiryDate);
  let color = '#6b7280', bg = '#f3f4f6', label = 'Not Set';
  if (days !== null) {
    label = `${days} day${Math.abs(days) !== 1 ? 's' : ''} ${days < 0 ? 'overdue' : 'remaining'}`;
    if (days < 0)   { color = '#b91c1c'; bg = '#fee2e2'; }
    else if (days <= 30) { color = '#b45309'; bg = '#fef3c7'; }
    else if (days <= 60) { color = '#0369a1'; bg = '#dbeafe'; }
    else               { color = '#15803d'; bg = '#dcfce7'; }
  }
  return (
    <div className="visa-kpi-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="visa-kpi-label">Visa Expiry</div>
      <div className="visa-kpi-value" style={{ color, fontSize: 20 }}>
        {visaExpiryDate || '—'}
      </div>
      {days !== null && (
        <div className="visa-kpi-sub" style={{ background: bg, color, borderRadius: 4, padding: '3px 8px', display: 'inline-block', marginTop: 6, fontWeight: 600 }}>
          {label}
        </div>
      )}
      {!visaExpiryDate && <div className="visa-kpi-sub">Enter a student ID to load expiry date</div>}
    </div>
  );
}

function RenewalStatusCard({ status }) {
  return (
    <div className="visa-kpi-card" style={{ borderTop: '4px solid #7c3aed' }}>
      <div className="visa-kpi-label">Renewal Status</div>
      <div style={{ marginTop: 8 }}>
        {status
          ? <StatusBadge status={STATUS_BADGE_MAP[status] || 'Pending'} />
          : <span style={{ fontSize: 13, color: '#9ca3af' }}>No status selected</span>
        }
        {status && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>{status}</div>}
      </div>
    </div>
  );
}

function AlertsCard({ visaExpiryDate }) {
  const days = getDaysUntilExpiry(visaExpiryDate);
  const alerts = [];
  if (days !== null) {
    if (days < 0)    alerts.push({ text: 'Visa has expired — immediate action required!', color: '#b91c1c', bg: '#fee2e2' });
    if (days <= 30)  alerts.push({ text: 'Critical: Less than 30 days to expiry.', color: '#b91c1c', bg: '#fee2e2' });
    if (days <= 60)  alerts.push({ text: 'Warning: Initiate renewal process now.', color: '#b45309', bg: '#fef3c7' });
    if (days <= 90)  alerts.push({ text: 'Reminder: Visa expiry within 90 days.', color: '#1d4ed8', bg: '#dbeafe' });
    if (alerts.length === 0) alerts.push({ text: 'No urgent alerts at this time.', color: '#15803d', bg: '#dcfce7' });
  }
  return (
    <div className="visa-kpi-card" style={{ borderTop: '4px solid #dc2626' }}>
      <div className="visa-kpi-label">Alerts</div>
      <div style={{ marginTop: 8 }}>
        {alerts.length === 0 && !visaExpiryDate
          ? <span style={{ fontSize: 13, color: '#9ca3af' }}>Enter expiry date to see alerts</span>
          : alerts.map((a, i) => (
              <div key={i} style={{ background: a.bg, color: a.color, borderRadius: 6, padding: '7px 12px', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                {a.text}
              </div>
            ))
        }
      </div>
    </div>
  );
}

export default function RenewalTracking() {
  const [form, setForm]       = useState(INIT);
  const [renewed, setRenewed] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setRenewed(false);
  };

  const handleRenew = () => {
    setRenewed(true);
    setTimeout(() => setRenewed(false), 3000);
  };

  const handleReset = () => { setForm(INIT); setRenewed(false); };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
          Visa &amp; Immigration › Renewal Tracking
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Visa Renewal Tracking
        </h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          Monitor and manage visa renewal status for abroad students.
        </p>
      </div>

      {renewed && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
          Renewal process initiated successfully.
        </div>
      )}

      {/* Renewal form */}
      <div className="visa-card">
        <div className="visa-card-header violet">Renewal Details</div>
        <div className="visa-card-body">
          <RenewalForm form={form} onChange={onChange} />
          <div className="visa-btn-row" style={{ borderTop: '1px solid #e5e7eb', marginTop: 20, paddingTop: 16 }}>
            <button type="button" className="visa-btn visa-btn-success" onClick={handleRenew}>Renew</button>
            <button type="button" className="visa-btn visa-btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="visa-kpi-row">
        <ExpiryCard       visaExpiryDate={form.visaExpiryDate} />
        <RenewalStatusCard status={form.renewalStatus} />
        <AlertsCard       visaExpiryDate={form.visaExpiryDate} />
      </div>
    </>
  );
}
