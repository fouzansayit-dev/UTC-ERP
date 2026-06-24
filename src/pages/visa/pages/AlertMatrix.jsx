import React, { useState } from 'react';
import '../Visa.css';
import AlertForm from '../components/AlertForm.jsx';

const INIT = {
  alertEvent:  '',
  daysTrigger: '',
  channels:    [],
  recipients:  [],
};

const SPEC_RULES = [
  { alertEvent: 'Passport Expiry Warning — 180 days before',     daysTrigger: '180', channels: ['SMS', 'Email'],              recipients: ['Student', 'Parent', 'Coordinator'] },
  { alertEvent: 'Passport Expiry Urgent — 60 days before',       daysTrigger: '60',  channels: ['SMS', 'Email', 'WhatsApp'],  recipients: ['Student', 'Parent', 'Admin', 'Agent'] },
  { alertEvent: 'Visa Appointment Reminder — 3 days before',     daysTrigger: '3',   channels: ['SMS'],                      recipients: ['Student', 'Parent'] },
  { alertEvent: 'Visa Renewal Reminder — 60 days before expiry', daysTrigger: '60',  channels: ['SMS', 'Email'],             recipients: ['Student', 'Agent', 'Coordinator'] },
  { alertEvent: 'Visa Expiry Critical — 30 days before expiry',  daysTrigger: '30',  channels: ['SMS', 'Email', 'WhatsApp'], recipients: ['Student', 'Parent', 'Principal', 'Admin'] },
  { alertEvent: 'Visa Expired — No Renewal',                     daysTrigger: '0',   channels: ['Email'],                    recipients: ['Management', 'Compliance Team'] },
  { alertEvent: 'Visa Rejected',                                 daysTrigger: '0',   channels: ['SMS', 'Email'],             recipients: ['Student', 'Counsellor', 'Agent'] },
  { alertEvent: 'Renewal Confirmation',                          daysTrigger: '0',   channels: ['SMS'],                      recipients: ['Student', 'Parent'] },
];

const TRIGGER_LABEL = { '0': 'On event' };

const CH_COLOR = {
  'SMS':                 { bg: '#dcfce7', color: '#15803d' },
  'Email':               { bg: '#dbeafe', color: '#1d4ed8' },
  'WhatsApp':            { bg: '#d1fae5', color: '#065f46' },
  'System Notification': { bg: '#f3f4f6', color: '#374151' },
};

function Pill({ text }) {
  const c = CH_COLOR[text] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: 99, padding: '2px 8px', fontSize: 12, fontWeight: 600, marginRight: 4, display: 'inline-block', marginBottom: 3 }}>
      {text}
    </span>
  );
}

export default function AlertMatrix() {
  const [form, setForm]   = useState(INIT);
  const [rules, setRules] = useState(SPEC_RULES);
  const [saved, setSaved] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onCheckChange = (field, val) => {
    setForm((p) => {
      const arr = p[field];
      return { ...p, [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.alertEvent || !form.daysTrigger) return;
    setRules((prev) => [...prev, { ...form }]);
    setForm(INIT);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (idx) => setRules((prev) => prev.filter((_, i) => i !== idx));
  const handleReset  = () => { setForm(INIT); setSaved(false); };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Visa & Immigration › Alert Matrix</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>Alert Matrix Configuration</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Automated alerts for visa expiry, passport expiry, renewal, and status changes.</p>
      </div>

      <div className="visa-info-strip">
        Pre-configured from spec Section 7.3. Add custom rules or delete existing ones as needed.
      </div>

      {saved && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
          Alert rule added successfully.
        </div>
      )}

      <form onSubmit={handleAdd}>
        <div className="visa-card">
          <div className="visa-card-header teal">Add Custom Alert Rule</div>
          <div className="visa-card-body">
            <AlertForm form={form} onChange={onChange} onCheckChange={onCheckChange} />
            <div className="visa-btn-row" style={{ borderTop: '1px solid #e5e7eb', marginTop: 20, paddingTop: 16 }}>
              <button type="submit" className="visa-btn visa-btn-primary" onClick={() => alert("Action")}>Add Rule</button>
              <button type="button" className="visa-btn visa-btn-secondary" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>
      </form>

      <div className="visa-table-wrap">
        <div className="visa-table-title teal">Configured Alert Rules — {rules.length} rule{rules.length !== 1 ? 's' : ''}</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="visa-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>#</th>
                <th>Alert Event</th>
                <th>Days Trigger</th>
                <th>Channel</th>
                <th>Recipients</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rules.length > 0 ? rules.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: '#9ca3af', fontSize: 12 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600, color: '#1e293b' }}>{r.alertEvent}</td>
                  <td>
                    <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 4, padding: '2px 10px', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>
                      {TRIGGER_LABEL[r.daysTrigger] || `${r.daysTrigger} days`}
                    </span>
                  </td>
                  <td>{(Array.isArray(r.channels) ? r.channels : [r.channels]).map((ch) => <Pill key={ch} text={ch} />)}</td>
                  <td style={{ fontSize: 12, color: '#374151' }}>{Array.isArray(r.recipients) ? r.recipients.join(', ') : r.recipients}</td>
                  <td><button className="visa-btn visa-btn-danger visa-btn-sm" onClick={() => handleDelete(i)}>Delete</button></td>
                </tr>
              )) : (
                <tr className="empty-row"><td colSpan={6}>No alert rules configured.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
