import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import React, { useState } from 'react';

const INIT_USERS = [];

export default function ViewEditUser({ onEdit }) {
  const [rows, setRows] = useState(INIT_USERS);
  const [search, setSearch] = useState('');
  const [pinModal, setPinModal] = useState(null);

  const filtered = rows.filter(r =>
    r.userid.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (r) => {
    const copy = { ...r, id: Date.now(), userid: r.userid + '_copy' };
    setRows(p => [...p, copy]);
  };

  return (
    <div className="hr-form">
      <div className="section-title">View User</div>

      <div className="table-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }}
                onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'ViewEditUser'); else handlePrint('View Edit User'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 220 }} placeholder="Search..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <table className="hr-table">
          <thead>
            <tr>
              <th>SNo.</th>
              <th>Copy</th>
              <th>Edit</th>
              <th>Userid</th>
              <th>OTP Mobile No</th>
              <th>Password / PIN</th>
              <th>Employee</th>
              <th>College</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>No data available</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>
                  <button
                    onClick={() => handleCopy(r)}
                    style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    📋 Copy
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => onEdit && onEdit(r)}
                    style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    ✎ Edit
                  </button>
                </td>
                <td style={{ fontWeight: 500 }}>{r.userid}</td>
                <td>{r.otpMobileNo || ''}</td>
                <td>
                  <button
                    onClick={() => setPinModal(r)}
                    style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>
                    View
                  </button>
                </td>
                <td>{r.employee || ''}</td>
                <td style={{ fontSize: 12 }}>{r.college}</td>
                <td>{r.type}</td>
                <td>
                  <span style={{ color: '#16a34a', fontWeight: 500 }}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 13, color: '#666' }}>
            Showing 1 to {filtered.length} of {filtered.length} entries
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="tbl-btn view">Previous</button>
            <button className="tbl-btn view" style={{ background: '#4361ee', color: '#fff' }}>1</button>
            <button className="tbl-btn view">Next</button>
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      {pinModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '24px 32px', minWidth: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>PIN — {pinModal.userid}</div>
            <div style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', letterSpacing: 8, color: '#4361ee', marginBottom: 20 }}>
              {pinModal.pin || '—'}
            </div>
            <button className="submit-btn" style={{ width: '100%' }} onClick={() => setPinModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
