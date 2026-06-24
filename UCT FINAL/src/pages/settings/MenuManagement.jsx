import { handleCopy, handleCSV, handlePrint } from '../../utils/tableUtils.js';
import React, { useState } from 'react';

const DEFAULT_MENUS = [
  { id: 1,  name: 'Dashboard',        seeActive: '', icon: 'fa-dashboard',  order: 0  },
  { id: 2,  name: 'Setting',          seeActive: '', icon: 'fa-clone',      order: 1  },
  { id: 3,  name: 'User Master',      seeActive: '', icon: 'fa-users',      order: 2  },
  { id: 4,  name: 'Master',           seeActive: '', icon: 'fa-th',         order: 3  },
  { id: 5,  name: 'HR Management',    seeActive: '', icon: 'fa-money',      order: 4  },
  { id: 6,  name: 'Import',           seeActive: '', icon: 'fa-indent',     order: 5  },
  { id: 7,  name: 'Fee',              seeActive: '', icon: 'fa-rupee',      order: 6  },
  { id: 8,  name: 'Account Master',   seeActive: '', icon: 'fa-dashboard',  order: 6  },
  { id: 9,  name: 'Account',          seeActive: '', icon: 'fa-calculator', order: 6  },
  { id: 10, name: 'Account Report',   seeActive: '', icon: 'fa-reorder',    order: 6  },
  { id: 11, name: 'Fee Master',       seeActive: '', icon: 'fa-dashboard',  order: 6  },
  { id: 12, name: 'Student',          seeActive: '', icon: 'fa-user-plus',  order: 7  },
  { id: 13, name: 'Student Report',   seeActive: '', icon: 'fa-reorder',    order: 7  },
  { id: 14, name: 'Student Attendance', seeActive: '', icon: 'fa-user-plus', order: 7 },
  { id: 15, name: 'Leave Mgmt',       seeActive: '', icon: 'fa-user-plus',  order: 8  },
  { id: 16, name: 'Lesson Plan',      seeActive: '', icon: 'fa-clone',      order: 8  },
  { id: 17, name: 'Timetable Mgmt',   seeActive: '', icon: 'fa-table',      order: 8  },
  { id: 18, name: 'Examination',      seeActive: '', icon: 'fa-th',         order: 8  },
  { id: 19, name: 'Gate Pass',        seeActive: '', icon: 'fa-glide-g',    order: 9  },
  { id: 20, name: 'Visitor Mgmt',     seeActive: '', icon: 'fa-indent',     order: 9  },
  { id: 21, name: 'Hostel',           seeActive: '', icon: 'fa-dashboard',  order: 9  },
  { id: 22, name: 'Transport',        seeActive: '', icon: 'fa-bus',        order: 10 },
  { id: 23, name: 'Certificate',      seeActive: '', icon: 'fa-clone',      order: 11 },
  { id: 24, name: 'Document',         seeActive: '', icon: 'fa-indent',     order: 11 },
  { id: 25, name: 'Reception',        seeActive: '', icon: 'fa-th-large',   order: 12 },
  { id: 26, name: 'Dispatch',         seeActive: '', icon: 'fa-clone',      order: 13 },
  { id: 27, name: 'Alumni',           seeActive: '', icon: 'fa-user-plus',  order: 14 },
  { id: 28, name: 'Send SMS',         seeActive: '', icon: 'fa-comment',    order: 15 },
  { id: 29, name: 'Whatsapp',         seeActive: '', icon: 'fa-indent',     order: 15 },
  { id: 30, name: 'Mobile APP',       seeActive: '', icon: 'fa-th-large',   order: 16 },
  { id: 31, name: 'Enquiry',          seeActive: '', icon: 'fa-phone',      order: 17 },
  { id: 32, name: 'Change Password',  seeActive: '', icon: 'fa-th-large',   order: 18 },
];

export default function MenuManagement({ onBack }) {
  const [menus, setMenus] = useState(DEFAULT_MENUS);
  const [form, setForm] = useState({ menuName: '', seeActive: '', icon: '', order: '' });
  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.menuName.trim()) return;
    setMenus(p => [...p, { id: Date.now(), name: form.menuName, seeActive: form.seeActive, icon: form.icon, order: Number(form.order) || 0 }]);
    setForm({ menuName: '', seeActive: '', icon: '', order: '' });
  };

  const filtered = menus.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="hr-form">
      <div className="section-title">Add Menu List</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '24px 28px', marginBottom: 24 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-field">
            <label className="form-label">Menu Name</label>
            <input className="form-input" value={form.menuName} onChange={e => set('menuName', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">See Active</label>
            <input className="form-input" value={form.seeActive} onChange={e => set('seeActive', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Icon</label>
            <input className="form-input" placeholder="e.g. fa-dashboard" value={form.icon} onChange={e => set('icon', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Order</label>
            <input className="form-input" type="number" value={form.order} onChange={e => set('order', e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      <div className="table-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Copy', 'CSV', 'Print'].map(b => (
              <button key={b} className="tbl-btn view" style={{ background: '#f1f5f9', color: '#374151' }}
                onClick={e => { if(b==='Copy') handleCopy(e.currentTarget); else if(b==='CSV') handleCSV(e.currentTarget, 'MenuManagement'); else handlePrint('Menu Management'); }}>{b}</button>
            ))}
          </div>
          <input className="form-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="hr-table">
          <thead>
            <tr>{['SNo.', 'Menu Category', 'See Active', 'Icon', 'Order', 'Edit', 'Delete'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td>{m.name}</td>
                <td>{m.seeActive}</td>
                <td style={{ fontSize: 12, color: '#6b7280' }}>{m.icon}</td>
                <td>{m.order}</td>
                <td><button className="tbl-btn view" style={{ background: '#e0f2fe', color: '#0369a1' }} onClick={() => alert('Edit: ' + m.name)}>✏</button></td>
                <td><button className="tbl-btn" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={() => setMenus(p => p.filter(x => x.id !== m.id))}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
          Showing 1 to {filtered.length} of {filtered.length} entries
        </div>
      </div>
    </div>
  );
}
