import React from 'react';
import './Student.css';

import AddStudent         from './management/AddStudent.jsx';
import EditStudent        from './management/EditStudent.jsx';
import AssignRollNumber   from './management/AssignRollNumber.jsx';
import StudentPromotion   from './management/StudentPromotion.jsx';
import DropoutManagement  from './management/DropoutManagement.jsx';
import SessionWiseStudent from './management/SessionWiseStudent.jsx';
import StudentSearch      from './management/StudentSearch.jsx';
import TerminateStudent   from './management/TerminateStudent.jsx';
import StudentReports     from './reports/StudentReports.jsx';
import StudentAttendance  from './attendance/StudentAttendance.jsx';
import StudentLeave       from './leave/StudentLeave.jsx';

export const STUDENT_SUBMODULES = [
  { id: 'stu-add',        label: 'Add Student',                        component: AddStudent },
  { id: 'stu-edit',       label: 'View / Edit Student',                component: EditStudent },
  { id: 'stu-roll',       label: 'Roll No / Enrollment No Allocation', component: AssignRollNumber },
  { id: 'stu-promote',    label: 'Promote Student',                    component: StudentPromotion },
  { id: 'stu-dropout',    label: 'Dropout Student',                    component: DropoutManagement },
  { id: 'stu-terminate',  label: 'Terminate Student',                  component: TerminateStudent },
  { id: 'stu-search',     label: 'Search Student',                     component: StudentSearch },
  { id: 'stu-session',    label: 'Session Wise Student',               component: SessionWiseStudent },
  { id: 'stu-attendance', label: 'Student Attendance',                 component: StudentAttendance },
  { id: 'stu-leave',      label: 'Student Leave Apply / Details',      component: StudentLeave },
  { id: 'stu-reports',    label: 'Student Reports',                    component: StudentReports },
];

export default function StudentManagement({ activeSub, onBack }) {
  const current = STUDENT_SUBMODULES.find((s) => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Student Module</span>
          {' › '}
          <b>{current.label}</b>
        </div>
        <div className="page-heading">{current.label}</div>
        <div style={{ marginTop: 24 }}>
          <PageComp />
        </div>
      </div>
    );
  }

  return null;
}
