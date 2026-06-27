import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Login from './components/Login.jsx';
import TourSystem from './components/TourSystem.jsx';
import { TOURS } from './utils/tours.js';
// Unused imports removed to fix build error


/* ── HR ── */
import HRManagement, { HR_SUBMODULES } from './pages/hr/HRManagement.jsx';

/* ── IMPORT ── */
import ImportManagement, { IMPORT_SUBMODULES } from './pages/import/ImportManagement.jsx';

/* ── STUDENT ── */
import StudentManagement, { STUDENT_SUBMODULES } from './pages/student/StudentManagement.jsx';
/* ── ABROAD ── */
import AbroadManagement, { ABROAD_SUBMODULES } from './pages/abroad/AbroadManagement.jsx';
/* ── VISA & IMMIGRATION ── */
import VisaManagement, { VISA_SUBMODULES } from './pages/visa/VisaManagement.jsx';
/* ── AGENT MANAGEMENT ── */
import AgentManagement, { AGENT_SUBMODULES } from './pages/agent/AgentManagement.jsx';
/* ── SESSION ── */
import SessionManagement, { SESSION_SUBMODULES } from './pages/session/SessionManagement.jsx';
/* ── FEE MANAGEMENT ── */
import FeeMgmtModule, { FEE_MGMT_SUBMODULES } from './pages/fee/FeeMgmtModule.jsx';
/* ── FEE MASTER ── */
import FeeMasterModule, { FEE_MASTER_SUBMODULES } from './pages/fee/FeeMasterModule.jsx';
/* ── HOSTEL ── */
import HostelManagement, { HOSTEL_SUBMODULES } from './pages/hostel/HostelManagement.jsx';
/* ── EXAMINATION ── */
import ExaminationManagement, { EXAMINATION_SUBMODULES } from './pages/examination/ExaminationManagement.jsx';
/* ── TRANSPORT ── */
import TransportManagement, { TRANSPORT_SUBMODULES } from './pages/transport/TransportManagement.jsx';
/* ── CERTIFICATE ── */
import CertificateManagement, { CERTIFICATE_SUBMODULES } from './pages/certificate/CertificateManagement.jsx';
/* ── DOCUMENT ── */
import DocumentManagement, { DOCUMENT_SUBMODULES } from './pages/document/DocumentManagement.jsx';
/* ── RECEPTION, VISITOR & GATE PASS ── */
import ReceptionManagement, { RECEPTION_SUBMODULES } from './pages/reception/ReceptionManagement.jsx';
/* ── DISPATCH ── */
import DispatchManagement, { DISPATCH_SUBMODULES } from './pages/dispatch/DispatchManagement.jsx';
/* ── ACCOUNTS ── */
import AccountsManagement, { ACCOUNTS_SUBMODULES } from './pages/accounts/AccountsManagement.jsx';
/* ── SETTINGS ── */
import SettingsDashboard, { SETTINGS_SUBMODULES } from './pages/settings/SettingsDashboard.jsx';
/* ── SEND SMS ── */
import SendSmsManagement, { SENDSMS_SUBMODULES } from './pages/sendsms/SendSmsManagement.jsx';
/* ── WHATSAPP ── */
import WhatsappManagement, { WHATSAPP_SUBMODULES } from './pages/whatsapp/WhatsappManagement.jsx';
/* ── MOBILE APP ── */
import MobileAppManagement, { MOBILEAPP_SUBMODULES } from './pages/mobileapp/MobileAppManagement.jsx';
/* ── CONSULTANT ── */
import ConsultantManagement from './pages/consultant/ConsultantManagement.jsx';


/* ── STUDENT ATTENDANCE / TIMETABLE / LESSON PLAN ── */
import StudentAttendanceModule, { STUDENT_ATTENDANCE_SUBMODULES } from './pages/student/StudentAttendance.jsx';
import TimetableMgmtModule,    { TIMETABLE_SUBMODULES }           from './pages/student/TimetableMgmt.jsx';
import LessonPlanModule,       { LESSON_PLAN_SUBMODULES }         from './pages/student/LessonPlan.jsx';

/* ── DASHBOARD ── */
import HomeDashboard       from './pages/dashboard/HomeDashboard.jsx';
import AdminDashboard      from './pages/dashboard/AdminDashboard.jsx';
import CircularDashboard   from './pages/dashboard/CircularDashboard.jsx';
import AssignmentDashboard from './pages/dashboard/AssignmentDashboard.jsx';
import AccountDashboard    from './pages/dashboard/AccountDashboard.jsx';
import BirthdayDashboard   from './pages/dashboard/BirthdayDashboard.jsx';
import RFIDDashboard       from './pages/dashboard/RFIDDashboard.jsx';
import EnquiryDashboard    from './pages/dashboard/EnquiryDashboard.jsx';
/* ── ALUMNI ── */
import AlumniReport from './pages/alumni/AlumniList.jsx';

