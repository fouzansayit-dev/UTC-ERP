# UCT ERP — Accounts & Finance Module Documentation

This document explains the architecture, submodules, data persistence schema, financial calculations, and access control of the Accounts & Finance module in the UCT ERP system.

---

## 1. Overview & Architecture

The **Accounts & Finance** module is built using a React (Vite) frontend and an Express (Node.js) backend with an SQLite database. It is designed to handle accounting masters, record credit/debit transactions (Receipts and Payments), and generate real-time financial statements and registers.

### Data Flow & Persistence
Instead of maintaining separate relational database tables for every ad-hoc master list, the system leverages a generic key-value store in the backend:
- **Backend Table:** `generic_store` (defined by columns: `module_key`, `record_id`, and `json_data` containing a JSON string).
- **Backend API Router:** `server/routes/generic.js` handles authorization, data isolation, and read/write operations.
- **Frontend Storage Keys:**
  - **Heads:** `/api/generic/accounts/heads`
  - **Subheads:** `/api/generic/accounts/subheads`
  - **Parties:** `/api/generic/accounts/parties`
  - **Banks:** `/api/generic/accounts/banks`
  - **Cashbook Ledger:** `/api/generic/accounts/cashbook`

---

## 2. Submodules Description

The module is divided into three key areas: Masters, Transactions, and Reports.

### 2.1 Accounting Masters (Setup)
Masters are used to create the core directory of entities referenced during transaction entry.
1. **Bank Master (`BankMaster.jsx`):** Records company bank accounts. Details include: Account Holder Name, Bank Name, Account Number, Payment Mode, and Opening Balance.
2. **Head Master (`HeadMaster.jsx`):** Creates chart of account categories (e.g., Construction, Expenses, Salary, Forex Remittance).
3. **Subhead Master (`SubheadMaster.jsx`):** Creates sub-categories linked to a primary Head (e.g., "Labor Charges" linked to the "Construction" head).
4. **Party Master (`PartyMaster.jsx`):** Stores vendors, agents, suppliers, and other external entities. Details include: Firm Name, Name, Party Type, Mobile No, and Address.

### 2.2 Transactions
Transactions handle the recording of financial inflows and outflows.
1. **Receipt (`Receipt.jsx`):** Records inflows (Credit entries). Features:
   - Dynamic dropdowns loading Heads, Subheads, and Bank accounts.
   - Party dropdown filtered based on the selected Party Type.
   - Dynamic voucher number generation (`RV/UCT/${credit_count + 1}`).
   - Saves entries with `type: 'Credit'` into the cashbook.
2. **Payment (`Payment.jsx`):** Records outflows (Debit entries). Features:
   - Dynamic voucher number generation (`JV/UCT/${debit_count + 1}`).
   - Saves entries with `type: 'Debit'` into the cashbook.

### 2.3 Reports & Registers
All reports query the unified `/api/generic/accounts/cashbook` ledger and perform real-time calculation and aggregation.

1. **Daily Report (`DailyReport.jsx`):** A comprehensive ledger for all cash and bank transactions.
   - *Opening Balance:* Calculated by taking the sum of credits minus debits before the starting date.
   - *Running Balance:* Updated sequentially as transactions are rendered in chronological order.
2. **Cash Report (`CashReport.jsx`):** Filters the daily register to only display transactions where `payMode === 'Cash'`. Shows cash flow and running cash in hand.
3. **Bank Report (`BankReport.jsx`):** Filters transactions by a selected bank account (or all banks) where `payMode !== 'Cash'`. Calculates opening bank balances and running bank account balances.
4. **Daywise Register (`DaywiseRegister.jsx`):** Displays day-by-day cash book entries categorized into Debit (Receipt) and Credit (Payment) columns.
5. **Payment Summary (`PaymentSummary.jsx`):** Lists all debit (`type === 'Debit'`) transactions for a given date range.
6. **Receipt Summary (`ReceiptSummary.jsx`):** Lists all credit (`type === 'Credit'`) transactions for a given date range.
7. **Expense Register (`ExpenseRegister.jsx`):** Details payments, grouped by Head, Subhead, Party, and voucher references.
8. **Income & Expenditure Report (`IncomeExpenditureReport.jsx`):** Groups all credits as Income and debits as Expenditure by Head/Subhead. Calculates the Net Surplus/Deficit for each account category.
9. **Income & Expenditure Statement (`IncomeExpenditureStatement.jsx`):** Summarizes overall revenues (receipts), operating expenses (payments), and Net Surplus/Deficit.
10. **Balance Sheet (`BalanceSheet.jsx`):** Summarizes UCT's financial position up to a selected snapshot date.
    - *Liabilities & Capital:* Opening Capital (total opening bank balances from bank master) + Reserves & Surplus (Net Surplus up to snapshot date).
    - *Assets:* Cash in Hand (current cash balance) + Bank Balances (current bank balances).
    - *Double-entry Balance:* The statement is mathematically guaranteed to balance because:
      $$\text{Liabilities} + \text{Capital} = \text{Bank Opening} + (\text{Total Receipts} - \text{Total Payments})$$
      $$\text{Assets} = \text{Cash in Hand} + \text{Bank Balances} = (\text{Cash Receipts} - \text{Cash Payments}) + (\text{Bank Opening} + \text{Bank Receipts} - \text{Bank Payments})$$
      $$\text{Assets} = \text{Bank Opening} + (\text{Total Receipts} - \text{Total Payments}) = \text{Liabilities} + \text{Capital}$$

---

## 3. Access Control & Security

To protect sensitive management controls, the **Admin Dashboard** is strictly guarded.

### Guard Implementation:
1. **Sidebar Navigation Filter:**
   In `src/App.jsx`, `filteredModules` filters out submodules before generating the menu. If the logged-in user's role is not `'Administrator'`, the `'dash-admin'` (Admin Dashboard) submodule is removed:
   ```javascript
   if (userRole !== 'Administrator') {
     allowedSubs = allowedSubs.filter(sub => sub.id !== 'dash-admin');
   }
   ```
2. **Main Render Guard:**
   In `src/App.jsx`, the `renderContent()` function actively guards the dashboard rendering. If a non-Admin user attempts to navigate to the Admin Dashboard (e.g. via direct links, URL routing, or manual state manipulation), an **Access Denied** message is rendered:
   ```javascript
   if (activeSub === 'dash-admin' && userRole !== 'Administrator') {
     return (
       <div style={{ padding: 24, textAlign: 'center', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
         <h2 style={{ color: '#dc2626', marginBottom: 12 }}>Access Denied</h2>
         <p style={{ color: '#64748b', fontSize: 14 }}>You do not have permission to view the Admin Dashboard.</p>
       </div>
     );
   }
   ```
3. **Database Authorization (Backend):**
   In `server/routes/generic.js`, endpoint authorization strictly checks roles:
   - `'Student'` is denied access to `'accounts'` module keys.
   - `'Accounts'` role is granted access *only* to `'accounts'` and `'fees'`.
   - Write/POST permissions are checked against roles to prevent unauthorized database modifications.
