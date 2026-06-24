import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState } from 'react';
function today() { return new Date().toISOString().slice(0,10); }
export default function CertificateApplyReport() {
  const [form, setForm] = useState({ college:'UNIVERSIDADE CATOLICA TIMORENSE', startDate:today(), endDate:today(), status:'Cancel' });
  const [submitted, setSubmitted] = useState(false);
  const [rows] = useState([]);
  const [search, setSearch] = useState('');
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const filtered=rows.filter(r=>(r.studentName||'').toLowerCase().includes(search.toLowerCase()));
  const fmt=d=>d.replaceAll('-','/');
  return (
    <div className="hr-form">
      <div className="section-title">Certificate Apply Report</div>
      <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:10,padding:'24px 28px',boxShadow:'0 2px 8px rgba(67,97,238,0.06)',maxWidth:600}}>
        <div className="form-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div className="form-field" style={{gridColumn:'1 / -1'}}>
            <label className="form-label">College</label>
            <select className="form-input" value={form.college} onChange={e=>set('college',e.target.value)}>
              <option>UNIVERSIDADE CATOLICA TIMORENSE</option>
            </select>
          </div>
          <div className="form-field"><label className="form-label">Start Date</label><input className="form-input" type="date" value={form.startDate} onChange={e=>set('startDate',e.target.value)} /></div>
          <div className="form-field"><label className="form-label">End Date</label><input className="form-input" type="date" value={form.endDate} onChange={e=>set('endDate',e.target.value)} /></div>
          <div className="form-field">
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={e=>set('status',e.target.value)}>
              <option>Cancel</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
        <div className="form-submit-row" style={{borderTop:'none',paddingTop:0,marginTop:12}}><button className="submit-btn" onClick={()=>setSubmitted(true)}>Submit</button></div>
      </div>
      {submitted&&(
        <div style={{marginTop:28}}>
          <div style={{background:'#1e293b',color:'#fff',padding:'14px 20px',borderRadius:'10px 10px 0 0',fontWeight:700,fontSize:15}}>Certificate Apply Report ({fmt(form.startDate)} &ndash; {fmt(form.endDate)})</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0'}}>
            <div style={{display:'flex',gap:8}}>{['Copy','CSV','Print'].map(b=><button key={b} className="tbl-btn view" style={{background:'#f1f5f9',color:'#374151'}} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'CertificateApplyReport'); else handlePrint('Certificate Apply Report'); }}>{b}</button>)}</div>
            <input className="form-input" style={{width:200}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div className="table-wrap" style={{borderRadius:'0 0 10px 10px'}}>
            <table className="hr-table">
              <thead><tr>{['Sr. no.','Delete','Status','Student Name',"Father's Name",'Class/Section','Scholar No.','Certificate Type','Remark','Delete Remark','Date/Time'].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>{filtered.length===0?<tr><td colSpan={11} className="empty-table-msg">No data available in table</td></tr>:null}</tbody>
            </table>
          </div>
          <div style={{fontSize:13,color:'#6b7280',marginTop:8}}>Showing 0 to 0 of 0 entries</div>
        </div>
      )}
    </div>
  );
}
