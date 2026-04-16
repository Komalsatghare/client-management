import { LogOut, User, Settings, Home, Menu } from 'lucide-react';
import "../dashboard.css";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const TopNavbar = ({ activeSection, setActiveSection, adminData, toggleSidebar }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="top-navbar">
            {/* mobile-toggle removed as per user request */}
            <div className="navbar-title">
                {t(activeSection.toLowerCase().replace(/\s+/g, '_')) || activeSection}
            </div>
            <div className="navbar-actions">
                <LanguageSwitcher />
                <button
                    onClick={() => navigate('/')}
                    className="icon-btn"
                    title={t('go_to_homepage') || "Go to Homepage"}
                >
                    <Home size={20} />
                </button>
                <button
                    onClick={() => setActiveSection('Settings')}
                    className={`icon-btn ${activeSection === 'Settings' ? 'active' : ''}`}
                    title={t('settings') || 'Settings'}
                >
                    <Settings size={20} />
                </button>
                <button
                    onClick={() => setActiveSection('My Profile')}
                    className={`icon-btn ${activeSection === 'My Profile' ? 'active' : ''}`}
                    title={t('my_profile') || 'My Profile'}
                    style={{ gap: '10px', padding: '8px 12px' }}
                >
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={14} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, display: 'inline-block' }}>{adminData?.name || 'Admin User'}</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                    title={t('logout')}
                >
                    <LogOut size={18} />
                    <span className="logout-text">{t('logout')}</span>
                </button>
            </div>
        </div>
    );
};

export default TopNavbar;
