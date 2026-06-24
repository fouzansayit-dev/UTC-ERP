import React, { useState } from 'react';
import { FormField, Select, SectionTitle, TblToolbar } from './SessionComponents.jsx';

const INIT = [
  { id:1,  displayType:'Student',  type:'Identity Card', template:'Landscape', status:'Active', title:'FOOD PASS 10', bgColor:'#000000' },
  { id:2,  displayType:'Student',  type:'Identity Card', template:'Portrait',  status:'Active', title:'FOOD PASS 9',  bgColor:'#000000' },
  { id:3,  displayType:'Student',  type:'Identity Card', template:'Portrait',  status:'Active', title:'FOOD PASS 8 YEARLY CARD', bgColor:'#000000' },
  { id:4,  displayType:'Student',  type:'Identity Card', template:'Landscape', status:'Active', title:'FOOD PASS 7',  bgColor:'#000000' },
  { id:5,  displayType:'Student',  type:'Identity Card', template:'Landscape', status:'Active', title:'FOOD PASS 6',  bgColor:'#000000' },
  { id:6,  displayType:'Student',  type:'Identity Card', template:'Landscape', status:'Active', title:'FOOD PASS 5',  bgColor:'#000000' },
  { id:7,  displayType:'Student',  type:'Identity Card', template:'Portrait',  status:'Active', title:'FOOD PASS 4 MONTHLY CARD', bgColor:'#000000' },
  { id:8,  displayType:'Student',  type:'Identity Card', template:'Portrait',  status:'Active', title:'FOOD PASS 3',  bgColor:'#f59e0b' },
  { id:9,  displayType:'Student',  type:'Identity Card', template:'Portrait',  status:'Active', title:'FOOD PASS 2',  bgColor:'#dc2626' },
  { id:10, displayType:'Student',  type:'Identity Card', template:'Portrait',  status:'Active', title:'food passM',   bgColor:'#000000' },
  { id:11, displayType:'Employee', type:'Identity Card', template:'Portrait',  status:'Active', title:'Employee Portrait I-Card 16', bgColor:'#065f46' },
  { id:12, displayType:'Employee', type:'Identity Card', template:'Portrait',  status:'Active', title:'Employee Portrait I-Card 14', bgColor:'#0e7490' },
];

export default function ICardSetting() {
  const [data, setData]     = useState(INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({
    displayType: 'Student',
    icardTitle:  '',
    status:      'Active',
    bgImage:     null,
    bgColor:     '#000000',
    icardType:   'Identity Card',
    template:    'Landscape',
    sample:      '',
  });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const filtered = data.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.displayType.toLowerCase().includes(search.toLowerCase())
  );

  const submit = e => {
    e.preventDefault();
    if (!form.icardTitle.trim()) return alert('I-Card Title is required.');
    const entry = {
      displayType: form.displayType,
      type:        form.icardType,
      template:    form.template,
      status:      form.status,
      title:       form.icardTitle.toUpperCase(),
      bgColor:     form.bgColor,
    };
    if (editId) {
      setData(d => d.map(r => r.id === editId ? { ...r, ...entry } : r));
      setEditId(null);
    } else {
      setData(d => [...d, { id: Date.now(), ...entry }]);
    }
    setForm({ displayType:'Student', icardTitle:'', status:'Active', bgImage:null, bgColor:'#000000', icardType:'Identity Card', template:'Landscape', sample:'' });
  };

  const startEdit = r => {
    setEditId(r.id);
    setForm({ displayType:r.displayType, icardTitle:r.title, status:r.status, bgImage:null, bgColor:r.bgColor, icardType:r.type, template:r.template, sample:'' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="I-Card Setting" />
        <div className="form-grid">
          <FormField label="Display Type">
            <Select value={form.displayType} onChange={set('displayType')}>
              <option value="Student">Student</option>
              <option value="Employee">Employee</option>
            </Select>
          </FormField>
          <FormField label="I-Card Title" required>
            <input className="form-input" value={form.icardTitle} onChange={set('icardTitle')} placeholder="Enter I-Card title" />
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={set('status')}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </FormField>
          <FormField label="Background Image (Max 5MB)">
            <input type="file" className="form-input" accept="image/*"
              onChange={e => setForm(p => ({ ...p, bgImage: e.target.files[0] }))} />
          </FormField>
          <FormField label="Background Color">
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <input type="color" value={form.bgColor}
                onChange={set('bgColor')}
                style={{ width:60, height:36, border:'0.5px solid #d1d5db', borderRadius:6, padding:2, cursor:'pointer' }} />
              <input className="form-input" value={form.bgColor} onChange={set('bgColor')}
                style={{ width:110, fontFamily:'monospace', textTransform:'uppercase' }} />
            </div>
          </FormField>
          <FormField label="I-Card Type">
            <Select value={form.icardType} onChange={set('icardType')}>
              <option value="Identity Card">Identity Card</option>
              <option value="Library Card">Library Card</option>
              <option value="Bus Pass">Bus Pass</option>
              <option value="Food Pass">Food Pass</option>
            </Select>
          </FormField>
          <FormField label="Template">
            <Select value={form.template} onChange={set('template')}>
              <option value="Landscape">Landscape</option>
              <option value="Portrait">Portrait</option>
            </Select>
          </FormField>
          <FormField label="Sample">
            <textarea className="form-input form-textarea" rows={3} value={form.sample} onChange={set('sample')} placeholder="Sample / notes" />
          </FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }}
            onClick={() => { setEditId(null); setForm({ displayType:'Student', icardTitle:'', status:'Active', bgImage:null, bgColor:'#000000', icardType:'Identity Card', template:'Landscape', sample:'' }); }}>
            Reset
          </button>
        </div>
      </form>

      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th>S.No</th><th>Edit</th><th>Delete</th>
              <th>Display Type</th><th>Type</th><th>Template</th>
              <th>Status</th><th>Title</th><th>Background Image</th><th>Background Color</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={10} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td><span className="tbl-btn edit" onClick={() => startEdit(r)}>✎</span></td>
                  <td><span className="tbl-btn del" onClick={() => setData(d => d.filter(x => x.id !== r.id))}>🗑</span></td>
                  <td style={{ fontWeight:600 }}>{r.displayType}</td>
                  <td>{r.type}</td>
                  <td>{r.template}</td>
                  <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
                  <td style={{ fontWeight:600 }}>{r.title}</td>
                  <td style={{ color:'#9ca3af', fontSize:11 }}>—</td>
                  <td>
                    <div style={{ width:32, height:32, background:r.bgColor, borderRadius:4, border:'1px solid #e5e7eb' }} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:13, color:'#9ca3af', marginTop:8 }}>
        Showing 1 to {filtered.length} of {filtered.length} entries
      </div>
    </div>
  );
}
