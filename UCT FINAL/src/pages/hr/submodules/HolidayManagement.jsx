import React, { useState } from 'react';
import { FormField, Input, Textarea, SectionTitle, SubmitBtn } from './HRComponents.jsx';

export default function HolidayManagement() {
  const [form, setForm] = useState({ name:'', date:'', description:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => { e.preventDefault(); alert('Holiday added!'); }}>
      <SectionTitle title="Holiday Details" />
      <div className="form-grid">
        <FormField label="Holiday Name" required><Input value={form.name} onChange={set('name')} placeholder="e.g. Diwali" /></FormField>
        <FormField label="Date" required><Input type="date" value={form.date} onChange={set('date')} /></FormField>
        <FormField label="Description"><Textarea value={form.description} onChange={set('description')} rows={3} /></FormField>
      </div>
      <SubmitBtn label="Add Holiday" />
    </form>
  );
}
