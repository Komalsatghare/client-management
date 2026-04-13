import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Search, MapPin, Calendar, Clock, DollarSign, CheckCircle, Hourglass, TrendingUp, ChevronRight, Layout, Zap, ArrowRight, ShieldCheck, FileText, CheckCircle2, Circle, Building2, Activity } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@keyframes ctpFade   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
@keyframes ctpPulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.9)} }
@keyframes ctpSpin   { to{transform:rotate(360deg)} }
@keyframes ctpShine  { 0%{left:-100%} 100%{left:150%} }

.ctp-root { font-family:'Inter',sans-serif; color:#e2e8f0; }

/* Project section */
.ctp-project { margin-bottom:32px; animation:ctpFade .35s ease-out both; }

/* Header card */
.ctp-proj-header {
    display:flex; align-items:center; gap:16px;
    background:rgba(15,23,42,0.85); backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.07); border-radius:18px;
    padding:22px 26px; margin-bottom:28px;
    box-shadow:0 8px 28px rgba(0,0,0,0.3);
    position:relative; overflow:hidden;
}
.ctp-proj-header::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#3b82f6,#8b5cf6,#10b981);
}
.ctp-proj-icon {
    width:52px; height:52px; border-radius:15px; flex-shrink:0;
    background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.2);
    display:flex; align-items:center; justify-content:center; color:#60a5fa;
}
.ctp-proj-name { font-size:20px; font-weight:800; color:#f1f5f9; margin:0 0 4px; }
.ctp-proj-status {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 12px; border-radius:999px; font-size:11px; font-weight:700;
}

/* Timeline container */
.ctp-timeline { position:relative; padding-left:32px; }
@media(min-width:768px) { .ctp-timeline { padding-left:0; } }

.ctp-line {
    position:absolute; left:39px; top:0; bottom:0; width:2px;
    background:linear-gradient(to bottom,rgba(59,130,246,0.5),rgba(139,92,246,0.2));
}
@media(min-width:768px) { .ctp-line { left:50%; margin-left:-1px; } }

.ctp-list { display:flex; flex-direction:column; gap:36px; }

/* Timeline item */
.ctp-item { position:relative; display:flex; align-items:center; width:100%; animation:ctpFade .4s ease-out both; }
@media(min-width:768px) {
    .ctp-item { justify-content:space-between; }
    .ctp-item.even { flex-direction:row-reverse; }
}

/* Node */
.ctp-node {
    position:absolute; left:0; transform:translateX(-50%);
    width:36px; height:36px; border-radius:50%;
    background:rgba(15,23,42,0.95); border:2px solid rgba(255,255,255,0.1);
    display:flex; align-items:center; justify-content:center;
    color:#475569; z-index:10; transition:all .25s;
}
@media(min-width:768px) { .ctp-node { left:50%; } }
.ctp-node.completed { border-color:#10b981; color:#10b981; box-shadow:0 0 0 5px rgba(16,185,129,0.12),0 0 16px rgba(16,185,129,0.2); }
.ctp-node.in-progress { border-color:#3b82f6; color:#3b82f6; box-shadow:0 0 0 5px rgba(59,130,246,0.12),0 0 16px rgba(59,130,246,0.2); }

.ctp-pulse { width:10px; height:10px; background:#3b82f6; border-radius:50%; animation:ctpPulse 1.8s ease-in-out infinite; box-shadow:0 0 10px rgba(59,130,246,0.7); }

/* Content card */
.ctp-content {
    margin-left:52px;
    background:rgba(15,23,42,0.8); backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,0.07); border-radius:16px;
    padding:18px 20px; transition:all .25s;
    position:relative; overflow:hidden;
}
@media(min-width:768px) { .ctp-content { margin-left:0; width:calc(50% - 52px); } }
.ctp-content:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(0,0,0,0.4); border-color:rgba(96,165,250,0.18); }
.ctp-content.completed  { border-color:rgba(16,185,129,0.2);  background:rgba(16,185,129,0.04); }
.ctp-content.in-progress { border-color:rgba(59,130,246,0.25); background:rgba(59,130,246,0.05); box-shadow:0 4px 16px rgba(59,130,246,0.08); }

/* Shine sweep on active */
.ctp-content.in-progress::after {
    content:''; position:absolute; top:0; left:-100%; width:50%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);
    animation:ctpShine 3s linear infinite;
}

.ctp-content-title { font-size:15px; font-weight:700; margin:0 0 6px; }
.ctp-content.completed   .ctp-content-title { color:#f1f5f9; }
.ctp-content.in-progress .ctp-content-title { color:#93c5fd; }
.ctp-content.pending     .ctp-content-title { color:#64748b; }

.ctp-content-date {
    display:flex; align-items:center; gap:6px;
    font-size:12px; font-weight:600; color:#475569;
    margin:0 0 10px;
}
.ctp-content.in-progress .ctp-content-date { color:#60a5fa; }

.ctp-content-desc { font-size:13px; color:#64748b; line-height:1.65; margin:0; }

/* Step status chip */
.ctp-step-chip {
    display:inline-flex; align-items:center; gap:5px;
    padding:2px 10px; border-radius:999px; font-size:10px; font-weight:700;
    margin-bottom:8px;
}

/* Add steps */
.ctp-add-btn {
    display:inline-flex; align-items:center; gap:8px;
    padding:9px 18px; margin-top:8px;
    background:rgba(255,255,255,0.04); color:#475569;
    border:1.5px dashed rgba(255,255,255,0.1); border-radius:10px;
    font-size:13px; cursor:pointer; transition:all .2s;
    font-family:'Inter',sans-serif;
}
.ctp-add-btn:hover { background:rgba(59,130,246,0.08); color:#60a5fa; border-color:rgba(59,130,246,0.35); }

/* Empty + loading */
.ctp-empty { text-align:center; padding:64px 32px; background:rgba(15,23,42,0.7); border-radius:18px; border:1px solid rgba(255,255,255,0.06); }
.ctp-spinner { width:32px; height:32px; border:3px solid rgba(255,255,255,0.07); border-top-color:#60a5fa; border-radius:50%; animation:ctpSpin .8s linear infinite; margin:0 auto 14px; }
.ctp-loading { text-align:center; padding:64px; color:#475569; font-size:14px; }
`;

const STATUS_MAP = {
    Completed:   { cls:"completed",   c:"#10b981", b:"rgba(16,185,129,0.12)",  bdr:"rgba(16,185,129,0.3)"  },
    "In Progress":{ cls:"in-progress", c:"#60a5fa", b:"rgba(96,165,250,0.12)",  bdr:"rgba(96,165,250,0.3)"  },
    Pending:     { cls:"pending",     c:"#f59e0b", b:"rgba(245,158,11,0.12)",  bdr:"rgba(245,158,11,0.3)"  },
};
const PROJ_STATUS = {
    Active:    { c:"#10b981", b:"rgba(16,185,129,0.12)", bdr:"rgba(16,185,129,0.3)" },
    Completed: { c:"#60a5fa", b:"rgba(96,165,250,0.12)", bdr:"rgba(96,165,250,0.3)" },
    "On Hold": { c:"#f59e0b", b:"rgba(245,158,11,0.12)", bdr:"rgba(245,158,11,0.3)" },
    Pending:   { c:"#94a3b8", b:"rgba(148,163,184,0.12)",bdr:"rgba(148,163,184,0.3)"},
};

export default function TrackProject() {
    const { t } = useLanguage();
    const [search, setSearch]   = useState("");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const clientId = localStorage.getItem("clientId");

    useEffect(() => {
        const fetchMyProjects = async () => {
            try {
                if (!clientId) { setError("Client ID not found. Please log in again."); setLoading(false); return; }
                const token = localStorage.getItem("authToken");
                const res = await axios.get(`${API_BASE_URL}/api/clients/${clientId}/projects`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(res.data);
                setError(null);
            } catch (err) {
                console.error("Failed to load tracking data:", err);
                setError(t('fail_load_projects') || "Failed to load your projects.");
            } finally { setLoading(false); }
        };
        fetchMyProjects();
    }, [clientId]);

    if (loading) return (
        <>
            <style>{css}</style>
            <div className="ctp-loading"><div className="ctp-spinner" />{t('loading_timeline') || "Loading project timeline…"}</div>
        </>
    );

    if (error || projects.length === 0) return (
        <>
            <style>{css}</style>
            <div className="ctp-empty">
                {error
                    ? <><Activity size={40} style={{ color:"#ef4444", margin:"0 auto 14px", display:"block" }} /><p style={{ color:"#f87171", fontWeight:700, margin:0 }}>{t(error) || error}</p></>
                    : <><Building2 size={44} style={{ color:"#334155", margin:"0 auto 16px", display:"block" }} /><p style={{ fontWeight:700, color:"#475569", margin:"0 0 8px", fontSize:"18px" }}>{t('no_projects_assigned') || "No Projects Assigned Yet"}</p><p style={{ color:"#334155", margin:0, fontSize:"13px" }}>{t('no_projects_assigned_desc') || "When an admin assigns a project to you, its timeline will appear here."}</p></>
                }
            </div>
        </>
    );

    return (
        <>
            <style>{css}</style>
            <div className="ctp-root">
                <div className="tp-header">
                    <div className="tp-header-content">
                        <h1 className="tp-title">{t('track_my_project') || "Project Tracking Center"}</h1>
                        <p className="tp-subtitle">{t('track_project_desc') || "Real-time updates on your architecture and construction milestones."}</p>
                    </div>
                    <div className="tp-search-box">
                        <Search size={18} className="tp-search-icon" />
                        <input 
                            type="text" 
                            placeholder={t('search_project_placeholder') || "Search by Project ID or Name…"}
                            className="tp-search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                {projects.map((project, pi) => {
                    const ps = PROJ_STATUS[project.status] || PROJ_STATUS["Pending"];
                    const completedCount = (project.progress||[]).filter(s => s.status === "Completed").length;
                    const totalCount = (project.progress||[]).length;
                    const pct = totalCount ? Math.round((completedCount/totalCount)*100) : 0;

                    return (
                        <div key={project._id} className="ctp-project" style={{ animationDelay:`${pi*0.08}s` }}>
                            {/* Project Header */}
                            <div className="ctp-proj-header">
                                <div className="ctp-proj-icon"><Building2 size={26} /></div>
                                <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", marginBottom:"8px" }}>
                                        <h2 className="ctp-proj-name">{project.name}</h2>
                                        <span className="ctp-proj-status" style={{ color:ps.c, background:ps.b, border:`1px solid ${ps.bdr}` }}>{project.status}</span>
                                    </div>
                                    {/* Progress bar */}
                                    <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                                        <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.07)", borderRadius:"999px", overflow:"hidden" }}>
                                            <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#3b82f6,#8b5cf6)", borderRadius:"999px", transition:"width .6s ease", boxShadow:"0 0 8px rgba(96,165,250,0.4)" }} />
                                        </div>
                                        <span style={{ fontSize:"12px", fontWeight:700, color: pct===100?"#10b981":"#60a5fa", flexShrink:0 }}>{pct}% {t('complete')}</span>
                                        <span style={{ fontSize:"11px", color:"#475569", flexShrink:0 }}>{completedCount}/{totalCount} {t('steps')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="ctp-timeline">
                                <div className="ctp-line" />
                                <div className="ctp-list">
                                    {(!project.progress || project.progress.length === 0) ? (
                                        <p style={{ paddingLeft:"2rem", color:"#475569", fontStyle:"italic", fontSize:"13px" }}>
                                            {t('no_milestones_recorded') || "No milestones added for this project yet."}
                                        </p>
                                    ) : (
                                        project.progress.map((step, idx) => {
                                            const sm = STATUS_MAP[step.status] || STATUS_MAP["Pending"];
                                            const isEven = idx % 2 === 0;
                                            return (
                                                <div key={idx} className={`ctp-item${isEven?" even":""}`} style={{ animationDelay:`${idx*0.06}s` }}>
                                                    {/* Node */}
                                                    <div className={`ctp-node ${sm.cls}`}>
                                                        {sm.cls === "completed"   ? <CheckCircle2 size={16} /> :
                                                         sm.cls === "in-progress" ? <div className="ctp-pulse" /> :
                                                                                    <Circle size={14} />}
                                                    </div>
                                                    {/* Card */}
                                                    <div className={`ctp-content ${sm.cls}`}>
                                                        <div className="ctp-step-chip" style={{ color:sm.c, background:sm.b, border:`1px solid ${sm.bdr}` }}>
                                                            {step.status}
                                                        </div>
                                                        <h3 className="ctp-content-title">{step.title}</h3>
                                                        {step.date && (
                                                            <p className="ctp-content-date">
                                                                <Clock size={12} />
                                                                {new Date(step.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                                                            </p>
                                                        )}
                                                        <p className="ctp-content-desc">{step.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Add steps button */}
                                <div style={{ paddingTop:"22px", paddingLeft:"30px" }}>
                                    <button className="ctp-add-btn" onClick={() => alert(t('request_extension_msg') || "Request project extensions from the admin.")}>
                                        <Circle size={14} /> {t('request_milestones_btn') || "Request more milestones"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
