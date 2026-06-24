import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import React, { useState } from 'react';

const MENU_OPTIONS = [
  'Dashboard', 'Setting', 'User Master', 'Master', 'HR Management', 'Import',
  'Fee', 'Account Master', 'Account', 'Account Report', 'Fee Master', 'Student',
  'Student Report', 'Student Attendance', 'Leave Mgmt', 'Lesson Plan',
  'Timetable Mgmt', 'Examination', 'Gate Pass', 'Visitor Mgmt', 'Hostel',
  'Transport', 'Certificate', 'Document', 'Reception', 'Dispatch', 'Alumni',
  'Send SMS', 'Whatsapp', 'Mobile APP', 'Enquiry', 'Change Password',
];

const DEFAULT_ROWS = [
  { id: 1,  menu: 'Master', submenu: 'Session Master',        url: 'master_session.php',      videoUrl: '', order: 0, status: 'N' },
  { id: 2,  menu: 'Master', submenu: 'University Master',     url: 'master_university.php',   videoUrl: '', order: 0, status: 'N' },
  { id: 3,  menu: 'Master', submenu: 'Course Master',         url: 'master_course.php',       videoUrl: '', order: 1, status: 'N' },
  { id: 4,  menu: 'Master', submenu: 'Branch Master',         url: 'master_branch.php',       videoUrl: '', order: 1, status: 'N' },
  { id: 5,  menu: 'Master', submenu: 'Batch Master',          url: 'master_batch.php',        videoUrl: '', order: 1, status: 'N' },
  { id: 6,  menu: 'Master', submenu: 'Consultant Master',     url: 'master_consultant.php',   videoUrl: '', order: 1, status: 'N' },
  { id: 7,  menu: 'Master', submenu: 'Occupation Master',     url: 'master_occupation.php',   videoUrl: '', order: 2, status: 'N' },
  { id: 8,  menu: 'Master', submenu: 'Religion Master',       url: 'master_religion.php',     videoUrl: '', order: 2, status: 'N' },
  { id: 9,  menu: 'Master', submenu: 'Template Master',       url: 'master_template.php',     videoUrl: '', order: 3, status: 'N' },
  { id: 10, menu: 'Master', submenu: 'Caste Master',          url: 'master_cast.php',         videoUrl: '', order: 4, status: 'N' },
  { id: 11, menu: 'Master', submenu: 'Category Master',       url: 'master_stucategory.php',  videoUrl: '', order: 4, status: 'N' },
  { id: 12, menu: 'Master', submenu: 'Late Fee Master',       url: 'master_lfee.php',         videoUrl: '', order: 4, status: 'N' },
  { id: 13, menu: 'Master', submenu: 'School Master',         url: 'master_school.php',       videoUrl: '', order: 5, status: 'N' },
  { id: 14, menu: 'Master', submenu: 'Add Payment Mode',      url: 'master_pmode.php',        videoUrl: '', order: 5, status: 'N' },
  { id: 15, menu: 'Master', submenu: 'Board/University Master', url: 'master_board.php',      videoUrl: '', order: 6, status: 'N' },
  { id: 16, menu: 'Master', submenu: 'City/District Master',  url: 'master_city.php',         videoUrl: '', order: 6, status: 'N' },
  { id: 17, menu: 'Master', submenu: 'Scholarship Master',    url: 'master_scholar.php',      videoUrl: '', order: 7, status: 'N' },
  { id: 18, menu: 'Master', submenu: 'Subject Master',        url: 'master_subject.php',      videoUrl: '', order: 11, status: 'N' },
  { id: 19, menu: 'Student Report', submenu: 'Dynamic Report',          url: 'report_dynamic.php',        videoUrl: '', order: 0, status: 'N' },
  { id: 20, menu: 'Student Report', submenu: 'Due Fee Report',          url: 'report_duefstatement.php',  videoUrl: '', order: 0, status: 'N' },
  { id: 21, menu: 'Student Report', submenu: 'Student Details',         url: 'report_sdet.php',           videoUrl: '', order: 0, status: 'N' },
  { id: 22, menu: 'Student Report', submenu: 'Dropout Student Details', url: 'report_terdet.php',         videoUrl: '', order: 0, status: 'N' },
  { id: 23, menu: 'Student Report', submenu: 'Dropout Student Fee Details', url: 'report_terfee.php',    videoUrl: '', order: 0, status: 'N' },
  { id: 24, menu: 'Student Report', submenu: 'Course Wise Student',     url: 'report_classwise.php',      videoUrl: '', order: 0, status: 'N' },
  { id: 25, menu: 'Student Report', submenu: 'Caste Wise Student',      url: 'report_caststudent.php',    videoUrl: '', order: 0, status: 'N' },
  { id: 26, menu: 'Student Report', submenu: 'Due Fees Report - II',    url: 'report_duefstatementn.php', videoUrl: '', order: 0, status: 'N' },
  { id: 27, menu: 'Student Report', submenu: 'Due Fees Report - III',   url: 'report_duefstatementn_group.php', videoUrl: '', order: 0, status: 'N' },
  { id: 28, menu: 'Student Report', submenu: 'I-Card Landscape',        url: 'student_sett_icard.php',    videoUrl: '', order: 7, status: 'N' },
  { id: 29, menu: 'Student Report', submenu: 'I-Card Landscape',        url: 'student_sett_icard.php',    videoUrl: '', order: 7, status: 'N' },
  { id: 30, menu: 'Student Report', submenu: 'I-Card Portrait',         url: 'student_sett_icardn.php',   videoUrl: '', order: 7, status: 'N' },
  { id: 31, menu: 'HR Management',  submenu: 'New Employee',            url: 'employee_new.php',          videoUrl: '', order: 0, status: 'N' },
  { id: 32, menu: 'HR Management',  submenu: 'View Employee',           url: 'employee_view.php',         videoUrl: '', order: 0, status: 'N' },
];

