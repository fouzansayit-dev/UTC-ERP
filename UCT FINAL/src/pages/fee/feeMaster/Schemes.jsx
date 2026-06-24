import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { schemeCategories, schemeYears } from '../feeConfig.js';

const fields = [
  { name: 'category', label: 'Scheme Category', type: 'select', options: schemeCategories, required: true },
  { name: 'name', label: 'Scheme Name', type: 'text', required: true, placeholder: 'Enter scheme name' },
  { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'Scheme code' },
  { name: 'year', label: 'Year', type: 'select', options: schemeYears, required: true },
  { name: 'startDate', label: 'Start Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date', type: 'date', required: true },
];

export default function Schemes() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);

  const handleSubmit = (values) => {
    if (editing !== null) {
      setData(prev => prev.map(r => r.id === editing ? { ...r, ...values } : r));
      setEditing(null);
    } else {
      setData(prev => [...prev, { id: Date.now(), sno: prev.length + 1, ...values, status: 'Active' }]);
    }
  };

  const handleToggle = (id) => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'category', label: 'Scheme Category' },
    { key: 'name', label: 'Scheme Name' },
    { key: 'code', label: 'Code' },
    { key: 'year', label: 'Year' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    {
      key: 'status', label: 'Status',
      render: (val) => (
        <span style={{ background: val === 'Active' ? '#dcfce7' : '#fee2e2', color: val === 'Active' ? '#16a34a' : '#dc2626', padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{val}</span>
      )
    },
    {
      key: 'id', label: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={actionBtn('#d97706')} onClick={() => setEditing(row.id)}>Edit</button>
          <button style={actionBtn(row.status === 'Active' ? '#dc2626' : '#16a34a')} onClick={() => handleToggle(row.id)}>
            {row.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Schemes</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Master &gt; Schemes</div>
      </div>
      <FeeForm
        key={editing}
        title={editing ? 'Edit Scheme' : 'Add Scheme'}
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={editing ? (data.find(r => r.id === editing) || {}) : {}}
        submitLabel={editing ? 'Update' : 'Save'}
      />
      <div className="erp-card">
        <div className="erp-card-header">Schemes List</div>
        <div className="erp-card-body">
          <FeeTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

const actionBtn = (bg) => ({
  background: bg, color: '#fff', border: 'none', borderRadius: 4,
  padding: '4px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
});
