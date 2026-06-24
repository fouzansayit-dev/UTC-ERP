import React from 'react';

// Fee Master subpages
import SchemeCategory from './feeMaster/SchemeCategory.jsx';
import Schemes        from './feeMaster/Schemes.jsx';
import FeeHeadMaster  from './feeMaster/FeeHeadMaster.jsx';
import FeeMaster      from './feeMaster/FeeMaster.jsx';
import ViewFeeMaster  from './feeMaster/ViewFeeMaster.jsx';
import FeeSummary     from './feeModule/FeeSummary.jsx';
import FeePenalty     from './feeMaster/FeePenalty.jsx';
import FeeWaiver      from './feeMaster/FeeWaiver.jsx';

export const FEE_MASTER_SUBMODULES = [
  { id: 'fm-scheme-cat',  label: 'Scheme Category' },
  { id: 'fm-schemes',     label: 'Schemes'         },
  { id: 'fm-head-master', label: 'Fee Head Master' },
  { id: 'fm-fee-master',  label: 'Fee Master'      },
  { id: 'fm-view-master', label: 'View Fee Master' },
  { id: 'fm-summary',     label: 'Fee Summary'     },
  { id: 'fm-penalty',     label: 'Fee Penalty'     },
  { id: 'fm-waiver',      label: 'Fee Waiver'      },
];

const PAGE_MAP = {
  'fm-scheme-cat':  SchemeCategory,
  'fm-schemes':     Schemes,
  'fm-head-master': FeeHeadMaster,
  'fm-fee-master':  FeeMaster,
  'fm-view-master': ViewFeeMaster,
  'fm-summary':     FeeSummary,
  'fm-penalty':     FeePenalty,
  'fm-waiver':      FeeWaiver,
};

export default function FeeMasterModule({ activeSub, onBack }) {
  const sub      = FEE_MASTER_SUBMODULES.find(s => s.id === activeSub);
  const PageComp = activeSub && PAGE_MAP[activeSub] ? PAGE_MAP[activeSub] : null;

  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-link" onClick={onBack}>Fee Master</span>
        {sub && <>{' › '}<b>{sub.label}</b></>}
      </div>

      <div className="page-heading">
        {sub ? sub.label : 'Fee Master'}
      </div>

      {PageComp ? (
        <div style={{ marginTop: 24 }}>
          <PageComp />
        </div>
      ) : (
        <div style={{ marginTop: 24 }} />
      )}
    </div>
  );
}