import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { discountTypes } from '../feeConfig.js';

const fields = [
  { name: 'studentName', label: 'Student Name', type: 'text', placeholder: 'Enter student name', required: true },
  { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Enter student ID' },
  { name: 'feeHead', label: 'Fee Head', type: 'text', placeholder: 'Enter fee head name', required: true },
  { name: 'discountType', label: 'Discount Type', type: 'select', options: discountTypes, required: true },
  { name: 'discountMode', label: 'Discount Mode', type: 'select', options: ['Fixed Amount', 'Percentage'], required: true },
  { name: 'amount', label: 'Amount / %', type: 'text', placeholder: 'Enter amount or percentage', required: true },
  { name: 'remarks', label: 'Remarks', type: 'text', placeholder: 'Optional remarks' },
  { name: 'approvedBy', label: 'Approved By', type: 'text', placeholder: 'Approver name' },
  { name: 'date', label: 'Date', type: 'date', required: true },
];

export default function FeeDiscount() {
  const [data, setData] = useState([]);

  const handleSubmit = (values) => {
    setData(prev => [...prev, { id: Date.now(), sno: prev.length + 1, ...values, status: 'Pending' }]);
  };

  const handleApprove = (id) => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'discountType', label: 'Discount Type' },
    { key: 'discountMode', label: 'Mode' },
    { key: 'amount', label: 'Amount / %' },
    { key: 'approvedBy', label: 'Approved By' },
    { key: 'date', label: 'Date' },
    {
      key: 'status', label: 'Status',
      render: (val) => (
        <span style={{ background: val === 'Approved' ? '#dcfce7' : '#fef9c3', color: val === 'Approved' ? '#16a34a' : '#a16207', padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{val}</span>
      )
    },
    {
      key: 'id', label: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {row.status === 'Pending' && <button style={ab('#16a34a')} onClick={() => handleApprove(row.id)}>Approve</button>}
          <button style={ab('#d97706')} onClick={() => alert('Action')}>Edit</button>
          <button style={ab('#dc2626')} onClick={() => setData(prev => prev.filter(r => r.id !== row.id))}>Delete</button>
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Discount</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Fee Discount</div>
      </div>
      <FeeForm title="Add Fee Discount" fields={fields} onSubmit={handleSubmit} submitLabel="Apply Discount" />
      <div className="erp-card">
        <div className="erp-card-header">Fee Discount Records</div>
        <div className="erp-card-body">
          <FeeTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

const ab = (bg) => ({ background: bg, color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' });
