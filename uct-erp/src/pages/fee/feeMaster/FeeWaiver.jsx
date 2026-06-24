import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';

const fields = [
  { name: 'studentId', label: 'Student ID', type: 'text', required: true, placeholder: 'Enter student ID' },
  { name: 'studentName', label: 'Student Name', type: 'text', required: true, placeholder: 'Student name' },
  { name: 'waiverType', label: 'Waiver Type', type: 'select', required: true, options: ['Full Waiver', 'Partial Waiver', 'Exemption'] },
  { name: 'feeHead', label: 'Fee Head', type: 'select', required: true, options: ['Tuition Fee', 'Hostel Fee', 'All Fees'] },
  { name: 'waiverPercentage', label: 'Waiver % / Amount', type: 'text', required: true, placeholder: '50% or ₹50000' },
  { name: 'category', label: 'Category', type: 'select', required: true, options: ['Merit Scholarship', 'Need-based Scholarship', 'Sports Scholarship', 'Faculty Staff', 'Government Order', 'Other'] },
  { name: 'validFrom', label: 'Valid From', type: 'date', required: true },
  { name: 'validTo', label: 'Valid To', type: 'date', required: true },
  { name: 'approverName', label: 'Approver Name', type: 'text', required: true, placeholder: 'Name of approver' },
  { name: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Additional details' },
];

export default function FeeWaiver() {
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
          status: 'Active',
        },
      ]);
    }
    setShowForm(false);
  };

  const handleDeactivate = (id) => {
    setData(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'Inactive' } : r
      )
    );
  };

  const handleActivate = (id) => {
    setData(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'Active' } : r
      )
    );
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
    { key: 'waiverType', label: 'Waiver Type' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'waiverPercentage', label: 'Waiver %' },
    { key: 'category', label: 'Category' },
    { key: 'validFrom', label: 'Valid From' },
    { key: 'validTo', label: 'Valid To' },
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
            backgroundColor: value === 'Active' ? '#d4edda' : '#e2e3e5',
            color: value === 'Active' ? '#155724' : '#383d41',
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
          {row.status === 'Active' ? (
            <button
              onClick={() => handleDeactivate(row.id)}
              style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
            >
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => handleActivate(row.id)}
              style={{ padding: '4px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
            >
              Activate
            </button>
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
        <h2>Fee Waiver / Exemption</h2>
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
          {showForm ? 'Cancel' : '+ New Waiver'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <FeeForm
            title={editing ? 'Edit Fee Waiver' : 'Create New Fee Waiver'}
            fields={fields}
            onSubmit={handleSubmit}
            initialValues={editingRecord || {}}
            submitLabel={editing ? 'Update' : 'Create'}
          />
        </div>
      )}

      <FeeTable columns={columns} data={data} emptyMessage="No waivers found" />
    </div>
  );
}
