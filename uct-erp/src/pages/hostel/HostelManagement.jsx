import React from 'react';
import '../hr/HRManagement.css';

import AddHostel               from './submodules/AddHostel.jsx';
import AddRoom                 from './submodules/AddRoom.jsx';
import AllocateHostel          from './submodules/AllocateHostel.jsx';
import HostelAllocationReport  from './submodules/HostelAllocationReport.jsx';
import MessManagement          from './submodules/MessManagement.jsx';
import MaintenanceComplaints   from './submodules/MaintenanceComplaints.jsx';

export const HOSTEL_SUBMODULES = [
  { id: 'hostel-add',         label: 'Add Hostel',                component: AddHostel              },
  { id: 'hostel-room',        label: 'Add Room',                  component: AddRoom                },
  { id: 'hostel-allocate',    label: 'Allocate Hostel',           component: AllocateHostel         },
  { id: 'hostel-report',      label: 'Hostel Allocation Report',  component: HostelAllocationReport },
  { id: 'hostel-mess',        label: 'Mess Management',           component: MessManagement         },
  { id: 'hostel-maintenance', label: 'Maintenance Complaints',    component: MaintenanceComplaints  },
];

export default function HostelManagement({ activeSub, onBack }) {
  const current  = HOSTEL_SUBMODULES.find(s => s.id === activeSub);
  const PageComp = current ? current.component : null;

  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-link" onClick={onBack}>Hostel</span>
        {current && <>{' › '}<b>{current.label}</b></>}
      </div>

      <div className="page-heading">
        {current ? current.label : 'Hostel Module'}
      </div>

      {PageComp && (
        <div style={{ marginTop: 24 }}>
          <PageComp />
        </div>
      )}
    </div>
  );
}
