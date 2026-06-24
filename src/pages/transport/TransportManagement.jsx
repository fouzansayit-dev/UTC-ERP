import React from 'react';
import '../hr/HRManagement.css';

import AddVehicle                from './submodules/AddVehicle.jsx';
import LogBook                   from './submodules/LogBook.jsx';
import DieselIn                  from './submodules/DieselIn.jsx';
import LogbookDieselReport       from './submodules/LogbookDieselReport.jsx';
import RouteMaster               from './submodules/RouteMaster.jsx';
import TransportAllocation       from './submodules/TransportAllocation.jsx';
import TransportAllocationReport from './submodules/TransportAllocationReport.jsx';
import AddDriverHelper           from './submodules/AddDriverHelper.jsx';

export const TRANSPORT_SUBMODULES = [
  { id: 'tr-add-vehicle',        label: 'Add Vehicle',                   component: AddVehicle },
  { id: 'tr-logbook',            label: 'Log Book',                       component: LogBook },
  { id: 'tr-diesel-in',          label: 'Diesel IN',                      component: DieselIn },
  { id: 'tr-logbook-report',     label: 'Logbook & Diesel Report',        component: LogbookDieselReport },
  { id: 'tr-route-master',       label: 'Route Master',                   component: RouteMaster },
  { id: 'tr-allocation',         label: 'Transport Allocation',           component: TransportAllocation },
  { id: 'tr-allocation-report',  label: 'Transport Allocation Report',    component: TransportAllocationReport },
  { id: 'tr-add-driver',         label: 'Add Driver/Helper',              component: AddDriverHelper },
];

export default function TransportManagement({ activeSub, onBack }) {
  const current = TRANSPORT_SUBMODULES.find((s) => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Transport</span>
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
      <div className="breadcrumb"><b>Transport</b></div>
      <div className="page-heading">Transport</div>
    </div>
  );
}
