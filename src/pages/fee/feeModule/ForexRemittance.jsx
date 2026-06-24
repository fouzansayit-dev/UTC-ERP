import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches, forexCurrencies } from '../feeConfig.js';

const fields = [
  { name: 'course', label: 'Course', type: 'select', options: courses, required: true },
  { name: 'branch', label: 'Branch Name', type: 'select', options: branches, required: true },
  { name: 'batch', label: 'Batch', type: 'select', options: batches, required: true },
  { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Enter student ID', required: true },
  { name: 'studentName', label: 'Student Name', type: 'text', placeholder: 'Enter student name', required: true },
  { name: 'feeHead', label: 'Fee Head', type: 'text', placeholder: 'Fee head for remittance', required: true },
  { name: 'foreignCurrency', label: 'Foreign Currency', type: 'select', options: forexCurrencies, required: true },
  { name: 'foreignAmount', label: 'Foreign Amount', type: 'text', placeholder: 'Amount in foreign currency', required: true },
  { name: 'exchangeRate', label: 'Exchange Rate (to INR)', type: 'text', placeholder: 'e.g. 83.50', required: true },
  { name: 'inrEquivalent', label: 'INR Equivalent', type: 'text', placeholder: 'Auto-calculated or enter manually' },
  { name: 'remittanceMode', label: 'Remittance Mode', type: 'select', required: true, options: ['Wire Transfer', 'SWIFT', 'NEFT/RTGS', 'Demand Draft', 'Online Portal'] },
  { name: 'referenceNo', label: 'Reference / UTR No.', type: 'text', placeholder: 'Bank reference number' },
  { name: 'remittanceDate', label: 'Remittance Date', type: 'date', required: true },
];

export default function ForexRemittance() {
  const [records, setRecords] = useState([]);

  const handleSubmit = (values) => {
    const foreign = Number(values.foreignAmount) || 0;
    const rate = Number(values.exchangeRate) || 0;
    const inr = values.inrEquivalent ? Number(values.inrEquivalent) : (foreign * rate);
    const count = records.length + 1;
    setRecords(prev => [...prev, {
      id: Date.now(), sno: count,
      receiptNo: `FX-${String(count).padStart(3, '0')}`,
      ...values, foreignAmount: foreign, exchangeRate: rate, inrEquivalent: inr, status: 'Received',
    }]);
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'receiptNo', label: 'Ref No.' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'foreignAmount', label: 'Foreign Amt', render: (v, row) => `${row.foreignCurrency} ${Number(v).toLocaleString()}` },
    { key: 'exchangeRate', label: 'Rate (INR)' },
    { key: 'inrEquivalent', label: 'INR Equivalent', render: (v) => `₹${Number(v).toLocaleString('en-IN')}` },
    { key: 'remittanceMode', label: 'Mode' },
    { key: 'referenceNo', label: 'Reference No.' },
    { key: 'remittanceDate', label: 'Date' },
    {
      key: 'status', label: 'Status',
      render: (val) => <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{val}</span>
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Forex Remittance Tracking</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Forex Remittance</div>
      </div>
      <FeeForm title="Record Forex Remittance" fields={fields} onSubmit={handleSubmit} submitLabel="Record Remittance" />
      <div className="erp-card">
        <div className="erp-card-header">Forex Remittance Records</div>
        <div className="erp-card-body">
          <FeeTable columns={columns} data={records} emptyMessage="No forex remittance records yet." />
        </div>
      </div>
    </div>
  );
}
