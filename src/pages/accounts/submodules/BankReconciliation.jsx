import React, { useState, useEffect } from 'react';
import { iS, lbS, rS, SecHead } from './accountsConfig.jsx';

export default function BankReconciliation() {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [cashbook, setCashbook] = useState([]);
  const [reconciledItems, setReconciledItems] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Perfect', 'Close', 'Unmatched'
  
  // For manually adding missing transactions from bank statement
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedCsvRow, setSelectedCsvRow] = useState(null);
  const [heads, setHeads] = useState([]);
  const [importForm, setImportForm] = useState({
    head: '',
    subhead: '',
    partyType: 'Other',
    party: '',
    remarks: ''
  });

  // Load banks and cashbook
  useEffect(() => {
    fetch('/api/generic/accounts/banks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBanks(data);
          if (data.length > 0) setSelectedBank(`${data[0].bank} (${data[0].accNo})`);
        }
      })
      .catch(err => console.error('Error loading banks:', err));

    fetch('/api/generic/accounts/cashbook')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCashbook(data); })
      .catch(err => console.error('Error loading cashbook:', err));

    fetch('/api/generic/accounts/heads')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setHeads(data.map(h => h.head)); })
      .catch(() => {});
  }, []);

  // Handle Mock Statement Upload
  const handleLoadMockStatement = () => {
    if (!selectedBank) {
      alert('Please select a bank account first.');
      return;
    }

    // Generate mock CSV data representing a bank statement for the selected bank
    // Some match cashbook perfectly, some match with off-by-date, some are unmatched
    const mockStatement = [
      { date: new Date().toISOString().split('T')[0], desc: 'TUITION FEE DEPOSIT', ref: 'TXN-998122', amount: 1500, type: 'Credit' },
      { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], desc: 'OFFICE SUPPLIES REFUND', ref: 'REF-00192', amount: 250, type: 'Credit' },
      { date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], desc: 'ANNUAL LICENSE PAYMENT', ref: 'LIC-77283', amount: 480, type: 'Debit' },
      { date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0], desc: 'UNREGISTERED UTILITY TRANSFER', ref: 'UTL-11228', amount: 80, type: 'Debit' } // Unmatched
    ];

    setCsvData(mockStatement);
    performReconciliation(mockStatement, cashbook);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const parsed = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',');
        if (cols.length >= 5) {
          parsed.push({
            date: cols[0]?.trim(),
            desc: cols[1]?.trim(),
            ref: cols[2]?.trim(),
            amount: parseFloat(cols[3]?.trim()) || 0,
            type: cols[4]?.trim() // 'Credit' or 'Debit'
          });
        }
      }

      setCsvData(parsed);
      performReconciliation(parsed, cashbook);
    };
    reader.readAsText(file);
  };

  // Reconciliation Core Logic
  const performReconciliation = (bankRows, erpRecords) => {
    // Filter ERP cashbook transactions matching selected bank
    const bankErp = erpRecords.filter(r => r.bank === selectedBank || (r.payMode !== 'Cash' && selectedBank.includes(r.bank)));

    const matched = bankRows.map((row, index) => {
      let status = 'Unmatched';
      let matchNotes = 'No matching transaction found in ERP cashbook.';
      let linkedRecord = null;

      // 1. Check for Perfect Match
      const perfect = bankErp.find(r => 
        String(r.date) === String(row.date) && 
        parseFloat(r.amount) === parseFloat(row.amount) &&
        ((row.type === 'Credit' && r.type === 'Credit') || (row.type === 'Debit' && r.type === 'Debit'))
      );

      if (perfect) {
        status = 'Perfect';
        matchNotes = 'Matches perfectly by Date, Type and Amount.';
        linkedRecord = perfect;
      } else {
        // 2. Check for Close Match (Tolerance window ±3 days)
        const close = bankErp.find(r => {
          const bankDate = new Date(row.date).getTime();
          const erpDate = new Date(r.date).getTime();
          const diffDays = Math.abs(bankDate - erpDate) / (1000 * 60 * 60 * 24);
          
          return diffDays <= 3 && 
                 parseFloat(r.amount) === parseFloat(row.amount) &&
                 ((row.type === 'Credit' && r.type === 'Credit') || (row.type === 'Debit' && r.type === 'Debit'));
        });

        if (close) {
          status = 'Close';
          matchNotes = `Close match by amount. Date offset: ${Math.round(Math.abs(new Date(row.date) - new Date(close.date)) / (1000 * 60 * 60 * 24))} day(s).`;
          linkedRecord = close;
        }
      }

      return {
        id: index,
        ...row,
        status,
        matchNotes,
        linkedRecord
      };
    });

    setReconciledItems(matched);
  };

  // Import Unmatched transactions
  const handleOpenImport = (item) => {
    setSelectedCsvRow(item);
    setImportForm({
      head: heads[0] || 'General Income',
      subhead: item.desc,
      partyType: 'Other',
      party: 'Bank Payee',
      remarks: `Reconciliation Import: ${item.desc}. Ref: ${item.ref}`
    });
    setShowImportModal(true);
  };

  const handleConfirmImport = () => {
    if (!selectedCsvRow) return;

    // Create entry
    const newVoucherNo = selectedCsvRow.type === 'Credit' ? `RV/REC/${Date.now().toString().slice(-4)}` : `JV/REC/${Date.now().toString().slice(-4)}`;
    const newEntry = {
      id: Date.now(),
      type: selectedCsvRow.type,
      head: importForm.head,
      subhead: importForm.subhead,
      partyType: importForm.partyType,
      party: importForm.party,
      voucherNo: newVoucherNo,
      date: selectedCsvRow.date,
      amount: selectedCsvRow.amount,
      payMode: 'Online/NEFT',
      bank: selectedBank,
      remarks: importForm.remarks,
      reference: selectedCsvRow.ref || newVoucherNo
    };

    const updatedLedger = [...cashbook, newEntry];

    // POST
    fetch('/api/generic/accounts/cashbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLedger)
    })
      .then(res => res.json())
      .then(() => {
        alert('Transaction successfully imported and saved to Cashbook ledger.');
        setShowImportModal(false);
        setCashbook(updatedLedger);
        // Recalculate
        const newCsv = csvData.map(c => {
          if (c.ref === selectedCsvRow.ref && c.amount === selectedCsvRow.amount) {
            return { ...c, status: 'Perfect', matchNotes: 'Auto-Matched after import.', linkedRecord: newEntry };
          }
          return c;
        });
        setCsvData(newCsv);
        performReconciliation(newCsv, updatedLedger);
      })
      .catch(err => alert('Import failed: ' + err.message));
  };

  // Filter lists
  const filtered = reconciledItems.filter(item => {
    if (activeTab === 'All') return true;
    return item.status === activeTab;
  });

  return (
    <div style={{ padding: '4px 0' }}>
      <SecHead title="Bank Account Statement Auto-Reconciliation" />
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderTop: 'none', padding: '24px 28px', borderRadius: '0 0 8px 8px' }}>
        
        {/* Setup actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24, background: '#f8fafc', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div className="br-form-group">
            <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>Select Bank Account *</label>
            <select style={iS} value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
              {banks.map(b => (
                <option key={b.id} value={`${b.bank} (${b.accNo})`}>{b.bank} ({b.accNo})</option>
              ))}
            </select>
          </div>
          <div className="br-form-group" style={{ justifyContent: 'center' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>Upload CSV Statement File</label>
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ fontSize: 12 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <button 
              onClick={handleLoadMockStatement} 
              style={{ padding: '10px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              Simulate Statement Match
            </button>
          </div>
        </div>

        {reconciledItems.length > 0 && (
          <div>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', gap: 8, marginBottom: 18 }}>
              {['All', 'Perfect', 'Close', 'Unmatched'].map(t => {
                const count = reconciledItems.filter(item => t === 'All' ? true : item.status === t).length;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderBottom: activeTab === t ? '3px solid #3b82f6' : '3px solid transparent',
                      background: 'none',
                      fontWeight: activeTab === t ? 700 : 500,
                      color: activeTab === t ? '#3b82f6' : '#64748b',
                      cursor: 'pointer',
                      fontSize: 13
                    }}
                  >
                    {t === 'Close' ? 'Close Matches' : t === 'Perfect' ? 'Perfect Matches' : t} ({count})
                  </button>
                );
              })}
            </div>

            {/* Reconciliation table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: 12, textAlign: 'left' }}>SNo</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Tx Date</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Bank Description</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Ref No</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Credit (Deposit)</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Debit (Withdrawal)</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Match Status</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Match Notes / Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => {
                    const statusColor = row.status === 'Perfect' ? '#10b981' : row.status === 'Close' ? '#eab308' : '#ef4444';
                    const statusBg = row.status === 'Perfect' ? '#ecfdf5' : row.status === 'Close' ? '#fef9c3' : '#fef2f2';
                    return (
                      <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                        <td style={{ padding: 12 }}>{idx + 1}</td>
                        <td style={{ padding: 12, fontWeight: 500 }}>{row.date}</td>
                        <td style={{ padding: 12 }}>{row.desc}</td>
                        <td style={{ padding: 12, fontFamily: 'monospace' }}>{row.ref || '—'}</td>
                        <td style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>
                          {row.type === 'Credit' ? `$${row.amount.toFixed(2)}` : '—'}
                        </td>
                        <td style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>
                          {row.type === 'Debit' ? `$${row.amount.toFixed(2)}` : '—'}
                        </td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 12, fontSize: 11.5, fontWeight: 600, color: statusColor, background: statusBg }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: 12, fontSize: 12, color: '#475569' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{row.matchNotes}</span>
                            {row.status === 'Unmatched' && (
                              <button
                                onClick={() => handleOpenImport(row)}
                                style={{
                                  padding: '4px 8px',
                                  background: '#10b981',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  cursor: 'pointer',
                                  fontSize: 11,
                                  fontWeight: 600
                                }}
                              >
                                Import to ERP
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── IMPORT MODAL OVERLAY ── */}
      {showImportModal && selectedCsvRow && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{ background: '#fff', width: 500, padding: 28, borderRadius: 10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700 }}>Import Bank Transaction to Cashbook</h3>
            
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 12.5 }}>
              <div><b>Transaction Date:</b> {selectedCsvRow.date}</div>
              <div><b>Description:</b> {selectedCsvRow.desc}</div>
              <div><b>Reference No:</b> {selectedCsvRow.ref || '—'}</div>
              <div><b>Amount:</b> <strong style={{ color: selectedCsvRow.type === 'Credit' ? '#16a34a' : '#dc2626' }}>${selectedCsvRow.amount.toFixed(2)} ({selectedCsvRow.type})</strong></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div className="br-form-group">
                <label style={{ fontSize: 12.5, fontWeight: 600 }}>Accounts Head *</label>
                <select style={iS} value={importForm.head} onChange={e => setImportForm(p => ({ ...p, head: e.target.value }))}>
                  {heads.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="br-form-group">
                <label style={{ fontSize: 12.5, fontWeight: 600 }}>Subhead / Item Description</label>
                <input type="text" style={iS} value={importForm.subhead} onChange={e => setImportForm(p => ({ ...p, subhead: e.target.value }))} />
              </div>
              <div className="br-form-group">
                <label style={{ fontSize: 12.5, fontWeight: 600 }}>Payer/Payee Name</label>
                <input type="text" style={iS} value={importForm.party} onChange={e => setImportForm(p => ({ ...p, party: e.target.value }))} />
              </div>
              <div className="br-form-group">
                <label style={{ fontSize: 12.5, fontWeight: 600 }}>Remarks</label>
                <textarea style={{ ...iS, height: 50 }} value={importForm.remarks} onChange={e => setImportForm(p => ({ ...p, remarks: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                onClick={() => setShowImportModal(false)}
                style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 12.5 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmImport}
                style={{ padding: '8px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}
              >
                Save to Cashbook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
