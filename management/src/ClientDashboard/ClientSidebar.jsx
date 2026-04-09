import React from "react";
import { FileText, LogOut, LayoutDashboard, Building2 } from "lucide-react";

export default function ClientSidebar({ activeSection, setActiveSection }) {
    const clientName = localStorage.getItem("clientName") || "Client";

    const handleLogout = () => {
        localStorage.removeItem("clientAuthToken");
        localStorage.removeItem("clientName");
        window.location.href = "/client-login";
    };

    const menuItems = [
        { name: "Request New Project", icon: <FileText size={18} />, desc: "Submit proposals" },
    ];

    return (
        <aside className="client-sidebar">
            <style>{`
                .csb-logo-wrap {
                    display:flex; align-items:center; gap:11px;
                }
                .csb-logo-icon {
                    width:38px; height:38px; border-radius:11px;
                    background:linear-gradient(135deg,#3b82f6,#7c3aed);
                    display:flex; align-items:center; justify-content:center;
                    box-shadow:0 4px 12px rgba(99,102,241,0.4); flex-shrink:0;
                }
                .csb-logo-text { font-size:15px; font-weight:800; background:linear-gradient(135deg,#60a5fa,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
                .csb-logo-sub  { font-size:10px; color:#334155; margin-top:1px; }

                .csb-section-label {
                    font-size:10px; font-weight:700; color:#334155;
                    text-transform:uppercase; letter-spacing:.1em;
                    padding:0 14px 8px; margin-top:8px;
                }

                .csb-nav-btn {
                    width:100%; display:flex; align-items:center; gap:12px;
                    padding:11px 14px; border-radius:12px;
                    background:transparent; border:none; cursor:pointer;
                    font-family:'Inter',sans-serif; transition:all .2s;
                    text-align:left; position:relative;
                }
                .csb-nav-btn:hover { background:rgba(255,255,255,0.05); transform:translateX(2px); }
                .csb-nav-btn.active {
                    background:linear-gradient(135deg,rgba(59,130,246,0.18),rgba(139,92,246,0.12));
                    border:1px solid rgba(59,130,246,0.25);
                    box-shadow:0 4px 16px rgba(59,130,246,0.1);
                }
                .csb-nav-indicator {
                    position:absolute; left:0; top:50%; transform:translateY(-50%);
                    width:3px; height:26px; border-radius:0 4px 4px 0;
                    background:linear-gradient(to bottom,#60a5fa,#a78bfa);
                    box-shadow:0 0 8px rgba(96,165,250,0.5);
                }
                .csb-nav-icon {
                    width:36px; height:36px; border-radius:10px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center;
                    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.07);
                    transition:all .2s;
                }
                .csb-nav-btn.active .csb-nav-icon {
                    background:rgba(59,130,246,0.15); border-color:rgba(59,130,246,0.3); color:#60a5fa;
                }
                .csb-nav-btn:not(.active) .csb-nav-icon { color:#475569; }
                .csb-nav-label { font-size:13px; font-weight:600; color:#94a3b8; transition:color .2s; }
                .csb-nav-sub   { font-size:11px; color:#334155; margin-top:1px; }
                .csb-nav-btn.active .csb-nav-label { color:#bfdbfe; }
                .csb-nav-btn:hover:not(.active) .csb-nav-label { color:#e2e8f0; }

                .csb-user-card {
                    display:flex; align-items:center; gap:10px;
                    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
                    border-radius:12px; padding:12px 14px; margin-bottom:10px;
                }
                .csb-user-avatar {
                    width:36px; height:36px; border-radius:10px; flex-shrink:0;
                    background:linear-gradient(135deg,#3b82f6,#7c3aed);
                    display:flex; align-items:center; justify-content:center;
                    color:white; font-weight:800; font-size:15px;
                    box-shadow:0 2px 8px rgba(99,102,241,0.35);
                }
                .csb-logout-btn {
                    width:100%; display:flex; align-items:center; gap:10px;
                    padding:10px 14px; background:transparent;
                    border:none; cursor:pointer; font-size:13px; font-weight:600;
                    color:#64748b; border-radius:10px; transition:all .2s;
                    font-family:'Inter',sans-serif;
                }
                .csb-logout-btn:hover { background:rgba(239,68,68,0.1); color:#f87171; }
            `}</style>

            {/* Logo */}
            <div className="client-sidebar-logo">
                <div className="csb-logo-wrap">
                    <div className="csb-logo-icon">
                        <LayoutDashboard size={20} color="white" />
                    </div>
                    <div>
                        <div className="csb-logo-text">Client Panel</div>
                        <div className="csb-logo-sub">Civil Engineering Services</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="client-sidebar-nav">
                <div className="csb-section-label">Navigation</div>
                {menuItems.map((item) => {
                    const isActive = activeSection === item.name;
                    return (
                        <button key={item.name}
                            onClick={() => setActiveSection(item.name)}
                            className={`csb-nav-btn${isActive ? " active" : ""}`}>
                            {isActive && <div className="csb-nav-indicator" />}
                            <div className="csb-nav-icon">{item.icon}</div>
                            <div>
                                <div className="csb-nav-label">{item.name}</div>
                                <div className="csb-nav-sub">{item.desc}</div>
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="client-sidebar-bottom">
                {/* User card */}
                <div className="csb-user-card">
                    <div className="csb-user-avatar">{clientName.charAt(0).toUpperCase()}</div>
                    <div>
                        <div style={{ fontSize:"12px", fontWeight:700, color:"#e2e8f0", lineHeight:1 }}>{clientName}</div>
                        <div style={{ fontSize:"11px", color:"#475569", marginTop:"2px" }}>Client Account</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="csb-logout-btn">
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </aside>
    );
}
