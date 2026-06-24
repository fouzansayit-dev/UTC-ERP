import React, { useState } from 'react';
import { FormField, Input, Textarea, SectionTitle, SubmitBtn } from './HRComponents.jsx';

export default function AddCategory() {
  const [form, setForm] = useState({ name:'', description:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => { e.preventDefault(); alert('Category added!'); }}>
      <SectionTitle title="Category Details" />
      <div className="form-grid">
        <FormField label="Category Name" required><Input value={form.name} onChange={set('name')} placeholder="Category name" /></FormField>
        <FormField label="Description"><Textarea value={form.description} onChange={set('description')} rows={3} /></FormField>
      </div>
      <SubmitBtn label="Add Category" />
    </form>
  );
}
