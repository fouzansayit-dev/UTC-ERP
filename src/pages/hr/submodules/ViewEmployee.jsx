import React, { useState, useEffect } from 'react';
import { FormField, Input, Select, SubmitBtn, DEPTS } from './HRComponents.jsx';

export default function ViewEmployee() {
  const savedUser = sessionStorage.getItem('uct_user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isAdmin = user?.role === 'Administrator';
  const isHR = user?.role === 'HR';

  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [editingEmp, setEditingEmp] = useState(null);

  const loadEmployees = () => {
    fetch('/api/hr')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error('Error loading employees:', err));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    fetch(`/api/hr/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete employee');
        setEmployees(prev => prev.filter(emp => emp.id !== id));
      })
      .catch(err => alert(err.message));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingEmp.name.trim() || !editingEmp.department.trim()) {
      alert('Name and Department are required.');
      return;
    }

    fetch(`/api/hr/${editingEmp.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editingEmp)
    })
      .then(async res => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to update employee details.');
        alert('Employee updated successfully!');
        setEditingEmp(null);
        loadEmployees();
      })
      .catch(err => alert(err.message));
  };

  const filtered = employees.filter(emp => {
    const q = search.toLowerCase().trim();
    return (
      (emp.name || '').toLowerCase().includes(q) ||
      (emp.empCode || emp.id.toString()).toLowerCase().includes(q) ||
      (emp.department || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="hr-form" style={{ position: 'relative' }}>
      <div className="form-field" style={{ maxWidth: 360 }}>
        <label className="form-label">Search Employee</label>
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, department or code..." />
      </div>
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Emp Code</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Mobile</th>
              {(isAdmin || isHR) && <th>Edit</th>}
              {isAdmin && <th>Delete</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : (isHR ? 7 : 6)} style={{ textAlign:'center', color:'#999', padding:24 }}>
                  No employees found.
                </td>
              </tr>
            ) : (
              filtered.map((emp, i) => (
                <tr key={emp.id}>
                  <td>{i + 1}</td>
                  <td>{emp.empCode || `EMP-${String(emp.id).padStart(3, '0')}`}</td>
                  <td style={{ fontWeight: 600 }}>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation || '—'}</td>
                  <td>{emp.mobile || emp.phone || '—'}</td>
                  {(isAdmin || isHR) && (
                    <td>
                      <button 
                        onClick={() => setEditingEmp(emp)}
                        style={{
                          background: '#0d5ef4', color: '#fff', border: 'none',
                          borderRadius: 4, padding: '4px 8px', fontSize: 12,
                          cursor: 'pointer', fontWeight: 600, marginRight: 4
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                  {isAdmin && (
                    <td>
                      <button 
                        onClick={() => handleDelete(emp.id)}
                        style={{
                          background: '#dc2626', color: '#fff', border: 'none',
                          borderRadius: 4, padding: '4px 8px', fontSize: 12,
                          cursor: 'pointer', fontWeight: 600
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Employee Modal */}
      {editingEmp && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 99999
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '24px 32px',
            width: '640px', maxWidth: '92%', boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 16
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              Edit Employee Details — {editingEmp.name}
            </h3>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Full Name" required>
                  <Input value={editingEmp.name || ''} onChange={e => setEditingEmp(p => ({ ...p, name: e.target.value }))} />
                </FormField>
                <FormField label="Department" required>
                  <Select value={editingEmp.department || ''} onChange={e => setEditingEmp(p => ({ ...p, department: e.target.value }))}>
                    <option value="">-- Select Department --</option>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </Select>
                </FormField>
                <FormField label="Designation">
                  <Select value={editingEmp.designation || ''} onChange={e => setEditingEmp(p => ({ ...p, designation: e.target.value }))}>
                    <option value="">-- Select Designation --</option>
                    <option>Professor</option><option>Associate Professor</option><option>Assistant Professor</option>
                    <option>Lecturer</option><option>Senior Resident</option><option>Junior Resident</option>
                    <option>HOD</option><option>Principal</option><option>Dean</option>
                    <option>Administrator</option><option>HR Manager</option><option>Accountant</option>
                    <option>Staff Nurse</option><option>Lab Technician</option><option>Abroad Coordinator</option>
                  </Select>
                </FormField>
                <FormField label="Mobile Number">
                  <Input value={editingEmp.mobile || editingEmp.phone || ''} onChange={e => setEditingEmp(p => ({ ...p, mobile: e.target.value, phone: e.target.value }))} />
                </FormField>
                <FormField label="Email Address">
                  <Input type="email" value={editingEmp.email || ''} onChange={e => setEditingEmp(p => ({ ...p, email: e.target.value }))} />
                </FormField>
                <FormField label="Basic Salary ($)">
                  <Input type="number" min="0" value={editingEmp.salary || ''} onChange={e => setEditingEmp(p => ({ ...p, salary: e.target.value }))} />
                </FormField>
                <FormField label="Payroll Status">
                  <Select value={editingEmp.pay_status || editingEmp.payStatus || 'Unpaid'} onChange={e => setEditingEmp(p => ({ ...p, pay_status: e.target.value, payStatus: e.target.value }))}>
                    <option>Paid</option>
                    <option>Unpaid</option>
                  </Select>
                </FormField>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <button type="button" onClick={() => setEditingEmp(null)} style={{ padding: '8px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 24px', background: '#0d5ef4', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(13,94,244,0.2)' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
