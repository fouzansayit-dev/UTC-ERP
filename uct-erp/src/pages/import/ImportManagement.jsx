import React from 'react';
import '../hr/HRManagement.css';

import ImportEmployee   from './submodules/ImportEmployee.jsx';
import ImportStudent    from './submodules/ImportStudent.jsx';
import ImageUploadBulk  from './submodules/ImageUploadBulk.jsx';
import FeeReceiptUpload from './submodules/FeeReceiptUpload.jsx';
import DueFeeUpload     from './submodules/DueFeeUpload.jsx';

export const IMPORT_SUBMODULES = [
  { id: 'imp-employee',    label: 'Import Employee',      component: ImportEmployee   },
  { id: 'imp-student',     label: 'Import Student',       component: ImportStudent    },
  { id: 'imp-image-bulk',  label: 'Image Upload in Bulk', component: ImageUploadBulk  },
  { id: 'imp-fee-receipt', label: 'Fee Receipt Upload',   component: FeeReceiptUpload },
  { id: 'imp-due-fee',     label: 'Due Fee Upload',       component: DueFeeUpload     },
];

export default function ImportManagement({ activeSub, onBack }) {
  var current = IMPORT_SUBMODULES.find(function(s) { return s.id === activeSub; });

  if (current) {
    var PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Import</span>
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
      <div className="breadcrumb"><b>Import</b></div>
      <div className="page-heading">Import</div>
    </div>
  );
}
