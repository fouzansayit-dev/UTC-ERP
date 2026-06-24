import React from 'react';
import '../hr/HRManagement.css';

import ReceiptDispatch        from './submodules/ReceiptDispatch.jsx';
import ReceiptDispatchDetails from './submodules/ReceiptDispatchDetails.jsx';
import VisitingType           from './submodules/VisitingType.jsx';
import AddNewVisitor          from './submodules/AddNewVisitor.jsx';
import VisitorReport          from './submodules/VisitorReport.jsx';
import GatePassGuardian       from './submodules/GatePassGuardian.jsx';
import GatePassEmployee       from './submodules/GatePassEmployee.jsx';
import GatePassDetailsS       from './submodules/GatePassDetailsS.jsx';
import GatePassDetailsE       from './submodules/GatePassDetailsE.jsx';

export const RECEPTION_SUBMODULES = [
  /* Reception */
  { id: 'rec-receipt',         label: 'Receipt / Dispatch',         component: ReceiptDispatch        },
  { id: 'rec-receipt-details', label: 'Receipt / Dispatch Details', component: ReceiptDispatchDetails },
  /* Visitor Management */
  { id: 'rec-visiting-type',   label: 'Visiting Type',              component: VisitingType           },
  { id: 'rec-add-visitor',     label: 'Add New Visitor',            component: AddNewVisitor          },
  { id: 'rec-visitor-report',  label: 'Visitor Report',             component: VisitorReport          },
  /* Gate Pass */
  { id: 'rec-gp-guardian',     label: 'Gate Pass For Guardian',     component: GatePassGuardian       },
  { id: 'rec-gp-employee',     label: 'Gate Pass For Employee',     component: GatePassEmployee       },
  { id: 'rec-gp-details-s',    label: 'Gate Pass Details (S)',      component: GatePassDetailsS       },
  { id: 'rec-gp-details-e',    label: 'Gate Pass Details (E)',      component: GatePassDetailsE       },
];

export default function ReceptionManagement({ activeSub, onBack }) {
  const current = RECEPTION_SUBMODULES.find((s) => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Reception, Visitor &amp; Gate Pass</span>
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
      <div className="breadcrumb"><b>Reception, Visitor &amp; Gate Pass</b></div>
      <div className="page-heading">Reception, Visitor &amp; Gate Pass</div>
    </div>
  );
}
