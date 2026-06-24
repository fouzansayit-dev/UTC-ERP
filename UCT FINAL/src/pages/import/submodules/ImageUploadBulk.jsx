import React, { useState } from 'react';

function handleTableAction(action) {
  var tbl = document.querySelector('.hr-table'); if (!tbl) return;
  if (action === 'Print') {
    var w = window.open('', '_blank');
    w.document.write('<html><head><title>Image Upload Log</title><style>body{font-family:Arial,sans-serif;padding:16px;font-size:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:5px 8px}th{background:#1e3a5f;color:#fff}tr:nth-child(even){background:#f5f5f5}</style></head><body><h2>Image Upload Log</h2>' + tbl.outerHTML + '</body></html>');
    w.document.close(); w.print();
  } else if (action === 'CSV') {
    var rows = Array.from(tbl.querySelectorAll('tr')).map(function(r) {
      return Array.from(r.querySelectorAll('th,td')).map(function(c) { return '"' + c.innerText.replace(/"/g,'""') + '"'; }).join(',');
    });
    var blob = new Blob([rows.join('\r\n')], { type: 'text/csv' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'image_upload_log.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } else {
    var rows2 = Array.from(tbl.querySelectorAll('tr')).map(function(r) {
      return Array.from(r.querySelectorAll('th,td')).map(function(c) { return c.innerText; }).join('\t');
    });
    navigator.clipboard.writeText(rows2.join('\n')).then(function() { alert('Copied!'); });
  }
}

export default function ImageUploadBulk() {
  const [uploadFor, setUploadFor] = useState('Student');
  const [session, setSession] = useState('');
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');

  function handleFiles(e) {
    var selected = Array.from(e.target.files).map(function(f) {
      return { id: Date.now() + Math.random(), name: f.name, size: (f.size / 1024).toFixed(1) + ' KB', type: f.type || 'image/*', status: 'Ready' };
    });
    setFiles(function(p) { return p.concat(selected); });
  }

  function handleUpload() {
    if (!session) { alert('Please select a session.'); return; }
    if (files.length === 0) { alert('Please select image files.'); return; }
    setFiles(function(p) { return p.map(function(f) { return Object.assign({}, f, { status: 'Uploaded' }); }); });
    alert(files.length + ' image(s) uploaded successfully for ' + uploadFor + 's.');
  }

  var filtered = files.filter(function(f) {
    return f.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="hr-form">
      <div className="section-title">Image Upload in Bulk</div>

      <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8, padding:'12px 16px', marginBottom:18, fontSize:13, color:'#1e40af' }}>
        <b>Instructions:</b>
        <ul style={{ margin:'6px 0 0', paddingLeft:20, lineHeight:1.9 }}>
          <li>Rename images as <b>AdmNo.jpg</b> (students) or <b>EmpCode.jpg</b> (employees)</li>
          <li>Accepted: <b>.jpg, .jpeg, .png</b> — max 2 MB per file</li>
          <li>Select multiple files using Ctrl+Click</li>
        </ul>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Upload For <span className="req">*</span></label>
          <select className="form-input" value={uploadFor} onChange={function(e) { setUploadFor(e.target.value); }}>
            <option>Student</option><option>Employee</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Session <span className="req">*</span></label>
          <select className="form-input" value={session} onChange={function(e) { setSession(e.target.value); }}>
            <option value="">Select Session</option>
            <option>2024-25</option><option>2023-24</option><option>2022-23</option>
          </select>
        </div>
        <div className="form-field" style={{ gridColumn:'1/-1' }}>
          <label className="form-label">Select Images (.jpg / .jpeg / .png) <span className="req">*</span></label>
          <input className="form-input" type="file" accept=".jpg,.jpeg,.png" multiple onChange={handleFiles} />
        </div>
      </div>

      <div className="form-submit-row">
        <button className="submit-btn" type="button" onClick={handleUpload}>Upload Images</button>
        {files.length > 0 && (
          <button className="submit-btn" type="button"
            style={{ background:'#6b7280', marginLeft:10 }}
            onClick={function() { setFiles([]); }}>
            Clear All
          </button>
        )}
      </div>

      {files.length > 0 && (
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
                <tr><th>S.No</th><th>File Name</th><th>Size</th><th>Type</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={6} className="empty-table-msg">No files selected</td></tr>
                  : filtered.map(function(f, i) {
                    return (
                      <tr key={f.id}>
                        <td>{i + 1}</td>
                        <td>{f.name}</td>
                        <td>{f.size}</td>
                        <td>{f.type}</td>
                        <td>
                          <span style={{ color: f.status === 'Uploaded' ? '#16a34a' : '#d97706', fontWeight:600 }}>
                            {f.status}
                          </span>
                        </td>
                        <td>
                          <button className="tbl-btn"
                            style={{ background:'#fee2e2', color:'#b91c1c', border:'none', cursor:'pointer', padding:'3px 10px', borderRadius:4, fontSize:12 }}
                            onClick={function() { setFiles(function(p) { return p.filter(function(x) { return x.id !== f.id; }); }); }}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize:13, color:'#6b7280', marginTop:8 }}>
            Showing {filtered.length} of {files.length} files
          </div>
        </div>
      )}
    </div>
  );
}
