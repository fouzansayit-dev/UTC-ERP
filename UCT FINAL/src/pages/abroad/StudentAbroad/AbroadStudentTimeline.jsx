import React, { useState } from 'react';
import '../../student/Student.css';
import { STAGES } from './AbroadStudentLifecycle';

/* ─── Stage detail content ───────────────────────────────────── */
const STAGE_DETAIL = {
  1: {
    icon: '🔍',
    fields: [
      { label: 'Enquiry Date', type: 'date', key: 'enquiryDate' },
      { label: 'Counsellor Name', type: 'text', key: 'counsellor' },
      { label: 'Countries Interested', type: 'text', key: 'countriesInterested' },
      { label: 'NEET Score', type: 'text', key: 'neetScore' },
      { label: 'PCB %', type: 'text', key: 'pcbPercent' },
      { label: 'NEET Eligibility', type: 'select', key: 'neetEligible', options: ['Eligible', 'Not Eligible', 'Pending Verification'] },
    ],
  },
  2: {
    icon: '🌍',
    fields: [
      { label: 'Selected Country', type: 'text', key: 'selectedCountry' },
      { label: 'Selected University', type: 'text', key: 'selectedUniversity' },
      { label: 'Annual Tuition (USD)', type: 'text', key: 'tuitionUSD' },
      { label: 'Hostel Fee (USD)', type: 'text', key: 'hostelFeeUSD' },
      { label: 'Intake Date', type: 'date', key: 'intakeDate' },
      { label: 'Seat Availability Confirmed', type: 'select', key: 'seatConfirmed', options: ['Yes', 'No', 'Pending'] },
    ],
  },
  3: {
    icon: '🤝',
    fields: [
      { label: 'Agent Name', type: 'text', key: 'agentName' },
      { label: 'Agent ID', type: 'text', key: 'agentId' },
      { label: 'Commission Rate (%)', type: 'text', key: 'commissionRate' },
      { label: 'Agreement Date', type: 'date', key: 'agentAgreementDate' },
      { label: 'Walk-In (No Agent)', type: 'select', key: 'noAgent', options: ['Yes — Direct Admission', 'No — Agent Linked'] },
    ],
  },
  4: {
    icon: '📋',
    fields: [
      { label: 'Passport Status', type: 'select', key: 'passportStatus', options: ['Received','Pending','Rejected'] },
      { label: 'NEET Scorecard Status', type: 'select', key: 'neetScorecardStatus', options: ['Received','Pending','Rejected'] },
      { label: '10th Marksheet Status', type: 'select', key: 'marksheet10Status', options: ['Received','Pending','Rejected'] },
      { label: '12th Marksheet (PCB) Status', type: 'select', key: 'marksheet12Status', options: ['Received','Pending','Rejected'] },
      { label: 'Transfer Certificate Status', type: 'select', key: 'tcStatus', options: ['Received','Pending','Rejected'] },
      { label: 'Medical Fitness Certificate Status', type: 'select', key: 'medicalFitStatus', options: ['Received','Pending','Rejected'] },
      { label: 'Police Clearance (PCC) Status', type: 'select', key: 'pccStatus', options: ['Received','Pending','Rejected'] },
      { label: 'Passport Photos (10 nos)', type: 'select', key: 'photosStatus', options: ['Received','Pending','Rejected'] },
    ],
  },
  5: {
    icon: '📤',
    fields: [
      { label: 'Application Date', type: 'date', key: 'applicationDate' },
      { label: 'Documents Sent Date', type: 'date', key: 'docsSentDate' },
      { label: 'University Acknowledgment Date', type: 'date', key: 'uniAckDate' },
      { label: 'Application Reference No.', type: 'text', key: 'applicationRef' },
    ],
  },
  6: {
    icon: '📨',
    fields: [
      { label: 'Letter Type', type: 'select', key: 'letterType', options: ['Provisional Admission Letter','Invitation Letter'] },
      { label: 'Letter Received Date', type: 'date', key: 'letterDate' },
      { label: 'Uploaded to DMS', type: 'select', key: 'dmsUploaded', options: ['Yes','No'] },
      { label: 'Visa Process Triggered', type: 'select', key: 'visaTriggered', options: ['Yes','No'] },
    ],
  },
  7: {
    icon: '💸',
    fields: [
      { label: 'Amount (USD)', type: 'text', key: 'remitUSD' },
      { label: 'INR Equivalent', type: 'text', key: 'remitINR' },
      { label: 'Exchange Rate', type: 'text', key: 'exchangeRate' },
      { label: 'Remittance Date', type: 'date', key: 'remitDate' },
      { label: 'Bank Name', type: 'text', key: 'remitBank' },
      { label: 'SWIFT Reference', type: 'text', key: 'swiftRef' },
      { label: 'University Receipt Uploaded', type: 'select', key: 'receiptUploaded', options: ['Yes','No'] },
    ],
  },
  8: {
    icon: '🛂',
    fields: [
      { label: 'Visa Application Date', type: 'date', key: 'visaAppDate' },
      { label: 'Embassy / Consulate', type: 'text', key: 'embassy' },
      { label: 'Visa Type', type: 'text', key: 'visaType' },
      { label: 'Visa Status', type: 'select', key: 'visaStatus', options: ['Processing','Approved','Rejected','Reapplying'] },
      { label: 'Visa Approval Date', type: 'date', key: 'visaApprovalDate' },
      { label: 'Visa Expiry Date', type: 'date', key: 'visaExpiry' },
    ],
  },
  9: {
    icon: '✈️',
    fields: [
      { label: 'Air Ticket Booked', type: 'select', key: 'ticketBooked', options: ['Yes','No'] },
      { label: 'Airline', type: 'text', key: 'airline' },
      { label: 'PNR Number', type: 'text', key: 'pnr' },
      { label: 'Travel Date', type: 'date', key: 'travelDate' },
      { label: 'Travel Insurance Policy No.', type: 'text', key: 'insurancePolicyNo' },
      { label: 'Forex Arranged', type: 'select', key: 'forexArranged', options: ['Yes','No'] },
      { label: 'Orientation Session Attended', type: 'select', key: 'orientationAttended', options: ['Yes','No'] },
      { label: 'Local Guardian (Destination Country)', type: 'text', key: 'localGuardian' },
    ],
  },
  10: {
    icon: '🛫',
    fields: [
      { label: 'Departure Date', type: 'date', key: 'departureDate' },
      { label: 'Flight No.', type: 'text', key: 'flightNo' },
      { label: 'Student Status', type: 'select', key: 'studentStatus', options: ['Abroad — Active','Delayed'] },
      { label: 'Parent Notified via SMS', type: 'select', key: 'parentNotified', options: ['Yes','No'] },
    ],
  },
  11: {
    icon: '🏫',
    fields: [
      { label: 'Current Semester', type: 'text', key: 'currentSemester' },
      { label: 'Attendance %', type: 'text', key: 'attendance' },
      { label: 'Exam Result', type: 'select', key: 'examResult', options: ['Pass','Fail','Awaited'] },
      { label: 'Next Year Fee Paid', type: 'select', key: 'nextYearFee', options: ['Yes','No','Pending'] },
      { label: 'Parent Updated', type: 'select', key: 'parentUpdated', options: ['Yes','No'] },
      { label: 'Result Report Uploaded', type: 'select', key: 'resultUploaded', options: ['Yes','No'] },
    ],
  },
  12: {
    icon: '🔄',
    fields: [
      { label: 'Return Date to India', type: 'date', key: 'returnDate' },
      { label: 'Passport Validity Checked', type: 'select', key: 'passportValidityChecked', options: ['Valid','Needs Renewal'] },
      { label: 'Visa Renewal Initiated', type: 'select', key: 'visaRenewalInitiated', options: ['Yes','No'] },
      { label: 'Re-Departure Date', type: 'date', key: 'reDepartureDate' },
    ],
  },
  13: {
    icon: '🏥',
    fields: [
      { label: 'Internship Start Date', type: 'date', key: 'internshipStart' },
      { label: 'Hospital / College Assigned', type: 'text', key: 'internshipHospital' },
      { label: 'Student Status', type: 'select', key: 'internshipStatus', options: ['Internship — India','Completed'] },
      { label: 'FMGE / NExT Exam Status', type: 'select', key: 'fmgeStatus', options: ['Not Appeared','Appeared','Pass','Fail'] },
      { label: 'FMGE / NExT Score', type: 'text', key: 'fmgeScore' },
    ],
  },
  14: {
    icon: '🎓',
    fields: [
      { label: 'Graduation Date', type: 'date', key: 'graduationDate' },
      { label: 'Final Transcript Uploaded', type: 'select', key: 'transcriptUploaded', options: ['Yes','No'] },
      { label: 'Migration Certificate Uploaded', type: 'select', key: 'migrationUploaded', options: ['Yes','No'] },
      { label: 'Degree Copy Uploaded', type: 'select', key: 'degreeUploaded', options: ['Yes','No'] },
      { label: 'Alumni Record Created', type: 'select', key: 'alumniCreated', options: ['Yes','No'] },
      { label: 'Student Final Status', type: 'select', key: 'finalStatus', options: ['Completed — Alumni'] },
    ],
  },
};

