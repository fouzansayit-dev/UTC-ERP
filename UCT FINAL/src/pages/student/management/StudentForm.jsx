import React, { useState } from 'react';
import '../Student.css';

/* ── Static option lists ── */
const COURSES        = ['MBBS', 'BDS', 'MD', 'MS', 'Diploma'];
const SESSIONS       = ['2023-2024','2024-2025','2025-2026','2026-2027'];
const YEARS_SEM      = ['I-Year','II-Year','III-Year','IV-Year','V-Year','VI-Year','I-SEM','II-SEM','III-SEM','IV-SEM','V-SEM','VI-SEM','VII-SEM','VIII-SEM'];
const COUNTRIES      = ['Russia','China','Philippines','Kazakhstan','Ukraine','Kyrgyzstan','Bangladesh','Nepal','Georgia','Armenia'];
const VISA_TYPES     = ['Student Visa','Medical Visa','Tourist Visa','Work Permit'];
const GENDERS        = ['Male','Female','Other'];
const BLOOD_GROUPS   = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const RELIGIONS      = ['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Other'];
const OCCUPATIONS    = ['Business','Service','Farmer','Doctor','Engineer','Lawyer','Teacher','Other'];
const MARRIED_STATUS = ['Single','Married','Divorced','Widowed'];
const MEDIUM_LIST    = ['ENGLISH','HINDI','GUJARATI','MARATHI','TAMIL','TELUGU','KANNADA','OTHER'];
const MOTHER_TONGUE  = ['Hindi','English','Tamil','Telugu','Kannada','Malayalam','Marathi','Gujarati','Bengali','Punjabi','Other'];
const MINORITY_LIST  = ['Yes','No'];
const DISABILITY_LIST= ['None','Visual','Hearing','Physical','Mental','Other'];
const BANK_NAMES     = ['SBI','HDFC','ICICI','PNB','Bank of Baroda','Canara Bank','Union Bank','Other'];
const SCHOLARSHIP_LIST=['CENTRAL GOVT','STATE GOVT','OTHER','NIL'];
const DOMICILE_LIST  = ['Yes','No'];
const CASTE_LIST     = ['SC','ST','OBC','General','EWS'];

const DOCUMENTS = [
  '10th Mark Sheet','12th Marksheet','Graduation','Aadhar Card','Trans. Certificat',
  'Migration','Caste Certificate','Domicile Certificate','Gap Certificate',
  'Income Certificate','Red Background photo','Passport (Front & Back color)',
  'Medical Fitness Certificate','PCC','NEET Admit Card','NEET Score Card','NOA'
];
const QUALIFICATIONS = ['10th','12th','Diploma','Graduation','Post Graduation'];
const BOARDS = ['-','CBSE','ICSE','State Board','IGNOU','Rajasthan','MP Board','Other'];

const FormContext = React.createContext();

const F = ({ label, name, type = 'text', required, span2 }) => {
  const { form, set, readOnly } = React.useContext(FormContext);
  return (
    <div className="stu-field" style={span2 ? { gridColumn: 'span 2' } : {}}>
      <label>{label}{required && <span style={{ color: '#dc2626' }}> *</span>}</label>
      <input type={type} value={form[name] || ''} onChange={set(name)} readOnly={readOnly} />
    </div>
  );
};

