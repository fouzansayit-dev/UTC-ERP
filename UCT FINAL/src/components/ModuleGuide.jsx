import React, { useState } from 'react';

export default function ModuleGuide({ title = "How It Works", steps = [], tips = [], defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px dashed #cbd5e1',
      borderRadius: '8px',
      marginBottom: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: isOpen ? '0 4px 12px rgba(148, 163, 184, 0.08)' : 'none'
    }}>
      {/* Header Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: isOpen ? '#f1f5f9' : '#f8fafc',
          userSelect: 'none',
          transition: 'background 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d5ef4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
            {title} — User Guide & Workflow Flowchart
          </span>
        </div>
        <span style={{
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '14px',
          color: '#64748b'
        }}>
          ▶
        </span>
      </div>

      {/* Expandable Content */}
      {isOpen && (
        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
          
          {/* Timeline steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
            {/* Draw a vertical connector line */}
            <div style={{
              position: 'absolute',
              left: '11px',
              top: '12px',
              bottom: '12px',
              width: '2px',
              background: '#e2e8f0',
              zIndex: 1
            }} />

            {steps.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '14px', zIndex: 2 }}>
                {/* Number Circle */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  border: '2px solid #3b82f6',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                {/* Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{s.title}</span>
                  <span style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.45' }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick tips box */}
          {tips.length > 0 && (
            <div style={{
              marginTop: '18px',
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '6px',
              padding: '12px 16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#b45309' }}>Professional Tips:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {tips.map((tip, idx) => (
                  <li key={idx} style={{ fontSize: '12px', color: '#78350f', lineHeight: '1.4' }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
