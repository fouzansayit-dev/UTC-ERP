import React, { useState } from 'react';
import { FormField, Input, SectionTitle, SubmitBtn } from './HRComponents.jsx';

export default function EmployeeImport() {
  const [file, setFile] = useState(null);
  const handleFile = (e) => setFile(e.target.files[0] || null);
  const handleDownload = () => {
    const csv = ['EmpCode,Name,Designation,Department,Gender,DOB,DOJ,Mobile,Email,BasicSalary'].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'employee_import_template.csv';
    a.click();
  };
  return (
    <div className="hr-form">
      <SectionTitle title="Import Instructions" />
      <ul style={{ fontSize:12, color:'#374151', paddingLeft:18, lineHeight:1.8, marginBottom:14 }}>
        <li>Download the template CSV below</li>
        <li>Fill in employee data — one row per employee</li>
        <li>Do not change column headers</li>
        <li>Save as .CSV and upload</li>
        <li>Supported formats: .csv, .xlsx</li>
      </ul>
      <button type="button" className="submit-btn" style={{ marginBottom:20 }} onClick={handleDownload}>Download Template</button>
      <form onSubmit={e => { e.preventDefault(); if (!file) { alert('Select a file'); return; } alert('File uploaded: ' + file.name); }}>
        <div className="form-grid">
          <FormField label="Upload File (.csv / .xlsx)" required>
            <Input type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} />
          </FormField>
        </div>
        {file && <div style={{ fontSize:12, color:'#6b7280', marginBottom:12 }}>Selected: <b>{file.name}</b></div>}
        <SubmitBtn label="Import Employees" />
      </form>
    </div>
  );
}