/* ── ENQUIRY ── */
import NewEnquiry         from './pages/enquiry/NewEnquiry.jsx';
import EnquiryDetailsList from './pages/enquiry/EnquiryDetailsList.jsx';
import EnquiryDetailsView from './pages/enquiry/EnquiryDetailsView.jsx';
import SearchEnquiry      from './pages/enquiry/SearchEnquiry.jsx';
import SessionWiseEnquiry from './pages/enquiry/SessionWiseEnquiry.jsx';
import SeatStatus         from './pages/enquiry/SeatStatus.jsx';
import DoneFollowup       from './pages/enquiry/DoneFollowup.jsx';
import PendingFollowup    from './pages/enquiry/PendingFollowup.jsx';

/* ── SVG ICON ── */
function SvgIcon({ path, size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}>
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  hr:        "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8 4v6m3-3h-6",
  import:    "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 8l-3-3m3 3l3-3",
  session:   "M4 6h16M4 10h16M4 14h16M4 18h16",
  enquiry:   "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 11v4",
  students:  "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
  student:   "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
  faculty:   "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8L6 7h12z",
  academics: "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  accounts:  "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  library:   "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  hostel:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  transport: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm13 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  certificate: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  document:    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  reception:   "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10M12 2v4M8 7h8",
  dispatch:    "M3 8h18M3 12h18M3 16h18M8 4v4M16 4v4",
  sendsms:     "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  whatsapp:    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  mobileapp:   "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  reports:   "M18 20V10M12 20V4M6 20v-6",
  visa:      "M9 12l2 2 4-4M7 4H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-3M9 4a2 2 0 014 0H9z",
  settings:  "M12 15a3 3 0 100-6 3 3 0 000 6zm7-3a7 7 0 01-.1 1l1.7 1.3-1.7 2.9-2-.8a7 7 0 01-1.8 1l-.3 2h-3.6l-.3-2a7 7 0 01-1.8-1l-2 .8-1.7-2.9 1.7-1.3A7 7 0 015 12a7 7 0 01.1-1L3.4 9.7l1.7-2.9 2 .8A7 7 0 018.9 6.6L9.2 4.6h3.6l.3 2a7 7 0 011.8 1l2-.8 1.7 2.9-1.7 1.3A7 7 0 0119 12z",
  agent: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  consultant: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8-2h6m-3-3v6",
  fee:              "M6 3h12M6 8h12M15 21L6 8m6 0a4 4 0 000-5H6",
  'fee-management': "M6 3h12M6 8h12M15 21L6 8m6 0a4 4 0 000-5H6",
  'fee-master':     "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  examination:      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 11h3M12 15h3M9 11h.01M9 15h.01",
  'student-attendance': "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12l2 2 4-4",
  'timetable':          "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  'lesson-plan':         "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2zM12 8v4M10 10h4",
  alumni: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
};

const DASH_SUBS = [
  { id: 'dash-admin',    label: 'Admin Dashboard' },
  { id: 'dash-circular', label: 'Circular Dashboard' },
  { id: 'dash-assign',   label: 'Assignment Dashboard' },
  { id: 'dash-account',  label: 'Account Dashboard' },
  { id: 'dash-birthday', label: 'Birthday Dashboard' },
  { id: 'dash-rfid',     label: 'RFID Attendance Dashboard' },
  { id: 'dash-enquiry',  label: 'Enquiry Dashboard' },
];

const HR_SUBS      = HR_SUBMODULES.map(({ id, label }) => ({ id, label }));
const IMPORT_SUBS  = IMPORT_SUBMODULES.map(({ id, label }) => ({ id, label }));
const SESSION_SUBS = SESSION_SUBMODULES.map(({ id, label }) => ({ id, label }));
const STUDENT_SUBS = STUDENT_SUBMODULES.map(({ id, label }) => ({ id, label }));
const ABROAD_SUBS  = ABROAD_SUBMODULES.map(({ id, label }) => ({ id, label }));
const VISA_SUBS    = VISA_SUBMODULES.map(({ id, label }) => ({ id, label }));
const AGENT_SUBS = AGENT_SUBMODULES.map(({ id, label }) => ({ id, label }));
const FEE_MGMT_SUBS   = FEE_MGMT_SUBMODULES.map(({ id, label }) => ({ id, label }));
const FEE_MASTER_SUBS = FEE_MASTER_SUBMODULES.map(({ id, label }) => ({ id, label }));
const HOSTEL_SUBS     = HOSTEL_SUBMODULES.map(({ id, label }) => ({ id, label }));
const EXAMINATION_SUBS = EXAMINATION_SUBMODULES.map(({ id, label }) => ({ id, label }));
const TRANSPORT_SUBS     = TRANSPORT_SUBMODULES.map(({ id, label }) => ({ id, label }));
const CERTIFICATE_SUBS   = CERTIFICATE_SUBMODULES.map(({ id, label }) => ({ id, label }));
const DOCUMENT_SUBS      = DOCUMENT_SUBMODULES.map(({ id, label }) => ({ id, label }));
const RECEPTION_SUBS     = RECEPTION_SUBMODULES.map(({ id, label }) => ({ id, label }));
const DISPATCH_SUBS      = DISPATCH_SUBMODULES.map(({ id, label }) => ({ id, label }));
const ACCOUNTS_SUBS      = ACCOUNTS_SUBMODULES.map(({ id, label }) => ({ id, label }));
const SETTINGS_SUBS      = SETTINGS_SUBMODULES.map(({ id, label }) => ({ id, label }));
const SENDSMS_SUBS       = SENDSMS_SUBMODULES.map(({ id, label }) => ({ id, label }));
const WHATSAPP_SUBS      = WHATSAPP_SUBMODULES.map(({ id, label }) => ({ id, label }));
const MOBILEAPP_SUBS     = MOBILEAPP_SUBMODULES.map(({ id, label }) => ({ id, label }));
const STUDENT_ATTENDANCE_SUBS = STUDENT_ATTENDANCE_SUBMODULES.map(({ id, label }) => ({ id, label }));
const TIMETABLE_SUBS          = TIMETABLE_SUBMODULES.map(({ id, label }) => ({ id, label }));
const LESSON_PLAN_SUBS        = LESSON_PLAN_SUBMODULES.map(({ id, label }) => ({ id, label }));

