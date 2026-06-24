import React, { useState, useEffect } from 'react';
import '../../student/Student.css';

export default function AnnualReturnVisit() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    student_id: '', return_date: '', redeparture_date: '',
    passport_status: 'Valid', visa_status: 'Valid', notes: ''
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/students').then(res => res.json()),
      fetch('/api/generic/visits/records').then(res => res.json())
    ])
      .then(([studentsData, recordsData]) => {
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setRecords(Array.isArray(recordsData) ? recordsData : []);
        if (studentsData.length > 0 && !form.student_id) {
          setForm(prev => ({ ...prev, student_id: studentsData[0].id }));
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
    if (!form.student_id || !form.return_date || !form.redeparture_date) {
      alert("Please fill in required fields.");
      return;
    }
    
    const matchedStudent = students.find(s => s.id === Number(form.student_id));
    
    const newRecord = {
      ...form,
      id: Date.now().toString(),
      student_name: matchedStudent ? matchedStudent.name : '—',
      roll_no: matchedStudent ? matchedStudent.roll_no || matchedStudent.scholar_no : '—',
      country: matchedStudent ? matchedStudent.country || '—' : '—'
    };

    const updated = [...records, newRecord];
    fetch('/api/generic/visits/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => {
        alert("Annual return visit logged successfully!");
        setForm(prev => ({
          ...prev, return_date: '', redeparture_date: '', notes: ''
        }));
        loadData();
      })
      .catch(err => alert(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    const updated = records.filter(r => r.id !== id);
    fetch('/api/generic/visits/records', {
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
        <div className="stu-filter-header">Annual Return Visit Management</div>
        <div className="stu-filter-body">
          <form onSubmit={handleSubmit} className="stu-form-grid" style={{ gap: '16px' }}>
            <div className="stu-field">
              <label>Select Student *</label>
              <select value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})}>
                <option value="">Select Candidate</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no || s.scholar_no})</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>Return Date *</label>
              <input type="date" value={form.return_date} onChange={e => setForm({...form, return_date: e.target.value})} />
            </div>
            <div className="stu-field">
              <label>Re-Departure Date *</label>
              <input type="date" value={form.redeparture_date} onChange={e => setForm({...form, redeparture_date: e.target.value})} />
            </div>
            <div className="stu-field">
              <label>Passport Audit</label>
              <select value={form.passport_status} onChange={e => setForm({...form, passport_status: e.target.value})}>
                <option>Valid</option><option>Expired</option><option>Needs Renewal</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Visa Status Review</label>
              <select value={form.visa_status} onChange={e => setForm({...form, visa_status: e.target.value})}>
                <option>Valid</option><option>Needs Stamping</option><option>Expired</option>
              </select>
            </div>
            <div className="stu-field stu-form-col-2">
              <label>Log Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Notes regarding flights, tickets, and clearances..." />
            </div>
            <div className="stu-field" style={{ justifyContent: 'center', gridColumn: 'span 3', marginTop: 12 }}>
              <button type="submit" className="stu-btn stu-btn-primary">Register Return Log</button>
            </div>
          </form>
        </div>
      </div>

      <div className="stu-table-wrap" style={{ marginTop: 20 }}>
        <div className="stu-table-title">Return Logs & Clearance History</div>
        <table className="stu-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Roll No</th>
              <th>Return Date</th>
              <th>Re-Departure Date</th>
              <th>Passport check</th>
              <th>Visa check</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 20 }}>No logs recorded.</td></tr>
            ) : (
              records.map((r, idx) => (
                <tr key={r.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.student_name}</td>
                  <td>{r.roll_no}</td>
                  <td>{r.return_date}</td>
                  <td>{r.redeparture_date}</td>
                  <td>{r.passport_status}</td>
                  <td>{r.visa_status}</td>
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
