import React from 'react';
import '../hr/HRManagement.css';

import CertificateSetting from './submodules/CertificateSetting.jsx';
import CreateCertificate  from './submodules/CreateCertificate.jsx';
import CertificateReport  from './submodules/CertificateReport.jsx';

export const CERTIFICATE_SUBMODULES = [
  { id: 'cert-setting', label: 'Certificate Setting', component: CertificateSetting },
  { id: 'cert-create',  label: 'Create Certificate',  component: CreateCertificate  },
  { id: 'cert-report',  label: 'Certificate Report',  component: CertificateReport  },
];

export default function CertificateManagement({ activeSub, onBack }) {
  const current = CERTIFICATE_SUBMODULES.find((s) => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Certificate</span>
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
      <div className="breadcrumb"><b>Certificate</b></div>
      <div className="page-heading">Certificate</div>
    </div>
  );
}
