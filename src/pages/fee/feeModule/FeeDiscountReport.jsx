import React, { useState } from 'react';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches, discountTypes } from '../feeConfig.js';

export default function FeeDiscountReport() {
  const [filters, setFilters] = useState({ course: '', branch: '', batch: '', discountType: '', status: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));

  const handleReset = () => { setFilters({ course: '', branch: '', batch: '', discountType: '', status: '' }); setSubmitted(false); };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'discountType', label: 'Discount Type' },
    { key: 'discountMode', label: 'Mode' },
    { key: 'amount', label: 'Amount / %' },
    { key: 'approvedBy', label: 'Approved By' },
    { key: 'date', label: 'Date' },
    {
      key: 'status', label: 'Status',
      render: (val) => (
        <span style={{ background: val === 'Approved' ? '#dcfce7' : '#fef9c3', color: val === 'Approved' ? '#16a34a' : '#a16207', padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{val}</span>
      )
    },
  ];

  const SF = ({ label, name, options }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>{label}</label>
      <select value={filters[name]} onChange={e => handleChange(name, e.target.value)}
        style={{ border: '1px solid #cbd5e0', borderRadius: 4, padding: '6px 10px', fontSize: 12.5, fontFamily: 'inherit', color: '#333', background: '#fff', outline: 'none' }}>
        <option value="">-- All --</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Discount Report</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Fee Discount Report</div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">Filter Discounts</div>
        <div className="erp-card-body">
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
              <SF label="Course" name="course" options={courses} />
              <SF label="Branch" name="branch" options={branches} />
              <SF label="Batch" name="batch" options={batches} />
              <SF label="Discount Type" name="discountType" options={discountTypes} />
              <SF label="Status" name="status" options={['Pending', 'Approved']} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Generate Report</button>
              <button type="button" onClick={handleReset} style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      {submitted && (
        <div className="erp-card">
          <div className="erp-card-header">Discount Report</div>
          <div className="erp-card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14, fontSize: 12.5 }}>
              {Object.entries(filters).some(([, v]) => v) ? (
                Object.entries(filters).map(([key, val]) =>
                  val ? (
                    <span key={key} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 4, padding: '3px 10px', color: '#1d4ed8', fontWeight: 600 }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}: {val}
                    </span>
                  ) : null
                )
              ) : (
                <span style={{ color: '#9ca3af' }}>No filters applied — showing all discounts</span>
              )}
            </div>
            <FeeTable columns={columns} data={[]} emptyMessage="No discount records found. Apply discounts via Fee Discount first." />
          </div>
        </div>
      )}
    </div>
  );
}
