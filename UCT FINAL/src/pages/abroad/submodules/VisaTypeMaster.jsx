import React, { useState, useEffect } from 'react';
import '../../student/Student.css';

export default function VisaTypeMaster() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', country: 'Russia', validity: '12', buffer: '60' });

  const loadTypes = () => {
    setLoading(true);
    fetch('/api/generic/visa-master/types')
      .then(res => res.json())
      .then(data => {
        setTypes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setTypes([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.validity || !form.buffer) {
      alert("Please fill in all details.");
      return;
    }
    const updated = [...types, { ...form, id: Date.now().toString() }];
    
    fetch('/api/generic/visa-master/types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => {
        alert("Visa type registered successfully!");
        setForm({ name: '', country: 'Russia', validity: '12', buffer: '60' });
        loadTypes();
      })
      .catch(err => alert(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    const updated = types.filter(t => t.id !== id);
    fetch('/api/generic/visa-master/types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => loadTypes())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Visa Type Configuration</div>
        <div className="stu-filter-body">
          <form onSubmit={handleSubmit} className="stu-form-grid" style={{ gap: '16px' }}>
            <div className="stu-field">
              <label>Visa Designation *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Student Visa D-type" />
            </div>
            <div className="stu-field">
              <label>Country *</label>
              <select value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
                {['Russia','Philippines','Kazakhstan','Georgia','Kyrgyzstan','Bangladesh','Ukraine'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="stu-field">
              <label>Validity (Months) *</label>
              <input type="number" value={form.validity} onChange={e => setForm({...form, validity: e.target.value})} placeholder="Validity in months" />
            </div>
            <div className="stu-field">
              <label>Renewal Buffer (Days) *</label>
              <input type="number" value={form.buffer} onChange={e => setForm({...form, buffer: e.target.value})} placeholder="Default 60 days before expiry" />
            </div>
            <div className="stu-field" style={{ justifyContent: 'center', gridColumn: 'span 2', marginTop: 12 }}>
              <button type="submit" className="stu-btn stu-btn-primary">Add Visa Type</button>
            </div>
          </form>
        </div>
      </div>

      <div className="stu-table-wrap" style={{ marginTop: 20 }}>
        <div className="stu-table-title">Configured Visa Classifications</div>
        <table className="stu-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Designation</th>
              <th>Country</th>
              <th>Validity</th>
              <th>Renewal Buffer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>No records configured.</td></tr>
            ) : (
              types.map((t, idx) => (
                <tr key={t.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td>{t.country}</td>
                  <td>{t.validity} months</td>
                  <td>{t.buffer} days before expiry</td>
                  <td>
                    <button className="stu-btn stu-btn-sm" style={{ background: '#dc2626', color: '#fff' }} onClick={() => handleDelete(t.id)}>Delete</button>
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
