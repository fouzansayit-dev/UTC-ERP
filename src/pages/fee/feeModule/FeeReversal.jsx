import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';

const fields = [
  { name: 'transactionId', label: 'Transaction ID', type: 'text', required: true, placeholder: 'Enter transaction ID' },
  { name: 'studentId', label: 'Student ID', type: 'text', required: true, placeholder: 'Enter student ID' },
  { name: 'originalAmount', label: 'Original Amount (INR)', type: 'number', required: true, placeholder: '0.00' },
  { name: 'reversalReason', label: 'Reason for Reversal', type: 'select', required: true, options: ['Duplicate Entry', 'Wrong Amount', 'Wrong Student', 'System Error', 'Manual Error', 'Other'] },
  { name: 'approverName', label: 'Approver Name', type: 'text', required: true, placeholder: 'Name of approver' },
  { name: 'remarks', label: 'Additional Remarks', type: 'textarea', placeholder: 'Detailed explanation for reversal' },
];

export default function FeeReversal() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (values) => {
    if (editing !== null) {
      setData(prev =>
        prev.map(r =>
          r.id === editing ? { ...r, ...values } : r
        )
      );
      setEditing(null);
    } else {
      setData(prev => [
        ...prev,
        {
          id: Date.now(),
          sno: prev.length + 1,
          ...values,
          reversalDate: new Date().toISOString().split('T')[0],
          approvalDate: null,
          status: 'Pending Approval',
        },
      ]);
    }
    setShowForm(false);
  };

  const handleApprove = (id) => {
    setData(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'Approved', approvalDate: new Date().toISOString().split('T')[0] } : r
      )
    );
  };

  const handleReject = (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setData(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: 'Rejected', remarks: reason } : r
        )
      );
    }
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'originalAmount', label: 'Amount' },
    { key: 'reversalReason', label: 'Reason' },
    { key: 'approverName', label: 'Approver' },
    { key: 'reversalDate', label: 'Reversal Date' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: value === 'Approved' ? '#d4edda' : value === 'Pending Approval' ? '#fff3cd' : '#f8d7da',
            color: value === 'Approved' ? '#155724' : value === 'Pending Approval' ? '#856404' : '#721c24',
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  const editingRecord = data.find(r => r.id === editing);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Fee Reversal</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {showForm ? 'Cancel' : '+ New Reversal Request'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <FeeForm
            title="Request Fee Reversal"
            fields={fields}
            onSubmit={handleSubmit}
            initialValues={editingRecord || {}}
            submitLabel="Submit for Approval"
          />
        </div>
      )}

      <FeeTable columns={columns} data={data} emptyMessage="No reversals found" />
    </div>
  );
}
