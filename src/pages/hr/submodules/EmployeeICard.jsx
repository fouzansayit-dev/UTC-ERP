import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, SubmitBtn, DEPTS } from './HRComponents.jsx';

export default function EmployeeICard() {
  const [form, setForm] = useState({ department:'', designation:'', empCode:'', doj:'', bloodGroup:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="hr-form">
      <form onSubmit={e => { e.preventDefault(); alert('I-Card generated!'); }}>
        <SectionTitle title="I-Card Details" />
        <div className="form-grid">
          <FormField label="Department"><Select value={form.department} onChange={set('department')}><option value="">-- Select --</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</Select></FormField>
          <FormField label="Designation"><Input value={form.designation} onChange={set('designation')} placeholder="Designation" /></FormField>
          <FormField label="Employee Code"><Input value={form.empCode} onChange={set('empCode')} placeholder="EMP-001" /></FormField>
          <FormField label="Date of Joining"><Input type="date" value={form.doj} onChange={set('doj')} /></FormField>
          <FormField label="Blood Group"><Select value={form.bloodGroup} onChange={set('bloodGroup')}><option value="">-- Select --</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></Select></FormField>
        </div>
        <SubmitBtn label="Generate I-Card" />
      </form>
    </div>
  );
}
