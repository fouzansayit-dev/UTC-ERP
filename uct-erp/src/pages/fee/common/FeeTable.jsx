import { handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useMemo } from 'react';

const PAGE_SIZE = 5;

export default function FeeTable({ columns, data, emptyMessage = 'No data available in table' }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        const val = row[col.key];
        return val && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCopy = () => {
    const text = [
      columns.map(c => c.label).join('\t'),
      ...filtered.map(row => columns.map(c => row[c.key] ?? '').join('\t'))
    ].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const handleCSV = () => {
    const csv = [
      columns.map(c => `"${c.label}"`).join(','),
      ...filtered.map(row => columns.map(c => `"${row[c.key] ?? ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleCopy} style={btnStyle('#64748b')}>Copy</button>
          <button onClick={handleCSV} style={btnStyle('#16a34a')}>CSV</button>
          <button onClick={() => handlePrint('Fee Report')} style={btnStyle('#0ea5e9')}>Print</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#4a5568', fontWeight: 600 }}>Search:</label>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Type to search..."
            style={{ border: '1px solid #cbd5e0', borderRadius: 4, padding: '5px 8px', fontSize: 12.5, outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '2px solid #e0e5ef', fontWeight: 700, color: '#1a2236', whiteSpace: 'nowrap', fontSize: 12 }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '24px 10px', color: '#9ca3af', fontSize: 12.5 }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => (
                <tr key={row.id ?? idx} style={{ borderBottom: '1px solid #f0f4f8' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '7px 10px', color: '#333' }}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 12, color: '#6b7fa3', flexWrap: 'wrap', gap: 6 }}>
        <span>
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{' '}
          {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} entries
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { label: '«', action: () => setPage(1), disabled: currentPage === 1 },
            { label: '‹', action: () => setPage(p => Math.max(1, p - 1)), disabled: currentPage === 1 },
          ].map((b, i) => (
            <button key={i} onClick={b.action} disabled={b.disabled} style={pageBtn(false, b.disabled)}>{b.label}</button>
          ))}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => Math.abs(p - currentPage) <= 2)
            .map(p => (
              <button key={p} onClick={() => setPage(p)} style={pageBtn(p === currentPage, false)}>{p}</button>
            ))}
          {[
            { label: '›', action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages },
            { label: '»', action: () => setPage(totalPages), disabled: currentPage === totalPages },
          ].map((b, i) => (
            <button key={i} onClick={b.action} disabled={b.disabled} style={pageBtn(false, b.disabled)}>{b.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const btnStyle = (bg) => ({
  background: bg, color: '#fff', border: 'none', borderRadius: 4,
  padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
});

const pageBtn = (active, disabled) => ({
  background: active ? '#1a2236' : '#fff',
  color: active ? '#fff' : '#4a5568',
  border: '1px solid #cbd5e0',
  borderRadius: 4, padding: '3px 8px',
  fontSize: 12, cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
});
