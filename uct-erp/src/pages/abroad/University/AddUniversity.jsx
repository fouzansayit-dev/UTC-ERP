import React, { useState } from 'react';
import '../../student/Student.css';

const COUNTRIES = ['Russia','Philippines','Kazakhstan','Georgia','Kyrgyzstan','Bangladesh','Ukraine'];
const VISA_TYPES = {
  Russia:      'Student Visa (D-Visa)',
  Philippines: 'Student Visa (9(f))',
  Kazakhstan:  'Student Visa',
  Georgia:     'Student Residence Permit',
  Kyrgyzstan:  'Student Visa',
  Bangladesh:  'Student Visa',
  Ukraine:     'Type D Student Visa',
};
const CURRENCY_MAP = {
  Russia:'USD/RUB', Philippines:'USD/PHP', Kazakhstan:'USD/KZT',
  Georgia:'USD/GEL', Kyrgyzstan:'USD/KGS', Bangladesh:'USD/BDT', Ukraine:'USD/UAH',
};
const INTAKE_OPTIONS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function AddUniversity() {
  const [form, setForm] = useState({
    name:'', country:'Russia', nmcStatus:'Approved', visaType:'Student Visa (D-Visa)',
    currency:'USD/RUB', duration:'6', tuitionUSD:'', hostelUSD:'',
    intakes:[], notes:'', website:'',
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => {
    const val = e.target.value;
    if (k === 'country') {
      setForm((p) => ({ ...p, country: val, visaType: VISA_TYPES[val]||'', currency: CURRENCY_MAP[val]||'' }));
    } else {
      setForm((p) => ({ ...p, [k]: val }));
    }
  };

  const toggleIntake = (month) => {
    setForm((p) => ({
      ...p,
      intakes: p.intakes.includes(month) ? p.intakes.filter((m)=>m!==month) : [...p.intakes, month]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitted && (
        <div style={{ background:'#dcfce7', border:'1px solid #86efac', color:'#15803d', borderRadius:8, padding:'12px 18px', marginBottom:16, fontWeight:600, fontSize:13 }}>
          ✅ University added to master list successfully.
        </div>
      )}

      <div className="stu-filter-card">
        <div className="stu-filter-header">Add University</div>
        <div className="stu-filter-body">

          <div className="stu-section-banner" style={{ marginTop:0 }}>University Information</div>
          <div className="stu-form-grid">
            <div className="stu-field stu-form-col-2">
              <label>University Name *</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Full official university name" required />
            </div>
            <div className="stu-field">
              <label>Country *</label>
              <select value={form.country} onChange={set('country')}>
                {COUNTRIES.map((c)=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>NMC Approval Status *</label>
              <select value={form.nmcStatus} onChange={set('nmcStatus')}>
                <option>Approved</option><option>Approved*</option><option>Pending</option><option>Not Approved</option>
              </select>
            </div>
            <div className="stu-field">
              <label>Website</label>
              <input type="url" value={form.website} onChange={set('website')} placeholder="https://..." />
            </div>
          </div>

          <div className="stu-section-banner">Visa & Currency</div>
          <div className="stu-form-grid">
            <div className="stu-field">
              <label>Visa Type *</label>
              <input type="text" value={form.visaType} onChange={set('visaType')} />
            </div>
            <div className="stu-field">
              <label>Currency Pair</label>
              <input type="text" value={form.currency} readOnly style={{ background:'#f9fafb', color:'#6b7280' }} />
            </div>
          </div>

          <div className="stu-section-banner">Duration & Fees</div>
          <div className="stu-form-grid">
            <div className="stu-field">
              <label>Duration (Years) *</label>
              <select value={form.duration} onChange={set('duration')}>
                {['4','5','5.5','6'].map((d)=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="stu-field">
              <label>Annual Tuition Fee (USD) *</label>
              <input type="number" value={form.tuitionUSD} onChange={set('tuitionUSD')} placeholder="e.g. 5000" min="0" />
            </div>
            <div className="stu-field">
              <label>Annual Hostel Fee (USD)</label>
              <input type="number" value={form.hostelUSD} onChange={set('hostelUSD')} placeholder="e.g. 1200" min="0" />
            </div>
          </div>

          <div className="stu-section-banner">Intake Months</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
            {INTAKE_OPTIONS.map((m) => (
              <div key={m}
                onClick={() => toggleIntake(m)}
                style={{
                  padding:'6px 14px', borderRadius:20, fontSize:13, cursor:'pointer', fontWeight:500,
                  background: form.intakes.includes(m)?'#1e293b':'#f3f4f6',
                  color: form.intakes.includes(m)?'#fff':'#374151',
                  border:`1px solid ${form.intakes.includes(m)?'#1e293b':'#e5e7eb'}`,
                  transition:'all 0.15s'
                }}
              >{m}</div>
            ))}
          </div>
          {form.intakes.length > 0 && (
            <div style={{ fontSize:12, color:'#6b7280', marginTop:6 }}>
              Selected: {form.intakes.join(', ')}
            </div>
          )}

          <div className="stu-section-banner">Notes</div>
          <div className="stu-form-grid">
            <div className="stu-field stu-form-col-2">
              <label>Additional Notes / Special Considerations</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="Recognition status, special requirements, NMC update notes..." />
            </div>
          </div>

          <div className="stu-btn-row" style={{ marginTop:20 }}>
            <button type="submit" className="stu-btn stu-btn-primary" onClick={() => alert("Action")}>✓ Save University</button>
            <button type="button" className="stu-btn stu-btn-secondary" onClick={() => alert("Action")}>Cancel</button>
          </div>
        </div>
      </div>
    </form>
  );
}
