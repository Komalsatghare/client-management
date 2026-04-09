import { FolderGit2, CreditCard, LayoutDashboard, Search, ShoppingBag, LogOut, FileText, KeyRound } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function ClientSidebar({ activeSection, setActiveSection }) {
    const { t } = useLanguage();
    const handleLogout = () => {
        localStorage.removeItem("clientAuthToken");
        localStorage.removeItem("clientName");
        window.location.href = "/client-login";
    };

    const menuItems = [
        { name: "My Projects", label: t('my_projects'), icon: <FolderGit2 size={20} /> },
        { name: "Request New Project", label: t('request_new_project') || t('request_project_btn'), icon: <FileText size={20} /> },
        { name: "Track My Project", label: t('track_my_project'), icon: <Search size={20} /> },
        { name: "Payment History", label: t('payment_history'), icon: <CreditCard size={20} /> },
        { name: "Change Password", label: t('change_password'), icon: <KeyRound size={20} /> },
    ];

    return (
        <aside className="client-sidebar">
            {/* Logo Area */}
            <div className="client-sidebar-logo">
                <div className="client-sidebar-logo-inner">
                    <div className="client-sidebar-icon">
                        <LayoutDashboard size={24} />
                    </div>
                    <span className="client-sidebar-title">
                        Client Panel
                    </span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="client-sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveSection(item.name)}
                        className={`client-sidebar-btn ${activeSection === item.name ? "client-sidebar-btn-active" : ""}`}
                    >
                        {/* Active Indicator Line */}
                        {activeSection === item.name && (
                            <div className="client-sidebar-active-indicator"></div>
                        )}

                        <div className="client-sidebar-icon-span">
                            {item.icon}
                        </div>
                        <span>{item.label || item.name}</span>
                    </button>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="client-sidebar-bottom">
                <button
                    onClick={handleLogout}
                    className="client-sidebar-logout"
                >
                    <LogOut size={20} />
                    <span>{t('logout')}</span>
                </button>
            </div>
        </aside>
    );
}
