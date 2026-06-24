import React, { useState } from 'react';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches, semesters, schemeCategories, schemeOptions } from '../feeConfig.js';
import { feeHeadStore } from '../feeMaster/FeeHeadMaster.jsx';

const REFUND_COLOR = { Yes: '#16a34a', No: '#dc2626', Partial: '#d97706' };

export default function FeeSummary() {
  const [filters, setFilters] = useState({ course: '', branch: '', batch: '', schemeCategory: '', scheme: '', semester: '' });
  const [submitted, setSubmitted] = useState(false);
  const [summaryData, setSummaryData] = useState([]);

  const handleChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Read live fee head store (includes defaults + any user-added heads)
    const active = feeHeadStore.filter(h => h.status === 'Active');
    const rows = active.map((h, idx) => ({ ...h, sno: idx + 1 }));
    setSummaryData(rows);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFilters({ course: '', branch: '', batch: '', schemeCategory: '', scheme: '', semester: '' });
    setSubmitted(false);
    setSummaryData([]);
  };

  const totalINR = summaryData.reduce((acc, h) => acc + (h.domestic || 0), 0);
  const totalUSD = summaryData.reduce((acc, h) => acc + (h.abroad || 0), 0);

  const tableColumns = [
    { key: 'sno', label: 'SNo' },
    { key: 'name', label: 'Fee Head' },
    { key: 'type', label: 'Type' },
    {
      key: 'domestic', label: 'Domestic Amount (INR)',
      render: (v, row) => row.applicableTo === 'Abroad Only'
        ? <span style={{ color: '#9ca3af' }}>—</span>
        : <span style={{ fontWeight: 600, color: '#1a2236' }}>₹{Number(v).toLocaleString('en-IN')}</span>
    },
    {
      key: 'abroad', label: 'Abroad Amount (USD)',
      render: (v, row) => (row.applicableTo === 'Domestic Only' || !v)
        ? <span style={{ color: '#9ca3af' }}>—</span>
        : <span style={{ fontWeight: 600, color: '#0ea5e9' }}>${Number(v).toLocaleString()}</span>
    },
    {
      key: 'refundable', label: 'Refundable',
      render: (v) => <span style={{ fontWeight: 600, color: REFUND_COLOR[v] || '#333' }}>{v}</span>
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
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Summary</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Fee Summary</div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">Fee Summary — Filter</div>
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
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Submit</button>
              <button type="button" onClick={handleReset} style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      {submitted && (
        <>
          {/* Applied Filters */}
          <div className="erp-card">
            <div className="erp-card-header">Applied Filters</div>
            <div className="erp-card-body">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12.5 }}>
                {Object.entries(filters).some(([, v]) => v) ? (
                  Object.entries(filters).map(([key, val]) =>
                    val ? (
                      <span key={key} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 4, padding: '3px 10px', color: '#1d4ed8', fontWeight: 600 }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}: {val}
                      </span>
                    ) : null
                  )
                ) : (
                  <span style={{ color: '#9ca3af' }}>No filters applied — showing all fee heads</span>
                )}
              </div>
            </div>
          </div>

          {/* Totals summary */}
          {summaryData.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Total Fee Heads', value: summaryData.length, color: '#3b82f6' },
                { label: 'Total Domestic (INR)', value: `₹${totalINR.toLocaleString('en-IN')}`, color: '#16a34a' },
                { label: 'Total Abroad (USD)', value: `$${totalUSD.toLocaleString()}`, color: '#0ea5e9' },
              ].map(card => (
                <div key={card.label} className="erp-card" style={{ marginBottom: 0 }}>
                  <div style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 12.5, color: '#6b7fa3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{card.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: card.color }}>{card.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fee Head Table */}
          <div className="erp-card">
            <div className="erp-card-header">Fee Summary — Grouped by Fee Head</div>
            <div className="erp-card-body">
              <FeeTable
                columns={tableColumns}
                data={summaryData}
                emptyMessage="No fee heads found. Please add fee heads in Fee Head Master first."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
