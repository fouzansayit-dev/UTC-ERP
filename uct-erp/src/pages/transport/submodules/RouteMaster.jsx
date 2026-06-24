import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

export default function RouteMaster() {
  const [form, setForm] = useState({
    college: '', facilities: 'Transport',
    route: '', vehicle: '', routeCharges: '',
  });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.route) return;
    setRows(p => [...p, { ...form, id: Date.now(), status: 'Active' }]);
    setForm({ college: '', facilities: 'Transport', route: '', vehicle: '', routeCharges: '' });
  };

  const filtered = rows.filter(r =>
    r.route.toLowerCase().includes(search.toLowerCase()) ||
    (r.college || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Add Route</div>

      <div className="form-grid" style={{ maxWidth: 700 }}>
        <div className="form-field">
          <label className="form-label">College</label>
          <select className="form-input" value={form.college} onChange={e => set('college', e.target.value)}>
            <option value="">None selected</option>
            <option>UNIVERSIDADE CATOLICA TIMORENSE</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Facilities</label>
          <select className="form-input" value={form.facilities} onChange={e => set('facilities', e.target.value)}>
            <option>Transport</option>
            <option>Hostel</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Route <span className="req">*</span></label>
          <input className="form-input" placeholder="Route name" value={form.route} onChange={e => set('route', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Vehicle</label>
          <select className="form-input" value={form.vehicle} onChange={e => set('vehicle', e.target.value)}>
            <option value="">Select</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Route Charges</label>
          <input className="form-input" type="number" min="0" placeholder="Amount" value={form.routeCharges} onChange={e => set('routeCharges', e.target.value)} />
        </div>
      </div>

      <div className="form-submit-row">
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Copy', 'CSV', 'Print'].map(b => (
            <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'RouteMaster'); else handlePrint('Route Master'); }}>{b}</button>
          ))}
        </div>
        <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              {['SNo', 'Edit', 'College', 'Route', 'Vehicle', 'Amount', 'Status'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-table-msg">No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td><button className="tbl-btn edit" onClick={() => alert("Edit record")}>Edit</button></td>
                <td>{r.college || '—'}</td>
                <td>{r.route}</td>
                <td>{r.vehicle || '—'}</td>
                <td>{r.routeCharges || '—'}</td>
                <td><span style={{ color: '#16a34a', fontWeight: 600 }}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
        Showing {filtered.length === 0 ? '0 to 0 of 0' : `1 to ${filtered.length} of ${filtered.length}`} entries
      </div>
    </div>
  );
}
