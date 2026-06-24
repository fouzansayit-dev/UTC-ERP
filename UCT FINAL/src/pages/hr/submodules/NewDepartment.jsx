import React, { useState } from 'react';
import { FormField, Input, Select, Textarea, SectionTitle, SubmitBtn, DEPTS } from './HRComponents.jsx';

export default function NewDepartment() {
  const [form, setForm] = useState({ name:'', description:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => { e.preventDefault(); alert('Department added!'); }}>
      <SectionTitle title="Department Details" />
      <div className="form-grid">
        <FormField label="Department Name" required>
          <Select value={form.name} onChange={set('name')}>
            <option value="">-- Select or enter below --</option>
            {DEPTS.map(d=><option key={d}>{d}</option>)}
            <option>Other</option>
          </Select>
        </FormField>
        <FormField label="Custom Name"><Input placeholder="Enter if not listed" /></FormField>
        <FormField label="Description"><Textarea value={form.description} onChange={set('description')} rows={3} /></FormField>
      </div>
      <SubmitBtn label="Add Department" />
    </form>
  );
}
