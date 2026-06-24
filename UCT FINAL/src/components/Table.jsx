import React from 'react';
export default function Table({ columns, data }) {
  return (
    <div style={{ 
      overflowX: 'auto', 
      border: '1px solid var(--gray2)', 
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-premium)',
      background: '#fff'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
        <thead>
          <tr style={{ background: 'var(--gray1)', borderBottom: '1px solid var(--gray2)' }}>
            {columns.map(c => (
              <th key={c} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--black2)' }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr 
                key={i} 
                style={{ 
                  borderBottom: '1px solid rgba(226, 232, 240, 0.6)', 
                  transition: 'background 0.15s ease' 
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--acc-soft)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {columns.map(c => (
                  <td key={c} style={{ padding: '12px 16px', color: 'var(--black3)' }}>
                    {row[c] || '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
