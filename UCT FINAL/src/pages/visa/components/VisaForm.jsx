import React from 'react';
import InputField  from './InputField.jsx';
import SelectField from './SelectField.jsx';
import DateField   from './DateField.jsx';
import FileUpload  from './FileUpload.jsx';
import TextArea    from './TextArea.jsx';
import FormSection from './FormSection.jsx';

const COUNTRIES = [
  'Russia', 'Philippines', 'Kazakhstan', 'Georgia',
  'Kyrgyzstan', 'Bangladesh', 'Ukraine', 'China', 'Nepal', 'Other',
];

const VISA_TYPES = [
  'D-Visa (Student)',
  'Study Permit',
  '9(f) Student Visa',
  'Medical Student Visa',
  'Long-Term Residence Visa',
  'Short-Stay Visa',
  'Other',
];

const VISA_STATUS = [
  'Not Applied',
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
  'Renewal Required',
  'Expired',
];

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', '6th Year'];

export default function VisaForm({ form, onChange, onFileChange }) {
  return (
    <div>

      {/* ── 1. Student Info (readonly) ── */}
      <FormSection title="Student Information">
        <div className="visa-grid">
          <InputField label="Student ID"   name="studentId"   value={form.studentId}   onChange={onChange} readOnly />
          <InputField label="Student Name" name="studentName" value={form.studentName} onChange={onChange} readOnly />
        </div>
      </FormSection>

      {/* ── 2. Passport Details ── */}
      <FormSection title="Passport Details">
        <div className="visa-grid">
          <InputField label="Passport Number"      name="passportNumber"     value={form.passportNumber}     onChange={onChange} placeholder="As on passport — must match student record" />
          <DateField  label="Passport Issue Date"  name="passportIssueDate"  value={form.passportIssueDate}  onChange={onChange} />
          <DateField  label="Passport Expiry Date" name="passportExpiryDate" value={form.passportExpiryDate} onChange={onChange} />
        </div>
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 6, padding: '8px 12px', marginTop: 10, fontSize: 12, color: '#92400e' }}>
          Alert will trigger 180 days before passport expiry date.
        </div>
      </FormSection>

      {/* ── 3. Study Details ── */}
      <FormSection title="Study Details">
        <div className="visa-grid">
          <SelectField label="Country of Study" name="countryOfStudy" value={form.countryOfStudy} onChange={onChange} options={COUNTRIES} />
          <SelectField label="Visa Type"        name="visaType"       value={form.visaType}       onChange={onChange} options={VISA_TYPES} />
          <SelectField label="Year of Study"    name="yearOfStudy"    value={form.yearOfStudy}    onChange={onChange} options={YEAR_OPTIONS} />
        </div>
      </FormSection>

      {/* ── 4. Application Details ── */}
      <FormSection title="Application Details">
        <div className="visa-grid">
          <DateField  label="Visa Application Date" name="applicationDate" value={form.applicationDate} onChange={onChange} />
          <InputField label="Embassy / Consulate"   name="embassy"         value={form.embassy}         onChange={onChange} placeholder="Name and city of processing embassy" />
          <DateField  label="Appointment Date"      name="appointmentDate" value={form.appointmentDate} onChange={onChange} />
        </div>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '8px 12px', marginTop: 10, fontSize: 12, color: '#1d4ed8' }}>
          Reminder SMS will be sent 3 days before appointment date.
        </div>
      </FormSection>

      {/* ── 5. Documents Submitted ── */}
      <FormSection title="Documents Submitted">
        <TextArea
          label="Documents Submitted"
          name="documentsSubmitted"
          value={form.documentsSubmitted}
          onChange={onChange}
          placeholder="e.g. Invitation letter, NEET card, photographs, bank statement, affidavit..."
          rows={4}
        />
      </FormSection>

      {/* ── 6. Visa Status ── */}
      <FormSection title="Visa Status">
        <div className="visa-grid">
          <SelectField label="Visa Status"    name="visaStatus"   value={form.visaStatus}   onChange={onChange} options={VISA_STATUS} />
          <DateField   label="Visa Issue Date" name="visaIssueDate" value={form.visaIssueDate} onChange={onChange} />
        </div>
      </FormSection>

      {/* Conditional: Rejection block */}
      {form.visaStatus === 'Rejected' && (
        <div className="visa-rejection-block">
          <div style={{ fontWeight: 600, color: '#b91c1c', fontSize: 13, marginBottom: 10 }}>
            Visa Rejected — Please document the reason and initiate reapplication workflow.
          </div>
          <TextArea
            label="Rejection Reason"
            name="rejectionReason"
            value={form.rejectionReason}
            onChange={onChange}
            placeholder="Document the rejection reason as communicated by the embassy..."
            rows={3}
          />
          <div style={{ marginTop: 12 }}>
            <DateField label="Reapplication Date" name="reapplicationDate" value={form.reapplicationDate} onChange={onChange} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#b91c1c' }}>
            Alert will be sent to Counsellor, Student, and Agent on rejection.
          </div>
        </div>
      )}

      {/* ── 7. Visa Validity ── */}
      <FormSection title="Visa Validity">
        <div className="visa-grid">
          <DateField  label="Visa Valid From"          name="visaValidFrom" value={form.visaValidFrom} onChange={onChange} />
          <DateField  label="Visa Valid To (Expiry)"   name="visaValidTo"   value={form.visaValidTo}   onChange={onChange} />
          <InputField label="Visa Number / Sticker Ref." name="visaNumber"  value={form.visaNumber}    onChange={onChange} placeholder="Reference number on visa sticker" />
        </div>
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, padding: '8px 12px', marginTop: 10, fontSize: 12, color: '#b91c1c' }}>
          Critical alerts at 60 days, 30 days, and on expiry date.
        </div>
      </FormSection>

      {/* ── 8. Visa Copy Upload ── */}
      <FormSection title="Visa Copy">
        <FileUpload label="Upload Visa Copy — Scanned copy (PDF / Image). View from visa record." name="visaCopy" onChange={onFileChange} />
      </FormSection>

      {/* ── 9. Renewal ── */}
      <FormSection title="Renewal">
        <div className="visa-grid">
          <DateField label="Renewal Application Date" name="renewalDate" value={form.renewalDate} onChange={onChange} />
        </div>
        <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 6, padding: '8px 12px', marginTop: 10, fontSize: 12, color: '#6d28d9' }}>
          60 days before Visa Valid To — automated renewal reminder sent. Status auto-set to Renewal Required.
        </div>
      </FormSection>

      {/* ── 10. Remarks ── */}
      <FormSection title="Remarks">
        <TextArea
          label="Remarks"
          name="remarks"
          value={form.remarks}
          onChange={onChange}
          placeholder="Embassy observations, agent assistance notes, any additional remarks..."
          rows={3}
        />
      </FormSection>

    </div>
  );
}
