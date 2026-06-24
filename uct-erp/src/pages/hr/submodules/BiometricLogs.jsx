import React, { useState } from 'react';
import { FormField, Input, Select, SectionTitle, SubmitBtn } from './HRComponents.jsx';

export default function BiometricLogs() {
  const [form, setForm] = useState({ device:'', fromDate:'', toDate:'' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="hr-form">
      <form onSubmit={e => e.preventDefault()}>
        <SectionTitle title="Biometric Log Filter" />
        <div className="form-grid">
          <FormField label="Device / Location"><Select value={form.device} onChange={set('device')}><option value="">-- All Devices --</option><option>Main Gate</option><option>Block A</option><option>Block B</option><option>Admin Block</option></Select></FormField>
          <FormField label="From Date" required><Input type="date" value={form.fromDate} onChange={set('fromDate')} /></FormField>
          <FormField label="To Date" required><Input type="date" value={form.toDate} onChange={set('toDate')} /></FormField>
        </div>
        <SubmitBtn label="Fetch Logs" />
      </form>
      <SectionTitle title="Biometric Log Records" />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>#</th><th>Employee</th><th>Date</th><th>In Time</th><th>Out Time</th><th>Status</th><th>Device</th></tr></thead>
          <tbody><tr><td colSpan={7} style={{ textAlign:'center', color:'#999', padding:24 }}>No records found.</td></tr></tbody>
        </table>
      </div>
    </div>
  );
}
