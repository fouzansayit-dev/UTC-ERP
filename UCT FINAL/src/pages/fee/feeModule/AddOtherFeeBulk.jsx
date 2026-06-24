import React, { useState } from 'react';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches } from '../feeConfig.js';

export default function AddOtherFeeBulk() {
  const [filters, setFilters] = useState({ course: '', branch: '', batch: '' });
  const [feeHead, setFeeHead] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [applied, setApplied] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));

  const handleApply = (e) => {
    e.preventDefault();
    if (!filters.course || !filters.batch) { setError('Course and Batch are required to apply bulk fee.'); return; }
    if (!feeHead || !amount || !date) { setError('Fee Head, Amount, and Date are required.'); return; }
    setError('');
    const count = applied.length + 1;
    setApplied(prev => [...prev, {
      id: Date.now(), sno: count,
      batchRef: `${filters.course} / ${filters.branch || 'All Branches'} / ${filters.batch}`,
      feeHead, description, amount: Number(amount) || 0, date, status: 'Applied',
    }]);
    setFeeHead(''); setDescription(''); setAmount(''); setDate('');
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'batchRef', label: 'Applied To (Course / Branch / Batch)' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount (INR)', render: (v) => `₹${Number(v).toLocaleString('en-IN')}` },
    { key: 'date', label: 'Date' },
    {
      key: 'status', label: 'Status',
      render: (val) => <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{val}</span>
    },
    {
      key: 'id', label: 'Action',
      render: (_, row) => (
        <button style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
          onClick={() => setApplied(prev => prev.filter(r => r.id !== row.id))}>Remove</button>
      )
    },
  ];

  const SL = ({ label, name, options, required }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
      <select value={filters[name]} onChange={e => handleChange(name, e.target.value)} style={iStyle}>
        <option value="">-- All --</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const TF = ({ label, value, onChange, placeholder, required, type = 'text' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} style={iStyle} />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Add Other Fee (Bulk)</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Add Other Fee Bulk</div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">Apply Fee to Multiple Students</div>
        <div className="erp-card-body">
          <form onSubmit={handleApply}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: '8px 12px', color: '#dc2626', fontSize: 12.5, marginBottom: 12 }}>{error}</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
              <SL label="Course" name="course" options={courses} required />
              <SL label="Branch" name="branch" options={branches} />
              <SL label="Batch" name="batch" options={batches} required />
              <TF label="Fee Head" value={feeHead} onChange={setFeeHead} placeholder="Enter fee head name" required />
              <TF label="Description" value={description} onChange={setDescription} placeholder="Optional description" />
              <TF label="Amount (INR)" value={amount} onChange={setAmount} placeholder="Enter amount" required />
              <TF label="Date" value={date} onChange={setDate} required type="date" />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Apply to Batch</button>
              <button type="button" onClick={() => { setFilters({ course: '', branch: '', batch: '' }); setFeeHead(''); setDescription(''); setAmount(''); setDate(''); setError(''); }}
                style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">Bulk Fee Applications</div>
        <div className="erp-card-body">
          <FeeTable columns={columns} data={applied} emptyMessage="No bulk fee applications yet." />
        </div>
      </div>
    </div>
  );
}

const iStyle = { border: '1px solid #cbd5e0', borderRadius: 4, padding: '6px 10px', fontSize: 12.5, fontFamily: 'inherit', color: '#333', background: '#fff', outline: 'none', width: '100%' };
