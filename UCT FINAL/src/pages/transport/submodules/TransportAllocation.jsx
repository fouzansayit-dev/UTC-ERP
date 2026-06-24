import React, { useState, useEffect } from 'react';

export default function TransportAllocation() {
  const [vehicles, setVehicles] = useState([]);
  const [students, setStudents] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [form, setForm] = useState({
    studentId: '', studentName: '',
    vehicleId: '', vehicleName: '', route: '',
    allocationDate: new Date().toISOString().split('T')[0],
    pickupPoint: '', remarks: '',
  });
  const [studentSearch, setStudentSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [search, setSearch] = useState('');

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/generic/transport/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading vehicles:', err));

    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data.filter(s => s.status === 'active') : []))
      .catch(err => console.error('Error loading students:', err));

    fetch('/api/generic/transport/allocations')
      .then(res => res.json())
      .then(data => setAllocations(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading allocations:', err));
  };

  useEffect(() => { loadData(); }, []);

  const studentSuggestions = studentSearch.trim().length > 0
    ? students.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s.scholar_no || '').toLowerCase().includes(studentSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  const selectStudent = (stu) => {
    setForm(p => ({ ...p, studentId: stu.scholar_no || String(stu.id), studentName: stu.name }));
    setStudentSearch(stu.name);
    setShowSuggestions(false);
  };

  const handleVehicleChange = (e) => {
    const vid = e.target.value;
    const v = vehicles.find(v => String(v.id || v.V01) === vid);
    setForm(p => ({
      ...p,
      vehicleId: vid,
      vehicleName: v ? (v.vehicle || v.vehicleName || '') : '',
      route: v ? (v.route || '') : '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.studentName.trim()) { alert('Please select a student.'); return; }
    if (!form.vehicleId) { alert('Please select a vehicle/route.'); return; }

    const vehicle = vehicles.find(v => String(v.id || v.V01) === form.vehicleId);
    const capacity = vehicle ? (vehicle.capacity || 40) : 40;
    const assigned = allocations.filter(a => a.vehicleId === form.vehicleId).length;
    if (assigned >= capacity) {
      alert(`Vehicle "${form.vehicleName}" is at full capacity (${capacity} seats). Please choose another vehicle.`);
      return;
    }

    const updated = [...allocations, { ...form, _id: Date.now(), sno: allocations.length + 1 }];
    fetch('/api/generic/transport/allocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => {
        setAllocations(updated);
        setForm({ studentId: '', studentName: '', vehicleId: '', vehicleName: '', route: '', allocationDate: new Date().toISOString().split('T')[0], pickupPoint: '', remarks: '' });
        setStudentSearch('');
        alert(`Transport allocated! ${form.studentName} → ${form.vehicleName} (${assigned + 1}/${capacity} seats used)`);
      })
      .catch(err => alert('Failed to save allocation: ' + err.message));
  };

  const filtered = allocations.filter(a =>
    (a.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.vehicleName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Transport Allocation</div>

      {/* Vehicle Capacity Overview */}
      {vehicles.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {vehicles.map(v => {
            const cap = v.capacity || 40;
            const used = allocations.filter(a => a.vehicleId === String(v.id || v.V01)).length;
            const pct = Math.round((used / cap) * 100);
            const full = used >= cap;
            return (
              <div key={v.id || v.V01} style={{
                background: full ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${full ? '#fca5a5' : '#86efac'}`,
                borderRadius: 8, padding: '10px 14px', minWidth: 150,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{v.vehicle || v.vehicleName || 'Bus'}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>{v.route || 'Route'}</div>
                <div style={{ marginTop: 6, background: '#e5e7eb', borderRadius: 4, height: 6 }}>
                  <div style={{ width: `${Math.min(pct, 100)}%`, background: full ? '#ef4444' : '#22c55e', height: 6, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, marginTop: 4, color: full ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                  {used}/{cap} {full ? '● Full' : '● Available'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Allocation Form */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)' }}>
        <div style={{ fontWeight: 700, color: '#1a2236', marginBottom: 16, fontSize: 14 }}>New Transport Allocation</div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Student search autocomplete */}
            <div className="form-field" style={{ position: 'relative' }}>
              <label className="form-label">Search Student *</label>
              <input
                className="form-input"
                value={studentSearch}
                onChange={e => { setStudentSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Type name or scholar no..."
              />
              {showSuggestions && studentSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto'
                }}>
                  {studentSuggestions.map(s => (
                    <div key={s.id} onClick={() => selectStudent(s)}
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <strong>{s.name}</strong>
                      <span style={{ color: '#94a3b8', marginLeft: 8, fontSize: 11 }}>{s.scholar_no} · {s.course}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Student ID</label>
              <input className="form-input" value={form.studentId} readOnly style={{ background: '#f8fafc' }} />
            </div>

            <div className="form-field">
              <label className="form-label">Select Vehicle / Route *</label>
              <select className="form-input" value={form.vehicleId} onChange={handleVehicleChange}>
                <option value="">-- Select Vehicle --</option>
                {vehicles.map(v => {
                  const cap = v.capacity || 40;
                  const used = allocations.filter(a => a.vehicleId === String(v.id || v.V01)).length;
                  return (
                    <option key={v.id || v.V01} value={String(v.id || v.V01)} disabled={used >= cap}>
                      {v.vehicle || v.vehicleName} — {v.route || 'No route'} ({used}/{cap} seats)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Route</label>
              <input className="form-input" value={form.route} readOnly style={{ background: '#f8fafc' }} />
            </div>

            <div className="form-field">
              <label className="form-label">Pickup Point</label>
              <input className="form-input" value={form.pickupPoint} onChange={set('pickupPoint')} placeholder="e.g. Becora Junction" />
            </div>

            <div className="form-field">
              <label className="form-label">Allocation Date</label>
              <input className="form-input" type="date" value={form.allocationDate} onChange={set('allocationDate')} />
            </div>

            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Remarks</label>
              <textarea className="form-input form-textarea" value={form.remarks} onChange={set('remarks')} rows={2} />
            </div>
          </div>

          <div className="form-submit-row">
            <button type="submit" className="submit-btn">Allocate Transport</button>
          </div>
        </form>
      </div>

      {/* Allocations Table */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, color: '#1a2236', fontSize: 14 }}>Allocation Records ({filtered.length})</div>
          <input className="form-input" style={{ width: 220 }} placeholder="Search allocations..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap">
          <table className="hr-table">
            <thead>
              <tr>
                <th>SNo.</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Vehicle</th>
                <th>Route</th>
                <th>Pickup Point</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="empty-table-msg">No transport allocations found.</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                  <td>{r.studentId}</td>
                  <td>{r.vehicleName}</td>
                  <td>{r.route || '—'}</td>
                  <td>{r.pickupPoint || '—'}</td>
                  <td>{r.allocationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
