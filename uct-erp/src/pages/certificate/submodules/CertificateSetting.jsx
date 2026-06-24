import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useRef } from 'react';

const TEMPLATE_CODES = [
  { label: 'Certificate No',        code: '{cerno}' },
  { label: 'Certificate Date',      code: '{cer_date}' },
  { label: 'Course',                code: '{courid}' },
  { label: 'Branch Name',           code: '{branchid}' },
  { label: 'Batch',                 code: '{btchid}' },
  { label: 'Admission Year/Semester', code: '{admyear}' },
  { label: 'Major Subjects',        code: '{subjid1}' },
  { label: 'Minor Subjects',        code: '{subjid2}' },
  { label: 'Open Elective',         code: '{subjid3}' },
  { label: 'Voc Subjects',          code: '{subjid4}' },
  { label: 'Project/Internship',    code: '{subjid5}' },
  { label: 'Admission Date',        code: '{cdate}' },
  { label: 'Scholar No',            code: '{scholarno}' },
  { label: 'Medium',                code: '{medium}' },
  { label: 'Samagra ID',            code: '{samagra_id}' },
  { label: 'Roll No',               code: '{rollno}' },
  { label: 'Enrollment No',         code: '{enrollno}' },
  { label: 'Name',                  code: '{sname}' },
  { label: 'Student Mob No',        code: '{cphno}' },
  { label: "Father's Name",         code: '{fname}' },
  { label: "Mother's Name",         code: '{mname}' },
  { label: 'Religion',              code: '{religion}' },
  { label: 'DOB',                   code: '{DOB}' },
  { label: 'DOB(in words)',         code: '{dob_in_words}' },
  { label: 'Date of Admission',     code: '{date_of_admission}' },
  { label: 'Local Address',         code: '{cline1}' },
  { label: 'City',                  code: '{cline2}' },
  { label: 'District',              code: '{ccity}' },
  { label: 'category',              code: '{category}' },
  { label: 'Caste',                 code: '{caste}' },
  { label: 'Bank Name',             code: '{schbname}' },
  { label: 'Account No',            code: '{accountno}' },
  { label: 'IFSC',                  code: '{ifsc}' },
];

const CERT_TYPES = ['TC', 'Bonafide', 'Character', 'Migration', 'Visa Support Letter', 'Enrollment Proof for Embassy', 'Other'];

