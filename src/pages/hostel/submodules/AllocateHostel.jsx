import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useEffect } from 'react';
import '../Hostel.css';

const ROOM_CONDITION_ITEMS = [
  'Bed condition', 'Mattress condition', 'Pillow / Bedsheet',
  'Cupboard / Locker', 'Window / Grill', 'Door / Lock',
  'Fan / AC working', 'Light / Switch board', 'Washroom condition',
  'Floor condition',
];

const INIT_ALLOC = {
  studentId: '', studentName: '', hostel: '', roomId: '', roomNo: '',
  bedNo: '', allocationDate: new Date().toISOString().split('T')[0],
  cautionDeposit: '', depositMode: 'Cash', remarks: '',
  roomCondition: ROOM_CONDITION_ITEMS.map(item => ({ item, status: 'Good', remarks: '' })),
};

export default function AllocateHostel() {
  const [showForm, setShowForm] = useState(false);
  const [alloc, setAlloc]       = useState(INIT_ALLOC);
  const [records, setRecords]   = useState([]);
  const [rooms, setRooms]       = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch]     = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const setA  = (k) => (e) => setAlloc(p => ({ ...p, [k]: e.target.value }));
  const setRC = (i, col) => (e) => setAlloc(p => {
    const rc = [...p.roomCondition];
    rc[i] = { ...rc[i], [col]: e.target.value };
    return { ...p, roomCondition: rc };
  });

  const loadData = () => {
    // Load rooms
    fetch('/api/generic/hostel/rooms')
      .then(res => res.json())
      .then(data => setRooms(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading rooms:', err));

    // Load students
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data.filter(s => s.status === 'active') : []))
      .catch(err => console.error('Error loading students:', err));

    // Load existing allocations
    fetch('/api/generic/hostel/allocations')
      .then(res => res.json())
      .then(data => setRecords(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading allocations:', err));
  };

  useEffect(() => { loadData(); }, []);

  // Student suggestions for autocomplete
  const studentSuggestions = studentSearch.trim().length > 0
    ? students.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s.scholar_no || '').toLowerCase().includes(studentSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  const selectStudent = (stu) => {
    setAlloc(p => ({
      ...p,
      studentId: stu.scholar_no || String(stu.id),
      studentName: stu.name,
    }));
    setStudentSearch(stu.name);
    setShowSuggestions(false);
  };

  // Rooms grouped by hostel
  const hostelNames = [...new Set(rooms.map(r => r.hostel || r.name).filter(Boolean))];
  const availableRooms = rooms.filter(r => {
    const capacity = r.capacity || parseInt(r.occupancy) || 1;
    const occupied = r.occupied || 0;
    return occupied < capacity;
  });

  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    const room = rooms.find(r => String(r._id || r.id) === roomId);
    if (room) {
      setAlloc(p => ({
        ...p,
        roomId,
        roomNo: room.roomNo || room.name || '',
        hostel: room.hostel || '',
      }));
    } else {
      setAlloc(p => ({ ...p, roomId: '', roomNo: '', hostel: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!alloc.studentName.trim()) { alert('Please select a student.'); return; }
    if (!alloc.roomId) { alert('Please select a room.'); return; }

    // Check capacity
    const room = rooms.find(r => String(r._id || r.id) === alloc.roomId);
    if (!room) { alert('Selected room not found.'); return; }
    const capacity = room.capacity || parseInt(room.occupancy) || 1;
    const occupied = room.occupied || 0;
    if (occupied >= capacity) {
      alert(`Room "${room.roomNo}" is at full capacity (${capacity}/${capacity}). Please choose another room.`);
      return;
    }

    const newRecord = { ...alloc, _id: Date.now(), sno: records.length + 1 };
    const newRecords = [...records, newRecord];

    // Save allocation
    fetch('/api/generic/hostel/allocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecords)
    }).catch(err => console.error(err));

    // Update room occupancy count
    const updatedRooms = rooms.map(r => {
      if (String(r._id || r.id) === alloc.roomId) {
        return { ...r, occupied: (r.occupied || 0) + 1 };
      }
      return r;
    });
    fetch('/api/generic/hostel/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRooms)
    })
      .then(() => {
        setRooms(updatedRooms);
        setRecords(newRecords);
        setAlloc(INIT_ALLOC);
        setStudentSearch('');
        setShowForm(false);
        alert(`Room allocated successfully! ${alloc.studentName} → ${room.roomNo}`);
      })
      .catch(err => alert('Failed to update room occupancy: ' + err.message));
  };

  const filtered = records.filter(r =>
    r.studentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hostel-wrapper">

      {/* ── Filter / Search Card ── */}
      <div className="hostel-card">
        <div className="hostel-card-title">Hostel Room Allocation</div>

        {/* Room Availability Stats */}
        {rooms.length > 0 && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            {rooms.slice(0, 6).map(r => {
              const cap = r.capacity || parseInt(r.occupancy) || 1;
              const occ = r.occupied || 0;
              const pct = Math.round((occ / cap) * 100);
              const full = occ >= cap;
              return (
                <div key={r._id || r.id} style={{
                  background: full ? '#fef2f2' : '#f0fdf4',
                  border: `1px solid ${full ? '#fca5a5' : '#86efac'}`,
                  borderRadius: 8, padding: '10px 14px', minWidth: 140,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{r.roomNo || r.name}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{r.hostel || 'Hostel'}</div>
                  <div style={{ marginTop: 6, background: '#e5e7eb', borderRadius: 4, height: 6 }}>
                    <div style={{ width: `${Math.min(pct, 100)}%`, background: full ? '#ef4444' : '#22c55e', height: 6, borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4, color: full ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                    {occ}/{cap} {full ? '● Full' : '● Available'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="hostel-btn-row">
          <button className="hostel-btn-primary" onClick={() => setShowForm(true)}>
            + Allocate Room
          </button>
          <button className="hostel-btn-secondary" onClick={() => setShowForm(false)}>
            Reset
          </button>
        </div>
      </div>

      {/* ── Allocation Form ── */}
      {showForm && (
        <div className="hostel-card">
          <div className="hostel-card-title">New Room Allocation</div>

          <form onSubmit={handleSubmit}>
            <div className="hostel-section-title">Student &amp; Room Details</div>
            <div className="hostel-form-grid">
              {/* Student Search Autocomplete */}
              <div className="hostel-field" style={{ position: 'relative' }}>
                <label>Search Student <span className="req">*</span></label>
                <input
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
                      <div
                        key={s.id}
                        onClick={() => selectStudent(s)}
                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <strong>{s.name}</strong>
                        <span style={{ color: '#94a3b8', marginLeft: 8, fontSize: 11 }}>
                          {s.scholar_no} · {s.course} · {s.batch}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="hostel-field">
                <label>Student ID</label>
                <input value={alloc.studentId} readOnly placeholder="Auto-filled from search" style={{ background: '#f8fafc' }} />
              </div>

              {/* Room selection */}
              <div className="hostel-field">
                <label>Select Room <span className="req">*</span></label>
                <select value={alloc.roomId} onChange={handleRoomChange}>
                  <option value="">-- Select Available Room --</option>
                  {availableRooms.map(r => {
                    const cap = r.capacity || parseInt(r.occupancy) || 1;
                    const occ = r.occupied || 0;
                    return (
                      <option key={r._id || r.id} value={String(r._id || r.id)}>
                        {r.hostel ? `${r.hostel} › ` : ''}{r.roomNo} ({occ}/{cap} occupied)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="hostel-field">
                <label>Hostel</label>
                <input value={alloc.hostel} readOnly style={{ background: '#f8fafc' }} placeholder="Auto-filled from room" />
              </div>

              <div className="hostel-field">
                <label>Room No</label>
                <input value={alloc.roomNo} readOnly style={{ background: '#f8fafc' }} placeholder="Auto-filled from room" />
              </div>

              <div className="hostel-field">
                <label>Bed No</label>
                <input value={alloc.bedNo} onChange={setA('bedNo')} placeholder="e.g. Bed A" />
              </div>

              <div className="hostel-field">
                <label>Allocation Date</label>
                <input type="date" value={alloc.allocationDate} onChange={setA('allocationDate')} />
              </div>
            </div>

            <div className="hostel-section-title">Caution Deposit</div>
            <div className="hostel-form-grid">
              <div className="hostel-field">
                <label>Caution Deposit Amount ($)</label>
                <input type="number" min="0" value={alloc.cautionDeposit} onChange={setA('cautionDeposit')} placeholder="0.00" />
              </div>
              <div className="hostel-field">
                <label>Payment Mode</label>
                <select value={alloc.depositMode} onChange={setA('depositMode')}>
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>NEFT</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div className="hostel-field span2">
                <label>Remarks</label>
                <textarea value={alloc.remarks} onChange={setA('remarks')} rows={2} />
              </div>
            </div>

            <div className="hostel-section-title">Room Condition Checklist at Joining</div>
            <div className="hostel-table-wrap" style={{ marginBottom: 16 }}>
              <table className="hostel-table">
                <thead>
                  <tr>
                    <th>SNo.</th>
                    <th>Item</th>
                    <th>Condition</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {alloc.roomCondition.map((rc, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{rc.item}</td>
                      <td>
                        <select value={rc.status} onChange={setRC(i, 'status')}
                          style={{ fontSize: 14, padding: '5px 8px', borderRadius: 6, border: '1.5px solid #e2e8f0', width: '100%' }}>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                          <option>Damaged</option>
                          <option>Missing</option>
                        </select>
                      </td>
                      <td>
                        <input value={rc.remarks} onChange={setRC(i, 'remarks')}
                          placeholder="Optional note"
                          style={{ fontSize: 14, padding: '5px 8px', borderRadius: 6, border: '1.5px solid #e2e8f0', width: '100%' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="hostel-btn-row">
              <button type="submit" className="hostel-btn-primary">Save Allocation</button>
              <button type="button" className="hostel-btn-secondary"
                onClick={() => { setAlloc(INIT_ALLOC); setStudentSearch(''); setShowForm(false); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Records Table ── */}
      <div className="hostel-card">
        <div className="hostel-table-toolbar">
          <div className="hostel-table-actions">
            <button className="hostel-tbl-tool-btn" onClick={e => handleCopy(e.currentTarget)}>Copy</button>
            <button className="hostel-tbl-tool-btn" onClick={e => handleCSV(e.currentTarget, 'AllocateHostel')}>CSV</button>
            <button className="hostel-tbl-tool-btn" onClick={() => handlePrint('Allocate Hostel')}>Print</button>
          </div>
          <input
            className="hostel-search-input"
            placeholder="Search by student name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="hostel-table-wrap">
          <table className="hostel-table">
            <thead>
              <tr>
                <th>SNo.</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Hostel</th>
                <th>Room No</th>
                <th>Bed No</th>
                <th>Allocation Date</th>
                <th>Caution Deposit</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="hostel-empty">No allocations found.</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                  <td>{r.studentId}</td>
                  <td>{r.hostel}</td>
                  <td>{r.roomNo}</td>
                  <td>{r.bedNo}</td>
                  <td>{r.allocationDate}</td>
                  <td>{r.cautionDeposit ? `$${r.cautionDeposit}` : '—'}</td>
                  <td>{r.depositMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
