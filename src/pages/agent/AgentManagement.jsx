import React from 'react';
import './AgentManagement.css';

/* ── SUBMODULE IMPORTS ── */
import AgentList           from './submodules/AgentList.jsx';
import AgentProfile        from './submodules/AgentProfile.jsx';
import AgentCommissionFlow from './submodules/AgentCommissionFlow.jsx';
import AgentPortal         from './submodules/AgentPortal.jsx';
import CommissionStatement from './submodules/CommissionStatement.jsx';

/* ── SUBMODULE REGISTRY ── */
export const AGENT_SUBMODULES = [
  { id: 'agent-list',       label: 'Agent List' },
  { id: 'agent-add',        label: 'Add Agent' },
  { id: 'agent-commission', label: 'Commission Management' },
  { id: 'agent-portal',     label: 'Agent Portal' },
  { id: 'agent-statement',  label: 'Commission Statement' },
];

/* ── PAGE MAP — component references (not JSX elements) ── */
const PAGE_MAP = {
  'agent-list':       AgentList,
  'agent-add':        AgentProfile,
  'agent-commission': AgentCommissionFlow,
  'agent-portal':     AgentPortal,
  'agent-statement':  CommissionStatement,
};

/* ── MAIN COMPONENT ── */
export default function AgentManagement({ activeSub, onBack, onNavigate }) {
  const PageComp    = activeSub && PAGE_MAP[activeSub];
  const activeLabel = AGENT_SUBMODULES.find(s => s.id === activeSub)?.label;

  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-link" onClick={onBack}>
          Agent Management
        </span>
        {activeSub && activeLabel && (
          <> {' › '}<b>{activeLabel}</b></>
        )}
      </div>
      <div className="page-heading">
        {activeLabel || 'Agent Management'}
      </div>
      {PageComp
        ? <div style={{ marginTop: 24 }}><PageComp onNavigate={onNavigate} /></div>
        : (
          <div style={{ marginTop: 24, color: '#888' }}>
            Select a sub-module from the sidebar.
          </div>
        )
      }
    </div>
  );
}