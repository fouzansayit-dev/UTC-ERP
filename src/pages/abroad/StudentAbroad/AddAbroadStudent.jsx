import React, { useState } from 'react';
import '../../student/Student.css';

const COUNTRIES_UNI = {
  Russia:      ['Kazan State Medical University','Peoples Friendship University','Volgograd State Medical University','Saint Petersburg State Pediatric Medical University'],
  Philippines: ['University of Santo Tomas','Cebu Institute of Medicine','Davao Medical School Foundation','Our Lady of Fatima University'],
  Kazakhstan:  ['Astana Medical University','Karaganda Medical University','South Kazakhstan Medical Academy'],
  Georgia:     ['Tbilisi State Medical University','David Tvildiani Medical University','Batumi Shota Rustaveli State University'],
  Kyrgyzstan:  ['Osh State University','Kyrgyz State Medical Academy','International School of Medicine'],
  Bangladesh:  ['Dhaka Medical College','Chittagong Medical College','Sylhet MAG Osmani Medical College'],
  Ukraine:     ['Kharkiv National Medical University','Bogomolets National Medical University','Dnipro State Medical University'],
};

const AGENTS = ['— None —','EduGlobal Pvt Ltd','MedAbroad India','GlobalMed Consultants','StudyMed Partners','Abroad Careers India'];
const SESSIONS = ['2024-2025','2025-2026','2023-2024'];

const DOCS = ['Passport (min 18 months validity)','10th Marksheet','12th Marksheet (PCB)','Transfer Certificate','Medical Fitness Certificate','Police Clearance Certificate (PCC)','10 Passport Photos','NEET Scorecard'];

function Section({ title }) {
  return <div className="stu-section-banner" style={{ marginTop:20 }}>{title}</div>;
}

