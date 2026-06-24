import React, { useState, useEffect } from 'react';
import '../../student/Student.css';

export default function UniversityMaster() {
  const [unis, setUnis] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', country_id: '', ranking: '', nmc_approved: 1, who_approved: 1,
    annual_fee: '', intake_month: 'September', coordinator_name: '', coordinator_phone: ''
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/abroad-masters/countries').then(res => res.json()),
      fetch('/api/abroad-masters/universities').then(res => res.json())
    ])
      .then(([countriesData, unisData]) => {
        setCountries(Array.isArray(countriesData) ? countriesData : []);
        setUnis(Array.isArray(unisData) ? unisData : []);
        if (countriesData.length > 0 && !form.country_id) {
          setForm(prev => ({ ...prev, country_id: countriesData[0].id }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.country_id || !form.annual_fee || !form.intake_month) {
      alert("Please fill in required fields.");
      return;
    }
    fetch('/api/abroad-masters/universities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to register university.");
        return res.json();
      })
      .then(() => {
        alert("University registered successfully!");
        setForm(prev => ({
          ...prev, name: '', ranking: '', annual_fee: '', coordinator_name: '', coordinator_phone: ''
        }));
        loadData();
      })
      .catch(err => alert(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    fetch(`/api/abroad-masters/universities/${id}`, { method: 'DELETE' })
      .then(() => loadData())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Foreign University Master Settings</div>
        <div className="stu-filter-body">
          <form onSubmit={handleSubmit} className="stu-form-grid" style={{ gap: '16px' }}>
            <div className="stu-field">
              <label>University Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Kazan State Medical University" />
            </div>
            <div className="stu-field">
              <label>Country *</label>
              <select value={form.country_id} onChange={e => setForm({...form, country_id: e.target.value})}>
                <option value="">Select Country</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>Ranking</label>
              <input type="number" value={form.ranking} onChange={e => setForm({...form, ranking: e.target.value})} placeholder="QS Global Ranking" />
            </div>
            <div className="stu-field">
              <label>Annual Tuition Fee ($) *</label>
              <input type="number" value={form.annual_fee} onChange={e => setForm({...form, annual_fee: e.target.value})} placeholder="e.g. 4500" />
            </div>
            <div className="stu-field">
              <label>Intake Month *</label>
              <select value={form.intake_month} onChange={e => setForm({...form, intake_month: e.target.value})}>
                <option>September</option><option>October</option><option>January</option><option>February</option>
              </select>
            </div>
            <div className="stu-field">
              <label>NMC Approved</label>
              <select value={form.nmc_approved} onChange={e => setForm({...form, nmc_approved: Number(e.target.value)})}>
                <option value={1}>Yes</option><option value={0}>No</option>
              </select>
            </div>
            <div className="stu-field">
              <label>WHO Approved</label>
              <select value={form.who_approved} onChange={e => setForm({...form, who_approved: Number(e.target.value)})}>
                <option value={1}>Yes</option><option value={0}>No</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Coordinator Name</label>
              <input type="text" value={form.coordinator_name} onChange={e => setForm({...form, coordinator_name: e.target.value})} placeholder="Local coordinator contact" />
            </div>
            <div className="stu-field">
              <label>Coordinator Phone</label>
              <input type="text" value={form.coordinator_phone} onChange={e => setForm({...form, coordinator_phone: e.target.value})} placeholder="Coordinator mobile" />
            </div>
            <div className="stu-field" style={{ justifyContent: 'center', gridColumn: 'span 3', marginTop: 12 }}>
              <button type="submit" className="stu-btn stu-btn-primary">Register University</button>
            </div>
          </form>
        </div>
      </div>

      <div className="stu-table-wrap" style={{ marginTop: 20 }}>
        <div className="stu-table-title">Configured Foreign Universities</div>
        <table className="stu-table">
          <thead>
            <tr>
              <th>#</th>
              <th>University</th>
              <th>Country</th>
              <th>Ranking</th>
              <th>Fee ($)</th>
              <th>Intake</th>
              <th>Approvals</th>
              <th>Coordinator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unis.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: 20 }}>No records found.</td></tr>
            ) : (
              unis.map((u, idx) => (
                <tr key={u.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.country_name || '—'}</td>
                  <td>{u.ranking || '—'}</td>
                  <td>${u.annual_fee}</td>
                  <td>{u.intake_month}</td>
                  <td>
                    {u.nmc_approved ? 'NMC ' : ''}
                    {u.who_approved ? 'WHO' : ''}
                  </td>
                  <td>{u.coordinator_name || '—'} {u.coordinator_phone ? `(${u.coordinator_phone})` : ''}</td>
                  <td>
                    <button className="stu-btn stu-btn-sm" style={{ background: '#dc2626', color: '#fff' }} onClick={() => handleDelete(u.id)}>Delete</button>
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
