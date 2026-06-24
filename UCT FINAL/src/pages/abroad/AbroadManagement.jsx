import React from 'react';
import AbroadDashboard        from './AbroadDashboard';
import AbroadStudentList      from './StudentAbroad/AbroadStudentList';
import AddAbroadStudent       from './StudentAbroad/AddAbroadStudent';
import AbroadStudentLifecycle from './StudentAbroad/AbroadStudentLifecycle';
import UniversityList         from './University/UniversityList';
import AddUniversity          from './University/AddUniversity';
import VisaTracking           from './Visa/VisaTracking';
import VisaExpiryAlerts       from './Visa/VisaExpiryAlerts';

// New Submodules
import CountryMaster         from './submodules/CountryMaster';
import UniversityMaster      from './submodules/UniversityMaster';
import VisaTypeMaster        from './submodules/VisaTypeMaster';
import ForexRemittance       from './submodules/ForexRemittance';
import NmcInternship         from './submodules/NmcInternship';
import AnnualReturnVisit     from './submodules/AnnualReturnVisit';
import AgentPortal           from './submodules/AgentPortal';

export const ABROAD_SUBMODULES = [
  { id: 'abroad-dashboard',    label: 'Dashboard' },
  { id: 'abroad-student-list', label: 'Abroad Student List' },
  { id: 'abroad-add-student',  label: 'Add Abroad Student' },
  { id: 'abroad-lifecycle',    label: 'Student Lifecycle (14-Stage)' },
  { id: 'abroad-country-master', label: 'Country Master' },
  { id: 'abroad-uni-master',     label: 'University Master' },
  { id: 'abroad-visa-type-master', label: 'Visa Type Master' },
  { id: 'abroad-forex',          label: 'Forex Remittance' },
  { id: 'abroad-nmc-internship', label: 'NMC Internship Tracking' },
  { id: 'abroad-return-visit',  label: 'Annual Return Visit' },
  { id: 'abroad-agent-portal',  label: 'Recruitment Agent Portal' },
];

export default function AbroadManagement({ activeSub }) {
  const render = () => {
    switch (activeSub) {
      case 'abroad-student-list': return <AbroadStudentList />;
      case 'abroad-add-student':  return <AddAbroadStudent />;
      case 'abroad-lifecycle':    return <AbroadStudentLifecycle />;
      case 'abroad-country-master': return <CountryMaster />;
      case 'abroad-uni-master':     return <UniversityMaster />;
      case 'abroad-visa-type-master': return <VisaTypeMaster />;
      case 'abroad-forex':          return <ForexRemittance />;
      case 'abroad-nmc-internship': return <NmcInternship />;
      case 'abroad-return-visit':  return <AnnualReturnVisit />;
      case 'abroad-agent-portal':  return <AgentPortal />;
      default:                    return <AbroadDashboard />;
    }
  };
  return <>{render()}</>;
}