/* ─── Stage color (same logic as lifecycle) ─────────────────── */
function stageColor(id) {
  if (id <= 3)  return '#1d4ed8';
  if (id <= 6)  return '#92400e';
  if (id <= 9)  return '#c2410c';
  if (id <= 11) return '#15803d';
  if (id <= 13) return '#7e22ce';
  return '#065f46';
}

export default function AbroadStudentTimeline({ student, onBack, onAdvance }) {
  const [activeStage, setActiveStage] = useState(student.stage);
  const [formData, setFormData] = useState({});

  const setField = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));

  const detail = STAGE_DETAIL[activeStage];

  return (
    <div>
      {/* ── Back Header ── */}
      <div className="stu-filter-card" style={{ marginBottom:16 }}>
        <div className="stu-filter-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button
              onClick={onBack}
              style={{
                background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
                color:'#fff', borderRadius:6, padding:'4px 12px', cursor:'pointer',
                fontSize:12, fontWeight:600
              }}
            >
              ← Back
            </button>
            <span>Abroad Student Timeline — {student.name}</span>
          </div>
          <div style={{ display:'flex', gap:12, fontSize:12, opacity:0.85 }}>
            <span>Roll: {student.rollNo}</span>
            <span>|</span>
            <span>{student.country}</span>
            <span>|</span>
            <span>{student.university}</span>
          </div>
        </div>
      </div>

      {/* ── Current Stage Banner ── */}
      <div style={{
        background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8,
        padding:'10px 18px', marginBottom:20, display:'flex', alignItems:'center',
        gap:12, fontSize:13
      }}>
        <span style={{ fontSize:20 }}>{STAGE_DETAIL[student.stage]?.icon}</span>
        <div>
          <span style={{ fontWeight:600, color:'#065f46' }}>Current Stage: </span>
          <span style={{ color:'#15803d' }}>Stage {student.stage} — {STAGES.find(s => s.id === student.stage)?.label}</span>
        </div>
        {student.stage < 14 && (
          <button
            className="stu-btn stu-btn-success stu-btn-sm"
            style={{ marginLeft:'auto' }}
            onClick={() => { onAdvance(); }}
          >
            Advance to Stage {student.stage + 1} →
          </button>
        )}
        {student.stage === 14 && (
          <span style={{ marginLeft:'auto', fontSize:13, fontWeight:700, color:'#065f46' }}>🎓 Graduated — Alumni</span>
        )}
      </div>

      <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>

        {/* ── Timeline Rail (left) ── */}
        <div style={{
          width:260, flexShrink:0,
          background:'#fff', border:'1px solid #e5e7eb',
          borderRadius:10, overflow:'hidden',
          boxShadow:'0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            background:'#1e293b', color:'#fff',
            padding:'10px 14px', fontSize:12, fontWeight:600
          }}>
            14-Stage Lifecycle
          </div>
          <div style={{ padding:'8px 0' }}>
            {STAGES.map((st, idx) => {
              const isCompleted = st.id < student.stage;
              const isCurrent   = st.id === student.stage;
              const isActive    = st.id === activeStage;
              const isFuture    = st.id > student.stage;
              const color       = stageColor(st.id);

              return (
                <div
                  key={st.id}
                  onClick={() => setActiveStage(st.id)}
                  style={{
                    display:'flex', alignItems:'flex-start', gap:10,
                    padding:'8px 14px', cursor:'pointer',
                    background: isActive ? '#f8fafc' : 'transparent',
                    borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
                    transition:'all 0.15s',
                    position:'relative',
                  }}
                >
                  {/* connector line */}
                  {idx < STAGES.length - 1 && (
                    <div style={{
                      position:'absolute', left:22, top:28,
                      width:2, height:'calc(100% - 4px)',
                      background: isCompleted ? '#16a34a' : '#e5e7eb',
                      zIndex:0
                    }} />
                  )}

                  {/* circle */}
                  <div style={{
                    width:20, height:20, borderRadius:'50%', flexShrink:0,
                    background: isCompleted ? '#16a34a' : isCurrent ? color : '#e5e7eb',
                    color:'#fff', fontSize:10, fontWeight:700,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    border: isCurrent ? `2px solid ${color}` : '2px solid transparent',
                    boxShadow: isCurrent ? `0 0 0 3px ${color}22` : 'none',
                    zIndex:1, position:'relative', marginTop:2
                  }}>
                    {isCompleted ? '✓' : st.id}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{
                      fontSize:11, fontWeight: isCurrent || isActive ? 700 : 500,
                      color: isFuture ? '#9ca3af' : isCompleted ? '#16a34a' : isCurrent ? color : '#374151',
                      lineHeight:1.35
                    }}>
                      {st.label}
                    </div>
                    {isCurrent && (
                      <div style={{ fontSize:10, color: color, fontWeight:600, marginTop:2 }}>● In Progress</div>
                    )}
                    {isCompleted && (
                      <div style={{ fontSize:10, color:'#16a34a', marginTop:2 }}>Completed</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Stage Detail Panel (right) ── */}
        <div style={{ flex:1, minWidth:0 }}>
          <div className="stu-filter-card" style={{ marginBottom:0 }}>
            <div className="stu-filter-header" style={{ background: stageColor(activeStage), display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:18 }}>{detail?.icon}</span>
              <span>Stage {activeStage} — {STAGES.find(s => s.id === activeStage)?.label}</span>
              {activeStage < student.stage && (
                <span style={{
                  marginLeft:'auto', background:'rgba(255,255,255,0.2)',
                  border:'1px solid rgba(255,255,255,0.35)',
                  borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:600
                }}>✓ Completed</span>
              )}
              {activeStage === student.stage && (
                <span style={{
                  marginLeft:'auto', background:'rgba(255,255,255,0.2)',
                  border:'1px solid rgba(255,255,255,0.35)',
                  borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:600
                }}>● In Progress</span>
              )}
              {activeStage > student.stage && (
                <span style={{
                  marginLeft:'auto', background:'rgba(255,255,255,0.15)',
                  border:'1px solid rgba(255,255,255,0.25)',
                  borderRadius:20, padding:'2px 10px', fontSize:11
                }}>Upcoming</span>
              )}
            </div>
            <div className="stu-filter-body">
              {detail ? (
                <>
                  <div className="stu-filter-row">
                    {detail.fields.map((f) => (
                      <div className="stu-field" key={f.key}>
                        <label>{f.label}</label>
                        {f.type === 'select' ? (
                          <select value={formData[f.key] || ''} onChange={setField(f.key)}>
                            <option value="">— Select —</option>
                            {f.options.map((o) => <option key={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={f.type}
                            value={formData[f.key] || ''}
                            onChange={setField(f.key)}
                            placeholder={f.type === 'text' ? `Enter ${f.label.toLowerCase()}` : undefined}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {activeStage <= student.stage && (
                    <div className="stu-btn-row">
                      <button className="stu-btn stu-btn-primary" onClick={() => alert("Action")}>Save Stage {activeStage} Data</button>
                      <button className="stu-btn stu-btn-secondary" onClick={() => alert("Action")}>Upload Document</button>
                    </div>
                  )}
                  {activeStage > student.stage && (
                    <div style={{
                      marginTop:12, padding:'10px 14px',
                      background:'#f9fafb', border:'1px solid #e5e7eb',
                      borderRadius:6, fontSize:12, color:'#6b7280'
                    }}>
                      ⚠️ This stage is not yet reached. Advance the student's lifecycle to unlock data entry.
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color:'#9ca3af', fontSize:13 }}>No detail configured for this stage.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
