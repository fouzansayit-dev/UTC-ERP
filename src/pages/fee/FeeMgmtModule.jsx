import React from 'react';

// Fee Module subpages
import FeeReceipt              from './feeModule/FeeReceipt.jsx';
import FeeReceiptHeadWise      from './feeModule/FeeReceiptHeadWise.jsx';
import AddOtherFee             from './feeModule/AddOtherFee.jsx';
import OtherFeeReceipt         from './feeModule/OtherFeeReceipt.jsx';
import AddOtherFeeBulk         from './feeModule/AddOtherFeeBulk.jsx';
import FeeDiscount             from './feeModule/FeeDiscount.jsx';
import FeeDiscountReport       from './feeModule/FeeDiscountReport.jsx';
import FeeCollection           from './feeModule/FeeCollection.jsx';
import HeadWiseFeeDetailedView from './feeModule/HeadWiseFeeDetailedView.jsx';
import FeeReceiptDetailedView  from './feeModule/FeeReceiptDetailedView.jsx';
import ForexRemittance         from './feeModule/ForexRemittance.jsx';
import AbroadFeeSchedule       from './feeModule/AbroadFeeSchedule.jsx';
import FeeSummary              from './feeModule/FeeSummary.jsx';
import FeeRefund               from './feeModule/FeeRefund.jsx';
import FeeReversal             from './feeModule/FeeReversal.jsx';
import FeeAdjustment           from './feeModule/FeeAdjustment.jsx';
import AddCreditNote           from './feeModule/AddCreditNote.jsx';
import StudentLedger           from './feeModule/StudentLedger.jsx';

// Reports
import FeeDashboard      from './reports/FeeDashboard.jsx';
import FeeStatement      from './reports/FeeStatement.jsx';
import FeeReconciliation from './reports/FeeReconciliation.jsx';
import FeeAuditLog       from './reports/FeeAuditLog.jsx';

export const FEE_MGMT_SUBMODULES = [
  { id: 'fmgmt-ledger',         label: 'Student Fee Ledger',         group: 'Fee Module' },
  { id: 'fmgmt-receipt',        label: 'Fee Receipt',                group: 'Fee Module' },
  { id: 'fmgmt-receipt-head',   label: 'Fee Receipt (Head Wise)',     group: 'Fee Module' },
  { id: 'fmgmt-add-other',      label: 'Add Other Fee',              group: 'Fee Module' },
  { id: 'fmgmt-other-receipt',  label: 'Other Fee Receipt',          group: 'Fee Module' },
  { id: 'fmgmt-bulk',           label: 'Add Other Fee (Bulk)',        group: 'Fee Module' },
  { id: 'fmgmt-discount',       label: 'Fee Discount',               group: 'Fee Module' },
  { id: 'fmgmt-discount-rpt',   label: 'Fee Discount Report',        group: 'Fee Module' },
  { id: 'fmgmt-collection',     label: 'Fee Collection (Hold Fee)',   group: 'Fee Module' },
  { id: 'fmgmt-head-detail',    label: 'Head Wise Fee Detailed View', group: 'Fee Module' },
  { id: 'fmgmt-receipt-detail', label: 'Fee Receipt Detailed View',  group: 'Fee Module' },
  { id: 'fmgmt-forex',          label: 'Forex Remittance',           group: 'Fee Module' },
  { id: 'fmgmt-abroad-sched',   label: 'Abroad Fee Schedule',        group: 'Fee Module' },
  { id: 'fmgmt-summary',        label: 'Fee Summary',                group: 'Fee Module' },
  { id: 'fmgmt-refund',         label: 'Fee Refund',                 group: 'Fee Module' },
  { id: 'fmgmt-reversal',       label: 'Fee Reversal',               group: 'Fee Module' },
  { id: 'fmgmt-adjustment',     label: 'Fee Adjustment',             group: 'Fee Module' },
  { id: 'fmgmt-credit-note',    label: 'Add Credit Note',            group: 'Fee Module' },
  { id: 'fmgmt-dashboard',      label: 'Fee Dashboard',              group: 'Reports'    },
  { id: 'fmgmt-statement',      label: 'Fee Statement',              group: 'Reports'    },
  { id: 'fmgmt-reconciliation', label: 'Fee Reconciliation',         group: 'Reports'    },
  { id: 'fmgmt-audit-log',      label: 'Fee Audit Log',              group: 'Reports'    },
];

const PAGE_MAP = {
  'fmgmt-ledger':         StudentLedger,
  'fmgmt-receipt':        FeeReceipt,
  'fmgmt-receipt-head':   FeeReceiptHeadWise,
  'fmgmt-add-other':      AddOtherFee,
  'fmgmt-other-receipt':  OtherFeeReceipt,
  'fmgmt-bulk':           AddOtherFeeBulk,
  'fmgmt-discount':       FeeDiscount,
  'fmgmt-discount-rpt':   FeeDiscountReport,
  'fmgmt-collection':     FeeCollection,
  'fmgmt-head-detail':    HeadWiseFeeDetailedView,
  'fmgmt-receipt-detail': FeeReceiptDetailedView,
  'fmgmt-forex':          ForexRemittance,
  'fmgmt-abroad-sched':   AbroadFeeSchedule,
  'fmgmt-summary':        FeeSummary,
  'fmgmt-refund':         FeeRefund,
  'fmgmt-reversal':       FeeReversal,
  'fmgmt-adjustment':     FeeAdjustment,
  'fmgmt-credit-note':    AddCreditNote,
  'fmgmt-dashboard':      FeeDashboard,
  'fmgmt-statement':      FeeStatement,
  'fmgmt-reconciliation': FeeReconciliation,
  'fmgmt-audit-log':      FeeAuditLog,
};

export default function FeeMgmtModule({ activeSub, onBack }) {
  const sub      = FEE_MGMT_SUBMODULES.find(s => s.id === activeSub);
  const PageComp = activeSub && PAGE_MAP[activeSub] ? PAGE_MAP[activeSub] : null;

  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-link" onClick={onBack}>Fee Management</span>
        {sub && <>{' › '}<b>{sub.label}</b></>}
      </div>

      <div className="page-heading">
        {sub ? sub.label : 'Fee Management'}
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