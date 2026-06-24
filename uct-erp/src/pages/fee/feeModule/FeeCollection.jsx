import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches } from '../feeConfig.js';

const fields = [
  { name: 'course', label: 'Course', type: 'select', options: courses, required: true },
  { name: 'branch', label: 'Branch Name', type: 'select', options: branches, required: true },
  { name: 'batch', label: 'Batch', type: 'select', options: batches, required: true },
  { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Enter student ID', required: true },
  { name: 'studentName', label: 'Student Name', type: 'text', placeholder: 'Enter student name', required: true },
  { name: 'feeHead', label: 'Fee Head', type: 'text', placeholder: 'Fee head to hold', required: true },
  { name: 'holdReason', label: 'Hold Reason', type: 'select', required: true, options: ['Payment Dispute', 'Document Pending', 'Scholarship Under Review', 'Management Decision', 'Other'] },
  { name: 'remarks', label: 'Remarks', type: 'text', placeholder: 'Additional remarks' },
  { name: 'holdDate', label: 'Hold Date', type: 'date', required: true },
  { name: 'reviewDate', label: 'Review Date', type: 'date' },
];

export default function FeeCollection() {
  const [data, setData] = useState([]);

  const handleSubmit = (values) => {
    setData(prev => [...prev, { id: Date.now(), sno: prev.length + 1, ...values, status: 'On Hold' }]);
  };

  const handleRelease = (id) => setData(prev => prev.map(r => r.id === id ? { ...r, status: 'Released' } : r));

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'holdReason', label: 'Hold Reason' },
    { key: 'remarks', label: 'Remarks' },
    { key: 'holdDate', label: 'Hold Date' },
    { key: 'reviewDate', label: 'Review Date' },
    {
      key: 'status', label: 'Status',
      render: (val) => (
        <span style={{ background: val === 'Released' ? '#dcfce7' : '#fee2e2', color: val === 'Released' ? '#16a34a' : '#dc2626', padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{val}</span>
      )
    },
    {
      key: 'id', label: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {row.status === 'On Hold' && (
            <button style={ab('#16a34a')} onClick={() => handleRelease(row.id)}>Release</button>
          )}
          <button style={ab('#dc2626')} onClick={() => setData(prev => prev.filter(r => r.id !== row.id))}>Remove</button>
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Collection (Hold Fee)</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Fee Collection</div>
      </div>
      <FeeForm title="Place Fee on Hold" fields={fields} onSubmit={handleSubmit} submitLabel="Place Hold" />
      <div className="erp-card">
        <div className="erp-card-header">Hold Fee Records</div>
        <div className="erp-card-body">
          <FeeTable columns={columns} data={data} emptyMessage="No fees currently on hold." />
        </div>
      </div>
    </div>
  );
}

const ab = (bg) => ({ background: bg, color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' });
