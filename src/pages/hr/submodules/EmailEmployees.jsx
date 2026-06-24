import React, { useState, useEffect } from 'react';
import { FormField, Input } from './HRComponents.jsx';

export default function EmailEmployees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/hr')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error('Error loading employees:', err));
  }, []);

  const filtered = employees.filter(emp => {
    const q = search.toLowerCase().trim();
    return (
      (emp.name || '').toLowerCase().includes(q) ||
      (emp.department || '').toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(emp => emp.id));
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert('Please select at least one employee recipient.');
      return;
    }
    if (!subject.trim() || !body.trim()) {
      alert('Subject and Body cannot be empty.');
      return;
    }

    const recipientEmails = employees
      .filter(emp => selectedIds.includes(emp.id))
      .map(emp => emp.email || `${emp.name.toLowerCase().replace(/\s+/g, '')}@company.com`);

    setSending(true);

    try {
      const res = await fetch('/api/hr/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientEmails,
          subject,
          body
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');
      alert(`Email sent successfully to ${recipientEmails.length} employees!`);
      setSubject('');
      setBody('');
      setSelectedIds([]);
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="hr-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>1. Select Recipients</div>
        <div className="form-field" style={{ marginBottom: 12 }}>
          <label className="form-label">Search Employees</label>
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search by name or department..." 
          />
        </div>

        <div style={{ maxHeight: 320, overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff' }}>
          <table className="hr-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: 40, padding: 8 }}>
                  <input 
                    type="checkbox" 
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll} 
                  />
                </th>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Department</th>
                <th style={{ padding: 8 }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} style={{ cursor: 'pointer' }} onClick={() => toggleSelect(emp.id)}>
                  <td style={{ padding: 8 }} onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(emp.id)}
                      onChange={() => toggleSelect(emp.id)} 
                    />
                  </td>
                  <td style={{ padding: 8, fontWeight: 600 }}>{emp.name}</td>
                  <td style={{ padding: 8 }}>{emp.department}</td>
                  <td style={{ padding: 8, color: '#666', fontSize: 12 }}>
                    {emp.email || `${emp.name.toLowerCase().replace(/\s+/g, '')}@company.com`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#475569', fontWeight: 600 }}>
          {selectedIds.length} recipient(s) selected
        </div>
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>2. Compose Email</div>
        <form onSubmit={handleSendEmail}>
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label className="form-label">Subject</label>
            <Input 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              placeholder="Enter email subject" 
              required
            />
          </div>
          <div className="form-field" style={{ marginBottom: 16 }}>
            <label className="form-label">Message Body</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical'
              }}
              required
            />
          </div>
          <button 
            type="submit" 
            className="hr-btn hr-btn-primary" 
            disabled={sending}
            style={{ width: '100%', height: 40, fontSize: 14, fontWeight: 700 }}
          >
            {sending ? 'Sending...' : `Send Email to ${selectedIds.length} Employee(s)`}
          </button>
        </form>
      </div>
    </div>
  );
}
