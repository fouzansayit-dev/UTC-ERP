import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;
const FormField = ({ label, required, children }) => (
  <div className="form-field">
    <label className="form-label">{label}{required && <span className="req"> *</span>}</label>
    {children}
  </div>
);
const Input    = (props)              => <input    className="form-input" {...props} />;
const Select   = ({ children, ...p }) => <select   className="form-input" {...p}>{children}</select>;
const Textarea = (props)              => <textarea className="form-input form-textarea" {...props} />;

export default function CircularDashboard(props) {
  const savedUser = sessionStorage.getItem('uct_user');
  const user = props.user || (savedUser ? JSON.parse(savedUser) : null);
  const isPublisher = user?.role === 'Administrator' || user?.role === 'Staff/Faculty';

  const today = () => new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    title: '',
    course: 'ALL',
    category: 'General',
    date: today(),
    circular: '',
    attachment: null
  });

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const fetchCirculars = () => {
    fetch('/api/generic/circulars/list')
      .then(res => res.json())
      .then(data => {
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Error fetching circulars:', err));
  };

  useEffect(() => {
    fetchCirculars();
    window.addEventListener('uct_data_update', fetchCirculars);
    return () => window.removeEventListener('uct_data_update', fetchCirculars);
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.circular) {
      alert('Please fill out Title and Description.');
      return;
    }

    const newCircular = {
      id: Date.now(),
      title: form.title,
      course: form.course,
      category: form.category,
      date: form.date,
      circular: form.circular,
      attachment: form.attachment,
      publisher: user?.username || 'System'
    };

    const nextRows = [newCircular, ...rows];

    fetch('/api/generic/circulars/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextRows),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRows(nextRows);
          setForm({
            title: '',
            course: 'ALL',
            category: 'General',
            date: today(),
            circular: '',
            attachment: null
          });
          alert('Circular published successfully!');
        } else {
          alert('Failed to publish: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error('Error saving circular:', err);
        alert('Network error. Failed to publish circular.');
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this circular?')) return;
    const nextRows = rows.filter(r => r.id !== id);

    fetch('/api/generic/circulars/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextRows),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRows(nextRows);
          alert('Circular deleted successfully.');
        } else {
          alert('Failed to delete: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error('Error deleting circular:', err);
        alert('Network error. Failed to delete circular.');
      });
  };

  const filtered = rows.filter(r =>
    (r.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.circular || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>

      {/* ── PUBLISH PANEL (Only visible to Admin/Staff) ── */}
      {isPublisher && (
        <form className="hr-form" onSubmit={handleSubmit}>
          <SectionTitle title="Publish New Circular" />
          <div className="form-grid">
            <FormField label="Circular Title" required>
              <Input
                placeholder="Enter circular title"
                value={form.title}
                onChange={e => set('title', e.target.value)}
              />
            </FormField>

            <FormField label="Target Course / Department" required>
              <Select value={form.course} onChange={e => set('course', e.target.value)}>
                <option value="ALL">ALL Courses & Departments</option>
                <option value="MBBS">MBBS Students</option>
                <option value="BDS">BDS Students</option>
                <option value="BAMS">BAMS Students</option>
                <option value="Staff/Faculty">Staff/Faculty Only</option>
                <option value="Accounts">Accounts Department</option>
                <option value="HR">HR Department</option>
              </Select>
            </FormField>

            <FormField label="Category" required>
              <Select value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="General">General</option>
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
                <option value="Finance">Finance</option>
                <option value="Exam">Exam</option>
                <option value="Holiday">Holiday</option>
              </Select>
            </FormField>

            <FormField label="Publish Date" required>
              <Input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </FormField>

            <FormField label="Description / Content" required>
              <Textarea
                placeholder="Enter circular description or content..."
                rows={4}
                value={form.circular}
                onChange={e => set('circular', e.target.value)}
              />
            </FormField>

            <FormField label="Attachment (Optional)">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={e => set('attachment', e.target.files[0]?.name || null)}
              />
            </FormField>
          </div>
          <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="submit-btn">Publish Circular</button>
            <button
              type="button"
              className="submit-btn"
              style={{ background: '#6b7280' }}
              onClick={() => setForm({
                title: '',
                course: 'ALL',
                category: 'General',
                date: today(),
                circular: '',
                attachment: null
              })}
            >
              Reset
            </button>
          </div>
        </form>
      )}

      {/* ── CIRCULAR BULLETIN BOARD (Visible to Everyone) ── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Active Circulars & Announcements</div>
          <input
            className="form-input"
            style={{ width: 240 }}
            placeholder="Search circulars..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 }}>
             No circulars posted yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(row => (
              <div
                key={row.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '18px 20px',
                  background: '#f8fafc',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                {/* Delete button for publishers */}
                {isPublisher && (
                  <button
                    onClick={() => handleDelete(row.id)}
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      background: '#fee2e2',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Delete
                  </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span
                    style={{
                      background: row.category === 'Exam' ? '#fef2f2' : row.category === 'Holiday' ? '#fef3c7' : '#eff6ff',
                      color: row.category === 'Exam' ? '#ef4444' : row.category === 'Holiday' ? '#d97706' : '#2563eb',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 12,
                      textTransform: 'uppercase'
                    }}
                  >
                    {row.category}
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Published: <b>{row.date}</b></span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Target: <b style={{ color: '#10b981' }}>{row.course}</b></span>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>{row.title}</h3>
                
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, margin: '0 0 12px 0', whiteSpace: 'pre-wrap' }}>
                  {row.circular || row.circularContent}
                </p>

                {row.attachment && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0l-3.536 3.536m3.536-3.536L12.75 6.25m2.078 2.922L16.25 12.75M12.75 17.75h6a2 2 0 002-2v-6a2 2 0 00-2-2h-3l-3-3H6a2 2 0 00-2 2v10a2 2 0 002 2h3" />
                    </svg>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert(`Downloading attachment: ${row.attachment}`); }}
                      style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                    >
                      {row.attachment}
                    </a>
                  </div>
                )}

                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 10, textAlign: 'right' }}>
                  Posted by: {row.publisher || 'System'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
