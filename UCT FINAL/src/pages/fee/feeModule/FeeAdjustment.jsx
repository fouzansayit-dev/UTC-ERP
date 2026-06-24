import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';

const fields = [
  { name: 'studentId', label: 'Student ID', type: 'text', required: true, placeholder: 'Enter student ID' },
  { name: 'studentName', label: 'Student Name', type: 'text', required: true, placeholder: 'Student name' },
  { name: 'feeHead', label: 'Fee Head', type: 'select', required: true, options: ['Tuition Fee', 'Hostel Fee', 'Exam Fee', 'Library Fine', 'Miscellaneous'] },
  { name: 'adjustmentType', label: 'Adjustment Type', type: 'select', required: true, options: ['Increase', 'Decrease', 'Waive Off', 'Defer'] },
  { name: 'adjustmentAmount', label: 'Adjustment Amount (INR)', type: 'number', required: true, placeholder: '0.00' },
  { name: 'reason', label: 'Reason', type: 'select', required: true, options: ['Error Correction', 'Scholarship', 'Medical Emergency', 'Financial Hardship', 'Merit Incentive', 'Policy Change', 'Other'] },
  { name: 'effectiveFrom', label: 'Effective From', type: 'date', required: true },
  { name: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Additional details' },
];

export default function FeeAdjustment() {
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
          adjustmentDate: new Date().toISOString().split('T')[0],
          approvalDate: null,
          status: 'Pending',
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

  const handleEdit = (id) => {
    setEditing(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure?')) {
      setData(prev => prev.filter(r => r.id !== id));
    }
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'adjustmentType', label: 'Type' },
    { key: 'adjustmentAmount', label: 'Amount' },
    { key: 'reason', label: 'Reason' },
    { key: 'effectiveFrom', label: 'Effective From' },
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
            backgroundColor: value === 'Approved' ? '#d4edda' : value === 'Pending' ? '#fff3cd' : '#f8d7da',
            color: value === 'Approved' ? '#155724' : value === 'Pending' ? '#856404' : '#721c24',
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
        <div style={{ display: 'flex', gap: '8px' }}>
          {row.status === 'Pending' && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                style={{ padding: '4px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(row.id)}
                style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
              >
                Reject
              </button>
            </>
          )}
          <button
            onClick={() => handleEdit(row.id)}
            style={{ padding: '4px 8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            style={{ padding: '4px 8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
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
        <h2>Fee Adjustment</h2>
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
          {showForm ? 'Cancel' : '+ New Adjustment'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <FeeForm
            title={editing ? 'Edit Fee Adjustment' : 'Create New Fee Adjustment'}
            fields={fields}
            onSubmit={handleSubmit}
            initialValues={editingRecord || {}}
            submitLabel={editing ? 'Update' : 'Submit'}
          />
        </div>
      )}

      <FeeTable columns={columns} data={data} emptyMessage="No adjustments found" />
    </div>
  );
}
