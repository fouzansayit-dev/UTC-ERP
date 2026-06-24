import React from 'react';
import '../hr/HRManagement.css';

/* ── Session Master only (Add Session / Report / Active removed) ── */
import SessionMaster from './submodules/SessionMaster.jsx';

/* ── 15 Master submodules ── */
import UniversityMaster                                          from './submodules/UniversityMaster.jsx';
import CourseMaster                                              from './submodules/CourseMaster.jsx';
import BranchMaster                                              from './submodules/BranchMaster.jsx';
import BatchMaster                                               from './submodules/BatchMaster.jsx';
import ConsultantMaster                                          from './submodules/ConsultantMaster.jsx';
import { ReligionMaster, CasteMaster, CategoryMaster } from './submodules/SimpleMasters.jsx';
import OccupationMaster from './submodules/OccupationMaster.jsx';
import TemplateMaster                                            from './submodules/TemplateMaster.jsx';
import { SchoolMaster, BoardUniversityMaster, CityDistrictMaster, ScholarshipMaster, SubjectMaster } from './submodules/MasterPages.jsx';

/* ── 4 NEW masters (Section 3.2) ── */
import { CountryMaster, ForeignUniversityMaster, AgentMaster, VisaTypeMaster } from './submodules/NewMasters.jsx';

/* ── Missing: I-Card Setting ── */
import ICardSetting from './submodules/ICardSetting.jsx';

export const SESSION_SUBMODULES = [
  /* ── Session Master ── */
  { id: 'session-master',       label: 'Session Master',          component: SessionMaster         },

  /* ── 15 Master Tables (from requirement) ── */
  { id: 'master-university',    label: 'University Master',        component: UniversityMaster      },
  { id: 'master-course',        label: 'Course Master',            component: CourseMaster          },
  { id: 'master-branch',        label: 'Branch Master',            component: BranchMaster          },
  { id: 'master-batch',         label: 'Batch Master',             component: BatchMaster           },
  { id: 'master-consultant',    label: 'Consultant Master',        component: ConsultantMaster      },
  { id: 'master-religion',      label: 'Religion Master',          component: ReligionMaster        },
  { id: 'master-occupation',    label: 'Occupation Master',        component: OccupationMaster      },
  { id: 'master-template',      label: 'Template Master',          component: TemplateMaster        },
  { id: 'master-caste',         label: 'Caste Master',             component: CasteMaster           },
  { id: 'master-category',      label: 'Category Master',          component: CategoryMaster        },
  { id: 'master-school',        label: 'School Master',            component: SchoolMaster          },
  { id: 'master-board',         label: 'Board/University Master',  component: BoardUniversityMaster },
  { id: 'master-city',          label: 'City/District Master',     component: CityDistrictMaster    },
  { id: 'master-scholarship',   label: 'Scholarship Master',       component: ScholarshipMaster     },
  { id: 'master-subject',       label: 'Subject Master',           component: SubjectMaster         },
  { id: 'master-icard',         label: 'I-Card Setting',           component: ICardSetting          },

  /* ── 4 NEW Masters (Section 3.2) ── */
  { id: 'master-country',       label: 'Country Master',           component: CountryMaster         },
  { id: 'master-foreign-uni',   label: 'Foreign University Master',component: ForeignUniversityMaster },
  { id: 'master-agent',         label: 'Agent Master',             component: AgentMaster           },
  { id: 'master-visa-type',     label: 'Visa Type Master',         component: VisaTypeMaster        },
];

export default function SessionManagement({ activeSub, onBack }) {
  const current = SESSION_SUBMODULES.find((s) => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>Master</span>
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
      <div className="breadcrumb"><b>Master</b></div>
      <div className="page-heading">Master</div>
    </div>
  );
}
