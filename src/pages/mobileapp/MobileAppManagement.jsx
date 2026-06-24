import React from 'react';
import '../hr/HRManagement.css';

import Circular              from './submodules/Circular.jsx';
import AppFeedbackReport     from './submodules/AppFeedbackReport.jsx';
import ContactUs             from './submodules/ContactUs.jsx';
import Calendar              from './submodules/Calendar.jsx';
import Gallery               from './submodules/Gallery.jsx';
import VideoImportantLink    from './submodules/VideoImportantLink.jsx';
import Assignment            from './submodules/Assignment.jsx';
import Syllabus              from './submodules/Syllabus.jsx';
import Download              from './submodules/Download.jsx';
import AssignmentDetails     from './submodules/AssignmentDetails.jsx';
import AcademicVideo         from './submodules/AcademicVideo.jsx';
import AcademicNotes         from './submodules/AcademicNotes.jsx';
import AcademicNotesDetails  from './submodules/AcademicNotesDetails.jsx';
import AcademicVideosDetails from './submodules/AcademicVideosDetails.jsx';
import CertificateApplyReport from './submodules/CertificateApplyReport.jsx';

export const MOBILEAPP_SUBMODULES = [
  { id: 'app-circular',           label: 'Circular',                  component: Circular              },
  { id: 'app-feedback',           label: 'App Feedback Report',        component: AppFeedbackReport     },
  { id: 'app-contactus',          label: 'Contact Us',                 component: ContactUs             },
  { id: 'app-calendar',           label: 'Calendar',                   component: Calendar              },
  { id: 'app-gallery',            label: 'Gallery',                    component: Gallery               },
  { id: 'app-video',              label: 'Video & Important Link',     component: VideoImportantLink    },
  { id: 'app-assignment',         label: 'Assignment',                 component: Assignment            },
  { id: 'app-syllabus',           label: 'Syllabus',                   component: Syllabus              },
  { id: 'app-download',           label: 'Download',                   component: Download              },
  { id: 'app-assignment-details', label: 'Assignment Details',         component: AssignmentDetails     },
  { id: 'app-academic-video',     label: 'Academic Video',             component: AcademicVideo         },
  { id: 'app-academic-notes',     label: 'Academic Notes',             component: AcademicNotes         },
  { id: 'app-notes-details',      label: 'Academic Notes Details',     component: AcademicNotesDetails  },
  { id: 'app-videos-details',     label: 'Academic Videos Details',    component: AcademicVideosDetails },
  { id: 'app-cert-apply',         label: 'Certificate Apply Report',   component: CertificateApplyReport},
];

export default function MobileAppManagement({ activeSub, onBack }) {
  const current = MOBILEAPP_SUBMODULES.find(s => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Mobile APP</span>
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
      <div className="breadcrumb"><b>Mobile APP</b></div>
      <div className="page-heading">Mobile APP</div>
    </div>
  );
}
