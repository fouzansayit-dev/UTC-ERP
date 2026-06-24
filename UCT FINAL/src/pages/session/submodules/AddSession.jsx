import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, MONTHS } from './SessionComponents.jsx';

export default function AddSession() {
  const [form, setForm] = useState({ startYear:'', endYear:'', startMonth:'July', endMonth:'June', code:'', isActive:'N' });
  const [saved, setSaved] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    if (!form.startYear || !form.endYear || !form.code) return alert('Please fill all required fields.');
    setSaved(true);
    setTimeout(() => { setSaved(false); setForm({ startYear:'', endYear:'', startMonth:'July', endMonth:'June', code:'', isActive:'N' }); }, 2000);
  };

  return (
    <form className="hr-form" onSubmit={submit}>
      {saved && <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:6, padding:'10px 16px', color:'#15803d', fontSize:13, fontWeight:500, marginBottom:16 }}>✓ Session saved successfully!</div>}
      <SectionTitle title="Add New Session" />
      <div className="form-grid">
        <FormField label="Start Year" required><Input value={form.startYear} onChange={set('startYear')} placeholder="e.g. 2025" /></FormField>
        <FormField label="End Year"   required><Input value={form.endYear}   onChange={set('endYear')}   placeholder="e.g. 2026" /></FormField>
        <FormField label="Start Month"><Select value={form.startMonth} onChange={set('startMonth')}>{MONTHS.map(m=><option key={m}>{m}</option>)}</Select></FormField>
        <FormField label="End Month"><Select value={form.endMonth} onChange={set('endMonth')}>{MONTHS.map(m=><option key={m}>{m}</option>)}</Select></FormField>
        <FormField label="Session Code" required><Input value={form.code} onChange={set('code')} placeholder="e.g. 003" /></FormField>
        <FormField label="Active Status">
          <Select value={form.isActive} onChange={set('isActive')}>
            <option value="Y">Y — Active</option>
            <option value="N">N — Inactive</option>
          </Select>
        </FormField>
      </div>
      <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:6, padding:'9px 14px', fontSize:12, color:'#92400e', marginBottom:8 }}>
        <strong>Note:</strong> Only one session can be active (Y) at a time.
      </div>
      <div className="form-submit-row" style={{ display:'flex', gap:10 }}>
        <button type="submit" className="submit-btn">Submit</button>
        <button type="reset"  className="submit-btn" style={{ background:'#6b7280' }} onClick={() => {}}>Reset</button>
      </div>
    </form>
  );
}
