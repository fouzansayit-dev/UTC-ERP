import React, { useState } from 'react';
import { FormField, Input, Select, Textarea, SectionTitle, SubmitBtn, DEPTS } from './HRComponents.jsx';

const INIT = {
  college:'', machineId:'', timeSlot:'', department:'', empCode:'', name:'',
  qualification:'', otherQual:'', experience:'', designation:'', facultyCouncilRegNo:'',
  gender:'', marital:'', dob:'', doj:'', fatherName:'', spouseName:'',
  email:'', mobile:'', address:'', seniority:'', categories:'',
  aadhar:'', pan:'',
  bankHolder:'', branch:'', micr:'', bankName:'', bankAccount:'', ifsc:'',
  basicSalary:'', da:'', hra:'', cca:'', medical:'', dietary:'', otherAllow:'',
  pfStatus:'', pfAmount:'', pfNumber:'', tds:'', esic:'', profTax:'', otherDed:'',
  teachCourse:'', teachSubject:'',
  intlHolder:'', intlBank:'', iban:'', swift:'', bankAddress:'',
};

export default function NewEmployee() {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = 'Name is required';
    if (!form.mobile.trim()) e.mobile = 'Mobile is required';
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit mobile';
    if (form.email  && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter valid email';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    
    fetch('/api/hr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save employee');
        alert('Employee saved successfully!');
        setForm(INIT);
      })
      .catch(err => {
        alert(err.message);
      });
  };

  return (
    <form className="hr-form" onSubmit={handleSubmit}>
      <SectionTitle title="Basic Information" />
      <div className="form-grid">
        <FormField label="College"><Select value={form.college} onChange={set('college')}><option value="">-- Select College --</option><option value="UCT">UNIVERSIDADE CATOLICA TIMORENSE</option></Select></FormField>
        <FormField label="Machine ID"><Input value={form.machineId} onChange={set('machineId')} placeholder="Machine ID" /></FormField>
        <FormField label="Time Slot"><Select value={form.timeSlot} onChange={set('timeSlot')}><option value="">-- Select Slot --</option><option>Morning</option><option>Afternoon</option><option>Evening</option></Select></FormField>
        <FormField label="Department"><Select value={form.department} onChange={set('department')}><option value="">-- Select Department --</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</Select></FormField>
        <FormField label="Employee Code"><Input value={form.empCode} onChange={set('empCode')} placeholder="EMP-001" /></FormField>
        <FormField label="Name" required><Input value={form.name} onChange={set('name')} placeholder="Full Name" />{errors.name && <span className="err-msg">{errors.name}</span>}</FormField>
        <FormField label="Qualification"><Input value={form.qualification} onChange={set('qualification')} placeholder="e.g. MBBS, MD" /></FormField>
        <FormField label="Other Qualification"><Input value={form.otherQual} onChange={set('otherQual')} /></FormField>
        <FormField label="Total Experience (Years)"><Input type="number" min="0" value={form.experience} onChange={set('experience')} /></FormField>
        <FormField label="Designation"><Select value={form.designation} onChange={set('designation')}><option value="">-- Select --</option><option>Professor</option><option>Associate Professor</option><option>Assistant Professor</option><option>Lecturer</option><option>Senior Resident</option><option>Junior Resident</option><option>HOD</option><option>Principal</option><option>Dean</option><option>Administrator</option><option>HR Manager</option><option>Accountant</option><option>Staff Nurse</option><option>Lab Technician</option><option>Abroad Coordinator</option><option>Other</option></Select></FormField>
        <FormField label="Faculty Council Reg. No."><Input value={form.facultyCouncilRegNo} onChange={set('facultyCouncilRegNo')} /></FormField>
        <FormField label="Abroad Coordinator Role"><Select value={form.abroadCoordinator} onChange={set('abroadCoordinator')}><option value="">-- Select --</option><option>Yes</option><option>No</option></Select></FormField>
      </div>

      <SectionTitle title="Personal Details" />
      <div className="form-grid">
        <FormField label="Gender"><Select value={form.gender} onChange={set('gender')}><option value="">-- Select --</option><option>Male</option><option>Female</option><option>Other</option></Select></FormField>
        <FormField label="Marital Status"><Select value={form.marital} onChange={set('marital')}><option value="">-- Select --</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option></Select></FormField>
        <FormField label="Date of Birth"><Input type="date" value={form.dob} onChange={set('dob')} /></FormField>
        <FormField label="Date of Joining"><Input type="date" value={form.doj} onChange={set('doj')} /></FormField>
        <FormField label="Father's Name"><Input value={form.fatherName} onChange={set('fatherName')} /></FormField>
        <FormField label="Spouse Name"><Input value={form.spouseName} onChange={set('spouseName')} /></FormField>
        <FormField label="Email"><Input type="email" value={form.email} onChange={set('email')} />{errors.email && <span className="err-msg">{errors.email}</span>}</FormField>
        <FormField label="Mobile" required><Input type="tel" value={form.mobile} onChange={set('mobile')} maxLength={10} />{errors.mobile && <span className="err-msg">{errors.mobile}</span>}</FormField>
        <FormField label="Address"><Textarea value={form.address} onChange={set('address')} rows={2} /></FormField>
        <FormField label="Seniority"><Input value={form.seniority} onChange={set('seniority')} /></FormField>
        <FormField label="Categories"><Input value={form.categories} onChange={set('categories')} /></FormField>
      </div>

      <SectionTitle title="Documents" />
      <div className="form-grid">
        <FormField label="Photo"><Input type="file" accept="image/*" /></FormField>
        <FormField label="Aadhar Number"><Input value={form.aadhar} onChange={set('aadhar')} maxLength={14} /></FormField>
        <FormField label="PAN Number"><Input value={form.pan} onChange={set('pan')} maxLength={10} /></FormField>
      </div>

      <SectionTitle title="Bank Details" />
      <div className="form-grid">
        <FormField label="Account Holder Name"><Input value={form.bankHolder} onChange={set('bankHolder')} /></FormField>
        <FormField label="Branch Name"><Input value={form.branch} onChange={set('branch')} /></FormField>
        <FormField label="MICR Code"><Input value={form.micr} onChange={set('micr')} /></FormField>
        <FormField label="Bank Name"><Input value={form.bankName} onChange={set('bankName')} /></FormField>
        <FormField label="Account Number"><Input value={form.bankAccount} onChange={set('bankAccount')} /></FormField>
        <FormField label="IFSC Code"><Input value={form.ifsc} onChange={set('ifsc')} /></FormField>
      </div>

      <SectionTitle title="Salary Details" />
      <div className="form-grid">
        {[['basicSalary','Basic Salary'],['da','Dearness Allowance'],['hra','House Rent Allowance'],['cca','City Compensatory Allowance'],['medical','Medical Allowance'],['dietary','Dietary Allowance'],['otherAllow','Other Allowance']].map(([k,l])=>(
          <FormField key={k} label={l}><Input type="number" min="0" value={form[k]} onChange={set(k)} placeholder="0.00" /></FormField>
        ))}
      </div>

      <SectionTitle title="Deductions" />
      <div className="form-grid">
        <FormField label="PF Status"><Select value={form.pfStatus} onChange={set('pfStatus')}><option value="">-- Select --</option><option>Active</option><option>Inactive</option></Select></FormField>
        {[['pfAmount','PF Amount'],['pfNumber','PF Number'],['tds','TDS'],['esic','ESIC'],['profTax','Professional Tax'],['otherDed','Other Deductions']].map(([k,l])=>(
          <FormField key={k} label={l}><Input value={form[k]} onChange={set(k)} /></FormField>
        ))}
      </div>

      <SectionTitle title="Teaching Information" />
      <div className="form-grid">
        <FormField label="Teaching Course"><Select value={form.teachCourse} onChange={set('teachCourse')}><option value="">-- Select --</option><option>MBBS</option><option>MD</option><option>MS</option><option>BDS</option></Select></FormField>
        <FormField label="Teaching Subject"><Select value={form.teachSubject} onChange={set('teachSubject')}><option value="">-- Select --</option><option>Anatomy</option><option>Physiology</option><option>Biochemistry</option><option>Pathology</option><option>Pharmacology</option></Select></FormField>
      </div>

      <SectionTitle title="International Bank Details" />
      <div className="form-grid">
        <FormField label="Account Holder"><Input value={form.intlHolder} onChange={set('intlHolder')} /></FormField>
        <FormField label="Bank Name"><Input value={form.intlBank} onChange={set('intlBank')} /></FormField>
        <FormField label="IBAN"><Input value={form.iban} onChange={set('iban')} /></FormField>
        <FormField label="SWIFT Code"><Input value={form.swift} onChange={set('swift')} /></FormField>
        <FormField label="Bank Address"><Textarea value={form.bankAddress} onChange={set('bankAddress')} rows={2} /></FormField>
      </div>

      <SectionTitle title="Document Uploads" />
      <div className="form-grid">
        {[['aadharDoc','Aadhar Card'],['panDoc','PAN Card'],['resume','Resume'],['otherDoc','Other Documents'],['expCert','Experience Certificate'],['appointLetter','Appointment Letter'],['workContract','Work Contract'],['passport','Passport Copy'],['medFitness','Medical Fitness Certificate'],['pcc','PCC Certificate']].map(([k,l])=>(
          <FormField key={k} label={l}><Input type="file" /></FormField>
        ))}
      </div>

      <SubmitBtn label="Save Employee" />
    </form>
  );
}
