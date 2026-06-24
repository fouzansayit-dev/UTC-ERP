import React, { useState } from 'react';
import { FormField, Input, Select, Textarea, SectionTitle, SubmitBtn, DEPTS } from './HRComponents.jsx';

export default function AddLeaveApplication() {
  const [form, setForm] = useState({ department:'', leaveType:'', fromDate:'', toDate:'', reason:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => { e.preventDefault(); alert('Application submitted!'); }}>
      <SectionTitle title="Leave Application" />
      <div className="form-grid">
        <FormField label="Department" required><Select value={form.department} onChange={set('department')}><option value="">-- Select Department --</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</Select></FormField>
        <FormField label="Leave Type" required><Select value={form.leaveType} onChange={set('leaveType')}><option value="">-- Select Type --</option><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option><option>Maternity Leave</option></Select></FormField>
        <FormField label="From Date" required><Input type="date" value={form.fromDate} onChange={set('fromDate')} /></FormField>
        <FormField label="To Date" required><Input type="date" value={form.toDate} onChange={set('toDate')} /></FormField>
        <FormField label="Reason" required><Textarea value={form.reason} onChange={set('reason')} rows={3} /></FormField>
      </div>
      <SubmitBtn label="Submit Application" />
    </form>
  );
}
