import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, TblToolbar } from './SessionComponents.jsx';

/* ══════════════════════════════════════════════════════════════════════════
   NEW MASTER 1 — Country Master
   Fields: Country name, currency, currency code, embassy city,
           NMC recognition status
   Used by: Abroad module, Visa module
══════════════════════════════════════════════════════════════════════════ */
const CURRENCIES = ['USD','EUR','GBP','INR','CNY','RUB','UAH','BDT','NPR','GEL','KZT','KGS','EGP','PHP','LKR','Other'];

const COUNTRY_INIT = [
  { id:1, name:'Russia',      currency:'Russian Ruble', code:'RUB', embassyCity:'New Delhi',  nmcStatus:'Recognized',     status:'Active' },
  { id:2, name:'China',       currency:'Chinese Yuan',  code:'CNY', embassyCity:'New Delhi',  nmcStatus:'Recognized',     status:'Active' },
  { id:3, name:'Philippines', currency:'Philippine Peso',code:'PHP',embassyCity:'New Delhi',  nmcStatus:'Recognized',     status:'Active' },
  { id:4, name:'Ukraine',     currency:'Ukrainian Hryvnia',code:'UAH',embassyCity:'New Delhi', nmcStatus:'Not Recognized', status:'Active' },
  { id:5, name:'Kazakhstan',  currency:'Kazakhstani Tenge',code:'KZT',embassyCity:'New Delhi', nmcStatus:'Recognized',     status:'Active' },
  { id:6, name:'Georgia',     currency:'Georgian Lari',  code:'GEL', embassyCity:'New Delhi',  nmcStatus:'Recognized',     status:'Active' },
];

export function CountryMaster() {
  const [data, setData]     = useState(COUNTRY_INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ name:'', currency:'USD', code:'', embassyCity:'', nmcStatus:'Recognized' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) return alert('Country name and currency code are required.');
    const entry = { ...form, name: form.name, status: 'Active' };
    if (editId) { setData(d => d.map(r => r.id === editId ? { ...r, ...entry } : r)); setEditId(null); }
    else setData(d => [...d, { id: Date.now(), ...entry }]);
    setForm({ name:'', currency:'USD', code:'', embassyCity:'', nmcStatus:'Recognized' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add New Country" />
        <div className="form-grid">
          <FormField label="Country Name" required>
            <Input value={form.name} onChange={set('name')} placeholder="e.g. Russia" />
          </FormField>
          <FormField label="Currency Name">
            <Input value={form.currency} onChange={set('currency')} placeholder="e.g. Russian Ruble" />
          </FormField>
          <FormField label="Currency Code" required>
            <Select value={form.code} onChange={set('code')}>
              <option value="">-- Select --</option>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Embassy City">
            <Input value={form.embassyCity} onChange={set('embassyCity')} placeholder="e.g. New Delhi" />
          </FormField>
          <FormField label="NMC Recognition Status">
            <Select value={form.nmcStatus} onChange={set('nmcStatus')}>
              <option value="Recognized">Recognized</option>
              <option value="Not Recognized">Not Recognized</option>
              <option value="Provisional">Provisional</option>
              <option value="Under Review">Under Review</option>
            </Select>
          </FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }}
            onClick={() => { setEditId(null); setForm({ name:'', currency:'USD', code:'', embassyCity:'', nmcStatus:'Recognized' }); }}>
            Reset
          </button>
        </div>
      </form>

      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr><th>SNo.</th><th>Country</th><th>Currency</th><th>Code</th><th>Embassy City</th><th>NMC Status</th><th>Status</th><th>Edit</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td style={{ fontWeight:600 }}>{r.name}</td>
                  <td>{r.currency}</td>
                  <td><span style={{ fontFamily:'monospace', fontWeight:600, color:'#2563eb' }}>{r.code}</span></td>
                  <td>{r.embassyCity}</td>
                  <td><span style={{ background: r.nmcStatus==='Recognized'?'#f0fdf4':'#fef2f2', color: r.nmcStatus==='Recognized'?'#15803d':'#dc2626', padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600 }}>{r.nmcStatus}</span></td>
                  <td style={{ color:'#16a34a', fontWeight:600 }}>{r.status}</td>
                  <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setForm({ name:r.name, currency:r.currency, code:r.code, embassyCity:r.embassyCity, nmcStatus:r.nmcStatus }); }}>✎ Edit</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   NEW MASTER 2 — Foreign University Master
   Fields: University name, country, ranking, NMC/WHO approval,
           annual fee (USD), intake months, coordinator contact
   Used by: Abroad module, Fee master
