import { handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';
import '../Student.css';

/* ── Shared dummy data ── */
const ALL_STUDENTS = [];

/* ── Reusable Filter Row ── */
function FilterCard({ title, children, onSubmit }) {
  return (
    <div className="stu-filter-card">
      <div className="stu-filter-header">{title}</div>
      <div className="stu-filter-body">
        {children}
        <div className="stu-btn-row">
          <button className="stu-btn stu-btn-primary" onClick={onSubmit}>Generate Report</button>
          <button className="stu-btn stu-btn-secondary" onClick={() => alert("Action")}>Export Excel</button>
          <button className="stu-btn stu-btn-secondary" onClick={() => handlePrint('Student Reports')}>Print</button>
        </div>
      </div>
    </div>
  );
}

/* ── Due Fee Report ── */
function DueFeeReport() {
  const [shown, setShown] = useState(false);
  const [filters, setFilters] = useState({ course: '', session: '2024-2025' });
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));
  const data = ALL_STUDENTS.filter((s) => s.dueFee > 0);

  return (
    <>
      <FilterCard title="Due Fee Report" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Course</label>
            <select value={filters.course} onChange={set('course')}><option value="">All</option><option>MBBS</option><option>BDS</option></select>
          </div>
          <div className="stu-field"><label>Session</label>
            <select value={filters.session} onChange={set('session')}><option>2024-2025</option><option>2025-2026</option></select>
          </div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Due Fee Report ({data.length} students)</div>
          <table className="stu-table">
            <thead><tr><th>S.No</th><th>Name</th><th>Roll No</th><th>Course</th><th>Year/Sem</th><th>Due Fee (₹)</th></tr></thead>
            <tbody>{data.map((r, i) => (
              <tr key={r.id}><td>{i+1}</td><td>{r.name}</td><td>{r.rollNo}</td><td>{r.course}</td><td>{r.yearSem}</td>
                <td style={{ color: '#dc2626', fontWeight: 600 }}>₹{r.dueFee.toLocaleString('en-IN')}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ── Student Details Report ── */
function StudentDetails() {
  const [shown, setShown] = useState(false);
  return (
    <>
      <FilterCard title="Student Details Report" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Course</label><select><option>All</option><option>MBBS</option><option>BDS</option></select></div>
          <div className="stu-field"><label>Session</label><select><option>2024-2025</option><option>2025-2026</option></select></div>
          <div className="stu-field"><label>Year/Sem</label><select><option>All</option><option>I-Year</option><option>II-Year</option></select></div>
          <div className="stu-field"><label>Programme</label>
            <select><option>All</option><option>Domestic</option><option>Abroad</option></select>
          </div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Student Details ({ALL_STUDENTS.length})</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead><tr><th>S.No</th><th>Name</th><th>Roll No</th><th>Course</th><th>Year/Sem</th><th>Programme</th><th>Country</th><th>Status</th></tr></thead>
              <tbody>{ALL_STUDENTS.map((r, i) => (
                <tr key={r.id}><td>{i+1}</td><td>{r.name}</td><td>{r.rollNo}</td><td>{r.course}</td><td>{r.yearSem}</td>
                  <td><span className={`stu-badge ${r.type==='Abroad'?'stu-badge-blue':'stu-badge-green'}`}>{r.type}</span></td>
                  <td>{r.country||'—'}</td>
                  <td><span className={`stu-badge ${r.status==='Active'?'stu-badge-green':'stu-badge-red'}`}>{r.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Dropout Student Details ── */
function DropoutDetails() {
  const [shown, setShown] = useState(false);
  const data = ALL_STUDENTS.filter((s) => s.status === 'Dropped');
  return (
    <>
      <FilterCard title="Dropout Student Details" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Course</label><select><option>All</option><option>MBBS</option></select></div>
          <div className="stu-field"><label>Session</label><select><option>2024-2025</option><option>2025-2026</option></select></div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Dropout Students ({data.length})</div>
          <table className="stu-table">
            <thead><tr><th>S.No</th><th>Name</th><th>Roll No</th><th>Course</th><th>Year/Sem</th><th>Status</th></tr></thead>
            <tbody>{data.map((r, i) => (
              <tr key={r.id}><td>{i+1}</td><td>{r.name}</td><td>{r.rollNo}</td><td>{r.course}</td><td>{r.yearSem}</td>
                <td><span className="stu-badge stu-badge-red">{r.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ── Course Wise ── */
function CourseWise() {
  const [shown, setShown] = useState(false);
  const grouped = ALL_STUDENTS.reduce((acc, s) => { acc[s.course] = (acc[s.course]||0)+1; return acc; }, {});
  return (
    <>
      <FilterCard title="Course Wise Student Report" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Session</label><select><option>2024-2025</option><option>2025-2026</option></select></div>
          <div className="stu-field"><label>Year/Sem</label><select><option>All</option><option>I-Year</option><option>II-Year</option></select></div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Course Wise Count</div>
          <table className="stu-table">
            <thead><tr><th>S.No</th><th>Course</th><th>Total Students</th></tr></thead>
            <tbody>{Object.entries(grouped).map(([course, count], i) => (
              <tr key={course}><td>{i+1}</td><td>{course}</td><td style={{ fontWeight: 600 }}>{count}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ── Caste Wise ── */
function CasteWise() {
  const [shown, setShown] = useState(false);
  const grouped = ALL_STUDENTS.reduce((acc, s) => { acc[s.caste] = (acc[s.caste]||0)+1; return acc; }, {});
  return (
    <>
      <FilterCard title="Caste Wise Student Report" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Session</label><select><option>2024-2025</option></select></div>
          <div className="stu-field"><label>Course</label><select><option>All</option><option>MBBS</option><option>BDS</option></select></div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Caste Wise Count</div>
          <table className="stu-table">
            <thead><tr><th>S.No</th><th>Category / Caste</th><th>Total Students</th></tr></thead>
            <tbody>{Object.entries(grouped).map(([caste, count], i) => (
              <tr key={caste}><td>{i+1}</td><td>{caste}</td><td style={{ fontWeight: 600 }}>{count}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ── Dynamic Report ── */
function DynamicReport() {
  const COLUMNS = ['Name','Roll No','Course','Year/Sem','Programme','Country','Caste','Status','Due Fee'];
  const [selected, setSelected] = useState({ Name: true, 'Roll No': true, Course: true, Status: true });
  const [shown, setShown] = useState(false);

  const toggle = (c) => setSelected((p) => ({ ...p, [c]: !p[c] }));
  const activeCols = COLUMNS.filter((c) => selected[c]);

  const getVal = (s, col) => {
    if (col === 'Name') return s.name;
    if (col === 'Roll No') return s.rollNo;
    if (col === 'Course') return s.course;
    if (col === 'Year/Sem') return s.yearSem;
    if (col === 'Programme') return s.type;
    if (col === 'Country') return s.country || '—';
    if (col === 'Caste') return s.caste;
    if (col === 'Status') return s.status;
    if (col === 'Due Fee') return s.dueFee ? `₹${s.dueFee.toLocaleString('en-IN')}` : '—';
    return '—';
  };

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Dynamic Report — Select Columns</div>
        <div className="stu-filter-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', marginBottom: 16 }}>
            {COLUMNS.map((c) => (
              <label key={c} className="stu-check-row">
                <input type="checkbox" checked={!!selected[c]} onChange={() => toggle(c)} />
                {c}
              </label>
            ))}
          </div>
          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={() => setShown(true)}>Generate</button>
            <button className="stu-btn stu-btn-secondary" onClick={() => alert("Action")}>Export Excel</button>
          </div>
        </div>
      </div>
      {shown && activeCols.length > 0 && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Dynamic Report</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead><tr><th>S.No</th>{activeCols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>{ALL_STUDENTS.map((r, i) => (
                <tr key={r.id}><td>{i+1}</td>{activeCols.map((c) => <td key={c}>{getVal(r, c)}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Dropout Student Fee Details ── */
function DropoutFeeDetails() {
  const [shown, setShown] = useState(false);
  const [filters, setFilters] = useState({ course: '', session: '2024-2025' });
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));
  const data = ALL_STUDENTS.filter((s) => s.status === 'Dropped' && s.dueFee > 0);

  return (
    <>
      <FilterCard title="Dropout Student Fee Details" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Course</label>
            <select value={filters.course} onChange={set('course')}><option value="">All</option><option>MBBS</option><option>BDS</option></select>
          </div>
          <div className="stu-field"><label>Session</label>
            <select value={filters.session} onChange={set('session')}><option>2024-2025</option><option>2025-2026</option></select>
          </div>
          <div className="stu-field"><label>Fee Status</label>
            <select><option>All</option><option>Due</option><option>Overdue</option><option>Partial</option></select>
          </div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Dropout Student Fee Details ({data.length} students)</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead><tr><th>S.No</th><th>Name</th><th>Roll No</th><th>Course</th><th>Year/Sem</th><th>Dropout Date</th><th>Reason</th><th>Due Fee (₹)</th><th>Status</th></tr></thead>
              <tbody>{data.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td>{r.name}</td>
                  <td>{r.rollNo}</td>
                  <td>{r.course}</td>
                  <td>{r.yearSem}</td>
                  <td>{r.dropoutDate || '—'}</td>
                  <td>{r.dropoutReason || '—'}</td>
                  <td style={{ color: '#dc2626', fontWeight: 600 }}>₹{r.dueFee?.toLocaleString('en-IN') || 0}</td>
                  <td><span className="stu-badge stu-badge-red">Overdue</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Due Fee Report - II (By Department) ── */
function DueFeesReportII() {
  const [shown, setShown] = useState(false);
  const [filters, setFilters] = useState({ department: '', feeStatus: 'All' });
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));
  
  const grouped = ALL_STUDENTS.reduce((acc, s) => {
    if (s.dueFee > 0) {
      const key = s.department || 'General';
      acc[key] = (acc[key] || 0) + s.dueFee;
    }
    return acc;
  }, {});

  return (
    <>
      <FilterCard title="Due Fees Report - II (Department Wise)" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Department</label>
            <select value={filters.department} onChange={set('department')}><option value="">All</option><option>MBBS</option><option>BDS</option><option>Nursing</option></select>
          </div>
          <div className="stu-field"><label>Fee Status</label>
            <select value={filters.feeStatus} onChange={set('feeStatus')}><option>All</option><option>Overdue</option><option>Due This Month</option><option>Upcoming</option></select>
          </div>
          <div className="stu-field"><label>Session</label>
            <select><option>2024-2025</option><option>2025-2026</option></select>
          </div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Due Fees Report - II Department Wise</div>
          <table className="stu-table">
            <thead><tr><th>S.No</th><th>Department</th><th>Total Due Fee (₹)</th><th>No. of Students</th><th>Avg Due Per Student (₹)</th></tr></thead>
            <tbody>{Object.entries(grouped).map(([dept, totalFee], i) => {
              const count = ALL_STUDENTS.filter(s => (s.department || 'General') === dept && s.dueFee > 0).length;
              return (
                <tr key={dept}>
                  <td>{i+1}</td>
                  <td>{dept}</td>
                  <td style={{ fontWeight: 600, color: '#dc2626' }}>₹{totalFee.toLocaleString('en-IN')}</td>
                  <td>{count}</td>
                  <td style={{ fontWeight: 600 }}>₹{(totalFee/count).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ── Due Fee Report - III (Semester Wise) ── */
function DueFeesReportIII() {
  const [shown, setShown] = useState(false);
  const [filters, setFilters] = useState({ semester: '', course: '' });
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));
  
  const grouped = ALL_STUDENTS.reduce((acc, s) => {
    if (s.dueFee > 0) {
      const key = s.yearSem || 'Not Assigned';
      acc[key] = (acc[key] || { totalFee: 0, count: 0, students: [] });
      acc[key].totalFee += s.dueFee;
      acc[key].count += 1;
      acc[key].students.push(s);
    }
    return acc;
  }, {});

  return (
    <>
      <FilterCard title="Due Fees Report - III (Semester Wise)" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Year/Semester</label>
            <select value={filters.semester} onChange={set('semester')}><option value="">All</option><option>I-Year</option><option>II-Year</option><option>III-Year</option></select>
          </div>
          <div className="stu-field"><label>Course</label>
            <select value={filters.course} onChange={set('course')}><option value="">All</option><option>MBBS</option><option>BDS</option><option>Nursing</option></select>
          </div>
          <div className="stu-field"><label>Session</label>
            <select><option>2024-2025</option><option>2025-2026</option></select>
          </div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Due Fees Report - III Semester Wise Analysis</div>
          <table className="stu-table">
            <thead><tr><th>S.No</th><th>Year/Semester</th><th>No. of Students</th><th>Total Due Fee (₹)</th><th>Avg Due Per Student (₹)</th><th>% of Total</th></tr></thead>
            <tbody>{Object.entries(grouped).map(([sem, data], i) => {
              const totalAllFees = Object.values(grouped).reduce((sum, d) => sum + d.totalFee, 0);
              const percentage = ((data.totalFee / totalAllFees) * 100).toFixed(1);
              return (
                <tr key={sem}>
                  <td>{i+1}</td>
                  <td>{sem}</td>
                  <td>{data.count}</td>
                  <td style={{ fontWeight: 600, color: '#dc2626' }}>₹{data.totalFee.toLocaleString('en-IN')}</td>
                  <td style={{ fontWeight: 600 }}>₹{(data.totalFee/data.count).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td><span style={{ background: '#dbeafe', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{percentage}%</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ── I-Card Portrait ── */
function ICardPortrait() {
  const [shown, setShown] = useState(false);
  const [filters, setFilters] = useState({ course: '', session: '2024-2025' });
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = ALL_STUDENTS.filter(s => 
    (!filters.course || s.course === filters.course) &&
    (!filters.session || s.session === filters.session)
  );

  return (
    <>
      <FilterCard title="I-Card Portrait (Student ID Cards)" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Course</label>
            <select value={filters.course} onChange={set('course')}><option value="">All</option><option>MBBS</option><option>BDS</option><option>Nursing</option></select>
          </div>
          <div className="stu-field"><label>Session</label>
            <select value={filters.session} onChange={set('session')}><option>2024-2025</option><option>2025-2026</option></select>
          </div>
          <div className="stu-field"><label>Year/Sem</label>
            <select><option>All</option><option>I-Year</option><option>II-Year</option><option>III-Year</option></select>
          </div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Portrait I-Cards - Preview ({filteredStudents.length} students)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', padding: '20px' }}>
            {filteredStudents.map((student) => (
              <div key={student.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }} onClick={() => setSelectedStudent(student)}>
                <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', textAlign: 'center' }}>
                  📸 Photo
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>{student.name}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Roll No: {student.rollNo}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>{student.course}</div>
                  <div style={{ fontSize: '9px', color: '#9ca3af' }}>Valid: 2024-2025</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ── I-Card Landscape ── */
function ICardLandscape() {
  const [shown, setShown] = useState(false);
  const [filters, setFilters] = useState({ course: '', session: '2024-2025' });
  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  const filteredStudents = ALL_STUDENTS.filter(s => 
    (!filters.course || s.course === filters.course) &&
    (!filters.session || s.session === filters.session)
  );

  return (
    <>
      <FilterCard title="I-Card Landscape (Student ID Cards)" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Course</label>
            <select value={filters.course} onChange={set('course')}><option value="">All</option><option>MBBS</option><option>BDS</option><option>Nursing</option></select>
          </div>
          <div className="stu-field"><label>Session</label>
            <select value={filters.session} onChange={set('session')}><option>2024-2025</option><option>2025-2026</option></select>
          </div>
          <div className="stu-field"><label>Year/Sem</label>
            <select><option>All</option><option>I-Year</option><option>II-Year</option><option>III-Year</option></select>
          </div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Landscape I-Cards - Preview ({filteredStudents.length} students)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
            {filteredStudents.map((student) => (
              <div key={student.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                transition: 'transform 0.2s'
              }}>
                <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', flexShrink: 0 }}>
                  📸
                </div>
                <div style={{ padding: '12px', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '2px' }}>{student.name}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Roll No: {student.rollNo}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Course: {student.course}</div>
                  <div style={{ fontSize: '9px', color: '#9ca3af' }}>Valid: 2024-2025</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Abroad Student Report ── */
function AbroadReport() {
  const [shown, setShown] = useState(false);
  const data = ALL_STUDENTS.filter((s) => s.type === 'Abroad');
  return (
    <>
      <FilterCard title="Abroad Student Report" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Country</label>
            <select><option value="">All</option><option>Russia</option><option>China</option><option>Philippines</option></select>
          </div>
          <div className="stu-field"><label>Session</label><select><option>2024-2025</option><option>2025-2026</option></select></div>
          <div className="stu-field"><label>Year/Sem</label><select><option>All</option><option>I-Year</option><option>II-Year</option><option>III-Year</option></select></div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Abroad Students ({data.length})</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead><tr><th>S.No</th><th>Name</th><th>Roll No</th><th>Course</th><th>Year/Sem</th><th>Country</th><th>University</th><th>Status</th></tr></thead>
              <tbody>{data.map((r, i) => (
                <tr key={r.id}><td>{i+1}</td><td>{r.name}</td><td>{r.rollNo}</td><td>{r.course}</td><td>{r.yearSem}</td>
                  <td>{r.country}</td>
                  <td>{r.universityName || '—'}</td>
                  <td><span className="stu-badge stu-badge-green">{r.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Visa Status Report ── */
function VisaStatusReport() {
  const [shown, setShown] = useState(false);
  const data = ALL_STUDENTS.filter((s) => s.type === 'Abroad');
  const today = new Date();

  const getVisaStatus = (expiry) => {
    if (!expiry) return { label: 'No Data', cls: 'stu-badge-gray' };
    const exp = new Date(expiry);
    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (diff < 0)  return { label: 'Expired',        cls: 'stu-badge-red' };
    if (diff < 60) return { label: `Expiring (${diff}d)`, cls: 'stu-badge-orange' };
    return { label: 'Active', cls: 'stu-badge-green' };
  };

  return (
    <>
      <FilterCard title="Visa Status Report" onSubmit={() => setShown(true)}>
        <div className="stu-filter-row">
          <div className="stu-field"><label>Country</label>
            <select><option value="">All</option><option>Russia</option><option>China</option><option>Philippines</option></select>
          </div>
          <div className="stu-field"><label>Visa Status</label>
            <select><option>All</option><option>Active</option><option>Expiring Soon</option><option>Expired</option></select>
          </div>
        </div>
      </FilterCard>
      {shown && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Visa Status Report ({data.length})</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead><tr><th>S.No</th><th>Name</th><th>Roll No</th><th>Country</th><th>Passport No</th><th>Visa Expiry</th><th>Visa Status</th></tr></thead>
              <tbody>{data.map((r, i) => {
                const vs = getVisaStatus(r.visaExpiry);
                return (
                  <tr key={r.id}><td>{i+1}</td><td>{r.name}</td><td>{r.rollNo}</td><td>{r.country}</td>
                    <td>{r.passportNo || '—'}</td>
                    <td>{r.visaExpiry || '—'}</td>
                    <td><span className={`stu-badge ${vs.cls}`}>{vs.label}</span></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ── TABS WRAPPER ── */
const REPORT_TABS = [
  { id: 'due-fee',            label: 'Due Fee Report',                   Component: DueFeeReport },
  { id: 'details',            label: 'Student Details',                  Component: StudentDetails },
  { id: 'dropout',            label: 'Dropout Details',                  Component: DropoutDetails },
  { id: 'dropout-fee',        label: 'Dropout Student Fee Details',      Component: DropoutFeeDetails },
  { id: 'course-wise',        label: 'Course Wise',                      Component: CourseWise },
  { id: 'caste-wise',         label: 'Caste Wise',                       Component: CasteWise },
  { id: 'dynamic',            label: 'Dynamic Report',                   Component: DynamicReport },
  { id: 'due-fee-ii',         label: 'Due Fees Report - II',             Component: DueFeesReportII },
  { id: 'due-fee-iii',        label: 'Due Fees Report - III',            Component: DueFeesReportIII },
  { id: 'icard-portrait',     label: 'I-Card Portrait',                  Component: ICardPortrait },
  { id: 'icard-landscape',    label: 'I-Card Landscape',                 Component: ICardLandscape },
  { id: 'abroad',             label: 'Abroad Student Report',            Component: AbroadReport },
  { id: 'visa-status',        label: 'Visa Status Report',               Component: VisaStatusReport },
];

export default function StudentReports() {
  const [active, setActive] = useState('due-fee');
  const tab = REPORT_TABS.find((t) => t.id === active);
  const PageComp = tab.Component;

  return (
    <div>
      <div className="stu-tabs">
        {REPORT_TABS.map((t) => (
          <div key={t.id} className={`stu-tab ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
            {t.label}
          </div>
        ))}
      </div>
      <PageComp />
    </div>
  );
}
