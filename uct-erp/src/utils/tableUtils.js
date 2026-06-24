function getTableData(buttonEl) {
  const wrap = buttonEl.closest('.table-wrap') || buttonEl.parentElement?.parentElement;
  const table = wrap ? wrap.querySelector('.hr-table') : document.querySelector('.hr-table');
  if (!table) return null;
  const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
  const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr =>
    Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())
  );
  return { headers, rows };
}

export function handleCopy(buttonEl) {
  const data = getTableData(buttonEl);
  if (!data) { alert('No table data found.'); return; }
  const text = [data.headers, ...data.rows].map(r => r.join('\t')).join('\n');
  navigator.clipboard.writeText(text).then(() => {
    alert('Table data copied to clipboard!');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    alert('Table data copied to clipboard!');
  });
}

export function handleCSV(buttonEl, filename = 'export') {
  const data = getTableData(buttonEl);
  if (!data) { alert('No table data found.'); return; }
  const escape = val => {
    const s = String(val ?? '');
    return (s.includes(',') || s.includes('"') || s.includes('\n'))
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [data.headers, ...data.rows].map(r => r.map(escape).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function handlePrint(pageTitle = 'UCT ERP') {
  const table = document.querySelector('.hr-table');
  if (!table) { window.print(); return; }
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>${pageTitle}</title><style>
    body{font-family:Arial,sans-serif;font-size:12px;margin:20px}
    h2{color:#1e293b;margin-bottom:16px}
    table{width:100%;border-collapse:collapse}
    th{background:#4361ee;color:#fff;padding:8px 10px;text-align:left;font-size:12px}
    td{padding:7px 10px;border:1px solid #e2e8f0;font-size:12px;color:#374151}
    tr:nth-child(even) td{background:#f8faff}
    @media print{body{margin:0}}
  </style></head><body>
    <h2>${pageTitle}</h2>${table.outerHTML}
    <div style="margin-top:12px;font-size:11px;color:#9ca3af">Printed on: ${new Date().toLocaleString()}</div>
  </body></html>`);
  w.document.close();
  w.focus();
  w.print();
  w.close();
}
