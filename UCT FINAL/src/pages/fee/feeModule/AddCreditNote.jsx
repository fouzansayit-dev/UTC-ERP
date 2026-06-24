import { handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';

const fields = [
  { name: 'studentId', label: 'Student ID', type: 'text', required: true, placeholder: 'Enter student ID' },
  { name: 'studentName', label: 'Student Name', type: 'text', required: true, placeholder: 'Student name' },
  { name: 'creditAmount', label: 'Credit Amount (INR)', type: 'number', required: true, placeholder: '0.00' },
  { name: 'reason', label: 'Reason for Credit', type: 'select', required: true, options: ['Overpayment Adjustment', 'Fee Correction', 'Scholarship', 'Partial Refund', 'Other'] },
  { name: 'feeHead', label: 'Fee Head', type: 'select', required: true, options: ['Tuition Fee', 'Hostel Fee', 'Exam Fee', 'Library Fine', 'Miscellaneous'] },
  { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Detailed reason for credit note' },
];

export default function AddCreditNote() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const generateCreditNoteNo = () => {
    const year = new Date().getFullYear();
    const nextNo = data.length + 1;
    return `CN/${year}/${String(nextNo).padStart(3, '0')}`;
  };

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
          creditNoteNo: generateCreditNoteNo(),
          ...values,
          issueDate: new Date().toISOString().split('T')[0],
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
          r.id === id ? { ...r, status: 'Rejected', description: reason } : r
        )
      );
    }
  };

  const handlePrint = (id) => {
    handlePrint('Add Credit Note');
  };

  const handleDownload = (id) => {
    alert(`Downloading credit note PDF: ${data.find(r => r.id === id).creditNoteNo}`);
  };

  const handleEdit = (id) => {
    setEditing(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this credit note?')) {
      setData(prev => prev.filter(r => r.id !== id));
    }
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'creditNoteNo', label: 'Credit Note No' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'creditAmount', label: 'Credit Amount' },
    { key: 'reason', label: 'Reason' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'issueDate', label: 'Issue Date' },
    { key: 'approvalDate', label: 'Approval Date' },
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {row.status === 'Pending' && (
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
          <button
            onClick={() => handlePrint(row.id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Print
          </button>
          <button
            onClick={() => handleDownload(row.id)}
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
            Download
          </button>
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
        <h2>Add Credit Note</h2>
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
          {showForm ? 'Cancel' : '+ New Credit Note'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <FeeForm
            title={editing ? 'Edit Credit Note' : 'Create New Credit Note'}
            fields={fields}
            onSubmit={handleSubmit}
            initialValues={editingRecord || {}}
            submitLabel={editing ? 'Update' : 'Create'}
          />
        </div>
      )}

      <FeeTable columns={columns} data={data} emptyMessage="No credit notes found" />
    </div>
  );
}
