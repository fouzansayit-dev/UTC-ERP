import React from 'react';
import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';

export const COLLEGE = 'UNIVERSIDADE CATÓLICA TIMORENSE';
export const TODAY   = new Date().toISOString().slice(0, 10);

export const DEFAULT_HEADS = [
  { id:1, head:'Construction' },
  { id:2, head:'Expenses' },
  { id:3, head:'Salary' },
  { id:4, head:'Unio Hostel' },
  { id:5, head:'Agent Commission' },
  { id:6, head:'Forex Remittance' },
  { id:7, head:'Abroad University Fee' },
];

export const iS  = { width:'100%', padding:'7px 10px', fontSize:13, border:'1px solid #d1d5db', borderRadius:6, outline:'none', boxSizing:'border-box', color:'#374151', background:'#fff' };
export const lbS = { minWidth:160, fontSize:13, color:'#374151', fontWeight:500, paddingTop:7, flexShrink:0 };
export const rS  = { display:'flex', alignItems:'flex-start', gap:16, marginBottom:14 };
export const fS  = { display:'flex', flexDirection:'column', gap:3 };
export const lS  = { fontSize:13, fontWeight:500, color:'#374151', marginBottom:4, display:'block' };

export const SecHead = ({ title }) => (
  <div style={{ background:'#1e293b', color:'#fff', padding:'10px 16px', borderRadius:'8px 8px 0 0', fontSize:14, fontWeight:500 }}>
    {title}
  </div>
);

export function TableToolbar({ search = '', onSearch, title = 'UCT ERP Report' }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
      <div style={{ display:'flex', gap:6 }}>
        {[
          { label:'Copy',  action: e => handleCopy(e.currentTarget) },
          { label:'CSV',   action: e => handleCSV(e.currentTarget, title.replace(/\s+/g,'_')) },
          { label:'Print', action: () => handlePrint(title) },
        ].map(({ label, action }) => (
          <button key={label} className="tbl-btn view"
            style={{ background:'#f1f5f9', color:'#374151' }}
            onClick={action}>
            {label}
          </button>
        ))}
      </div>
      {onSearch && (
        <input style={{ ...iS, width:200 }} placeholder="Search..."
          value={search} onChange={e => onSearch(e.target.value)} />
      )}
    </div>
  );
}

export const EmptyRow = ({ cols }) => (
  <tr>
    <td colSpan={cols} style={{ textAlign:'center', color:'#9ca3af', padding:20 }}>
      No data available
    </td>
  </tr>
);
