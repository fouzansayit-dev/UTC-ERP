import React from 'react';
import './ExaminationManagement.css';

import ExamDashboard     from './ExamDashboard.jsx';
import ExamSchedule      from './ExamSchedule.jsx';
import HallTicket        from './HallTicket.jsx';
import Results           from './Results.jsx';

import ExamSession        from './submodules/ExamSession.jsx';
import NominalRoll        from './submodules/NominalRoll.jsx';
import FormAccept         from './submodules/FormAccept.jsx';
import CCEMarkEntry       from './submodules/CCEMarkEntry.jsx';
import PracticalMarkEntry from './submodules/PracticalMarkEntry.jsx';
import MarksEntry         from './submodules/MarksEntry.jsx';
import ScholarRegister    from './submodules/ScholarRegister.jsx';
import AttendanceSheet    from './submodules/AttendanceSheet.jsx';
import AbroadResultUpload from './submodules/AbroadResultUpload.jsx';
import FMGETracking       from './submodules/FMGETracking.jsx';

export const EXAMINATION_SUBMODULES = [
  { id: 'exam-dashboard',     label: 'Exam Dashboard',                  component: ExamDashboard     },
  { id: 'exam-schedule',      label: 'Exam Schedule',                   component: ExamSchedule      },
  { id: 'exam-session',       label: 'Exam Session / Add Semester',     component: ExamSession       },
  { id: 'exam-nominal-roll',  label: 'Nominal Roll I & II',             component: NominalRoll       },
  { id: 'exam-form-accept',   label: 'Form Accept',                     component: FormAccept        },
  { id: 'exam-hall-ticket',   label: 'Hall Ticket',                     component: HallTicket        },
  { id: 'exam-cce-mark',      label: 'CCE Mark Entry',                  component: CCEMarkEntry      },
  { id: 'exam-practical-mark',label: 'Practical Mark Entry',            component: PracticalMarkEntry},
  { id: 'exam-marks-entry',   label: 'Marks Entry (Theory)',            component: MarksEntry        },
  { id: 'exam-scholar-reg',   label: 'Scholar Register',                component: ScholarRegister   },
  { id: 'exam-attendance',    label: 'Attendance Sheet (Subject-wise)', component: AttendanceSheet   },
  { id: 'exam-results',       label: 'Results',                         component: Results           },
  { id: 'exam-abroad-result', label: 'Abroad Result Upload',            component: AbroadResultUpload},
  { id: 'exam-fmge',          label: 'FMGE / NExT Tracking',           component: FMGETracking      },
];

export default function ExaminationManagement({ activeSub, onBack }) {
  const current = EXAMINATION_SUBMODULES.find((s) => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Examination</span>
          {' › '}
          <b>{current.label}</b>
        </div>
        <div className="page-heading">{current.label}</div>
        <div style={{ marginTop: 24 }}><PageComp /></div>
      </div>
    );
  }

  return (
    <div>
      <div className="breadcrumb"><b>Examination</b></div>
      <div className="page-heading">Examination</div>
      <p style={{ marginTop: 16, color: '#6b7280', fontSize: 14 }}>
        Select a submodule from the sidebar to get started.
      </p>
    </div>
  );
}
