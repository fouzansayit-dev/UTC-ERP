import React, { useState } from 'react';
import '../Student.css';

const STUDENTS = [];

const PERIODS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];
const STATUS_OPTS = ['P', 'A', 'L', 'H'];
const STATUS_COLORS = { P: '#dcfce7', A: '#fee2e2', L: '#fff7ed', H: '#f3f4f6' };

/* ── Daily Attendance ── */
function DailyAttendance() {
  const today = new Date().toISOString().split('T')[0];
  const [filters, setFilters] = useState({ course: '', branch: '', date: today });
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const initRows = () => {
    const init = STUDENTS.map((s) => ({
      ...s,
      periods: Object.fromEntries(PERIODS.map((p) => [p, 'P'])),
    }));
    setRows(init);
    setLoaded(true);
  };

  const setStatus = (id, period, val) =>
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, periods: { ...r.periods, [period]: val } } : r));

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Student Attendance — Daily Entry</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field"><label>Course</label>
              <select value={filters.course} onChange={set('course')}><option value="">All</option><option>MBBS</option><option>BDS</option></select>
            </div>
            <div className="stu-field"><label>Branch</label>
              <select value={filters.branch} onChange={set('branch')}><option value="">All</option><option>General</option></select>
            </div>
            <div className="stu-field"><label>Date</label>
              <input type="date" value={filters.date} onChange={set('date')} />
            </div>
          </div>
          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={initRows}>Load Students</button>
          </div>
        </div>
      </div>

      {loaded && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Attendance — {filters.date}</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead>
                <tr>
                  <th>S.No</th><th>Name</th><th>Roll No</th>
                  {PERIODS.map((p) => <th key={p}>{p}</th>)}
                  <th>Present</th><th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const pCount = Object.values(r.periods).filter((v) => v === 'P').length;
                  const aCount = Object.values(r.periods).filter((v) => v === 'A').length;
                  return (
                    <tr key={r.id}>
                      <td>{i+1}</td><td>{r.name}</td><td>{r.rollNo}</td>
                      {PERIODS.map((p) => (
                        <td key={p} style={{ background: STATUS_COLORS[r.periods[p]] }}>
                          <select
                            value={r.periods[p]}
                            onChange={(e) => setStatus(r.id, p, e.target.value)}
                            style={{ border: 'none', background: 'transparent', fontSize: 12, cursor: 'pointer' }}
                          >
                            {STATUS_OPTS.map((o) => <option key={o}>{o}</option>)}
                          </select>
                        </td>
                      ))}
                      <td style={{ color: '#16a34a', fontWeight: 600 }}>{pCount}</td>
                      <td style={{ color: '#dc2626', fontWeight: 600 }}>{aCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 16px', fontSize: 12, color: '#6b7280' }}>
            P = Present &nbsp;|&nbsp; A = Absent &nbsp;|&nbsp; L = Leave &nbsp;|&nbsp; H = Holiday
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <button className="stu-btn stu-btn-success" onClick={() => alert('Attendance saved!')}>Save Attendance</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Attendance Register ── */
function AttendanceRegister() {
  const [shown, setShown] = useState(false);
  const [filters, setFilters] = useState({ course: '', month: '3', year: '2026' });
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const days = Array.from({ length: 10 }, (_, i) => i + 1); // show 10 days for demo

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Attendance Register (Monthly)</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field"><label>Course</label>
              <select value={filters.course} onChange={set('course')}><option value="">All</option><option>MBBS</option></select>
            </div>
            <div className="stu-field"><label>Month</label>
              <select value={filters.month} onChange={set('month')}>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                  <option key={m} value={i+1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="stu-field"><label>Year</label>
              <select value={filters.year} onChange={set('year')}><option>2024</option><option>2025</option><option>2026</option></select>
            </div>
          </div>
          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={() => setShown(true)}>View Register</button>
          </div>
        </div>
      </div>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Attendance Register</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead>
                <tr>
                  <th>S.No</th><th>Name</th><th>Roll No</th>
                  {days.map((d) => <th key={d} style={{ minWidth: 30, textAlign: 'center' }}>{d}</th>)}
                  <th>Total P</th><th>Total A</th><th>%</th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((s, i) => {
                  const statuses = days.map(() => Math.random() > 0.2 ? 'P' : 'A');
                  const p = statuses.filter((v) => v === 'P').length;
                  const pct = Math.round((p / days.length) * 100);
                  return (
                    <tr key={s.id}>
                      <td>{i+1}</td><td>{s.name}</td><td>{s.rollNo}</td>
                      {statuses.map((st, di) => (
                        <td key={di} style={{ textAlign: 'center', background: STATUS_COLORS[st], fontSize: 12, fontWeight: 600 }}>{st}</td>
                      ))}
                      <td style={{ color: '#16a34a', fontWeight: 600 }}>{p}</td>
                      <td style={{ color: '#dc2626', fontWeight: 600 }}>{days.length - p}</td>
                      <td><span className={`stu-badge ${pct >= 75 ? 'stu-badge-green' : 'stu-badge-red'}`}>{pct}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Mobile App Attendance ── */
function MobileAttendance() {
  return (
    <div className="stu-filter-card">
      <div className="stu-filter-header">Mobile App Attendance Sync</div>
      <div className="stu-filter-body">
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: '#1d4ed8', marginBottom: 8 }}>📱 Mobile App Integration</div>
          <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
            Attendance captured via mobile app is synced here. Faculty can mark attendance using the MBBS ERP mobile application.
            Records sync automatically every 5 minutes.
          </div>
        </div>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Date</label><input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></div>
          <div className="stu-field"><label>Course</label><select><option>All</option><option>MBBS</option></select></div>
          <div className="stu-field"><label>Faculty</label><select><option>All</option><option>Dr. Sharma</option><option>Dr. Patel</option></select></div>
        </div>
        <div className="stu-btn-row">
          <button className="stu-btn stu-btn-primary" onClick={() => alert("Action")}>Sync Now</button>
          <button className="stu-btn stu-btn-secondary" onClick={() => alert("Action")}>View Synced Records</button>
        </div>
        <div className="stu-table-wrap" style={{ marginTop: 16 }}>
          <div className="stu-table-title">Last Sync Log</div>
          <table className="stu-table">
            <thead><tr><th>Timestamp</th><th>Faculty</th><th>Subject</th><th>Records Synced</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td colSpan={5} style={{ textAlign:'center', padding:20, color:'#9ca3af', fontSize:13 }}>No sync records. Connect backend API to load sync history.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Attendance Reports ── */
function AttendanceReports() {
  const [shown, setShown] = useState(false);
  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Attendance Reports</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field"><label>Course</label><select><option>All</option><option>MBBS</option><option>BDS</option></select></div>
            <div className="stu-field"><label>From Date</label><input type="date" /></div>
            <div className="stu-field"><label>To Date</label><input type="date" /></div>
            <div className="stu-field"><label>Min Attendance %</label><input type="number" placeholder="e.g. 75" min="0" max="100" /></div>
          </div>
          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={() => setShown(true)}>Generate</button>
            <button className="stu-btn stu-btn-secondary" onClick={() => alert("Action")}>Export</button>
          </div>
        </div>
      </div>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Attendance Summary Report</div>
          <table className="stu-table">
            <thead><tr><th>S.No</th><th>Name</th><th>Roll No</th><th>Course</th><th>Classes Held</th><th>Present</th><th>Absent</th><th>Attendance %</th></tr></thead>
            <tbody>
              {STUDENTS.map((s, i) => {
                const held = 120; const present = Math.floor(Math.random() * 40) + 80;
                const pct = Math.round((present/held)*100);
                return (
                  <tr key={s.id}>
                    <td>{i+1}</td><td>{s.name}</td><td>{s.rollNo}</td><td>MBBS</td>
                    <td>{held}</td>
                    <td style={{ color: '#16a34a', fontWeight: 600 }}>{present}</td>
                    <td style={{ color: '#dc2626', fontWeight: 600 }}>{held - present}</td>
                    <td><span className={`stu-badge ${pct >= 75 ? 'stu-badge-green' : 'stu-badge-red'}`}>{pct}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ── Abroad Batch Upload ── */
function AbroadBatchUpload() {
  const [uploadForm, setUploadForm] = useState({
    university: '', country: '', session: '2024-2025', yearSem: 'I-Year',
    fromDate: '', toDate: '', file: null,
  });
  const [uploaded, setUploaded] = useState(false);
  const [uploadedRows, setUploadedRows] = useState([]);
  const set = (k) => (e) => setUploadForm((p) => ({ ...p, [k]: e.target.value }));

  const COUNTRIES = ['Russia', 'China', 'Philippines', 'Kazakhstan', 'Ukraine', 'Georgia', 'Bangladesh'];
  const YEARS = ['I-Year', 'II-Year', 'III-Year', 'IV-Year', 'V-Year', 'VI-Year'];

  const handleUpload = () => {
    if (!uploadForm.university || !uploadForm.country) {
      alert('Please select University and Country before uploading.'); return;
    }
    setUploadedRows([]);
    setUploaded(true);
  };

  return (
    <>
      <div style={{
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8,
        padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#1d4ed8', lineHeight: 1.6
      }}>
        <strong>Abroad Batch Attendance Upload</strong> — For students studying at foreign universities,
        attendance records are sent by the university as a file. Upload the file here to bulk-import
        attendance into the system.
      </div>

      <div className="stu-filter-card">
        <div className="stu-filter-header">Abroad Batch Upload — From University</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Country *</label>
              <select value={uploadForm.country} onChange={set('country')}>
                <option value="">-- Select Country --</option>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>University Name *</label>
              <input
                type="text"
                value={uploadForm.university}
                onChange={set('university')}
                placeholder="e.g. Kazan Federal University"
              />
            </div>
            <div className="stu-field">
              <label>Session</label>
              <select value={uploadForm.session} onChange={set('session')}>
                <option>2024-2025</option><option>2025-2026</option><option>2026-2027</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Year / Sem</label>
              <select value={uploadForm.yearSem} onChange={set('yearSem')}>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>Attendance From Date</label>
              <input type="date" value={uploadForm.fromDate} onChange={set('fromDate')} />
            </div>
            <div className="stu-field">
              <label>Attendance To Date</label>
              <input type="date" value={uploadForm.toDate} onChange={set('toDate')} />
            </div>
          </div>

          <div style={{ marginTop: 8, marginBottom: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Upload Attendance File (Excel / CSV) *
            </label>
            <div style={{
              border: '2px dashed #bfdbfe', borderRadius: 8, padding: '20px 16px',
              textAlign: 'center', background: '#f8faff', cursor: 'pointer'
            }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                Drag &amp; drop file here, or click to browse
              </div>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setUploadForm((p) => ({ ...p, file: e.target.files[0] }))}
                style={{ fontSize: 12 }}
              />
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                Supported: .xlsx, .xls, .csv — Max 5MB
              </div>
            </div>
          </div>

          <div style={{
            background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6,
            padding: '10px 14px', fontSize: 12, color: '#374151', marginTop: 12, marginBottom: 4
          }}>
            <strong>Expected file format:</strong> Roll No | Student Name | Subject | Period | Date | Status (P/A/L)
          </div>

          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={handleUpload}>Upload &amp; Process</button>
            <button className="stu-btn stu-btn-secondary" onClick={() => alert("Action")}>Download Template</button>
          </div>
        </div>
      </div>

      {uploaded && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">
            Upload Result — {uploadForm.university} | {uploadForm.country} | {uploadForm.yearSem}
          </div>
          {uploadedRows.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ color: '#9ca3af', fontSize: 13, marginBottom: 12 }}>
                No file uploaded yet. Select a file and click Upload &amp; Process.
              </div>
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
                padding: '12px 16px', fontSize: 12, color: '#15803d', textAlign: 'left', maxWidth: 420, margin: '0 auto'
              }}>
                <strong>How it works:</strong><br />
                1. Download the template<br />
                2. Fill attendance data from the university report<br />
                3. Upload the filled file<br />
                4. System maps Roll No to student record<br />
                5. Attendance is saved against the selected session &amp; year
              </div>
            </div>
          ) : (
            <table className="stu-table">
              <thead>
                <tr><th>#</th><th>Roll No</th><th>Name</th><th>Subject</th><th>Date</th><th>Status</th><th>Mapped</th></tr>
              </thead>
              <tbody>
                {uploadedRows.map((r, i) => (
                  <tr key={i}>
                    <td>{i+1}</td><td>{r.rollNo}</td><td>{r.name}</td>
                    <td>{r.subject}</td><td>{r.date}</td>
                    <td><span className={`stu-badge ${r.status==='P'?'stu-badge-green':'stu-badge-red'}`}>{r.status}</span></td>
                    <td><span className="stu-badge stu-badge-green">✓</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="stu-table-wrap" style={{ marginTop: 16 }}>
        <div className="stu-table-title">Previous Uploads</div>
        <div className="stu-empty">No previous uploads found. Connect to backend API to load history.</div>
      </div>
    </>
  );
}

const ATT_TABS = [
  { id: 'daily',    label: 'Daily Attendance',        Component: DailyAttendance },
  { id: 'register', label: 'Attendance Register',     Component: AttendanceRegister },
  { id: 'abroad',   label: 'Abroad Batch Upload',     Component: AbroadBatchUpload },
  { id: 'mobile',   label: 'Mobile App Attendance',   Component: MobileAttendance },
  { id: 'reports',  label: 'Attendance Reports',      Component: AttendanceReports },
];

export default function StudentAttendance() {
  const [active, setActive] = useState('daily');
  const tab = ATT_TABS.find((t) => t.id === active);
  const PageComp = tab.Component;

  return (
    <div>
      <div className="stu-tabs">
        {ATT_TABS.map((t) => (
          <div key={t.id} className={`stu-tab ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
            {t.label}
          </div>
        ))}
      </div>
      <PageComp />
    </div>
  );
}
