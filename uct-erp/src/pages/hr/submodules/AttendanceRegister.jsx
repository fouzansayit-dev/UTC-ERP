import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, SubmitBtn, DEPTS } from './HRComponents.jsx';

export default function AttendanceRegister() {
  const [form, setForm] = useState({ department:'', fromDate:'', toDate:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => e.preventDefault()}>
      <SectionTitle title="Attendance Register" />
      <div className="form-grid">
        <FormField label="Department"><Select value={form.department} onChange={set('department')}><option value="">-- Select Department --</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</Select></FormField>
        <FormField label="From Date"><Input type="date" value={form.fromDate} onChange={set('fromDate')} /></FormField>
        <FormField label="To Date"><Input type="date" value={form.toDate} onChange={set('toDate')} /></FormField>
      </div>
      <SubmitBtn label="Generate Register" />
    </form>
  );
}
