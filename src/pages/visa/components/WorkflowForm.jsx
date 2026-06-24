import React from 'react';
import InputField  from './InputField.jsx';
import SelectField from './SelectField.jsx';
import TextArea    from './TextArea.jsx';

const STATUS_OPTIONS = [
  'Initiation',
  'Application Submitted',
  'Appointment Booked',
  'Under Review',
  'Visa Approved',
  'Visa Rejected',
  'Renewal Due',
  'Expired',
];

export default function WorkflowForm({ form, onChange }) {
  return (
    <div className="visa-grid">
      <InputField  label="Student Selector (Name / ID)" name="studentSelector" value={form.studentSelector} onChange={onChange} placeholder="Enter student name or ID..." />
      <InputField  label="Current Status" name="currentStatus" value={form.currentStatus} onChange={onChange} readOnly />
      <SelectField label="New Status"     name="newStatus"     value={form.newStatus}     onChange={onChange} options={STATUS_OPTIONS} />
      <div className="visa-full">
        <TextArea  label="Notes"          name="notes"         value={form.notes}         onChange={onChange} placeholder="Add transition notes..." rows={3} />
      </div>
    </div>
  );
}