export default function AddAbroadStudent() {
  const [form, setForm] = useState({
    name:'', dob:'', gender:'', phone:'', email:'', address:'',
    parentName:'', parentPhone:'', parentEmail:'',
    neetScore:'', neetRoll:'', pcbPercent:'', neetEligible: false,
    country:'Russia', university:'', session: SESSIONS[0], agent:'— None —',
    notes:'',
  });
  const [docStatus, setDocStatus] = useState(
    Object.fromEntries(DOCS.map((d) => [d, 'Pending']))
  );
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const unis = COUNTRIES_UNI[form.country] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.parentName || !form.parentPhone) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    setLoading(true);
    fetch('/api/generic/abroad/students')
      .then(res => res.json())
      .then(existing => {
        const list = Array.isArray(existing) ? existing : [];
        const nextId = list.length > 0 ? Math.max(...list.map(s => s.id)) + 1 : 1;
        const newRoll = 'AB' + String(list.length + 1).padStart(3, '0');

        const newStudent = {
          id: nextId,
          name: form.name,
          rollNo: newRoll,
          country: form.country,
          university: form.university || unis[0] || 'Kazan State Medical University',
          stage: 1, // Stage 1: Enquiry & Programme Selection
          session: form.session,
          agent: form.agent === '— None —' ? '' : form.agent,
          dob: form.dob,
          phone: form.phone,
          email: form.email,
          address: form.address,
          parentName: form.parentName,
          parentPhone: form.parentPhone,
          neetScore: form.neetScore,
          pcbPercent: form.pcbPercent,
          docs: docStatus,
          notes: form.notes
        };

        const updated = [...list, newStudent];
        return fetch('/api/generic/abroad/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
      })
      .then(res => res.json())
      .then(() => {
        setSubmitted(true);
        // Clear form
        setForm({
          name:'', dob:'', gender:'', phone:'', email:'', address:'',
          parentName:'', parentPhone:'', parentEmail:'',
          neetScore:'', neetRoll:'', pcbPercent:'', neetEligible: false,
          country:'Russia', university:'', session: SESSIONS[0], agent:'— None —',
          notes:'',
        });
        setDocStatus(Object.fromEntries(DOCS.map((d) => [d, 'Pending'])));
        setLoading(false);
        setTimeout(() => setSubmitted(false), 4000);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to create student: " + err.message);
        setLoading(false);
      });
  };

  const Input = ({ label, fkey, type='text', placeholder='' }) => (
    <div className="stu-field">
      <label>{label}</label>
      <input type={type} placeholder={placeholder} value={form[fkey]} onChange={set(fkey)} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {submitted && (
        <div style={{ background:'#dcfce7', border:'1px solid #86efac', color:'#15803d', borderRadius:8, padding:'12px 18px', marginBottom:16, fontWeight:600, fontSize:13 }}>
          ✅ Student record created successfully at Stage 1: Enquiry & Programme Selection
        </div>
      )}

      {/* Basic Info */}
      <div className="stu-filter-card">
        <div className="stu-filter-header">Add Abroad Student</div>
        <div className="stu-filter-body">
          <Section title="1. Student Basic Information" />
          <div className="stu-form-grid">
            <Input label="Full Name *" fkey="name" placeholder="Student full name" />
            <Input label="Date of Birth *" fkey="dob" type="date" />
            <div className="stu-field">
              <label>Gender</label>
              <select value={form.gender} onChange={set('gender')}>
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <Input label="Mobile Number *" fkey="phone" placeholder="10-digit mobile" />
            <Input label="Email Address" fkey="email" type="email" placeholder="student@email.com" />
            <div className="stu-field stu-form-col-2">
              <label>Address</label>
              <textarea value={form.address} onChange={set('address')} placeholder="Full residential address" style={{ minHeight:60 }} />
            </div>
          </div>

          <Section title="2. Parent / Guardian Contact" />
          <div className="stu-form-grid">
            <Input label="Parent / Guardian Name *" fkey="parentName" />
            <Input label="Parent Mobile *" fkey="parentPhone" />
            <Input label="Parent Email" fkey="parentEmail" type="email" />
          </div>

          <Section title="3. NEET Details" />
          <div className="stu-form-grid">
            <Input label="NEET Roll Number" fkey="neetRoll" placeholder="e.g. 3112200XXXXX" />
            <Input label="NEET Score" fkey="neetScore" type="number" placeholder="Min. 50% PCB for NMC" />
            <Input label="PCB Percentage (12th)" fkey="pcbPercent" type="number" placeholder="e.g. 65.4" />
            <div className="stu-field" style={{ justifyContent:'flex-end', paddingBottom:4 }}>
              <label className="stu-check-row">
                <input type="checkbox" checked={form.neetEligible} onChange={set('neetEligible')} />
                NEET Eligibility Verified (min. 50% PCB + NEET qualifying score)
              </label>
            </div>
          </div>

          <Section title="4. Programme Selection" />
          <div className="stu-form-grid">
            <div className="stu-field">
              <label>Country *</label>
              <select value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value, university:'' }))}>
                {Object.keys(COUNTRIES_UNI).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>University *</label>
              <select value={form.university} onChange={set('university')}>
                <option value="">Select University</option>
                {unis.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>Session *</label>
              <select value={form.session} onChange={set('session')}>
                {SESSIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <Section title="5. Agent Linkage (Optional)" />
          <div className="stu-form-grid">
            <div className="stu-field">
              <label>Agent</label>
              <select value={form.agent} onChange={set('agent')}>
                {AGENTS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            {form.agent !== '— None —' && (
              <div className="stu-field">
                <label>Agent Commission Rate</label>
                <input type="text" value="Auto-pulled from Agent Agreement" readOnly style={{ background:'#f9fafb', color:'#6b7280' }} />
              </div>
            )}
          </div>

          <Section title="6. Document Collection Checklist" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:8, marginTop:8 }}>
            {DOCS.map((doc) => (
              <div key={doc} style={{ display:'flex', alignItems:'center', gap:10, background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:6, padding:'8px 12px' }}>
                <span style={{ flex:1, fontSize:13, color:'#374151' }}>{doc}</span>
                <select
                  value={docStatus[doc]}
                  onChange={(e) => setDocStatus((p) => ({ ...p, [doc]: e.target.value }))}
                  style={{ fontSize:12, padding:'3px 6px', border:'1px solid #d1d5db', borderRadius:4,
                    color: docStatus[doc]==='Received'?'#15803d': docStatus[doc]==='Rejected'?'#b91c1c':'#92400e',
                    fontWeight:600 }}
                >
                  <option>Pending</option><option>Received</option><option>Rejected</option>
                </select>
              </div>
            ))}
          </div>

          <Section title="7. Notes" />
          <div className="stu-form-grid">
            <div className="stu-field stu-form-col-2">
              <label>Additional Notes</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="Any special remarks or counsellor notes..." />
            </div>
          </div>

          <div className="stu-btn-row" style={{ marginTop:24 }}>
            <button type="submit" className="stu-btn stu-btn-primary" disabled={loading}>
              {loading ? "Registering..." : "✓ Create Student Record (Stage 1)"}
            </button>
            <button type="button" className="stu-btn stu-btn-secondary" onClick={() => window.history.back()}>Cancel</button>
          </div>
        </div>
      </div>
    </form>
  );
}
