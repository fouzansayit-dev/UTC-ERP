import React from 'react';

/* ── Account Master ── */
import BankMaster       from './submodules/BankMaster.jsx';
import ChequeEntry      from './submodules/ChequeEntry.jsx';
import CardEntry        from './submodules/CardEntry.jsx';
import HeadMaster       from './submodules/HeadMaster.jsx';
import SubheadMaster    from './submodules/SubheadMaster.jsx';
import PartyMaster      from './submodules/PartyMaster.jsx';

/* ── Transactions ── */
import BillEntry        from './submodules/BillEntry.jsx';
import Payment          from './submodules/Payment.jsx';
import PartyLedger      from './submodules/PartyLedger.jsx';
import BankDeposit      from './submodules/BankDeposit.jsx';
import SelfWithdrawal   from './submodules/SelfWithdrawal.jsx';
import Receipt          from './submodules/Receipt.jsx';

/* ── Enhancements ── */
import ForexRemittance  from './submodules/ForexRemittance.jsx';
import AgentCommission  from './submodules/AgentCommission.jsx';

/* ── Reports ── */
import BillEntryDetails           from './submodules/BillEntryDetails.jsx';
import PaymentSummary             from './submodules/PaymentSummary.jsx';
import DailyReport                from './submodules/DailyReport.jsx';
import CashReport                 from './submodules/CashReport.jsx';
import BankReport                 from './submodules/BankReport.jsx';
import BankStatement              from './submodules/BankStatement.jsx';
import BalanceSheet               from './submodules/BalanceSheet.jsx';
import FeeReceiptRegister         from './submodules/FeeReceiptRegister.jsx';
import ExpenseRegister            from './submodules/ExpenseRegister.jsx';
import DaywiseRegister            from './submodules/DaywiseRegister.jsx';
import BankDepositReport          from './submodules/BankDepositReport.jsx';
import PartyLedgerReport          from './submodules/PartyLedgerReport.jsx';
import IncomeExpenditureReport    from './submodules/IncomeExpenditureReport.jsx';
import IncomeExpenditureStatement from './submodules/IncomeExpenditureStatement.jsx';
import ReceiptSummary             from './submodules/ReceiptSummary.jsx';

export const ACCOUNTS_SUBMODULES = [
  /* Account Master */
  { id:'acc-bank',      label:'Bank Master',                      component: BankMaster              },
  { id:'acc-cheque',    label:'Cheque Entry',                     component: ChequeEntry             },
  { id:'acc-card',      label:'Card Entry',                       component: CardEntry               },
  { id:'acc-head',      label:'Head Master',                      component: HeadMaster              },
  { id:'acc-subhead',   label:'Subhead Master',                   component: SubheadMaster           },
  { id:'acc-party',     label:'Party Master',                     component: PartyMaster             },
  /* Transactions */
  { id:'acc-bill',      label:'Bill Entry',                       component: BillEntry               },
  { id:'acc-payment',   label:'Payment',                          component: Payment                 },
  { id:'acc-ledger',    label:'Party Ledger',                     component: PartyLedger             },
  { id:'acc-deposit',   label:'Bank Deposit',                     component: BankDeposit             },
  { id:'acc-withdraw',  label:'Self Withdrawal',                  component: SelfWithdrawal          },
  { id:'acc-receipt',   label:'Receipt',                          component: Receipt                 },
  /* Enhancements */
  { id:'acc-forex',     label:'Forex Remittance',                 component: ForexRemittance         },
  { id:'acc-commission',label:'Agent Commission Payment',         component: AgentCommission         },
  /* Reports */
  { id:'acc-r-bill',    label:'Bill Entry Details',               component: BillEntryDetails        },
  { id:'acc-r-payment', label:'Payment Summary',                  component: PaymentSummary          },
  { id:'acc-r-daily',   label:'Daily Report',                     component: DailyReport             },
  { id:'acc-r-cash',    label:'Cash Report',                      component: CashReport              },
  { id:'acc-r-bank',    label:'Bank Report',                      component: BankReport              },
  { id:'acc-r-bkstmt',  label:'Bank Statement',                   component: BankStatement           },
  { id:'acc-r-bs',      label:'Balance Sheet',                    component: BalanceSheet            },
  { id:'acc-r-fee',     label:'Fee Receipt Register',             component: FeeReceiptRegister      },
  { id:'acc-r-exp',     label:'Expense Register',                 component: ExpenseRegister         },
  { id:'acc-r-day',     label:'Daywise Register',                 component: DaywiseRegister         },
  { id:'acc-r-bkdep',   label:'Bank Deposit Report',              component: BankDepositReport       },
  { id:'acc-r-pled',    label:'Party Ledger Report',              component: PartyLedgerReport       },
  { id:'acc-r-ie',      label:'Income & Expenditure Report',      component: IncomeExpenditureReport },
  { id:'acc-r-ies',     label:'Income & Expenditure Statement',   component: IncomeExpenditureStatement },
  { id:'acc-r-rcpt',    label:'Receipt Summary',                  component: ReceiptSummary          },
];

export default function AccountsManagement({ activeSub, onBack }) {
  const current = ACCOUNTS_SUBMODULES.find(s => s.id === activeSub);

  if (current) {
    const Comp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Accounts</span>
          {' › '}
          <b>{current.label}</b>
        </div>
        <div className="page-heading">{current.label}</div>
        <div style={{ marginTop: 24 }}><Comp /></div>
      </div>
    );
  }

  /* ── Landing ── */
  return (
    <div>
      <div className="breadcrumb"><b>Accounts</b></div>
      <div className="page-heading">Accounts & Finance</div>
      <p style={{ marginTop: 16, color: '#6b7280', fontSize: 14 }}>
      </p>
    </div>
  );
}
