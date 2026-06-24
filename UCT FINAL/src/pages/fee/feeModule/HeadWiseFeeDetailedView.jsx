import React, { useState } from 'react';
import FeeTable from '../common/FeeTable.jsx';
import { courses, batches, semesters } from '../feeConfig.js';

const SAMPLE_DATA = [
  { id: 1, sno: 1, admNo: 'ADM2024001', studentName: 'Arun Kumar',    course: 'MBBS', batch: '2024-25', year: '1st Year', tuition: '60,000', hostel: '40,000', exam: '5,000', library: '2,000', total: '1,07,000', paid: '1,07,000', balance: '0' },
  { id: 2, sno: 2, admNo: 'ADM2024002', studentName: 'Priya Sharma',  course: 'MBBS', batch: '2024-25', year: '1st Year', tuition: '60,000', hostel: '—',      exam: '5,000', library: '2,000', total: '67,000',  paid: '50,000',  balance: '17,000' },
  { id: 3, sno: 3, admNo: 'ADM2024003', studentName: 'Ravi Patel',    course: 'BDS',  batch: '2024-25', year: '2nd Year', tuition: '55,000', hostel: '40,000', exam: '4,500', library: '2,000', total: '1,01,500', paid: '1,01,500', balance: '0' },
  { id: 4, sno: 4, admNo: 'ADM2024004', studentName: 'Meena Iyer',    course: 'MBBS', batch: '2023-24', year: '2nd Year', tuition: '60,000', hostel: '40,000', exam: '5,000', library: '2,000', total: '1,07,000', paid: '80,000',  balance: '27,000' },
  { id: 5, sno: 5, admNo: 'ADM2024005', studentName: 'Suresh Raj',    course: 'MBBS', batch: '2024-25', year: '1st Year', tuition: '60,000', hostel: '—',      exam: '5,000', library: '2,000', total: '67,000',  paid: '67,000',  balance: '0' },
];

const columns = [
  { key: 'sno',         label: 'S.No'         },
  { key: 'admNo',       label: 'Adm. No'      },
  { key: 'studentName', label: 'Student Name'  },
  { key: 'course',      label: 'Course'        },
  { key: 'batch',       label: 'Batch'         },
  { key: 'year',        label: 'Year'          },
  { key: 'tuition',     label: 'Tuition (₹)',   render: v => v !== '—' ? `₹${v}` : '—' },
  { key: 'hostel',      label: 'Hostel (₹)',    render: v => v !== '—' ? `₹${v}` : '—' },
  { key: 'exam',        label: 'Exam (₹)',      render: v => v !== '—' ? `₹${v}` : '—' },
  { key: 'library',     label: 'Library (₹)',   render: v => v !== '—' ? `₹${v}` : '—' },
  { key: 'total',       label: 'Total (₹)',     render: v => <b>₹{v}</b> },
  { key: 'paid',        label: 'Paid (₹)',      render: v => <span style={{ color: '#16a34a', fontWeight: 600 }}>₹{v}</span> },
  { key: 'balance',     label: 'Balance (₹)',
    render: v => (
      <span style={{ color: v === '0' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
        {v === '0' ? '—' : `₹${v}`}
      </span>
    )
  },
];

export default function HeadWiseFeeDetailedView() {
  const [filterCourse, setFilterCourse] = useState('');
  const [filterBatch,  setFilterBatch]  = useState('');
  const [filterYear,   setFilterYear]   = useState('');

  const filtered = SAMPLE_DATA.filter(r =>
    (!filterCourse || r.course === filterCourse) &&
    (!filterBatch  || r.batch  === filterBatch)  &&
    (!filterYear   || r.year   === filterYear)
  );

  const totalPaid    = filtered.reduce((s, r) => s + parseInt(r.paid.replace(/,/g, '') || 0), 0);
  const totalBalance = filtered.reduce((s, r) => s + parseInt(r.balance.replace(/,/g, '') || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Head Wise Fee Detailed View</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Management › Head Wise Fee Detailed View</div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Students', value: filtered.length,                         color: '#3b82f6' },
          { label: 'Total Collected', value: `₹${totalPaid.toLocaleString()}`,        color: '#16a34a' },
          { label: 'Total Pending',   value: `₹${totalBalance.toLocaleString()}`,     color: '#dc2626' },
        ].map(c => (
          <div key={c.label} style={{ flex: '1 1 160px', background: '#fff', border: '1px solid #e0e5ef', borderRadius: 8, padding: '14px 18px' }}>
            <div style={{ fontSize: 12.5, color: '#6b7fa3', fontWeight: 600 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: c.color, marginTop: 4 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="erp-card" style={{ marginBottom: 16 }}>
        <div className="erp-card-header">Filter</div>
        <div className="erp-card-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Course', value: filterCourse, set: setFilterCourse, options: courses },
              { label: 'Batch',  value: filterBatch,  set: setFilterBatch,  options: batches },
              { label: 'Year',   value: filterYear,   set: setFilterYear,   options: semesters },
            ].map(f => (
              <div key={f.label}>
                <label style={labelSt}>{f.label}</label>
                <select style={selSt} value={f.value} onChange={e => f.set(e.target.value)}>
                  <option value="">All</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button style={btnSt} onClick={() => { setFilterCourse(''); setFilterBatch(''); setFilterYear(''); }}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">Fee Head-wise Breakdown — {filtered.length} student(s)</div>
        <div className="erp-card-body" style={{ overflowX: 'auto' }}>
          <FeeTable columns={columns} data={filtered} />
        </div>
      </div>
    </div>
  );
}

const labelSt = { display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 4 };
const selSt   = { padding: '6px 10px', fontSize: 12.5, border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', minWidth: 150 };
const btnSt   = { background: '#6b7fa3', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' };
