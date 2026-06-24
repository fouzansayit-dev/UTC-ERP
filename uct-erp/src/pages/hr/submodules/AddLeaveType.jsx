import React, { useState } from 'react';
import { FormField, Input, Textarea, SectionTitle, SubmitBtn } from './HRComponents.jsx';

export default function AddLeaveType() {
  const [form, setForm] = useState({ name:'', maxDays:'', description:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => { e.preventDefault(); alert('Leave type added!'); }}>
      <SectionTitle title="Leave Type Details" />
      <div className="form-grid">
        <FormField label="Leave Name" required><Input value={form.name} onChange={set('name')} placeholder="e.g. Casual Leave" /></FormField>
        <FormField label="Max Days" required><Input type="number" min="1" value={form.maxDays} onChange={set('maxDays')} /></FormField>
        <FormField label="Description"><Textarea value={form.description} onChange={set('description')} rows={3} /></FormField>
      </div>
      <SubmitBtn label="Add Leave Type" />
    </form>
  );
}
