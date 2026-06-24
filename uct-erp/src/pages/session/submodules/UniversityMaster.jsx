import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, TblToolbar } from './SessionComponents.jsx';

/* Enhancement: University Master now supports both Domestic & Foreign universities
   Foreign universities include: country, ranking, NMC/WHO approval, annual fee (USD),
   intake months, coordinator contact */

const COUNTRIES = ['India','Timor-Leste','Philippines','China','Russia','Ukraine','Bangladesh','Nepal','Georgia','Kazakhstan','Kyrgyzstan','Egypt','Other'];
const MONTHS_LIST = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const INIT = [
  { id:1, name:'UNIVERSIDADE CATOLICA TIMORENSE', type:'Domestic', country:'Timor-Leste', ranking:'', nmcApproved:'Yes', whoApproved:'Yes', annualFeeUSD:'', intakeMonths:'July', coordinatorContact:'', status:'Active' },
];

export default function UniversityMaster() {
  const [data, setData]       = useState(INIT);
  const [search, setSearch]   = useState('');
  const [editId, setEditId]   = useState(null);
  const [uniType, setUniType] = useState('Domestic');
  const [form, setForm]       = useState({ name:'', country:'India', ranking:'', nmcApproved:'Yes', whoApproved:'Yes', annualFeeUSD:'', intakeMonths:'July', coordinatorContact:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const filtered = data.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.country||'').toLowerCase().includes(search.toLowerCase())
  );

  const submit = e => {
    e.preventDefault();
    if (!form.name.trim()) return alert('University Name is required.');
    const entry = { ...form, name: form.name.toUpperCase(), type: uniType, status:'Active' };
    if (editId) {
      setData(d => d.map(r => r.id === editId ? { ...r, ...entry } : r));
      setEditId(null);
    } else {
      setData(d => [...d, { id: Date.now(), ...entry }]);
    }
    setForm({ name:'', country:'India', ranking:'', nmcApproved:'Yes', whoApproved:'Yes', annualFeeUSD:'', intakeMonths:'July', coordinatorContact:'' });
  };

  const startEdit = r => {
    setUniType(r.type);
    setForm({ name:r.name, country:r.country||'India', ranking:r.ranking||'', nmcApproved:r.nmcApproved||'Yes', whoApproved:r.whoApproved||'Yes', annualFeeUSD:r.annualFeeUSD||'', intakeMonths:r.intakeMonths||'July', coordinatorContact:r.coordinatorContact||'' });
    setEditId(r.id);
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title={editId ? 'Edit University' : 'Add New University'} />

        {/* University Type toggle */}
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          {['Domestic','Foreign'].map(t => (
            <button key={t} type="button"
              onClick={() => setUniType(t)}
              className="submit-btn"
              style={{ background: uniType===t ? '#2563eb' : '#e5e7eb', color: uniType===t ? '#fff' : '#374151', padding:'6px 20px', fontSize:12 }}>
              {t} University
            </button>
          ))}
        </div>

        <div className="form-grid">
          <FormField label="University Name" required>
            <Input value={form.name} onChange={set('name')} placeholder="Enter university name" />
          </FormField>
          <FormField label="Country">
            <Select value={form.country} onChange={set('country')}>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </Select>
          </FormField>

          {/* Foreign-only fields */}
          {uniType === 'Foreign' && (<>
            <FormField label="World Ranking">
              <Input value={form.ranking} onChange={set('ranking')} placeholder="e.g. 450" />
            </FormField>
            <FormField label="NMC Recognition Status">
              <Select value={form.nmcApproved} onChange={set('nmcApproved')}>
                <option value="Yes">Yes — Approved</option>
                <option value="No">No — Not Approved</option>
                <option value="Provisional">Provisional</option>
              </Select>
            </FormField>
            <FormField label="WHO Approval">
              <Select value={form.whoApproved} onChange={set('whoApproved')}>
                <option value="Yes">Yes — Approved</option>
                <option value="No">No — Not Approved</option>
              </Select>
            </FormField>
            <FormField label="Annual Fee (USD)">
              <Input type="number" value={form.annualFeeUSD} onChange={set('annualFeeUSD')} placeholder="e.g. 5000" />
            </FormField>
            <FormField label="Intake Months">
              <Select value={form.intakeMonths} onChange={set('intakeMonths')}>
                {MONTHS_LIST.map(m => <option key={m}>{m}</option>)}
              </Select>
            </FormField>
            <FormField label="Coordinator Contact">
              <Input value={form.coordinatorContact} onChange={set('coordinatorContact')} placeholder="Phone / email" />
            </FormField>
          </>)}
        </div>

        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }}
            onClick={() => { setEditId(null); setForm({ name:'', country:'India', ranking:'', nmcApproved:'Yes', whoApproved:'Yes', annualFeeUSD:'', intakeMonths:'July', coordinatorContact:'' }); }}>
            Reset
          </button>
        </div>
      </form>

      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th>SNo.</th><th>University</th><th>Type</th><th>Country</th>
              <th>NMC Approved</th><th>Annual Fee (USD)</th><th>Status</th><th>Edit</th><th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={9} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td style={{ fontWeight:600 }}>{r.name}</td>
                  <td><span style={{ background: r.type==='Foreign'?'#eff6ff':'#f0fdf4', color: r.type==='Foreign'?'#1d4ed8':'#15803d', padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600 }}>{r.type}</span></td>
                  <td>{r.country}</td>
                  <td style={{ color: r.nmcApproved==='Yes'?'#16a34a':'#dc2626', fontWeight:600 }}>{r.nmcApproved||'—'}</td>
                  <td>{r.annualFeeUSD ? `$${Number(r.annualFeeUSD).toLocaleString()}` : '—'}</td>
                  <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
                  <td><span className="tbl-btn edit" onClick={() => startEdit(r)}>✎ Edit</span></td>
                  <td><span className="tbl-btn del" onClick={() => setData(d => d.filter(x => x.id !== r.id))}>✕ Delete</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}
