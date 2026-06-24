import React, { useState, useEffect } from 'react';
import '../../student/Student.css';

export default function NmcInternship() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    student_id: '', hospital_name: '', start_date: '', end_date: '',
    fmge_status: 'Pending', registration_no: '', notes: ''
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/students').then(res => res.json()),
      fetch('/api/generic/internship/records').then(res => res.json())
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
    if (!form.student_id || !form.hospital_name || !form.start_date || !form.end_date) {
      alert("Please fill in required fields.");
      return;
    }
    
    const matchedStudent = students.find(s => s.id === Number(form.student_id));
    
    const newRecord = {
      ...form,
      id: Date.now().toString(),
      student_name: matchedStudent ? matchedStudent.name : '—',
      roll_no: matchedStudent ? matchedStudent.roll_no || matchedStudent.scholar_no : '—'
    };

    const updated = [...records, newRecord];
    fetch('/api/generic/internship/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => {
        alert("Internship status saved successfully!");
        setForm(prev => ({
          ...prev, hospital_name: '', start_date: '', end_date: '', registration_no: '', notes: ''
        }));
        loadData();
      })
      .catch(err => alert(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    const updated = records.filter(r => r.id !== id);
    fetch('/api/generic/internship/records', {
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
        <div className="stu-filter-header">NMC Internship & FMGE/NExT Progress Tracker</div>
        <div className="stu-filter-body">
          <form onSubmit={handleSubmit} className="stu-form-grid" style={{ gap: '16px' }}>
            <div className="stu-field">
              <label>Select Graduate Student *</label>
              <select value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})}>
                <option value="">Select Candidate</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no || s.scholar_no})</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>Training Hospital *</label>
              <input type="text" value={form.hospital_name} onChange={e => setForm({...form, hospital_name: e.target.value})} placeholder="Hospital Name" />
            </div>
            <div className="stu-field">
              <label>Start Date *</label>
              <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
            </div>
            <div className="stu-field">
              <label>Expected Completion *</label>
              <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
            </div>
            <div className="stu-field">
              <label>FMGE / NExT Status</label>
              <select value={form.fmge_status} onChange={e => setForm({...form, fmge_status: e.target.value})}>
                <option>Pending</option><option>Cleared</option><option>Failed</option>
              </select>
            </div>
            <div className="stu-field">
              <label>State Council Reg No</label>
              <input type="text" value={form.registration_no} onChange={e => setForm({...form, registration_no: e.target.value})} placeholder="Registration Number" />
            </div>
            <div className="stu-field stu-form-col-2">
              <label>Additional Intern Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Log evaluations or logs..." />
            </div>
            <div className="stu-field" style={{ justifyContent: 'center', gridColumn: 'span 3', marginTop: 12 }}>
              <button type="submit" className="stu-btn stu-btn-primary">Record Internship File</button>
            </div>
          </form>
        </div>
      </div>

      <div className="stu-table-wrap" style={{ marginTop: 20 }}>
        <div className="stu-table-title">Intern Roster & Exam Statuses</div>
        <table className="stu-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Graduate Name</th>
              <th>Roll No</th>
              <th>Hospital Name</th>
              <th>Internship Period</th>
              <th>FMGE Status</th>
              <th>Council Reg No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 20 }}>No records found.</td></tr>
            ) : (
              records.map((r, idx) => (
                <tr key={r.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.student_name}</td>
                  <td>{r.roll_no}</td>
                  <td>{r.hospital_name}</td>
                  <td>{r.start_date} to {r.end_date}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 'bold',
                      background: r.fmge_status === 'Cleared' ? '#d4edda' : '#f8d7da',
                      color: r.fmge_status === 'Cleared' ? '#155724' : '#721c24'
                    }}>{r.fmge_status}</span>
                  </td>
                  <td>{r.registration_no || '—'}</td>
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