const ENQUIRY_SUBS = [
  { id: 'enq-new',     label: 'New Enquiry' },
  { id: 'enq-list',    label: 'Enquiry Details List' },
  { id: 'enq-view',    label: 'Enquiry Details (View)' },
  { id: 'enq-search',  label: 'Search Enquiry' },
  { id: 'enq-session', label: 'Session Wise Enquiry' },
  { id: 'enq-seat',    label: 'Enquiry Seat Status' },
  { id: 'enq-done',    label: 'Enquiry Done Follow-up' },
  { id: 'enq-pending', label: 'Enquiry Pending Follow-up' },
];

const MODULES = [
  { id: 'dashboard',          label: 'Dashboard',                     subs: DASH_SUBS    },
  { id: 'hr',                 label: 'HR Management',                  subs: HR_SUBS      },
  { id: 'import',             label: 'Import',                         subs: IMPORT_SUBS  },
  { id: 'session',            label: 'Master',                         subs: SESSION_SUBS },
  { id: 'enquiry',            label: 'Enquiry Management',             subs: ENQUIRY_SUBS },
  { id: 'abroad',             label: 'Abroad Module',                  subs: ABROAD_SUBS  },
  { id: 'student',            label: 'Student Module',                 subs: STUDENT_SUBS },
  { id: 'student-attendance', label: 'Student Attendance',             subs: STUDENT_ATTENDANCE_SUBS },
  { id: 'timetable',          label: 'Timetable Mgmt',                 subs: TIMETABLE_SUBS          },
  { id: 'lesson-plan',        label: 'Lesson Plan',                    subs: LESSON_PLAN_SUBS        },
  { id: 'visa',               label: 'Visa & Immigration',             subs: VISA_SUBS    },
  { id: 'agent',              label: 'Agent Management',               subs: AGENT_SUBS   },
  { id: 'consultant',         label: 'Consultants Module',             subs: []           },
  { id: 'fee-management',     label: 'Fee Management',                 subs: FEE_MGMT_SUBS   },
  { id: 'fee-master',         label: 'Fee Master',                     subs: FEE_MASTER_SUBS },
  { id: 'examination',        label: 'Examination',                    subs: EXAMINATION_SUBS },
  { id: 'accounts',           label: 'Accounts',                       subs: ACCOUNTS_SUBS    },
  { id: 'alumni',             label: 'Alumni',                         subs: []           },
  { id: 'hostel',             label: 'Hostel',                         subs: HOSTEL_SUBS  },
  { id: 'transport',          label: 'Transport',                      subs: TRANSPORT_SUBS    },
  { id: 'certificate',        label: 'Certificate',                    subs: CERTIFICATE_SUBS  },
  { id: 'document',           label: 'Document',                       subs: DOCUMENT_SUBS     },
  { id: 'reception',          label: 'Reception, Visitor & Gate Pass', subs: RECEPTION_SUBS    },
  { id: 'dispatch',           label: 'Dispatch',                       subs: DISPATCH_SUBS     },
  { id: 'sendsms',            label: 'Send SMS',                       subs: SENDSMS_SUBS      },
  { id: 'whatsapp',           label: 'WhatsApp',                       subs: WHATSAPP_SUBS     },
  { id: 'mobileapp',          label: 'Mobile APP',                     subs: MOBILEAPP_SUBS    },
  { id: 'settings',           label: 'Settings',                       subs: SETTINGS_SUBS },
];

