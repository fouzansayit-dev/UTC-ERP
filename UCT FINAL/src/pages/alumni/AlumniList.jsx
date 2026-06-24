import React, { useState } from 'react';

const COLLEGES = ['UNIVERSIDADE CATÓLICA TIMORENSE'];

export default function AlumniReport() {
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate:   new Date().toISOString().slice(0, 10),
    college:   COLLEGES[0],
  });
  const [shown, setShown] = useState(false);
  const data = [];

  const set = (k) => (e) => setFilters((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:'24px 28px', marginBottom:24 }}>
        <div style={{ fontSize:15, fontWeight:600, color:'#1e293b', marginBottom:20 }}>Alumni Report</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:20 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:13, color:'#374151', fontWeight:500 }}>Start Date</label>
            <input type="date" value={filters.startDate} onChange={set('startDate')}
              style={{ border:'1px solid #d1d5db', borderRadius:6, padding:'7px 10px', fontSize:13 }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:13, color:'#374151', fontWeight:500 }}>End Date</label>
            <input type="date" value={filters.endDate} onChange={set('endDate')}
              style={{ border:'1px solid #d1d5db', borderRadius:6, padding:'7px 10px', fontSize:13 }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:13, color:'#374151', fontWeight:500 }}>College</label>
            <select value={filters.college} onChange={set('college')}
              style={{ border:'1px solid #d1d5db', borderRadius:6, padding:'7px 10px', fontSize:13 }}>
              {COLLEGES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button onClick={() => setShown(true)}
          style={{ background:'#4361ee', color:'#fff', border:'none', borderRadius:7,
            padding:'8px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          Submit
        </button>
      </div>

      {shown && (
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:'24px 28px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:600, color:'#1e293b' }}>Alumni Report</div>
            <div style={{ display:'flex', gap:8 }}>
              {['Copy','CSV','Print'].map(btn => (
                <button key={btn} onClick={() => alert(btn)}
                  style={{ border:'1px solid #d1d5db', background:'#f9fafb', borderRadius:6,
                    padding:'5px 14px', fontSize:12, cursor:'pointer' }}>
                  {btn}
                </button>
              ))}
              <input placeholder="Search"
                style={{ border:'1px solid #d1d5db', borderRadius:6, padding:'5px 10px', fontSize:12 }} />
            </div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'#f8fafc' }}>
                  {['SNo','Edit','Name','Date of Birth','Father Name','WhatsApp No',
                    'Mobile No','Email Id','Address','State','City','College',
                    'Year','Course','Branch','Batch','Status','Spouse Name','Child Name','Age']
                    .map(h => (
                      <th key={h} style={{ border:'1px solid #e5e7eb', padding:'8px 10px',
                        textAlign:'left', color:'#374151', fontWeight:600, whiteSpace:'nowrap' }}>
                        {h}
                      </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={20} style={{ textAlign:'center', padding:'32px',
                    color:'#9ca3af', fontSize:13 }}>
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:12, fontSize:12, color:'#6b7280' }}>
            Showing 0 to 0 of 0 entries
          </div>
        </div>
      )}
    </div>
  );
}