import React, { useState } from 'react';

export default function SettingConfig({ onBack }) {
  const [logoPreview, setLogoPreview] = useState(null);
  const [form, setForm] = useState({
    collegeName: 'UNIVERSIDADE CATOLICA TIMORENSE',
    address: 'DILI, TIMOR LESTE',
    appShortUrl: '',
    phonepayMerchantId: '',
    phonepayBankName: '',
    paytmBankName: '',
    paytmApi: '',
    paymentGateway: 'NO',
    credential: '',
    payuDefault: '{"MERCHANT_KEY":"1","SALT":"2"}',
    atomDefault: '{"setLogin":"1","setPassword":"2","setClientCode":"3","setProductId":"3","setReqHashKey":"4","setRequestEncry',
    ccavenueDefault: '{"merchant_id":"1","working_key":"2","access_code":"2"}',
    smsApiBalance: '#',
    smsApi: '#',
    smsApiUnicode: '#',
    whatsappApiKey: '#',
    pfDeduction: '#',
    esicPer: '#',
    dashboardStudentCount: 'Session_Wise',
    majorMinorSubject: 'Y',
    studentDeleteStatus: 'Y',
    receiptApplicationIdDisplay: 'Y',
    receiptDiscountDisplay: 'Y',
    previousPaidDisplay: 'Y',
    otherFeeBulk1: '',
    otherFeeBulk2: '',
    otherFeeBulk3: '',
    otherFeeBulk4: '',
    enquiryPaymentHead: 'Construction',
    enquiryPaymentSubhead: '',
    enquiryRegistrationAmount: '0',
    advanceSalaryHead: 'Construction',
    advanceSalarySubhead: '',
    salaryHead: 'Construction',
    salarySubhead: '',
    feeReceiptBackDateEntry: 'Y',
    feeReceiptTermCondition: '#',
    feeReceiptCopy: 'Parent_Copy_Office_Copy',
    upiId: '',
    feeGrid: 'Session',
    feeReceiptSms: 'NA',
    studentMasterSms: 'NA',
    enquiryMasterSms: 'NA',
    attendanceSms: 'NA',
  });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => alert('Settings saved successfully.');

  const labelStyle = { display: 'block', minWidth: 220, fontSize: 13, color: '#374151', fontWeight: 500, paddingTop: 6 };
  const inputStyle = { width: '100%', padding: '6px 10px', fontSize: 13, border: '1px solid #d1d5db', borderRadius: 4, outline: 'none' };
  const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: 60 };
  const selectStyle = { ...inputStyle };
  const rowStyle = { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 };
  const fieldWrap = { flex: 1, maxWidth: 440 };

  const Row = ({ label, children, highlight }) => (
    <div style={rowStyle}>
      <span style={{ ...labelStyle, color: highlight ? '#2563eb' : '#374151' }}>{label}</span>
      <div style={fieldWrap}>{children}</div>
    </div>
  );

  const SectionBtn = ({ label }) => (
    <div style={{ margin: '20px 0 12px' }}>
      <span style={{ background: '#92400e', color: '#fff', padding: '5px 14px', borderRadius: 4, fontSize: 13, fontWeight: 600 }}>{label}</span>
    </div>
  );

  return (
    <div className="hr-form">
      <div className="section-title">Setting</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '28px 32px', maxWidth: 900 }}>

        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
          <span style={labelStyle}>LOGO</span>
          <div style={{ flex: 1 }}>
            <input type="file" accept="image/*" onChange={handleLogo}
              style={{ fontSize: 13, border: '1px solid #d1d5db', borderRadius: 4, padding: '4px 8px' }} />
          </div>
          {logoPreview && (
            <img src={logoPreview} alt="Logo Preview"
              style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: '50%', border: '1px solid #e2e8f0' }} />
          )}
        </div>

        {/* College Name */}
        <Row label="College Name">
          <input style={inputStyle} value={form.collegeName} onChange={set('collegeName')} />
        </Row>

        {/* Address */}
        <Row label="Address">
          <textarea style={textareaStyle} value={form.address} onChange={set('address')} />
        </Row>

        {/* APP Short URL */}
        <Row label="APP Short URL">
          <input style={inputStyle} value={form.appShortUrl} onChange={set('appShortUrl')} />
        </Row>

        {/* Phonepay Merchant ID */}
        <Row label="Phonepay Merchent ID">
          <input style={inputStyle} value={form.phonepayMerchantId} onChange={set('phonepayMerchantId')} />
        </Row>

        {/* Phonepay Bank Name */}
        <Row label="Phonepay Bank Name">
          <select style={selectStyle} value={form.phonepayBankName} onChange={set('phonepayBankName')}>
            <option value="">Select</option>
            <option>HDFC</option><option>SBI</option><option>ICICI</option><option>Axis</option>
          </select>
        </Row>

        {/* Paytm Bank Name */}
        <Row label="Paytm Bank Name">
          <select style={selectStyle} value={form.paytmBankName} onChange={set('paytmBankName')}>
            <option value="">Select</option>
            <option>HDFC</option><option>SBI</option><option>ICICI</option><option>Axis</option>
          </select>
        </Row>

        {/* Paytm API */}
        <Row label="Paytm API">
          <textarea style={textareaStyle} value={form.paytmApi} onChange={set('paytmApi')} />
        </Row>

        {/* Payment Gateway */}
        <Row label="Paymeny Gateway">
          <select style={selectStyle} value={form.paymentGateway} onChange={set('paymentGateway')}>
            <option value="NO">NO</option>
            <option value="YES">YES</option>
            <option value="PAYU">PAYU</option>
            <option value="PAYTM">PAYTM</option>
            <option value="ATOM">ATOM</option>
            <option value="CCAVENUE">CCAVENUE</option>
            <option value="PHONEPAY">PHONEPAY</option>
          </select>
        </Row>

        {/* Credential */}
        <Row label="Credential" highlight>
          <textarea style={textareaStyle} value={form.credential} onChange={set('credential')} />
        </Row>

        {/* PAYU Default */}
        <Row label="PAYU/PayWithEasebuzz DEFAULT/Wordline">
          <textarea style={textareaStyle} value={form.payuDefault} onChange={set('payuDefault')} />
        </Row>

        {/* ATOM Default */}
        <Row label="ATOM DEFAULT">
          <textarea style={textareaStyle} value={form.atomDefault} onChange={set('atomDefault')} />
        </Row>

        {/* CCAVENUE Default */}
        <Row label="CCAVENUE DEFAULT">
          <textarea style={textareaStyle} value={form.ccavenueDefault} onChange={set('ccavenueDefault')} />
        </Row>

        {/* SMS Setting Section */}
        <SectionBtn label="SMS Setting" />

        <Row label="SMS API BALANCE">
          <textarea style={textareaStyle} value={form.smsApiBalance} onChange={set('smsApiBalance')} />
        </Row>

        <Row label="SMS API">
          <textarea style={textareaStyle} value={form.smsApi} onChange={set('smsApi')} />
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
            Template Codes: Number {'{number}'} &nbsp; Message {'{message}'} &nbsp; Template {'{tempid}'}
          </div>
        </Row>

        <Row label="SMS API (UNICODE)">
          <textarea style={textareaStyle} value={form.smsApiUnicode} onChange={set('smsApiUnicode')} />
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
            Template Codes: Number {'{number}'} &nbsp; Message {'{message}'} &nbsp; Template {'{tempid}'}
          </div>
        </Row>

        <Row label="Whatsapp(Api Key)">
          <textarea style={textareaStyle} value={form.whatsappApiKey} onChange={set('whatsappApiKey')} />
        </Row>

        <Row label="PF Deduction">
          <input style={inputStyle} value={form.pfDeduction} onChange={set('pfDeduction')} />
        </Row>

        <Row label="ESIC Per">
          <input style={inputStyle} value={form.esicPer} onChange={set('esicPer')} />
        </Row>

        <Row label="Dashbord Student Count">
          <select style={selectStyle} value={form.dashboardStudentCount} onChange={set('dashboardStudentCount')}>
            <option value="Session_Wise">Session_Wise</option>
            <option value="All">All</option>
          </select>
        </Row>

        <Row label="Major/Minor Subject" highlight>
          <select style={selectStyle} value={form.majorMinorSubject} onChange={set('majorMinorSubject')}>
            <option value="Y">Y</option><option value="N">N</option>
          </select>
        </Row>

        <Row label="Student Delete Status" highlight>
          <select style={selectStyle} value={form.studentDeleteStatus} onChange={set('studentDeleteStatus')}>
            <option value="Y">Y</option><option value="N">N</option>
          </select>
        </Row>

        <Row label="Receipt Application Id Display" highlight>
          <select style={selectStyle} value={form.receiptApplicationIdDisplay} onChange={set('receiptApplicationIdDisplay')}>
            <option value="Y">Y</option><option value="N">N</option>
          </select>
        </Row>

        <Row label="Receipt Discount Display" highlight>
          <select style={selectStyle} value={form.receiptDiscountDisplay} onChange={set('receiptDiscountDisplay')}>
            <option value="Y">Y</option><option value="N">N</option>
          </select>
        </Row>

        <Row label="Previous Paid Display" highlight>
          <select style={selectStyle} value={form.previousPaidDisplay} onChange={set('previousPaidDisplay')}>
            <option value="Y">Y</option><option value="N">N</option>
          </select>
        </Row>

        {['otherFeeBulk1','otherFeeBulk2','otherFeeBulk3','otherFeeBulk4'].map((k, i) => (
          <Row key={k} label={`Other Fee Bulk-${i + 1}`}>
            <select style={selectStyle} value={form[k]} onChange={set(k)}>
              <option value=""></option>
              <option>Tuition Fee</option><option>Hostel Fee</option><option>Transport Fee</option><option>Exam Fee</option>
            </select>
          </Row>
        ))}

        <Row label="Enquliy Payment Head" highlight>
          <select style={selectStyle} value={form.enquiryPaymentHead} onChange={set('enquiryPaymentHead')}>
            <option>Construction</option><option>Tuition</option><option>Registration</option>
          </select>
        </Row>

        <Row label="Enquliy Payment Subhead" highlight>
          <select style={selectStyle} value={form.enquiryPaymentSubhead} onChange={set('enquiryPaymentSubhead')}>
            <option value=""></option>
          </select>
        </Row>

        <Row label="Enquliy Registration Amount" highlight>
          <input style={inputStyle} value={form.enquiryRegistrationAmount} onChange={set('enquiryRegistrationAmount')} />
        </Row>

        <Row label="Advance-Salary Head" highlight>
          <select style={selectStyle} value={form.advanceSalaryHead} onChange={set('advanceSalaryHead')}>
            <option>Construction</option><option>Salary</option>
          </select>
        </Row>

        <Row label="Advance-Salary Subhead" highlight>
          <select style={selectStyle} value={form.advanceSalarySubhead} onChange={set('advanceSalarySubhead')}>
            <option value=""></option>
          </select>
        </Row>

        <Row label="Salary Head" highlight>
          <select style={selectStyle} value={form.salaryHead} onChange={set('salaryHead')}>
            <option>Construction</option><option>Salary</option>
          </select>
        </Row>

        <Row label="Salary Subhead" highlight>
          <select style={selectStyle} value={form.salarySubhead} onChange={set('salarySubhead')}>
            <option value=""></option>
          </select>
        </Row>

        <Row label="Fee Receipt Back Date Entry" highlight>
          <select style={selectStyle} value={form.feeReceiptBackDateEntry} onChange={set('feeReceiptBackDateEntry')}>
            <option value="Y">Y</option><option value="N">N</option>
          </select>
        </Row>

        {/* Fee Receipt Term & Condition - rich text placeholder */}
        <Row label="Fee Receipt Term & Condition" highlight>
          <textarea style={{ ...textareaStyle, minHeight: 100 }}
            value={form.feeReceiptTermCondition} onChange={set('feeReceiptTermCondition')} />
        </Row>

        <Row label="Fee Receipt Copy">
          <select style={selectStyle} value={form.feeReceiptCopy} onChange={set('feeReceiptCopy')}>
            <option value="Parent_Copy_Office_Copy">Parent_Copy_Office_Copy</option>
            <option value="Parent_Copy">Parent_Copy</option>
            <option value="Office_Copy">Office_Copy</option>
          </select>
        </Row>

        <Row label="UPI ID(DYNAMIC QR CODE)">
          <input style={inputStyle} value={form.upiId} onChange={set('upiId')} />
        </Row>

        <Row label="Fee Grid">
          <select style={selectStyle} value={form.feeGrid} onChange={set('feeGrid')}>
            <option value="Session">Session</option><option value="All">All</option>
          </select>
        </Row>

        <Row label="Fee Receipt Sms">
          <select style={selectStyle} value={form.feeReceiptSms} onChange={set('feeReceiptSms')}>
            <option value="NA">NA</option><option value="YES">YES</option>
          </select>
        </Row>

        <Row label="Student Master Sms">
          <select style={selectStyle} value={form.studentMasterSms} onChange={set('studentMasterSms')}>
            <option value="NA">NA</option><option value="YES">YES</option>
          </select>
        </Row>

        <Row label="Enquiry Master Sms">
          <select style={selectStyle} value={form.enquiryMasterSms} onChange={set('enquiryMasterSms')}>
            <option value="NA">NA</option><option value="YES">YES</option>
          </select>
        </Row>

        <Row label="Attendance Sms">
          <select style={selectStyle} value={form.attendanceSms} onChange={set('attendanceSms')}>
            <option value="NA">NA</option><option value="YES">YES</option>
          </select>
        </Row>

        <div style={{ marginTop: 24 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>

      </div>
    </div>
  );
}
