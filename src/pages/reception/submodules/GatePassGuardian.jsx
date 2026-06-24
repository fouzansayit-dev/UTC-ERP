import { handleCopy, handleCSV, handlePrint } from '../../../utils/tableUtils.js';
import React, { useState, useRef, useEffect } from 'react';

function nowDT() {
  const d = new Date();
  return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function GatePassGuardian() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [streamActive, setStreamActive] = useState(false);

  // Gate pass form state (per row — shown in modal/detail view)
  const [form, setForm] = useState({
    type: '', name: '', validateDate: nowDT(), issueDatetime: nowDT(),
    accompaniedBy: '', relationWithStudent: '', reason: '', permittedBy: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
        setCameraError(false);
      }
    } catch {
      setCameraError(true);
    }
  };

  const capture = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    setCapturedImage(canvasRef.current.toDataURL('image/jpeg'));
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  useEffect(() => { return () => stopCamera(); }, []);

  const filtered = rows.filter(r =>
    (r.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hr-form">
      <div className="section-title">Gate Pass For Guardian</div>

      {/* Camera capture card */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '24px 28px', boxShadow: '0 2px 8px rgba(67,97,238,0.06)',
        maxWidth: 760, marginBottom: 28,
      }}>
        {/* Info fields */}
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 20 }}>
          <div className="form-field">
            <label className="form-label">Type</label>
            <input className="form-input" placeholder="Type" value={form.type} onChange={e => set('type', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Name</label>
            <input className="form-input" placeholder="Name" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Validate Date</label>
            <input className="form-input" placeholder="Validate date" value={form.validateDate} onChange={e => set('validateDate', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Issue Date / Time</label>
            <input className="form-input" placeholder="Issue date/time" value={form.issueDatetime} onChange={e => set('issueDatetime', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Accompanied By</label>
            <input className="form-input" placeholder="Accompanied by" value={form.accompaniedBy} onChange={e => set('accompaniedBy', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Relation with Student</label>
            <input className="form-input" placeholder="Relation" value={form.relationWithStudent} onChange={e => set('relationWithStudent', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Reason</label>
            <input className="form-input" placeholder="Reason" value={form.reason} onChange={e => set('reason', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Permitted By</label>
            <input className="form-input" placeholder="Permitted by" value={form.permittedBy} onChange={e => set('permittedBy', e.target.value)} />
          </div>
        </div>

        {/* Camera area */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{
              width: 320, height: 200, background: '#374151', borderRadius: 8,
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {capturedImage ? (
                <img src={capturedImage} alt="captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video ref={videoRef} autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', display: streamActive ? 'block' : 'none' }} />
              )}
              {!streamActive && !capturedImage && (
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Camera preview</span>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {!streamActive ? (
                <button className="submit-btn" style={{ padding: '8px 20px', fontSize: 13 }} onClick={startCamera}>
                  {capturedImage ? 'Retake' : 'Capture'}
                </button>
              ) : (
                <>
                  <button className="submit-btn" style={{ padding: '8px 20px', fontSize: 13 }} onClick={capture}>Capture</button>
                  <button className="submit-btn" style={{ padding: '8px 20px', fontSize: 13, background: '#6b7280' }} onClick={stopCamera}>Stop</button>
                </>
              )}
              {capturedImage && (
                <button className="submit-btn" style={{ padding: '8px 20px', fontSize: 13, background: '#059669' }}
                  onClick={() => {
                    if (!form.name) return;
                    setRows(p => [...p, { id: Date.now(), ...form, photo: capturedImage }]);
                    setCapturedImage(null);
                    setForm({ type: '', name: '', validateDate: nowDT(), issueDatetime: nowDT(), accompaniedBy: '', relationWithStudent: '', reason: '', permittedBy: '' });
                    stopCamera();
                  }}>
                  Save
                </button>
              )}
            </div>
            {cameraError && (
              <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>
                Camera not available. Please connect a camera to your computer.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{
        background: '#1e293b', color: '#fff', padding: '14px 20px',
        borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: 15,
      }}>
        Gate Pass For Guardian — Records
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Copy', 'CSV', 'Print'].map(b => (
            <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }} onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'GatePassGuardian'); else handlePrint('Gate Pass Guardian'); }}>{b}</button>
          ))}
        </div>
        <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="table-wrap" style={{ borderRadius: '0 0 10px 10px' }}>
        <table className="hr-table">
          <thead>
            <tr>
              {['S.No', 'Print', 'Type', 'Name', 'Validate Date', 'Issue Date/Time', 'Accompanied By', 'Relation', 'Reason', 'Permitted By'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className="empty-table-msg">No data available in table</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td><button className="tbl-btn view" onClick={() => handlePrint('Gate Pass Guardian')}>Print</button></td>
                <td>{r.type}</td>
                <td>{r.name}</td>
                <td>{r.validateDate}</td>
                <td>{r.issueDatetime}</td>
                <td>{r.accompaniedBy}</td>
                <td>{r.relationWithStudent}</td>
                <td>{r.reason}</td>
                <td>{r.permittedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
        Showing {filtered.length === 0 ? '0 to 0 of 0' : `1 to ${filtered.length} of ${filtered.length}`} entries
      </div>
    </div>
  );
}
