import React from 'react';
import { LayoutDashboard, Users, FolderKanban, FileDigit, CreditCard, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import '../dashboard.css';

const Sidebar = ({ activeSection, setActiveSection, adminData }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'Dashboard',       name: t('dashboard'),       icon: <LayoutDashboard size={18} />, section: 'main' },
    { id: 'Client Records',  name: t('client_records'),  icon: <Users size={18} />,           section: 'main' },
    { id: 'Project Requests',name: t('project_requests'),icon: <FolderKanban size={18} />,    section: 'main' },
    { id: 'Projects',        name: t('projects'),        icon: <FileDigit size={18} />,       section: 'main' },
    { id: 'Track Project',   name: t('track_project'),   icon: <MapPin size={18} />,          section: 'main' },
    { id: 'Payments',        name: t('payments'),        icon: <CreditCard size={18} />,      section: 'reports' },
    { id: 'Inquiries',       name: t('inquiries'),       icon: <Mail size={18} />,            section: 'reports' },
  ];

  const mainItems    = menuItems.filter(i => i.section === 'main');
  const reportItems  = menuItems.filter(i => i.section === 'reports');

  const adminName = adminData?.name || 'Admin User';
  const adminEmail = adminData?.email || 'admin@dhanvij.com';
  const adminPhone = localStorage.getItem('adminPhone') || '';
  const initial = adminName.charAt(0).toUpperCase();

  return (
    <div className="sidebar">
      {/* ── Logo ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo-wrap">
          <img
            src="/images/dhanvij builders.jpeg"
            alt="Dhanvij Builders"
            className="sidebar-logo-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <span className="sidebar-logo-name">Dhanvij Builders</span>
            <span className="sidebar-logo-sub">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <div className="sidebar-nav-container">
        {/* Main */}
        <div className="sidebar-section-label">{t('menu_main') || "Main Menu"}</div>
        <nav className="sidebar-nav">
          {mainItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-link${activeSection === item.id ? ' active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />

        {/* Reports */}
        <div className="sidebar-section-label">{t('menu_reports') || "Finance & Comms"}</div>
        <nav className="sidebar-nav">
          {reportItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-link${activeSection === item.id ? ' active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Footer / User ── */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">{initial}</div>
            <div className="sidebar-user-details">
              <p className="sidebar-user-name">{adminName}</p>
              <p className="sidebar-user-email">{adminEmail}</p>
              {adminPhone && <p className="sidebar-user-email" style={{ fontSize: '10px', marginTop: '2px', opacity: 0.8 }}>{adminPhone}</p>}
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              window.location.href = '/login';
            }}
            className="sidebar-logout"
            title={t('logout')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
