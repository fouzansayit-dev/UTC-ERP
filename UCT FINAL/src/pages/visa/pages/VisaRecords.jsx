import React, { useState } from 'react';
import '../Visa.css';
import VisaForm from '../components/VisaForm.jsx';

const INIT = {
  studentId:          '',
  studentName:        '',
  passportNumber:     '',
  passportIssueDate:  '',
  passportExpiryDate: '',
  countryOfStudy:     '',
  visaType:           '',
  yearOfStudy:        '',
  applicationDate:    '',
  embassy:            '',
  appointmentDate:    '',
  documentsSubmitted: '',
  visaStatus:         '',
  visaIssueDate:      '',
  visaValidFrom:      '',
  visaValidTo:        '',
  visaNumber:         '',
  rejectionReason:    '',
  reapplicationDate:  '',
  renewalDate:        '',
  remarks:            '',
};

export default function VisaRecords() {
  const [form, setForm]   = useState(INIT);
  const [saved, setSaved] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setSaved(false);
  };

  const onFileChange = () => setSaved(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => { setForm(INIT); setSaved(false); };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Visa & Immigration › Visa Records</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>Visa Record Entry</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          Maintain complete visa and immigration details for abroad students. Auto-linked from student profile.
        </p>
      </div>

      {saved && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
          Visa record saved successfully.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="visa-card">
          <div className="visa-card-header">Visa Record Form</div>
          <div className="visa-card-body">
            <VisaForm form={form} onChange={onChange} onFileChange={onFileChange} />
            <div className="visa-btn-row" style={{ borderTop: '1px solid #e5e7eb', marginTop: 24, paddingTop: 20 }}>
              <button type="submit" className="visa-btn visa-btn-primary" onClick={() => alert("Action")}>Save Record</button>
              <button type="button" className="visa-btn visa-btn-secondary" onClick={handleReset}>Reset Form</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