export default function CertificateSetting() {
  const [form, setForm] = useState({ type: 'TC', title: '', status: 'Active', certificate: '' });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const editorRef = useRef(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const insertCode = (code) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(code));
      range.collapse(false);
    } else {
      el.innerHTML += code;
    }
    set('certificate', el.innerHTML);
  };

  const handleSubmit = () => {
    if (!form.title) return;
    const content = editorRef.current ? editorRef.current.innerHTML : form.certificate;
    if (editId !== null) {
      setRows(p => p.map(r => r.id === editId ? { ...form, certificate: content, id: editId } : r));
      setEditId(null);
    } else {
      setRows(p => [...p, { ...form, certificate: content, id: Date.now() }]);
    }
    setForm({ type: 'TC', title: '', status: 'Active', certificate: '' });
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  const handleEdit = (r) => {
    setForm({ type: r.type, title: r.title, status: r.status, certificate: r.certificate });
    setEditId(r.id);
    if (editorRef.current) editorRef.current.innerHTML = r.certificate;
  };

  const handleDelete = (id) => setRows(p => p.filter(r => r.id !== id));

  const execCmd = (cmd, val = null) => { document.execCommand(cmd, false, val); editorRef.current?.focus(); };

  const filtered = rows.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const toolbarGroups = [
    [
      { icon: 'B', cmd: 'bold', style: { fontWeight: 700 } },
      { icon: 'I', cmd: 'italic', style: { fontStyle: 'italic' } },
      { icon: 'U', cmd: 'underline', style: { textDecoration: 'underline' } },
      { icon: 'S', cmd: 'strikeThrough', style: { textDecoration: 'line-through' } },
    ],
    [
      { icon: '≡L', cmd: 'justifyLeft' },
      { icon: '≡C', cmd: 'justifyCenter' },
      { icon: '≡R', cmd: 'justifyRight' },
      { icon: '≡J', cmd: 'justifyFull' },
    ],
    [
      { icon: '• List', cmd: 'insertUnorderedList' },
      { icon: '1. List', cmd: 'insertOrderedList' },
    ],
  ];

  return (
    <div className="hr-form">
      <div className="section-title">Certificate Setting</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)' }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: 700 }}>
          <div className="form-field">
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
              {CERT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Title <span className="req">*</span></label>
            <input className="form-input" placeholder="Certificate title" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div style={{ marginTop: 18 }}>
          <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Certificate</label>

          {/* Toolbar */}
          <div style={{ border: '1.5px solid #e2e8f0', borderBottom: 'none', borderRadius: '8px 8px 0 0', background: '#f8fafc', padding: '6px 10px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {/* Font controls */}
            <select style={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 4, padding: '2px 6px', background: '#fff', cursor: 'pointer' }}
              onChange={e => execCmd('fontName', e.target.value)}>
              <option value="">Font Family</option>
              {['Arial','Times New Roman','Courier New','Georgia','Verdana'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select style={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 4, padding: '2px 6px', background: '#fff', cursor: 'pointer' }}
              onChange={e => execCmd('fontSize', e.target.value)}>
              <option value="">Font Size</option>
              {[1,2,3,4,5,6,7].map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <div style={{ width: 1, background: '#e2e8f0', margin: '0 4px' }} />

            {toolbarGroups.map((grp, gi) => (
              <React.Fragment key={gi}>
                {grp.map(btn => (
                  <button key={btn.cmd} type="button"
                    onMouseDown={e => { e.preventDefault(); execCmd(btn.cmd); }}
                    style={{ padding: '3px 8px', border: '1px solid #e2e8f0', borderRadius: 4, background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', ...btn.style }}>
                    {btn.icon}
                  </button>
                ))}
                <div style={{ width: 1, background: '#e2e8f0', margin: '0 4px' }} />
              </React.Fragment>
            ))}

            <input type="color" title="Text Color" style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 4, padding: 2, cursor: 'pointer' }}
              onChange={e => execCmd('foreColor', e.target.value)} />
            <input type="color" title="Background Color" style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 4, padding: 2, cursor: 'pointer' }}
              onChange={e => execCmd('hiliteColor', e.target.value)} />
          </div>

          {/* Content editable area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={e => set('certificate', e.currentTarget.innerHTML)}
            style={{
              border: '1.5px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px',
              minHeight: 160, padding: '12px 14px', fontSize: 13.5, fontFamily: 'inherit',
              outline: 'none', background: '#fafbff', lineHeight: 1.6,
              color: '#1e293b',
            }}
          />
          <div style={{ textAlign: 'right', fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Words: 0</div>
        </div>

        {/* Template Codes */}
        <div style={{ marginTop: 20, padding: '14px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', marginBottom: 10 }}>Template Codes</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px 16px' }}>
            {TEMPLATE_CODES.map(t => (
              <div key={t.code} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 12.5, color: '#374151' }}>{t.label}</span>
                <button type="button" onClick={() => insertCode(t.code)}
                  style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, color: '#4361ee', fontFamily: 'monospace' }}>
                  {t.code}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-submit-row">
          <button className="submit-btn" onClick={handleSubmit}>{editId !== null ? 'Update' : 'Submit'}</button>
          {editId !== null && (
            <button className="submit-btn" style={{ background: '#64748b' }} onClick={() => { setEditId(null); setForm({ type: 'TC', title: '', status: 'Active', certificate: '' }); if (editorRef.current) editorRef.current.innerHTML = ''; }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Copy', 'CSV', 'Print'].map(b => (
            <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'CertificateSetting'); else handlePrint('Certificate Setting'); }}>{b}</button>
          ))}
        </div>
        <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              {['S.No', 'Type', 'Title', 'Sample', 'Status', 'Edit', 'Delete'].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-table-msg">No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.type}</td>
                <td>{r.title}</td>
                <td>
                  <button className="tbl-btn view" style={{ color: '#4361ee' }} onClick={() => alert("View record")}>Click here</button>
                </td>
                <td><span style={{ color: r.status === 'Active' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{r.status}</span></td>
                <td><button className="tbl-btn edit" onClick={() => handleEdit(r)}>✎ Edit</button></td>
                <td>
                  <button className="tbl-btn del" onClick={() => handleDelete(r.id)}
                    style={{ padding: '4px 10px', fontSize: 15 }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
        Showing {filtered.length === 0 ? '0 to 0 of 0' : `1 to ${filtered.length} of ${filtered.length}`} entries
      </div>
    </div>
  );
}
