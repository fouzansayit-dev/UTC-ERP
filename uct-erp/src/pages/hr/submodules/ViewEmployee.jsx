import React, { useState, useEffect } from 'react';
import { FormField, Input } from './HRComponents.jsx';

export default function ViewEmployee() {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);

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

  const filtered = employees.filter(emp => {
    const q = search.toLowerCase().trim();
    return (
      (emp.name || '').toLowerCase().includes(q) ||
      (emp.empCode || emp.id.toString()).toLowerCase().includes(q) ||
      (emp.department || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="hr-form">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign:'center', color:'#999', padding:24 }}>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
