import React, { useState } from 'react';
import '../Hostel.css';

const MEAL_PLANS  = ['Full Board (3 meals)', 'Half Board (2 meals)', 'Breakfast Only', 'Dinner Only'];
const MONTHS      = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const MEAL_TYPES  = ['Breakfast', 'Lunch', 'Dinner'];

/* ── Tabs ── */
const TABS = ['Meal Plan', 'Monthly Billing', 'Mess Attendance'];

const INIT_PLAN = {
  studentId: '', studentName: '', hostel: '', roomNo: '',
  mealPlan: 'Full Board (3 meals)', startDate: '', endDate: '',
  monthlyRate: '', remarks: '',
};

const INIT_BILLING = {
  month: new Date().toLocaleString('default', { month: 'long' }),
  year: new Date().getFullYear().toString(),
  hostel: '', generatedOn: new Date().toISOString().split('T')[0],
};

const INIT_ATT = {
  date: new Date().toISOString().split('T')[0],
  hostel: '', mealType: 'Breakfast',
};

export default function MessManagement() {
  const [tab, setTab] = useState(0);

  /* Meal Plan state */
  const [planForm, setPlanForm]     = useState(INIT_PLAN);
  const [planRecords, setPlanRecords] = useState([]);
  const setP = (k) => (e) => setPlanForm(p => ({ ...p, [k]: e.target.value }));

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    if (!planForm.studentName.trim()) { alert('Student Name is required.'); return; }
    setPlanRecords(p => [...p, { ...planForm, _id: Date.now(), sno: p.length + 1 }]);
    setPlanForm(INIT_PLAN);
  };

  /* Billing state */
  const [billForm, setBillForm]     = useState(INIT_BILLING);
  const [billRecords, setBillRecords] = useState([]);
  const setB = (k) => (e) => setBillForm(p => ({ ...p, [k]: e.target.value }));

  const handleBillGenerate = (e) => {
    e.preventDefault();
    // Placeholder — real generation happens from backend
    setBillRecords([]);
  };

  /* Attendance state */
  const [attForm, setAttForm]         = useState(INIT_ATT);
  const [attRecords, setAttRecords]   = useState([]);
  const [attSearch, setAttSearch]     = useState('');
  const setAT = (k) => (e) => setAttForm(p => ({ ...p, [k]: e.target.value }));

  const handleAttSubmit = (e) => {
    e.preventDefault();
    setAttRecords([]);
  };

  return (
    <div className="hostel-wrapper">

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: 20, gap: 0 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderBottom: tab === i ? '2px solid #4361ee' : '2px solid transparent',
              marginBottom: -2,
              background: 'transparent',
              color: tab === i ? '#4361ee' : '#64748b',
              fontSize: 14,
              fontWeight: tab === i ? 700 : 500,
              cursor: 'pointer',
              fontFamily: "'Nunito Sans', 'Inter', sans-serif",
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── TAB 0: Meal Plan ── */}
      {tab === 0 && (
        <>
          <div className="hostel-card">
            <div className="hostel-card-title">Meal Plan Options</div>
            <form onSubmit={handlePlanSubmit}>
              <div className="hostel-form-grid">
                <div className="hostel-field">
                  <label>Student ID</label>
                  <input value={planForm.studentId} onChange={setP('studentId')} placeholder="e.g. STU001" />
                </div>
                <div className="hostel-field">
                  <label>Student Name <span className="req">*</span></label>
                  <input value={planForm.studentName} onChange={setP('studentName')} />
                </div>
                <div className="hostel-field">
                  <label>Hostel</label>
                  <select value={planForm.hostel} onChange={setP('hostel')}>
                    <option value="">Select</option>
                    <option>UNIO GIRLS HOSTEL</option>
                    <option>UNIO BOYS HOSTEL</option>
                  </select>
                </div>
                <div className="hostel-field">
                  <label>Room No</label>
                  <input value={planForm.roomNo} onChange={setP('roomNo')} />
                </div>
                <div className="hostel-field">
                  <label>Meal Plan</label>
                  <select value={planForm.mealPlan} onChange={setP('mealPlan')}>
                    {MEAL_PLANS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="hostel-field">
                  <label>Monthly Rate (INR)</label>
                  <input type="number" min="0" value={planForm.monthlyRate} onChange={setP('monthlyRate')} placeholder="0.00" />
                </div>
                <div className="hostel-field">
                  <label>Start Date</label>
                  <input type="date" value={planForm.startDate} onChange={setP('startDate')} />
                </div>
                <div className="hostel-field">
                  <label>End Date</label>
                  <input type="date" value={planForm.endDate} onChange={setP('endDate')} />
                </div>
                <div className="hostel-field span2">
                  <label>Remarks</label>
                  <textarea value={planForm.remarks} onChange={setP('remarks')} rows={2} />
                </div>
              </div>
              <div className="hostel-btn-row">
                <button type="submit" className="hostel-btn-primary" onClick={() => alert("Action")}>Save Meal Plan</button>
                <button type="button" className="hostel-btn-secondary" onClick={() => setPlanForm(INIT_PLAN)}>Reset</button>
              </div>
            </form>
          </div>

          <div className="hostel-card">
            <div className="hostel-table-wrap">
              <table className="hostel-table">
                <thead>
                  <tr>
                    <th>SNo.</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Hostel</th>
                    <th>Room No</th>
                    <th>Meal Plan</th>
                    <th>Monthly Rate</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {planRecords.length === 0 ? (
                    <tr><td colSpan={9} className="hostel-empty">No meal plans assigned.</td></tr>
                  ) : planRecords.map((r, i) => (
                    <tr key={r._id}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                      <td>{r.studentId}</td>
                      <td>{r.hostel}</td>
                      <td>{r.roomNo}</td>
                      <td>{r.mealPlan}</td>
                      <td>{r.monthlyRate ? `₹${r.monthlyRate}` : '—'}</td>
                      <td>{r.startDate}</td>
                      <td>{r.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── TAB 1: Monthly Billing ── */}
      {tab === 1 && (
        <>
          <div className="hostel-card">
            <div className="hostel-card-title">Monthly Mess Billing</div>
            <form onSubmit={handleBillGenerate}>
              <div className="hostel-form-grid">
                <div className="hostel-field">
                  <label>Month</label>
                  <select value={billForm.month} onChange={setB('month')}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="hostel-field">
                  <label>Year</label>
                  <input type="number" value={billForm.year} onChange={setB('year')} />
                </div>
                <div className="hostel-field">
                  <label>Hostel</label>
                  <select value={billForm.hostel} onChange={setB('hostel')}>
                    <option value="">All Hostels</option>
                    <option>UNIO GIRLS HOSTEL</option>
                    <option>UNIO BOYS HOSTEL</option>
                  </select>
                </div>
                <div className="hostel-field">
                  <label>Generated On</label>
                  <input type="date" value={billForm.generatedOn} onChange={setB('generatedOn')} />
                </div>
              </div>
              <div className="hostel-btn-row">
                <button type="submit" className="hostel-btn-primary" onClick={() => alert("Action")}>Generate Bills</button>
                <button type="button" className="hostel-btn-secondary" onClick={() => setBillForm(INIT_BILLING)}>Reset</button>
              </div>
            </form>
          </div>

          <div className="hostel-card">
            <div className="hostel-table-wrap">
              <table className="hostel-table">
                <thead>
                  <tr>
                    <th>SNo.</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Hostel</th>
                    <th>Room No</th>
                    <th>Meal Plan</th>
                    <th>Days Present</th>
                    <th>Days Absent</th>
                    <th>Bill Amount (INR)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan={10} className="hostel-empty">Generate bills to view monthly billing records.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── TAB 2: Mess Attendance ── */}
      {tab === 2 && (
        <>
          <div className="hostel-card">
            <div className="hostel-card-title">Mess Attendance</div>
            <form onSubmit={handleAttSubmit}>
              <div className="hostel-form-grid">
                <div className="hostel-field">
                  <label>Date</label>
                  <input type="date" value={attForm.date} onChange={setAT('date')} />
                </div>
                <div className="hostel-field">
                  <label>Hostel</label>
                  <select value={attForm.hostel} onChange={setAT('hostel')}>
                    <option value="">All Hostels</option>
                    <option>UNIO GIRLS HOSTEL</option>
                    <option>UNIO BOYS HOSTEL</option>
                  </select>
                </div>
                <div className="hostel-field">
                  <label>Meal Type</label>
                  <select value={attForm.mealType} onChange={setAT('mealType')}>
                    {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="hostel-btn-row">
                <button type="submit" className="hostel-btn-primary" onClick={() => alert("Action")}>Load Students</button>
                <button type="button" className="hostel-btn-secondary" onClick={() => setAttRecords([])}>Reset</button>
              </div>
            </form>
          </div>

          <div className="hostel-card">
            <div className="hostel-table-toolbar">
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                {attForm.date} — {attForm.mealType}
              </span>
              <input className="hostel-search-input" placeholder="Search student..."
                value={attSearch} onChange={e => setAttSearch(e.target.value)} />
            </div>
            <div className="hostel-table-wrap">
              <table className="hostel-table">
                <thead>
                  <tr>
                    <th>SNo.</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Hostel</th>
                    <th>Room No</th>
                    <th>Meal Plan</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan={7} className="hostel-empty">Load students to mark attendance.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
