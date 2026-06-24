import React, { useState, useRef } from 'react';

const HEADERS = ['EmpCode','Name','Designation','Department','Gender','DOB','DOJ','Mobile','Email','BasicSalary'];

function handleTableAction(action) {
  var tbl = document.querySelector('.hr-table'); if (!tbl) return;
  if (action === 'Print') {
    var w = window.open('', '_blank');
    w.document.write('<html><head><title>Import Employee</title><style>body{font-family:Arial,sans-serif;padding:16px;font-size:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:5px 8px}th{background:#1e3a5f;color:#fff}tr:nth-child(even){background:#f5f5f5}</style></head><body><h2>Import Employee Preview</h2>' + tbl.outerHTML + '</body></html>');
    w.document.close(); w.print();
  } else if (action === 'CSV') {
    var rows = Array.from(tbl.querySelectorAll('tr')).map(function(r) {
      return Array.from(r.querySelectorAll('th,td')).map(function(c) { return '"' + c.innerText.replace(/"/g,'""') + '"'; }).join(',');
    });
    var blob = new Blob([rows.join('\r\n')], { type: 'text/csv' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'employee_import.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } else {
    var rows2 = Array.from(tbl.querySelectorAll('tr')).map(function(r) {
      return Array.from(r.querySelectorAll('th,td')).map(function(c) { return c.innerText; }).join('\t');
    });
    navigator.clipboard.writeText(rows2.join('\n')).then(function() { alert('Copied!'); });
  }
}

function downloadTemplate() {
  var csv = [HEADERS.join(','), 'EMP001,John Silva,Lecturer,Science,Male,1985-06-15,2020-01-10,7771110001,john@uct.edu,25000'].join('\n');
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'employee_import_template.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

export default function ImportEmployee() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [search, setSearch] = useState('');
  const fileRef = useRef();

  function handleFile(e) {
    var f = e.target.files[0]; if (!f) return;
    setFile(f);
    var reader = new FileReader();
    reader.onload = function(ev) {
      var lines = ev.target.result.trim().split('\n').slice(1);
      setPreview(lines.map(function(l) {
        return l.split(',').map(function(c) { return c.trim().replace(/^"|"$/g, ''); });
      }).filter(function(r) { return r.some(function(c) { return c; }); }));
    };
    reader.readAsText(f);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!file) { alert('Please select a file to import.'); return; }
    alert('Imported ' + preview.length + ' employee record(s) from "' + file.name + '".');
    setFile(null); setPreview([]);
    if (fileRef.current) fileRef.current.value = '';
  }

  var filtered = preview.filter(function(r) {
    return r.some(function(c) { return c.toLowerCase().includes(search.toLowerCase()); });
  });

  return (
    <div className="hr-form">
      <div className="section-title">Import Employee</div>

      <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8, padding:'12px 16px', marginBottom:18, fontSize:13, color:'#1e40af' }}>
        <b>Instructions:</b>
        <ul style={{ margin:'6px 0 0', paddingLeft:20, lineHeight:1.9 }}>
          <li>Download the template CSV, fill employee data (one row per employee)</li>
          <li>Do not change column headers</li>
          <li>Required: EmpCode, Name, Department &nbsp;|&nbsp; Supported: <b>.csv, .xlsx</b></li>
        </ul>
      </div>

      <button type="button" className="submit-btn" style={{ marginBottom:20, background:'#0f766e' }} onClick={downloadTemplate}>
        ⬇ Download Template
      </button>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Upload File (.csv / .xlsx) <span className="req">*</span></label>
            <input ref={fileRef} className="form-input" type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} />
          </div>
        </div>
        {file && (
          <div style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>
            Selected: <b>{file.name}</b> — {preview.length} row(s) detected
          </div>
        )}
        <div className="form-submit-row">
          <button className="submit-btn" type="submit">Import Employees</button>
        </div>
      </form>

      {preview.length > 0 && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:28 }}>
            <div style={{ display:'flex', gap:8 }}>
              {['Copy','CSV','Print'].map(function(b) {
                return (
                  <button key={b} className="tbl-btn view"
                    style={{ background:'#f1f5f9', color:'#374151' }}
                    onClick={function() { handleTableAction(b); }}>
                    {b}
                  </button>
                );
              })}
            </div>
            <input className="form-input" style={{ width:220 }} placeholder="Search..."
              value={search} onChange={function(e) { setSearch(e.target.value); }} />
          </div>
          <div className="table-wrap">
            <table className="hr-table">
              <thead>
                <tr><th>S.No</th>{HEADERS.map(function(h) { return <th key={h}>{h}</th>; })}</tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={HEADERS.length + 1} className="empty-table-msg">No matching records</td></tr>
                  : filtered.map(function(r, i) {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        {HEADERS.map(function(_, j) { return <td key={j}>{r[j] || '—'}</td>; })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize:13, color:'#6b7280', marginTop:8 }}>
            Showing {filtered.length} of {preview.length} entries
          </div>
        </div>
      )}
    </div>
  );
}