const S = ({ label, name, options, required, span2 }) => {
  const { form, set, readOnly } = React.useContext(FormContext);
  return (
    <div className="stu-field" style={span2 ? { gridColumn: 'span 2' } : {}}>
      <label>{label}{required && <span style={{ color: '#dc2626' }}> *</span>}</label>
      <select value={form[name] || ''} onChange={set(name)} disabled={readOnly}>
        <option value="">-- Select --</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
};

export default function StudentForm({ initialData = {}, onSubmit, submitLabel = 'Submit', readOnly = false }) {
  const [form, setForm] = useState({
    /* Admission Details */
    schemesCategory:    '',
    schemes:            '',
    course:             '',
    branchName:         '',
    batch:              '',
    currentYearSem:     'I-Year',
    applicationId:      '',
    admissionYearSem:   '',
    university:         '',
    rfidUid:            '',
    admissionDate:      new Date().toISOString().split('T')[0],
    scholarNo:          '',
    medium:             'ENGLISH',
    aadharCardNo:       '',
    samagraId:          '',
    motherTongue:       '',
    abcId:              '',
    apaarId:            '',
    neetWritten:        '',
    neetResultYear:     '',
    neetScore:          '',
    community:          '',
    password:           '',
    passportNumber:     '',
    rollNo:             '',
    enrollmentNo:       '',
    /* Personal Details */
    name:               '',
    surname:            '',
    nameInHindi:        '',
    studentMobNo:       '',
    email:              '',
    fathersName:        '',
    fathersMobNo:       '',
    mothersName:        '',
    mothersMobNo:       '',
    fathersOccupation:  '',
    mothersOccupation:  '',
    gender:             '',
    marriedStatus:      '',
    bloodGroup:         '',
    disability:         'None',
    minority:           '',
    religion:           '',
    photo:              null,
    /* Guardian Details */
    guardianName:       '',
    guardianRelation:   '',
    guardianMobile:     '',
    guardianOccupation: '',
    /* Local Address */
    localLine1:         '',
    localCity:          '',
    localDistrict:      '',
    /* Permanent Address */
    permLine1:          '',
    permCity:           '',
    permDistrict:       '',
    permState:          '',
    permPhone:          '',
    /* Place of Birth */
    dob:                '',
    birthCity:          '',
    birthState:         '',
    /* Academic Qualifications — stored as array */
    qualifications:     QUALIFICATIONS.map(q => ({ qual: q, course: '', board: '-', rollNo: '', seatNo: '', institute: '', place: '', year: '', obtMarks: '', maxMarks: '' })),
    /* TC Details */
    prevInstituteName:  '',
    passoutClass:       '',
    tcNo:               '',
    tcIssueDate:        '',
    /* Scholarship */
    category:           '',
    caste:              '',
    annualIncome:       '',
    domicileMP:         '',
    scholarshipStatus:  '',
    scholarship:        '',
    schApplId:          '',
    bankNameIndia:      '',
    ifscCode:           '',
    bankAccountIndia:   '',
    branchNameIndia:    '',
    bankNameTimor:      '',
    bankAccountMandri:  '',
    ibanNumber:         '',
    extraActivity:      '',
    referenceBy:        '',
    consultant:         '',
    consultantFee:      '',
    /* Documents */
    documents:          DOCUMENTS.map(d => ({ title: d, file: null, status: 'NA' })),
    /* Programme Type */
    programmeType:      'domestic',
    /* Abroad fields */
    universityName:     '',
    country:            '',
    campusCity:         '',
    abroadYear:         'I-Year',
    agentId:            '',
    agentName:          '',
    passportNo:         '',
    passportIssue:      '',
    passportExpiry:     '',
    issuingAuthority:   '',
    visaType:           'Student Visa',
    visaNumber:         '',
    visaCountry:        '',
    visaIssue:          '',
    visaExpiry:         '',
    flightDate:         '',
    airline:            '',
    pnrNumber:          '',
    departureDate:      '',
    emergencyContactName:'',
    emergencyPhone:     '',
    emergencyAddress:   '',
    insurancePolicy:    '',
    insuranceProvider:  '',
    insuranceValidity:  '',
    nmcRegNumber:       '',
    nmcDate:            '',
    ...initialData,
  });

  const set    = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const setQ   = (i, col) => (e) => setForm((p) => {
    const q = [...p.qualifications];
    q[i] = { ...q[i], [col]: e.target.value };
    return { ...p, qualifications: q };
  });
  const setDoc = (i, col) => (e) => setForm((p) => {
    const d = [...p.documents];
    d[i] = { ...d[i], [col]: col === 'file' ? e.target.files[0] : e.target.value };
    return { ...p, documents: d };
  });

  const isAbroad = form.programmeType === 'abroad';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  /* Split documents into two columns */
  const docLeft  = form.documents.slice(0, 9);
  const docRight = form.documents.slice(9);

  return (
    <FormContext.Provider value={{ form, set, readOnly }}>
    <form onSubmit={handleSubmit}>

      {/* ══ ADMISSION DETAILS ══ */}
      <div className="stu-section-banner">Admission Details</div>
      <div className="stu-form-grid">
        <S label="Schemes Category" name="schemesCategory" options={['REGULAR','NRI','MANAGEMENT','GOVT']} required />
        <S label="Schemes"          name="schemes"          options={['FACULTY OF MEDICINE-MBBS2025-1','FACULTY OF MEDICINE-MBBS2024-1']} required />
        <S label="Course"           name="course"           options={COURSES} required />
        <S label="Branch Name"      name="branchName"       options={['MEDICINE','SURGERY','PAEDIATRICS','GYNAECOLOGY']} required />
        <S label="Batch"            name="batch"            options={['2024-2030','2025-2031','2023-2029']} required />
        <S label="Current Year/Semester" name="currentYearSem" options={YEARS_SEM} />
        <F label="Application Id"       name="applicationId" />
        <S label="Admission Year/Semester" name="admissionYearSem" options={YEARS_SEM} />
        <S label="University"           name="university"    options={['UNIVERSIDADE CATOLICA TIMORENSE','SAMPLE UNIVERSITY 2']} />
        <F label="RFID(UID)"            name="rfidUid" required />
        <F label="Admission Date"       name="admissionDate" type="date" />
        <F label="Scholar No"           name="scholarNo" />
        <S label="Medium"               name="medium"        options={MEDIUM_LIST} />
        <F label="Aadhar Card No"       name="aadharCardNo" />
        <F label="Samagra ID"           name="samagraId" />
        <S label="Mother Tongue"        name="motherTongue"  options={MOTHER_TONGUE} />
        <F label="ABC ID"               name="abcId" />
        <F label="APAAR ID"             name="apaarId" />
        <S label="Have you written NEET?" name="neetWritten" options={['Yes','No']} />
        <F label="If yes, NEET Result Year" name="neetResultYear" />
        <F label="NEET Score"           name="neetScore" />
        <F label="Community"            name="community" />
        <F label="Password"             name="password"      type="password" />
        <F label="PASSPORT NUMBER"      name="passportNumber" />
        <F label="Roll No"              name="rollNo" />
        <F label="Enrollment No"        name="enrollmentNo" />
      </div>

      {/* ══ PERSONAL DETAILS ══ */}
      <div className="stu-section-banner">Personal Details</div>
      <div className="stu-form-grid">
        <F label="Name" name="name" required />
        <F label="SURNAME" name="surname" />
        <F label="Name in Hindi" name="nameInHindi" />
        <F label="Student Mob No" name="studentMobNo" />
        <F label="Email" name="email" type="email" />
        <F label="Father's Name" name="fathersName" />
        <F label="Mother's Name" name="mothersName" />
        <F label="Father's Mob No" name="fathersMobNo" />
        <F label="Mother's Mob No" name="mothersMobNo" />
        <S label="Father's Occupation" name="fathersOccupation" options={OCCUPATIONS} />
        <S label="Mother's Occupation" name="mothersOccupation" options={OCCUPATIONS} />
        <S label="Gender" name="gender" options={GENDERS} />
        <S label="Blood Group" name="bloodGroup" options={BLOOD_GROUPS} />
        <S label="Married Status" name="marriedStatus" options={MARRIED_STATUS} />
        <S label="Disability" name="disability" options={DISABILITY_LIST} />
        <S label="Minority" name="minority" options={MINORITY_LIST} />
        <S label="Religion" name="religion" options={RELIGIONS} />
        <div className="stu-field">
          <label>Upload Photo</label>
          {form.photo && <img src={typeof form.photo === 'string' ? form.photo : URL.createObjectURL(form.photo)} alt="Student" style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #d1d5db', borderRadius: 4, marginBottom: 6 }} />}
          <input type="file" accept="image/*" onChange={(e) => setForm(p => ({ ...p, photo: e.target.files[0] }))} disabled={readOnly} />
        </div>
      </div>

      {/* ══ GUARDIAN DETAILS ══ */}
      <div className="stu-section-banner">Guardian Details</div>
      <div className="stu-form-grid">
        <F label="Guardian Name"     name="guardianName" />
        <F label="Guardian Relation" name="guardianRelation" />
        <F label="Mobile No"         name="guardianMobile" />
        <S label="Occupation"        name="guardianOccupation" options={OCCUPATIONS} />
      </div>

      {/* ── Local Address ── */}
      <div style={{ padding: '10px 0 4px', fontSize: 13, fontWeight: 700, color: '#4361ee' }}>Local Address</div>
      <div className="stu-form-grid">
        <F label="Line 1" name="localLine1" />
        <F label="City"   name="localCity" />
        <S label="District" name="localDistrict" options={['AGAR-MALWA','BHOPAL','INDORE','JABALPUR','GWALIOR','UJJAIN','REWA','SAGAR','Other']} />
      </div>

      {/* ── Permanent Address ── */}
      <div style={{ padding: '10px 0 4px', fontSize: 13, fontWeight: 700, color: '#4361ee' }}>Permanent Address</div>
      <div className="stu-form-grid">
        <F label="Line 1"   name="permLine1" />
        <F label="City"     name="permCity" />
        <S label="District" name="permDistrict" options={['AGAR-MALWA','BHOPAL','INDORE','JABALPUR','GWALIOR','UJJAIN','REWA','SAGAR','Other']} />
        <F label="12th Subject" name="permState" />
        <F label="Phone"    name="permPhone" />
      </div>

      {/* ══ STUDENT PLACE OF BIRTH ══ */}
      <div className="stu-section-banner">Student Place of Birth</div>
      <div className="stu-form-grid">
        <F label="DOB"   name="dob"       type="date" />
        <F label="City"  name="birthCity" />
        <S label="State" name="birthState" options={['NA','Madhya Pradesh','Rajasthan','Maharashtra','Gujarat','Uttar Pradesh','Bihar','West Bengal','Karnataka','Tamil Nadu','Other']} />
      </div>

      {/* ══ ACADEMIC QUALIFICATION ══ */}
      <div className="stu-section-banner">Academic Qualification</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 900 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              {['Qualification','Course','Board/University','Roll No','Seat No','Institute','Place','Year','Obt Marks','Max.'].map(h => (
                <th key={h} style={{ padding: '8px 8px', border: '1px solid #e5e7eb', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.qualifications.map((q, i) => (
              <tr key={q.qual}>
                <td style={{ padding: '6px 8px', border: '1px solid #e5e7eb', fontWeight: 600, color: '#374151', background: '#fafafa' }}>{q.qual}</td>
                {['course','board','rollNo','seatNo','institute','place','year','obtMarks','maxMarks'].map((col) => (
                  <td key={col} style={{ padding: '4px 6px', border: '1px solid #e5e7eb' }}>
                    {col === 'board' ? (
                      <select value={q[col]} onChange={setQ(i, col)} disabled={readOnly}
                        style={{ fontSize: 12, border: '1px solid #d1d5db', borderRadius: 4, padding: '3px 4px', width: '100%' }}>
                        {BOARDS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    ) : (
                      <input type="text" value={q[col]} onChange={setQ(i, col)} readOnly={readOnly}
                        style={{ fontSize: 12, border: '1px solid #d1d5db', borderRadius: 4, padding: '3px 6px', width: '100%' }} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══ TC DETAILS ══ */}
      <div className="stu-section-banner">TC Details</div>
      <div className="stu-form-grid">
        <F label="Previous Institute Name" name="prevInstituteName" />
        <F label="Passout Class"           name="passoutClass" />
        <F label="TC. No"                  name="tcNo" />
        <F label="TC. Issue Date"          name="tcIssueDate" type="date" />
      </div>

      {/* ══ SCHOLARSHIP ══ */}
      <div className="stu-section-banner">Scholarship</div>
      <div className="stu-form-grid">
        <S label="Category"          name="category"         options={CASTE_LIST} />
        <S label="Caste"             name="caste"            options={['AGARWAL','BRAHMIN','YADAV','KURMI','JATAV','Other']} />
        <F label="Annual Income"     name="annualIncome" />
        <S label="Domicile MP"       name="domicileMP"       options={DOMICILE_LIST} />
        <S label="Scholarship Status" name="scholarshipStatus" options={['Yes','No']} />
        <S label="Scholarship"       name="scholarship"      options={SCHOLARSHIP_LIST} />
        <F label="Sch Appl. Id"      name="schApplId" />
        <S label="Bank Name (India)" name="bankNameIndia"    options={BANK_NAMES} />
        <F label="IFSC CODE (INDIA)" name="ifscCode" />
        <F label="BANK ACCOUNT NUMBER (INDIA)" name="bankAccountIndia" />
        <F label="BRANCH NAME (INDIA)"         name="branchNameIndia" />
        <F label="BANK NAME (TIMOR - LESTE)"   name="bankNameTimor" />
        <F label="BANK ACCOUNT NUMBER (MANDRI BANK)" name="bankAccountMandri" span2 />
        <F label="I BAN NUMBER (BANK)"         name="ibanNumber" span2 />
        <div className="stu-field" style={{ gridColumn: 'span 2' }}>
          <label>Extra Activity Details</label>
          <textarea value={form.extraActivity} onChange={set('extraActivity')} readOnly={readOnly} rows={2} />
        </div>
        <div className="stu-field" style={{ gridColumn: 'span 2' }}>
          <label>Reference By</label>
          <textarea value={form.referenceBy} onChange={set('referenceBy')} readOnly={readOnly} rows={2} />
        </div>
        <S label="Consultant"    name="consultant"    options={['Select','CONSULTANT A','CONSULTANT B']} />
        <F label="Consultant Fee" name="consultantFee" />
      </div>

      {/* ══ DOCUMENT DETAILS ══ */}
      <div className="stu-section-banner">Document Details</div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {/* Left table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={docTh}>S.No.</th>
                <th style={docTh}>Title</th>
                <th style={docTh}>Documents</th>
                <th style={docTh}>Status</th>
              </tr>
            </thead>
            <tbody>
              {docLeft.map((doc, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={docTd}>{i + 1}</td>
                  <td style={docTd}>{doc.title}</td>
                  <td style={docTd}>
                    <input type="file" onChange={setDoc(i, 'file')} disabled={readOnly}
                      style={{ fontSize: 12 }} />
                  </td>
                  <td style={docTd}>
                    <select value={doc.status} onChange={setDoc(i, 'status')} disabled={readOnly}
                      style={{ fontSize: 12, border: '1px solid #d1d5db', borderRadius: 4, padding: '2px 4px' }}>
                      <option>NA</option><option>Uploaded</option><option>Verified</option><option>Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Right table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, borderLeft: '1px solid #e5e7eb' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={docTh}>S.No.</th>
                <th style={docTh}>Title</th>
                <th style={docTh}>Documents</th>
                <th style={docTh}>Status</th>
              </tr>
            </thead>
            <tbody>
              {docRight.map((doc, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={docTd}>{i + 10}</td>
                  <td style={docTd}>{doc.title}</td>
                  <td style={docTd}>
                    <input type="file" onChange={setDoc(i + 9, 'file')} disabled={readOnly}
                      style={{ fontSize: 12 }} />
                  </td>
                  <td style={docTd}>
                    <select value={doc.status} onChange={setDoc(i + 9, 'status')} disabled={readOnly}
                      style={{ fontSize: 12, border: '1px solid #d1d5db', borderRadius: 4, padding: '2px 4px' }}>
                      <option>NA</option><option>Uploaded</option><option>Verified</option><option>Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ ABROAD MBBS EXTRA FIELDS ══ */}
      <div className="stu-section-banner" style={{ marginTop: 20 }}>Programme Type</div>
      <div className="stu-form-grid">
        <div className="stu-field">
          <label>Programme Type <span style={{ color: '#dc2626' }}>*</span></label>
          <select value={form.programmeType} onChange={set('programmeType')} disabled={readOnly}>
            <option value="domestic">Domestic MBBS</option>
            <option value="abroad">Abroad MBBS</option>
          </select>
        </div>
      </div>

      {isAbroad && (
        <div className="stu-abroad-block">
          <div className="stu-section-banner" style={{ marginTop: 0 }}>Abroad University Details</div>
          <div className="stu-form-grid" style={{ marginBottom: 16 }}>
            <div className="stu-field"><label>University Name <span style={{ color: '#dc2626' }}>*</span></label><input value={form.universityName} onChange={set('universityName')} readOnly={readOnly} /></div>
            <div className="stu-field"><label>Country <span style={{ color: '#dc2626' }}>*</span></label>
              <select value={form.country} onChange={set('country')} disabled={readOnly}>
                <option value="">-- Select --</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="stu-field"><label>Campus City</label><input value={form.campusCity} onChange={set('campusCity')} readOnly={readOnly} /></div>
            <div className="stu-field"><label>Year Abroad (1–6)</label>
              <select value={form.abroadYear} onChange={set('abroadYear')} disabled={readOnly}>
                {YEARS_SEM.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="stu-field"><label>Agent ID</label><input value={form.agentId} onChange={set('agentId')} readOnly={readOnly} /></div>
            <div className="stu-field"><label>Agent Name</label><input value={form.agentName} onChange={set('agentName')} readOnly={readOnly} /></div>
          </div>
          <div className="stu-subsection">
            <div className="stu-subsection-title">Passport Details</div>
            <div className="stu-form-grid">
              <div className="stu-field"><label>Passport Number</label><input value={form.passportNo} onChange={set('passportNo')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Passport Issue Date</label><input type="date" value={form.passportIssue} onChange={set('passportIssue')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Passport Expiry Date</label><input type="date" value={form.passportExpiry} onChange={set('passportExpiry')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Issuing Authority</label><input value={form.issuingAuthority} onChange={set('issuingAuthority')} readOnly={readOnly} /></div>
            </div>
          </div>
          <div className="stu-subsection">
            <div className="stu-subsection-title">Visa Details</div>
            <div className="stu-form-grid">
              <div className="stu-field"><label>Visa Type</label>
                <select value={form.visaType} onChange={set('visaType')} disabled={readOnly}>
                  {VISA_TYPES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="stu-field"><label>Visa Number</label><input value={form.visaNumber} onChange={set('visaNumber')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Visa Country</label>
                <select value={form.visaCountry} onChange={set('visaCountry')} disabled={readOnly}>
                  <option value="">-- Select --</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="stu-field"><label>Visa Issue Date</label><input type="date" value={form.visaIssue} onChange={set('visaIssue')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Visa Expiry Date</label><input type="date" value={form.visaExpiry} onChange={set('visaExpiry')} readOnly={readOnly} /></div>
            </div>
          </div>
          <div className="stu-subsection">
            <div className="stu-subsection-title">Departure Details</div>
            <div className="stu-form-grid">
              <div className="stu-field"><label>Flight Date</label><input type="date" value={form.flightDate} onChange={set('flightDate')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Airline</label><input value={form.airline} onChange={set('airline')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>PNR Number</label><input value={form.pnrNumber} onChange={set('pnrNumber')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Actual Departure Date</label><input type="date" value={form.departureDate} onChange={set('departureDate')} readOnly={readOnly} /></div>
            </div>
          </div>
          <div className="stu-subsection">
            <div className="stu-subsection-title">Emergency Contact Abroad</div>
            <div className="stu-form-grid">
              <div className="stu-field"><label>Contact Name</label><input value={form.emergencyContactName} onChange={set('emergencyContactName')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Phone</label><input value={form.emergencyPhone} onChange={set('emergencyPhone')} readOnly={readOnly} /></div>
              <div className="stu-field" style={{ gridColumn: 'span 2' }}><label>Address</label><input value={form.emergencyAddress} onChange={set('emergencyAddress')} readOnly={readOnly} /></div>
            </div>
          </div>
          <div className="stu-subsection">
            <div className="stu-subsection-title">Insurance Details</div>
            <div className="stu-form-grid">
              <div className="stu-field"><label>Policy Number</label><input value={form.insurancePolicy} onChange={set('insurancePolicy')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Provider</label><input value={form.insuranceProvider} onChange={set('insuranceProvider')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>Validity</label><input type="date" value={form.insuranceValidity} onChange={set('insuranceValidity')} readOnly={readOnly} /></div>
            </div>
          </div>
          <div className="stu-subsection">
            <div className="stu-subsection-title">NMC Registration (on Return)</div>
            <div className="stu-form-grid">
              <div className="stu-field"><label>NMC Registration Number</label><input value={form.nmcRegNumber} onChange={set('nmcRegNumber')} readOnly={readOnly} /></div>
              <div className="stu-field"><label>NMC Registration Date</label><input type="date" value={form.nmcDate} onChange={set('nmcDate')} readOnly={readOnly} /></div>
            </div>
          </div>
        </div>
      )}

      {!readOnly && (
        <div className="stu-btn-row" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
          <button type="submit" className="stu-btn stu-btn-primary">{submitLabel}</button>
          <button type="reset" className="stu-btn stu-btn-secondary">Reset</button>
        </div>
      )}
    </form>
    </FormContext.Provider>
  );
}

const docTh = { padding: '7px 8px', border: '1px solid #e5e7eb', fontWeight: 600, color: '#374151', background: '#f1f5f9', fontSize: 12, whiteSpace: 'nowrap' };
const docTd = { padding: '6px 8px', border: '1px solid #e5e7eb', fontSize: 12, color: '#374151', verticalAlign: 'middle' };
