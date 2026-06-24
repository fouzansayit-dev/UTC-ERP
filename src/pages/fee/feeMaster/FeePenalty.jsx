import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';

const fields = [
  { name: 'studentId', label: 'Student ID', type: 'text', required: true, placeholder: 'Enter student ID' },
  { name: 'studentName', label: 'Student Name', type: 'text', required: true, placeholder: 'Student name' },
  { name: 'penaltyType', label: 'Penalty Type', type: 'select', required: true, options: ['Late Payment Fine', 'Library Fine', 'Examination Delay', 'Damage Charge', 'Miscellaneous Fine'] },
  { name: 'amount', label: 'Penalty Amount (INR)', type: 'number', required: true, placeholder: '0.00' },
  { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
  { name: 'reason', label: 'Reason', type: 'textarea', required: true, placeholder: 'Detailed reason for penalty' },
];

export default function FeePenalty() {
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
          issuedDate: new Date().toISOString().split('T')[0],
          paidDate: null,
          status: 'Outstanding',
        },
      ]);
    }
    setShowForm(false);
  };

  const handleMarkPaid = (id) => {
    setData(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : r
      )
    );
  };

  const handleMarkWaived = (id) => {
    const reason = prompt('Enter waiver reason:');
    if (reason) {
      setData(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: 'Waived', reason } : r
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
    { key: 'penaltyType', label: 'Penalty Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'issuedDate', label: 'Issued Date' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'paidDate', label: 'Paid Date' },
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
            backgroundColor: value === 'Paid' ? '#d4edda' : value === 'Outstanding' ? '#fff3cd' : '#e2e3e5',
            color: value === 'Paid' ? '#155724' : value === 'Outstanding' ? '#856404' : '#383d41',
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
          {row.status === 'Outstanding' && (
            <>
              <button
                onClick={() => handleMarkPaid(row.id)}
                style={{ padding: '4px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
              >
                Mark Paid
              </button>
              <button
                onClick={() => handleMarkWaived(row.id)}
                style={{ padding: '4px 8px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
              >
                Waive
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
        <h2>Fee Penalty / Fine</h2>
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
          {showForm ? 'Cancel' : '+ New Penalty'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <FeeForm
            title={editing ? 'Edit Penalty' : 'Add New Penalty'}
            fields={fields}
            onSubmit={handleSubmit}
            initialValues={editingRecord || {}}
            submitLabel={editing ? 'Update' : 'Add Penalty'}
          />
        </div>
      )}

      <FeeTable columns={columns} data={data} emptyMessage="No penalties found" />
    </div>
  );
}
