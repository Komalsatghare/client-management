import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from "react";
import ClientSidebar from "./ClientSidebar";
import MyProjects from "./MyProjects";
import PaymentHistory from "./PaymentHistory";
import TrackProject from "./TrackProject";
import RequestNewProject from "./RequestNewProject";
import ChangePassword from "./ChangePassword";
import { UserCircle, Bell, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./ClientDashboard.css"; // Import standard CSS

export default function ClientDashboardLayout() {
    const { t } = useLanguage();
    const [activeSection, setActiveSection] = useState("My Projects");
    const clientName = localStorage.getItem("clientName") || "Client";
    const clientId = localStorage.getItem("clientId");
    const navigate = useNavigate();

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (clientId) {
            fetchNotifications();
        }
    }, [clientId]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get(`${API_BASE_URL}/api/clients/${clientId}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const handleBellClick = async () => {
        setIsDropdownOpen(!isDropdownOpen);

        // Mark as read if opening and there are unread
        if (!isDropdownOpen && notifications.some(n => !n.read)) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.put(`${API_BASE_URL}/api/clients/${clientId}/notifications/mark-read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Optimistically update local state
                setNotifications(notifications.map(n => ({ ...n, read: true })));
            } catch (err) {
                console.error("Failed to mark notifications as read:", err);
            }
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const renderContent = () => {
        switch (activeSection) {
            case "My Projects":
                return <MyProjects />;
            case "Request New Project":
                return <RequestNewProject />;
            case "Payment History":
                return <PaymentHistory />;
            case "Track My Project":
                return <TrackProject />;
            case "Change Password":
                return <ChangePassword />;
            default:
                return <MyProjects />;
        }
    };

    return (
        <div className="client-dashboard-container">
            {/* Sidebar */}
            <ClientSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Main Content Area */}
            <div className="client-main-area">

                {/* Top Navbar */}
                <header className="client-header">
                    <h1 className="client-header-title">
                        {t(activeSection.toLowerCase().replace(/ /g, '_')) || activeSection}
                    </h1>

                    <div className="client-header-profile" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <LanguageSwitcher />
                        {/* Home Button */}
                        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title={t('home') || "Go to Home"}>
                            <Home className="text-gray-600" size={24} color="#4b5563" />
                        </button>

                        {/* Notifications Bell */}
                        <div style={{ position: 'relative' }}>
                            <button onClick={handleBellClick} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex' }}>
                                <Bell className="text-gray-600" size={24} />
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '-5px', right: '-5px',
                                        background: '#dc3545', color: 'white', borderRadius: '50%',
                                        width: '18px', height: '18px', fontSize: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown */}
                            {isDropdownOpen && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: '0', marginTop: '10px',
                                    width: '300px', background: 'white', border: '1px solid #eee',
                                    borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000
                                }}>
                                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{t('notifications') || 'Notifications'}</div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>No notifications</div>
                                        ) : (
                                            notifications.map((n, idx) => (
                                                <div key={idx} style={{
                                                    padding: '12px 16px',
                                                    borderBottom: '1px solid #f5f5f5',
                                                    background: n.read ? 'white' : '#f0f7ff'
                                                }}>
                                                    <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{n.message}</p>
                                                    <span style={{ fontSize: '11px', color: '#888' }}>
                                                        {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserCircle className="text-blue-600" size={24} color="#2563eb" />
                            <div className="client-profile-text">
                                <span className="client-profile-name">{clientName}</span>
                                <span className="client-profile-role">{t('client_portal')}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content Area */}
                <main className="client-content-wrapper">
                    <div className="client-content-inner">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}


