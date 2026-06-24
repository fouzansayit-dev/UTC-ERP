import VisaRecords     from '../pages/VisaRecords.jsx';
import VisaWorkflow    from '../pages/VisaWorkflow.jsx';
import AlertMatrix     from '../pages/AlertMatrix.jsx';
import RenewalTracking from '../pages/RenewalTracking.jsx';

const visaRoutes = [
  { path: '/visa/records',  component: VisaRecords,     label: 'Visa Records'      },
  { path: '/visa/workflow', component: VisaWorkflow,    label: 'Visa Workflow'     },
  { path: '/visa/alerts',   component: AlertMatrix,     label: 'Alert Matrix'      },
  { path: '/visa/renewal',  component: RenewalTracking, label: 'Renewal Tracking'  },
];

export default visaRoutes;
