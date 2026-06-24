import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function DieselIn() {
  const [form, setForm] = useState({
    vehicle: '', date: today(),
    dieselQty: '', dieselPerLtrAmt: '0', netAmount: '0',
    startKm: '', endKm: '0', runningKm: '0',
    remark: '',
  });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const set = (k, v) => {
    const updated = { ...form, [k]: v };
    if (k === 'dieselQty' || k === 'dieselPerLtrAmt') {
      const qty = Number(k === 'dieselQty' ? v : form.dieselQty) || 0;
      const rate = Number(k === 'dieselPerLtrAmt' ? v : form.dieselPerLtrAmt) || 0;
      updated.netAmount = String(qty * rate);
    }
    if (k === 'endKm' || k === 'startKm') {
      const running = Math.max(0, Number(k === 'endKm' ? v : form.endKm) - Number(k === 'startKm' ? v : form.startKm));
      updated.runningKm = String(running);
    }
    setForm(updated);
  };

  const handleSubmit = () => {
    if (!form.vehicle) return;
    const avg = form.runningKm && form.dieselQty
      ? (Number(form.runningKm) / Number(form.dieselQty)).toFixed(2)
      : '0';
    setRows(p => [...p, { ...form, average: avg, id: Date.now() }]);
    setForm({ vehicle: '', date: today(), dieselQty: '', dieselPerLtrAmt: '0', netAmount: '0', startKm: '', endKm: '0', runningKm: '0', remark: '' });
  };

  const handleDelete = (id) => setRows(p => p.filter(r => r.id !== id));

  const filtered = rows.filter(r =>
    r.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Add Diesel IN</div>

      <div className="form-grid" style={{ maxWidth: 700 }}>
        <div className="form-field">
          <label className="form-label">Vehicle <span className="req">*</span></label>
          <select className="form-input" value={form.vehicle} onChange={e => set('vehicle', e.target.value)}>
            <option value="">Select</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Diesel (Qty in Ltr)</label>
          <input className="form-input" type="number" min="0" step="0.1" placeholder="Litres" value={form.dieselQty} onChange={e => set('dieselQty', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Diesel (Per Ltr Amt)</label>
          <input className="form-input" type="number" min="0" step="0.01" value={form.dieselPerLtrAmt} onChange={e => set('dieselPerLtrAmt', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Net Amount</label>
          <input className="form-input" type="number" value={form.netAmount} readOnly style={{ background: '#f1f5f9', color: '#64748b' }} />
        </div>
        <div className="form-field">
          <label className="form-label">Start Kilometre</label>
          <input className="form-input" type="number" min="0" placeholder="Start km" value={form.startKm} onChange={e => set('startKm', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">End Kilometre</label>
          <input className="form-input" type="number" min="0" value={form.endKm} onChange={e => set('endKm', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Running Kilometer</label>
          <input className="form-input" type="number" value={form.runningKm} readOnly style={{ background: '#f1f5f9', color: '#64748b' }} />
        </div>
        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Remark</label>
          <textarea className="form-input form-textarea" placeholder="Remarks" value={form.remark} onChange={e => set('remark', e.target.value)} />
        </div>
      </div>

      <div className="form-submit-row">
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Copy', 'CSV', 'Print'].map(b => (
            <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'DieselIn'); else handlePrint('Diesel In'); }}>{b}</button>
          ))}
        </div>
        <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              {['SNo.','Vehicle','Date','Diesel(Ltr)','Diesel(Per Ltr Amt)','Net Amount','Start kilometre','End kilometre','Running Kilometer','Average','Remark','Delete'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={12} className="empty-table-msg">No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.vehicle}</td>
                <td>{r.date}</td>
                <td>{r.dieselQty || '—'}</td>
                <td>{r.dieselPerLtrAmt}</td>
                <td>{r.netAmount}</td>
                <td>{r.startKm || '—'}</td>
                <td>{r.endKm}</td>
                <td>{r.runningKm}</td>
                <td>{r.average}</td>
                <td>{r.remark || '—'}</td>
                <td><button className="tbl-btn del" onClick={() => handleDelete(r.id)}>Delete</button></td>
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
