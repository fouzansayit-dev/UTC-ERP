import React, { useState, useEffect } from 'react';
import { FormField, Input, Select, SectionTitle, SubmitBtn, DEPTS } from './HRComponents.jsx';

export default function PaySalary() {
  const [form, setForm] = useState({ department: '', month: '', amount: '', method: 'Bank Transfer', date: new Date().toISOString().split('T')[0] });
  const [employees, setEmployees] = useState([]);
  const [payments, setPayments] = useState([]);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/hr')
      .then(res => res.json())
      .then(data => setEmployees(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading employees:', err));

    fetch('/api/generic/hr/payments')
      .then(res => res.json())
      .then(data => setPayments(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading payments:', err));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.department) { alert('Please select a department.'); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { alert('Please enter a valid amount.'); return; }
    if (!form.date) { alert('Please select a payment date.'); return; }

    const deptEmps = employees.filter(emp =>
      form.department === 'All' || (emp.department || '').toLowerCase().includes(form.department.toLowerCase())
    );

    const paymentRecord = {
      id: Date.now(),
      department: form.department,
      month: form.month,
      amount: parseFloat(form.amount),
      method: form.method,
      date: form.date,
      employeeCount: deptEmps.length,
      paidAt: new Date().toISOString(),
    };

    const updatedPayments = [...payments, paymentRecord];

    // Log payment to cashbook ledger as debit outflow
    const cashbookEntry = {
      id: Date.now() + 1,
      type: 'Debit',
      description: `Salary Payment — ${form.department} (${form.month || 'N/A'}) — ${deptEmps.length} employees`,
      amount: parseFloat(form.amount),
      method: form.method,
      date: form.date,
      reference: `SAL-${Date.now()}`,
    };

    // Save payment record
    fetch('/api/generic/hr/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayments)
    }).catch(err => console.error('Failed to save payment:', err));

    // Save to cashbook
    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(existing => {
        const updated = Array.isArray(existing) ? [...existing, cashbookEntry] : [cashbookEntry];
        return fetch('/api/generic/accounts/cashbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
      })
      .catch(err => console.error('Failed to log to cashbook:', err));

    // Update employee pay_status
    deptEmps.forEach(emp => {
      fetch(`/api/hr/${emp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...emp, pay_status: 'Paid' })
      }).catch(() => {});
    });

    setPayments(updatedPayments);
    setForm({ department: '', month: '', amount: '', method: 'Bank Transfer', date: new Date().toISOString().split('T')[0] });
    alert(`₹${parseFloat(form.amount).toLocaleString()} salary payment recorded for ${form.department}. Cashbook updated.`);
  };

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <form className="hr-form" onSubmit={handleSubmit}>
      <SectionTitle title="Salary Payment" />
      <div className="form-grid">
        <FormField label="Department" required>
          <Select value={form.department} onChange={set('department')}>
            <option value="">-- Select Department --</option>
            <option value="All">All Departments</option>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </Select>
        </FormField>
        <FormField label="Salary Month">
          <Input type="month" value={form.month} onChange={set('month')} />
        </FormField>
        <FormField label="Total Amount ($)" required>
          <Input type="number" min="0" step="0.01" value={form.amount} onChange={set('amount')} placeholder="0.00" />
        </FormField>
        <FormField label="Payment Method" required>
          <Select value={form.method} onChange={set('method')}>
            <option>Bank Transfer</option>
            <option>Cash</option>
            <option>Cheque</option>
            <option>UPI</option>
          </Select>
        </FormField>
        <FormField label="Payment Date" required>
          <Input type="date" value={form.date} onChange={set('date')} />
        </FormField>
      </div>
      <SubmitBtn label="Submit Payment" />

      {/* Payment History */}
      {payments.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: '#1a2236', fontSize: 14 }}>Payment History</div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 700, color: '#16a34a' }}>
              Total Paid: ${totalPaid.toLocaleString()}
            </div>
          </div>
          <div className="table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>#</th><th>Department</th><th>Month</th><th>Amount</th><th>Method</th><th>Date</th><th>Employees</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.department}</td>
                    <td>{p.month || '—'}</td>
                    <td style={{ fontWeight: 600, color: '#16a34a' }}>${(p.amount || 0).toLocaleString()}</td>
                    <td>{p.method}</td>
                    <td>{p.date}</td>
                    <td>{p.employeeCount || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </form>
  );
}
