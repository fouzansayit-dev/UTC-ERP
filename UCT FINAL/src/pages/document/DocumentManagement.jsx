import React from 'react';
import '../hr/HRManagement.css';

import AddDocument    from './submodules/AddDocument.jsx';
import DocumentReport from './submodules/DocumentReport.jsx';

export const DOCUMENT_SUBMODULES = [
  { id: 'doc-add',    label: 'Add Document',    component: AddDocument    },
  { id: 'doc-report', label: 'Document Report', component: DocumentReport },
];

export default function DocumentManagement({ activeSub, onBack }) {
  const current = DOCUMENT_SUBMODULES.find((s) => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Document</span>
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
      <div className="breadcrumb"><b>Document</b></div>
      <div className="page-heading">Document</div>
    </div>
  );
}
