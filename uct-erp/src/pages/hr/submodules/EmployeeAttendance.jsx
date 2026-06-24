import React, { useState, useEffect } from 'react';
import { FormField, Input, Select, SectionTitle, SubmitBtn, DEPTS } from './HRComponents.jsx';

export default function EmployeeAttendance() {
  const [form, setForm] = useState({
    department: '', date: new Date().toISOString().split('T')[0], timeSlot: 'Morning', status: ''
  });
  const [employees, setEmployees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    fetch('/api/hr')
      .then(res => res.json())
      .then(data => setEmployees(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading employees:', err));

    fetch('/api/generic/hr/attendance')
      .then(res => res.json())
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading attendance:', err));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.department) { alert('Please select a department.'); return; }
    if (!form.status) { alert('Please select attendance status.'); return; }
    if (!form.date) { alert('Please select a date.'); return; }

    const deptEmps = employees.filter(emp =>
      form.department === 'All' || (emp.department || '').toLowerCase().includes(form.department.toLowerCase())
    );

    if (deptEmps.length === 0) { alert('No employees found for selected department.'); return; }

    // Mark attendance for all department employees
    const attendanceEntries = deptEmps.map(emp => ({
      logId: Date.now() + Math.random(),
      empId: emp.id,
      empName: emp.name,
      department: emp.department,
      date: form.date,
      timeSlot: form.timeSlot,
      status: form.status,
      markedAt: new Date().toISOString(),
    }));

    const updatedLogs = [...logs, ...attendanceEntries];

    // Update each employee's attendance_status in the DB
    deptEmps.forEach(emp => {
      fetch(`/api/hr/${emp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...emp, attendance_status: form.status })
      }).catch(() => {});
    });

    // Save attendance log
    fetch('/api/generic/hr/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLogs)
    })
      .then(() => {
        setLogs(updatedLogs);
        alert(`Attendance marked "${form.status}" for ${deptEmps.length} employee(s) in ${form.department} on ${form.date}.`);
        setForm({ department: '', date: new Date().toISOString().split('T')[0], timeSlot: 'Morning', status: '' });
      })
      .catch(err => alert('Failed to save attendance: ' + err.message));
  };

  // Today's logs
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date === today);
  const filtered = todayLogs.filter(l =>
    (l.empName || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = filtered.filter(l => l.status === 'Present').length;
  const absentCount  = filtered.filter(l => l.status === 'Absent').length;

  return (
    <form className="hr-form" onSubmit={handleSubmit}>
      <SectionTitle title="Mark Employee Attendance" />
      <div className="form-grid">
        <FormField label="Department" required>
          <Select value={form.department} onChange={set('department')}>
            <option value="">-- Select Department --</option>
            <option value="All">All Departments</option>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </Select>
        </FormField>
        <FormField label="Date" required>
          <Input type="date" value={form.date} onChange={set('date')} />
        </FormField>
        <FormField label="Time Slot">
          <Select value={form.timeSlot} onChange={set('timeSlot')}>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </Select>
        </FormField>
        <FormField label="Status" required>
          <Select value={form.status} onChange={set('status')}>
            <option value="">-- Select Status --</option>
            <option>Present</option>
            <option>Absent</option>
            <option>Leave</option>
            <option>Half Day</option>
          </Select>
        </FormField>
      </div>
      <SubmitBtn label="Mark Attendance" />

      {/* Today's Summary */}
      {todayLogs.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: '#1a2236', fontSize: 14 }}>Today's Attendance</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#16a34a' }}>
                ✓ Present: {presentCount}
              </span>
              <span style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#dc2626' }}>
                ✗ Absent: {absentCount}
              </span>
            </div>
            <Input style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>#</th><th>Employee</th><th>Department</th><th>Time Slot</th><th>Status</th><th>Marked At</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="empty-table-msg">No attendance records for today</td></tr>
                ) : filtered.map((l, i) => (
                  <tr key={l.logId}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{l.empName}</td>
                    <td>{l.department}</td>
                    <td>{l.timeSlot}</td>
                    <td>
                      <span style={{
                        background: l.status === 'Present' ? '#dcfce7' : l.status === 'Absent' ? '#fee2e2' : '#fef9c3',
                        color: l.status === 'Present' ? '#16a34a' : l.status === 'Absent' ? '#dc2626' : '#92400e',
                        padding: '2px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600
                      }}>
                        {l.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: '#94a3b8' }}>
                      {new Date(l.markedAt).toLocaleTimeString()}
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
