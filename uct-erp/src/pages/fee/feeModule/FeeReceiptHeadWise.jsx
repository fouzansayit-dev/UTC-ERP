import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches } from '../feeConfig.js';

const fields = [
  { name: 'course', label: 'Course', type: 'select', options: courses, required: true },
  { name: 'branch', label: 'Branch Name', type: 'select', options: branches, required: true },
  { name: 'batch', label: 'Batch', type: 'select', options: batches, required: true },
  { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Enter student ID' },
  { name: 'studentName', label: 'Student Name', type: 'text', placeholder: 'Enter student name', required: true },
  { name: 'searchType', label: 'Select Search Type', type: 'select', options: ['Roll Number', 'Student Name', 'Admission Number'], required: true },
  { name: 'studentType', label: 'Student Type', type: 'select', options: ['Domestic', 'Abroad'], required: true },
];

const columns = [
  { key: 'sno', label: 'SNo' },
  { key: 'feeHead', label: 'Fee Head' },
  { key: 'type', label: 'Type' },
  { key: 'totalINR', label: 'Total (INR)', render: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—' },
  { key: 'totalUSD', label: 'Total (USD)', render: (v) => v ? `$${Number(v).toLocaleString()}` : '—' },
  { key: 'paidINR', label: 'Paid (INR)', render: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—' },
  { key: 'balanceINR', label: 'Balance (INR)', render: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—' },
  {
    key: 'status', label: 'Status',
    render: (val) => (
      <span style={{ background: val === 'Paid' ? '#dcfce7' : '#fee2e2', color: val === 'Paid' ? '#16a34a' : '#dc2626', padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{val}</span>
    )
  },
  {
    key: 'id', label: 'Action',
    render: (_, row) => row.status === 'Pending'
      ? <button style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }} onClick={() => alert("Action")}>Pay Now</button>
      : <button style={{ background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }} onClick={() => alert("Action")}>Receipt</button>
  },
];

export default function FeeReceiptHeadWise() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSubmit = (values) => { setFormData(values); setSubmitted(true); };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Receipt (Head Wise)</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Fee Receipt Head Wise</div>
      </div>
      <FeeForm title="Search Student" fields={fields} onSubmit={handleSubmit} submitLabel="Search" />
      {submitted && (
        <div className="erp-card">
          <div className="erp-card-header">
            Fee Details — Head Wise for: {formData.studentName || 'Student'}
            {formData.studentType && (
              <span style={{ marginLeft: 10, background: formData.studentType === 'Abroad' ? '#fee2e2' : '#dcfce7', color: formData.studentType === 'Abroad' ? '#dc2626' : '#16a34a', padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>
                {formData.studentType}
              </span>
            )}
          </div>
          <div className="erp-card-body">
            <FeeTable columns={columns} data={[]} emptyMessage="No fee records found for this student. Add fee heads in Fee Head Master first." />
          </div>
        </div>
      )}
    </div>
  );
}
