export const TOURS = {
  dashboard: [
    {
      title: "Welcome to UCT ERP!",
      content: "This ERP portal is designed to manage student lifecycles, attendance, fees, and employee databases. Let's take a quick 1-minute tour to see how to navigate.",
      moduleName: "Home Dashboard"
    },
    {
      selector: ".brand",
      title: "UCT ERP Portal",
      content: "This is your main navigation brand. Clicking this or the logo will always bring you back to the home dashboard.",
      position: "bottom",
      moduleName: "Home Dashboard"
    },
    {
      selector: ".search-wrap",
      title: "Global Search Menu",
      content: "Type anything here (like 'Attendance', 'Fees', or 'Visa') to search across all 25 modules and submodules and navigate instantly.",
      position: "bottom",
      moduleName: "Home Dashboard"
    },
    {
      selector: ".sidebar-nav",
      title: "Main Sidebar Menu",
      content: "All operational modules are grouped here. Expand categories to access specific pages such as Student, Abroad, Timetable, Exams, and Settings.",
      position: "right",
      moduleName: "Home Dashboard"
    },
    {
      selector: ".user-wrap",
      title: "User Control Panel",
      content: "View your current logged-in user profile, change settings, or sign out safely from this drop-down.",
      position: "bottom",
      moduleName: "Home Dashboard"
    }
  ],

  'student-attendance': [
    {
      title: "Student Attendance Guide",
      content: "This module allows teachers and administrators to search for student groups, mark daily attendance, and export attendance history.",
      moduleName: "Attendance"
    },
    {
      selector: "[data-tour='attendance-filters']",
      title: "Search Filters",
      content: "Select the Course, Branch, and Batch of students you wish to view. Choose default attendance status (P = Present, A = Absent, L = Leave) to pre-fill the rows.",
      position: "bottom",
      moduleName: "Attendance"
    },
    {
      selector: "[data-tour='submit-filters']",
      title: "Load Students",
      content: "Click 'Submit' to load all students belonging to the selected batch and class. Let's do that next.",
      position: "bottom",
      moduleName: "Attendance"
    },
    {
      selector: "[data-tour='attendance-table']",
      title: "Marking Grid",
      content: "Once loaded, students appear here. You can manually toggle individual student attendance status by clicking the radio buttons.",
      position: "top",
      moduleName: "Attendance"
    },
    {
      selector: "[data-tour='submit-attendance']",
      title: "Submit Daily Record",
      content: "Click this button to save the attendance log to the database. An SMS notification can automatically be sent to parents if enabled in the filters.",
      position: "top",
      moduleName: "Attendance"
    }
  ],

  abroad: [
    {
      title: "Abroad Lifecycle Management",
      content: "Track students studying abroad across a comprehensive 14-stage lifecycle (from enquiry, visa tracking, arrival on-campus, to graduation and alumni).",
      moduleName: "Abroad Lifecycle"
    },
    {
      selector: "[data-tour='lifecycle-filters']",
      title: "Interactive Filters",
      content: "Filter students by destination country, current lifecycle stage, session year, or search for their name/roll number directly.",
      position: "bottom",
      moduleName: "Abroad Lifecycle"
    },
    {
      selector: "[data-tour='lifecycle-table']",
      title: "Student Lifecycle Grid",
      content: "Shows all abroad students, their current universities, active agent linkage, and current stage badge. You can view their full history here.",
      position: "top",
      moduleName: "Abroad Lifecycle"
    },
    {
      selector: "[data-tour='advance-stage-btn']",
      title: "Advance Student Stage",
      content: "When a student completes a lifecycle milestone (e.g. gets visa approved, departs, or remits fee), click 'Advance' to move them to the next stage immediately.",
      position: "left",
      moduleName: "Abroad Lifecycle"
    },
    {
      selector: "[data-tour='lifecycle-legend']",
      title: "Stage Progress Legend",
      content: "Refer to this color-coded guide to understand the details of all 14 stages of the student's journey abroad.",
      position: "top",
      moduleName: "Abroad Lifecycle"
    }
  ],

  'abroad-country-master': [
    {
      title: "Country Master Guide",
      content: "Configure destination countries, currency configurations, and consulate locations to feed values into the university and visa masters.",
      moduleName: "Country Master"
    },
    {
      selector: "[data-tour='country-form']",
      title: "Register Country",
      content: "Fill in the country name, currency, ISO code, and embassy location. Toggle whether the country's medical degrees are NMC-recognized.",
      position: "bottom",
      moduleName: "Country Master"
    },
    {
      selector: "[data-tour='country-table']",
      title: "Configured List",
      content: "All configured countries are cataloged here. You can remove inactive destination countries from this grid.",
      position: "top",
      moduleName: "Country Master"
    }
  ],

  'abroad-uni-master': [
    {
      title: "University Master Guide",
      content: "Create international host medical colleges, tuition costs, and local coordinator details.",
      moduleName: "University Master"
    },
    {
      selector: "[data-tour='uni-form']",
      title: "Add University Details",
      content: "Input the university name, associate it with a configured country, set QS rankings, annual costs in USD, and intake month parameters.",
      position: "bottom",
      moduleName: "University Master"
    },
    {
      selector: "[data-tour='uni-table']",
      title: "Universities Grid",
      content: "Displays all configured foreign colleges, fee schedules, coordinator contact numbers, and WHO/NMC approvals list.",
      position: "top",
      moduleName: "University Master"
    }
  ],

  'abroad-visa-type-master': [
    {
      title: "Visa Classifications Master",
      content: "Configure standard student visa profiles, validity periods, and renewal deadlines.",
      moduleName: "Visa Master"
    },
    {
      selector: "[data-tour='visa-form']",
      title: "New Visa Template",
      content: "Define the visa stamp title, validity in months, and the renewal alert buffer (days before expiry).",
      position: "bottom",
      moduleName: "Visa Master"
    }
  ],

  'abroad-forex': [
    {
      title: "Forex Remittance Guide",
      content: "Record outward bank transfers to foreign universities. Tracks conversion rates, SWIFT references, and RBI purpose codes.",
      moduleName: "Forex Remittance"
    },
    {
      selector: "[data-tour='forex-form']",
      title: "Record Bank Transfer",
      content: "Select the candidate and target university. Input the exchange rate and USD amount. The INR equivalent will be calculated automatically.",
      position: "bottom",
      moduleName: "Forex Remittance"
    },
    {
      selector: "[data-tour='forex-table']",
      title: "SWIFT & Purpose Codes",
      content: "Track transaction details, SWIFT MT103 confirmation numbers, and bank clearance statuses.",
      position: "top",
      moduleName: "Forex Remittance"
    }
  ],

  'abroad-nmc-internship': [
    {
      title: "Internship & FMGE Tracker",
      content: "Monitor graduate student placements in hospital internships, FMGE/NExT screening exams, and state council registrations.",
      moduleName: "Internship Tracker"
    },
    {
      selector: "[data-tour='intern-form']",
      title: "Log Internship File",
      content: "Select the student, enter their training hospital, select dates, and update their FMGE qualifying status.",
      position: "bottom",
      moduleName: "Internship Tracker"
    }
  ],

  'abroad-return-visit': [
    {
      title: "Return Visit Management",
      content: "Logs when students return home on vacation, audits passports/visas, and tracks re-departure dates.",
      moduleName: "Return Visits"
    },
    {
      selector: "[data-tour='visit-form']",
      title: "Register Return Logistics",
      content: "Set arrival and re-departure dates. Audit visa/passport validity to ensure student travel readiness.",
      position: "bottom",
      moduleName: "Return Visits"
    }
  ],

  'abroad-agent-portal': [
    {
      title: "Agent Portal Simulation Workspace",
      content: "Recruitment agencies log in here to inspect referred candidates, monitor commission ledgers, and upload invoices.",
      moduleName: "Agent Portal"
    },
    {
      selector: "[data-tour='agent-identity']",
      title: "Switch Agency Identity",
      content: "Select an agent profile to view candidate stats and referral commissions from their perspective.",
      position: "bottom",
      moduleName: "Agent Portal"
    },
    {
      selector: "[data-tour='agent-tabs']",
      title: "Navigation Tabs",
      content: "Toggle between referred student pipelines, commission ledgers, and the invoice upload console.",
      position: "bottom",
      moduleName: "Agent Portal"
    }
  ],

  'fmgmt-ledger': [
    {
      title: "Student Fee Ledger Statement",
      content: "Generates comprehensive debit and credit journals for students, tracking initial tuition charges, payments, and outstanding balances.",
      moduleName: "Fee Ledger"
    },
    {
      selector: "[data-tour='ledger-search']",
      title: "Select Student Profile",
      content: "Select a student to fetch their transaction history, payments, and outstanding due balance.",
      position: "bottom",
      moduleName: "Fee Ledger"
    },
    {
      selector: "[data-tour='ledger-table']",
      title: "Debit/Credit Journal",
      content: "Lists date-wise transaction details. Debits represent charges, credits show payments/discounts, and a running outstanding balance is kept in real-time.",
      position: "top",
      moduleName: "Fee Ledger"
    }
  ],

  hr: [
    {
      title: "HR & Payroll Guide",
      content: "Create new employee records, manage departments, record biometric logs, approve leaves, and process monthly salaries.",
      moduleName: "HR Management"
    },
    {
      selector: "[data-tour='hr-search']",
      title: "Employee Directory",
      content: "Search through the employee directory by name, code, or department. You can delete or edit employee details from this grid.",
      position: "bottom",
      moduleName: "HR Management"
    }
  ]
};
