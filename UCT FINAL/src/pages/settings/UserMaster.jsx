import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import React, { useState } from 'react';

const MENU_STRUCTURE = [
  { id: 'dashboard', label: 'Dashboard', subs: [
    'Dashboard', 'Mobile APP', 'Admin Dashboard', 'Circular Dashboard',
    'Assignment Dashboard', 'Account Dashboard', 'Birthday Dashboard',
    'RFID Attendance Dashboard', 'Enquiry Dashboard',
  ]},
  { id: 'setting', label: 'Setting', subs: [
    'Setting', 'College Setting', 'Important Link', 'Biometric Logs',
    'Student Master Setting', 'Menu', 'Submenu', 'I-Card Setting', 'User Master',
  ]},
  { id: 'master', label: 'Master', subs: [
    'Session Master', 'University Master', 'Course Master', 'Branch Master',
    'Batch Master', 'Consultant Master', 'Religion Master', 'Occupation Master',
    'Template Master', 'Caste Master', 'Category Master', 'School Master',
    'Board/University Master', 'City/District Master', 'Scholarship Master', 'Subject Master',
  ]},
  { id: 'hr', label: 'HR Management', subs: [
    'New Employee', 'View Employee', 'Generate Salary', 'Pay Salary',
    'Employee Attendance', 'Employee Attendance Report', 'Employee Salary Register',
    'New Department', 'Attendance Sheet', 'Employee Attendance Register',
    'Employee Holiday Mgmt', 'Employee I-Card', 'Time Slot Master',
    'Add Employee Category', 'Add Leave Type', 'Leave Allocation',
    'Add Leave Application', 'Leave Application Report',
  ]},
  { id: 'import', label: 'Import', subs: [
    'Import Employee', 'Import Student', 'Image Upload in Bulk',
    'Fee Receipt Upload', 'Due Fee Upload',
  ]},
  { id: 'fee', label: 'Fee', subs: [
    'Fee Receipt', 'Fee Receipt (Head Wise)', 'Add Other Fee', 'Fee Discount',
    'Other Fee Receipt', 'Fee Discount Report', 'Add Other Fee (Bulk)',
    'Fee Receipt Detailed View', 'Fee Collection (Hold Fee)', 'Head Wise Fee Detailed View',
  ]},
  { id: 'account-master', label: 'Account Master', subs: [
    'Bank Master', 'Cheque Entry', 'Card Entry', 'Head Master', 'Subhead Master', 'Party Master',
  ]},
  { id: 'account', label: 'Account', subs: [
    'Bill Entry', 'Payment', 'Party Ledger', 'Bank Deposit', 'Self Withdrawal', 'Receipt',
  ]},
  { id: 'account-report', label: 'Account Report', subs: [
    'Bill Entry Details', 'Payment Summary', 'Daily Report', 'Cash Report',
    'Bank Report', 'Bank Statement', 'Balance Sheet', 'Fee Receipt Register',
    'Expense Register', 'Daywise Register', 'Income & Expenditure Report',
  ]},
  { id: 'fee-master', label: 'Fee Master', subs: [
    'Schemes Category', 'Add Schemes', 'Fee Head Master', 'Fee Master View', 'Fee Summary',
  ]},
  { id: 'student', label: 'Student', subs: [
    'Add Student', 'View/Edit Student', 'Roll No / Enrollment Allocation',
    'Promote Student', 'Dropout Student', 'Terminate Student',
    'Search Student', 'Session Wise Student',
  ]},
  { id: 'student-report', label: 'Student Report', subs: [
    'Due Fee Report', 'Student Details', 'Dropout Student Details',
    'Dropout Student Fee Details', 'Course Wise Student', 'Caste Wise Student',
    'Dynamic Report', 'Due Fees Report II', 'Due Fees Report III',
    'I-Card Landscape', 'I-Card Portrait',
  ]},
  { id: 'student-attendance', label: 'Student Attendance', subs: [
    'Student Attendance', 'Student Attendance Details',
    'APP Student Attendance Details', 'Student Attendance Register',
  ]},
  { id: 'leave-mgmt', label: 'Leave Mgmt', subs: [
    'Student Leave Apply', 'Student Leave Details',
  ]},
  { id: 'lesson-plan', label: 'Lesson Plan', subs: ['Lesson Plan', 'Lesson Plan Report'] },
  { id: 'timetable', label: 'Timetable Mgmt', subs: ['Period Master', 'Time Table Allocation'] },
  { id: 'examination', label: 'Examination', subs: [
    'Exam Session', 'Add Semester', 'Nominal Roll I', 'Nominal Roll II',
    'New Form Accept', 'Form Accept Details', 'CCE Mark Entry',
    'Practical Mark Entry', 'Attendance Sheet', 'Marks Entry',
    'Scholar Register', 'Hall Ticket', 'Results',
  ]},
  { id: 'gate-pass', label: 'Gate Pass', subs: [
    'Gate Pass For Guardian', 'Gate Pass For Employee',
    'Gate Pass Details (S)', 'Gate Pass Details (E)',
  ]},
  { id: 'visitor', label: 'Visitor Mgmt', subs: ['Visiting Type', 'Add New Visitor', 'Visitor Report'] },
  { id: 'hostel', label: 'Hostel', subs: [
    'Add Hostel', 'Add Room', 'Allocate Hostel', 'Hostel Allocation Report',
    'Mess Management', 'Maintenance Complaints',
  ]},
  { id: 'transport', label: 'Transport', subs: [
    'Add Vehicle', 'Log Book', 'Diesel IN', 'Logbook & Diesel Report',
    'Route Master', 'Transport Allocation', 'Transport Allocation Report', 'Add Driver/Helper',
  ]},
  { id: 'certificate', label: 'Certificate', subs: ['Certificate Setting', 'Create Certificate', 'Certificate Report'] },
  { id: 'document', label: 'Document', subs: ['Add Document', 'Document Report'] },
  { id: 'reception', label: 'Reception', subs: ['Receipt / Dispatch', 'Receipt / Dispatch Details'] },
  { id: 'dispatch', label: 'Dispatch', subs: ['Add Section', 'Add Copy', 'Add In Ward', 'View In Ward', 'Add Out Ward', 'View Out Ward'] },
  { id: 'alumni', label: 'Alumni', subs: ['Alumni Report'] },
  { id: 'sendsms', label: 'Send SMS', subs: ['Send SMS to Employee', 'Send SMS to Student', 'Send SMS', 'Send APP Link'] },
  { id: 'whatsapp', label: 'Whatsapp', subs: ['WhatsApp Configuration'] },
  { id: 'mobileapp', label: 'Mobile APP', subs: [
    'Circular', 'App Feedback', 'Contact Us', 'Calendar', 'Gallery',
    'Assignment', 'Syllabus', 'Academic Video', 'Academic Notes',
    'Certificate Apply', 'Certificate Apply Report',
  ]},
  { id: 'enquiry', label: 'Enquiry', subs: [
    'New Enquiry', 'Enquiry Details', 'Search Enquiry',
    'Enquiry Seat Status', 'Enquiry Done Followup', 'Enquiry Pending Followup',
  ]},
  { id: 'change-password', label: 'Change Password', subs: [] },
];

