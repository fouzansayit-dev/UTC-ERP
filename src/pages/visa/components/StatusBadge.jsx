import React from 'react';

const STATUS_CLASS = {
  'Pending':    'visa-badge-pending',
  'Approved':   'visa-badge-approved',
  'Rejected':   'visa-badge-rejected',
  'Processing': 'visa-badge-processing',
  'Expired':    'visa-badge-expired',
  'Renewal Due':'visa-badge-renewal',
  'Booked':     'visa-badge-booked',
  'Submitted':  'visa-badge-submitted',
};

export default function StatusBadge({ status }) {
  const cls = STATUS_CLASS[status] || 'visa-badge-pending';
  return <span className={`visa-badge ${cls}`}>{status || '—'}</span>;
}
