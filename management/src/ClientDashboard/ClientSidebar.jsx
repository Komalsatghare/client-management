import React from "react";
import { FileText, LogOut, LayoutDashboard, Building2, X, Star, Mail } from "lucide-react";

export default function ClientSidebar({ activeSection, setActiveSection, onClose }) {
    const clientName = localStorage.getItem("clientName") || "Client";

    const handleLogout = () => {
        localStorage.removeItem("clientAuthToken");
        localStorage.removeItem("clientName");
        window.location.href = "/client-login";
    };

    const menuItems = [
        { name: "Request New Project", icon: <FileText size={18} />, desc: "Submit proposals" },
        { name: "Track My Project", icon: <FileText size={18} />, desc: "Milestones & Progress" },
        { name: "Agreements", icon: <FileText size={18} />, desc: "View and sign contracts" },
        { name: "Review", icon: <Star size={18} />, desc: "Give your feedback" },
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
                .csb-logo-sub  { font-size:10px; color:#475569; margin-top:1px; }

                .csb-close-btn {
                    position:absolute; top:18px; right:14px;
                    width:32px; height:32px; border-radius:8px;
                    background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.05);
                    color:#64748b; display:flex; align-items:center; justify-content:center;
                    cursor:pointer; transition:all .2s;
                }
                .csb-close-btn:hover { background:rgba(239,68,68,0.1); color:#ef4444; border-color:rgba(239,68,68,0.2); }

                .csb-section-label {
                    font-size:10px; font-weight:700; color:#475569;
                    text-transform:uppercase; letter-spacing:.12em;
                    padding:0 14px 8px; margin-top:16px;
                }

                .csb-nav-btn {
                    width:100%; display:flex; align-items:center; gap:12px;
                    padding:11px 14px; border-radius:12px;
                    background:transparent; border:none; cursor:pointer;
                    font-family:'Inter',sans-serif; transition:all .2s;
                    text-align:left; position:relative;
                }
                .csb-nav-btn:hover { background:rgba(0,0,0,0.02); transform:translateX(2px); }
                .csb-nav-btn.active {
                    background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.08));
                    border:1px solid rgba(59,130,246,0.2);
                    box-shadow:0 10px 20px rgba(0,0,0,0.05);
                }
                .csb-nav-icon {
                    width:36px; height:36px; border-radius:10px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center;
                    background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.05);
                    transition:all .2s;
                }
                .csb-nav-btn.active .csb-nav-icon {
                    background:rgba(59,130,246,0.15); border-color:rgba(59,130,246,0.3); color:#3b82f6;
                }
                .csb-nav-btn:not(.active) .csb-nav-icon { color:#64748b; }
                .csb-nav-label { font-size:13px; font-weight:600; color:#334155; transition:color .2s; }
                .csb-nav-sub   { font-size:11px; color:#64748b; margin-top:2px; }
                .csb-nav-btn.active .csb-nav-label { color:#0f172a; }
                .csb-nav-btn:hover:not(.active) .csb-nav-label { color:#0f172a; }


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

                <button className="csb-close-btn" onClick={() => onClose && onClose()}>
                    <X size={18} />
                </button>
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
                            {/* Indicator bar removed as requested */}
                            <div className="csb-nav-icon">{item.icon}</div>
                            <div>
                                <div className="csb-nav-label">{item.name}</div>
                                <div className="csb-nav-sub">{item.desc}</div>
                            </div>
                        </button>
                    );
                })}
            </nav>

        </aside>
    );
}
