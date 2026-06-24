import React, { useState } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function LogbookDieselReport() {
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(today());
  const [vehicle, setVehicle] = useState('All');
  const [submitted, setSubmitted] = useState(false);
  const [logRows] = useState([]);
  const [dieselRows] = useState([]);

  const handleSubmit = () => setSubmitted(true);

  return (
    <div className="hr-form">
      <div className="section-title">Log Book &amp; Diesel Report</div>

      <div className="form-grid" style={{ maxWidth: 600 }}>
        <div className="form-field">
          <label className="form-label">Start Date</label>
          <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">End Date</label>
          <input className="form-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Vehicle</label>
          <select className="form-input" value={vehicle} onChange={e => setVehicle(e.target.value)}>
            <option>All</option>
          </select>
        </div>
      </div>

      <div className="form-submit-row">
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>

      {submitted && (
        <div style={{ marginTop: 28 }}>
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
            overflow: 'hidden', boxShadow: '0 2px 8px rgba(67,97,238,0.06)'
          }}>
            {/* Report header */}
            <div style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 700, fontSize: 15, borderBottom: '1px solid #e2e8f0' }}>
              Logbook &amp; Diesel Report ({startDate.replaceAll('-', '/')} &ndash; {endDate.replaceAll('-', '/')})
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #e2e8f0' }}>
              {/* Logbook */}
              <div style={{ borderRight: '1px solid #e2e8f0' }}>
                <div style={{ background: '#eef0fd', textAlign: 'center', fontWeight: 700, color: '#4361ee', padding: '10px', fontSize: 14 }}>Logbook</div>
                <table className="hr-table">
                  <thead>
                    <tr>
                      {['SNo.','Vehicle','Date','Start km','End km','Running km','Diesel','Remark'].map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {logRows.length === 0
                      ? <tr><td colSpan={8} className="empty-table-msg" style={{ padding: 20 }}>—</td></tr>
                      : logRows.map((r, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{r.vehicle}</td>
                          <td>{r.date}</td>
                          <td>{r.startKm}</td>
                          <td>{r.endKm}</td>
                          <td>{r.runningKm}</td>
                          <td>{r.diesel}</td>
                          <td>{r.remark}</td>
                        </tr>
                      ))
                    }
                    <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                      <td colSpan={5}>Total</td>
                      <td>{logRows.reduce((a, r) => a + Number(r.runningKm || 0), 0)}</td>
                      <td>{logRows.reduce((a, r) => a + Number(r.diesel || 0), 0)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Diesel */}
              <div>
                <div style={{ background: '#eef0fd', textAlign: 'center', fontWeight: 700, color: '#4361ee', padding: '10px', fontSize: 14 }}>Diesel</div>
                <table className="hr-table">
                  <thead>
                    <tr>
                      {['SNo.','Vehicle','Date','Diesel(Ltr)','Diesel(Per Ltr Amt)','Net Amount','Start km','End km','Running km','Average','Remark'].map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {dieselRows.length === 0
                      ? <tr><td colSpan={11} className="empty-table-msg" style={{ padding: 20 }}>—</td></tr>
                      : dieselRows.map((r, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{r.vehicle}</td>
                          <td>{r.date}</td>
                          <td>{r.dieselQty}</td>
                          <td>{r.dieselPerLtrAmt}</td>
                          <td>{r.netAmount}</td>
                          <td>{r.startKm}</td>
                          <td>{r.endKm}</td>
                          <td>{r.runningKm}</td>
                          <td>{r.average}</td>
                          <td>{r.remark}</td>
                        </tr>
                      ))
                    }
                    <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                      <td colSpan={3}>Total</td>
                      <td>{dieselRows.reduce((a, r) => a + Number(r.dieselQty || 0), 0)}</td>
                      <td></td>
                      <td>{dieselRows.reduce((a, r) => a + Number(r.netAmount || 0), 0)}</td>
                      <td colSpan={5}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ padding: '10px 16px', fontSize: 13, color: '#374151' }}>
              <strong>Remaining Diesel: 0</strong>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <button className="submit-btn" style={{ background: '#16a34a' }} onClick={() => alert('Action')}>Export to Excel</button>
          </div>
        </div>
      )}
    </div>
  );
}
