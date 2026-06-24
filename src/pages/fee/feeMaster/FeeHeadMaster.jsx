import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { feeHeadTypes } from '../feeConfig.js';

const fields = [
  { name: 'name', label: 'Fee Head Name', type: 'text', required: true, placeholder: 'Enter fee head name' },
  { name: 'type', label: 'Type', type: 'select', required: true, options: feeHeadTypes },
  { name: 'refundable', label: 'Refundable', type: 'select', required: true, options: ['Yes', 'No', 'Partial'] },
  { name: 'applicableTo', label: 'Applicable To', type: 'select', required: true, options: ['Both', 'Domestic Only', 'Abroad Only'] },
  { name: 'domestic', label: 'Domestic Amount (INR)', type: 'text', placeholder: 'N/A if abroad only' },
  { name: 'abroad', label: 'Abroad Amount (USD)', type: 'text', placeholder: 'N/A if domestic only' },
];

// Shared dummy seed data — visible in Fee Summary
export const DEFAULT_FEE_HEADS = [
  { id: 1,  sno: 1,  name: 'Tuition Fee',                   type: 'Annual',      refundable: 'Partial', applicableTo: 'Both',          domestic: 100000, abroad: 3000, status: 'Active' },
  { id: 2,  sno: 2,  name: 'Admission Fee',                  type: 'One-time',    refundable: 'No',      applicableTo: 'Both',          domestic: 10000,  abroad: 200,  status: 'Active' },
  { id: 3,  sno: 3,  name: 'Hostel Fee',                     type: 'Annual',      refundable: 'Partial', applicableTo: 'Domestic Only', domestic: 50000,  abroad: 0,    status: 'Active' },
  { id: 4,  sno: 4,  name: 'Exam Fee',                       type: 'Per exam',    refundable: 'No',      applicableTo: 'Both',          domestic: 1000,   abroad: 0,    status: 'Active' },
  { id: 5,  sno: 5,  name: 'Caution Deposit',                type: 'One-time',    refundable: 'Yes',     applicableTo: 'Both',          domestic: 5000,   abroad: 500,  status: 'Active' },
  // Abroad Fee Heads (NEW — from spec)
  { id: 6,  sno: 6,  name: 'University Fee — Abroad (NEW)',  type: 'Annual',      refundable: 'Partial', applicableTo: 'Abroad Only',   domestic: 0,      abroad: 5000, status: 'Active' },
  { id: 7,  sno: 7,  name: 'Visa Processing Fee (NEW)',       type: 'Per year',    refundable: 'No',      applicableTo: 'Abroad Only',   domestic: 0,      abroad: 300,  status: 'Active' },
  { id: 8,  sno: 8,  name: 'Pre-Departure Assistance (NEW)', type: 'One-time',    refundable: 'No',      applicableTo: 'Abroad Only',   domestic: 0,      abroad: 500,  status: 'Active' },
  { id: 9,  sno: 9,  name: 'Agent Commission (Internal)',     type: 'Per student', refundable: 'No',      applicableTo: 'Abroad Only',   domestic: 0,      abroad: 0,    status: 'Active' },
];

// Module-level store so FeeSummary can read added heads too
export let feeHeadStore = [...DEFAULT_FEE_HEADS];

export default function FeeHeadMaster() {
  const [data, setData] = useState([...DEFAULT_FEE_HEADS]);
  const [editing, setEditing] = useState(null);

  const handleSubmit = (values) => {
    const domestic = values.applicableTo === 'Abroad Only' ? 0 : (Number(values.domestic) || 0);
    const abroad = values.applicableTo === 'Domestic Only' ? 0 : (Number(values.abroad) || 0);

    if (editing !== null) {
      const updated = data.map(r => r.id === editing ? { ...r, ...values, domestic, abroad } : r);
      setData(updated);
      feeHeadStore = updated;
      setEditing(null);
    } else {
      const newItem = { id: Date.now(), sno: data.length + 1, ...values, domestic, abroad, status: 'Active' };
      const updated = [...data, newItem];
      setData(updated);
      feeHeadStore = updated;
    }
  };

  const handleToggle = (id) => {
    const updated = data.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r);
    setData(updated);
    feeHeadStore = updated;
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'name', label: 'Fee Head' },
    { key: 'type', label: 'Type' },
    { key: 'applicableTo', label: 'Applicable To' },
    {
      key: 'domestic', label: 'Domestic (INR)',
      render: (val, row) => row.applicableTo === 'Abroad Only' ? '—' : `₹${Number(val).toLocaleString('en-IN')}`
    },
    {
      key: 'abroad', label: 'Abroad (USD)',
      render: (val, row) => row.applicableTo === 'Domestic Only' ? '—' : `$${Number(val).toLocaleString()}`
    },
    { key: 'refundable', label: 'Refundable' },
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
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Head Master</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Master &gt; Fee Head Master</div>
      </div>
      <FeeForm
        key={editing}
        title={editing ? 'Edit Fee Head' : 'Add Fee Head'}
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={editing ? (() => {
          const r = data.find(x => x.id === editing) || {};
          return { ...r, domestic: String(r.domestic), abroad: String(r.abroad) };
        })() : {}}
        submitLabel={editing ? 'Update' : 'Save'}
      />
      <div className="erp-card">
        <div className="erp-card-header">Fee Head Master List</div>
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
