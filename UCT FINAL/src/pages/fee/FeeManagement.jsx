import React from 'react';

// Fee Master
import SchemeCategory     from './feeMaster/SchemeCategory.jsx';
import Schemes            from './feeMaster/Schemes.jsx';
import FeeHeadMaster      from './feeMaster/FeeHeadMaster.jsx';
import FeeWaiver          from './feeMaster/FeeWaiver.jsx';
import FeePenalty         from './feeMaster/FeePenalty.jsx';

// Fee Module
import FeeReceipt         from './feeModule/FeeReceipt.jsx';
import FeeReceiptHeadWise from './feeModule/FeeReceiptHeadWise.jsx';
import AddOtherFee        from './feeModule/AddOtherFee.jsx';
import OtherFeeReceipt    from './feeModule/OtherFeeReceipt.jsx';
import AddOtherFeeBulk    from './feeModule/AddOtherFeeBulk.jsx';
import FeeDiscount        from './feeModule/FeeDiscount.jsx';
import FeeDiscountReport  from './feeModule/FeeDiscountReport.jsx';
import FeeCollection      from './feeModule/FeeCollection.jsx';
import ForexRemittance    from './feeModule/ForexRemittance.jsx';
import AbroadFeeSchedule  from './feeModule/AbroadFeeSchedule.jsx';
import FeeSummary         from './feeModule/FeeSummary.jsx';
import FeeRefund          from './feeModule/FeeRefund.jsx';
import FeeReversal        from './feeModule/FeeReversal.jsx';
import FeeAdjustment      from './feeModule/FeeAdjustment.jsx';
import AddCreditNote      from './feeModule/AddCreditNote.jsx';

// Reports
import FeeDashboard       from './reports/FeeDashboard.jsx';
import FeeStatement       from './reports/FeeStatement.jsx';
import FeeReconciliation  from './reports/FeeReconciliation.jsx';
import FeeAuditLog        from './reports/FeeAuditLog.jsx';

export const FEE_SUBMODULES = [
  // Fee Master
  { id: 'fee-scheme-cat',     label: 'Scheme Category',            group: 'Fee Master'  },
  { id: 'fee-schemes',        label: 'Schemes',                    group: 'Fee Master'  },
  { id: 'fee-head-master',    label: 'Fee Head Master',            group: 'Fee Master'  },
  { id: 'fee-waiver',         label: 'Fee Waiver / Exemption',     group: 'Fee Master'  },
  { id: 'fee-penalty',        label: 'Fee Penalty / Fine',         group: 'Fee Master'  },
  // Fee Module
  { id: 'fee-receipt',        label: 'Fee Receipt',                group: 'Fee Module'  },
  { id: 'fee-receipt-head',   label: 'Fee Receipt (Head Wise)',     group: 'Fee Module'  },
  { id: 'fee-add-other',      label: 'Add Other Fee',              group: 'Fee Module'  },
  { id: 'fee-other-receipt',  label: 'Other Fee Receipt',          group: 'Fee Module'  },
  { id: 'fee-bulk',           label: 'Add Other Fee (Bulk)',        group: 'Fee Module'  },
  { id: 'fee-discount',       label: 'Fee Discount',               group: 'Fee Module'  },
  { id: 'fee-discount-rpt',   label: 'Fee Discount Report',        group: 'Fee Module'  },
  { id: 'fee-collection',     label: 'Fee Collection (Hold Fee)',   group: 'Fee Module'  },
  { id: 'fee-forex',          label: 'Forex Remittance',           group: 'Fee Module'  },
  { id: 'fee-abroad-sched',   label: 'Abroad Fee Schedule',        group: 'Fee Module'  },
  { id: 'fee-summary',        label: 'Fee Summary',                group: 'Fee Module'  },
  { id: 'fee-refund',         label: 'Fee Refund',                 group: 'Fee Module'  },
  { id: 'fee-reversal',       label: 'Fee Reversal',               group: 'Fee Module'  },
  { id: 'fee-adjustment',     label: 'Fee Adjustment',             group: 'Fee Module'  },
  { id: 'fee-credit-note',    label: 'Add Credit Note',            group: 'Fee Module'  },
  // Reports
  { id: 'fee-dashboard',      label: 'Fee Dashboard',              group: 'Reports'     },
  { id: 'fee-statement',      label: 'Fee Statement',              group: 'Reports'     },
  { id: 'fee-reconciliation', label: 'Fee Reconciliation',         group: 'Reports'     },
  { id: 'fee-audit-log',      label: 'Fee Audit Log',              group: 'Reports'     },
];

const PAGE_MAP = {
  'fee-scheme-cat':     SchemeCategory,
  'fee-schemes':        Schemes,
  'fee-head-master':    FeeHeadMaster,
  'fee-waiver':         FeeWaiver,
  'fee-penalty':        FeePenalty,
  'fee-receipt':        FeeReceipt,
  'fee-receipt-head':   FeeReceiptHeadWise,
  'fee-add-other':      AddOtherFee,
  'fee-other-receipt':  OtherFeeReceipt,
  'fee-bulk':           AddOtherFeeBulk,
  'fee-discount':       FeeDiscount,
  'fee-discount-rpt':   FeeDiscountReport,
  'fee-collection':     FeeCollection,
  'fee-forex':          ForexRemittance,
  'fee-abroad-sched':   AbroadFeeSchedule,
  'fee-summary':        FeeSummary,
  'fee-refund':         FeeRefund,
  'fee-reversal':       FeeReversal,
  'fee-adjustment':     FeeAdjustment,
  'fee-credit-note':    AddCreditNote,
  'fee-dashboard':      FeeDashboard,
  'fee-statement':      FeeStatement,
  'fee-reconciliation': FeeReconciliation,
  'fee-audit-log':      FeeAuditLog,
};

export default function FeeManagement({ activeSub, onBack }) {
  const sub = FEE_SUBMODULES.find(s => s.id === activeSub);
  const PageComp = activeSub && PAGE_MAP[activeSub] ? PAGE_MAP[activeSub] : null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="bc-link" onClick={onBack}>Fee Management</span>
        {sub && <>{' › '}<b>{sub.label}</b></>}
      </div>

      {/* Page heading */}
      <div className="page-heading">
        {sub ? sub.label : 'Fee Management'}
      </div>

      {/* Page content */}
      {PageComp ? (
        <div style={{ marginTop: 24 }}>
          <PageComp />
        </div>
      ) : (
        /* Landing overview when no sub selected */
        <div style={{ marginTop: 24 }}>
          {['Fee Master', 'Fee Module', 'Reports'].map(group => (
            <div key={group} className="erp-card" style={{ marginBottom: 20 }}>
              <div className="erp-card-header">{group}</div>
              <div className="erp-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {FEE_SUBMODULES.filter(s => s.group === group).map(s => (
                    <div
                      key={s.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e0e5ef',
                        borderRadius: 6,
                        padding: '12px 14px',
                        cursor: 'pointer',
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: '#1a2236',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e0e5ef'; }}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
