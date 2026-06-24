import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, SubmitBtn, DEPTS } from './HRComponents.jsx';

export default function LeaveAllocation() {
  const [form, setForm] = useState({ department:'', leaveType:'', days:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => { e.preventDefault(); alert('Leave allocated!'); }}>
      <SectionTitle title="Leave Allocation" />
      <div className="form-grid">
        <FormField label="Department" required><Select value={form.department} onChange={set('department')}><option value="">-- Select Department --</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</Select></FormField>
        <FormField label="Leave Type" required><Select value={form.leaveType} onChange={set('leaveType')}><option value="">-- Select Type --</option><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option><option>Maternity Leave</option></Select></FormField>
        <FormField label="Number of Days" required><Input type="number" min="1" value={form.days} onChange={set('days')} /></FormField>
      </div>
      <SubmitBtn label="Allocate Leave" />
    </form>
  );
}
