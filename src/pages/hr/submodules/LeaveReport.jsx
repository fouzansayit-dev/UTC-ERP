import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, SubmitBtn, DEPTS } from './HRComponents.jsx';

export default function LeaveReport() {
  const [form, setForm] = useState({ department:'', leaveType:'', fromDate:'', toDate:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => e.preventDefault()}>
      <SectionTitle title="Leave Report Filter" />
      <div className="form-grid">
        <FormField label="Department"><Select value={form.department} onChange={set('department')}><option value="">-- All Departments --</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</Select></FormField>
        <FormField label="Leave Type"><Select value={form.leaveType} onChange={set('leaveType')}><option value="">-- All Types --</option><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option></Select></FormField>
        <FormField label="From Date"><Input type="date" value={form.fromDate} onChange={set('fromDate')} /></FormField>
        <FormField label="To Date"><Input type="date" value={form.toDate} onChange={set('toDate')} /></FormField>
      </div>
      <SubmitBtn label="Generate Report" />
    </form>
  );
}
