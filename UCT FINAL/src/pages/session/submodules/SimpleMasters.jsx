import React, { useState } from 'react';
import { FormField, Input, SectionTitle, TblToolbar } from './SessionComponents.jsx';

function SimpleMaster({ title, fieldLabel, initData }) {
  const [data, setData]     = useState(initData);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [val, setVal]       = useState('');
  const filtered = data.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!val.trim()) return alert(`${fieldLabel} is required.`);
    if (editId) {
      setData(d => d.map(r => r.id === editId ? { ...r, name: val } : r));
      setEditId(null);
    } else {
      setData(d => [...d, { id: Date.now(), name: val.toUpperCase(), status: 'Active' }]);
    }
    setVal('');
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title={title} />
        <div className="form-grid">
          <FormField label={fieldLabel} required>
            <Input value={val} onChange={e => setVal(e.target.value)} placeholder={`Enter ${fieldLabel}`} />
          </FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setVal(''); }}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>{fieldLabel}</th><th>Status</th><th>Edit</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={4} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td style={{ fontWeight: title === 'Add Occupation' ? 700 : 400 }}>{r.name}</td>
                  <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
                  <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setVal(r.name); }}>✎ Edit</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}

export function ReligionMaster() {
  return <SimpleMaster title="Add Religion" fieldLabel="Religion"
    initData={[
      {id:1,name:'Christian',status:'Active'},{id:2,name:'Hindu',status:'Active'},
      {id:3,name:'Jain',status:'Active'},{id:4,name:'Muslim',status:'Active'},
      {id:5,name:'Other',status:'Active'},{id:6,name:'Sikh',status:'Active'},
    ]} />;
}

export function OccupationMaster() {
  return <SimpleMaster title="Add Occupation" fieldLabel="Occupation"
    initData={[
      {id:1,name:'Business',status:'Active'},{id:2,name:'Doctor',status:'Active'},
      {id:3,name:'DRIVER',status:'Active'},{id:4,name:'Farmer',status:'Active'},
      {id:5,name:'Govt. Employee',status:'Active'},{id:6,name:'House wife',status:'Active'},
      {id:7,name:'Labour',status:'Active'},{id:8,name:'Others',status:'Active'},
      {id:9,name:'SDS',status:'Active'},{id:10,name:'Self Employed',status:'Active'},
    ]} />;
}

export function CasteMaster() {
  return <SimpleMaster title="Add New Caste" fieldLabel="Caste"
    initData={[
      {id:1,name:'AGARWAL',status:'Active'},{id:2,name:'AGNIHOTRI',status:'Active'},
      {id:3,name:'AHIRWAR',status:'Active'},{id:4,name:'ANURAGI',status:'Active'},
      {id:5,name:'BADHAI',status:'Active'},{id:6,name:'BARAI',status:'Active'},
      {id:7,name:'BASOR',status:'Active'},{id:8,name:'BEDIYA',status:'Active'},
      {id:9,name:'BEHNA',status:'Active'},{id:10,name:'BHAAT',status:'Active'},
    ]} />;
}

export function CategoryMaster() {
  const [data, setData]     = useState([]);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [val, setVal]       = useState('');
  const filtered = data.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!val.trim()) return alert('Category is required.');
    if (editId) { setData(d => d.map(r => r.id === editId ? { ...r, name: val } : r)); setEditId(null); }
    else setData(d => [...d, { id: Date.now(), name: val.toUpperCase(), status: 'Active' }]);
    setVal('');
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Category Master" />
        <div className="form-grid">
          <FormField label="Category" required><Input value={val} onChange={e => setVal(e.target.value)} placeholder="Enter category" /></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }} onClick={() => { setEditId(null); setVal(''); }}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>Sno</th><th>Category</th><th>Status</th><th>Edit</th></tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td><td>{r.name}</td>
                <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
                <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setVal(r.name); }}>✎ Edit</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}
