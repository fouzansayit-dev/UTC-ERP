import React, { useState, useEffect } from 'react';
import '../../student/Student.css';

export default function ForexRemittance() {
  const [remittances, setRemittances] = useState([]);
  const [students, setStudents] = useState([]);
  const [unis, setUnis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    student_id: '', university_id: '', currency: 'USD', amount: '',
    exchange_rate: '', inr_equivalent: '', swift_no: '', rbi_purpose_code: 'S0103',
    status: 'Pending', bank: 'SBI', remittance_date: new Date().toISOString().split('T')[0]
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/students').then(res => res.json()),
      fetch('/api/abroad-masters/universities').then(res => res.json()),
      fetch('/api/generic/forex/remittances').then(res => res.json())
    ])
      .then(([studentsData, unisData, remittancesData]) => {
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setUnis(Array.isArray(unisData) ? unisData : []);
        setRemittances(Array.isArray(remittancesData) ? remittancesData : []);
        
        if (studentsData.length > 0 && !form.student_id) {
          setForm(prev => ({ ...prev, student_id: studentsData[0].id }));
        }
        if (unisData.length > 0 && !form.university_id) {
          setForm(prev => ({ ...prev, university_id: unisData[0].id }));
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

  const handleAmountChange = (amt, rate) => {
    const a = parseFloat(amt) || 0;
    const r = parseFloat(rate) || 0;
    setForm(prev => ({
      ...prev,
      amount: amt,
      exchange_rate: rate,
      inr_equivalent: Math.round(a * r)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.student_id || !form.university_id || !form.amount || !form.exchange_rate) {
      alert("Please fill in required details.");
      return;
    }
    
    const matchedStudent = students.find(s => s.id === Number(form.student_id));
    const matchedUni = unis.find(u => u.id === Number(form.university_id));

    const newRecord = {
      ...form,
      id: Date.now().toString(),
      student_name: matchedStudent ? matchedStudent.name : '—',
      university_name: matchedUni ? matchedUni.name : '—'
    };

    const updated = [...remittances, newRecord];
    fetch('/api/generic/forex/remittances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => {
        alert("Forex remittance logged successfully!");
        setForm(prev => ({
          ...prev, amount: '', exchange_rate: '', inr_equivalent: '', swift_no: ''
        }));
        loadData();
      })
      .catch(err => alert(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    const updated = remittances.filter(r => r.id !== id);
    fetch('/api/generic/forex/remittances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => loadData())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Forex Outward Remittance Tracker</div>
        <div className="stu-filter-body">
          <form onSubmit={handleSubmit} className="stu-form-grid" style={{ gap: '16px' }}>
            <div className="stu-field">
              <label>Select Student *</label>
              <select value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})}>
                <option value="">Select Candidate</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.scholar_no})</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>Target University *</label>
              <select value={form.university_id} onChange={e => setForm({...form, university_id: e.target.value})}>
                <option value="">Select Host University</option>
                {unis.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>Remittance Date</label>
              <input type="date" value={form.remittance_date} onChange={e => setForm({...form, remittance_date: e.target.value})} />
            </div>
            <div className="stu-field">
              <label>USD Amount *</label>
              <input type="number" value={form.amount} onChange={e => handleAmountChange(e.target.value, form.exchange_rate)} placeholder="e.g. 5000" />
            </div>
            <div className="stu-field">
              <label>Exchange Rate (INR/USD) *</label>
              <input type="number" step="0.01" value={form.exchange_rate} onChange={e => handleAmountChange(form.amount, e.target.value)} placeholder="e.g. 83.50" />
            </div>
            <div className="stu-field">
              <label>INR Equivalent (Calculated)</label>
              <input type="text" value={form.inr_equivalent} readOnly style={{ background: '#f1f5f9' }} />
            </div>
            <div className="stu-field">
              <label>SWIFT Number / Reference</label>
              <input type="text" value={form.swift_no} onChange={e => setForm({...form, swift_no: e.target.value})} placeholder="SWIFT MT103 reference code" />
            </div>
            <div className="stu-field">
              <label>RBI Purpose Code</label>
              <input type="text" value={form.rbi_purpose_code} onChange={e => setForm({...form, rbi_purpose_code: e.target.value})} placeholder="e.g. S0103" />
            </div>
            <div className="stu-field">
              <label>Remitting Bank</label>
              <input type="text" value={form.bank} onChange={e => setForm({...form, bank: e.target.value})} placeholder="e.g. HDFC Bank" />
            </div>
            <div className="stu-field">
              <label>Transfer Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option>Pending</option><option>Sent</option><option>SWIFT Confirmed</option><option>University Acknowledged</option>
              </select>
            </div>
            <div className="stu-field" style={{ justifyContent: 'center', gridColumn: 'span 3', marginTop: 12 }}>
              <button type="submit" className="stu-btn stu-btn-primary">Register Remittance Log</button>
            </div>
          </form>
        </div>
      </div>

      <div className="stu-table-wrap" style={{ marginTop: 20 }}>
        <div className="stu-table-title">Forex Remittance History Ledger</div>
        <table className="stu-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Host University</th>
              <th>Date</th>
              <th>FX Rate</th>
              <th>USD Value</th>
              <th>INR Equivalent</th>
              <th>SWIFT Reference</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {remittances.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: 20 }}>No remittances logged.</td></tr>
            ) : (
              remittances.map((r, idx) => (
                <tr key={r.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.student_name}</td>
                  <td>{r.university_name}</td>
                  <td>{r.remittance_date}</td>
                  <td>{r.exchange_rate}</td>
                  <td style={{ fontWeight: 'bold', color: '#16a34a' }}>${r.amount}</td>
                  <td style={{ fontWeight: 'bold' }}>₹{r.inr_equivalent}</td>
                  <td>{r.swift_no || '—'}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 'bold',
                      background: r.status === 'University Acknowledged' ? '#d4edda' : '#fff3cd',
                      color: r.status === 'University Acknowledged' ? '#155724' : '#856404'
                    }}>{r.status}</span>
                  </td>
                  <td>
                    <button className="stu-btn stu-btn-sm" style={{ background: '#dc2626', color: '#fff' }} onClick={() => handleDelete(r.id)}>Delete</button>
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
