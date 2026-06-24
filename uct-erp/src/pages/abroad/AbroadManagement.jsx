import React from 'react';
import AbroadDashboard        from './AbroadDashboard';
import AbroadStudentList      from './StudentAbroad/AbroadStudentList';
import AddAbroadStudent       from './StudentAbroad/AddAbroadStudent';
import AbroadStudentLifecycle from './StudentAbroad/AbroadStudentLifecycle';
import UniversityList         from './University/UniversityList';
import AddUniversity          from './University/AddUniversity';
import VisaTracking           from './Visa/VisaTracking';
import VisaExpiryAlerts       from './Visa/VisaExpiryAlerts';

export const ABROAD_SUBMODULES = [
  { id: 'abroad-dashboard',    label: 'Dashboard' },
  { id: 'abroad-student-list', label: 'Abroad Student List' },
  { id: 'abroad-add-student',  label: 'Add Abroad Student' },
  { id: 'abroad-lifecycle',    label: 'Student Lifecycle (14-Stage)' },
  { id: 'abroad-uni-list',     label: 'University List' },
  { id: 'abroad-add-uni',      label: 'Add University' },
  { id: 'abroad-visa',         label: 'Visa Tracking' },
  { id: 'abroad-visa-alerts',  label: 'Visa Expiry Alerts' },
];

export default function AbroadManagement({ activeSub }) {
  const render = () => {
    switch (activeSub) {
      case 'abroad-student-list': return <AbroadStudentList />;
      case 'abroad-add-student':  return <AddAbroadStudent />;
      case 'abroad-lifecycle':    return <AbroadStudentLifecycle />;
      case 'abroad-uni-list':     return <UniversityList />;
      case 'abroad-add-uni':      return <AddUniversity />;
      case 'abroad-visa':         return <VisaTracking />;
      case 'abroad-visa-alerts':  return <VisaExpiryAlerts />;
      default:                    return <AbroadDashboard />;
    }
  };
  return <>{render()}</>;
}
