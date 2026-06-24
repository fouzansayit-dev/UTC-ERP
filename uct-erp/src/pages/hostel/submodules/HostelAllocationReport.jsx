import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';
import '../Hostel.css';

const COURSES  = ['Select', 'MBBS', 'BDS', 'MD', 'MS'];
const BRANCHES = ['Select', 'MEDICINE', 'SURGERY', 'PAEDIATRICS'];
const BATCHES  = ['Select Batch', '2024-2030', '2025-2031', '2023-2029'];
const STATUSES = ['All', 'Active', 'Vacated', 'Departed'];

const INIT = {
  course: 'Select', branchName: 'Select', batch: 'Select Batch',
  student: 'Select Name', hostel: 'All', roomNo: 'All',
  status: 'All', startDate: '', endDate: '',
};

export default function HostelAllocationReport() {
  const [filters, setFilters] = useState(INIT);
  const [records, setRecords] = useState([]);
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState('');

  const setF = (k) => (e) => setFilters(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearched(true);
    // Empty array — backend will populate
    setRecords([]);
  };

  return (
    <div className="hostel-wrapper">

      {/* ── Filter Card ── */}
      <div className="hostel-card">
        <div className="hostel-card-title">Hostel Room Allocation Report</div>

        <form onSubmit={handleSubmit}>
          <div className="hostel-form-grid">
            <div className="hostel-field">
              <label>Course</label>
              <select value={filters.course} onChange={setF('course')}>
                {COURSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="hostel-field">
              <label>Branch Name</label>
              <select value={filters.branchName} onChange={setF('branchName')}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="hostel-field">
              <label>Batch</label>
              <select value={filters.batch} onChange={setF('batch')}>
                {BATCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="hostel-field">
              <label>Student</label>
              <select value={filters.student} onChange={setF('student')}>
                <option>Select Name</option>
              </select>
            </div>
            <div className="hostel-field">
              <label>Hostel</label>
              <select value={filters.hostel} onChange={setF('hostel')}>
                <option>All</option>
                <option>UNIO GIRLS HOSTEL</option>
                <option>UNIO BOYS HOSTEL</option>
              </select>
            </div>
            <div className="hostel-field">
              <label>Room No.</label>
              <select value={filters.roomNo} onChange={setF('roomNo')}>
                <option>All</option>
                <option>A-2</option><option>A-3</option><option>A-4</option>
              </select>
            </div>
            <div className="hostel-field">
              <label>Status</label>
              <select value={filters.status} onChange={setF('status')}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="hostel-field">
              <label>Start Date</label>
              <input type="date" value={filters.startDate} onChange={setF('startDate')} />
            </div>
            <div className="hostel-field">
              <label>End Date</label>
              <input type="date" value={filters.endDate} onChange={setF('endDate')} />
            </div>
          </div>

          <div className="hostel-btn-row">
            <button type="submit" className="hostel-btn-primary" onClick={() => alert("Action")}>Submit</button>
            <button type="button" className="hostel-btn-secondary"
              onClick={() => { setFilters(INIT); setSearched(false); }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* ── Report Table + Vacancy + Departure ── */}
      {searched && (
        <>
          {/* Allocation Report */}
          <div className="hostel-card">
            <div className="hostel-table-toolbar">
              <div className="hostel-table-actions">
                <button className="hostel-tbl-tool-btn" onClick={e => handleCopy(e.currentTarget)}>Copy</button>
                <button className="hostel-tbl-tool-btn" onClick={e => handleCSV(e.currentTarget, 'HostelAllocationReport')}>CSV</button>
                <button className="hostel-tbl-tool-btn" onClick={() => handlePrint('Hostel Allocation Report')}>Print</button>
              </div>
              <input
                className="hostel-search-input"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="hostel-table-wrap">
              <table className="hostel-table">
                <thead>
                  <tr>
                    <th>Edit</th>
                    <th>Print</th>
                    <th>Session</th>
                    <th>Course</th>
                    <th>Branch</th>
                    <th>Batch</th>
                    <th>Year/Sem</th>
                    <th>Name</th>
                    <th>Father's Name</th>
                    <th>Hostel</th>
                    <th>Room</th>
                    <th>Bed No</th>
                    <th>Departure Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={14} className="hostel-empty">No records found.</td></tr>
                  ) : records.map((r, i) => (
                    <tr key={i}>
                      <td><button className="tbl-edit-btn" onClick={() => alert("Edit record")}>Edit</button></td>
                      <td><button className="tbl-print-btn" onClick={() => handlePrint('Hostel Allocation Report')}>Print</button></td>
                      <td>{r.session}</td>
                      <td>{r.course}</td>
                      <td>{r.branch}</td>
                      <td>{r.batch}</td>
                      <td>{r.yearSem}</td>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td>{r.fatherName}</td>
                      <td>{r.hostel}</td>
                      <td>{r.room}</td>
                      <td>{r.bedNo}</td>
                      <td>{r.departureDate || '—'}</td>
                      <td><span className="hostel-badge hostel-badge-active">{r.status || 'Active'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {records.length > 0 && (
              <div style={{ fontSize: 13.5, color: '#64748b', marginTop: 10 }}>
                Showing 1 to {records.length} of {records.length} entries
              </div>
            )}
          </div>

          {/* ── Vacancy Report ── */}
          <div className="hostel-card">
            <div className="hostel-section-title">Vacancy Report</div>
            <div className="hostel-table-wrap">
              <table className="hostel-table">
                <thead>
                  <tr>
                    <th>SNo.</th>
                    <th>Hostel Name</th>
                    <th>Room No</th>
                    <th>Room Type</th>
                    <th>Category</th>
                    <th>Occupancy</th>
                    <th>Occupied Beds</th>
                    <th>Vacant Beds</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan={9} className="hostel-empty">Submit filter to view vacancy report.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Departure Tracking ── */}
          <div className="hostel-card">
            <div className="hostel-section-title">Departure Tracking</div>
            <div className="hostel-table-wrap">
              <table className="hostel-table">
                <thead>
                  <tr>
                    <th>SNo.</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Hostel</th>
                    <th>Room No</th>
                    <th>Allocation Date</th>
                    <th>Departure Date</th>
                    <th>Days Stayed</th>
                    <th>Caution Deposit</th>
                    <th>Refund Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan={10} className="hostel-empty">No departure records found.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