export default function UserMaster({ onBack, editUser }) {
  const [form, setForm] = useState({
    userid:      editUser?.userid      || '',
    password:    editUser?.password    || '',
    loginType:   editUser?.loginType   || 'Password',
    otpMobileNo: editUser?.otpMobileNo || '',
    type:        editUser?.type        || 'User',
    center:      editUser?.center      || '',
    course:      editUser?.course      || '',
    status:      editUser?.status      || 'Active',
  });
  const [checked, setChecked] = useState({});
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const isEdit = !!editUser;

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const toggleParent = (modId, subs) => {
    const allSubIds = subs.map((s, i) => `${modId}-${i}`);
    const allChecked = allSubIds.every(id => checked[id]);
    const next = { ...checked, [modId]: !allChecked };
    allSubIds.forEach(id => { next[id] = !allChecked; });
    setChecked(next);
  };

  const toggleSub = (modId, subIdx, subs) => {
    const subId = `${modId}-${subIdx}`;
    const next = { ...checked, [subId]: !checked[subId] };
    const allSubIds = subs.map((s, i) => `${modId}-${i}`);
    next[modId] = allSubIds.every(id => next[id]);
    setChecked(next);
  };

  const handleSubmit = () => {
    if (!form.userid.trim()) { alert('Userid is required.'); return; }
    if (form.loginType === 'Password' && !form.password.trim()) { alert('Password is required.'); return; }
    if (form.loginType === 'PIN' && !form.password.trim()) { alert('PIN is required.'); return; }
    if (form.loginType === 'OTP' && !form.otpMobileNo.trim()) { alert('Mobile number is required for OTP.'); return; }
    const menuCount = MENU_STRUCTURE.filter(mod =>
      checked[mod.id] || mod.subs.some((s, i) => checked[`${mod.id}-${i}`])
    ).length;
    if (!isEdit) {
      setUsers(p => [...p, { id: Date.now(), userid: form.userid, type: form.type, loginType: form.loginType, menus: menuCount }]);
    }
    setForm({ userid: '', password: '', loginType: 'Password', otpMobileNo: '', type: 'User', center: '', course: '', status: 'Active' });
    setChecked({});
    setOtpSent(false);
    setOtp('');
    alert(isEdit ? 'User updated successfully.' : 'User created successfully.');
    if (isEdit && onBack) onBack();
  };

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    if (!form.otpMobileNo.trim()) { alert('Please enter mobile number.'); return; }
    setOtpSent(true);
    alert(`OTP sent to ${form.otpMobileNo}`);
  };

  const filtered = users.filter(u => u.userid.toLowerCase().includes(search.toLowerCase()));
  const inputS = { width: '100%', padding: '6px 10px', fontSize: 13, border: '1px solid #d1d5db', borderRadius: 4, outline: 'none', boxSizing: 'border-box' };
  const labelS = { minWidth: 160, fontSize: 13, color: '#374151', fontWeight: 500, paddingTop: 7, flexShrink: 0 };
  const rowS = { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 };

  return (
    <div className="hr-form">
      <div className="section-title">{isEdit ? 'Update User' : 'Add New User'}</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', marginBottom: 24 }}>

        {/* 1. Userid */}
        <div style={rowS}><span style={labelS}>Userid</span><div style={{ flex: 1, maxWidth: 340 }}><input style={inputS} value={form.userid} onChange={set('userid')} /></div></div>

        {/* 2. Login Type */}
        <div style={rowS}>
          <span style={labelS}>Login Type</span>
          <div style={{ flex: 1, maxWidth: 340 }}>
            <select style={inputS} value={form.loginType} onChange={e => { set('loginType')(e); setOtpSent(false); setOtp(''); setForm(p => ({ ...p, password: '', otpMobileNo: '', loginType: e.target.value })); }}>
              <option>Password</option><option>OTP</option><option>PIN</option>
            </select>
          </div>
        </div>

        {/* 3. Conditional field based on Login Type */}
        {form.loginType === 'Password' && (
          <div style={rowS}>
            <span style={labelS}>Password</span>
            <div style={{ flex: 1, maxWidth: 340 }}>
              <input style={inputS} type="password" placeholder="Enter password" value={form.password} onChange={set('password')} />
            </div>
          </div>
        )}

        {form.loginType === 'PIN' && (
          <div style={rowS}>
            <span style={labelS}>PIN</span>
            <div style={{ flex: 1, maxWidth: 340 }}>
              <input style={inputS} type="password" placeholder="Enter PIN" maxLength={6} value={form.password} onChange={set('password')} />
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Enter a numeric PIN (max 6 digits)</div>
            </div>
          </div>
        )}

        {form.loginType === 'OTP' && (
          <>
            <div style={rowS}>
              <span style={labelS}>Mobile Number</span>
              <div style={{ flex: 1, maxWidth: 340 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input style={{ ...inputS, flex: 1 }} type="tel" placeholder="Enter mobile number" value={form.otpMobileNo} onChange={set('otpMobileNo')} />
                  <button className="submit-btn" style={{ whiteSpace: 'nowrap', padding: '6px 14px', fontSize: 13 }} onClick={handleSendOtp}>
                    Get OTP
                  </button>
                </div>
              </div>
            </div>
            {otpSent && (
              <div style={rowS}>
                <span style={labelS}>Enter OTP</span>
                <div style={{ flex: 1, maxWidth: 340 }}>
                  <input style={inputS} type="text" placeholder="Enter OTP received" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} />
                  <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4 }}>OTP sent to {form.otpMobileNo}</div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 4. Type */}
        <div style={rowS}>
          <span style={labelS}>Type</span>
          <div style={{ flex: 1, maxWidth: 340 }}>
            <select style={inputS} value={form.type} onChange={set('type')}>
              <option>User</option><option>Admin</option><option>Super Admin</option>
              <option>Library</option><option>Store Manager</option><option>Consultant</option>
            </select>
          </div>
        </div>

        {/* 5. Employee */}
        <div style={rowS}>
          <span style={labelS}>Employee</span>
          <div style={{ flex: 1, maxWidth: 340 }}>
            <select style={inputS}><option value="">Select</option></select>
          </div>
        </div>

        {/* 6. Center */}
        <div style={rowS}>
          <span style={labelS}>Center</span>
          <div style={{ flex: 1, maxWidth: 340 }}>
            <select style={inputS} value={form.center} onChange={set('center')}>
              <option value="">None selected</option>
              <option value="UCT">UNIVERSIDADE CATOLICA TIMORENSE</option>
            </select>
          </div>
        </div>

        {/* 7. Course */}
        <div style={rowS}>
          <span style={labelS}>Course</span>
          <div style={{ flex: 1, maxWidth: 340 }}>
            <select style={inputS} value={form.course} onChange={set('course')}>
              <option value="">None selected</option>
              <option value="MBBS">MBBS</option>
            </select>
          </div>
        </div>

        {/* 8. Status */}
        <div style={rowS}>
          <span style={labelS}>Status</span>
          <div style={{ flex: 1, maxWidth: 340 }}>
            <select style={inputS} value={form.status} onChange={set('status')}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* SELECT MENU */}
      <div style={{ background: '#1e293b', color: '#fff', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontSize: 14, fontWeight: 500 }}>
        Select Menu
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '16px 20px', background: '#fff', marginBottom: 24, maxHeight: 500, overflowY: 'auto' }}>
        {MENU_STRUCTURE.map(mod => (
          <div key={mod.id} style={{ marginBottom: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!checked[mod.id]}
                onChange={() => mod.subs.length > 0 ? toggleParent(mod.id, mod.subs) : setChecked(p => ({ ...p, [mod.id]: !p[mod.id] }))} />
              {mod.label}
            </label>
            {mod.subs.length > 0 && (
              <div style={{ marginLeft: 22, marginTop: 4, display: 'flex', flexWrap: 'wrap' }}>
                {mod.subs.map((sub, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', cursor: 'pointer', width: '50%', marginBottom: 3 }}>
                    <input type="checkbox" checked={!!checked[`${mod.id}-${i}`]}
                      onChange={() => toggleSub(mod.id, i, mod.subs)} />
                    {sub}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>

      {users.length > 0 && (
        <div className="table-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Copy', 'CSV', 'Print'].map(b => (
                <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }}
                  onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'UserMaster'); else handlePrint('User Master'); }}>{b}</button>
              ))}
            </div>
            <input className="form-input" style={{ width: 200 }} placeholder="Search..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <table className="hr-table">
            <thead><tr><th>SNo.</th><th>User ID</th><th>Type</th><th>Login Type</th><th>Menus Assigned</th><th>Edit</th><th>Delete</th></tr></thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td><td>{u.userid}</td><td>{u.type}</td><td>{u.loginType}</td><td>{u.menus} modules</td>
                  <td><button className="tbl-btn view" style={{ background: '#e0f2fe', color: '#0369a1' }}>Edit</button></td>
                  <td><button className="tbl-btn" style={{ background: '#fee2e2', color: '#991b1b' }}
                    onClick={() => setUsers(p => p.filter(x => x.id !== u.id))}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
        </div>
      )}
    </div>
  );
}
