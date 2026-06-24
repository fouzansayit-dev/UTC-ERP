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
  const [form, setForm]           = useState(INIT);
  const [errors, setErrors]       = useState({});
  const [credentials, setCredentials] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [copied, setCopied]       = useState('');
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
    setSaveError(null);

    fetch('/api/hr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(async (res) => {
        let data = {};
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          try { data = await res.json(); } catch(ex) {}
        } else {
          const t = await res.text();
          data = { error: t || 'Unknown server error' };
        }
        if (!res.ok) throw new Error(data.error || 'Failed to save employee');
        if (data.credentials) {
          setCredentials({ employeeName: data.name, ...data.credentials });
        } else {
          setCredentials({ employeeName: data.name, plain: true });
        }
        setForm(INIT);
      })
      .catch(err => setSaveError(err.message));
  };

  const copy = (label, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  // -- Credential display after successful save --
  if (credentials) {
    return (
      <div className="hr-form" style={{ maxWidth: 640 }}>
        <div style={empStyles.successBanner}>
          <span style={{ fontSize: 28 }}>✓</span>
          <div>
            <div style={empStyles.successTitle}>Employee Added Successfully!</div>
            <div style={empStyles.successSub}>
              {credentials.employeeName} has been registered. Share the credentials below.
            </div>
          </div>
        </div>

        {credentials.plain ? (
          <p style={{ color: '#6b7280', fontSize: 14 }}>Employee account created.</p>
        ) : (
          <div style={empStyles.credCard}>
            <div style={empStyles.credHeader}>🔐 Login Credentials</div>
            <div style={empStyles.credBody}>
              <EmpCredRow label="Login ID (Username)" value={credentials.username} copied={copied} onCopy={copy} />
              <EmpCredRow label="Password"             value={credentials.password} copied={copied} onCopy={copy} secret />
              <EmpCredRow label="Role / Portal"        value={credentials.role}     copied={copied} onCopy={copy} />
            </div>
            <div style={empStyles.credNote}>
              ⚠️ Please save or print these credentials. The password cannot be retrieved later.
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button className="submit-btn" onClick={() => { setCredentials(null); setSaveError(null); }}>
            + Add Another Employee
          </button>
          {credentials.username && (
            <button
              className="submit-btn"
              style={{ background: '#6b7280' }}
              onClick={() => {
                const text =
                  `UCT ERP — Employee Login Credentials\n` +
                  `Employee: ${credentials.employeeName}\n` +
                  `Login ID: ${credentials.username}\n` +
                  `Password: ${credentials.password}\n` +
                  `Portal: ${credentials.portal}`;
                navigator.clipboard.writeText(text);
                setCopied('ALL'); setTimeout(() => setCopied(''), 2500);
              }}
            >
              {copied === 'ALL' ? '✓ Copied All!' : '📋 Copy All'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
    {saveError && (
      <div style={empStyles.errorBanner}>⚠ {saveError}</div>
    )}
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
    </>
  );
}

function EmpCredRow({ label, value, copied, onCopy, secret }) {
  const [show, setShow] = React.useState(!secret);
  const isCopied = copied === label;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', minWidth: 160 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <code style={{ background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: 6, padding: '5px 10px', fontSize: 14, fontFamily: 'monospace', color: '#1e1b4b' }}>
          {secret && !show ? '••••••••••' : value}
        </code>
        {secret && (
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} onClick={() => setShow(s => !s)}>
            {show ? '🙈' : '👁'}
          </button>
        )}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: isCopied ? '#16a34a' : '#4361ee' }}
          onClick={() => onCopy(label, value)}
        >
          {isCopied ? '✓' : '📋'}
        </button>
      </div>
    </div>
  );
}

const empStyles = {
  successBanner: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    background: 'linear-gradient(135deg, #dcfce7, #f0fdf4)',
    border: '1px solid #86efac', borderRadius: 10,
    padding: '14px 18px', marginBottom: 20
  },
  successTitle: { fontWeight: 700, fontSize: 16, color: '#15803d' },
  successSub:   { fontSize: 13, color: '#166534', marginTop: 2 },
  credCard: {
    border: '1.5px solid #c7d2fe', borderRadius: 12,
    overflow: 'hidden', marginBottom: 8
  },
  credHeader: {
    background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
    color: '#fff', padding: '10px 16px',
    fontWeight: 700, fontSize: 15
  },
  credBody:  { padding: '14px 16px' },
  credNote: {
    background: '#fefce8', borderTop: '1px solid #fde047',
    color: '#92400e', fontSize: 12, padding: '8px 16px'
  },
  errorBanner: {
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', borderRadius: 8,
    padding: '10px 14px', marginBottom: 14, fontSize: 13
  }
};
