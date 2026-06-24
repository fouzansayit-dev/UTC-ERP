import React, { useState } from 'react';
import { FormField, Input, SectionTitle, SubmitBtn } from './HRComponents.jsx';

export default function TimeSlotMaster() {
  const [form, setForm] = useState({ slotName:'', startTime:'', endTime:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <form className="hr-form" onSubmit={e => { e.preventDefault(); alert('Time slot added!'); }}>
      <SectionTitle title="Time Slot Details" />
      <div className="form-grid">
        <FormField label="Slot Name" required><Input value={form.slotName} onChange={set('slotName')} placeholder="e.g. Morning Shift" /></FormField>
        <FormField label="Start Time" required><Input type="time" value={form.startTime} onChange={set('startTime')} /></FormField>
        <FormField label="End Time" required><Input type="time" value={form.endTime} onChange={set('endTime')} /></FormField>
      </div>
      <SubmitBtn label="Add Time Slot" />
    </form>
  );
}
