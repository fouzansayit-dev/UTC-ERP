import React, { useState } from 'react';

export default function SendSmsEmployee() {
  const [lang, setLang] = useState('English');
  const [template, setTemplate] = useState('');
  const [composeSms, setComposeSms] = useState('');
  const [selected, setSelected] = useState([]);

  const employees = [];

  const charCount = composeSms.length;
  const smsCount = charCount === 0 ? 0 : Math.ceil(charCount / 160);

  const toggleAll = (val) => {
    if (val) setSelected(employees.map((_, i) => i));
    else setSelected([]);
  };

  const toggleOne = (i) => {
    setSelected(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  };

  return (
    <div className="hr-form">
      <div className="section-title">Send SMS to Employee</div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)', marginBottom: 24,
      }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Language</label>
            <select className="form-input" value={lang} onChange={e => setLang(e.target.value)}>
              <option>English</option>
              <option>Portuguese</option>
            </select>
          </div>
          <div className="form-field">
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Char count: <b>{charCount}</b></span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>SMS count: <b>{smsCount}</b></span>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Template</label>
            <select className="form-input" value={template} onChange={e => { setTemplate(e.target.value); setComposeSms(e.target.value); }}>
              <option value="">Select</option>
            </select>
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Compose SMS</label>
            <textarea className="form-input form-textarea" rows={3} value={composeSms} onChange={e => setComposeSms(e.target.value)} placeholder="Type your SMS here..." />
          </div>
        </div>
      </div>

      <div style={{
        background: '#1e293b', color: '#fff', padding: '14px 20px',
        borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15,
      }}>
        Send SMS to Employee
      </div>

      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" onChange={e => toggleAll(e.target.checked)} checked={employees.length > 0 && selected.length === employees.length} /></th>
              <th>SNo.</th>
              <th>Name</th>
              <th>Qualification</th>
              <th>Designation</th>
              <th>Mobile No</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan={7} className="empty-table-msg">No data available in table</td></tr>
            ) : employees.map((emp, i) => (
              <tr key={i}>
                <td><input type="checkbox" checked={selected.includes(i)} onChange={() => toggleOne(i)} /></td>
                <td>{i + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.qualification}</td>
                <td>{emp.designation}</td>
                <td>{emp.mobile}</td>
                <td>{emp.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', flexWrap: 'wrap' }}>
        <button className="submit-btn" style={{ background: '#f59e0b', color: '#fff' }} onClick={() => toggleAll(true)}>Check All</button>
        <button className="submit-btn" style={{ background: '#f59e0b', color: '#fff' }} onClick={() => toggleAll(false)}>Uncheck All</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>Total Employee:</span>
          <input className="form-input" style={{ width: 80 }} readOnly value={employees.length} />
        </div>
      </div>

      <div className="form-submit-row" style={{ borderTop: 'none', paddingTop: 0 }}>
        <button className="submit-btn" onClick={() => alert("Action")}>Submit</button>
      </div>
    </div>
  );
}
