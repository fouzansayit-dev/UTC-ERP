import { handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useEffect } from 'react';
import FeeTable from '../common/FeeTable.jsx';
import { courses, batches, paymentModes } from '../feeConfig.js';

const statusColor = { Paid: { bg: '#dcfce7', color: '#16a34a' }, Partial: { bg: '#fef9c3', color: '#d97706' }, Pending: { bg: '#fee2e2', color: '#dc2626' } };

const columns = [
  { key: 'sno',         label: 'S.No'          },
  { key: 'receiptNo',   label: 'Receipt No'     },
  { key: 'admNo',       label: 'Adm. No'        },
  { key: 'studentName', label: 'Student Name'   },
  { key: 'course',      label: 'Course'         },
  { key: 'batch',       label: 'Batch'          },
  { key: 'date',        label: 'Date'           },
  { key: 'feeHead',     label: 'Fee Head'       },
  { key: 'amount',      label: 'Amount (₹)',     render: v => `₹${Number(v || 0).toLocaleString('en-IN')}` },
  { key: 'mode',        label: 'Mode'           },
  { key: 'status',      label: 'Status',
    render: v => {
      const s = statusColor[v] || { bg: '#dcfce7', color: '#16a34a' }; // Default to Paid green
      return <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{v || 'Paid'}</span>;
    }
  },
  {
    key: 'receiptNo', label: 'Print',
    render: (v) => (
      <button style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
        onClick={() => handlePrint('Fee Receipt Detailed View')}>Print</button>
    )
  },
];

export default function FeeReceiptDetailedView() {
  const [receipts, setReceipts] = useState([]);
  const [filterCourse, setFilterCourse] = useState('');
  const [filterBatch,  setFilterBatch]  = useState('');
  const [filterMode,   setFilterMode]   = useState('');
  const [filterAdm,    setFilterAdm]    = useState('');

  useEffect(() => {
    fetch('/api/fees')
      .then(res => res.json())
      .then(data => {
        // Map backend returned receipt properties
        const mapped = data.map((r, i) => ({
          id: r.id,
          sno: i + 1,
          receiptNo: r.receipt_no,
          admNo: r.scholar_no || r.student_id,
          studentName: r.student_name,
          course: r.course,
          batch: r.batch,
          date: r.date,
          feeHead: r.head_wise_details?.feeHead || 'Tuition Fee',
          amount: r.amount,
          mode: r.payment_mode,
          status: 'Paid'
        }));
        setReceipts(mapped);
      })
      .catch(err => console.error('Error loading receipts:', err));
  }, []);

  const filtered = receipts.filter(r =>
    (!filterCourse || r.course === filterCourse) &&
    (!filterBatch  || r.batch  === filterBatch)  &&
    (!filterMode   || r.mode   === filterMode)   &&
    (!filterAdm    || r.admNo.toLowerCase().includes(filterAdm.toLowerCase()) ||
                      r.studentName.toLowerCase().includes(filterAdm.toLowerCase()))
  );

  const totalAmount = filtered.reduce((s, r) => s + parseFloat(r.amount || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Receipt Detailed View</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Management › Fee Receipt Detailed View</div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Receipts', value: filtered.length,                       color: '#3b82f6' },
          { label: 'Total Amount',   value: `₹${totalAmount.toLocaleString()}`,    color: '#16a34a' },
          { label: 'Paid',           value: filtered.filter(r => r.status === 'Paid').length,    color: '#16a34a' },
          { label: 'Partial',        value: filtered.filter(r => r.status === 'Partial').length, color: '#d97706' },
        ].map(c => (
          <div key={c.label} style={{ flex: '1 1 140px', background: '#fff', border: '1px solid #e0e5ef', borderRadius: 8, padding: '14px 18px' }}>
            <div style={{ fontSize: 12.5, color: '#6b7fa3', fontWeight: 600 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: c.color, marginTop: 4 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="erp-card" style={{ marginBottom: 16 }}>
        <div className="erp-card-header">Search / Filter</div>
        <div className="erp-card-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <label style={labelSt}>Search Student / Adm No</label>
              <input style={inputSt} placeholder="Name or Adm No..." value={filterAdm} onChange={e => setFilterAdm(e.target.value)} />
            </div>
            <div>
              <label style={labelSt}>Course</label>
              <select style={selSt} value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
                <option value="">All</option>
                {courses.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelSt}>Batch</label>
              <select style={selSt} value={filterBatch} onChange={e => setFilterBatch(e.target.value)}>
                <option value="">All</option>
                {batches.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelSt}>Payment Mode</label>
              <select style={selSt} value={filterMode} onChange={e => setFilterMode(e.target.value)}>
                <option value="">All</option>
                {paymentModes.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button style={btnSt} onClick={() => { setFilterCourse(''); setFilterBatch(''); setFilterMode(''); setFilterAdm(''); }}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">Receipt Records — {filtered.length} record(s) | Total: ₹{totalAmount.toLocaleString()}</div>
        <div className="erp-card-body" style={{ overflowX: 'auto' }}>
          <FeeTable columns={columns} data={filtered} />
        </div>
      </div>
    </div>
  );
}

const labelSt = { display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 4 };
const selSt   = { padding: '6px 10px', fontSize: 12.5, border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', minWidth: 150 };
const inputSt = { padding: '6px 10px', fontSize: 12.5, border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', minWidth: 200 };
const btnSt   = { background: '#6b7fa3', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' };
