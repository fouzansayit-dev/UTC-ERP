import React, { useState, useEffect } from 'react';
import { FormField, Select, SectionTitle, SubmitBtn, MONTHS, YEARS, DEPTS } from './HRComponents.jsx';

export default function GenerateSalary() {
  const [form, setForm] = useState({ department: '', month: '', year: '', basic: '', allowances: '', deductions: '' });
  const [employees, setEmployees] = useState([]);
  const [salaryRuns, setSalaryRuns] = useState([]);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/hr')
      .then(res => res.json())
      .then(data => setEmployees(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading employees:', err));

    fetch('/api/generic/hr/salaries')
      .then(res => res.json())
      .then(data => setSalaryRuns(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading salary runs:', err));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.department) { alert('Please select a department.'); return; }
    if (!form.month || !form.year) { alert('Please select month and year.'); return; }

    // Filter employees in department
    const deptEmps = employees.filter(emp =>
      form.department === 'All' || (emp.department || '').toLowerCase().includes(form.department.toLowerCase())
    );

    if (deptEmps.length === 0) { alert('No employees found in the selected department.'); return; }

    const salaryEntries = deptEmps.map(emp => ({
      empId: emp.id,
      empName: emp.name,
      department: emp.department,
      basicSalary: parseFloat(form.basic) || emp.salary || 0,
      allowances: parseFloat(form.allowances) || 0,
      deductions: parseFloat(form.deductions) || 0,
      netSalary: (parseFloat(form.basic) || emp.salary || 0) + (parseFloat(form.allowances) || 0) - (parseFloat(form.deductions) || 0),
      month: form.month,
      year: form.year,
      status: 'Generated',
      generatedAt: new Date().toISOString(),
    }));

    const updatedRuns = [...salaryRuns, { id: Date.now(), entries: salaryEntries, month: form.month, year: form.year, department: form.department }];

    fetch('/api/generic/hr/salaries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRuns)
    })
      .then(() => {
        setSalaryRuns(updatedRuns);
        alert(`Salary generated for ${deptEmps.length} employee(s) in ${form.department} for ${form.month} ${form.year}.`);
        setForm({ department: '', month: '', year: '', basic: '', allowances: '', deductions: '' });
      })
      .catch(err => alert('Failed to generate salary: ' + err.message));
  };

  return (
    <form className="hr-form" onSubmit={handleSubmit}>
      <SectionTitle title="Salary Generation" />
      <div className="form-grid">
        <FormField label="Department" required>
          <Select value={form.department} onChange={set('department')}>
            <option value="">-- Select Department --</option>
            <option value="All">All Departments</option>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </Select>
        </FormField>
        <FormField label="Month" required>
          <Select value={form.month} onChange={set('month')}>
            <option value="">-- Select Month --</option>
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </Select>
        </FormField>
        <FormField label="Year" required>
          <Select value={form.year} onChange={set('year')}>
            <option value="">-- Select Year --</option>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </Select>
        </FormField>
        <FormField label="Override Basic Salary (leave blank to use employee record)">
          <input className="form-input" type="number" min="0" value={form.basic} onChange={set('basic')} placeholder="Leave blank for individual salaries" />
        </FormField>
        <FormField label="Additional Allowances">
          <input className="form-input" type="number" min="0" value={form.allowances} onChange={set('allowances')} placeholder="0.00" />
        </FormField>
        <FormField label="Deductions">
          <input className="form-input" type="number" min="0" value={form.deductions} onChange={set('deductions')} placeholder="0.00" />
        </FormField>
      </div>

      <SubmitBtn label="Generate Salary" />

      {/* Generated Runs */}
      {salaryRuns.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 700, color: '#1a2236', marginBottom: 12, fontSize: 14 }}>Salary Generation History</div>
          <div className="table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>#</th><th>Department</th><th>Month</th><th>Year</th><th>Employees</th><th>Generated At</th>
                </tr>
              </thead>
              <tbody>
                {salaryRuns.map((run, i) => (
                  <tr key={run.id}>
                    <td>{i + 1}</td>
                    <td>{run.department}</td>
                    <td>{run.month}</td>
                    <td>{run.year}</td>
                    <td>{run.entries?.length || 0}</td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>
                      {run.entries?.[0]?.generatedAt ? new Date(run.entries[0].generatedAt).toLocaleString() : '—'}
                    </td>
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
