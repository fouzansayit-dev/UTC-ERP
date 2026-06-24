import React from 'react';

export default function Table({ title, columns = [], rows = [], titleClass = '' }) {
  return (
    <div className="visa-table-wrap">
      {title && <div className={`visa-table-title ${titleClass}`}>{title}</div>}
      <div style={{ overflowX: 'auto' }}>
        <table className="visa-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key || col}>{col.label || col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key || col}>{row[col.key || col]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan={columns.length}>No records found. Data will appear once entries are added.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
