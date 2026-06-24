import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches, paymentModes } from '../feeConfig.js';

const fields = [
  { name: 'course', label: 'Course', type: 'select', options: courses, required: true },
  { name: 'branch', label: 'Branch Name', type: 'select', options: branches, required: true },
  { name: 'batch', label: 'Batch', type: 'select', options: batches, required: true },
  { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Enter student ID', required: true },
  { name: 'studentName', label: 'Student Name', type: 'text', placeholder: 'Enter student name', required: true },
  { name: 'feeDescription', label: 'Fee Description', type: 'text', placeholder: 'e.g. Library fine, ID card', required: true },
  { name: 'amount', label: 'Amount (INR)', type: 'text', placeholder: 'Enter amount', required: true },
  { name: 'paymentMode', label: 'Payment Mode', type: 'select', options: paymentModes, required: true },
  { name: 'receivedBy', label: 'Received By', type: 'text', placeholder: 'Staff name', required: true },
  { name: 'date', label: 'Receipt Date', type: 'date', required: true },
];

export default function OtherFeeReceipt() {
  const [receipts, setReceipts] = useState([]);

  const handleSubmit = (values) => {
    const count = receipts.length + 1;
    setReceipts(prev => [...prev, {
      id: Date.now(), sno: count,
      receiptNo: `OFR-${String(count).padStart(3, '0')}`,
      ...values,
      amount: Number(values.amount) || 0,
    }]);
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'receiptNo', label: 'Receipt No' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'feeDescription', label: 'Fee Description' },
    { key: 'amount', label: 'Amount (INR)', render: (v) => `₹${Number(v).toLocaleString('en-IN')}` },
    { key: 'paymentMode', label: 'Payment Mode' },
    { key: 'receivedBy', label: 'Received By' },
    { key: 'date', label: 'Date' },
    {
      key: 'id', label: 'Action',
      render: () => (
        <button style={{ background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }} onClick={() => alert('Action')}>
          Print Receipt
        </button>
      )
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Other Fee Receipt</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Other Fee Receipt</div>
      </div>
      <FeeForm title="Generate Other Fee Receipt" fields={fields} onSubmit={handleSubmit} submitLabel="Generate Receipt" />
      <div className="erp-card">
        <div className="erp-card-header">Other Fee Receipts</div>
        <div className="erp-card-body">
          <FeeTable columns={columns} data={receipts} />
        </div>
      </div>
    </div>
  );
}
