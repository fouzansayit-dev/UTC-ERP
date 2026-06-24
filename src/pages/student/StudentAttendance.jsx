import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import { useState, useEffect } from "react";
import ModuleGuide from '../../components/ModuleGuide.jsx';

/* ─────────────────────────────────────────────
   SHARED CONSTANTS
   ───────────────────────────────────────────── */
const COURSES = ["MBBS", "BDS", "BAMS"];
const BRANCHES = ["Medicine", "Surgery", "Paediatrics", "Gynaecology"];
const BATCHES = ["2024-2030", "2023-2029", "2022-2028"];
const SUBJECTS = ["All", "Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology"];
const today = new Date().toISOString().split("T")[0];

const ATTENDANCE_STEPS = [
  { title: "Select Student Group", desc: "Choose the target Course, Branch, and Batch, along with a default attendance value (e.g. Present)." },
  { title: "Review & Adjust Attendance", desc: "A grid of all enrolled students in that group will load. Toggle specific students to 'A' (Absent) or 'L' (Leave) as necessary." },
  { title: "Submit and Notify Parents", desc: "Save the attendance log. SMS notifications will automatically be dispatched to parents if SMS is enabled." },
  { title: "View Reports & History", desc: "Navigate to the details or register tabs to track monthly percentages, active rosters, and export reports to CSV/Print." }
];
const ATTENDANCE_TIPS = [
  "Attendance rates below 75% are highlighted in red automatically.",
  "You can export all tables to CSV, print them, or copy them to your clipboard.",
  "Ensure the correct session and batch are selected before submitting records."
];

/* ─────────────────────────────────────────────
   STYLES
   ───────────────────────────────────────────── */
