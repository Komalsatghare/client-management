import React, { useState, useEffect } from 'react';
import { LogOut, User, Settings, Bell, Search } from 'lucide-react';
import '../dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const sectionIcons = {
  'Dashboard':        '🏠',
  'Client Records':   '👥',
  'Project Requests': '📋',
  'Projects':         '🏗️',
  'Track Project':    '📍',
  'Payments':         '💳',
  'Inquiries':        '📬',
  'Settings':         '⚙️',
  'My Profile':       '👤',
};

const TopNavbar = ({ activeSection, setActiveSection, adminData }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }));
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all admin data on logout
    navigate('/login');
  };

  return (
    <div className="top-navbar">
      {/* Left: Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div>
          <div className="navbar-title">
            <span style={{ fontSize: 18 }}>{sectionIcons[activeSection] || '📌'}</span>
            {t(activeSection.toLowerCase().replace(/\s+/g, '_')) || activeSection}
          </div>
          <div className="navbar-breadcrumb">
            {t('admin_panel') || "Admin Panel"} → <span>{t(activeSection.toLowerCase().replace(/\s+/g, '_')) || activeSection}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="navbar-actions">
        {/* Date / Time chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
          background: 'white', border: '1px solid #e2e8f0',
          borderRadius: 8, marginRight: 4, visibility: 'hidden'
        }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{date}</span>
          <span style={{ width: 1, height: 14, background: '#cbd5e1', display: 'block' }} />
          <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 700 }}>{time}</span>
        </div>

        <LanguageSwitcher />

        {/* Settings */}
        <button
          onClick={() => setActiveSection('Settings')}
          className={`icon-btn${activeSection === 'Settings' ? ' active' : ''}`}
          title={t('settings') || 'Settings'}
        >
          <Settings size={18} />
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveSection('My Profile')}
          className={`navbar-profile-btn${activeSection === 'My Profile' ? ' active' : ''}`}
          title={t('my_profile') || 'My Profile'}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}
        >
          <div style={{ background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#1e293b' }}>
             <User size={16} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{adminData?.name || 'Admin User'}</span>
        </button>

        {/* Logout */}
        <button onClick={handleLogout} className="logout-btn" title={t('logout')}>
          <LogOut size={16} />
          <span className="logout-text">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;
