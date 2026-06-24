import React, { useState } from 'react';
import '../Student.css';

export default function AssignRollNumber() {
  const [filters, setFilters] = useState({ college: 'All', course: '', branch: '', batch: '' });
  const [rows, setRows]       = useState([]);
  const [searched, setSearched] = useState(false);
  const [topInputs, setTopInputs] = useState({ scholarNo: '', rollNo: '', enrollmentNo: '' });

  const set    = (k) => (e) => setFilters(p => ({ ...p, [k]: e.target.value }));
  const setTop = (k) => (e) => setTopInputs(p => ({ ...p, [k]: e.target.value }));
  const setRow = (id, col, val) => setRows(prev => prev.map(r => r.id === id ? { ...r, [col]: val } : r));

  const handleSearch = () => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        let filtered = data.map(stu => ({
          ...stu,
          scholarNo: stu.scholar_no,
          enrollmentNo: stu.enroll_no,
          rollNo: stu.roll_no,
          branchName: stu.branch,
          admissionDate: stu.admission_date,
          feeDisplay: stu.feeDisplay || 'Y'
        }));
        
        if (filters.course) {
          filtered = filtered.filter(s => s.course === filters.course);
        }
        if (filters.branch) {
          filtered = filtered.filter(s => (s.branch || s.branchName) === filters.branch);
        }
        if (filters.batch) {
          filtered = filtered.filter(s => s.batch === filters.batch);
        }
        setRows(filtered);
        setSearched(true);
      })
      .catch(err => console.error('Error fetching students:', err));
  };

  const handleAllocation = () => {
    if (!topInputs.scholarNo) { alert('Enter Scholar No to allocate.'); return; }
    const stu = rows.find(r => r.scholarNo === topInputs.scholarNo);
    if (!stu) { alert('Student with this Scholar No not found in the filtered list.'); return; }

    fetch(`/api/students/${stu.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...stu,
        rollNo: topInputs.rollNo,
        enrollmentNo: topInputs.enrollmentNo
      })
    })
      .then(async res => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to allocate numbers');
        alert(`Roll No "${topInputs.rollNo}" and Enrollment No "${topInputs.enrollmentNo}" allocated to Scholar No "${topInputs.scholarNo}"`);
        handleSearch();
      })
      .catch(err => alert(err.message));
  };

  const handleSave = () => {
    const promises = rows.map(r => {
      return fetch(`/api/students/${r.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(r)
      });
    });

    Promise.all(promises)
      .then(() => {
        alert('All roll numbers and enrollment numbers saved successfully!');
        handleSearch();
      })
      .catch(err => alert('Failed to save some student records: ' + err.message));
  };

  const male   = rows.filter(r => r.gender === 'Male').length;
  const female = rows.filter(r => r.gender === 'Female').length;

  return (
    <>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Roll No / Enrollment No Allocation</div>
        <div className="stu-filter-body">
          <div className="stu-filter-row">
            <div className="stu-field">
              <label>College</label>
              <select value={filters.college} onChange={set('college')}>
                <option>All</option>
                <option>UNIVERSIDADE CATOLICA TIMOR</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Course</label>
              <select value={filters.course} onChange={set('course')}>
                <option value="">Select</option>
                <option>MBBS</option><option>BDS</option><option>MD</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Branch Name</label>
              <select value={filters.branch} onChange={set('branch')}>
                <option value="">Select</option><option>MEDICINE</option><option>SURGERY</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Batch</label>
              <select value={filters.batch} onChange={set('batch')}>
                <option value="">Select Batch</option>
                <option>2024-2030</option><option>2025-2031</option>
              </select>
            </div>
          </div>
          <div className="stu-btn-row">
            <button className="stu-btn stu-btn-primary" onClick={handleSearch}>Submit</button>
          </div>
        </div>
      </div>

      {searched && (
        <div className="stu-table-wrap">
          {/* ── Top bar: Scholar No / Roll No / Enrollment No inputs + Allocation button ── */}
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
            <button className="stu-btn stu-btn-primary" onClick={handleSave}>Submit</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>Scholar No</span>
              <input value={topInputs.scholarNo} onChange={setTop('scholarNo')}
                style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 8px', fontSize: 12, width: 120 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>Roll No</span>
              <input value={topInputs.rollNo} onChange={setTop('rollNo')}
                style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 8px', fontSize: 12, width: 120 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>Enrollment No</span>
              <input value={topInputs.enrollmentNo} onChange={setTop('enrollmentNo')}
                style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 8px', fontSize: 12, width: 140 }} />
            </div>
            <button className="stu-btn stu-btn-primary" onClick={handleAllocation}>Allocation</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Edit</th>
                  <th>Branch Name</th>
                  <th>Scholar No</th>
                  <th>Fees Display Status</th>
                  <th>Roll No.</th>
                  <th>Enrollment No</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={8} className="stu-empty">No records found</td></tr>
                ) : rows.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: '#374151', width: 40 }}>{i + 1}</td>
                    <td>
                      <button className="stu-btn stu-btn-primary stu-btn-sm"
                        onClick={() => alert(`Edit student: ${r.name}`)}>
                        ✎ Edit
                      </button>
                    </td>
                    <td>{r.branch || 'MEDICINE'}</td>
                    <td>
                      <input value={r.scholarNo || ''} onChange={(e) => setRow(r.id, 'scholarNo', e.target.value)}
                        style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '4px 6px', fontSize: 12, width: 110 }} />
                    </td>
                    <td>
                      <select value={r.feeDisplay || 'Y'} onChange={(e) => setRow(r.id, 'feeDisplay', e.target.value)}
                        style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '4px 6px', fontSize: 12 }}>
                        <option>Y</option><option>N</option>
                      </select>
                    </td>
                    <td>
                      <input value={r.rollNo || ''} onChange={(e) => setRow(r.id, 'rollNo', e.target.value)}
                        style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '4px 6px', fontSize: 12, width: 110 }} />
                    </td>
                    <td>
                      <input value={r.enrollmentNo || ''} onChange={(e) => setRow(r.id, 'enrollmentNo', e.target.value)}
                        style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '4px 6px', fontSize: 12, width: 120 }} />
                    </td>
                    <td>{r.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit bottom */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <button className="stu-btn stu-btn-primary" onClick={handleSave}>Submit</button>
          </div>

          {/* Footer counts */}
          <div style={{ padding: '10px 16px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', fontSize: 13, color: '#374151', display: 'flex', gap: 32 }}>
            <span>Male – {male}</span>
            <span>Female – {female}</span>
            <span>Total – {rows.length}</span>
          </div>
        </div>
      )}
    </>
  );
}
