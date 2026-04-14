import React, { useState, useRef, useEffect } from "react";
import RequestNewProject from "./RequestNewProject";
import { Building2, LogOut, Mail, Phone, X, Shield, Sparkles, Home, Globe, Menu } from "lucide-react";
import "./ClientDashboard.css";
import UploadAgreement from "../components/UploadAgreement";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ClientSidebar from "./ClientSidebar";

export default function ClientDashboardLayout() {
    const { t } = useLanguage();
    const clientName  = localStorage.getItem("clientName")  || "Client";
    const clientId    = localStorage.getItem("clientId");
    const clientEmail = localStorage.getItem("clientEmail") || "";
    const clientPhone = localStorage.getItem("clientPhone") || "";

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("Request New Project");
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    /* Close on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("clientAuthToken");
        localStorage.removeItem("clientName");
        localStorage.removeItem("clientId");
        window.location.href = "/client-login";
    };

    const renderSection = () => {
        switch (activeSection) {
            case "Request New Project":
                return <RequestNewProject />;
            case "Agreements":
                return <UploadAgreement uploadedByRole="client" uploadedByName={clientName} />;
            default:
                return <RequestNewProject />;
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#070d1a", fontFamily: "'Inter', sans-serif", display: "flex" }}>
            
            <ClientSidebar 
                activeSection={activeSection} 
                setActiveSection={(section) => {
                    setActiveSection(section);
                    setIsSidebarOpen(false);
                }} 
            />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* ── Ambient background glow ── */}
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                    .cdl-glow-1 { position:fixed; top:-200px; right:-100px; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%); pointer-events:none; z-index:0; }
                    .cdl-glow-2 { position:fixed; bottom:-200px; left:-100px; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%); pointer-events:none; z-index:0; }
                    .cdl-hero-chip { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:999px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); font-size:12px; font-weight:600; color:rgba(255,255,255,0.7); margin-bottom:14px; }
                    .cdl-step-card { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:10px 16px; transition:all .2s; cursor:default; }
                    .cdl-step-card:hover { background:rgba(255,255,255,0.11); border-color:rgba(255,255,255,0.18); transform:translateY(-2px); }
                    .cdl-step-num { width:26px; height:26px; border-radius:50%; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; color:white; flex-shrink:0; }
                    .cdl-profile-btn { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:7px 14px; cursor:pointer; transition:all .2s; }
                    .cdl-profile-btn:hover, .cdl-profile-btn.open { background:rgba(96,165,250,0.1); border-color:rgba(96,165,250,0.3); }
                    .cdl-profile-dropdown { position:absolute; top:calc(100% + 10px); right:0; width:300px; background:#0d1832; border-radius:18px; border:1px solid rgba(255,255,255,0.1); box-shadow:0 20px 50px rgba(0,0,0,0.7); z-index:1000; overflow:hidden; animation:dropIn .18s ease-out; }
                    @keyframes dropIn { from { opacity:0; transform:translateY(-8px) scale(.97); } to { opacity:1; transform:none; } }
                    .cdl-info-row { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
                    .cdl-info-row:last-child { border-bottom:none; }
                    .cdl-info-icon { width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
                    .cdl-logout-btn-nav { display:flex; align-items:center; gap:6px; padding:8px 14px; background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.2); border-radius:10px; font-weight:600; font-size:13px; cursor:pointer; transition:all .2s; font-family:'Inter',sans-serif; }
                    .cdl-logout-btn-nav:hover { background:rgba(239,68,68,0.18); border-color:rgba(239,68,68,0.35); }
                    .cdl-logout-btn-full { width:100%; display:flex; align-items:center; justify-content:center; gap:7px; padding:10px; background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.2); border-radius:10px; font-weight:700; font-size:13px; cursor:pointer; transition:all .2s; font-family:'Inter',sans-serif; }
                    .cdl-logout-btn-full:hover { background:rgba(239,68,68,0.18); }
                    .cdl-hamburger { display:none; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:8px; color:white; cursor:pointer; align-items:center; justify-content:center; }
                    
                    @media (max-width: 768px) {
                        .cdl-hamburger { display:flex; }
                        .cdl-hero-banner { padding:32px 20px 36px !important; }
                        .cdl-hero-title { font-size:24px !important; }
                        .cdl-main-content { padding:24px 20px 48px !important; }
                    }

                    /* Sidebar Mobile Handling */
                    .cdl-sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99; backdrop-filter:blur(4px); }
                    .cdl-sidebar-overlay.show { display:block; }
                    @media (max-width: 768px) {
                        .client-sidebar { position:fixed !important; left:-256px !important; z-index:100 !important; }
                        .client-sidebar.open { left:0 !important; }
                        .client-main-area { margin-left:0 !important; }
                    }
                `}</style>

                <div className="cdl-glow-1" />
                <div className="cdl-glow-2" />

                <div className={`cdl-sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)} />

                {/* ── TOP NAV ── */}
                <header style={{
                    position: "sticky", top: 0, zIndex: 100,
                    background: "rgba(7,13,26,0.92)",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 1px 20px rgba(0,0,0,0.4)",
                    backdropFilter: "blur(20px)"
                }}>
                    <div style={{
                        maxWidth: "1200px", margin: "0 auto",
                        padding: "0 28px", height: "68px",
                        display: "flex", alignItems: "center", justifyContent: "space-between"
                    }}>
                        {/* Brand + Hamburger */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <button className="cdl-hamburger" onClick={() => setIsSidebarOpen(true)}>
                                <Menu size={20} />
                            </button>
                            <div style={{
                                width: "40px", height: "40px", borderRadius: "12px",
                                background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 14px rgba(99,102,241,0.35)"
                            }}>
                                <Building2 size={20} color="white" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 800, fontSize: "15px", lineHeight: 1, background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    {t('client_portal')}
                                </p>
                                <p className="hidden-mobile" style={{ margin: 0, fontSize: "11px", color: "#475569", marginTop: "2px" }}>
                                    Civil Engineering Services
                                </p>
                            </div>
                        </div>

                        {/* Right side */}
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <LanguageSwitcher />

                            {/* Profile dropdown */}
                            <div style={{ position: "relative" }} ref={profileRef}>
                                <button className={`cdl-profile-btn${profileOpen ? " open" : ""}`}
                                    onClick={() => setProfileOpen(v => !v)}>
                                    <div style={{
                                        width: "32px", height: "32px", borderRadius: "9px",
                                        background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "white", fontWeight: 800, fontSize: "14px",
                                        boxShadow: "0 2px 8px rgba(99,102,241,0.35)"
                                    }}>
                                        {clientName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden-mobile">
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#f1f5f9", lineHeight: 1 }}>{clientName}</p>
                                        <p style={{ margin: 0, fontSize: "11px", color: "#475569", marginTop: "2px" }}>{t('role')}: Client</p>
                                    </div>
                                </button>

                                {/* Profile Dropdown */}
                                {profileOpen && (
                                    <div className="cdl-profile-dropdown">
                                        {/* Header gradient */}
                                        <div style={{ background: "linear-gradient(135deg,#1e3a6e,#4c1d95)", padding: "22px 20px 18px", position: "relative" }}>
                                            <button onClick={() => setProfileOpen(false)} style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "7px", padding: "5px 8px", cursor: "pointer", color: "white", display: "flex" }}>
                                                <X size={14} />
                                            </button>
                                            <div style={{ width: "54px", height: "54px", borderRadius: "14px", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: "white", marginBottom: "10px" }}>
                                                {clientName.charAt(0).toUpperCase()}
                                            </div>
                                            <p style={{ margin: 0, fontWeight: 800, fontSize: "16px", color: "white" }}>{clientName}</p>
                                            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{t('profile')}</p>
                                        </div>

                                        {/* Info rows */}
                                        <div style={{ padding: "14px 20px" }}>
                                            {[
                                                { icon: <Mail  size={14} color="#60a5fa" />, label: t('email'),  value: clientEmail || "Not set" },
                                                { icon: <Phone size={14} color="#a78bfa" />, label: t('phone'),  value: clientPhone || "Not set" },
                                                { icon: <Shield size={14} color="#10b981"/>, label: t('role'),   value: "Client" },
                                            ].map((row, i) => (
                                                <div key={i} className="cdl-info-row">
                                                    <div className="cdl-info-icon">{row.icon}</div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{row.label}</p>
                                                        <p style={{ margin: 0, fontSize: "13px", color: "#e2e8f0", fontWeight: 600, marginTop: "1px" }}>{row.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ padding: "0 16px 16px" }}>
                                            <button onClick={handleLogout} className="cdl-logout-btn-full">
                                                <LogOut size={14} /> {t('logout')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Logout button */}
                            <button onClick={handleLogout} className="cdl-logout-btn-nav hidden-mobile">
                                <LogOut size={14} /> {t('logout')}
                            </button>
                        </div>
                    </div>
                </header>

                {/* ── HERO BANNER ── */}
                <div className="cdl-hero-banner" style={{
                    background: "linear-gradient(135deg, #061229 0%, #0f2d6b 45%, #2d1a6e 100%)",
                    padding: "44px 28px 48px",
                    position: "relative", overflow: "hidden"
                }}>
                    <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />

                    <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
                        <div className="cdl-hero-chip">
                            <Sparkles size={12} color="#f59e0b" />
                            {activeSection}
                        </div>

                        <p style={{ margin: "0 0 6px", fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                            {t('welcome_back')}, <strong style={{ color: "rgba(255,255,255,0.9)" }}>{clientName}</strong> 👋
                        </p>
                        <h1 className="cdl-hero-title" style={{ margin: "0 0 10px", fontSize: "30px", fontWeight: 900, color: "white", letterSpacing: "-.02em" }}>
                            {t(activeSection.toLowerCase().replace(/\s+/g, '_')) || activeSection}
                        </h1>
                        <p style={{ margin: 0, fontSize: "15px", color: "rgba(255,255,255,0.6)", maxWidth: "480px", lineHeight: 1.65 }}>
                            {t('submit_proposal_desc')}
                        </p>

                        <div style={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
                            {[
                                { label: t('step1_label'), hint: t('step1_hint') },
                                { label: t('step2_label'), hint: t('step2_hint') },
                                { label: t('step3_label'), hint: t('step3_hint') },
                            ].map((step, i) => (
                                <div key={i} className="cdl-step-card">
                                    <div className="cdl-step-num">{i + 1}</div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "white" }}>{step.label}</p>
                                        <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "1px" }}>{step.hint}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── MAIN CONTENT ── */}
                <main className="cdl-main-content" style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 28px 64px", position: "relative", zIndex: 1, flex: 1 }}>
                    {renderSection()}
                </main>
            </div>
        </div>
    );
}