══════════════════════════════════════════════════════════════════════════ */
const MONTHS_LIST = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const FOREIGN_UNI_INIT = [
  { id:1, name:'PEOPLES FRIENDSHIP UNIVERSITY OF RUSSIA', country:'Russia',      ranking:'401-500', nmcApproved:'Yes', whoApproved:'Yes', annualFeeUSD:5000, intakeMonths:'September', coordinator:'+91-98765-43210', status:'Active' },
  { id:2, name:'GUANGZHOU MEDICAL UNIVERSITY',           country:'China',       ranking:'601-700', nmcApproved:'Yes', whoApproved:'Yes', annualFeeUSD:4500, intakeMonths:'September', coordinator:'+91-98765-43211', status:'Active' },
  { id:3, name:'LVIV NATIONAL MEDICAL UNIVERSITY',       country:'Ukraine',     ranking:'701-800', nmcApproved:'No',  whoApproved:'Yes', annualFeeUSD:4000, intakeMonths:'October',   coordinator:'+91-98765-43212', status:'Active' },
];

export function ForeignUniversityMaster() {
  const [data, setData]     = useState(FOREIGN_UNI_INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ name:'', country:'Russia', ranking:'', nmcApproved:'Yes', whoApproved:'Yes', annualFeeUSD:'', intakeMonths:'September', coordinator:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.country.toLowerCase().includes(search.toLowerCase())
  );

  const submit = e => {
    e.preventDefault();
    if (!form.name.trim()) return alert('University Name is required.');
    const entry = { ...form, name: form.name.toUpperCase(), status:'Active' };
    if (editId) { setData(d => d.map(r => r.id === editId ? { ...r, ...entry } : r)); setEditId(null); }
    else setData(d => [...d, { id: Date.now(), ...entry }]);
    setForm({ name:'', country:'Russia', ranking:'', nmcApproved:'Yes', whoApproved:'Yes', annualFeeUSD:'', intakeMonths:'September', coordinator:'' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add Foreign University" />
        <div className="form-grid">
          <FormField label="University Name" required>
            <Input value={form.name} onChange={set('name')} placeholder="Full university name" />
          </FormField>
          <FormField label="Country" required>
            <Select value={form.country} onChange={set('country')}>
              {['Russia','China','Philippines','Ukraine','Kazakhstan','Georgia','Bangladesh','Nepal','Egypt','Kyrgyzstan','Other'].map(c => <option key={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="World Ranking">
            <Input value={form.ranking} onChange={set('ranking')} placeholder="e.g. 401-500" />
          </FormField>
          <FormField label="NMC / WHO Approval">
            <Select value={form.nmcApproved} onChange={set('nmcApproved')}>
              <option value="Yes">Yes — NMC Approved</option>
              <option value="No">No — Not Approved</option>
              <option value="Provisional">Provisional</option>
            </Select>
          </FormField>
          <FormField label="WHO Approval">
            <Select value={form.whoApproved} onChange={set('whoApproved')}>
              <option value="Yes">Yes — WHO Approved</option>
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
            <Input value={form.coordinator} onChange={set('coordinator')} placeholder="Phone / email" />
          </FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }}
            onClick={() => { setEditId(null); setForm({ name:'', country:'Russia', ranking:'', nmcApproved:'Yes', whoApproved:'Yes', annualFeeUSD:'', intakeMonths:'September', coordinator:'' }); }}>
            Reset
          </button>
        </div>
      </form>

      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap" style={{ overflowX:'auto' }}>
        <table className="hr-table">
          <thead>
            <tr><th>SNo.</th><th>Edit</th><th>University Name</th><th>Country</th><th>Ranking</th><th>NMC</th><th>WHO</th><th>Annual Fee (USD)</th><th>Intake</th><th>Coordinator</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={11} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setForm({ name:r.name, country:r.country, ranking:r.ranking, nmcApproved:r.nmcApproved, whoApproved:r.whoApproved, annualFeeUSD:r.annualFeeUSD, intakeMonths:r.intakeMonths, coordinator:r.coordinator }); }}>✎ Edit</span></td>
                  <td style={{ fontWeight:600, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</td>
                  <td>{r.country}</td>
                  <td>{r.ranking}</td>
                  <td><span style={{ background: r.nmcApproved==='Yes'?'#f0fdf4':'#fef2f2', color: r.nmcApproved==='Yes'?'#15803d':'#dc2626', padding:'2px 7px', borderRadius:4, fontSize:11, fontWeight:600 }}>{r.nmcApproved}</span></td>
                  <td><span style={{ background: r.whoApproved==='Yes'?'#f0fdf4':'#fef2f2', color: r.whoApproved==='Yes'?'#15803d':'#dc2626', padding:'2px 7px', borderRadius:4, fontSize:11, fontWeight:600 }}>{r.whoApproved}</span></td>
                  <td style={{ fontWeight:600, color:'#16a34a' }}>{r.annualFeeUSD ? `$${Number(r.annualFeeUSD).toLocaleString()}` : '—'}</td>
                  <td>{r.intakeMonths}</td>
                  <td style={{ fontSize:11 }}>{r.coordinator}</td>
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


/* ══════════════════════════════════════════════════════════════════════════
   NEW MASTER 3 — Agent Master
   Fields: Agent ID, name, firm, cities, countries, commission %,
           payment terms, agreement dates, bank details
   Used by: Agent module, Accounts
══════════════════════════════════════════════════════════════════════════ */
const AGENT_INIT = [
  { id:1, agentId:'AGT001', name:'Ravi Kumar',   firm:'Global Education Consultants', cities:'Delhi, Mumbai',   countries:'India',  commPct:5,  paymentTerms:'Monthly', agreementFrom:'01 Apr 2024', agreementTo:'31 Mar 2025', bankName:'HDFC Bank', ifsc:'HDFC0001234', accountNo:'12345678901', status:'Active' },
  { id:2, agentId:'AGT002', name:'Ali Hassan',   firm:'Abroad Dreams Pvt Ltd',        cities:'Hyderabad',       countries:'India',  commPct:6,  paymentTerms:'Quarterly','agreementFrom':'01 Jan 2024', agreementTo:'31 Dec 2024', bankName:'SBI',       ifsc:'SBIN0004567', accountNo:'98765432100', status:'Active' },
];

export function AgentMaster() {
  const [data, setData]     = useState(AGENT_INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [tab, setTab]       = useState('personal'); // personal | bank
  const [form, setForm]     = useState({
    agentId:'', name:'', firm:'', cities:'', countries:'India', commPct:'',
    paymentTerms:'Monthly', agreementFrom:'', agreementTo:'',
    bankName:'', ifsc:'', accountNo:'',
  });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.agentId.toLowerCase().includes(search.toLowerCase()) ||
    r.firm.toLowerCase().includes(search.toLowerCase())
  );

  const submit = e => {
    e.preventDefault();
    if (!form.agentId.trim() || !form.name.trim()) return alert('Agent ID and Name are required.');
    const entry = { ...form, commPct: +form.commPct, status:'Active' };
    if (editId) { setData(d => d.map(r => r.id === editId ? { ...r, ...entry } : r)); setEditId(null); }
    else setData(d => [...d, { id: Date.now(), ...entry }]);
    setForm({ agentId:'', name:'', firm:'', cities:'', countries:'India', commPct:'', paymentTerms:'Monthly', agreementFrom:'', agreementTo:'', bankName:'', ifsc:'', accountNo:'' });
    setTab('personal');
  };

  const Band = ({ label }) => (
    <div style={{ background:'#2563eb', color:'#fff', fontWeight:700, fontSize:12, padding:'7px 12px', borderRadius:4, marginBottom:12, marginTop:6 }}>{label}</div>
  );

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title={editId ? 'Edit Agent' : 'Add New Agent'} />

        {/* Tab switcher */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {[['personal','Agent Details'],['bank','Bank Details']].map(([k,l]) => (
            <button key={k} type="button"
              onClick={() => setTab(k)}
              style={{ padding:'6px 18px', borderRadius:6, border:'1px solid #d1d5db', fontSize:12, fontWeight:500, cursor:'pointer', background: tab===k?'#1e293b':'#f9fafb', color: tab===k?'#fff':'#374151' }}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'personal' && (
          <>
            <Band label="Agent Details" />
            <div className="form-grid">
              <FormField label="Agent ID" required><Input value={form.agentId} onChange={set('agentId')} placeholder="e.g. AGT001" /></FormField>
              <FormField label="Agent Name" required><Input value={form.name} onChange={set('name')} /></FormField>
              <FormField label="Firm / Company"><Input value={form.firm} onChange={set('firm')} placeholder="Firm name" /></FormField>
              <FormField label="Cities Covered"><Input value={form.cities} onChange={set('cities')} placeholder="e.g. Delhi, Mumbai" /></FormField>
              <FormField label="Countries Covered"><Input value={form.countries} onChange={set('countries')} placeholder="e.g. India, Nepal" /></FormField>
              <FormField label="Commission %"><Input type="number" value={form.commPct} onChange={set('commPct')} placeholder="e.g. 5" /></FormField>
              <FormField label="Payment Terms">
                <Select value={form.paymentTerms} onChange={set('paymentTerms')}>
                  <option>Monthly</option><option>Quarterly</option><option>Half-Yearly</option><option>Per Admission</option>
                </Select>
              </FormField>
              <FormField label="Agreement From"><Input type="date" value={form.agreementFrom} onChange={set('agreementFrom')} /></FormField>
              <FormField label="Agreement To"><Input type="date" value={form.agreementTo} onChange={set('agreementTo')} /></FormField>
            </div>
          </>
        )}

        {tab === 'bank' && (
          <>
            <Band label="Bank Details" />
            <div className="form-grid">
              <FormField label="Bank Name"><Input value={form.bankName} onChange={set('bankName')} /></FormField>
              <FormField label="IFSC Code"><Input value={form.ifsc} onChange={set('ifsc')} placeholder="e.g. HDFC0001234" /></FormField>
              <FormField label="Account Number"><Input value={form.accountNo} onChange={set('accountNo')} /></FormField>
            </div>
          </>
        )}

        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }}
            onClick={() => { setEditId(null); setForm({ agentId:'', name:'', firm:'', cities:'', countries:'India', commPct:'', paymentTerms:'Monthly', agreementFrom:'', agreementTo:'', bankName:'', ifsc:'', accountNo:'' }); }}>
            Reset
          </button>
        </div>
      </form>

      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap" style={{ overflowX:'auto' }}>
        <table className="hr-table">
          <thead>
            <tr><th>SNo.</th><th>Edit</th><th>Agent ID</th><th>Agent Name</th><th>Firm</th><th>Countries</th><th>Commission %</th><th>Payment Terms</th><th>Agr. From</th><th>Agr. To</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={11} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No agents added yet</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setTab('personal'); setForm({ agentId:r.agentId, name:r.name, firm:r.firm, cities:r.cities, countries:r.countries, commPct:r.commPct, paymentTerms:r.paymentTerms, agreementFrom:r.agreementFrom, agreementTo:r.agreementTo, bankName:r.bankName, ifsc:r.ifsc, accountNo:r.accountNo }); }}>✎ Edit</span></td>
                  <td style={{ fontWeight:600, color:'#2563eb' }}>{r.agentId}</td>
                  <td style={{ fontWeight:600 }}>{r.name}</td>
                  <td>{r.firm}</td>
                  <td>{r.countries}</td>
                  <td style={{ fontWeight:600 }}>{r.commPct}%</td>
                  <td>{r.paymentTerms}</td>
                  <td style={{ fontSize:11 }}>{r.agreementFrom}</td>
                  <td style={{ fontSize:11 }}>{r.agreementTo}</td>
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


/* ══════════════════════════════════════════════════════════════════════════
   NEW MASTER 4 — Visa Type Master
   Fields: Visa type name, country, typical validity period,
           renewal lead time
   Used by: Visa tracking module
══════════════════════════════════════════════════════════════════════════ */
const VISA_INIT = [
  { id:1, visaType:'Student Visa',        country:'Russia',      validity:'1 Year',  renewalLeadTime:'3 Months', status:'Active' },
  { id:2, visaType:'Student Visa (X)',    country:'China',       validity:'1 Year',  renewalLeadTime:'60 Days',  status:'Active' },
  { id:3, visaType:'Student Visa',        country:'Philippines', validity:'1 Year',  renewalLeadTime:'2 Months', status:'Active' },
  { id:4, visaType:'Student D-Visa',      country:'Ukraine',     validity:'1 Year',  renewalLeadTime:'3 Months', status:'Active' },
  { id:5, visaType:'Student Visa',        country:'Georgia',     validity:'1 Year',  renewalLeadTime:'45 Days',  status:'Active' },
  { id:6, visaType:'Study Permit',        country:'Kazakhstan',  validity:'1 Year',  renewalLeadTime:'2 Months', status:'Active' },
];

export function VisaTypeMaster() {
  const [data, setData]     = useState(VISA_INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ visaType:'Student Visa', country:'Russia', validity:'1 Year', renewalLeadTime:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r =>
    r.visaType.toLowerCase().includes(search.toLowerCase()) ||
    r.country.toLowerCase().includes(search.toLowerCase())
  );

  const submit = e => {
    e.preventDefault();
    if (!form.visaType.trim() || !form.country.trim()) return alert('Visa Type and Country are required.');
    const entry = { ...form, status:'Active' };
    if (editId) { setData(d => d.map(r => r.id === editId ? { ...r, ...entry } : r)); setEditId(null); }
    else setData(d => [...d, { id: Date.now(), ...entry }]);
    setForm({ visaType:'Student Visa', country:'Russia', validity:'1 Year', renewalLeadTime:'' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title={editId ? 'Edit Visa Type' : 'Add New Visa Type'} />
        <div className="form-grid">
          <FormField label="Visa Type Name" required>
            <Input value={form.visaType} onChange={set('visaType')} placeholder="e.g. Student Visa" />
          </FormField>
          <FormField label="Country" required>
            <Select value={form.country} onChange={set('country')}>
              {['Russia','China','Philippines','Ukraine','Kazakhstan','Georgia','Bangladesh','Nepal','Egypt','Kyrgyzstan','India','Other'].map(c => <option key={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Typical Validity Period">
            <Select value={form.validity} onChange={set('validity')}>
              <option>6 Months</option><option>1 Year</option><option>2 Years</option><option>3 Years</option><option>5 Years</option><option>Course Duration</option>
            </Select>
          </FormField>
          <FormField label="Renewal Lead Time">
            <Input value={form.renewalLeadTime} onChange={set('renewalLeadTime')} placeholder="e.g. 3 Months or 60 Days" />
          </FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }}
            onClick={() => { setEditId(null); setForm({ visaType:'Student Visa', country:'Russia', validity:'1 Year', renewalLeadTime:'' }); }}>
            Reset
          </button>
        </div>
      </form>

      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr><th>SNo.</th><th>Edit</th><th>Visa Type</th><th>Country</th><th>Validity Period</th><th>Renewal Lead Time</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={7} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setForm({ visaType:r.visaType, country:r.country, validity:r.validity, renewalLeadTime:r.renewalLeadTime }); }}>✎ Edit</span></td>
                  <td style={{ fontWeight:600 }}>{r.visaType}</td>
                  <td>{r.country}</td>
                  <td style={{ color:'#2563eb', fontWeight:600 }}>{r.validity}</td>
                  <td>{r.renewalLeadTime}</td>
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