const ALL_SUBS = [
  ...DASH_SUBS, ...HR_SUBS, ...IMPORT_SUBS, ...SESSION_SUBS, ...ENQUIRY_SUBS,
  ...STUDENT_SUBS, ...ABROAD_SUBS, ...VISA_SUBS, ...AGENT_SUBS,
  ...FEE_MGMT_SUBS, ...FEE_MASTER_SUBS, ...HOSTEL_SUBS,
  ...EXAMINATION_SUBS, ...TRANSPORT_SUBS, ...CERTIFICATE_SUBS,
  ...DOCUMENT_SUBS, ...RECEPTION_SUBS, ...DISPATCH_SUBS, ...SENDSMS_SUBS,
  ...WHATSAPP_SUBS, ...MOBILEAPP_SUBS, ...ACCOUNTS_SUBS,
  ...STUDENT_ATTENDANCE_SUBS, ...TIMETABLE_SUBS, ...LESSON_PLAN_SUBS,
  ...SETTINGS_SUBS,
];

const DASH_MAP = {
  'dash-admin':    AdminDashboard,
  'dash-circular': CircularDashboard,
  'dash-assign':   AssignmentDashboard,
  'dash-account':  AccountDashboard,
  'dash-birthday': BirthdayDashboard,
  'dash-rfid':     RFIDDashboard,
  'dash-enquiry':  EnquiryDashboard,
};

const ENQ_MAP = {
  'enq-new':     NewEnquiry,
  'enq-list':    EnquiryDetailsList,
  'enq-view':    EnquiryDetailsView,
  'enq-search':  SearchEnquiry,
  'enq-session': SessionWiseEnquiry,
  'enq-seat':    SeatStatus,
  'enq-done':    DoneFollowup,
  'enq-pending': PendingFollowup,
};

const ROLE_MODULES = {
  'Administrator': [
    'dashboard', 'hr', 'import', 'session', 'enquiry', 'abroad', 'student',
    'student-attendance', 'timetable', 'lesson-plan', 'visa', 'agent', 'consultant',
    'fee-management', 'fee-master', 'examination', 'accounts', 'alumni', 'hostel',
    'transport', 'certificate', 'document', 'reception', 'dispatch', 'sendsms',
    'whatsapp', 'mobileapp', 'settings'
  ],
  'Student': [
    'dashboard', 'student', 'fee-management'
  ],
  'Staff/Faculty': [
    'dashboard', 'student', 'student-attendance', 'timetable', 'lesson-plan',
    'hostel', 'abroad', 'visa', 'agent', 'examination', 'certificate', 'document'
  ],
  'HR': [
    'dashboard', 'hr', 'student-attendance'
  ],
  'Accounts': [
    'dashboard', 'fee-management', 'fee-master', 'accounts'
  ],
  'Transport': [
    'dashboard', 'transport'
  ],
  'Agent': [
    'dashboard', 'agent'
  ]
};

