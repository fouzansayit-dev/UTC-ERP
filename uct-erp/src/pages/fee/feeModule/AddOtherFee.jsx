import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches } from '../feeConfig.js';

const fields = [
  { name: 'course', label: 'Course', type: 'select', options: courses, required: true },
  { name: 'branch', label: 'Branch Name', type: 'select', options: branches, required: true },
  { name: 'batch', label: 'Batch', type: 'select', options: batches, required: true },
  { name: 'studentName', label: 'Student Name', type: 'text', placeholder: 'Enter student name', required: true },
  { name: 'feeHead', label: 'Fee Head', type: 'text', placeholder: 'Enter fee head name', required: true },
  { name: 'description', label: 'Description', type: 'text', placeholder: 'Enter description' },
  { name: 'amount', label: 'Amount (INR)', type: 'text', placeholder: 'Enter amount', required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
];

export default function AddOtherFee() {
  const [data, setData] = useState([]);

  const handleSubmit = (values) => {
    setData(prev => [...prev, { id: Date.now(), sno: prev.length + 1, ...values, amount: Number(values.amount) || 0 }]);
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount (INR)', render: (v) => `₹${Number(v).toLocaleString('en-IN')}` },
    { key: 'date', label: 'Date' },
    {
      key: 'id', label: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={ab('#d97706')} onClick={() => alert('Action')}>Edit</button>
          <button style={ab('#dc2626')} onClick={() => setData(prev => prev.filter(r => r.id !== row.id))}>Delete</button>
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Add Other Fee</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Add Other Fee</div>
      </div>
      <FeeForm title="Add Other Fee Entry" fields={fields} onSubmit={handleSubmit} submitLabel="Add Fee" />
      <div className="erp-card">
        <div className="erp-card-header">Other Fee Entries</div>
        <div className="erp-card-body">
          <FeeTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

const ab = (bg) => ({ background: bg, color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' });
