import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import { useState } from "react";

/* ─────────────────────────────────────────────
   SHARED CONSTANTS
───────────────────────────────────────────── */
const COURSES = ["MBBS", "BDS", "BAMS"];
const BRANCHES = ["Medicine", "Surgery", "Paediatrics", "Gynaecology"];
const BATCHES = ["2024-2030", "2023-2029", "2022-2028"];
const SUBJECTS = ["All", "Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology"];
const today = new Date().toISOString().split("T")[0];

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
function FilterForm({ fields, onSubmit }) {
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
        <button style={S.btnPrimary} onClick={() => onSubmit(vals)}>Submit</button>
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
   1. STUDENT ATTENDANCE
───────────────────────────────────────────── */
const MOCK_STUDENTS = [
  { id: 1, name: "Arjun Nair", mobile: "9876543210", father: "Ramesh Nair", category: "General", class: "I-SEM", branch: "Medicine", status: "P" },
  { id: 2, name: "Priya Sharma", mobile: "9876543211", father: "Suresh Sharma", category: "OBC", class: "I-SEM", branch: "Medicine", status: "P" },
  { id: 3, name: "Kavya Menon", mobile: "9876543212", father: "Mohan Menon", category: "General", class: "I-SEM", branch: "Medicine", status: "A" },
  { id: 4, name: "Rahul Das", mobile: "9876543213", father: "Bikash Das", category: "SC", class: "I-SEM", branch: "Medicine", status: "L" },
  { id: 5, name: "Sneha Pillai", mobile: "9876543214", father: "Arun Pillai", category: "General", class: "I-SEM", branch: "Medicine", status: "P" },
];

function StudentAttendancePage() {
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({});
  const [rows, setRows] = useState([]);

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
    setRows(MOCK_STUDENTS.map(s => ({ ...s })));
    setSubmitted(true);
  };

  const updateStatus = (id, val) => setRows(r => r.map(s => s.id === id ? { ...s, status: val } : s));
  const counts = { P: rows.filter(r => r.status === "P").length, A: rows.filter(r => r.status === "A").length, L: rows.filter(r => r.status === "L").length };
  const statusColor = { P: "#28a745", A: "#dc3545", L: "#fd7e14" };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>Student Attendance</div>
        <div style={S.cardBody}><FilterForm fields={fields} onSubmit={handleSubmit} /></div>
      </div>

      {submitted && (
        <div style={S.card}>
          <div style={{ ...S.header, background: "#34495e", borderRadius: "6px 6px 0 0" }}>
            Student Attendance ( {formatD(filters.date)} ) |
          </div>
          <div style={S.cardBody}>
            <table style={S.table}>
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
              <button style={S.btnPrimary} onClick={() => alert("Action")}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. STUDENT ATTENDANCE DETAILS
───────────────────────────────────────────── */
const MOCK_ATT_DETAILS = [
  { sno:1, p:18, a:2, l:1, total:21, name:"Arjun Nair", father:"Ramesh Nair", dob:"15-Jun-2001", category:"General", phone:"0484-222111", mobile:"9876543210" },
  { sno:2, p:20, a:0, l:1, total:21, name:"Priya Sharma", father:"Suresh Sharma", dob:"22-Mar-2002", category:"OBC", phone:"0484-222112", mobile:"9876543211" },
  { sno:3, p:15, a:4, l:2, total:21, name:"Kavya Menon", father:"Mohan Menon", dob:"10-Nov-2001", category:"General", phone:"0484-222113", mobile:"9876543212" },
  { sno:4, p:19, a:1, l:1, total:21, name:"Rahul Das", father:"Bikash Das", dob:"05-Aug-2002", category:"SC", phone:"0484-222114", mobile:"9876543213" },
];

function StudentAttendanceDetails() {
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({});

  const fields = [
    { name: "course", label: "Course", type: "select", options: ["Select", ...COURSES] },
    { name: "branch", label: "Branch Name", type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch", label: "Batch", type: "select", options: ["Select Batch", ...BATCHES] },
    { name: "subject", label: "Subject", type: "select", options: SUBJECTS },
    { name: "startDate", label: "Start Date", type: "date", default: today },
    { name: "endDate", label: "End Date", type: "date", default: today },
  ];

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>Student Attendance Details</div>
        <div style={S.cardBody}><FilterForm fields={fields} onSubmit={v => { setFilters(v); setSubmitted(true); }} /></div>
      </div>

      {submitted && (
        <div style={S.card}>
          <div style={S.cardBody}>
            <InfoBar items={[
              { label: "Course", value: "0" },
              { label: "Branch Name", value: filters.branch },
              { label: "Batch", value: "" },
              { label: "Subject", value: filters.subject || "All" },
            ]} />
            <div style={S.dateBar}>{formatD(filters.startDate)} - {formatD(filters.endDate)}</div>
            <ExportButtons />
            <table style={S.table}>
              <thead>
                <tr>{["SNo.","P","A","L","Total","Name","Father's Name","DOB","Category","Phone","Mobile No"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {MOCK_ATT_DETAILS.map((r, i) => {
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
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   3. APP STUDENT ATTENDANCE DETAILS
───────────────────────────────────────────── */
const MOCK_APP = [
  { sno:1, date:"31-Mar-2026", time:"09:32 AM", page:"1", name:"Arjun Nair", father:"Ramesh Nair", dob:"15-Jun-2001", category:"General", phone:"0484-222111", mobile:"9876543210" },
  { sno:2, date:"31-Mar-2026", time:"09:33 AM", page:"1", name:"Priya Sharma", father:"Suresh Sharma", dob:"22-Mar-2002", category:"OBC", phone:"0484-222112", mobile:"9876543211" },
  { sno:3, date:"30-Mar-2026", time:"10:15 AM", page:"1", name:"Kavya Menon", father:"Mohan Menon", dob:"10-Nov-2001", category:"General", phone:"0484-222113", mobile:"9876543212" },
];

function AppStudentAttendanceDetails() {
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({});

  const fields = [
    { name: "course", label: "Course", type: "select", options: ["Select", ...COURSES] },
    { name: "branch", label: "Branch Name", type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch", label: "Batch", type: "select", options: ["Select Batch", ...BATCHES] },
    { name: "startDate", label: "Start Date", type: "date", default: today },
    { name: "endDate", label: "End Date", type: "date", default: today },
  ];

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>APP Attendance Details</div>
        <div style={S.cardBody}><FilterForm fields={fields} onSubmit={v => { setFilters(v); setSubmitted(true); }} /></div>
      </div>

      {submitted && (
        <div style={S.card}>
          <div style={S.cardBody}>
            <InfoBar items={[
              { label: "Course", value: "0" },
              { label: "Branch Name", value: filters.branch },
              { label: "Batch", value: "" },
              { label: "Subject", value: "" },
            ]} />
            <div style={S.dateBar}>{formatD(filters.startDate)} - {formatD(filters.endDate)}</div>
            <ExportButtons />
            <table style={S.table}>
              <thead>
                <tr>{["SNo.","Date","Time","Page","Name","Father's Name","DOB","Category","Phone","Mobile No"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {MOCK_APP.map((r, i) => {
                  const td = i%2===0?S.td:S.tdAlt;
                  return (
                    <tr key={r.sno}>
                      <td style={td}>{r.sno}</td>
                      <td style={td}>{r.date}</td>
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
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   4. STUDENT ATTENDANCE REGISTER
───────────────────────────────────────────── */
const DATE_KEYS = ["31-Mar","30-Mar","29-Mar","28-Mar","27-Mar","26-Mar","25-Mar"];
const MOCK_REG = [
  { sno:1, name:"Arjun Nair", roll:"MB001", records:{"31-Mar":"P","30-Mar":"P","29-Mar":"A","28-Mar":"P","27-Mar":"L","26-Mar":"P","25-Mar":"P"} },
  { sno:2, name:"Priya Sharma", roll:"MB002", records:{"31-Mar":"P","30-Mar":"A","29-Mar":"P","28-Mar":"P","27-Mar":"P","26-Mar":"P","25-Mar":"A"} },
  { sno:3, name:"Kavya Menon", roll:"MB003", records:{"31-Mar":"A","30-Mar":"P","29-Mar":"P","28-Mar":"L","27-Mar":"P","26-Mar":"A","25-Mar":"P"} },
  { sno:4, name:"Rahul Das", roll:"MB004", records:{"31-Mar":"P","30-Mar":"P","29-Mar":"P","28-Mar":"P","27-Mar":"P","26-Mar":"P","25-Mar":"P"} },
];

function StudentAttendanceRegister() {
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({});
  const statusColor = { P:"#28a745", A:"#dc3545", L:"#fd7e14" };

  const fields = [
    { name: "course", label: "Course", type: "select", options: ["Select", ...COURSES] },
    { name: "branch", label: "Branch Name", type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch", label: "Batch", type: "select", options: ["Select Batch", ...BATCHES] },
    { name: "subject", label: "Subject", type: "select", options: SUBJECTS },
    { name: "startDate", label: "Start Date", type: "date", default: today },
    { name: "endDate", label: "End Date", type: "date", default: today },
  ];

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>Student Attendance Register</div>
        <div style={S.cardBody}><FilterForm fields={fields} onSubmit={v => { setFilters(v); setSubmitted(true); }} /></div>
      </div>

      {submitted && (
        <div style={S.card}>
          <div style={S.cardBody}>
            <InfoBar items={[
              { label: "Course", value: "0" },
              { label: "Branch Name", value: filters.branch },
              { label: "Batch", value: "" },
              { label: "Subject", value: filters.subject || "All" },
            ]} />
            <div style={S.dateBar}>{formatD(filters.startDate)} - {formatD(filters.endDate)}</div>
            <ExportButtons />
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>SNo.</th>
                    <th style={S.th}>Roll No</th>
                    <th style={S.th}>Name</th>
                    {DATE_KEYS.map(d => <th key={d} style={{ ...S.th, textAlign:"center", minWidth:"56px" }}>{d}</th>)}
                    <th style={S.th}>P</th>
                    <th style={S.th}>A</th>
                    <th style={S.th}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_REG.map((r, i) => {
                    const p = Object.values(r.records).filter(v=>v==="P").length;
                    const a = Object.values(r.records).filter(v=>v==="A").length;
                    const pct = Math.round((p/DATE_KEYS.length)*100);
                    const td = i%2===0?S.td:S.tdAlt;
                    return (
                      <tr key={r.sno}>
                        <td style={td}>{r.sno}</td>
                        <td style={td}>{r.roll}</td>
                        <td style={td}>{r.name}</td>
                        {DATE_KEYS.map(d => (
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
