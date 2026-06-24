import React, { useState, useRef } from 'react';

const HEADERS = ['AdmNo','StudentName','Course','Batch','FeeHead','DueAmount','DueDate','Remarks'];

function handleTableAction(action) {
  var tbl = document.querySelector('.hr-table'); if (!tbl) return;
  if (action === 'Print') {
    var w = window.open('', '_blank');
    w.document.write('<html><head><title>Due Fee Upload</title><style>body{font-family:Arial,sans-serif;padding:16px;font-size:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:5px 8px}th{background:#1e3a5f;color:#fff}tr:nth-child(even){background:#f5f5f5}</style></head><body><h2>Due Fee Upload Preview</h2>' + tbl.outerHTML + '</body></html>');
    w.document.close(); w.print();
  } else if (action === 'CSV') {
    var rows = Array.from(tbl.querySelectorAll('tr')).map(function(r) {
      return Array.from(r.querySelectorAll('th,td')).map(function(c) { return '"' + c.innerText.replace(/"/g,'""') + '"'; }).join(',');
    });
    var blob = new Blob([rows.join('\r\n')], { type: 'text/csv' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'due_fee_upload.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } else {
    var rows2 = Array.from(tbl.querySelectorAll('tr')).map(function(r) {
      return Array.from(r.querySelectorAll('th,td')).map(function(c) { return c.innerText; }).join('\t');
    });
    navigator.clipboard.writeText(rows2.join('\n')).then(function() { alert('Copied!'); });
  }
}

function downloadTemplate() {
  var csv = [HEADERS.join(','), 'ADM001,John Silva,MBBS,2024,Tuition Fee,5000,2024-07-31,'].join('\n');
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'due_fee_upload_template.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

export default function DueFeeUpload() {
  const [form, setForm] = useState({ session:'', course:'' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [search, setSearch] = useState('');
  const fileRef = useRef();

  var set = function(k, v) { setForm(function(p) { return Object.assign({}, p, { [k]: v }); }); };

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
    if (!form.session) { alert('Please select a session.'); return; }
    if (!file) { alert('Please select a file.'); return; }
    alert('Uploaded ' + preview.length + ' due fee record(s) from "' + file.name + '".');
    setFile(null); setPreview([]);
    if (fileRef.current) fileRef.current.value = '';
  }

  var filtered = preview.filter(function(r) {
    return r.some(function(c) { return c.toLowerCase().includes(search.toLowerCase()); });
  });

  return (
    <div className="hr-form">
      <div className="section-title">Due Fee Upload</div>
      <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8, padding:'12px 16px', marginBottom:18, fontSize:13, color:'#1e40af' }}>
        <b>Instructions:</b>
        <ul style={{ margin:'6px 0 0', paddingLeft:20, lineHeight:1.9 }}>
          <li>Download template, fill fee receipt data. Required: AdmNo, FeeHead, DueAmount, DueDate</li>
          <li>Date format: <b>YYYY-MM-DD</b> &nbsp;|&nbsp; Amount must be numeric &nbsp;|&nbsp; Supported: <b>.csv, .xlsx</b></li>
        </ul>
      </div>
      <button type="button" className="submit-btn" style={{ marginBottom:20, background:'#0f766e' }} onClick={downloadTemplate}>
        ⬇ Download Template
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Session <span className="req">*</span></label>
            <select className="form-input" value={form.session} onChange={function(e) { set('session', e.target.value); }}>
              <option value="">Select Session</option>
              <option>2024-25</option><option>2023-24</option><option>2022-23</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Course</label>
            <select className="form-input" value={form.course} onChange={function(e) { set('course', e.target.value); }}>
              <option value="">All Courses</option>
              <option>MBBS</option><option>BDS</option><option>B.Sc Nursing</option>
            </select>
          </div>
          <div className="form-field" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Upload File <span className="req">*</span></label>
            <input ref={fileRef} className="form-input" type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} />
          </div>
        </div>
        {file && <div style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>Selected: <b>{file.name}</b> — {preview.length} row(s)</div>}
        <div className="form-submit-row"><button className="submit-btn" type="submit">Upload Due Fees</button></div>
      </form>
      {preview.length > 0 && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:28 }}>
            <div style={{ display:'flex', gap:8 }}>
              {['Copy','CSV','Print'].map(function(b) {
                return <button key={b} className="tbl-btn view" style={{ background:'#f1f5f9', color:'#374151' }} onClick={function() { handleTableAction(b); }}>{b}</button>;
              })}
            </div>
            <input className="form-input" style={{ width:220 }} placeholder="Search..." value={search} onChange={function(e) { setSearch(e.target.value); }} />
          </div>
          <div className="table-wrap">
            <table className="hr-table">
              <thead><tr><th>S.No</th>{HEADERS.map(function(h) { return <th key={h}>{h}</th>; })}</tr></thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={HEADERS.length + 1} className="empty-table-msg">No data</td></tr>
                  : filtered.map(function(r, i) {
                    return <tr key={i}><td>{i+1}</td>{HEADERS.map(function(_, j) { return <td key={j}>{r[j]||'—'}</td>; })}</tr>;
                  })}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize:13, color:'#6b7280', marginTop:8 }}>Showing {filtered.length} of {preview.length} entries</div>
        </div>
      )}
    </div>
  );
}
