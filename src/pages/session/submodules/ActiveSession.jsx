import React, { useState } from 'react';
import { SectionTitle } from './SessionComponents.jsx';

const INIT = [
  { id:1, session:'2024-2025', startMonth:'July', endMonth:'June', code:'001', active:false },
  { id:2, session:'2025-2026', startMonth:'July', endMonth:'June', code:'002', active:true  },
];

export default function ActiveSession() {
  const [sessions, setSessions] = useState(INIT);
  const active = sessions.find(s => s.active);
  const makeActive = id => setSessions(s => s.map(r => ({ ...r, active: r.id === id })));

  return (
    <div className="hr-form">
      {active && (
        <div style={{ background:'#1e293b', color:'#fff', borderRadius:10, padding:'18px 24px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', marginBottom:4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Currently Active Session</div>
            <div style={{ fontSize:26, fontWeight:700, letterSpacing:'.04em' }}>{active.session}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginTop:4 }}>{active.startMonth} — {active.endMonth} &nbsp;|&nbsp; Code: {active.code}</div>
          </div>
          <div style={{ background:'#16a34a', color:'#fff', borderRadius:20, padding:'5px 16px', fontSize:12, fontWeight:700 }}>● ACTIVE</div>
        </div>
      )}
      <SectionTitle title="All Sessions — Set Active" />
      <div className="table-wrap">
        <table className="hr-table">
          <thead><tr><th>SNo.</th><th>Session</th><th>Start Month</th><th>End Month</th><th>Code</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {sessions.map((r, i) => (
              <tr key={r.id}>
                <td>{i+1}</td>
                <td style={{ fontWeight:600 }}>{r.session}</td>
                <td>{r.startMonth}</td><td>{r.endMonth}</td>
                <td style={{ color:'#d97706', fontWeight:600 }}>{r.code}</td>
                <td style={{ color: r.active?'#16a34a':'#dc2626', fontWeight:600 }}>{r.active ? '● Active' : '○ Inactive'}</td>
                <td>
                  {r.active
                    ? <span style={{ fontSize:12, color:'#16a34a', fontWeight:600 }}>Current</span>
                    : <span className="tbl-btn edit" onClick={() => makeActive(r.id)}>Set Active</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
