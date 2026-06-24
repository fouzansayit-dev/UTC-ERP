import React from 'react';
import './Dashboard.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;
const FormField = ({ label, required, children }) => (
  <div className="form-field">
    <label className="form-label">{label}{required && <span className="req"> *</span>}</label>
    {children}
  </div>
);
const Input    = (props)              => <input    className="form-input" {...props} />;
const Select   = ({ children, ...p }) => <select   className="form-input" {...p}>{children}</select>;
const Textarea = (props)              => <textarea className="form-input form-textarea" {...props} />;

export default function AccountDashboard() {
  const handleSubmit = (e) => { e.preventDefault(); alert('Transaction saved!'); };
  return (
    <div className="hr-form">

      {/* ── TRANSACTION FORM ── */}
      <form onSubmit={handleSubmit}>
        <SectionTitle title="Transaction Details" />
        <div className="form-grid">
          <FormField label="Transaction Type" required>
            <Select defaultValue="">
              <option value="">-- Select Type --</option>
              <option>Income</option>
              <option>Expense</option>
              <option>Payment</option>
              <option>Refund</option>
              <option>Transfer</option>
            </Select>
          </FormField>
          <FormField label="Date" required>
            <Input type="date" />
          </FormField>
          <FormField label="Department" required>
            <Select defaultValue="">
              <option value="">-- Select Department --</option>
              <option>HR</option>
              <option>Academics</option>
              <option>Accounts</option>
              <option>Admin</option>
              <option>Library</option>
              <option>Hostel</option>
              <option>Transport</option>
            </Select>
          </FormField>
          <FormField label="Amount" required>
            <Input type="number" min="0" step="0.01" placeholder="Enter amount" />
          </FormField>
          <FormField label="Payment Method" required>
            <Select defaultValue="">
              <option value="">-- Select Method --</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Cheque</option>
              <option>UPI</option>
              <option>Card</option>
              <option>DD</option>
            </Select>
          </FormField>
          <FormField label="Description">
            <Textarea placeholder="Enter transaction description..." rows={3} />
          </FormField>
        </div>
        <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="submit-btn">Save Transaction</button>
          <button type="reset" className="submit-btn" style={{ background: '#6b7280' }} onClick={() => {}}>Reset</button>
        </div>
      </form>

      {/* ── FOREX REMITTANCE TRACKER ── */}
      <SectionTitle title="Forex Remittance Tracker" />
      <div style={{ marginBottom: 8 }}>
        <div className="form-grid" style={{ marginBottom: 12 }}>
          <FormField label="Student Name">
            <Input placeholder="Search by student name" />
          </FormField>
          <FormField label="Country">
            <Select defaultValue="">
              <option value="">-- All Countries --</option>
              <option>Russia</option>
              <option>Ukraine</option>
              <option>Kazakhstan</option>
              <option>Philippines</option>
              <option>Georgia</option>
              <option>Bangladesh</option>
              <option>Nepal</option>
              <option>China</option>
            </Select>
          </FormField>
          <FormField label="Remittance Status">
            <Select defaultValue="">
              <option value="">-- All Statuses --</option>
              <option>Pending</option>
              <option>Processed</option>
              <option>Failed</option>
              <option>On Hold</option>
            </Select>
          </FormField>
          <FormField label="From Date">
            <Input type="date" />
          </FormField>
          <FormField label="To Date">
            <Input type="date" />
          </FormField>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button type="button" className="submit-btn" onClick={() => alert("Action")}>Search</button>
          <button type="button" className="submit-btn" style={{ background: '#6b7280' }} onClick={() => alert("Action")}>Reset</button>
        </div>
      </div>
      <div className="table-wrap" style={{ marginBottom: 28 }}>
        <table className="hr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Country</th>
              <th>University</th>
              <th>Amount (INR)</th>
              <th>Currency</th>
              <th>Exchange Rate</th>
              <th>Remittance Date</th>
              <th>Status</th>
              <th>Reference No.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={10} className="empty-table-msg">
                No remittance records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── AGENT COMMISSION DUE ── */}
      <SectionTitle title="Agent Commission Due" />
      <div style={{ marginBottom: 8 }}>
        <div className="form-grid" style={{ marginBottom: 12 }}>
          <FormField label="Agent Name">
            <Input placeholder="Search by agent name" />
          </FormField>
          <FormField label="Agent ID">
            <Input placeholder="Enter agent ID" />
          </FormField>
          <FormField label="Commission Status">
            <Select defaultValue="">
              <option value="">-- All Statuses --</option>
              <option>Due</option>
              <option>Paid</option>
              <option>Partial</option>
              <option>On Hold</option>
            </Select>
          </FormField>
          <FormField label="From Date">
            <Input type="date" />
          </FormField>
          <FormField label="To Date">
            <Input type="date" />
          </FormField>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button type="button" className="submit-btn" onClick={() => alert("Action")}>Search</button>
          <button type="button" className="submit-btn" style={{ background: '#6b7280' }} onClick={() => alert("Action")}>Reset</button>
        </div>
      </div>
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Agent Name</th>
              <th>Agent ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Enrollment Date</th>
              <th>Commission Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={10} className="empty-table-msg">
                No agent commission records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
