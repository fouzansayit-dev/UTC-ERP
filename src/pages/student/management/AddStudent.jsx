import React, { useState } from 'react';
import '../Student.css';
import StudentForm from './StudentForm.jsx';

export default function AddStudent() {
  const [credentials, setCredentials] = useState(null);
  const [error, setError]             = useState(null);
  const [copied, setCopied]           = useState('');

  const handleSubmit = (data) => {
    setError(null);
    fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(async (res) => {
        let body = {};
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try { body = await res.json(); } catch (e) { /* ignore */ }
        } else {
          const text = await res.text();
          body = { error: text || 'Unknown server error' };
        }
        if (!res.ok) throw new Error(body.error || 'Failed to add student');
        // Show credential card
        if (body.credentials) {
          setCredentials({ studentName: body.name, ...body.credentials });
        } else {
          setCredentials({ studentName: body.name, plain: true });
        }
      })
      .catch(err => setError(err.message));
  };

  const copy = (label, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  if (credentials) {
    return (
      <div className="stu-filter-card">
        <div className="stu-filter-header">Add Student</div>
        <div className="stu-filter-body">
          <div style={styles.successBanner}>
            <span style={styles.checkIcon}>✓</span>
            <div>
              <div style={styles.successTitle}>Student Added Successfully!</div>
              <div style={styles.successSub}>
                {credentials.studentName} has been registered. Share the login credentials below.
              </div>
            </div>
          </div>

          {credentials.plain ? (
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              Student account created. No additional credentials to display.
            </p>
          ) : (
            <div style={styles.credCard}>
              <div style={styles.credHeader}>
                <span style={styles.credIcon}>🔐</span>
                <span>Login Credentials</span>
              </div>
              <div style={styles.credBody}>
                <CredRow
                  label="Login ID (Username)"
                  value={credentials.username}
                  copied={copied}
                  onCopy={copy}
                />
                <CredRow
                  label="Password"
                  value={credentials.password}
                  copied={copied}
                  onCopy={copy}
                  secret
                />
                <CredRow
                  label="Role / Portal"
                  value={credentials.role}
                  copied={copied}
                  onCopy={copy}
                />
              </div>
              <div style={styles.credNote}>
                ⚠️ Please save or print these credentials now. The password cannot be retrieved later.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button
              className="stu-btn stu-btn-primary"
              onClick={() => { setCredentials(null); setError(null); }}
            >
              + Add Another Student
            </button>
            {credentials.username && (
              <button
                className="stu-btn stu-btn-secondary"
                onClick={() => {
                  const text =
                    `UCT ERP — Student Login Credentials\n` +
                    `Student: ${credentials.studentName}\n` +
                    `Login ID: ${credentials.username}\n` +
                    `Password: ${credentials.password}\n` +
                    `Portal: ${credentials.portal}`;
                  navigator.clipboard.writeText(text);
                  setCopied('ALL');
                  setTimeout(() => setCopied(''), 2500);
                }}
              >
                {copied === 'ALL' ? '✓ Copied All!' : '📋 Copy All Credentials'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stu-filter-card">
      <div className="stu-filter-header">Add Student</div>
      <div className="stu-filter-body">
        {error && (
          <div style={styles.errorBanner}>
            ⚠ {error}
          </div>
        )}
        <StudentForm onSubmit={handleSubmit} submitLabel="Add Student" />
      </div>
    </div>
  );
}

function CredRow({ label, value, copied, onCopy, secret }) {
  const [show, setShow] = useState(!secret);
  const isCopied = copied === label;
  return (
    <div style={styles.credRow}>
      <div style={styles.credLabel}>{label}</div>
      <div style={styles.credValueWrap}>
        <code style={styles.credValue}>
          {secret && !show ? '••••••••••' : value}
        </code>
        {secret && (
          <button style={styles.iconBtn} onClick={() => setShow(s => !s)} title={show ? 'Hide' : 'Show'}>
            {show ? '🙈' : '👁'}
          </button>
        )}
        <button
          style={{ ...styles.iconBtn, color: isCopied ? '#16a34a' : '#4361ee' }}
          onClick={() => onCopy(label, value)}
          title="Copy"
        >
          {isCopied ? '✓' : '📋'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  successBanner: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    background: 'linear-gradient(135deg, #dcfce7, #f0fdf4)',
    border: '1px solid #86efac', borderRadius: 10,
    padding: '14px 18px', marginBottom: 20
  },
  checkIcon: { fontSize: 28, lineHeight: 1 },
  successTitle: { fontWeight: 700, fontSize: 16, color: '#15803d' },
  successSub:   { fontSize: 13, color: '#166534', marginTop: 2 },
  credCard: {
    border: '1.5px solid #c7d2fe', borderRadius: 12,
    overflow: 'hidden', marginBottom: 8
  },
  credHeader: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
    color: '#fff', padding: '10px 16px',
    fontWeight: 700, fontSize: 15
  },
  credIcon: { fontSize: 18 },
  credBody:  { padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  credRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  credLabel: { fontSize: 12, fontWeight: 600, color: '#6b7280', minWidth: 160 },
  credValueWrap: { display: 'flex', alignItems: 'center', gap: 6 },
  credValue: {
    background: '#f8faff', border: '1px solid #e0e7ff',
    borderRadius: 6, padding: '5px 10px',
    fontSize: 14, fontFamily: 'monospace', color: '#1e1b4b',
    letterSpacing: '0.04em'
  },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, padding: '2px 4px', borderRadius: 4
  },
  credNote: {
    background: '#fefce8', borderTop: '1px solid #fde047',
    color: '#92400e', fontSize: 12, padding: '8px 16px'
  },
  errorBanner: {
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', borderRadius: 8,
    padding: '10px 14px', marginBottom: 14, fontSize: 13
  }
};
