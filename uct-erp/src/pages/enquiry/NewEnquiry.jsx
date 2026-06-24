import React, { useState } from 'react';
import './Enquiry.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;

const FormField = ({ label, required, children }) => (
  <div className="form-field">
    <label className="form-label">
      {label}{required && <span className="req"> *</span>}
    </label>
    {children}
  </div>
);

const Input = (props) => <input className="form-input" {...props} />;
const Select = ({ children, ...props }) => (
  <select className="form-input" {...props}>{children}</select>
);
const Textarea = (props) => (
  <textarea className="form-input form-textarea" {...props} />
);

const INIT = {
  enquiryId: '', enquiryDate: '', studentName: '', fatherName: '',
  mobile: '', altMobile: '', email: '', address: '', city: '',
  qualification: '', board: '', marksPercent: '', neetScore: '',
  courseInterested: '', programType: '', countryPreference: '', passportStatus: '',
  source: '', agentId: '', counselor: '', remarks: '',
};

export default function NewEnquiry() {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.studentName.trim())  e.studentName = 'Student name is required';
    if (!form.mobile.trim())       e.mobile = 'Mobile number is required';
    if (form.mobile && !/^\d{10}$/.test(form.mobile))
      e.mobile = 'Enter a valid 10-digit mobile number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!form.courseInterested)    e.courseInterested = 'Course is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    
    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        status: 'pending',
        pending_followup: form.remarks
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save enquiry');
        alert(`Enquiry saved successfully! Assigned ID: ${data.id}`);
        handleReset();
      })
      .catch(err => {
        alert(err.message);
      });
  };

  const handleReset = () => { setForm(INIT); setErrors({}); };

  return (
    <form className="hr-form" onSubmit={handleSubmit} noValidate>

      {/* ── BASIC INFORMATION ── */}
      <SectionTitle title="Basic Information" />
      <div className="form-grid">
        <FormField label="Enquiry ID">
          <Input
            value={form.enquiryId}
            onChange={set('enquiryId')}
            placeholder="Auto-generated on save"
            disabled
          />
        </FormField>
        <FormField label="Enquiry Date">
          <Input type="date" value={form.enquiryDate} onChange={set('enquiryDate')} />
        </FormField>
        <FormField label="Student Name" required>
          <Input value={form.studentName} onChange={set('studentName')} placeholder="Enter student name" />
          {errors.studentName && <span className="err-msg">{errors.studentName}</span>}
        </FormField>
        <FormField label="Father / Guardian Name">
          <Input value={form.fatherName} onChange={set('fatherName')} placeholder="Enter father or guardian name" />
        </FormField>
      </div>

      {/* ── CONTACT INFORMATION ── */}
      <SectionTitle title="Contact Information" />
      <div className="form-grid">
        <FormField label="Mobile Number" required>
          <Input
            type="tel" value={form.mobile} onChange={set('mobile')}
            placeholder="10-digit mobile number" maxLength={10}
          />
          {errors.mobile && <span className="err-msg">{errors.mobile}</span>}
        </FormField>
        <FormField label="Alternate Mobile Number">
          <Input
            type="tel" value={form.altMobile} onChange={set('altMobile')}
            placeholder="Alternate mobile number" maxLength={10}
          />
        </FormField>
        <FormField label="Email Address">
          <Input
            type="email" value={form.email} onChange={set('email')}
            placeholder="Enter email address"
          />
          {errors.email && <span className="err-msg">{errors.email}</span>}
        </FormField>
        <FormField label="Address">
          <Textarea value={form.address} onChange={set('address')} placeholder="Enter full address" rows={2} />
        </FormField>
        <FormField label="City">
          <Input value={form.city} onChange={set('city')} placeholder="Enter city" />
        </FormField>
      </div>

      {/* ── ACADEMIC INFORMATION ── */}
      <SectionTitle title="Academic Information" />
      <div className="form-grid">
        <FormField label="Qualification">
          <Select value={form.qualification} onChange={set('qualification')}>
            <option value="">-- Select Qualification --</option>
            <option>10th</option>
            <option>12th (PCB)</option>
            <option>12th (Other)</option>
            <option>Graduate</option>
            <option>Post Graduate</option>
          </Select>
        </FormField>
        <FormField label="Board / University">
          <Select value={form.board} onChange={set('board')}>
            <option value="">-- Select Board --</option>
            <option>CBSE</option>
            <option>ICSE</option>
            <option>State Board</option>
            <option>Other</option>
          </Select>
        </FormField>
        <FormField label="Marks Percentage">
          <Input
            type="number" min="0" max="100" step="0.01"
            value={form.marksPercent} onChange={set('marksPercent')}
            placeholder="e.g. 85.50"
          />
        </FormField>
        <FormField label="NEET Score">
          <Input
            type="number" min="0" max="720"
            value={form.neetScore} onChange={set('neetScore')}
            placeholder="Score out of 720"
          />
        </FormField>
      </div>

      {/* ── COURSE INTEREST ── */}
      <SectionTitle title="Course Interest" />
      <div className="form-grid">
        <FormField label="Course Interested" required>
          <Select value={form.courseInterested} onChange={set('courseInterested')}>
            <option value="">-- Select Course --</option>
            <option>MBBS - Domestic</option>
            <option>MBBS - Abroad</option>
            <option>MD</option>
            <option>MS</option>
            <option>BDS</option>
            <option>BAMS</option>
            <option>BHMS</option>
          </Select>
          {errors.courseInterested && <span className="err-msg">{errors.courseInterested}</span>}
        </FormField>
        <FormField label="Program Type">
          <Select value={form.programType} onChange={set('programType')}>
            <option value="">-- Select Program Type --</option>
            <option>Domestic</option>
            <option>Abroad</option>
          </Select>
        </FormField>
        <FormField label="Country Preference">
          <Select value={form.countryPreference} onChange={set('countryPreference')}>
            <option value="">-- Select Country --</option>
            <option>India</option>
            <option>Russia</option>
            <option>Ukraine</option>
            <option>Kazakhstan</option>
            <option>Philippines</option>
            <option>Georgia</option>
            <option>Bangladesh</option>
            <option>Nepal</option>
            <option>China</option>
            <option>Other</option>
          </Select>
        </FormField>
        <FormField label="Passport Status">
          <Select value={form.passportStatus} onChange={set('passportStatus')}>
            <option value="">-- Select Status --</option>
            <option>Available</option>
            <option>Not Available</option>
            <option>In Process</option>
          </Select>
        </FormField>
      </div>

      {/* ── COUNSELOR & SOURCE ── */}
      <SectionTitle title="Counselor &amp; Source" />
      <div className="form-grid">
        <FormField label="Source of Enquiry">
          <Select value={form.source} onChange={set('source')}>
            <option value="">-- Select Source --</option>
            <option>Walk-in</option>
            <option>Phone</option>
            <option>Website</option>
            <option>Agent Referral</option>
            <option>Education Camp</option>
            <option>Social Media</option>
            <option>Other</option>
          </Select>
        </FormField>
        <FormField label="Agent ID">
          <Input value={form.agentId} onChange={set('agentId')} placeholder="Enter agent ID (if referred)" />
        </FormField>
        <FormField label="Assigned Counselor">
          <Select value={form.counselor} onChange={set('counselor')}>
            <option value="">-- Select Counselor --</option>
            <option>Counselor 1</option>
            <option>Counselor 2</option>
            <option>Counselor 3</option>
          </Select>
        </FormField>
        <FormField label="Remarks">
          <Textarea value={form.remarks} onChange={set('remarks')} placeholder="Enter any remarks or notes" rows={3} />
        </FormField>
      </div>

      <div className="enq-btn-group">
        <button type="submit" className="btn-primary">Save</button>
        <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
        <button type="button" className="btn-danger" onClick={handleReset}>Cancel</button>
      </div>

    </form>
  );
}
