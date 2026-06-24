import React, { useState } from 'react';
import { FormField, Select, SectionTitle, SubmitBtn, MONTHS, YEARS, DEPTS } from './HRComponents.jsx';

export default function EmployeeSalaryRegister() {
  const [form, setForm] = useState({ department:'', month:'', year:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => e.preventDefault()}>
      <SectionTitle title="Salary Register Filter" />
      <div className="form-grid">
        <FormField label="Department"><Select value={form.department} onChange={set('department')}><option value="">-- All Departments --</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</Select></FormField>
        <FormField label="Month"><Select value={form.month} onChange={set('month')}><option value="">-- Select Month --</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</Select></FormField>
        <FormField label="Year"><Select value={form.year} onChange={set('year')}><option value="">-- Select Year --</option>{YEARS.map(y=><option key={y}>{y}</option>)}</Select></FormField>
      </div>
      <SubmitBtn label="Generate Register" />
    </form>
  );
}
