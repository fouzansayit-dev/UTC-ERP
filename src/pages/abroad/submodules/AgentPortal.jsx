import React, { useState, useEffect } from 'react';
import '../../student/Student.css';

export default function AgentPortal() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [referredStudents, setReferredStudents] = useState([]);
  const [commissionLogs, setCommissionLogs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('referrals');

  const [invoiceForm, setInvoiceForm] = useState({ invoiceNo: '', amount: '', description: '' });

  const loadData = () => {
    setLoading(true);
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(Array.isArray(data) ? data : []);
        if (data.length > 0 && !selectedAgent) {
          setSelectedAgent(data[0].id.toString());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch referrals and commission details for the selected agent
  useEffect(() => {
    if (!selectedAgent) return;
    setLoading(true);
    
    // Fetch abroad candidates, commissions list, and invoices list
    Promise.all([
      fetch('/api/generic/abroad/students').then(res => res.json()),
      fetch('/api/agents/commissions').then(res => res.json()),
      fetch(`/api/generic/agent-invoices/${selectedAgent}`).then(res => res.json())
    ])
      .then(([students, commissions, invoicesList]) => {
        const agentObj = agents.find(a => a.id === Number(selectedAgent));
        const agentName = agentObj ? agentObj.firm_name : '';
        
        // Filter candidates referred by this agent
        const list = Array.isArray(students) ? students : [];
        const filteredStudents = list.filter(s => s.agent === agentName);
        setReferredStudents(filteredStudents);

        // Filter commission details
        const cLogs = Array.isArray(commissions) ? commissions : [];
        const filteredComms = cLogs.filter(c => c.agent_id === Number(selectedAgent));
        setCommissionLogs(filteredComms);

        // Filter uploaded invoices
        setInvoices(Array.isArray(invoicesList) ? invoicesList : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [selectedAgent, agents]);

  const handleUploadInvoice = (e) => {
    e.preventDefault();
    if (!invoiceForm.invoiceNo || !invoiceForm.amount) {
      alert("Please fill in required invoice fields.");
      return;
    }

    const newInvoice = {
      id: Date.now().toString(),
      invoiceNo: invoiceForm.invoiceNo,
      amount: parseFloat(invoiceForm.amount),
      description: invoiceForm.description,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString("en-GB")
    };

    const updated = [...invoices, newInvoice];
    fetch(`/api/generic/agent-invoices/${selectedAgent}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => {
        alert("Referral invoice uploaded successfully!");
        setInvoiceForm({ invoiceNo: '', amount: '', description: '' });
        setInvoices(updated);
      })
      .catch(err => alert(err.message));
  };

  const getCommissionSum = (status) => {
    return commissionLogs
      .filter(c => status === 'All' || c.payment_status === status)
      .reduce((acc, curr) => acc + (curr.amount_net || 0), 0);
  };

  return (
    <div>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Agent Portal Simulation Workspace</div>
        <div className="stu-filter-body" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div className="stu-field" style={{ margin: 0, minWidth: 260 }}>
            <label>Choose Agent Identity Log</label>
            <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
              {agents.map(a => <option key={a.id} value={a.id}>{a.firm_name} ({a.agent_code})</option>)}
            </select>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: 16 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>COMMISSIONS EARNED</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>₹{getCommissionSum('All')}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>PAID BALANCE</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>₹{getCommissionSum('Paid')}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>OUTSTANDING DUE</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>₹{getCommissionSum('Unpaid')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginTop: 24, marginBottom: 16 }}>
        <button
          onClick={() => setActiveTab('referrals')}
          style={{
            padding: '10px 20px', border: 'none', background: 'none', fontSize: 13.5, fontWeight: 700,
            color: activeTab === 'referrals' ? '#0d5ef4' : '#64748b', borderBottom: activeTab === 'referrals' ? '3px solid #0d5ef4' : 'none',
            cursor: 'pointer'
          }}
        >
          My Referrals ({referredStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          style={{
            padding: '10px 20px', border: 'none', background: 'none', fontSize: 13.5, fontWeight: 700,
            color: activeTab === 'commissions' ? '#0d5ef4' : '#64748b', borderBottom: activeTab === 'commissions' ? '3px solid #0d5ef4' : 'none',
            cursor: 'pointer'
          }}
        >
          Commission ledger
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          style={{
            padding: '10px 20px', border: 'none', background: 'none', fontSize: 13.5, fontWeight: 700,
            color: activeTab === 'invoices' ? '#0d5ef4' : '#64748b', borderBottom: activeTab === 'invoices' ? '3px solid #0d5ef4' : 'none',
            cursor: 'pointer'
          }}
        >
          Upload Claims & Invoices
        </button>
      </div>

      {activeTab === 'referrals' && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Referred Candidates Directory</div>
          <table className="stu-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Roll No</th>
                <th>Candidate Name</th>
                <th>Target Country</th>
                <th>Target University</th>
                <th>Admission Stage</th>
              </tr>
            </thead>
            <tbody>
              {referredStudents.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>No referred candidates found.</td></tr>
              ) : (
                referredStudents.map((s, idx) => (
                  <tr key={s.id}>
                    <td>{idx + 1}</td>
                    <td>{s.rollNo}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>{s.country}</td>
                    <td>{s.university}</td>
                    <td>Stage {s.stage}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'commissions' && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">Referral Commission ledger</div>
          <table className="stu-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Gross Payout</th>
                <th>TDS Deducted (10%)</th>
                <th>Net Payout</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {commissionLogs.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>No commission records calculated yet.</td></tr>
              ) : (
                commissionLogs.map((c, idx) => (
                  <tr key={c.id}>
                    <td>{idx + 1}</td>
                    <td>{c.student_name} ({c.scholar_no})</td>
                    <td>₹{c.amount_gross}</td>
                    <td style={{ color: '#ef4444' }}>-₹{c.tds_amount}</td>
                    <td style={{ fontWeight: 'bold', color: '#10b981' }}>₹{c.amount_net}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 'bold',
                        background: c.payment_status === 'Paid' ? '#d4edda' : '#f8d7da',
                        color: c.payment_status === 'Paid' ? '#155724' : '#721c24'
                      }}>{c.payment_status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div>
          <div className="stu-filter-card">
            <div className="stu-filter-header">Submit New Claim Invoice</div>
            <div className="stu-filter-body">
              <form onSubmit={handleUploadInvoice} className="stu-form-grid" style={{ gap: '16px' }}>
                <div className="stu-field">
                  <label>Invoice Number *</label>
                  <input type="text" value={invoiceForm.invoiceNo} onChange={e => setInvoiceForm({...invoiceForm, invoiceNo: e.target.value})} placeholder="e.g. INV-9098" />
                </div>
                <div className="stu-field">
                  <label>Commission Amount (INR) *</label>
                  <input type="number" value={invoiceForm.amount} onChange={e => setInvoiceForm({...invoiceForm, amount: e.target.value})} placeholder="e.g. 50000" />
                </div>
                <div className="stu-field stu-form-col-2">
                  <label>Memo / Description</label>
                  <textarea value={invoiceForm.description} onChange={e => setInvoiceForm({...invoiceForm, description: e.target.value})} placeholder="Referrals or candidates matching this invoice..." />
                </div>
                <div className="stu-field" style={{ justifyContent: 'center', gridColumn: 'span 2', marginTop: 12 }}>
                  <button type="submit" className="stu-btn stu-btn-primary">Upload & Claim Invoice</button>
                </div>
              </form>
            </div>
          </div>

          <div className="stu-table-wrap" style={{ marginTop: 20 }}>
            <div className="stu-table-title">Uploaded Invoices Directory</div>
            <table className="stu-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Invoice No</th>
                  <th>Uploaded Date</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>No invoices uploaded.</td></tr>
                ) : (
                  invoices.map((inv, idx) => (
                    <tr key={inv.id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{inv.invoiceNo}</td>
                      <td>{inv.date}</td>
                      <td style={{ fontWeight: 'bold' }}>₹{inv.amount}</td>
                      <td>{inv.description || '—'}</td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 'bold',
                          background: inv.status === 'Paid' ? '#d4edda' : '#fff3cd',
                          color: inv.status === 'Paid' ? '#155724' : '#856404'
                        }}>{inv.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
