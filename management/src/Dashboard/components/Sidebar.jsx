import React from 'react';
import { LayoutDashboard, Users, FolderKanban, FileText, Mail, Globe, LogOut, X, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = ({ activeSection, setActiveSection, adminData, isOpen, setIsOpen }) => {
    const { t } = useLanguage();

    const menuItems = [
        { id: 'Dashboard', name: t('dashboard'), icon: <LayoutDashboard size={20} /> },
        { id: 'Client Records', name: t('client_records'), icon: <Users size={20} /> },
        { id: 'Project Requests', name: t('project_requests'), icon: <FolderKanban size={20} /> },
        { id: 'Projects', name: t('projects'), icon: <FileText size={20} /> },
        { id: 'Track My Project', name: t('track_my_project'), icon: <FolderKanban size={20} /> },
        { id: 'Public Projects', name: t('public_projects'), icon: <Globe size={20} /> },
        { id: 'Inquiries', name: t('inquiries'), icon: <Mail size={20} /> },
        { id: 'Agreements', name: t('agreements'), icon: <FileText size={20} /> },
        { id: 'Reviews', name: t('reviews') || "Reviews", icon: <Star size={20} /> },
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)}></div>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h1 className="sidebar-title">
                        {t('admin_panel') || "Admin Panel"}
                    </h1>
                    <button className="sidebar-mobile-close" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sidebar-nav-container">
                    <nav className="sidebar-nav">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSection(item.id);
                                    setIsOpen(false);
                                }}
                                className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-info">
                            <div className="sidebar-avatar">
                                {adminData?.name ? adminData.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="sidebar-user-details">
                                <p className="sidebar-user-name">{adminData?.name || "Admin User"}</p>
                                <p className="sidebar-user-email">{adminData?.email || "admin@example.com"}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="sidebar-logout"
                            title={t('logout')}
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
