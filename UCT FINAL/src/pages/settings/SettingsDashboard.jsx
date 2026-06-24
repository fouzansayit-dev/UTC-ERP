import React from 'react';
import SettingConfig     from './SettingConfig.jsx';
import CollegeSettings   from './CollegeSettings.jsx';
import ImportantLinks    from './ImportantLinks.jsx';
import BiometricLogs     from './BiometricLogs.jsx';
import MenuManagement    from './MenuManagement.jsx';
import SubMenuManagement from './SubMenuManagement.jsx';
import UserMaster        from './UserMaster.jsx';
import ChangePassword    from './ChangePassword.jsx';
import ViewEditUser      from './ViewEditUser.jsx';
import RoleManagement    from './RoleManagement.jsx';

export const SETTINGS_SUBMODULES = [
  { id: 'set-setting',        label: 'Setting',          component: SettingConfig     },
  { id: 'set-college',        label: 'College Setting',  component: CollegeSettings   },
  { id: 'set-links',          label: 'Important Link',   component: ImportantLinks    },
  { id: 'set-biometric',      label: 'Biometric Logs',   component: BiometricLogs     },
  { id: 'set-menu',           label: 'Menu',             component: MenuManagement    },
  { id: 'set-submenu',        label: 'Submenu',          component: SubMenuManagement },
  { id: 'set-user',           label: 'User Master',      component: UserMaster        },
  { id: 'set-role',           label: 'Role Management',  component: RoleManagement    },
  { id: 'set-password',       label: 'Change Password',  component: ChangePassword    },
  { id: 'set-view-edit-user', label: 'View / Edit User', component: ViewEditUser      },
];

export default function SettingsDashboard({ activeSub, onBack, setPageTitle }) {
  const current = SETTINGS_SUBMODULES.find(s => s.id === activeSub);
  if (current) {
    const Comp = current.component;
    return <Comp onBack={() => { onBack(); setPageTitle && setPageTitle('Settings'); }} />;
  }
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#0400ff', marginBottom: 8 }}>Settings</div>
      <div style={{ color: '#000000', fontSize: 13 }}>Setting.</div>
    </div>
  );
}
