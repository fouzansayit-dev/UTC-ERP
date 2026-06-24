import React, { useState } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { feeHeadTypes, currencies, schemeCategories } from '../feeConfig.js';

const fields = [
  { name: 'schemeCat',  label: 'Scheme Category', type: 'select', required: true, options: schemeCategories },
  { name: 'feeHead',    label: 'Fee Head',         type: 'text',   required: true, placeholder: 'e.g. Tuition Fee' },
  { name: 'feeType',    label: 'Fee Type',         type: 'select', required: true, options: feeHeadTypes },
  { name: 'amountINR',  label: 'Amount (INR ₹)',   type: 'number', required: false, placeholder: '0.00' },
  { name: 'amountUSD',  label: 'Amount (USD $)',   type: 'number', required: false, placeholder: '0.00' },
  { name: 'refundable', label: 'Refundable',       type: 'select', required: false, options: ['Yes', 'Partial', 'No'] },
];

const columns = [
  { key: 'sno',        label: 'S.No'          },
  { key: 'schemeCat',  label: 'Scheme Cat.'   },
  { key: 'feeHead',    label: 'Fee Head'      },
  { key: 'feeType',    label: 'Type'          },
  { key: 'amountINR',  label: 'INR (₹)',       render: (v) => v ? `₹${v}` : '—' },
  { key: 'amountUSD',  label: 'USD ($)',       render: (v) => v ? `$${v}` : '—' },
  { key: 'refundable', label: 'Refundable',
    render: (v) => {
      const color = v === 'Yes' ? '#16a34a' : v === 'Partial' ? '#d97706' : '#dc2626';
      const bg    = v === 'Yes' ? '#dcfce7' : v === 'Partial' ? '#fef9c3' : '#fee2e2';
      return <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{v || '—'}</span>;
    }
  },
  {
    key: 'id', label: 'Action',
    render: (_, row, helpers) => (
      <button style={actionBtn('#d97706')} onClick={() => helpers.edit(row.id)}>Edit</button>
    ),
  },
];

export default function FeeMaster() {
  const [data, setData]       = useState([]);
  const [editing, setEditing] = useState(null);

  const handleSubmit = (values) => {
    if (editing !== null) {
      setData(prev => prev.map(r => r.id === editing ? { ...r, ...values } : r));
      setEditing(null);
    } else {
      setData(prev => [...prev, { id: Date.now(), sno: prev.length + 1, ...values }]);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Master</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Master &gt; Fee Master</div>
      </div>

      {/* Currency toggle hint */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#1d4ed8', marginBottom: 16 }}>
        Multi-currency support enabled — enter both INR and USD amounts where applicable.
      </div>

      <FeeForm
        key={editing}
        title={editing ? 'Edit Fee Master Record' : 'Add Fee Master Record'}
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={editing ? (data.find(r => r.id === editing) || {}) : {}}
        submitLabel={editing ? 'Update' : 'Save'}
      />

      <div className="erp-card">
        <div className="erp-card-header">Fee Master List</div>
        <div className="erp-card-body">
          <FeeTable
            columns={columns}
            data={data}
            columnHelpers={{ edit: setEditing }}
          />
        </div>
      </div>
    </div>
  );
}

const actionBtn = (bg) => ({
  background: bg, color: '#fff', border: 'none', borderRadius: 4,
  padding: '4px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
});
