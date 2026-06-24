import React, { useState, useEffect } from 'react';
import '../../student/Student.css';

export default function CountryMaster() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', currency: '', currency_code: '', embassy_city: '', nmc_status: 1 });

  const loadCountries = () => {
    setLoading(true);
    fetch('/api/abroad-masters/countries')
      .then(res => res.json())
      .then(data => {
        setCountries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setCountries([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.currency || !form.currency_code || !form.embassy_city) {
      alert("Please fill in all details.");
      return;
    }
    fetch('/api/abroad-masters/countries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save country.");
        return res.json();
      })
      .then(() => {
        alert("Country registered successfully!");
        setForm({ name: '', currency: '', currency_code: '', embassy_city: '', nmc_status: 1 });
        loadCountries();
      })
      .catch(err => alert(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    fetch(`/api/abroad-masters/countries/${id}`, { method: 'DELETE' })
      .then(() => loadCountries())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Country Master Settings</div>
        <div className="stu-filter-body">
          <form onSubmit={handleSubmit} className="stu-form-grid" style={{ gap: '16px' }}>
            <div className="stu-field">
              <label>Country Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Russia" />
            </div>
            <div className="stu-field">
              <label>Currency Name *</label>
              <input type="text" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} placeholder="e.g. Russian Ruble" />
            </div>
            <div className="stu-field">
              <label>Currency Code *</label>
              <input type="text" value={form.currency_code} onChange={e => setForm({...form, currency_code: e.target.value})} placeholder="e.g. RUB" />
            </div>
            <div className="stu-field">
              <label>Embassy City *</label>
              <input type="text" value={form.embassy_city} onChange={e => setForm({...form, embassy_city: e.target.value})} placeholder="e.g. Moscow" />
            </div>
            <div className="stu-field">
              <label>NMC Recognition Status</label>
              <select value={form.nmc_status} onChange={e => setForm({...form, nmc_status: Number(e.target.value)})}>
                <option value={1}>Recognized</option>
                <option value={0}>Not Recognized</option>
              </select>
            </div>
            <div className="stu-field" style={{ justifyContent: 'center', gridColumn: 'span 2', marginTop: 12 }}>
              <button type="submit" className="stu-btn stu-btn-primary">Register Country</button>
            </div>
          </form>
        </div>
      </div>

      <div className="stu-table-wrap" style={{ marginTop: 20 }}>
        <div className="stu-table-title">Configured Countries</div>
        <table className="stu-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Country Name</th>
              <th>Currency</th>
              <th>Currency Code</th>
              <th>Embassy City</th>
              <th>NMC Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>No records found.</td></tr>
            ) : (
              countries.map((c, idx) => (
                <tr key={c.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.currency}</td>
                  <td>{c.currency_code}</td>
                  <td>{c.embassy_city}</td>
                  <td>{c.nmc_status === 1 ? "✅ Recognized" : "❌ No"}</td>
                  <td>
                    <button className="stu-btn stu-btn-sm" style={{ background: '#dc2626', color: '#fff' }} onClick={() => handleDelete(c.id)}>Delete</button>
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
