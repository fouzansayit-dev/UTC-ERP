import { useEffect } from 'react';

const ANIM_STYLES = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-14px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Page wrapper ── */
  .page-anim {
    opacity: 0;
    animation: fadeSlideUp 0.22s ease-out forwards;
  }

  /* ── Cards: hr-form, hostel-card, exam-card, agent-card etc ── */
  .hr-form,
  .hostel-card,
  .hostel-wrapper > div,
  .exam-card,
  .exam-section > div,
  .agent-card,
  .agent-section > div,
  .table-wrap,
  .cert-card,
  .doc-card {
    opacity: 0;
    animation: scaleIn 0.28s cubic-bezier(0.34,1.2,0.64,1) forwards;
  }

  /* ── Section titles ── */
  .section-title,
  .hostel-card-title,
  .exam-section-title,
  .page-heading {
    opacity: 0;
    animation: slideInLeft 0.2s ease forwards;
  }

  /* ── Table rows ── */
  .hr-table tbody tr,
  .hostel-table tbody tr,
  .exam-table tbody tr {
    opacity: 0;
    animation: fadeSlideUp 0.18s ease forwards;
  }

  /* ── Breadcrumb ── */
  .breadcrumb {
    opacity: 0;
    animation: slideInLeft 0.15s ease forwards;
  }

  /* ── Hover effects on cards ── */
  .hr-form:hover,
  .hostel-card:hover,
  .exam-card:hover,
  .agent-card:hover,
  .table-wrap:hover {
    box-shadow: 0 6px 24px rgba(67,97,238,0.12) !important;
    transform: translateY(-2px);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  /* ── Button hover lift ── */
  .submit-btn:hover,
  .hostel-btn-primary:hover,
  .stu-btn:hover,
  .exam-btn:hover,
  .agent-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(67,97,238,0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  /* ── Table row hover ── */
  .hr-table tbody tr:hover,
  .hostel-table tbody tr:hover,
  .exam-table tbody tr:hover {
    background: #eef0fd !important;
    transition: background 0.15s ease;
  }

  /* ── Input focus glow ── */
  .form-input:focus,
  .hostel-field input:focus,
  .hostel-field select:focus,
  .hostel-field textarea:focus {
    border-color: #4361ee !important;
    box-shadow: 0 0 0 3px rgba(67,97,238,0.1) !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  /* ── Stagger delays for cards ── */
  .hr-form:nth-child(1), .hostel-card:nth-child(1), .exam-card:nth-child(1) { animation-delay: 0ms; }
  .hr-form:nth-child(2), .hostel-card:nth-child(2), .exam-card:nth-child(2) { animation-delay: 60ms; }
  .hr-form:nth-child(3), .hostel-card:nth-child(3), .exam-card:nth-child(3) { animation-delay: 120ms; }

  /* ── Table row stagger ── */
  .hr-table tbody tr:nth-child(1)  { animation-delay: 30ms; }
  .hr-table tbody tr:nth-child(2)  { animation-delay: 55ms; }
  .hr-table tbody tr:nth-child(3)  { animation-delay: 80ms; }
  .hr-table tbody tr:nth-child(4)  { animation-delay: 105ms; }
  .hr-table tbody tr:nth-child(5)  { animation-delay: 130ms; }
  .hr-table tbody tr:nth-child(6)  { animation-delay: 155ms; }
  .hr-table tbody tr:nth-child(7)  { animation-delay: 180ms; }
  .hr-table tbody tr:nth-child(8)  { animation-delay: 205ms; }
  .hr-table tbody tr:nth-child(9)  { animation-delay: 230ms; }
  .hr-table tbody tr:nth-child(10) { animation-delay: 255ms; }
`;

let injected = false;

export default function usePageAnimations() {
  useEffect(() => {
    if (injected) return;
    const el = document.createElement('style');
    el.id = 'page-anim-styles';
    el.textContent = ANIM_STYLES;
    document.head.appendChild(el);
    injected = false; // allow re-inject on page change
  }, []);
}
