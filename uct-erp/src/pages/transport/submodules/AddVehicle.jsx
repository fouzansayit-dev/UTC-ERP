import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useEffect } from 'react';

export default function AddVehicle() {
  const [form, setForm] = useState({
    college: 'UNIVERSIDADE CATOLICA TIMORENSE',
    vehicle: '', vehicleNo: '',
    gpsTrackingId: '', gpsMobNo: '',
    numberOfSeat: '', maxAllowed: '',
    vehicleType: 'Owner', average: '',
    contactPerson: '', contactPersonMob: '',
    insuranceRDate: '', fitnessRDate: '',
    taxRDate: '', pollutionRDate: '',
    speedGovRDate: '', gpsRDate: '',
    accessory: '', remark: '',
    driver: '', helper: '',
  });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const loadVehicles = () => {
    fetch('/api/generic/transport/vehicles')
      .then(res => res.json())
      .then(data => setRows(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading vehicles:', err));
  };

  const saveVehicles = (updated) => {
    fetch('/api/generic/transport/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => loadVehicles())
      .catch(err => alert('Failed to save vehicle: ' + err.message));
  };

  useEffect(() => { loadVehicles(); }, []);

  const EMPTY_FORM = {
    college: 'UNIVERSIDADE CATOLICA TIMORENSE',
    vehicle: '', vehicleNo: '', gpsTrackingId: '', gpsMobNo: '',
    numberOfSeat: '', maxAllowed: '', vehicleType: 'Owner', average: '',
    contactPerson: '', contactPersonMob: '', insuranceRDate: '', fitnessRDate: '',
    taxRDate: '', pollutionRDate: '', speedGovRDate: '', gpsRDate: '',
    accessory: '', remark: '', driver: '', helper: '',
  };

  const handleSubmit = () => {
    if (!form.vehicle || !form.vehicleNo) { alert('Vehicle name and number are required.'); return; }
    let updated;
    if (editing !== null) {
      updated = rows.map(r => r.id === editing ? { ...r, ...form } : r);
      setEditing(null);
    } else {
      updated = [...rows, { ...form, id: Date.now(), capacity: parseInt(form.maxAllowed || form.numberOfSeat) || 40 }];
    }
    setForm(EMPTY_FORM);
    saveVehicles(updated);
  };

  const handleEdit = (r) => {
    setForm({ ...r });
    setEditing(r.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = rows.filter(r =>
    (r.vehicle || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.vehicleNo || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Add Vehicle</div>

      <div className="form-grid">
        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">College</label>
          <input className="form-input" value={form.college} readOnly style={{ background: '#f1f5f9', color: '#64748b' }} />
        </div>

        <div className="form-field">
          <label className="form-label">Vehicle <span className="req">*</span></label>
          <input className="form-input" placeholder="Vehicle name" value={form.vehicle} onChange={e => set('vehicle', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Vehicle No <span className="req">*</span></label>
          <input className="form-input" placeholder="e.g. TL-01-AB-1234" value={form.vehicleNo} onChange={e => set('vehicleNo', e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">GPS Tracking ID / URL</label>
          <input className="form-input" placeholder="GPS ID or URL" value={form.gpsTrackingId} onChange={e => set('gpsTrackingId', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">GPS Mob No</label>
          <input className="form-input" placeholder="GPS mobile number" value={form.gpsMobNo} onChange={e => set('gpsMobNo', e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">Number of Seat</label>
          <input className="form-input" type="number" min="1" placeholder="Total seats" value={form.numberOfSeat} onChange={e => set('numberOfSeat', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Max Allowed</label>
          <input className="form-input" type="number" min="1" placeholder="Max capacity" value={form.maxAllowed} onChange={e => set('maxAllowed', e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">Vehicle Type</label>
          <select className="form-input" value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)}>
            <option>Owner</option>
            <option>Rented</option>
            <option>Leased</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Average (km/ltr)</label>
          <input className="form-input" type="number" min="0" step="0.1" placeholder="Mileage" value={form.average} onChange={e => set('average', e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">Contact Person</label>
          <input className="form-input" placeholder="Contact person name" value={form.contactPerson} onChange={e => set('contactPerson', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Contact Person Mob No</label>
          <input className="form-input" placeholder="Contact mobile" value={form.contactPersonMob} onChange={e => set('contactPersonMob', e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">Insurance Renewal Date</label>
          <input className="form-input" type="date" value={form.insuranceRDate} onChange={e => set('insuranceRDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Fitness Renewal Date</label>
          <input className="form-input" type="date" value={form.fitnessRDate} onChange={e => set('fitnessRDate', e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">Tax Renewal Date</label>
          <input className="form-input" type="date" value={form.taxRDate} onChange={e => set('taxRDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Pollution Renewal Date</label>
          <input className="form-input" type="date" value={form.pollutionRDate} onChange={e => set('pollutionRDate', e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">Speed Gov. Renewal Date</label>
          <input className="form-input" type="date" value={form.speedGovRDate} onChange={e => set('speedGovRDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">GPS Renewal Date</label>
          <input className="form-input" type="date" value={form.gpsRDate} onChange={e => set('gpsRDate', e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">Accessory</label>
          <textarea className="form-input form-textarea" placeholder="Accessories details" value={form.accessory} onChange={e => set('accessory', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Remark</label>
          <textarea className="form-input form-textarea" placeholder="Any remarks" value={form.remark} onChange={e => set('remark', e.target.value)} />
        </div>

        <div className="form-field">
          <label className="form-label">Driver</label>
          <select className="form-input" value={form.driver} onChange={e => set('driver', e.target.value)}>
            <option value="">Select</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Helper</label>
          <select className="form-input" value={form.helper} onChange={e => set('helper', e.target.value)}>
            <option value="">Select</option>
          </select>
        </div>
      </div>

      <div className="form-submit-row">
        <button className="submit-btn" onClick={handleSubmit}>{editing !== null ? 'Update Vehicle' : 'Submit'}</button>
        {editing !== null && <button className="submit-btn" style={{ background: '#6b7280', marginLeft: 8 }} onClick={() => { setEditing(null); setForm(EMPTY_FORM); }}>Cancel</button>}
      </div>

      {/* Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Copy', 'CSV', 'Print'].map(b => (
            <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'AddVehicle'); else handlePrint('Add Vehicle'); }}>{b}</button>
          ))}
        </div>
        <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              {['SNo.','Edit','Status','College','Vehicle','Vehicle No','Driver','Helper','GPS Tracking ID/URL','GPS Mob No','No of Seat','Max Allowed','Vehicle Type','Average','Contact Person'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={15} className="empty-table-msg">No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td><button className="tbl-btn edit" onClick={() => handleEdit(r)}>Edit</button></td>
                <td><span style={{ color: '#16a34a', fontWeight: 600 }}>Active</span></td>
                <td>{r.college}</td>
                <td>{r.vehicle}</td>
                <td>{r.vehicleNo}</td>
                <td>{r.driver || '—'}</td>
                <td>{r.helper || '—'}</td>
                <td>{r.gpsTrackingId || '—'}</td>
                <td>{r.gpsMobNo || '—'}</td>
                <td>{r.numberOfSeat || '—'}</td>
                <td>{r.maxAllowed || '—'}</td>
                <td>{r.vehicleType}</td>
                <td>{r.average || '—'}</td>
                <td>{r.contactPerson || '—'}</td>
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
