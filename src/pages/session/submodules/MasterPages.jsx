import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, TblToolbar } from './SessionComponents.jsx';

/* ── School Master ─────────────────────────────────────────────────────── */
export function SchoolMaster() {
  const [data, setData]     = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState({ school:'', place:'', block:'', district:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r => r.school.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!form.school) return alert('School name is required.');
    setData(d => [...d, { id: Date.now(), ...form, status: 'Active' }]);
    setForm({ school:'', place:'', block:'', district:'' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add New School" />
        <div className="form-grid">
          <FormField label="School"  required><Input value={form.school}   onChange={set('school')}   placeholder="School name" /></FormField>
          <FormField label="Place"><Input value={form.place}    onChange={set('place')}    placeholder="Place" /></FormField>
          <FormField label="Block"><Input value={form.block}    onChange={set('block')}    placeholder="Block" /></FormField>
          <FormField label="Distict"><Input value={form.district} onChange={set('district')} placeholder="District" /></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">Submit</button>
          <button type="reset" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => {}}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>School</th><th>Place</th><th>Block</th><th>Distict</th><th>Status</th><th>Edit</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={7} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No data available in table</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}><td>{i+1}</td><td>{r.school}</td><td>{r.place}</td><td>{r.block}</td><td>{r.district}</td>
                  <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
                  <td><span className="tbl-btn edit">✎ Edit</span></td></tr>
              ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 0 to 0 of 0 entries</div>
    </div>
  );
}

/* ── Board/University Master ────────────────────────────────────────────── */
export function BoardUniversityMaster() {
  const [data, setData]     = useState([]);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ type:'Board', board:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r => r.board.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!form.board) return alert('Board name is required.');
    if (editId) { setData(d => d.map(r => r.id === editId ? { ...r, ...form } : r)); setEditId(null); }
    else setData(d => [...d, { id: Date.now(), ...form, status: 'Active' }]);
    setForm({ type:'Board', board:'' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add New Board/University" />
        <div className="form-grid">
          <FormField label="Type"><Select value={form.type} onChange={set('type')}><option>Board</option><option>University</option></Select></FormField>
          <FormField label="Board" required><Input value={form.board} onChange={set('board')} placeholder="Board or university name" /></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setForm({ type:'Board', board:'' }); }}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Type</th><th>Board</th><th>Status</th><th>Edit</th></tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}><td>{i+1}</td><td style={{ fontWeight:600 }}>{r.type}</td><td>{r.board}</td>
                <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
                <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setForm({ type:r.type, board:r.board }); }}>✎ Edit</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}

/* ── City/District Master ───────────────────────────────────────────────── */
export function CityDistrictMaster() {
  const [data, setData]     = useState([]);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [val, setVal]       = useState('');
  const filtered = data.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!val.trim()) return alert('City/District is required.');
    if (editId) { setData(d => d.map(r => r.id === editId ? { ...r, name: val.toUpperCase() } : r)); setEditId(null); }
    else setData(d => [...d, { id: Date.now(), name: val.toUpperCase(), status: 'Active' }]);
    setVal('');
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add New City/District" />
        <div className="form-grid">
          <FormField label="City/District" required><Input value={val} onChange={e => setVal(e.target.value)} placeholder="Enter city or district" /></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setVal(''); }}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>City/District</th><th>Status</th><th>Edit</th></tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}><td>{i+1}</td><td>{r.name}</td>
                <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
                <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setVal(r.name); }}>✎ Edit</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}