const ALLOWED_SUBS = {
  'Student': {
    'dashboard': ['dash-circular'],
    'student': ['stu-leave', 'stu-attendance'],
    'fee-management': ['fmgmt-ledger'],
  },
  'Staff/Faculty': {
    'dashboard': ['dash-circular', 'dash-assign', 'dash-birthday', 'dash-rfid', 'dash-enquiry'],
    'student': ['stu-add', 'stu-edit', 'stu-search', 'stu-attendance', 'stu-leave', 'stu-reports'],
  },
  'HR': {
    'dashboard': ['dash-circular', 'dash-birthday', 'dash-rfid', 'dash-enquiry']
  },
  'Accounts': {
    'dashboard': ['dash-circular', 'dash-account', 'dash-birthday', 'dash-rfid', 'dash-enquiry']
  },
  'Transport': {
    'dashboard': ['dash-circular', 'dash-birthday', 'dash-rfid', 'dash-enquiry']
  },
  'Agent': {
    'dashboard': ['dash-circular', 'dash-birthday', 'dash-rfid', 'dash-enquiry']
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sbOpen,    setSbOpen]    = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: '' });
  const [tourActive, setTourActive] = useState(false);

  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [currentPwd, setCurrentPwd]       = useState('');
  const [newPwd, setNewPwd]               = useState('');
  const [confirmPwd, setConfirmPwd]       = useState('');
  const [pwdError, setPwdError]           = useState('');
  const [pwdSuccess, setPwdSuccess]       = useState('');
  const [pwdLoading, setPwdLoading]       = useState(false);

  const closeChangePwdModal = () => {
    setChangePwdOpen(false);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setPwdError('');
    setPwdSuccess('');
    setPwdLoading(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (newPwd.length < 6) {
      setPwdError('Password must be at least 6 characters long.');
      return;
    }

    setPwdLoading(true);
    fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user?.username,
        currentPassword: currentPwd,
        newPassword: newPwd
      })
    })
      .then(async (res) => {
        const data = await res.json();
        setPwdLoading(false);
        if (!res.ok) {
          setPwdError(data.error || 'Failed to change password.');
        } else {
          setPwdSuccess('Password changed successfully! You will be signed out shortly.');
          setTimeout(() => {
            closeChangePwdModal();
            sessionStorage.removeItem('uct_user');
            sessionStorage.removeItem('uct_token');
            setIsLoggedIn(false);
            setUser(null);
          }, 2000);
        }
      })
      .catch((err) => {
        setPwdLoading(false);
        setPwdError('Server connection error. Please try again.');
      });
  };

  // Compute filtered modules for this user role
  const userRole = user?.role || 'Student';
  const allowedModsForRole = ROLE_MODULES[userRole] || [];

  const filteredModules = MODULES.map(mod => {
    if (!allowedModsForRole.includes(mod.id)) return null;

    let allowedSubs = mod.subs;
    const roleSubsRule = ALLOWED_SUBS[userRole];
    if (roleSubsRule && roleSubsRule[mod.id]) {
      allowedSubs = mod.subs.filter(sub => roleSubsRule[mod.id].includes(sub.id));
    }
    
    // Explicitly restrict 'dash-admin' to Administrator role only
    if (userRole !== 'Administrator') {
      allowedSubs = allowedSubs.filter(sub => sub.id !== 'dash-admin');
    }
    
    return {
      ...mod,
      subs: allowedSubs
    };
  }).filter(Boolean);

  useEffect(() => {
    window.alert = (message) => {
      setCustomAlert({ show: true, message: String(message) });
    };
    const savedUser = sessionStorage.getItem('uct_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setIsLoggedIn(true);
      } catch (e) {
        sessionStorage.removeItem('uct_user');
      }
    }
  }, []);
  const [openMods, setOpenMods] = useState({
    dashboard: false, hr: false, import: false, session: false, enquiry: false,
    student: false, abroad: false, visa: false, agent: false, consultant: false,
    'fee-management': false, 'fee-master': false, hostel: false,
    examination: false, transport: false, certificate: false,
    document: false, reception: false, dispatch: false, sendsms: false,
    whatsapp: false, mobileapp: false, accounts: false,
    'student-attendance': false, timetable: false, 'lesson-plan': false,
    settings: false,
  });
  const [activeMod, setActiveMod] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [userOpen,  setUserOpen]  = useState(false);
  const [pageTitle, setPageTitle] = useState('UCT ERP');
  const [searchVal, setSearchVal] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Auto-start guided tour if the user enters a module they haven't toured yet
  useEffect(() => {
    if (isLoggedIn) {
      const currentTourKey = activeMod ? activeMod : 'dashboard';
      if (TOURS[currentTourKey]) {
        const key = `uct_tour_completed_${currentTourKey}`;
        if (!localStorage.getItem(key)) {
          const timer = setTimeout(() => {
            setTourActive(true);
          }, 600);
          return () => clearTimeout(timer);
        }
      }
      setTourActive(false);
    }
  }, [activeMod, isLoggedIn]);

  // Build full searchable list: modules + all submodules (filtered by role)
  const SEARCH_LIST = [
    // All modules (with or without submodules) are searchable by their label
    ...filteredModules.map(m => ({
      label: m.label, modId: m.id, subId: null, path: m.label, isModule: true,
    })),
    // All submodules are also searchable
    ...filteredModules.flatMap(m => m.subs.map(s => ({
      label: s.label, modId: m.id, subId: s.id, path: m.label + ' › ' + s.label, isModule: false,
    }))),
  ];

  const searchResults = searchVal.trim().length > 0
    ? SEARCH_LIST.filter(item => {
        const q = searchVal.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q)
        );
      }).slice(0, 10)
    : [];

  const handleSearchSelect = (item) => {
    const mod = MODULES.find(m => m.id === item.modId);
    setActiveMod(item.modId);
    if (item.subId) {
      setActiveSub(item.subId);
      setPageTitle(item.label);
    } else {
      if (mod.subs && mod.subs.length > 0) {
        setActiveSub(mod.subs[0].id);
        setPageTitle(mod.subs[0].label);
      } else {
        setActiveSub(null);
        setPageTitle(mod.label);
      }
    }
    if (mod.subs.length > 0) {
      setOpenMods(p => ({ ...p, [item.modId]: true }));
    }
    setSearchVal('');
    setSearchOpen(false);
    closeSidebar();
  };

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setSbOpen(false); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const closeSidebar = () => setSbOpen(false);

  const clickMod = (mod) => {
    const matchedMod = filteredModules.find(m => m.id === mod.id);
    if (!matchedMod) {
      alert('Access Denied. You do not have permissions for this action.');
      return;
    }
    if (mod.id === 'dashboard') {
      setActiveMod('dashboard');
      setActiveSub(null);
      setPageTitle('Dashboard');
      setOpenMods((p) => ({ ...p, dashboard: !p.dashboard }));
      closeSidebar();
    } else if (matchedMod.subs.length > 0) {
      // Just toggle the submenu open/closed — don't navigate away
      setOpenMods((p) => ({ ...p, [mod.id]: !p[mod.id] }));
    } else {
      // Module with no submodules (e.g. Alumni) — navigate directly
      setActiveMod(mod.id);
      setActiveSub(null);
      setPageTitle(mod.label);
      closeSidebar();
    }
  };

  const clickSub = (modId, sub) => {
    const mod = filteredModules.find(m => m.id === modId);
    if (!mod || !mod.subs.some(s => s.id === sub.id)) {
      alert('Access Denied. You do not have permissions for this action.');
      return;
    }
    setActiveMod(modId);
    setActiveSub(sub.id);
    setPageTitle(sub.label);
    closeSidebar();
  };

  const currentMod    = filteredModules.find((m) => m.id === activeMod);
  const activeSubData = ALL_SUBS.find((s) => s.id === activeSub);

  /* ── CONTENT RENDERER ── */
  const renderContent = () => {
    if (!activeMod) {
      return (
        <div>
          <div className="page-heading">Home Dashboard</div>
          <div style={{ marginTop: 24 }}>
            <HomeDashboard 
              user={user} 
              navigateTo={(modId, subId, title) => { setActiveMod(modId); setActiveSub(subId); setPageTitle(title); }} 
            />
          </div>
        </div>
      );
    }

    if (activeMod === 'dashboard') {
      if (activeSub === 'dash-admin' && userRole !== 'Administrator') {
        return (
          <div style={{ padding: 24, textAlign: 'center', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <h2 style={{ color: '#dc2626', marginBottom: 12 }}>Access Denied</h2>
            <p style={{ color: '#64748b', fontSize: 14 }}>You do not have permission to view the Admin Dashboard.</p>
          </div>
        );
      }
      if (activeSub === 'dash-assign' && userRole !== 'Staff/Faculty' && userRole !== 'Administrator') {
        return (
          <div style={{ padding: 24, textAlign: 'center', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <h2 style={{ color: '#dc2626', marginBottom: 12 }}>Access Denied</h2>
            <p style={{ color: '#64748b', fontSize: 14 }}>You do not have permission to view the Assignment Dashboard.</p>
          </div>
        );
      }
      if (activeSub === 'dash-account' && userRole !== 'Accounts' && userRole !== 'Administrator') {
        return (
          <div style={{ padding: 24, textAlign: 'center', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <h2 style={{ color: '#dc2626', marginBottom: 12 }}>Access Denied</h2>
            <p style={{ color: '#64748b', fontSize: 14 }}>You do not have permission to view the Account Dashboard.</p>
          </div>
        );
      }
      const PageComp = (activeSub && DASH_MAP[activeSub]) ? DASH_MAP[activeSub] : HomeDashboard;
      return (
        <div>
          <div className="breadcrumb">
            <span className="bc-link"
              onClick={() => { setActiveMod('dashboard'); setActiveSub(null); setPageTitle('Dashboard'); }}>
              Dashboard
            </span>
            {activeSub && activeSubData && <>{' › '}<b>{activeSubData.label}</b></>}
          </div>
          <div className="page-heading">
            {activeSub && activeSubData ? activeSubData.label : 'Home Dashboard'}
          </div>
          <div style={{ marginTop: 24 }}>
            <PageComp 
              user={user} 
              navigateTo={(modId, subId, title) => { setActiveMod(modId); setActiveSub(subId); setPageTitle(title); }} 
            />
          </div>
        </div>
      );
    }

    if (activeMod === 'hr' && activeSub) {
      return (
        <HRManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'import' && activeSub) {
      return (
        <ImportManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'session' && activeSub) {
      return (
        <SessionManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'enquiry' && activeSub) {
      const PageComp = activeSub && ENQ_MAP[activeSub] ? ENQ_MAP[activeSub] : null;
      return (
        <div>
          <div className="breadcrumb">
            <span className="bc-link"
              onClick={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}>
              Enquiry Management
            </span>
            {activeSub && activeSubData && <>{' › '}<b>{activeSubData.label}</b></>}
          </div>
          <div className="page-heading">
            {activeSub && activeSubData ? activeSubData.label : 'Enquiry Management'}
          </div>
          {PageComp && <div style={{ marginTop: 24 }}><PageComp /></div>}
        </div>
      );
    }

    if (activeMod === 'student' && activeSub) {
      return (
        <StudentManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'abroad' && activeSub) {
      return (
        <AbroadManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'visa' && activeSub) {
      return (
        <VisaManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'agent' && activeSub) {
      return (
        <AgentManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
          onNavigate={(subId, label) => { setActiveSub(subId); setPageTitle(label); }}
        />
      );
    }

    if (activeMod === 'consultant') {
      return (
        <ConsultantManagement
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'fee-management' && activeSub) {
      return (
        <FeeMgmtModule
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'fee-master' && activeSub) {
      return (
        <FeeMasterModule
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'hostel' && activeSub) {
      return (
        <HostelManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'examination' && activeSub) {
      return (
        <ExaminationManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'transport' && activeSub) {
      return (
        <TransportManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'certificate' && activeSub) {
      return (
        <CertificateManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'document' && activeSub) {
      return (
        <DocumentManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'reception' && activeSub) {
      return (
        <ReceptionManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'dispatch' && activeSub) {
      return (
        <DispatchManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
          setPageTitle={setPageTitle}
        />
      );
    }

    if (activeMod === 'sendsms' && activeSub) {
      return (
        <SendSmsManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'whatsapp' && activeSub) {
      return (
        <WhatsappManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'mobileapp' && activeSub) {
      return (
        <MobileAppManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'student-attendance' && activeSub) {
      return (
        <StudentAttendanceModule
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'timetable' && activeSub) {
      return (
        <TimetableMgmtModule
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'lesson-plan' && activeSub) {
      return (
        <LessonPlanModule
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'accounts' && activeSub) {
      return (
        <AccountsManagement
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
        />
      );
    }

    if (activeMod === 'alumni') {
      return (
        <div>
          <div className="page-heading">Alumni</div>
          <div style={{ marginTop: 24 }}><AlumniReport /></div>
        </div>
      );
    }

    if (activeMod === 'settings' && activeSub) {
      return (
        <SettingsDashboard
          activeSub={activeSub}
          onBack={() => { setActiveMod(null); setActiveSub(null); setPageTitle('Dashboard'); }}
          setPageTitle={setPageTitle}
        />
      );
    }

    return (
      <div>
        <div className="page-heading">Home Dashboard</div>
        <div style={{ marginTop: 24 }}>
          <HomeDashboard 
            user={user} 
            navigateTo={(modId, subId, title) => { setActiveMod(modId); setActiveSub(subId); setPageTitle(title); }} 
          />
        </div>
      </div>
    );
  };

  const handleLogin = (userInfo) => {
    sessionStorage.setItem('uct_user', JSON.stringify(userInfo));
    setUser(userInfo);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const avatarName = user?.username ? user.username.slice(0, 2).toUpperCase() : 'AD';

  return (
    <div>

      {/* ── TOP BAR ── */}
      <header className="topbar">
        <button
          className={'sb-toggle' + (sbOpen ? ' open' : '')}
          onClick={() => setSbOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <span /><span /><span />
        </button>
        <img
          src="/uct-logo.png.jpeg"
          alt="UCT Logo"
          style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: '50%', flexShrink: 0 }}
        />
        <div className="brand">UCT <span>ERP</span></div>
        {activeMod && <div className="page-title-pill">{pageTitle}</div>}
        <div className="search-wrap" ref={searchRef} style={{ position: 'relative' }}>
          <span className="search-icon">
            <SvgIcon path="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" size={13} />
          </span>
          <input
            type="text"
            placeholder="Search menu..."
            value={searchVal}
            onChange={e => { setSearchVal(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={e => {
              if (e.key === 'Escape') { setSearchOpen(false); setSearchVal(''); }
              if (e.key === 'Enter' && searchResults.length > 0) handleSearchSelect(searchResults[0]);
            }}
          />
          {searchOpen && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '110%', left: 0, right: 0,
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 9999, maxHeight: 320, overflowY: 'auto',
            }}>
              {searchResults.map((item, i) => (
                <div key={i}
                  onClick={() => handleSearchSelect(item)}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', borderBottom: '0.5px solid #f1f5f9',
                    display: 'flex', flexDirection: 'column', gap: 2,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{item.path}</div>
                </div>
              ))}
            </div>
          )}
          {searchOpen && searchVal.trim().length > 0 && searchResults.length === 0 && (
            <div style={{
              position: 'absolute', top: '110%', left: 0, right: 0,
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 9999, padding: '12px 14px',
              fontSize: 13, color: '#94a3b8', textAlign: 'center',
            }}>
              No results found for "{searchVal}"
            </div>
          )}
        </div>
        <div className="nav-right">
          <button className="icon-btn" title="Notifications">
            <SvgIcon path="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" size={16} />
            <span className="badge" />
          </button>
          <button className="icon-btn" title="Messages">
            <SvgIcon path="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 8 8-8" size={16} />
            <span className="badge" />
          </button>
          <button 
            onClick={() => setTourActive(true)}
            style={{
              background: '#0d5ef4',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginRight: '8px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'block' }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Take Tour
          </button>
          <button className="lang-btn">EN</button>
          <div className="user-wrap" ref={userRef}>
            <div className="user-btn" onClick={() => setUserOpen((v) => !v)}>
              <div className="avatar">{avatarName}</div>
              <div>
                <div className="uname">{user ? user.username : 'Admin'}</div>
                <div className="urole">{user ? user.role : 'Administrator'}</div>
              </div>
              <span className="ucaret">
                <SvgIcon path="M6 9l6 6 6-6" size={10} />
              </span>
            </div>
            <div className={'user-dd' + (userOpen ? ' open' : '')}>
              <div className="dd-item" onClick={() => {
                setUserOpen(false);
                if (user?.role === 'Student') {
                  setActiveMod('student');
                  setActiveSub('stu-edit');
                  setPageTitle('My Profile');
                } else {
                  setActiveMod('hr');
                  setActiveSub('hr-view');
                  setPageTitle('View Employees');
                }
              }}>My Profile</div>
              <div className="dd-item" onClick={() => { setChangePwdOpen(true); setUserOpen(false); }}>Change Password</div>
              <div className="dd-item" onClick={() => setUserOpen(false)}>Preferences</div>
              <div className="dd-item" onClick={() => setUserOpen(false)}>Activity Log</div>
              <div className="dd-item" onClick={() => { sessionStorage.removeItem('uct_user'); sessionStorage.removeItem('uct_token'); setIsLoggedIn(false); setUser(null); setUserOpen(false); }}>Sign Out</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── LEFT SIDEBAR ── */}
      <aside className="sidebar">

        <nav className="sidebar-nav">
          <div className="sb-section-label">Main Menu</div>
          {filteredModules.map((mod, i) => (
            <div key={mod.id}>
              {i === 10 && <div className="sb-sep" />}
              <div
                className={'sb-mod' + (activeMod === mod.id ? ' active' : '')}
                style={{
                  transitionDelay: sbOpen
                    ? (i * 35) + 'ms,' + (i * 35) + 'ms,0ms,0ms'
                    : '0ms',
                }}
                onClick={() => clickMod(mod)}
              >
                <span className="sb-mod-icon">
                  <SvgIcon path={ICONS[mod.id] || ICONS.settings} size={15} />
                </span>
                <span style={{ flex: 1 }}>{mod.label}</span>
                {mod.subs.length > 0 && (
                  <span className={'sb-chevron' + (openMods[mod.id] ? ' open' : '')}>
                    <SvgIcon path="M9 18l6-6-6-6" size={11} />
                  </span>
                )}
              </div>
              {mod.subs.length > 0 && (
                <div className={'sb-subs' + (openMods[mod.id] ? ' open' : '')}>
                  {mod.subs.map((sub, j) => (
                    <div
                      key={sub.id}
                      className={'sb-sub' + (activeSub === sub.id ? ' active' : '')}
                      style={{
                        transitionDelay: openMods[mod.id]
                          ? (j * 28 + 50) + 'ms,' + (j * 28 + 50) + 'ms,0ms,0ms'
                          : '0ms',
                      }}
                      onClick={() => clickSub(mod.id, sub)}
                    >
                      <span className="sb-dot" />
                      {sub.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <strong>v2.0</strong>&nbsp;&middot;&nbsp;UCT ERP
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main">
        <div className="content">
          <div key={`${activeMod}-${activeSub}`} style={{ animation: 'pageSlideIn 0.28s cubic-bezier(0.22,1,0.36,1) both' }}>
            {renderContent()}
          </div>
        </div>
      </main>

      {/* ── CUSTOM APP ALERT MODAL ── */}
      {customAlert.show && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px 32px',
            width: '420px',
            maxWidth: '92%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 40px rgba(13,94,244,0.06)',
            border: '1px solid #e2e8f0',
            borderTop: '5px solid #0d5ef4',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#0d5ef4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: 'inset 0 2px 4px rgba(13,94,244,0.05)'
            }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '10px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>UCT Portal Message</h3>
            <p style={{
              fontSize: '14px',
              color: '#475569',
              lineHeight: '1.55',
              marginBottom: '24px',
              fontWeight: 500,
              wordBreak: 'break-word'
            }}>{customAlert.message}</p>
            <button 
              onClick={() => setCustomAlert({ show: false, message: '' })}
              style={{
                background: '#0d5ef4',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 28px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 12px rgba(13, 94, 244, 0.25)',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#094ecb';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 16px rgba(13, 94, 244, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#0d5ef4';
                e.target.style.transform = 'none';
                e.target.style.boxShadow = '0 4px 12px rgba(13, 94, 244, 0.25)';
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ── */}
      {changePwdOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px 32px',
            width: '400px',
            maxWidth: '92%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            borderTop: '5px solid #0d5ef4',
            position: 'relative'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '16px',
              textAlign: 'center'
            }}>🔐 Change Password</h3>
            
            {pwdError && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
                borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px'
              }}>
                ⚠ {pwdError}
              </div>
            )}
            
            {pwdSuccess && (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a',
                borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px'
              }}>
                ✓ {pwdSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>Current Password</label>
                <input 
                  type="password" 
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px',
                    fontSize: '14px', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>New Password</label>
                <input 
                  type="password" 
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px',
                    fontSize: '14px', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px',
                    fontSize: '14px', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={closeChangePwdModal}
                  disabled={pwdLoading}
                  style={{
                    background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px',
                    padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={pwdLoading}
                  style={{
                    background: '#0d5ef4', color: '#ffffff', border: 'none', borderRadius: '8px',
                    padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    opacity: pwdLoading ? 0.6 : 1
                  }}
                >
                  {pwdLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <TourSystem 
        active={tourActive} 
        steps={TOURS[activeMod || 'dashboard'] || TOURS.dashboard} 
        onClose={() => setTourActive(false)} 
        moduleKey={activeMod || 'dashboard'} 
      />
    </div>
  );
}
