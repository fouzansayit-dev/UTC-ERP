import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import { useState } from "react";

/* ─────────────────────────────────────────────
   SHARED CONSTANTS
───────────────────────────────────────────── */
const COURSES = ["MBBS", "BDS", "BAMS"];
const BRANCHES = ["Medicine", "Surgery", "Paediatrics", "Gynaecology"];
const BATCHES = ["2024-2030", "2023-2029", "2022-2028"];
const SUBJECTS = ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "Community Medicine"];
const YEARS = ["NA", "I-SEM", "II-SEM", "III-SEM", "IV-SEM", "V-SEM", "VI-SEM"];
const TYPES = ["Theory", "Practical", "Tutorial", "Clinical"];
const today = new Date().toISOString().split("T")[0];

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const S = {
  page: { padding: "24px", fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#333" },
  header: { background: "#2c3e50", color: "#fff", padding: "12px 20px", borderRadius: "6px 6px 0 0", fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px" },
  card: { background: "#fff", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "24px" },
  cardBody: { padding: "20px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  label: { display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "13px", color: "#555" },
  input: { width: "100%", padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box", resize: "vertical", minHeight: "70px" },
  select: { width: "100%", padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box", background: "#fff" },
  btnPrimary: { background: "#2c3e50", color: "#fff", border: "none", padding: "8px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
  btnSecondary: { background: "#6c757d", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  btnView: { background: "#17a2b8", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  btnEdit: { background: "#17a2b8", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", marginRight: "4px" },
  btnDelete: { background: "#dc3545", color: "#fff", border: "none", width: "26px", height: "26px", borderRadius: "50%", cursor: "pointer", fontSize: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: { background: "#2c3e50", color: "#fff", padding: "9px 10px", textAlign: "left", border: "1px solid #444" },
  td: { padding: "8px 10px", border: "1px solid #ddd", verticalAlign: "middle" },
  tdAlt: { padding: "8px 10px", border: "1px solid #ddd", verticalAlign: "middle", background: "#f9f9f9" },
  filterRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  searchInput: { padding: "6px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", width: "200px" },
  badge: { padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", fontSize: "12px", color: "#666" },
  tabs: { display: "flex", gap: "0", marginBottom: "0", borderBottom: "2px solid #2c3e50" },
  tab: { padding: "8px 20px", cursor: "pointer", fontSize: "13px", border: "1px solid #ddd", borderBottom: "none", borderRadius: "4px 4px 0 0", marginRight: "4px", background: "#f5f5f5" },
  tabActive: { padding: "8px 20px", cursor: "pointer", fontSize: "13px", border: "1px solid #2c3e50", borderBottom: "2px solid #fff", borderRadius: "4px 4px 0 0", marginRight: "4px", background: "#fff", color: "#2c3e50", fontWeight: "bold", marginBottom: "-2px" },
};

/* ─────────────────────────────────────────────
   LESSON PLAN MODULE
───────────────────────────────────────────── */
const EMPTY_FORM = {
  course: "", branch: "", batch: "", year: "NA",
  subject: "", type: "Theory", date: today,
  topic: "", description: "", duration: "",
  faculty: "", unit: "", competency: "",
};

const INITIAL_PLANS = [
  { id: 1, course: "MBBS", branch: "Medicine", batch: "2024-2030", year: "I-SEM", subject: "Anatomy", type: "Theory", date: "2026-03-28", topic: "Upper Limb — Shoulder Joint", description: "Structure and movements of shoulder joint, clinical significance", duration: "60", faculty: "Dr. Santos", unit: "Unit 3", competency: "AN28.1" },
  { id: 2, course: "MBBS", branch: "Medicine", batch: "2024-2030", year: "I-SEM", subject: "Physiology", type: "Theory", date: "2026-03-28", topic: "Cardiac Cycle", description: "Events of cardiac cycle, pressure-volume relationships", duration: "75", faculty: "Dr. Alves", unit: "Unit 2", competency: "PY5.1" },
  { id: 3, course: "MBBS", branch: "Medicine", batch: "2024-2030", year: "I-SEM", subject: "Biochemistry", type: "Practical", date: "2026-03-29", topic: "Qualitative Analysis of Proteins", description: "Biuret test, Millon's test, xanthoproteic test", duration: "120", faculty: "Dr. Ferreira", unit: "Unit 1", competency: "BI2.3" },
  { id: 4, course: "MBBS", branch: "Medicine", batch: "2024-2030", year: "I-SEM", subject: "Anatomy", type: "Tutorial", date: "2026-03-30", topic: "Brachial Plexus", description: "Roots, trunks, divisions, cords and branches", duration: "45", faculty: "Dr. Santos", unit: "Unit 3", competency: "AN30.2" },
  { id: 5, course: "MBBS", branch: "Medicine", batch: "2024-2030", year: "I-SEM", subject: "Pathology", type: "Theory", date: "2026-03-31", topic: "Cell Injury", description: "Types of cell injury, necrosis vs apoptosis", duration: "60", faculty: "Dr. Costa", unit: "Unit 1", competency: "PA1.1" },
];

const TYPE_COLORS = {
  Theory: { bg: "#e3f2fd", color: "#1565c0" },
  Practical: { bg: "#e8f5e9", color: "#2e7d32" },
  Tutorial: { bg: "#fff3e0", color: "#e65100" },
  Clinical: { bg: "#fce4ec", color: "#880e4f" },
};

export default function LessonPlanModule({ submodule }) {
  const [tab, setTab] = useState("entry"); // entry | view
  const [form, setForm] = useState(EMPTY_FORM);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [viewFilters, setViewFilters] = useState({ course: "", branch: "", batch: "", subject: "", startDate: today, endDate: today });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setVF = (k, v) => setViewFilters(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.topic) return;
    if (editId !== null) {
      setPlans(p => p.map(r => r.id === editId ? { ...form, id: editId } : r));
      setEditId(null);
    } else {
      const newId = Math.max(...plans.map(p => p.id), 0) + 1;
      setPlans(p => [...p, { ...form, id: newId }]);
    }
    setForm(EMPTY_FORM);
  };

  const handleEdit = (r) => {
    setForm({ ...r });
    setEditId(r.id);
    setTab("entry");
  };

  const handleDelete = (id) => setPlans(p => p.filter(r => r.id !== id));

  const filtered = plans.filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const viewFields = [
    { name: "course", label: "Course", type: "select", options: ["All", ...COURSES] },
    { name: "branch", label: "Branch", type: "select", options: ["All", ...BRANCHES] },
    { name: "batch", label: "Batch", type: "select", options: ["All", ...BATCHES] },
    { name: "subject", label: "Subject", type: "select", options: ["All", ...SUBJECTS] },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "endDate", label: "End Date", type: "date" },
  ];

  const entryFields = [
    { name: "course", label: "Course", type: "select", options: ["Select", ...COURSES] },
    { name: "branch", label: "Branch Name", type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch", label: "Batch", type: "select", options: ["Select", ...BATCHES] },
    { name: "year", label: "Year/Semester", type: "select", options: YEARS },
    { name: "subject", label: "Subject", type: "select", options: ["Select", ...SUBJECTS] },
    { name: "type", label: "Type", type: "select", options: TYPES },
    { name: "date", label: "Date", type: "date" },
    { name: "duration", label: "Duration (minutes)", type: "number" },
    { name: "unit", label: "Unit", type: "text" },
    { name: "competency", label: "Competency Code", type: "text" },
    { name: "faculty", label: "Faculty", type: "text" },
  ];

  return (
    <div style={S.page}>
      {/* Tabs */}
      <div style={S.tabs}>
        <div style={tab === "entry" ? S.tabActive : S.tab} onClick={() => setTab("entry")}>Lesson Plan Entry</div>
        <div style={tab === "view" ? S.tabActive : S.tab} onClick={() => setTab("view")}>View / Report</div>
      </div>

      {/* ENTRY TAB */}
      {tab === "entry" && (
        <>
          <div style={{ ...S.card, borderRadius: "0 6px 6px 6px" }}>
            <div style={{ ...S.header, borderRadius: "0 6px 0 0" }}>
              {editId !== null ? "Edit Lesson Plan" : "Add Lesson Plan"}
            </div>
            <div style={S.cardBody}>
              <div style={S.grid2}>
                {entryFields.map(f => (
                  <div key={f.name}>
                    <label style={S.label}>{f.label}</label>
                    {f.type === "select"
                      ? <select style={S.select} value={form[f.name]} onChange={e => set(f.name, e.target.value)}>
                          {f.options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      : <input style={S.input} type={f.type || "text"} value={form[f.name]} onChange={e => set(f.name, e.target.value)} />
                    }
                  </div>
                ))}
              </div>
              {/* Full-width fields */}
              <div style={{ marginBottom: "12px" }}>
                <label style={S.label}>Topic</label>
                <input style={S.input} type="text" value={form.topic} onChange={e => set("topic", e.target.value)} placeholder="Enter topic name" />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={S.label}>Description / Teaching Points</label>
                <textarea style={S.textarea} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Enter description, key teaching points, learning objectives..." />
              </div>
              <div style={{ textAlign: "center", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button style={S.btnPrimary} onClick={handleSubmit}>{editId !== null ? "Update" : "Submit"}</button>
                {editId !== null && (
                  <button style={S.btnSecondary} onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}>Cancel</button>
                )}
              </div>
            </div>
          </div>

          {/* List */}
          <div style={S.card}>
            <div style={S.header}>Lesson Plans</div>
            <div style={S.cardBody}>
              <div style={S.filterRow}>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["Copy", "CSV", "Print"].map(b => <button key={b} style={S.btnSecondary} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'LessonPlan'); else handlePrint('Lesson Plan'); }}>{b}</button>)}
                </div>
                <input style={S.searchInput} placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <table style={S.table}>
                <thead>
                  <tr>{["SNo.","Date","Subject","Type","Topic","Unit","Competency","Duration","Faculty","Edit","Delete"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const tc = TYPE_COLORS[r.type] || {};
                    const td = i%2===0?S.td:S.tdAlt;
                    return (
                      <tr key={r.id}>
                        <td style={td}>{i+1}</td>
                        <td style={td}>{r.date}</td>
                        <td style={td}>{r.subject}</td>
                        <td style={td}><span style={{ ...S.badge, background: tc.bg, color: tc.color }}>{r.type}</span></td>
                        <td style={{ ...td, maxWidth: "200px" }}>
                          <div style={{ fontWeight: "600" }}>{r.topic}</div>
                          <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{r.description?.substring(0, 60)}{r.description?.length > 60 ? "..." : ""}</div>
                        </td>
                        <td style={td}>{r.unit}</td>
                        <td style={td}>{r.competency}</td>
                        <td style={td}>{r.duration} min</td>
                        <td style={td}>{r.faculty}</td>
                        <td style={td}>
                          <button style={S.btnEdit} onClick={() => handleEdit(r)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                        </td>
                        <td style={td}>
                          <button style={S.btnDelete} onClick={() => handleDelete(r.id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/><line x1="16" y1="8" x2="8" y2="16"/></svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan="11" style={{ ...S.td, textAlign: "center", color: "#999", padding: "24px" }}>No lesson plans found.</td></tr>
                  )}
                </tbody>
              </table>
              <div style={S.pagination}>
                <span>Showing 1 to {filtered.length} of {filtered.length} entries</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button style={{ padding: "4px 10px", border: "1px solid #ccc", borderRadius: "4px", background: "#fff", cursor: "pointer", fontSize: "12px" }} onClick={() => alert("Action")}>Previous</button>
                  <button style={{ padding: "4px 10px", border: "1px solid #2c3e50", borderRadius: "4px", background: "#2c3e50", color: "#fff", cursor: "pointer", fontSize: "12px" }} onClick={() => alert("Action")}>1</button>
                  <button style={{ padding: "4px 10px", border: "1px solid #ccc", borderRadius: "4px", background: "#fff", cursor: "pointer", fontSize: "12px" }} onClick={() => alert("Action")}>Next</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW TAB */}
      {tab === "view" && (
        <>
          <div style={{ ...S.card, borderRadius: "0 6px 6px 6px" }}>
            <div style={{ ...S.header, borderRadius: "0 6px 0 0" }}>Lesson Plan Report</div>
            <div style={S.cardBody}>
              <div style={S.grid2}>
                {viewFields.map(f => (
                  <div key={f.name}>
                    <label style={S.label}>{f.label}</label>
                    {f.type === "select"
                      ? <select style={S.select} value={viewFilters[f.name]} onChange={e => setVF(f.name, e.target.value)}>
                          {f.options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      : <input style={S.input} type={f.type} value={viewFilters[f.name] || ""} onChange={e => setVF(f.name, e.target.value)} />
                    }
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center" }}>
                <button style={S.btnPrimary} onClick={() => alert("Action")}>Submit</button>
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Total Plans", val: plans.length, color: "#2c3e50", bg: "#ecf0f1" },
              { label: "Theory", val: plans.filter(p=>p.type==="Theory").length, color: "#1565c0", bg: "#e3f2fd" },
              { label: "Practical", val: plans.filter(p=>p.type==="Practical").length, color: "#2e7d32", bg: "#e8f5e9" },
              { label: "Tutorial", val: plans.filter(p=>p.type==="Tutorial").length, color: "#e65100", bg: "#fff3e0" },
            ].map(c => (
              <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.color}33`, borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: c.color }}>{c.val}</div>
                <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>{c.label}</div>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={S.cardBody}>
              <ExportButtons />
              <table style={S.table}>
                <thead>
                  <tr>{["SNo.","Date","Course","Branch","Year","Subject","Type","Topic","Duration","Faculty","Competency"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {plans.map((r, i) => {
                    const tc = TYPE_COLORS[r.type] || {};
                    const td = i%2===0?S.td:S.tdAlt;
                    return (
                      <tr key={r.id}>
                        <td style={td}>{i+1}</td>
                        <td style={td}>{r.date}</td>
                        <td style={td}>{r.course}</td>
                        <td style={td}>{r.branch}</td>
                        <td style={td}>{r.year}</td>
                        <td style={td}>{r.subject}</td>
                        <td style={td}><span style={{...S.badge, background:tc.bg, color:tc.color}}>{r.type}</span></td>
                        <td style={{...td, maxWidth:"180px"}}>
                          <div style={{fontWeight:"600"}}>{r.topic}</div>
                        </td>
                        <td style={td}>{r.duration} min</td>
                        <td style={td}>{r.faculty}</td>
                        <td style={td}>{r.competency}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ExportButtons() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "12px" }}>
      {["Copy","CSV","Print"].map(b => (
        <button key={b} style={{ background:"#6c757d",color:"#fff",border:"none",padding:"6px 14px",borderRadius:"4px",cursor:"pointer",fontSize:"12px" }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'LessonPlan'); else handlePrint('Lesson Plan'); }}>{b}</button>
      ))}
    </div>
  );
}

export const LESSON_PLAN_SUBMODULES = [
  { key: "lesson-plan", label: "Lesson Plan" },
];
