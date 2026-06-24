import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import React, { useState } from 'react';

const DEFAULT_COLLEGE = {
  id: 1,
  name: 'UNIVERSIDADE CATOLICA TIMORENSE',
  collegeCode: 'UCT',
  scholarNoPrefix: '',
  startScholarNo: '',
  address: 'DILI, TIMOR LESTE',
  icardAddress: 'DILI, TIMOR LESTE',
  signature: '',
  status: 'Active',
};

export default function CollegeSettings({ onBack }) {
  const [rows] = useState([DEFAULT_COLLEGE]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.collegeCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">College List</div>

      <div className="table-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }}
                onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'CollegeSettings'); else handlePrint('College Settings'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <table className="hr-table">
          <thead>
            <tr>
              {['SNo', 'Name', 'College Code', 'Scholar No Prefix', 'Start Scholar No', 'Address', 'ICard Address', 'Signature', 'Logo', 'Status', 'Edit'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.name}</td>
                <td>{r.collegeCode}</td>
                <td>{r.scholarNoPrefix}</td>
                <td>{r.startScholarNo}</td>
                <td>{r.address}</td>
                <td>{r.icardAddress}</td>
                <td>{r.signature}</td>
                <td>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#64748b' }}>Logo</div>
                </td>
                <td>
                  <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500, background: '#dcfce7', color: '#166534' }}>{r.status}</span>
                </td>
                <td>
                  <button className="tbl-btn view" style={{ background: '#e0f2fe', color: '#0369a1' }} onClick={() => alert('Edit college settings')}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 13, color: '#666' }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="tbl-btn view">Previous</button>
            <button className="tbl-btn view" style={{ background: '#4361ee', color: '#fff' }}>1</button>
            <button className="tbl-btn view">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
