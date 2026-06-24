import React, { useState } from 'react';
import '../Student.css';
import StudentForm from './StudentForm.jsx';

export default function AddStudent() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (data) => {
    fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          throw new Error(body.error || 'Failed to add student');
        }
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      })
      .catch(err => {
        alert(err.message);
      });
  };

  return (
    <div className="stu-filter-card">
      <div className="stu-filter-header">Add Student</div>
      <div className="stu-filter-body">
        {submitted && (
          <div style={{
            background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 6,
            padding: '10px 16px', marginBottom: 16, color: '#15803d', fontSize: 13, fontWeight: 600
          }}>
            ✓ Student added successfully!
          </div>
        )}
        <StudentForm onSubmit={handleSubmit} submitLabel="Add Student" />
      </div>
    </div>
  );
}
