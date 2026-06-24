import React from 'react';
import '../hr/HRManagement.css';

import SendSmsEmployee from './submodules/SendSmsEmployee.jsx';
import SendSmsStudent  from './submodules/SendSmsStudent.jsx';
import SendSmsEnquiry  from './submodules/SendSmsEnquiry.jsx';
import SendAppLink     from './submodules/SendAppLink.jsx';

export const SENDSMS_SUBMODULES = [
  { id: 'sms-employee', label: 'Send SMS to Employee', component: SendSmsEmployee },
  { id: 'sms-student',  label: 'Send SMS to Student',  component: SendSmsStudent  },
  { id: 'sms-enquiry',  label: 'Send SMS Enquiry',     component: SendSmsEnquiry  },
  { id: 'sms-applink',  label: 'Send APP Link',        component: SendAppLink     },
];

export default function SendSmsManagement({ activeSub, onBack }) {
  const current = SENDSMS_SUBMODULES.find(s => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Send SMS</span>
          {' › '}
          <b>{current.label}</b>
        </div>
        <div className="page-heading">{current.label}</div>
        <div style={{ marginTop: 24 }}><PageComp /></div>
      </div>
    );
  }

  return (
    <div>
      <div className="breadcrumb"><b>Send SMS</b></div>
      <div className="page-heading">Send SMS</div>
    </div>
  );
}
