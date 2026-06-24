import React, { useState, useEffect } from 'react';
import '../student/Student.css';
import './ConsultantManagement.css';

export default function ConsultantManagement({ onBack }) {
  const [consultants, setConsultants] = useState([]);
  const [students, setStudents] = useState([]);
  const [agents, setAgents] = useState([]);
  
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'admissions'
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Form states for adding new consultant
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [status, setStatus] = useState('Active');

  const loadData = async () => {
    try {
      const cRes = await fetch('/api/consultants');
      const cData = await cRes.json();
      setConsultants(cData);

      const sRes = await fetch('/api/students');
      const sData = await sRes.json();
      setStudents(sData);

      const aRes = await fetch('/api/agents');
      const aData = await aRes.json();
      setAgents(aData);
    } catch (e) {
      console.error('Error loading consultant module data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddConsultant = async (e) => {
    e.preventDefault();
    if (!name || !code) {
      alert('Name and Code are required!');
      return;
    }
    try {
      const res = await fetch('/api/consultants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, email, phone, commission_rate: parseFloat(commissionRate || 0), status })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to add consultant');
      
      alert('Consultant added successfully!');
      // Reset form
      setName('');
      setCode('');
      setEmail('');
      setPhone('');
      setCommissionRate('');
      setStatus('Active');
      setViewMode('list');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteConsultant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this consultant?')) return;
    try {
      const res = await fetch(`/api/consultants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      alert('Consultant deleted.');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Grouping admissions
  const getStudentsForConsultant = (cName) => {
    return students.filter(s => s.consultant && s.consultant.toLowerCase() === cName.toLowerCase());
  };

  const getStudentsForAgent = (aName) => {
    return students.filter(s => s.agentName && s.agentName.toLowerCase() === aName.toLowerCase());
  };

  return (
    <div className="cons-module">
      <div className="breadcrumb">
        <span className="bc-link" onClick={onBack}>Dashboard</span>
        {' › '}
        <span className="bc-link" onClick={() => { setViewMode('list'); setSelectedConsultant(null); setSelectedAgent(null); }}>Consultant & Agent Admissions</span>
        {viewMode === 'add' && <> › <b>Add Consultant</b></>}
        {viewMode === 'admissions' && selectedConsultant && <> › <b>{selectedConsultant.name} Admissions</b></>}
        {viewMode === 'admissions' && selectedAgent && <> › <b>{selectedAgent.firm_name} Admissions</b></>}
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Consultant & Agent Admissions</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="stu-btn stu-btn-secondary" onClick={() => { setViewMode('list'); setSelectedConsultant(null); setSelectedAgent(null); }}>
            View Dashboard
          </button>
          <button className="stu-btn stu-btn-primary" onClick={() => setViewMode('add')}>
            + Add Consultant
          </button>
        </div>
      </div>

      {viewMode === 'add' && (
        <div className="stu-filter-card" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="stu-filter-header">Add New Consultant</div>
          <div className="stu-filter-body">
            <form onSubmit={handleAddConsultant}>
              <div className="stu-form-grid">
                <div className="stu-field">
                  <label>Consultant Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="stu-field">
                  <label>Consultant Code *</label>
                  <input type="text" value={code} onChange={e => setCode(e.target.value)} required />
                </div>
                <div className="stu-field">
                  <label>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="stu-field">
                  <label>Phone Number</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="stu-field">
                  <label>Commission Rate (%)</label>
                  <input type="number" step="0.01" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} />
                </div>
                <div className="stu-field">
                  <label>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <button type="submit" className="stu-btn stu-btn-primary">Save Consultant</button>
                <button type="button" className="stu-btn stu-btn-secondary" onClick={() => setViewMode('list')}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Consultants Section */}
          <div className="stu-table-wrap">
            <div className="stu-table-title">Admissions Through Consultants</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="stu-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Commission (%)</th>
                    <th>Students Admitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consultants.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', color: '#888', padding: 16 }}>No consultants registered.</td>
                    </tr>
                  ) : (
                    consultants.map(c => {
                      const count = getStudentsForConsultant(c.name).length;
                      return (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 600 }}>{c.code}</td>
                          <td style={{ fontWeight: 600 }}>{c.name}</td>
                          <td>{c.email || '—'}</td>
                          <td>{c.phone || '—'}</td>
                          <td>{c.commission_rate}%</td>
                          <td>
                            <button className="stu-badge stu-badge-blue" style={{ border: 'none', cursor: 'pointer' }} onClick={() => {
                              setSelectedConsultant(c);
                              setSelectedAgent(null);
                              setViewMode('admissions');
                            }}>
                              {count} Student(s) (View)
                            </button>
                          </td>
                          <td>
                            <span className={`stu-badge ${c.status === 'Active' ? 'stu-badge-green' : 'stu-badge-red'}`}>{c.status}</span>
                          </td>
                          <td>
                            <button onClick={() => handleDeleteConsultant(c.id)} className="stu-btn stu-btn-danger stu-btn-sm">Delete</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agents Admissions Section */}
          <div className="stu-table-wrap">
            <div className="stu-table-title">Admissions Through Agents (Abroad / Partners)</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="stu-table">
                <thead>
                  <tr>
                    <th>Firm Code</th>
                    <th>Firm Name</th>
                    <th>Contact Person</th>
                    <th>Commission (%)</th>
                    <th>Students Admitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 16 }}>No agents registered.</td>
                    </tr>
                  ) : (
                    agents.map(a => {
                      const count = getStudentsForAgent(a.firm_name).length;
                      return (
                        <tr key={a.id}>
                          <td style={{ fontWeight: 600 }}>{a.agent_code}</td>
                          <td style={{ fontWeight: 600 }}>{a.firm_name}</td>
                          <td>{a.contact_person || '—'}</td>
                          <td>{a.commission_rate}%</td>
                          <td>
                            <button className="stu-badge stu-badge-blue" style={{ border: 'none', cursor: 'pointer' }} onClick={() => {
                              setSelectedAgent(a);
                              setSelectedConsultant(null);
                              setViewMode('admissions');
                            }}>
                              {count} Student(s) (View)
                            </button>
                          </td>
                          <td>
                            <span style={{ fontSize: 12, color: '#666' }}>Manage via Agent Module</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'admissions' && (
        <div className="stu-table-wrap">
          <div className="stu-table-title">
            Students Admitted Through: {selectedConsultant ? selectedConsultant.name : selectedAgent.firm_name}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="stu-table">
              <thead>
                <tr>
                  <th>Scholar No</th>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Branch</th>
                  <th>Batch</th>
                  <th>Admission Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(selectedConsultant ? getStudentsForConsultant(selectedConsultant.name) : getStudentsForAgent(selectedAgent.firm_name)).length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 16 }}>No students found for this referral.</td>
                  </tr>
                ) : (
                  (selectedConsultant ? getStudentsForConsultant(selectedConsultant.name) : getStudentsForAgent(selectedAgent.firm_name)).map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.scholar_no}</td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.course}</td>
                      <td>{s.branch}</td>
                      <td>{s.batch}</td>
                      <td>{s.admission_date}</td>
                      <td>
                        <span className={`stu-badge ${s.status === 'active' ? 'stu-badge-green' : 'stu-badge-red'}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: 20 }}>
            <button className="stu-btn stu-btn-secondary" onClick={() => setViewMode('list')}>Back to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}
