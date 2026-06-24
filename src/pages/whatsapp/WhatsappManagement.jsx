import React from 'react';
import '../hr/HRManagement.css';
import WhatsappConfig from './submodules/WhatsappConfig.jsx';

export const WHATSAPP_SUBMODULES = [
  { id: 'wa-config', label: 'WhatsApp Configuration', component: WhatsappConfig },
];

export default function WhatsappManagement({ activeSub, onBack }) {
  const current = WHATSAPP_SUBMODULES.find(s => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>WhatsApp</span>
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
      <div className="breadcrumb"><b>WhatsApp</b></div>
      <div className="page-heading">WhatsApp</div>
    </div>
  );
}
