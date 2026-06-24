import React from 'react';
import SelectField from './SelectField.jsx';

const ALERT_EVENTS = [
  'Passport Expiry Warning — 180 days before',
  'Passport Expiry Urgent — 60 days before',
  'Visa Appointment Reminder — 3 days before',
  'Visa Renewal Reminder — 60 days before expiry',
  'Visa Expiry Critical — 30 days before expiry',
  'Visa Expired — No Renewal',
  'Visa Rejected',
  'Renewal Confirmation',
];

const CHANNELS = ['SMS', 'Email', 'WhatsApp', 'System Notification'];

const RECIPIENTS = [
  'Student', 'Parent', 'Coordinator', 'Admin',
  'Agent', 'Principal', 'Counsellor', 'Management', 'Compliance Team',
];

export default function AlertForm({ form, onChange, onCheckChange }) {
  return (
    <div>
      <div className="visa-grid">
        <SelectField label="Alert Event" name="alertEvent" value={form.alertEvent} onChange={onChange} options={ALERT_EVENTS} />
        <div className="visa-field">
          <label>Days Trigger <span style={{ color: '#6b7280', fontWeight: 400 }}>(days before event — enter 0 for on-event)</span></label>
          <input
            type="number"
            name="daysTrigger"
            value={form.daysTrigger}
            onChange={onChange}
            min={0}
            max={365}
            placeholder="e.g. 60"
          />
        </div>
      </div>

      <div className="visa-grid" style={{ marginTop: 16 }}>
        <div className="visa-field">
          <label>Channel <span style={{ color: '#6b7280', fontWeight: 400 }}>(select all that apply)</span></label>
          <div className="visa-check-group" style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '10px 14px' }}>
            {CHANNELS.map((ch) => (
              <label key={ch} className="visa-check-item">
                <input
                  type="checkbox"
                  checked={form.channels.includes(ch)}
                  onChange={() => onCheckChange('channels', ch)}
                />
                {ch}
              </label>
            ))}
          </div>
        </div>

        <div className="visa-field">
          <label>Recipients <span style={{ color: '#6b7280', fontWeight: 400 }}>(select all that apply)</span></label>
          <div className="visa-check-group" style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '10px 14px' }}>
            {RECIPIENTS.map((r) => (
              <label key={r} className="visa-check-item">
                <input
                  type="checkbox"
                  checked={form.recipients.includes(r)}
                  onChange={() => onCheckChange('recipients', r)}
                />
                {r}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