const S = {
  page: { padding: "24px", fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#333" },
  header: { background: "#2c3e50", color: "#fff", padding: "12px 20px", borderRadius: "6px 6px 0 0", fontSize: "16px", fontWeight: "bold" },
  card: { background: "#fff", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "24px" },
  cardBody: { padding: "20px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  label: { display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "13px", color: "#555" },
  input: { width: "100%", padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" },
  select: { width: "100%", padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box", background: "#fff" },
  btnPrimary: { background: "#2c3e50", color: "#fff", border: "none", padding: "8px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
  btnSecondary: { background: "#6c757d", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: { background: "#2c3e50", color: "#fff", padding: "9px 10px", textAlign: "left", border: "1px solid #444" },
  td: { padding: "8px 10px", border: "1px solid #ddd", verticalAlign: "middle" },
  tdAlt: { padding: "8px 10px", border: "1px solid #ddd", verticalAlign: "middle", background: "#f9f9f9" },
  badge: { padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  filterRow: { display: "flex", justifyContent: "flex-end", marginBottom: "12px", gap: "8px" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", marginBottom: "16px", background: "#f0f4f8", padding: "10px", borderRadius: "4px" },
  infoLabel: { fontSize: "11px", color: "#666", marginBottom: "2px" },
  infoVal: { fontSize: "13px", fontWeight: "bold", color: "#2c3e50" },
  dateBar: { textAlign: "center", marginBottom: "12px", fontSize: "13px", color: "#555", fontWeight: "600" },
};

/* ─────────────────────────────────────────────
   SHARED FILTER FORM
   ───────────────────────────────────────────── */
function FilterForm({ fields, onSubmit, loading }) {
  const [vals, setVals] = useState(() => {
    const init = {};
    fields.forEach(f => { init[f.name] = f.default || ""; });
    return init;
  });
  const set = (k, v) => setVals(p => ({ ...p, [k]: v }));
  return (
    <div>
      <div style={S.grid2}>
        {fields.map(f => (
          <div key={f.name}>
            <label style={S.label}>{f.label}</label>
            {f.type === "select"
              ? <select style={S.select} value={vals[f.name]} onChange={e => set(f.name, e.target.value)}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              : <input style={S.input} type={f.type || "text"} value={vals[f.name]} onChange={e => set(f.name, e.target.value)} />
            }
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <button style={S.btnPrimary} data-tour="submit-filters" onClick={() => onSubmit(vals)} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

function InfoBar({ items }) {
  return (
    <div style={S.infoGrid}>
      {items.map(item => (
        <div key={item.label}>
          <div style={S.infoLabel}>{item.label}</div>
          <div style={S.infoVal}>{item.value || "\u00A0"}</div>
        </div>
      ))}
    </div>
  );
}

function ExportButtons() {
  return (
    <div style={S.filterRow}>
      {["Copy", "CSV", "Print"].map(b => <button key={b} style={S.btnSecondary} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'StudentAttendance'); else handlePrint('Student Attendance'); }}>{b}</button>)}
    </div>
  );
}

function formatD(d) {
  return d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
}

/* ─────────────────────────────────────────────
   1. STUDENT ATTENDANCE PAGE
   ───────────────────────────────────────────── */
function StudentAttendancePage() {
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "course", label: "Course", type: "select", options: ["Select", ...COURSES] },
    { name: "branch", label: "Branch Name", type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch", label: "Batch", type: "select", options: ["Select Batch", ...BATCHES] },
    { name: "date", label: "Date", type: "date", default: today },
    { name: "subject", label: "Subject", type: "select", options: SUBJECTS },
    { name: "defaultValue", label: "Default Value", type: "select", options: ["P", "A", "L"] },
    { name: "sms", label: "SMS", type: "select", options: ["Yes", "No"] },
  ];

  const handleSubmit = (vals) => {
    setFilters(vals);
    setLoading(true);
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(s => 
          (s.course || '').toLowerCase() === (vals.course || '').toLowerCase() &&
          (s.branch || '').toLowerCase() === (vals.branch || '').toLowerCase() &&
          (s.batch || '').toLowerCase() === (vals.batch || '').toLowerCase()
        );
        setRows(filtered.map(s => ({
          id: s.id,
          name: s.name,
          mobile: s.mobile || s.phone || '—',
          father: s.father_name || s.father || '—',
          category: s.category || 'General',
          class: s.batch,
          branch: s.branch,
          status: vals.defaultValue || 'P'
        })));
        setSubmitted(true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setRows([]);
        setSubmitted(true);
        setLoading(false);
      });
  };

  const handleSave = () => {
    setLoading(true);
    fetch('/api/generic/student-attendance/records')
      .then(res => res.json())
      .then(existing => {
        const list = Array.isArray(existing) ? existing : [];
        const newRecord = {
          id: Date.now().toString(),
          date: filters.date,
          course: filters.course,
          branch: filters.branch,
          batch: filters.batch,
          subject: filters.subject,
          records: rows.map(r => ({
            id: r.id,
            name: r.name,
            mobile: r.mobile,
            father: r.father,
            category: r.category,
            status: r.status
          }))
        };

        const filteredList = list.filter(item => 
          !(item.date === newRecord.date && 
            item.course === newRecord.course && 
            item.branch === newRecord.branch && 
            item.batch === newRecord.batch && 
            item.subject === newRecord.subject)
        );

        const updatedList = [...filteredList, newRecord];

        return fetch('/api/generic/student-attendance/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedList)
        });
      })
      .then(res => res.json())
      .then(() => {
        alert("Attendance record saved successfully!");
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to save: " + err.message);
        setLoading(false);
      });
  };

  const updateStatus = (id, val) => setRows(r => r.map(s => s.id === id ? { ...s, status: val } : s));
  const counts = { P: rows.filter(r => r.status === "P").length, A: rows.filter(r => r.status === "A").length, L: rows.filter(r => r.status === "L").length };
  const statusColor = { P: "#28a745", A: "#dc3545", L: "#fd7e14" };

  return (
    <div style={S.page}>
      <ModuleGuide title="Daily Student Attendance Guide" steps={ATTENDANCE_STEPS} tips={ATTENDANCE_TIPS} />
      
      <div style={S.card} data-tour="attendance-filters">
        <div style={S.header}>Student Attendance</div>
        <div style={S.cardBody}><FilterForm fields={fields} onSubmit={handleSubmit} loading={loading} /></div>
      </div>

      {submitted && (
        <div style={S.card}>
          <div style={{ ...S.header, background: "#34495e", borderRadius: "6px 6px 0 0" }}>
            Student Attendance ( {formatD(filters.date)} )
          </div>
          <div style={S.cardBody}>
            {rows.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                <p style={{ fontWeight: 600, fontSize: '15px', margin: '0 0 4px 0' }}>No Enrolled Students Found</p>
                <p style={{ fontSize: '13px', margin: 0 }}>There are no students registered under Course: {filters.course}, Branch: {filters.branch}, Batch: {filters.batch}. Please admit students in the Student Module first.</p>
              </div>
            ) : (
              <>
                <table style={S.table} data-tour="attendance-table">
                  <thead>
                    <tr>{["Name","Attendance","Mobile No","Father's Name","Category","Class","Branch"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.id}>
                        <td style={i%2===0?S.td:S.tdAlt}>{r.name}</td>
                        <td style={i%2===0?S.td:S.tdAlt}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            {["P","A","L"].map(s => (
                              <label key={s} style={{ display: "flex", alignItems: "center", gap: "3px", cursor: "pointer" }}>
                                <input type="radio" name={`att_${r.id}`} checked={r.status===s} onChange={() => updateStatus(r.id, s)} />
                                <span style={{ fontWeight: "bold", color: statusColor[s] }}>{s}</span>
                              </label>
                            ))}
                          </div>
                        </td>
                        <td style={i%2===0?S.td:S.tdAlt}>{r.mobile}</td>
                        <td style={i%2===0?S.td:S.tdAlt}>{r.father}</td>
                        <td style={i%2===0?S.td:S.tdAlt}>{r.category}</td>
                        <td style={i%2===0?S.td:S.tdAlt}>{r.class}</td>
                        <td style={i%2===0?S.td:S.tdAlt}>{r.branch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    {[["P","#28a745"],["A","#dc3545"],["L","#fd7e14"]].map(([k,c]) => (
                      <span key={k} style={{ display: "inline-block", padding: "6px 18px", borderRadius: "4px", marginRight: "12px", fontWeight: "bold", fontSize: "13px", background: c+"22", border: `1px solid ${c}`, color: c }}>
                        {k} - {counts[k]}
                      </span>
                    ))}
                  </div>
                  <button style={S.btnPrimary} data-tour="submit-attendance" onClick={handleSave}>Submit</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. STUDENT ATTENDANCE DETAILS
   ───────────────────────────────────────────── */
function StudentAttendanceDetails() {
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "course", label: "Course", type: "select", options: ["Select", ...COURSES] },
    { name: "branch", label: "Branch Name", type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch", label: "Batch", type: "select", options: ["Select Batch", ...BATCHES] },
    { name: "subject", label: "Subject", type: "select", options: SUBJECTS },
    { name: "startDate", label: "Start Date", type: "date", default: today },
    { name: "endDate", label: "End Date", type: "date", default: today },
  ];

  const handleSubmit = (vals) => {
    setFilters(vals);
    setLoading(true);
    fetch('/api/generic/student-attendance/records')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter(item => {
          if (vals.course && vals.course !== 'Select' && item.course !== vals.course) return false;
          if (vals.branch && vals.branch !== 'Select' && item.branch !== vals.branch) return false;
          if (vals.batch && vals.batch !== 'Select Batch' && item.batch !== vals.batch) return false;
          if (vals.subject && vals.subject !== 'All' && item.subject !== vals.subject) return false;
          if (item.date < vals.startDate || item.date > vals.endDate) return false;
          return true;
        });

        const studentSummary = {};
        filtered.forEach(log => {
          log.records.forEach(r => {
            if (!studentSummary[r.id]) {
              studentSummary[r.id] = {
                sno: Object.keys(studentSummary).length + 1,
                name: r.name,
                father: r.father,
                dob: r.dob || '—',
                category: r.category || 'General',
                phone: r.phone || '—',
                mobile: r.mobile || '—',
                p: 0, a: 0, l: 0, total: 0
              };
            }
            studentSummary[r.id].total += 1;
            if (r.status === 'P') studentSummary[r.id].p += 1;
            else if (r.status === 'A') studentSummary[r.id].a += 1;
            else if (r.status === 'L') studentSummary[r.id].l += 1;
          });
        });

        setHistory(Object.values(studentSummary));
        setSubmitted(true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setHistory([]);
        setSubmitted(true);
        setLoading(false);
      });
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>Student Attendance Details</div>
        <div style={S.cardBody}><FilterForm fields={fields} onSubmit={handleSubmit} loading={loading} /></div>
      </div>

      {submitted && (
        <div style={S.card}>
          <div style={S.cardBody}>
            <InfoBar items={[
              { label: "Course", value: filters.course !== 'Select' ? filters.course : '—' },
              { label: "Branch Name", value: filters.branch !== 'Select' ? filters.branch : '—' },
              { label: "Batch", value: filters.batch !== 'Select Batch' ? filters.batch : '—' },
              { label: "Subject", value: filters.subject || "All" },
            ]} />
            <div style={S.dateBar}>{formatD(filters.startDate)} - {formatD(filters.endDate)}</div>
            
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                No attendance logs found matching these dates and categories.
              </div>
            ) : (
              <>
                <ExportButtons />
                <table style={S.table}>
                  <thead>
                    <tr>{["SNo.","P","A","L","Total","Name","Father's Name","DOB","Category","Phone","Mobile No"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {history.map((r, i) => {
                      const pct = Math.round((r.p / r.total)*100);
                      const td = i%2===0?S.td:S.tdAlt;
                      return (
                        <tr key={r.sno}>
                          <td style={td}>{r.sno}</td>
                          <td style={{...td, color:"#28a745", fontWeight:"bold"}}>{r.p}</td>
                          <td style={{...td, color:"#dc3545", fontWeight:"bold"}}>{r.a}</td>
                          <td style={{...td, color:"#fd7e14", fontWeight:"bold"}}>{r.l}</td>
                          <td style={td}><span style={{...S.badge, background:pct>=75?"#d4edda":"#f8d7da", color:pct>=75?"#155724":"#721c24"}}>{r.total} ({pct}%)</span></td>
                          <td style={td}>{r.name}</td>
                          <td style={td}>{r.father}</td>
                          <td style={td}>{r.dob}</td>
                          <td style={td}>{r.category}</td>
                          <td style={td}>{r.phone}</td>
                          <td style={td}>{r.mobile}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   3. APP STUDENT ATTENDANCE DETAILS
   ───────────────────────────────────────────── */
function AppStudentAttendanceDetails() {
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "course", label: "Course", type: "select", options: ["Select", ...COURSES] },
    { name: "branch", label: "Branch Name", type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch", label: "Batch", type: "select", options: ["Select Batch", ...BATCHES] },
    { name: "startDate", label: "Start Date", type: "date", default: today },
    { name: "endDate", label: "End Date", type: "date", default: today },
  ];

  const handleSubmit = (vals) => {
    setFilters(vals);
    setLoading(true);
    fetch('/api/generic/student-attendance/records')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter(item => {
          if (vals.course && vals.course !== 'Select' && item.course !== vals.course) return false;
          if (vals.branch && vals.branch !== 'Select' && item.branch !== vals.branch) return false;
          if (vals.batch && vals.batch !== 'Select Batch' && item.batch !== vals.batch) return false;
          if (item.date < vals.startDate || item.date > vals.endDate) return false;
          return true;
        });

        const flattened = [];
        filtered.forEach(log => {
          log.records.forEach(r => {
            flattened.push({
              sno: flattened.length + 1,
              date: log.date,
              time: "09:00 AM",
              page: "1",
              name: r.name,
              father: r.father,
              dob: r.dob || "—",
              category: r.category,
              phone: r.phone || "—",
              mobile: r.mobile
            });
          });
        });

        setLogs(flattened);
        setSubmitted(true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLogs([]);
        setSubmitted(true);
        setLoading(false);
      });
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>APP Attendance Details</div>
        <div style={S.cardBody}><FilterForm fields={fields} onSubmit={handleSubmit} loading={loading} /></div>
      </div>

      {submitted && (
        <div style={S.card}>
          <div style={S.cardBody}>
            <InfoBar items={[
              { label: "Course", value: filters.course !== 'Select' ? filters.course : '—' },
              { label: "Branch Name", value: filters.branch !== 'Select' ? filters.branch : '—' },
              { label: "Batch", value: filters.batch !== 'Select Batch' ? filters.batch : '—' },
              { label: "Subject", value: "—" },
            ]} />
            <div style={S.dateBar}>{formatD(filters.startDate)} - {formatD(filters.endDate)}</div>
            
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                No APP mobile logs recorded for this period.
              </div>
            ) : (
              <>
                <ExportButtons />
                <table style={S.table}>
                  <thead>
                    <tr>{["SNo.","Date","Time","Page","Name","Father's Name","DOB","Category","Phone","Mobile No"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {logs.map((r, i) => {
                      const td = i%2===0?S.td:S.tdAlt;
                      return (
                        <tr key={r.sno}>
                          <td style={td}>{r.sno}</td>
                          <td style={td}>{formatD(r.date)}</td>
                          <td style={td}>{r.time}</td>
                          <td style={td}>{r.page}</td>
                          <td style={td}>{r.name}</td>
                          <td style={td}>{r.father}</td>
                          <td style={td}>{r.dob}</td>
                          <td style={td}>{r.category}</td>
                          <td style={td}>{r.phone}</td>
                          <td style={td}>{r.mobile}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   4. STUDENT ATTENDANCE REGISTER
   ───────────────────────────────────────────── */
function StudentAttendanceRegister() {
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({});
  const [dateKeys, setDateKeys] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const statusColor = { P:"#28a745", A:"#dc3545", L:"#fd7e14" };

  const fields = [
    { name: "course", label: "Course", type: "select", options: ["Select", ...COURSES] },
    { name: "branch", label: "Branch Name", type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch", label: "Batch", type: "select", options: ["Select Batch", ...BATCHES] },
    { name: "subject", label: "Subject", type: "select", options: SUBJECTS },
    { name: "startDate", label: "Start Date", type: "date", default: today },
    { name: "endDate", label: "End Date", type: "date", default: today },
  ];

  const handleSubmit = (vals) => {
    setFilters(vals);
    setLoading(true);
    fetch('/api/generic/student-attendance/records')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter(item => {
          if (vals.course && vals.course !== 'Select' && item.course !== vals.course) return false;
          if (vals.branch && vals.branch !== 'Select' && item.branch !== vals.branch) return false;
          if (vals.batch && vals.batch !== 'Select Batch' && item.batch !== vals.batch) return false;
          if (vals.subject && vals.subject !== 'All' && item.subject !== vals.subject) return false;
          if (item.date < vals.startDate || item.date > vals.endDate) return false;
          return true;
        });

        // Pull unique dates in order
        const dates = [...new Set(filtered.map(item => item.date))].sort();
        const keys = dates.map(d => {
          const dateObj = new Date(d);
          return dateObj.toLocaleDateString("en-GB", { day: '2-digit', month: 'short' });
        });
        setDateKeys(keys);

        const studentMap = {};
        filtered.forEach(log => {
          const dateStr = new Date(log.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' });
          log.records.forEach(r => {
            if (!studentMap[r.id]) {
              studentMap[r.id] = {
                sno: Object.keys(studentMap).length + 1,
                name: r.name,
                roll: r.roll || `STU-${String(r.id).padStart(3, '0')}`,
                records: {}
              };
            }
            studentMap[r.id].records[dateStr] = r.status;
          });
        });

        setRows(Object.values(studentMap));
        setSubmitted(true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setRows([]);
        setSubmitted(true);
        setLoading(false);
      });
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>Student Attendance Register</div>
        <div style={S.cardBody}><FilterForm fields={fields} onSubmit={handleSubmit} loading={loading} /></div>
      </div>

      {submitted && (
        <div style={S.card}>
          <div style={S.cardBody}>
            <InfoBar items={[
              { label: "Course", value: filters.course !== 'Select' ? filters.course : '—' },
              { label: "Branch Name", value: filters.branch !== 'Select' ? filters.branch : '—' },
              { label: "Batch", value: filters.batch !== 'Select Batch' ? filters.batch : '—' },
              { label: "Subject", value: filters.subject || "All" },
            ]} />
            <div style={S.dateBar}>{formatD(filters.startDate)} - {formatD(filters.endDate)}</div>
            
            {rows.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                No daily attendance logs mapped for this period.
              </div>
            ) : (
              <>
                <ExportButtons />
                <div style={{ overflowX: "auto" }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>SNo.</th>
                        <th style={S.th}>Roll No</th>
                        <th style={S.th}>Name</th>
                        {dateKeys.map(d => <th key={d} style={{ ...S.th, textAlign:"center", minWidth:"56px" }}>{d}</th>)}
                        <th style={S.th}>P</th>
                        <th style={S.th}>A</th>
                        <th style={S.th}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => {
                        const p = Object.values(r.records).filter(v=>v==="P").length;
                        const a = Object.values(r.records).filter(v=>v==="A").length;
                        const pct = dateKeys.length > 0 ? Math.round((p/dateKeys.length)*100) : 0;
                        const td = i%2===0?S.td:S.tdAlt;
                        return (
                          <tr key={r.sno}>
                            <td style={td}>{r.sno}</td>
                            <td style={td}>{r.roll}</td>
                            <td style={td}>{r.name}</td>
                            {dateKeys.map(d => (
                              <td key={d} style={{...td, textAlign:"center", fontWeight:"bold", color:statusColor[r.records[d]]||"#333"}}>
                                {r.records[d]||"-"}
                              </td>
                            ))}
                            <td style={{...td,color:"#28a745",fontWeight:"bold"}}>{p}</td>
                            <td style={{...td,color:"#dc3545",fontWeight:"bold"}}>{a}</td>
                            <td style={td}><span style={{...S.badge,background:pct>=75?"#d4edda":"#f8d7da",color:pct>=75?"#155724":"#721c24"}}>{pct}%</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   EXPORT
   ───────────────────────────────────────────── */
export const STUDENT_ATTENDANCE_SUBMODULES = [
  { id: "student-attendance", label: "Student Attendance" },
  { id: "student-attendance-details", label: "Student Attendance Details" },
  { id: "app-attendance-details", label: "APP Student Attendance Details" },
  { id: "attendance-register", label: "Student Attendance Register" },
];

export default function StudentAttendanceModule({ activeSub, onBack }) {
  switch (activeSub) {
    case "student-attendance-details": return <StudentAttendanceDetails />;
    case "app-attendance-details": return <AppStudentAttendanceDetails />;
    case "attendance-register": return <StudentAttendanceRegister />;
    default: return <StudentAttendancePage />;
  }
}
