import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, Textarea, TblToolbar } from './SessionComponents.jsx';

/* Enhancement: Added Visa alert templates & agent commission templates */
const CODES = [
  ['Student Name','{name}'],['Fathers Name','{fname}'],['Course','{course}'],['Branch','{branch}'],
  ['Batch','{batch}'],['Due Fees','{duefees}'],['Receipt No','{receiptno}'],['Receipt Date','{receiptdate}'],
  ['Receipt Amount','{recvamount}'],['Total Due','{totaldue}'],['Previous Paid','{previouspaid}'],['College Name','{collegename}'],
  ['Followup Date','{followup_date}'],['College Mobno','{collegemobno}'],['OTP NO','{app_otp}'],['Homework Subject','{hsubject}'],
  ['Homework','{homework}'],['Remarks','{remarks}'],['Userid','{user_id}'],['Late Fees','{latefee}'],
  ['Total Due + Late Fees','{total_duefee}'],['Account Payment Amount','{acc_payment_amt}'],
  ['Account Payment Date','{acc_payment_date}'],['Account Party','{acc_party}'],
  ['Account Remarks','{acc_remarks}'],['Confirm Link','{conf_link}'],['Account Subhead','{acc_subhead}'],
  ['Absent Date','{absentdate}'],['Father Mobno','{fmobno}'],['APP Pwd','{pwd}'],
  ['Student Mobile No','{stu_mobno}'],
  // NEW — Visa alert codes
  ['Visa Expiry Date','{visa_expiry}'],['Visa Type','{visa_type}'],['Passport No','{passport_no}'],
  ['Country','{country}'],['Embassy City','{embassy_city}'],
  // NEW — Agent commission codes
  ['Agent Name','{agent_name}'],['Agent ID','{agent_id}'],['Commission %','{commission_pct}'],
  ['Commission Amount','{commission_amt}'],['Payment Date','{comm_payment_date}'],
];

const SMS_TYPES = [
  'Other','Payment_Confirm','OTP','Absent',
  'Visa_Alert',          // NEW
  'Visa_Expiry_Reminder',// NEW
  'Agent_Commission',    // NEW
];

const INIT = [
  { id:1, smsType:'Payment_Confirm',    medium:'English', templateId:'1207161873819867452', templateName:'ACCOUNT_PAYMENT_CONFIRM',   template:'A/C {#var#} is Debited Rs. {#var#}...', softwareTemplate:'A/C {acc_subhead} is Debited Rs. {acc_payment_amt}...' },
  { id:2, smsType:'Visa_Alert',         medium:'English', templateId:'1207161873819867453', templateName:'VISA_EXPIRY_ALERT',          template:'Dear {name}, your visa expires on {visa_expiry}. Kindly renew.', softwareTemplate:'Dear {name}, your {visa_type} visa expires on {visa_expiry}.' },
  { id:3, smsType:'Agent_Commission',   medium:'English', templateId:'1207161873819867454', templateName:'AGENT_COMMISSION_CREDIT',    template:'Dear {agent_name}, commission of {commission_amt} credited.', softwareTemplate:'Dear {agent_name} ({agent_id}), Rs.{commission_amt} credited on {comm_payment_date}.' },
];