/* ── Scholarship Master (Enhanced: Abroad-specific scholarships) ─────────── */
export function ScholarshipMaster() {
  const [data, setData]         = useState([]);
  const [search,     setSearch]     = useState('');
  const [editId,     setEditId]     = useState(null);
  const [val,        setVal]        = useState('');
  const [schType,    setSchType]    = useState('Domestic');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = data.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter === 'All' || r.type === typeFilter)
  );

  const domesticCount = data.filter(r => r.type === 'Domestic').length;
  const abroadCount   = data.filter(r => r.type === 'Abroad').length;

  const submit = e => {
    e.preventDefault();
    if (!val.trim()) return alert('Scholarship name is required.');
    if (editId) {
      setData(d => d.map(r => r.id === editId ? { ...r, name: val.toUpperCase(), type: schType } : r));
      setEditId(null);
    } else {
      setData(d => [...d, { id: Date.now(), name: val.toUpperCase(), type: schType, status: 'Active' }]);
    }
    setVal('');
  };

  return (
    <div className="hr-form">
      {/* ── Stat cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Scholarships', value: data.length,     color:'#2563eb' },
          { label:'Domestic',           value: domesticCount,   color:'#16a34a' },
          { label:'Abroad (New)',        value: abroadCount,     color:'#7c3aed' },
        ].map(s => (
          <div key={s.label} style={{ background:`${s.color}10`, border:`1px solid ${s.color}30`, borderLeft:`4px solid ${s.color}`, borderRadius:8, padding:'12px 16px' }}>
            <div style={{ fontSize:22, fontWeight:700, color:s.color, marginBottom:2 }}>{s.value}</div>
            <div style={{ fontSize:11, color:'#6b7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <form onSubmit={submit}>
        <SectionTitle title="Add New Scholarship" />
        <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:6, padding:'8px 12px', fontSize:12, color:'#15803d', marginBottom:12 }}>
          <strong>Enhancement:</strong> Now supports Abroad-specific scholarships. 4 abroad scholarships pre-loaded.
        </div>
        <div className="form-grid">
          <FormField label="Scholarship Type">
            <Select value={schType} onChange={e => setSchType(e.target.value)}>
              <option value="Domestic">Domestic</option>
              <option value="Abroad">Abroad</option>
            </Select>
          </FormField>
          <FormField label="Scholarship Name" required>
            <Input value={val} onChange={e => setVal(e.target.value)} placeholder="Scholarship name" />
          </FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setVal(''); }}>Reset</button>
        </div>
      </form>

      {/* ── Filter buttons + Search ── */}
      <div style={{ display:'flex', gap:8, margin:'16px 0 10px', flexWrap:'wrap', alignItems:'center' }}>
        {['All','Domestic','Abroad'].map(f => (
          <button key={f} type="button"
            onClick={() => setTypeFilter(f)}
            style={{
              padding:'5px 16px', border:'1px solid #d1d5db', borderRadius:4,
              fontSize:12, cursor:'pointer', fontWeight: typeFilter===f ? 600 : 400,
              background: typeFilter===f ? '#2563eb' : '#f9fafb',
              color: typeFilter===f ? '#fff' : '#374151',
            }}>
            {f}
          </button>
        ))}
        <input
          className="form-input"
          style={{ marginLeft:'auto', width:190, padding:'5px 9px', fontSize:12 }}
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr><th>SNo.</th><th>Scholarship Name</th><th>Type</th><th>Status</th><th>Edit</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={5} style={{ textAlign:'center', color:'#9ca3af', padding:18 }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td>{r.name}</td>
                  <td>
                    <span style={{
                      background: r.type === 'Abroad' ? '#faf5ff' : '#f0fdf4',
                      color:      r.type === 'Abroad' ? '#7c3aed' : '#15803d',
                      padding:'2px 9px', borderRadius:4, fontSize:11, fontWeight:600,
                    }}>{r.type}</span>
                  </td>
                  <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
                  <td>
                    <span className="tbl-btn edit" onClick={() => { setEditId(r.id); setVal(r.name); setSchType(r.type); }}>
                      ✎ Edit
                    </span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>
        Showing 1 to {filtered.length} of {data.length} entries
      </div>
    </div>
  );
}

/* ── Subject Master ─────────────────────────────────────────────────────── */
export function SubjectMaster() {
  const [data, setData]     = useState([]);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ type:'', subject:'', code:'', practical:'N' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r => r.subject.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!form.subject || !form.code) return alert('Subject and Subject Code are required.');
    if (editId) { setData(d => d.map(r => r.id === editId ? { ...r, ...form } : r)); setEditId(null); }
    else setData(d => [...d, { id: Date.now(), ...form, status: 'Active' }]);
    setForm({ type:'', subject:'', code:'', practical:'N' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add New Subject" />
        <div className="form-grid">
          <FormField label="Type"><Select value={form.type} onChange={set('type')}><option value="">None selected</option><option>Theory</option><option>Practical</option><option>Both</option></Select></FormField>
          <FormField label="Subject" required><Input value={form.subject} onChange={set('subject')} placeholder="Subject name" /></FormField>
          <FormField label="Subject Code" required><Input value={form.code} onChange={set('code')} placeholder="e.g. 24MED-ANA01" /></FormField>
          <FormField label="Practical Status"><Select value={form.practical} onChange={set('practical')}><option value="N">N</option><option value="Y">Y</option></Select></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setForm({ type:'', subject:'', code:'', practical:'N' }); }}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Edit</th><th>Type</th><th>Subject</th><th>Subject Code</th><th>Practical Status</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td>
                <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setForm({ type:r.type, subject:r.subject, code:r.code, practical:r.practical }); }}>✎ Edit</span></td>
                <td>{r.type}</td><td style={{ fontWeight:600 }}>{r.subject}</td><td>{r.code}</td>
                <td style={{ fontWeight:600 }}>{r.practical}</td>
                <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}
