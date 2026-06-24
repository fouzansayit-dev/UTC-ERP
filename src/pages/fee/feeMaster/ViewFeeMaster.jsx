import React, { useState } from 'react';
import FeeTable from '../common/FeeTable.jsx';
import { schemeCategories, feeHeadTypes } from '../feeConfig.js';

const SAMPLE = [
  { id: 1, sno: 1, schemeCat: 'Government',  feeHead: 'Tuition Fee',              feeType: 'Annual',      amountINR: '60,000', amountUSD: '—',    refundable: 'Partial' },
  { id: 2, sno: 2, schemeCat: 'Government',  feeHead: 'Registration / Admission', feeType: 'One-time',    amountINR: '5,000',  amountUSD: '—',    refundable: 'No' },
  { id: 3, sno: 3, schemeCat: 'NRI',         feeHead: 'Tuition Fee',              feeType: 'Annual',      amountINR: '—',      amountUSD: '8,000', refundable: 'Partial' },
  { id: 4, sno: 4, schemeCat: 'NRI',         feeHead: 'University Fee — Abroad',  feeType: 'Annual',      amountINR: '—',      amountUSD: '5,000', refundable: 'Partial' },
  { id: 5, sno: 5, schemeCat: 'NRI',         feeHead: 'Visa Processing Fee',      feeType: 'Per year',    amountINR: '—',      amountUSD: '500',   refundable: 'No' },
  { id: 6, sno: 6, schemeCat: 'Management',  feeHead: 'Hostel Fee',               feeType: 'Annual',      amountINR: '40,000', amountUSD: '—',    refundable: 'Partial' },
  { id: 7, sno: 7, schemeCat: 'Scholarship', feeHead: 'Caution / Security Deposit', feeType: 'One-time',  amountINR: '10,000', amountUSD: '10,000', refundable: 'Yes' },
];

const columns = [
  { key: 'sno',        label: 'S.No'           },
  { key: 'schemeCat',  label: 'Scheme Category' },
  { key: 'feeHead',    label: 'Fee Head'        },
  { key: 'feeType',    label: 'Type'            },
  { key: 'amountINR',  label: 'INR (₹)',         render: (v) => v && v !== '—' ? `₹${v}` : '—' },
  { key: 'amountUSD',  label: 'USD ($)',         render: (v) => v && v !== '—' ? `$${v}` : '—' },
  { key: 'refundable', label: 'Refundable',
    render: (v) => {
      const color = v === 'Yes' ? '#16a34a' : v === 'Partial' ? '#d97706' : '#dc2626';
      const bg    = v === 'Yes' ? '#dcfce7' : v === 'Partial' ? '#fef9c3' : '#fee2e2';
      return <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{v}</span>;
    }
  },
];

export default function ViewFeeMaster() {
  const [filterCat, setFilterCat]   = useState('');
  const [filterType, setFilterType] = useState('');

  const filtered = SAMPLE.filter(r =>
    (!filterCat  || r.schemeCat === filterCat) &&
    (!filterType || r.feeType === filterType)
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>View Fee Master</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Master &gt; View Fee Master</div>
      </div>

      {/* Filter bar */}
      <div className="erp-card" style={{ marginBottom: 16 }}>
        <div className="erp-card-header">Filter</div>
        <div className="erp-card-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <label style={labelStyle}>Scheme Category</label>
              <select style={selectStyle} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="">All</option>
                {schemeCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fee Type</label>
              <select style={selectStyle} value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">All</option>
                {feeHeadTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button style={btnStyle} onClick={() => { setFilterCat(''); setFilterType(''); }}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header">Fee Master Records ({filtered.length})</div>
        <div className="erp-card-body">
          <FeeTable columns={columns} data={filtered} />
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 4 };
const selectStyle = { padding: '6px 10px', fontSize: 12.5, border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', minWidth: 160 };
const btnStyle = { background: '#6b7fa3', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' };
