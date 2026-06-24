import React from 'react';
import InputField  from './InputField.jsx';
import SelectField from './SelectField.jsx';
import DateField   from './DateField.jsx';
import TextArea    from './TextArea.jsx';

const RENEWAL_STATUS = [
  'Not Started',
  'Documents Collecting',
  'Application Submitted',
  'Under Review',
  'Approved',
  'Rejected',
];

export default function RenewalForm({ form, onChange }) {
  return (
    <div className="visa-grid">
      <InputField  label="Student ID"               name="studentId"      value={form.studentId}      onChange={onChange} placeholder="Enter student ID" />
      <DateField   label="Visa Expiry Date"          name="visaExpiryDate" value={form.visaExpiryDate} onChange={onChange} readOnly />
      <DateField   label="Renewal Application Date"  name="renewalAppDate" value={form.renewalAppDate} onChange={onChange} />
      <SelectField label="Renewal Status"            name="renewalStatus"  value={form.renewalStatus}  onChange={onChange} options={RENEWAL_STATUS} />
      <div className="visa-full">
        <TextArea  label="Notes"                     name="notes"          value={form.notes}          onChange={onChange} placeholder="Renewal notes or remarks..." rows={3} />
      </div>
    </div>
  );
}
