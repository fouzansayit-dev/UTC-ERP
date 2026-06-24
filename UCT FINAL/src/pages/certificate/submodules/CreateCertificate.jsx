import React, { useState } from 'react';

export default function CreateCertificate() {
  const [form, setForm] = useState({
    course: 'All', branchName: 'All',
    batch: 'All', selectCertificate: '',
    searchByName: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="hr-form">
      <div className="section-title">Create Certificate</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', maxWidth: 900,
      }}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Course</label>
            <select className="form-input" value={form.course} onChange={e => set('course', e.target.value)}>
              <option>All</option>
              <option>MBBS</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Branch Name</label>
            <select className="form-input" value={form.branchName} onChange={e => set('branchName', e.target.value)}>
              <option>All</option>
              <option>MEDICINE</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Batch</label>
            <select className="form-input" value={form.batch} onChange={e => set('batch', e.target.value)}>
              <option>All</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Select Certificate</label>
            <select className="form-input" value={form.selectCertificate} onChange={e => set('selectCertificate', e.target.value)}>
              <option value="">Select</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Search by Name / Scholar No</label>
            <input className="form-input" placeholder="Enter name or scholar no" value={form.searchByName} onChange={e => set('searchByName', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
