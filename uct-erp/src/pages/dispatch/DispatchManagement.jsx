import React from 'react';
import AddSection   from './submodules/AddSection.jsx';
import AddCopy      from './submodules/AddCopy.jsx';
import AddInWard    from './submodules/AddInWard.jsx';
import ViewInWard   from './submodules/ViewInWard.jsx';
import AddOutWard   from './submodules/AddOutWard.jsx';
import ViewOutWard  from './submodules/ViewOutWard.jsx';

export const DISPATCH_SUBMODULES = [
  { id: 'dispatch-add-section',  label: 'Add Section',   component: AddSection  },
  { id: 'dispatch-add-copy',     label: 'Add Copy',      component: AddCopy     },
  { id: 'dispatch-add-inward',   label: 'Add In Ward',   component: AddInWard   },
  { id: 'dispatch-view-inward',  label: 'View In Ward',  component: ViewInWard  },
  { id: 'dispatch-add-outward',  label: 'Add Out Ward',  component: AddOutWard  },
  { id: 'dispatch-view-outward', label: 'View Out Ward', component: ViewOutWard },
];

export default function DispatchManagement({ activeSub, onBack, setPageTitle }) {
  const current = DISPATCH_SUBMODULES.find(s => s.id === activeSub);
  if (current) {
    const Comp = current.component;
    return <Comp onBack={() => { onBack(); setPageTitle('Dispatch'); }} />;
  }
  return (
    <div className="hr-form">
      <div className="section-title">Dispatch</div>
      <div style={{ color: '#888', padding: 20 }}>Select a submodule from the sidebar.</div>
    </div>
  );
}