export default function SubMenuManagement({ onBack }) {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [form, setForm] = useState({ menu: 'Dashboard', submenuName: '', order: '', url: '', videoUrl: '', status: 'N' });
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.submenuName.trim()) return;
    setRows(p => [...p, { id: Date.now(), menu: form.menu, submenu: form.submenuName, url: form.url, videoUrl: form.videoUrl, order: Number(form.order) || 0, status: form.status }]);
    setForm({ menu: 'Dashboard', submenuName: '', order: '', url: '', videoUrl: '', status: 'N' });
  };

  const filtered = rows.filter(r =>
    r.menu.toLowerCase().includes(search.toLowerCase()) ||
    r.submenu.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Add Submenu</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', marginBottom: 24 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Menu</label>
            <select className="form-input" value={form.menu} onChange={e => set('menu', e.target.value)}>
              {MENU_OPTIONS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Submenu Name</label>
            <input className="form-input" value={form.submenuName} onChange={e => set('submenuName', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Order</label>
            <input className="form-input" type="number" value={form.order} onChange={e => set('order', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">URL</label>
            <input className="form-input" value={form.url} onChange={e => set('url', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Video Url</label>
            <input className="form-input" value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      <div className="table-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }}
                onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'SubMenuManagement'); else handlePrint('Sub Menu Management'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="hr-table">
          <thead>
            <tr>{['SNo.', 'Menu', 'Submenu', 'url', 'Video Url', 'Order', 'Status', 'Edit', 'Delete'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.menu}</td>
                <td>{r.submenu}</td>
                <td style={{ fontSize: 12 }}>{r.url}</td>
                <td style={{ fontSize: 12 }}>{r.videoUrl}</td>
                <td>{r.order}</td>
                <td>{r.status}</td>
                <td><button className="tbl-btn view" style={{ background: '#e0f2fe', color: '#0369a1' }} onClick={() => alert('Edit: ' + r.submenu)}>✏</button></td>
                <td><button className="tbl-btn" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={() => setRows(p => p.filter(x => x.id !== r.id))}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
          Showing 1 to {filtered.length} of {filtered.length} entries
        </div>
      </div>
    </div>
  );
}
