import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, TblToolbar } from './SessionComponents.jsx';

const Band = ({ label }) => (
  <div style={{ background:'#2563eb', color:'#fff', fontWeight:700, fontSize:13, padding:'8px 14px', borderRadius:4, marginBottom:14, marginTop:6 }}>{label}</div>
);

export default function ConsultantMaster() {
  const [data, setData]   = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm]   = useState({ consultancyName:'', consultantName:'', designation:'', state:'NA', contactNo:'', emailId:'', address:'', bankHolderName:'', bankName:'', branchCity:'', ifscCode:'', accountNo:'', micrCode:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const STATES = ['NA','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];
  const filtered = data.filter(r => r.consultantName.toLowerCase().includes(search.toLowerCase()));

  const submit = e => {
    e.preventDefault();
    if (!form.consultantName) return alert('Consultant Name is required.');
    setData(d => [...d, { id: Date.now(), ...form }]);
    setForm({ consultancyName:'', consultantName:'', designation:'', state:'NA', contactNo:'', emailId:'', address:'', bankHolderName:'', bankName:'', branchCity:'', ifscCode:'', accountNo:'', micrCode:'' });
    alert('Consultant added successfully!');
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <SectionTitle title="Add New Consultant" />
          <button type="button" className="submit-btn" style={{ background:'#dc2626', marginTop:0 }} onClick={() => alert("Action")}>+ Consultant Import</button>
        </div>
        <Band label="Personal Details" />
        <div className="form-grid">
          <FormField label="Name of the Consultancy"><Input value={form.consultancyName} onChange={set('consultancyName')} /></FormField>
          <FormField label="Consultant Name" required><Input value={form.consultantName} onChange={set('consultantName')} /></FormField>
          <FormField label="Designation"><Input value={form.designation} onChange={set('designation')} /></FormField>
          <FormField label="State"><Select value={form.state} onChange={set('state')}>{STATES.map(s=><option key={s}>{s}</option>)}</Select></FormField>
          <FormField label="Contact Number" required><Input value={form.contactNo} onChange={set('contactNo')} /></FormField>
          <FormField label="Email ID" required><Input type="email" value={form.emailId} onChange={set('emailId')} /></FormField>
          <FormField label="Address" required><Input value={form.address} onChange={set('address')} /></FormField>
        </div>
        <Band label="Bank Details" />
        <div className="form-grid">
          <FormField label="Bank Account Holder Name"><Input value={form.bankHolderName} onChange={set('bankHolderName')} /></FormField>
          <FormField label="Bank Name"    required><Input value={form.bankName}    onChange={set('bankName')} /></FormField>
          <FormField label="Branch Name City"><Input value={form.branchCity} onChange={set('branchCity')} /></FormField>
          <FormField label="IFSC Code"   required><Input value={form.ifscCode}   onChange={set('ifscCode')} /></FormField>
          <FormField label="Account Number" required><Input value={form.accountNo} onChange={set('accountNo')} /></FormField>
          <FormField label="MICR Code"><Input value={form.micrCode} onChange={set('micrCode')} /></FormField>
        </div>
        <Band label="Document Details" />
        <div className="form-grid">
          <FormField label="Upload Photo *"><input type="file" className="form-input" /></FormField>
          <FormField label="Upload Aadhaar Card *"><input type="file" className="form-input" /></FormField>
          <FormField label="Upload PAN Card *"><input type="file" className="form-input" /></FormField>
          <FormField label="Upload Passport (optional)"><input type="file" className="form-input" /></FormField>
          <FormField label="Upload Company License *"><input type="file" className="form-input" /></FormField>
          <FormField label="Upload Signed Agreement *"><input type="file" className="form-input" /></FormField>
        </div>
        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">Submit</button>
          <button type="reset"  className="submit-btn" style={{ background:'#6b7280' }} onClick={() => {}}>Reset</button>
        </div>
      </form>
      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Consultant Name</th><th>Consultancy</th><th>Contact</th><th>Email</th><th>State</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={6} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>No consultants added yet</td></tr>
              : filtered.map((r, i) => (
                <tr key={r.id}><td>{i+1}</td><td style={{ fontWeight:600 }}>{r.consultantName}</td><td>{r.consultancyName}</td><td>{r.contactNo}</td><td>{r.emailId}</td><td>{r.state}</td></tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
