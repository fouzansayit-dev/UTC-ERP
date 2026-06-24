import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';

const fields = [
  { name: 'studentId', label: 'Student ID', type: 'text', required: true, placeholder: 'Enter student ID' },
  { name: 'studentName', label: 'Student Name', type: 'text', required: true, placeholder: 'Student name' },
  { name: 'refundAmount', label: 'Refund Amount (INR)', type: 'number', required: true, placeholder: '0.00' },
  { name: 'reason', label: 'Reason for Refund', type: 'select', required: true, options: ['Overpayment', 'Scholarship Adjustment', 'Fee Correction', 'Dropout', 'Medical Leave', 'Other'] },
  { name: 'bankName', label: 'Bank Name', type: 'text', required: true, placeholder: 'Bank name' },
  { name: 'accountNumber', label: 'Account Number', type: 'text', required: true, placeholder: 'IBAN/Account number' },
  { name: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Additional remarks' },
];

export default function FeeRefund() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (values) => {
    if (editing !== null) {
      setData(prev =>
        prev.map(r =>
          r.id === editing ? { ...r, ...values, refundDate: r.refundDate } : r
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
          approvalDate: new Date().toISOString().split('T')[0],
          refundDate: null,
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

  const handleProcess = (id) => {
    setData(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'Processed', refundDate: new Date().toISOString().split('T')[0] } : r
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

  const handleEdit = (id) => {
    setEditing(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this refund request?')) {
      setData(prev => prev.filter(r => r.id !== id));
    }
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'refundAmount', label: 'Refund Amount' },
    { key: 'reason', label: 'Reason' },
    { key: 'bankName', label: 'Bank' },
    { key: 'approvalDate', label: 'Approval Date' },
    { key: 'refundDate', label: 'Refund Date' },
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
            backgroundColor:
              value === 'Processed'
                ? '#d4edda'
                : value === 'Approved'
                ? '#cce5ff'
                : value === 'Pending Approval'
                ? '#fff3cd'
                : '#f8d7da',
            color:
              value === 'Processed'
                ? '#155724'
                : value === 'Approved'
                ? '#004085'
                : value === 'Pending Approval'
                ? '#856404'
                : '#721c24',
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {row.status === 'Pending Approval' && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(row.id)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Reject
              </button>
            </>
          )}
          {row.status === 'Approved' && (
            <button
              onClick={() => handleProcess(row.id)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Process
            </button>
          )}
          <button
            onClick={() => handleEdit(row.id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const editingRecord = data.find(r => r.id === editing);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Fee Refund Management</h2>
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
          {showForm ? 'Cancel' : '+ New Refund Request'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <FeeForm
            title={editing ? 'Edit Refund Request' : 'New Refund Request'}
            fields={fields}
            onSubmit={handleSubmit}
            initialValues={editingRecord || {}}
            submitLabel={editing ? 'Update' : 'Submit'}
          />
        </div>
      )}

      <FeeTable columns={columns} data={data} emptyMessage="No refund requests found" />
    </div>
  );
}
