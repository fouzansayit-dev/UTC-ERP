import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function TransportAllocationReport() {
  const [form, setForm] = useState({
    course: '', branchName: '',
    batch: '', student: '',
    route: 'All', vehicle: 'All',
    status: 'All', startDate: '', endDate: '',
  });
  const [rows, setRows] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSubmit = () => setSubmitted(true);

  const filtered = rows.filter(r =>
    (r.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Transport Allocation Report</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)',
        maxWidth: 1000
      }}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Course</label>
            <select className="form-input" value={form.course} onChange={e => set('course', e.target.value)}>
              <option value="">Select</option>
              <option>MBBS</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Branch Name</label>
            <select className="form-input" value={form.branchName} onChange={e => set('branchName', e.target.value)}>
              <option value="">Select</option>
              <option>MEDICINE</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Batch</label>
            <select className="form-input" value={form.batch} onChange={e => set('batch', e.target.value)}>
              <option value="">Select Batch</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Student</label>
            <select className="form-input" value={form.student} onChange={e => set('student', e.target.value)}>
              <option value="">Select Name</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Route</label>
            <select className="form-input" value={form.route} onChange={e => set('route', e.target.value)}>
              <option>All</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Vehicle</label>
            <select className="form-input" value={form.vehicle} onChange={e => set('vehicle', e.target.value)}>
              <option>All</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Start Date</label>
            <input className="form-input" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">End Date</label>
            <input className="form-input" type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
          </div>
        </div>

        <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 12 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {submitted && (
        <div style={{ marginTop: 28 }}>
          <div style={{
            background: '#1e293b', color: '#fff', padding: '14px 20px',
            borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15
          }}>
            Transport Allocation Report
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Copy', 'CSV', 'Print'].map(b => (
                <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'TransportAllocationReport'); else handlePrint('Transport Allocation Report'); }}>{b}</button>
              ))}
            </div>
            <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
            <table className="hr-table">
              <thead>
                <tr>
                  {['EDIT','Print','Session','Course','Branch','Batch','Year/Sem','Name','Father\'s Name','Vehicle','Route','Entry Date','Month'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={13} className="empty-table-msg">No data available in table</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={i}>
                    <td><button className="tbl-btn edit" style={{ background: '#fef2f2', color: '#dc2626' }} onClick={() => alert("Edit record")}>EDIT</button></td>
                    <td><button className="tbl-btn view" style={{ background: '#e0f7fa', color: '#0891b2' }} onClick={() => handlePrint('Transport Allocation Report')}>PRINT</button></td>
                    <td>{r.session}</td>
                    <td>{r.course}</td>
                    <td>{r.branch}</td>
                    <td>{r.batch}</td>
                    <td>{r.yearSem}</td>
                    <td>{r.name}</td>
                    <td>{r.fatherName}</td>
                    <td>{r.vehicle}</td>
                    <td>{r.route}</td>
                    <td>{r.entryDate}</td>
                    <td>{r.month}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
            Showing {filtered.length === 0 ? '0 to 0 of 0' : `1 to ${filtered.length} of ${filtered.length}`} entries
          </div>
        </div>
      )}
    </div>
  );
}
