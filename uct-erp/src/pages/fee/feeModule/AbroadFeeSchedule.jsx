import React, { useState } from 'react';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches, semesters, schemeCategories, schemeOptions } from '../feeConfig.js';
import { feeHeadStore } from '../feeMaster/FeeHeadMaster.jsx';

export default function AbroadFeeSchedule() {
  const [filters, setFilters] = useState({ course: '', branch: '', batch: '', schemeCategory: '', scheme: '', semester: '' });
  const [submitted, setSubmitted] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);

  const handleChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const abroad = feeHeadStore
      .filter(h => h.status === 'Active' && h.applicableTo !== 'Domestic Only' && h.abroad > 0)
      .map((h, idx) => ({ ...h, sno: idx + 1, amountUSD: h.abroad, amountINR: h.abroad * 83 }));
    setScheduleData(abroad);
    setSubmitted(true);
  };

  const handleReset = () => { setFilters({ course: '', branch: '', batch: '', schemeCategory: '', scheme: '', semester: '' }); setSubmitted(false); setScheduleData([]); };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'name', label: 'Fee Head' },
    { key: 'type', label: 'Type' },
    { key: 'applicableTo', label: 'Applicable To' },
    { key: 'amountUSD', label: 'Amount (USD)', render: (v) => <span style={{ fontWeight: 600, color: '#0ea5e9' }}>${Number(v).toLocaleString()}</span> },
    { key: 'amountINR', label: 'INR Equivalent', render: (v) => <span style={{ fontWeight: 600, color: '#1a2236' }}>₹{Number(v).toLocaleString('en-IN')}</span> },
    {
      key: 'refundable', label: 'Refundable',
      render: (v) => {
        const c = { Yes: '#16a34a', No: '#dc2626', Partial: '#d97706' };
        return <span style={{ fontWeight: 600, color: c[v] || '#333' }}>{v}</span>;
      }
    },
  ];

  const SF = ({ label, name, options }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>{label}</label>
      <select value={filters[name]} onChange={e => handleChange(name, e.target.value)}
        style={{ border: '1px solid #cbd5e0', borderRadius: 4, padding: '6px 10px', fontSize: 12.5, fontFamily: 'inherit', color: '#333', background: '#fff', outline: 'none' }}>
        <option value="">-- Select --</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Abroad Student Fee Schedule</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Abroad Fee Schedule</div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">Fee Schedule Filter — Abroad Students</div>
        <div className="erp-card-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
              <SF label="Course" name="course" options={courses} />
              <SF label="Branch Name" name="branch" options={branches} />
              <SF label="Batch" name="batch" options={batches} />
              <SF label="Scheme Category" name="schemeCategory" options={schemeCategories} />
              <SF label="Scheme" name="scheme" options={schemeOptions} />
              <SF label="Current Year / Semester" name="semester" options={semesters} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>View Schedule</button>
              <button type="button" onClick={handleReset} style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      {submitted && (
        <div className="erp-card">
          <div className="erp-card-header">Abroad Fee Schedule — USD / INR</div>
          <div className="erp-card-body">
            <FeeTable columns={columns} data={scheduleData} emptyMessage="No abroad fee heads found. Add abroad fee heads in Fee Head Master." />
          </div>
        </div>
      )}
    </div>
  );
}
