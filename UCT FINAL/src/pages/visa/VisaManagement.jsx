import React from 'react';
import VisaRecords     from './pages/VisaRecords.jsx';
import VisaWorkflow    from './pages/VisaWorkflow.jsx';
import AlertMatrix     from './pages/AlertMatrix.jsx';
import RenewalTracking from './pages/RenewalTracking.jsx';

export const VISA_SUBMODULES = [
  { id: 'visa-records',  label: 'Visa Records'      },
  { id: 'visa-workflow', label: 'Visa Workflow'      },
  { id: 'visa-alerts',   label: 'Alert Matrix'       },
  { id: 'visa-renewal',  label: 'Renewal Tracking'   },
];

export default function VisaManagement({ activeSub }) {
  const render = () => {
    switch (activeSub) {
      case 'visa-records':  return <VisaRecords />;
      case 'visa-workflow': return <VisaWorkflow />;
      case 'visa-alerts':   return <AlertMatrix />;
      case 'visa-renewal':  return <RenewalTracking />;
      default:              return null;
    }
  };
  return <>{render()}</>;
}