export default function TemplateMaster() {
  const [data, setData]     = useState(INIT);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ medium:'English', smsType:'Other', templateName:'', templateId:'', template:'', softwareTemplate:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = data.filter(r =>
    r.templateName.toLowerCase().includes(search.toLowerCase()) ||
    r.smsType.toLowerCase().includes(search.toLowerCase())
  );

  const submit = e => {
    e.preventDefault();
    if (!form.templateName || !form.templateId) return alert('Template Name and ID are required.');
    if (editId) { setData(d => d.map(r => r.id === editId ? { ...r, ...form } : r)); setEditId(null); }
    else setData(d => [...d, { id: Date.now(), ...form }]);
    setForm({ medium:'English', smsType:'Other', templateName:'', templateId:'', template:'', softwareTemplate:'' });
  };

  return (
    <div className="hr-form">
      <form onSubmit={submit}>
        <SectionTitle title="Add New Template" />
        <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:6, padding:'8px 14px', fontSize:12, color:'#1d4ed8', marginBottom:14 }}>
          <strong>Enhanced:</strong> Now includes Visa Alert templates and Agent Commission templates
        </div>
        <div className="form-grid">
          <FormField label="Medium">
            <Select value={form.medium} onChange={set('medium')}><option>English</option><option>Hindi</option></Select>
          </FormField>
          <FormField label="SMS TYPE">
            <Select value={form.smsType} onChange={set('smsType')}>
              {SMS_TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
          </FormField>
          <FormField label="Template Name" required><Input value={form.templateName} onChange={set('templateName')} /></FormField>
          <FormField label="Template ID"   required><Input value={form.templateId}   onChange={set('templateId')} /></FormField>
          <FormField label="Template"><Textarea rows={3} value={form.template} onChange={set('template')} /></FormField>
          <FormField label="Software Template"><Textarea rows={3} value={form.softwareTemplate} onChange={set('softwareTemplate')} /></FormField>
        </div>

        <div style={{ background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:6, padding:'12px 16px', marginBottom:12 }}>
          <div style={{ fontWeight:700, fontSize:12, marginBottom:8 }}>Template Codes</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:'4px 12px' }}>
            {CODES.map(([label, code]) => (
              <div key={code} style={{ fontSize:11 }}>
                <span style={{ color:'#374151' }}>{label}</span>
                <span style={{ color:'#2563eb', fontFamily:'monospace', marginLeft:4 }}>{code}</span>
              </div>
            ))}
          </div>
          {/* New codes highlight */}
          <div style={{ marginTop:10, paddingTop:8, borderTop:'1px dashed #e5e7eb' }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#7c3aed' }}>NEW — Visa &amp; Agent codes:</span>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 14px', marginTop:4 }}>
              {['{visa_expiry}','{visa_type}','{passport_no}','{country}','{embassy_city}','{agent_name}','{agent_id}','{commission_pct}','{commission_amt}','{comm_payment_date}'].map(c=>(
                <span key={c} style={{ fontFamily:'monospace', fontSize:11, color:'#7c3aed' }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
          <button type="submit" className="submit-btn">{editId ? 'Update' : 'Submit'}</button>
          <button type="button" className="submit-btn" style={{ background:'#6b7280' }}
            onClick={() => { setEditId(null); setForm({ medium:'English', smsType:'Other', templateName:'', templateId:'', template:'', softwareTemplate:'' }); }}>
            Reset
          </button>
        </div>
      </form>

      <TblToolbar search={search} onSearch={setSearch} />
      <div className="table-wrap" style={{ overflowX:'auto' }}>
        <table className="hr-table">
          <thead>
            <tr><th>SNo.</th><th>Edit</th><th>SMS TYPE</th><th>Medium</th><th>Template ID</th><th>Template Name</th><th>Template</th><th>Software Template</th></tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td>
                <td><span className="tbl-btn edit" onClick={() => { setEditId(r.id); setForm({ medium:r.medium, smsType:r.smsType, templateName:r.templateName, templateId:r.templateId, template:r.template, softwareTemplate:r.softwareTemplate }); }}>✎ Edit</span></td>
                <td><span style={{ background: r.smsType.includes('Visa')?'#faf5ff': r.smsType.includes('Agent')?'#fff7ed':'#f0fdf4', color: r.smsType.includes('Visa')?'#7c3aed': r.smsType.includes('Agent')?'#c2410c':'#15803d', padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600 }}>{r.smsType}</span></td>
                <td>{r.medium}</td>
                <td style={{ fontFamily:'monospace', fontSize:11 }}>{r.templateId}</td>
                <td style={{ fontWeight:600 }}>{r.templateName}</td>
                <td style={{ maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.template}</td>
                <td style={{ maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.softwareTemplate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div>
  );
}
