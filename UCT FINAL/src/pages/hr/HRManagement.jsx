import React from 'react';
import './HRManagement.css';

import NewEmployee              from './submodules/NewEmployee.jsx';
import ViewEmployee             from './submodules/ViewEmployee.jsx';
import GenerateSalary           from './submodules/GenerateSalary.jsx';
import PaySalary                from './submodules/PaySalary.jsx';
import EmployeeAttendance       from './submodules/EmployeeAttendance.jsx';
import EmployeeAttendanceReport from './submodules/EmployeeAttendanceReport.jsx';
import EmployeeSalaryRegister   from './submodules/EmployeeSalaryRegister.jsx';
import NewDepartment            from './submodules/NewDepartment.jsx';
import AttendanceReportII       from './submodules/AttendanceReportII.jsx';
import AttendanceSheet          from './submodules/AttendanceSheet.jsx';
import AttendanceRegister       from './submodules/AttendanceRegister.jsx';
import HolidayManagement        from './submodules/HolidayManagement.jsx';
import EmployeeICard            from './submodules/EmployeeICard.jsx';
import TimeSlotMaster           from './submodules/TimeSlotMaster.jsx';
import AddCategory              from './submodules/AddCategory.jsx';
import AddLeaveType             from './submodules/AddLeaveType.jsx';
import LeaveAllocation          from './submodules/LeaveAllocation.jsx';
import AddLeaveApplication      from './submodules/AddLeaveApplication.jsx';
import LeaveReport              from './submodules/LeaveReport.jsx';
import BiometricLogs            from './submodules/BiometricLogs.jsx';
import EmployeeImport           from './submodules/EmployeeImport.jsx';

export const HR_SUBMODULES = [
  { id: 'hr-new-emp',      label: 'New Employee',                  component: NewEmployee },
  { id: 'hr-view-emp',     label: 'View Employee',                 component: ViewEmployee },
  { id: 'hr-gen-salary',   label: 'Generate Salary',               component: GenerateSalary },
  { id: 'hr-pay-salary',   label: 'Pay Salary',                    component: PaySalary },
  { id: 'hr-attendance',   label: 'Employee Attendance',           component: EmployeeAttendance },
  { id: 'hr-att-report',   label: 'Employee Attendance Report',    component: EmployeeAttendanceReport },
  { id: 'hr-sal-register', label: 'Employee Salary Register',      component: EmployeeSalaryRegister },
  { id: 'hr-new-dept',     label: 'New Department',                component: NewDepartment },
  { id: 'hr-att-report2',  label: 'Employee Attendance Report-II', component: AttendanceReportII },
  { id: 'hr-att-sheet',    label: 'Attendance Sheet',              component: AttendanceSheet },
  { id: 'hr-att-register', label: 'Employee Attendance Register',  component: AttendanceRegister },
  { id: 'hr-holiday',      label: 'Employee Holiday Mgmt',         component: HolidayManagement },
  { id: 'hr-icard',        label: 'Employee I-Card',               component: EmployeeICard },
  { id: 'hr-time-slot',    label: 'Time Slot Master',              component: TimeSlotMaster },
  { id: 'hr-category',     label: 'Add Employee Category',         component: AddCategory },
  { id: 'hr-leave-type',   label: 'Add Leave Type',                component: AddLeaveType },
  { id: 'hr-leave-alloc',  label: 'Leave Allocation',              component: LeaveAllocation },
  { id: 'hr-leave-app',    label: 'Add Leave Application',         component: AddLeaveApplication },
  { id: 'hr-leave-report', label: 'Leave Application Report',      component: LeaveReport },
  { id: 'hr-biometric',    label: 'Biometric Logs',                component: BiometricLogs },
  { id: 'hr-import',       label: 'Employee Import',               component: EmployeeImport },
];

export default function HRManagement({ activeSub, onBack }) {
  const current = HR_SUBMODULES.find((s) => s.id === activeSub);

  if (current) {
    const PageComp = current.component;
    return (
      <div>
        <div className="breadcrumb">
          <span className="bc-link" onClick={onBack}>HR Management</span>
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
      <div className="breadcrumb"><b>HR Management</b></div>
      <div className="page-heading">HR Management</div>
    </div>
  );
}
