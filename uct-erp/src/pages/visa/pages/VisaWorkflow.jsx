import React, { useState } from 'react';
import '../Visa.css';
import WorkflowForm from '../components/WorkflowForm.jsx';
import StatusBadge  from '../components/StatusBadge.jsx';

const STAGES = [
  { id: 1, stage: 'Initiation',            status: 'Pending',    description: 'On receipt of university invitation letter (Abroad Module Step 6), visa record auto-created. Status = Not Applied.' },
  { id: 2, stage: 'Application Submitted', status: 'Submitted',  description: 'Admin enters application date, embassy, documents list. Status = Application Submitted.' },
  { id: 3, stage: 'Appointment Booked',    status: 'Booked',     description: 'Appointment date entered. System sets reminder alert 3 days before via SMS to student and admin.' },
  { id: 4, stage: 'Under Review',          status: 'Processing', description: 'Post-appointment. Status = Under Review. Expected decision date tracked.' },
  { id: 5, stage: 'Visa Approved',         status: 'Approved',   description: 'Visa issue date, validity dates, visa number entered. Visa copy uploaded. SMS sent to student and parent.' },
  { id: 6, stage: 'Visa Rejected',         status: 'Rejected',   description: 'Status = Rejected. Rejection reason documented. Alert sent to counsellor, student, agent. Reapplication workflow initiated.' },
  { id: 7, stage: 'Renewal Due (Auto)',    status: 'Renewal Due',description: '60 days before Visa Valid To date — automated alert to student, agent, and abroad coordinator. Status = Renewal Required.' },
  { id: 8, stage: 'Expired (Auto)',        status: 'Expired',    description: 'If Visa Valid To date passes with no renewal — Status auto-updated to Expired. Alert to management and compliance team. Student flagged in SIS.' },
];

const INIT_FORM = { studentSelector: '', currentStatus: '', newStatus: '', notes: '' };

export default function VisaWorkflow() {
  const [form, setForm]       = useState(INIT_FORM);
  const [updated, setUpdated] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setUpdated(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setUpdated(true);
    setTimeout(() => setUpdated(false), 3000);
  };

  const handleReset = () => { setForm(INIT_FORM); setUpdated(false); };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Visa & Immigration › Visa Workflow</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>Visa Workflow Management</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          Track and update student visa stage transitions through the complete 8-stage workflow.
        </p>
      </div>

      {updated && (
        <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#1d4ed8', fontWeight: 600 }}>
          Workflow status updated successfully.
        </div>
      )}

      <form onSubmit={handleUpdate}>
        <div className="visa-card">
          <div className="visa-card-header indigo">Update Visa Workflow Stage</div>
          <div className="visa-card-body">
            <WorkflowForm form={form} onChange={onChange} />
            <div className="visa-btn-row" style={{ borderTop: '1px solid #e5e7eb', marginTop: 20, paddingTop: 16 }}>
              <button type="submit" className="visa-btn visa-btn-primary" onClick={() => alert("Action")}>Update Status</button>
              <button type="button" className="visa-btn visa-btn-secondary" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>
      </form>

      <div className="visa-table-wrap">
        <div className="visa-table-title indigo">Visa Status Workflow — 8 Stages</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="visa-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Stage</th>
                <th>Details / Actions</th>
                <th style={{ width: 130 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {STAGES.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span className="visa-stage-num">{s.id}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>{s.stage}</td>
                  <td style={{ color: '#6b7280', fontSize: 12, lineHeight: 1.6 }}>{s.description}</td>
                  <td><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
