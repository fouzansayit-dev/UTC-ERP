import React from 'react';
import './Dashboard.css';
import DashboardGraphs from './DashboardGraphs';

const SectionTitle = ({ title }) => (
  <div className="section-title">{title}</div>
);

const FormField = ({ label, children }) => (
  <div className="form-field">
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const Input = (props) => <input className="form-input" {...props} />;

const Select = ({ children, ...props }) => (
  <select className="form-input" {...props}>
    {children}
  </select>
);



export default function AdminDashboard() {
  const [selectedTable, setSelectedTable] = React.useState('users');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [tableRows, setTableRows] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const fetchExplorerData = (table, search) => {
    setLoading(true);
    fetch(`/api/automations/admin/db-explorer?table=${table}&search=${search}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setTableRows(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setTableRows([]);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchExplorerData(selectedTable, searchQuery);
  }, [selectedTable]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchExplorerData(selectedTable, searchQuery);
  };

  const getHeaders = () => {
    if (tableRows.length === 0) return [];
    return Object.keys(tableRows[0]).filter(k => k !== 'json_details' && k !== 'json_data');
  };

  const headers = getHeaders();

  return (
    <div className="hr-form">

      {/* ── OVERVIEW FILTERS ── */}
      <SectionTitle title="Overview Filters" />
      <div className="form-grid">
        <FormField label="Academic Session">
          <Select defaultValue="">
            <option value="">-- Select Session --</option>
            <option>2024-25</option>
            <option>2025-26</option>
            <option>2026-27</option>
          </Select>
        </FormField>

        <FormField label="From Date">
          <Input type="date" />
        </FormField>

        <FormField label="To Date">
          <Input type="date" />
        </FormField>

        <FormField label="Department">
          <Select defaultValue="">
            <option value="">-- All Departments --</option>
            <option>HR</option>
            <option>Academics</option>
            <option>Accounts</option>
            <option>Admin</option>
          </Select>
        </FormField>
      </div>

      <div className="form-submit-row" style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="submit-btn" onClick={() => alert("Action")}>Apply Filter</button>
        <button
          type="button"
          className="submit-btn"
          style={{ background: '#6b7280' }}
         onClick={() => alert("Action")}>
          Reset
        </button>
      </div>

      

      {/* ── VISA STATUS SUMMARY ── */}
      <SectionTitle title="Visa Status Summary" />
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="hr-table">
          <thead>
            <tr>
              <th>Active Visa</th>
              <th>Renewal Due</th>
              <th>Expired</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="empty-table-msg">
                No visa data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── ABROAD STUDENT STATUS MAP ── */}
      <SectionTitle title="Abroad Student Status Map" />
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '18px',
          marginBottom: 24,
          background: '#fafafa',
          fontSize: 12,
          color: '#9ca3af',
        }}
      >
        Country-wise active abroad student data will appear here.
      </div>

      {/* ── AGENT PERFORMANCE PANEL ── */}
      <SectionTitle title="Agent Performance Panel" />
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="hr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Agent Name</th>
              <th>Agent ID</th>
              <th>Total Referrals</th>
              <th>Converted</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="empty-table-msg">
                No agent data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── FOREX REMITTANCE TRACKER ── */}
      <SectionTitle title="Forex Remittance Tracker" />
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="hr-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Country</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="empty-table-msg">
                No remittance data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── MOBILE APP FEEDBACK SUMMARY ── */}
      <SectionTitle title="Mobile App Feedback Summary" />
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '18px',
          marginBottom: 36,
          background: '#fafafa',
          fontSize: 12,
          color: '#9ca3af',
        }}
      >
        Average rating and unread feedback count will appear here.
      </div>

      {/* ── DATABASE & STORAGE EXPLORER (ADMIN ONLY) ── */}
      <SectionTitle title="Database & Storage Explorer (Admin-Only Access)" />
      
      <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, alignItems: 'flex-end', marginBottom: 20 }}>
          <FormField label="Choose Database Table">
            <Select value={selectedTable} onChange={e => setSelectedTable(e.target.value)}>
              <option value="users">users (User Logins & Roles)</option>
              <option value="students">students (Student Master Directory)</option>
              <option value="employees">employees (HR Employees Directory)</option>
              <option value="fee_transactions">fee_transactions (Financial Receipts)</option>
              <option value="enquiries">enquiries (Admissions Enquiry Leads)</option>
              <option value="generic_store">generic_store (Secondary Modules Data)</option>
              <option value="country_master">country_master (Countries Registry)</option>
              <option value="university_master">university_master (Universities Registry)</option>
              <option value="consultants">consultants (Consultants Registry)</option>
              <option value="biometric_logs">biometric_logs (Biometric Swipe Logs)</option>
            </Select>
          </FormField>
          
          <FormField label="Filter / Search Database">
            <Input 
              type="text" 
              placeholder="Search keyword..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </FormField>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="submit-btn" style={{ padding: '9px 20px', width: '100%' }}>Search</button>
            <button 
              type="button" 
              className="submit-btn" 
              style={{ background: '#6b7280', padding: '9px 20px' }}
              onClick={() => { setSearchQuery(''); fetchExplorerData(selectedTable, ''); }}
            >
              Reset
            </button>
          </div>
        </form>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 8 }}>
            <div style={{ width: 20, height: 20, border: '2px solid #cbd5e1', borderTopColor: '#2c3e50', borderRadius: '50%', animation: 'spin 1s infinite linear' }} />
            <span style={{ fontSize: 13, color: '#64748b' }}>Querying database table...</span>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="hr-table" style={{ fontSize: 12.5 }}>
              <thead>
                <tr>
                  {headers.map(h => (
                    <th key={h} style={{ textTransform: 'capitalize' }}>{h.replace('_', ' ')}</th>
                  ))}
                  {headers.length > 0 && <th style={{ textAlign: 'center' }}>Details</th>}
                </tr>
              </thead>
              <tbody>
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length + 1 || 1} className="empty-table-msg">
                      No records found in this table.
                    </td>
                  </tr>
                ) : (
                  tableRows.map((row, idx) => (
                    <tr key={row.id || idx} style={{ cursor: 'pointer' }} onClick={() => setSelectedRow(row)}>
                      {headers.map(h => (
                        <td key={h}>
                          {row[h] === null || row[h] === undefined ? (
                            <em style={{ color: '#aaa' }}>null</em>
                          ) : typeof row[h] === 'object' ? (
                            JSON.stringify(row[h])
                          ) : (
                            String(row[h])
                          )}
                        </td>
                      ))}
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="tbl-btn view" 
                          style={{ padding: '2px 8px', fontSize: 11, background: '#e2e8f0', color: '#1e293b' }}
                          onClick={(e) => { e.stopPropagation(); setSelectedRow(row); }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── JSON INSPECTOR MODAL ── */}
      {selectedRow && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 99999, padding: 20
        }}>
          <div style={{ background: '#fff', width: 620, maxWidth: '100%', padding: 24, borderRadius: 10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 15.5, fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: 10, color: '#0f172a' }}>
              🔍 Record Inspector — Table: <span style={{ color: '#2563eb' }}>{selectedTable}</span>
            </h3>
            
            <div style={{ 
              maxHeight: 380, overflowY: 'auto', background: '#f8fafc', 
              padding: 18, borderRadius: 8, border: '1px solid #cbd5e1', 
              fontFamily: 'Consolas, Monaco, "Courier New", monospace', fontSize: 12, 
              whiteSpace: 'pre-wrap', color: '#0f172a', lineHeight: 1.5
            }}>
              {JSON.stringify(selectedRow, null, 2)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button 
                onClick={() => setSelectedRow(null)}
                style={{ padding: '8px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
