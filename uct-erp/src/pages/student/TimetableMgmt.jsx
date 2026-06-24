import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import { useState } from "react";

/* ─── SHARED CONSTANTS ─── */
const COLLEGES = ["UNIVERSIDADE CATÓLICA TIMORENSE"];
const COURSES   = ["MBBS", "BDS", "BAMS"];
const BRANCHES  = ["Medicine", "Surgery", "Paediatrics", "Gynaecology"];
const BATCHES   = ["2024-2030", "2023-2029", "2022-2028"];
const YEARS     = ["NA", "I-Year", "II-Year", "III-Year", "IV-Year", "V-Year", "I-SEM", "II-SEM", "III-SEM", "IV-SEM", "V-SEM", "VI-SEM"];
const SESSIONS  = ["2024-2025", "2025-2026", "2023-2024"];
const DAYS      = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* ─── STYLES ─── */
const S = {
  page:         { padding: "24px", fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#333" },
  header:       { background: "#2c3e50", color: "#fff", padding: "12px 20px", borderRadius: "6px 6px 0 0", fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px" },
  card:         { background: "#fff", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "24px" },
  cardBody:     { padding: "20px" },
  grid2:        { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  label:        { display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "13px", color: "#555" },
  input:        { width: "100%", padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" },
  select:       { width: "100%", padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box", background: "#fff" },
  btnPrimary:   { background: "#2c3e50", color: "#fff", border: "none", padding: "8px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
  btnView:      { background: "#2c3e50", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
  btnSecondary: { background: "#6c757d", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  btnEdit:      { background: "#17a2b8", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  btnDelete:    { background: "#dc3545", color: "#fff", border: "none", width: "26px", height: "26px", borderRadius: "50%", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" },
  table:        { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th:           { background: "#2c3e50", color: "#fff", padding: "9px 10px", textAlign: "left", border: "1px solid #444" },
  td:           { padding: "8px 10px", border: "1px solid #ddd", verticalAlign: "middle" },
  tdAlt:        { padding: "8px 10px", border: "1px solid #ddd", verticalAlign: "middle", background: "#f9f9f9" },
  filterRow:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  searchInput:  { padding: "6px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", width: "200px" },
  timeCell:     { display: "flex", flexDirection: "column", fontSize: "11px", background: "#e3f2fd", border: "1px solid #90caf9", borderRadius: "4px", padding: "4px 6px", cursor: "pointer" },
  emptyCellBtn: { width: "100%", height: "100%", minHeight: "50px", background: "#f9f9f9", border: "1px dashed #ccc", borderRadius: "4px", cursor: "pointer", fontSize: "11px", color: "#aaa", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyMsg:     { textAlign: "center", color: "#9ca3af", padding: "24px", fontSize: "13px" },
};

/* ═══════════════════════════════
   1. PERIOD MASTER
═══════════════════════════════ */
function PeriodMaster() {
  const emptyForm = { college: COLLEGES[0], course: "", branch: "", batch: "", year: "NA", periodName: "", timeFrom: "", timeTo: "", order: "" };
  const [form,    setForm]    = useState(emptyForm);
  const [periods, setPeriods] = useState([]);
  const [editId,  setEditId]  = useState(null);
  const [search,  setSearch]  = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.timeFrom || !form.timeTo) { alert("Time From and Time To are required."); return; }
    if (editId !== null) {
      setPeriods(p => p.map(r => r.id === editId ? { ...r, ...form, name: form.periodName } : r));
      setEditId(null);
    } else {
      const newId = periods.length > 0 ? Math.max(...periods.map(p => p.id)) + 1 : 1;
      setPeriods(p => [...p, {
        id: newId,
        college: form.college,
        course: form.course,
        branch: form.branch,
        batch: form.batch,
        year: form.year,
        name: form.periodName,
        timeFrom: form.timeFrom,
        timeTo: form.timeTo,
        order: parseInt(form.order) || 0,
      }]);
    }
    setForm(emptyForm);
  };

  const handleEdit = (r) => {
    setForm({ college: r.college, course: r.course, branch: r.branch, batch: r.batch, year: r.year, periodName: r.name, timeFrom: r.timeFrom, timeTo: r.timeTo, order: r.order });
    setEditId(r.id);
  };

  const handleDelete = (id) => setPeriods(p => p.filter(r => r.id !== id));

  const filtered = periods.filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const fields = [
    { name: "college",    label: "College",               type: "select", options: COLLEGES },
    { name: "course",     label: "Course",                type: "select", options: ["Select", ...COURSES] },
    { name: "branch",     label: "Branch Name",           type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch",      label: "Batch",                 type: "select", options: ["Select", ...BATCHES] },
    { name: "year",       label: "Current Year/Semester", type: "select", options: YEARS },
    { name: "periodName", label: "Period Name",           type: "text" },
    { name: "timeFrom",   label: "Time From",             type: "time" },
    { name: "timeTo",     label: "Time To",               type: "time" },
    { name: "order",      label: "Order",                 type: "number" },
  ];

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <span style={{ fontSize: "18px" }}>☰</span> Time Table Period
        </div>
        <div style={S.cardBody}>
          <div style={S.grid2}>
            {fields.map(f => (
              <div key={f.name}>
                <label style={S.label}>{f.label}</label>
                {f.type === "select"
                  ? <select style={S.select} value={form[f.name]} onChange={e => set(f.name, e.target.value)}>
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  : <input style={S.input} type={f.type} value={form[f.name]} onChange={e => set(f.name, e.target.value)} />
                }
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button style={S.btnPrimary} onClick={handleSubmit}>{editId !== null ? "Update" : "Submit"}</button>
            {editId !== null && (
              <button style={{ ...S.btnSecondary, marginLeft: "8px" }} onClick={() => { setEditId(null); setForm(emptyForm); }}>Cancel</button>
            )}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardBody}>
          <div style={S.filterRow}>
            <div style={{ display: "flex", gap: "8px" }}>
              {["Copy", "CSV", "Print"].map(b => (
                <button key={b} style={S.btnSecondary}
                  onClick={e => { if (b === "Copy") handleCopy(e.currentTarget); else if (b === "CSV") handleCSV(e.currentTarget, "Period_Master"); else handlePrint("Period Master"); }}>
                  {b}
                </button>
              ))}
            </div>
            <input style={S.searchInput} placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <table style={S.table} className="hr-table">
            <thead>
              <tr>
                {["SNo.", "College", "Course", "Branch", "Batch", "Year/Semester", "Period Name", "Time From", "Time To", "Order", "Edit", "Delete"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={12} style={S.emptyMsg}>No periods added yet</td></tr>
                : filtered.map((r, i) => {
                    const td = i % 2 === 0 ? S.td : S.tdAlt;
                    return (
                      <tr key={r.id}>
                        <td style={td}>{i + 1}</td>
                        <td style={td}>{r.college}</td>
                        <td style={td}>{r.course}</td>
                        <td style={td}>{r.branch}</td>
                        <td style={td}>{r.batch}</td>
                        <td style={td}>{r.year}</td>
                        <td style={td}>{r.name}</td>
                        <td style={td}>{r.timeFrom}</td>
                        <td style={td}>{r.timeTo}</td>
                        <td style={td}>{r.order}</td>
                        <td style={td}>
                          <button style={S.btnEdit} onClick={() => handleEdit(r)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                        </td>
                        <td style={td}>
                          <button style={S.btnDelete} onClick={() => handleDelete(r.id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/><line x1="16" y1="8" x2="8" y2="16"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
          <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
            Showing {filtered.length} of {periods.length} entries
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   2. TIME TABLE ALLOCATION
═══════════════════════════════ */
function TimetableAllocation() {
  const [filters, setFilters] = useState({
    college: COLLEGES[0], session: "", course: "", branch: "", batch: "", year: "NA",
  });
  const [viewed,   setViewed]   = useState(false);
  const [timetable, setTimetable] = useState({});
  const [modal,    setModal]    = useState(null);

  const set = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const cellKey  = (day, period) => `${day}_${period}`;
  const getCell  = (day, period) => timetable[cellKey(day, period)];
  const saveCell = (subject, faculty) => {
    if (!modal) return;
    setTimetable(t => ({ ...t, [cellKey(modal.day, modal.period)]: { subject, faculty } }));
    setModal(null);
  };
  const clearCell = (day, period) => setTimetable(t => {
    const n = { ...t }; delete n[cellKey(day, period)]; return n;
  });

  const fields = [
    { name: "college", label: "College",               type: "select", options: COLLEGES },
    { name: "session", label: "Session",               type: "select", options: ["Select", ...SESSIONS] },
    { name: "course",  label: "Course",                type: "select", options: ["Select", ...COURSES] },
    { name: "branch",  label: "Branch",                type: "select", options: ["Select", ...BRANCHES] },
    { name: "batch",   label: "Batch",                 type: "select", options: ["Select", ...BATCHES] },
    { name: "year",    label: "Current Year/Semester", type: "select", options: YEARS },
  ];

  /* Period columns = Subject/Teacher (matches legacy screenshot) */
  const PERIOD_COLS = ["Period", "Subject/Teacher"];

  return (
    <div style={S.page}>
      {/* Filter form */}
      <div style={S.card}>
        <div style={S.header}>
          <span style={{ fontSize: "18px" }}>☰</span> Time Table Allocation
        </div>
        <div style={S.cardBody}>
          <div style={S.grid2}>
            {fields.map(f => (
              <div key={f.name}>
                <label style={S.label}>{f.label}</label>
                <select style={S.select} value={filters[f.name]} onChange={e => set(f.name, e.target.value)}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "8px" }}>
            <button style={S.btnView} onClick={() => setViewed(true)}>View</button>
          </div>
        </div>
      </div>

      {/* Timetable grid — only shown after View is clicked */}
      {viewed && (
        <div style={S.card}>
          <div style={{ ...S.header, borderRadius: "6px 6px 0 0" }}>
            {filters.course || "Course"} | {filters.branch || "Branch"} | {filters.batch || "Batch"} | {filters.year}
          </div>
          <div style={S.cardBody}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ ...S.table, minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th style={{ ...S.th, minWidth: 100 }}>Period</th>
                    {DAYS.map(d => <th key={d} style={{ ...S.th, minWidth: 120, textAlign: "center" }}>{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...S.td, fontWeight: "bold", background: "#ecf0f1" }}>Subject/Teacher</td>
                    {DAYS.map(day => {
                      const cell = getCell(day, "p1");
                      return (
                        <td key={day} style={{ ...S.td, padding: "6px" }}>
                          {cell
                            ? <div style={S.timeCell} onClick={() => setModal({ day, period: "p1" })}>
                                <span style={{ fontWeight: "bold", color: "#1565c0", fontSize: "12px" }}>{cell.subject}</span>
                                <span style={{ color: "#555", fontSize: "11px" }}>{cell.faculty}</span>
                                <span style={{ color: "#c62828", fontSize: "10px", marginTop: "2px", cursor: "pointer" }}
                                  onClick={e => { e.stopPropagation(); clearCell(day, "p1"); }}>✕ Remove</span>
                              </div>
                            : <button style={S.emptyCellBtn} onClick={() => setModal({ day, period: "p1" })}>+ Assign</button>
                          }
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "16px" }}>
              <button style={S.btnPrimary} onClick={() => alert("Timetable submitted.")}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Report section — Copy / CSV / Print */}
      <div style={S.card}>
        <div style={S.cardBody}>
          <div style={{ fontSize: "15px", fontWeight: "bold", color: "#2c3e50", marginBottom: "12px" }}>Report</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {["Copy", "CSV", "Print"].map(b => (
                <button key={b} style={S.btnSecondary}
                  onClick={e => { if (b === "Copy") handleCopy(e.currentTarget); else if (b === "CSV") handleCSV(e.currentTarget, "Timetable_Allocation"); else handlePrint("Time Table Allocation"); }}>
                  {b}
                </button>
              ))}
            </div>
            <input style={S.searchInput} placeholder="Search" />
          </div>
          <table style={S.table} className="hr-table">
            <thead>
              <tr>
                {["SNo.", "College", "Course", "Branch", "Batch", "Year/Semester", "Day", "Period", "Subject", "Faculty"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={10} style={S.emptyMsg}>No timetable data available</td></tr>
            </tbody>
          </table>
          <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Showing 0 entries</div>
        </div>
      </div>

      {/* Assign modal */}
      {modal && (
        <AssignModal
          day={modal.day}
          period={modal.period}
          existing={getCell(modal.day, modal.period)}
          onSave={saveCell}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function AssignModal({ day, period, existing, onSave, onClose }) {
  const [subject, setSubject] = useState(existing?.subject || "");
  const [faculty, setFaculty] = useState(existing?.faculty || "");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "8px", padding: "24px", width: "380px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: "15px", fontWeight: "bold", color: "#2c3e50", marginBottom: "4px" }}>Assign Subject & Faculty</div>
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "16px" }}>{day}</div>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontWeight: "600", fontSize: "13px", marginBottom: "4px" }}>Subject</label>
          <input
            style={{ width: "100%", padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" }}
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Enter subject name"
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontWeight: "600", fontSize: "13px", marginBottom: "4px" }}>Faculty</label>
          <input
            style={{ width: "100%", padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" }}
            value={faculty}
            onChange={e => setFaculty(e.target.value)}
            placeholder="Enter faculty name"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button style={{ padding: "7px 16px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", fontSize: "13px" }} onClick={onClose}>Cancel</button>
          <button style={{ padding: "7px 16px", borderRadius: "4px", border: "none", background: "#2c3e50", color: "#fff", cursor: "pointer", fontSize: "13px" }} onClick={() => onSave(subject, faculty)}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ─── EXPORT ─── */
export const TIMETABLE_SUBMODULES = [
  { id: "timetable-period",     label: "Period Master" },
  { id: "timetable-allocation", label: "Time Table Allocation" },
];

export default function TimetableMgmtModule({ activeSub, onBack }) {
  switch (activeSub) {
    case "timetable-allocation": return <TimetableAllocation />;
    default:                     return <PeriodMaster />;
  }
}
