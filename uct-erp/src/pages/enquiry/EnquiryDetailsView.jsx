import React from 'react';
import './Enquiry.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;

const InfoRow = ({ label, value }) => (
  <div className="enq-info-row">
    <span className="enq-info-label">{label}</span>
    <span className="enq-info-value">{value || <span style={{ color: '#ccc' }}>—</span>}</span>
  </div>
);

export default function EnquiryDetailsView() {
  return (
    <div className="hr-form">

      <div className="enq-header-bar">
        <div className="enq-id-block">
          <span>Enquiry ID: </span><strong>—</strong>
          <span className="enq-divider">|</span>
          <span>Enquiry Date: </span><strong>—</strong>
        </div>
        <div className="enq-id-block">
          <span>Status: </span><strong>—</strong>
        </div>
      </div>

      <SectionTitle title="Student Information" />
      <div className="enq-info-grid" style={{ marginBottom: 24 }}>
        <InfoRow label="Student Name" />
        <InfoRow label="Father / Guardian Name" />
        <InfoRow label="Date of Birth" />
        <InfoRow label="Gender" />
        <InfoRow label="Address" />
        <InfoRow label="City" />
      </div>

      <SectionTitle title="Contact Information" />
      <div className="enq-info-grid" style={{ marginBottom: 24 }}>
        <InfoRow label="Mobile Number" />
        <InfoRow label="Alternate Mobile" />
        <InfoRow label="Email Address" />
      </div>

      <SectionTitle title="Course Information" />
      <div className="enq-info-grid" style={{ marginBottom: 24 }}>
        <InfoRow label="Course Interested" />
        <InfoRow label="Program Type" />
        <InfoRow label="Country Preference" />
        <InfoRow label="Passport Status" />
        <InfoRow label="Qualification" />
        <InfoRow label="Board / University" />
        <InfoRow label="Marks Percentage" />
        <InfoRow label="NEET Score" />
      </div>

      <SectionTitle title="Counselor &amp; Source" />
      <div className="enq-info-grid" style={{ marginBottom: 24 }}>
        <InfoRow label="Source of Enquiry" />
        <InfoRow label="Agent ID" />
        <InfoRow label="Assigned Counselor" />
        <InfoRow label="Remarks" />
      </div>

      <SectionTitle title="Follow-up History" />
      <div className="table-wrap" style={{ marginBottom: 8 }}>
        <table className="hr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Counselor</th>
              <th>Action</th>
              <th>Notes</th>
              <th>Next Follow-up Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="empty-table-msg">
                No follow-up history available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="enq-btn-group">
        <button type="button" className="btn-primary" onClick={() => alert("Action")}>Edit Enquiry</button>
        <button type="button" className="btn-secondary" onClick={() => alert("Action")}>Add Follow-up</button>
        <button type="button" className="btn-success" onClick={() => alert("Action")}>Convert to Admission</button>
      </div>

    </div>
  );
}
