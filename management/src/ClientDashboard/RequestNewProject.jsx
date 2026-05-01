import React, { useState, useEffect } from "react";
import { FolderGit2, DollarSign, Clock, Plus, AlertCircle, Video,
         Trash2, CheckCircle, Hourglass, CalendarCheck, Zap, XCircle } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";

import { useNavigate } from "react-router-dom";
import RequestProjectModal from "./RequestProjectModal";
import { useLanguage } from "../context/LanguageContext";

export const useStatusCfg = () => {
    const { t } = useLanguage();
    return {
        'pending': { color: '#f59e0b', icon: <Hourglass size={14} />, label: t('status_pending') || "Pending" },
        'approved': { color: '#10b981', icon: <CheckCircle size={14} />, label: t('status_approved') || "Approved" },
        'rejected': { color: '#ef4444', icon: <XCircle size={14} />, label: t('status_rejected') || "Rejected" },
        'meeting_scheduled': { color: '#3b82f6', icon: <CalendarCheck size={14} />, label: t('status_meeting_scheduled') || "Meeting Scheduled" },
        'completed': { color: '#10b981', icon: <CheckCircle size={15} />, label: t('status_completed') || "Meeting Ended" }
    };
};

/* ─── Scoped CSS ─────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* ── Animations ── */
@keyframes rnpFadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
@keyframes rnpPulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes rnpSpin     { to{transform:rotate(360deg)} }
@keyframes rnpShimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes rnpBadgePop { 0%{transform:scale(.85)} 60%{transform:scale(1.08)} 100%{transform:scale(1)} }

/* ── Action Bar ── */
.rnp-action-bar {
    display:flex; justify-content:space-between; align-items:center;
    background:#ffffff; backdrop-filter:blur(12px);
    border-radius:18px; padding:20px 26px;
    border:1px solid #e2e8f0;
    margin-bottom:24px;
    box-shadow:0 8px 32px rgba(0,0,0,0.05);
}
.rnp-title {
    margin:0; font-size:20px; font-weight:800;
    background:linear-gradient(135deg,#60a5fa,#a78bfa);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.rnp-subtitle { margin:4px 0 0; font-size:13px; color:#64748b; }

/* ── New Request Button ── */
.rnp-btn-new {
    display:inline-flex; align-items:center; gap:8px;
    padding:10px 22px; border-radius:12px;
    background:linear-gradient(135deg,#3b82f6,#6366f1);
    color:white; border:none; font-weight:700; font-size:14px;
    cursor:pointer; font-family:'Inter',sans-serif;
    box-shadow:0 4px 16px rgba(99,102,241,0.4);
    transition:all .2s; white-space:nowrap;
}
.rnp-btn-new:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,0.5); }

/* ── Meeting Status Banner ── */
.rnp-meeting-banner {
    display:flex; align-items:center; gap:14px;
    background:#ffffff; backdrop-filter:blur(10px);
    border-radius:14px; padding:14px 20px;
    border:1px solid #e2e8f0;
    margin-bottom:22px;
}
.rnp-meeting-dot {
    width:10px; height:10px; border-radius:50%; flex-shrink:0;
    animation:rnpPulse 2s infinite;
}

/* ── Cards Grid ── */
.rnp-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(340px,1fr));
    gap:20px;
}

/* ── Project Card ── */
.rnp-card {
    background:#ffffff; backdrop-filter:blur(12px);
    border:1px solid #e2e8f0;
    border-radius:20px; overflow:hidden;
    transition:all .28s; font-family:'Inter',sans-serif;
    animation:rnpFadeUp .35s ease-out both;
    display:flex; flex-direction:column;
    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}
.rnp-card:hover {
    transform:translateY(-4px);
    box-shadow:0 12px 30px rgba(0,0,0,0.08);
    border-color:rgba(96,165,250,0.4);
}

/* Card accent bar at top */
.rnp-card-accent {
    height:3px; width:100%;
    background:linear-gradient(90deg,#3b82f6,#8b5cf6,#10b981);
    background-size:200% auto;
    animation:rnpShimmer 3s linear infinite;
}

/* Card header */
.rnp-card-head {
    padding:20px 20px 0;
    display:flex; justify-content:space-between;
    align-items:flex-start; gap:12px;
}
.rnp-card-icon-wrap {
    width:46px; height:46px; border-radius:14px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.2);
    color:#60a5fa; transition:all .2s;
}
.rnp-card:hover .rnp-card-icon-wrap {
    background:rgba(59,130,246,0.2); box-shadow:0 0 0 4px rgba(59,130,246,0.1);
}
.rnp-card-title { font-size:16px; font-weight:700; color:#0f172a; margin:0 0 4px; }
.rnp-card-desc  { font-size:12px; color:#64748b; margin:0; line-height:1.5; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; }

/* Status badge */
.rnp-badge {
    display:inline-flex; align-items:center; gap:6px;
    padding:4px 12px; border-radius:999px;
    font-size:11px; font-weight:700;
    white-space:nowrap; flex-shrink:0;
    animation:rnpBadgePop .3s ease-out;
}

/* Delete btn */
.rnp-delete-btn {
    display:inline-flex; align-items:center; gap:5px;
    padding:5px 11px; background:rgba(239,68,68,0.1); color:#f87171;
    border:1px solid rgba(239,68,68,0.2); border-radius:9px;
    font-weight:700; font-size:12px; cursor:pointer;
    transition:all .18s; font-family:'Inter',sans-serif; flex-shrink:0;
}
.rnp-delete-btn:hover { background:rgba(239,68,68,0.18); transform:scale(1.04); }

/* Metrics row */
.rnp-metrics {
    display:grid; grid-template-columns:1fr 1fr;
    gap:10px; padding:14px 20px;
    border-top:1px solid #e2e8f0;
    border-bottom:1px solid #e2e8f0;
    margin-top:16px;
}
.rnp-metric {
    display:flex; align-items:flex-start; gap:10px;
    background:#f8fafc; border-radius:10px;
    padding:10px 12px; border:1px solid #e2e8f0;
}
.rnp-metric-icon { margin-top:1px; flex-shrink:0; }
.rnp-metric-lbl { font-size:10px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:.06em; }
.rnp-metric-val { font-size:14px; font-weight:700; color:#0f172a; margin-top:2px; }

/* Requirements panel */
.rnp-requirements {
    margin:0 20px 16px;
    padding:12px 14px;
    background:#f8fafc;
    border-radius:12px; border:1px solid #e2e8f0;
    border-left:3px solid rgba(96,165,250,0.4);
}
.rnp-requirements-lbl { font-size:10px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:.06em; margin-bottom:6px; }
.rnp-requirements-text { font-size:13px; color:#475569; line-height:1.6; margin:0; white-space:pre-line; }

/* Admin message */
.rnp-admin-msg {
    margin:0 20px 16px;
    display:flex; gap:10px; align-items:flex-start;
    padding:12px 14px;
    background:rgba(245,158,11,0.07);
    border:1px solid rgba(245,158,11,0.2);
    border-radius:12px; border-left:3px solid #f59e0b;
}
.rnp-admin-msg-title { font-size:11px; font-weight:700; color:#f59e0b; text-transform:uppercase; letter-spacing:.05em; margin:0 0 4px; }
.rnp-admin-msg-text  { font-size:13px; color:#94a3b8; margin:0; line-height:1.5; }

/* Meeting details panel */
.rnp-meeting-panel {
    margin:0 20px 16px;
    padding:14px 16px;
    border-radius:14px; border:1px solid;
}
.rnp-meeting-panel-title { font-weight:700; font-size:13px; margin:0 0 10px; }
.rnp-meeting-row { display:flex; align-items:center; gap:8px; margin-bottom:5px; font-size:13px; color:#64748b; }
.rnp-meeting-row b { color:#0f172a; }
.rnp-meeting-row:last-child { margin-bottom:0; }

/* Join Zoom button */
.rnp-zoom-btn {
    display:flex; align-items:center; justify-content:center; gap:8px;
    width:100%; padding:12px;
    background:linear-gradient(135deg,#2563eb,#4f46e5);
    color:white; border:none; border-radius:10px;
    font-weight:700; font-size:14px; cursor:pointer;
    box-shadow:0 4px 16px rgba(37,99,235,0.4);
    transition:all .2s; font-family:'Inter',sans-serif; margin-top:10px;
}
.rnp-zoom-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(37,99,235,0.5); }

/* Request meeting button */
.rnp-meeting-btn {
    display:flex; align-items:center; justify-content:center; gap:8px;
    width:100%; padding:11px;
    background:linear-gradient(135deg,#7c3aed,#a855f7);
    color:white; border:none; border-radius:10px;
    font-weight:700; font-size:14px; cursor:pointer;
    box-shadow:0 4px 14px rgba(124,58,237,0.35);
    transition:all .2s; font-family:'Inter',sans-serif;
}
.rnp-meeting-btn:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(124,58,237,0.5); }
.rnp-meeting-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }

/* Waiting chip */
.rnp-waiting-chip {
    display:flex; align-items:center; justify-content:center; gap:8px;
    margin:0 0 16px; padding:10px 14px;
    background:rgba(167,139,250,0.08);
    border:1px solid rgba(167,139,250,0.2);
    border-radius:10px; color:#a78bfa;
    font-size:13px; font-weight:600;
}

/* Card footer (action area) */
.rnp-card-footer { padding:0 20px 20px; margin-top:auto; }

/* Empty state */
.rnp-empty {
    text-align:center; padding:72px 32px;
    background:#ffffff; backdrop-filter:blur(10px);
    border-radius:20px; border:1px solid #e2e8f0;
}
.rnp-empty-icon { color:#334155; margin:0 auto 18px; display:block; }
.rnp-empty-title { font-size:20px; font-weight:800; color:#0f172a; margin:0 0 8px; }
.rnp-empty-sub   { font-size:14px; color:#64748b; margin:0 0 24px; line-height:1.6; }

/* Loading */
.rnp-spinner {
    width:34px; height:34px;
    border:3px solid rgba(255,255,255,0.07); border-top-color:#60a5fa;
    border-radius:50%; animation:rnpSpin .8s linear infinite;
    margin:0 auto 16px;
}
.rnp-loading { text-align:center; padding:64px; color:#475569; font-size:14px; }
`;

export default function RequestNewProject() {
    const { t } = useLanguage();
    const STATUS_CFG = useStatusCfg();
    const navigate = useNavigate();
    const [requests, setRequests]           = useState([]);
    const [isModalOpen, setIsModalOpen]     = useState(false);
    const [loading, setLoading]             = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("clientAuthToken");
            const res = await axios.get(`${API_BASE_URL}/api/project-requests/my-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch project requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleRequestMeeting = async (id) => {
        setActionLoading(id);
        try {
            const token = localStorage.getItem("clientAuthToken");
            await axios.put(`${API_BASE_URL}/api/project-requests/${id}/request-meeting`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRequests();
        } catch (err) {
            console.error("Failed to request meeting", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('confirm_delete') || "Delete this project request permanently?")) return;
        setActionLoading(id + "-del");
        try {
            const token = localStorage.getItem("clientAuthToken");
            await axios.delete(`${API_BASE_URL}/api/project-requests/${id}/my-request`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRequests();
        } catch (err) {
            console.error("Failed to delete request", err);
        } finally {
            setActionLoading(null);
        }
    };

    /* Meeting status summary */
    const meetingRequest = requests.find(r =>
        ["meeting_requested","meeting_scheduled","completed"].includes(r.status)
    );
    const meetingStatusText = meetingRequest?.status === "meeting_requested"  ? "Awaiting admin scheduling"
                           : meetingRequest?.status === "meeting_scheduled" ? "Meeting confirmed — check details below"
                           : meetingRequest?.status === "completed"         ? "Meeting completed"
                           : null;

    return (
        <>
            <style>{css}</style>
            <div style={{ fontFamily:"'Inter',sans-serif" }}>

                {/* ── Action Bar ── */}
                <div className="rnp-action-bar">
                    <div>
                        <h2 className="rnp-title">{t('project_requests')}</h2>
                        <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
                            {t('track_requests_desc') || "Track your project proposals and schedule meetings with our team."}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="rnp-btn-new"
                        style={{ padding: "10px 20px" }}
                    >
                        <Plus size={18} /> {t('request_project_btn') || "Request New Project"}
                    </button>
                </div>

                {/* ── Loading ── */}
                {loading && (
                    <div className="rnp-loading">
                        <div className="rnp-spinner" />
                        Loading your requests…
                    </div>
                )}

                {/* ── Empty State ── */}
                {!loading && requests.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                        <AlertCircle size={40} style={{ color: "#334155", margin: "0 auto 12px" }} />
                        <p style={{ fontWeight: "700", color: "#94a3b8" }}>{t('no_requests_found') || "No project requests yet."}</p>
                        <p style={{ color: "#64748b", fontSize: "14px" }}>{t('request_initial_desc') || "Start by requesting a new project to collaborate with us."}</p>
                    </div>
                )}

                {/* ── Meeting Status Banner ── */}
                {!loading && meetingStatusText && (
                    <div className="rnp-meeting-banner" style={{ 
                        background: meetingRequest?.status === "completed" ? "rgba(16,185,129,0.1)" : "rgba(15,23,42,0.7)",
                        borderColor: meetingRequest?.status === "completed" ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.07)"
                    }}>
                        <div className="rnp-meeting-dot" style={{
                            background: meetingRequest?.status === "completed" ? "#10b981"
                                      : meetingRequest?.status === "meeting_scheduled" ? "#60a5fa" : "#a78bfa",
                            boxShadow: `0 0 12px ${meetingRequest?.status === "completed" ? "#10b981"
                                      : meetingRequest?.status === "meeting_scheduled" ? "#60a5fa" : "#a78bfa"}`
                        }} />
                        <div>
                            <p style={{ margin:0, fontSize:"11px", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".08em" }}>Current Meeting Status</p>
                            <p style={{ margin:"3px 0 0", fontSize:"15px", fontWeight:800, color: meetingRequest?.status === "completed" ? "#10b981" : "#0f172a" }}>{meetingStatusText}</p>
                        </div>
                        {meetingRequest?.status === "completed" ? <CheckCircle size={20} color="#10b981" style={{ marginLeft:"auto" }} /> : <Zap size={18} color="#f59e0b" style={{ marginLeft:"auto" }} />}
                    </div>
                )}

                {/* ── Cards Grid ── */}
                {!loading && requests.length > 0 && (
                    <div className="rnp-grid">
                        {requests.map((req, i) => {
                            const sc = STATUS_CFG[req.status] || { label:req.status, color:"#64748b", icon:null };
                            return (
                                <div key={req._id} className="rnp-card" style={{ animationDelay:`${i*0.06}s`, borderColor: req.status === "rejected" ? "rgba(239,68,68,0.15)" : undefined }}>
                                    {/* Accent bar */}
                                    <div className="rnp-card-accent" />

                                    {/* Header */}
                                    <div className="rnp-card-head">
                                        <div style={{ display:"flex", gap:"13px", alignItems:"flex-start", flex:1, minWidth:0 }}>
                                            <div className="rnp-card-icon-wrap">
                                                <FolderGit2 size={22} />
                                            </div>
                                            <div style={{ flex:1, minWidth:0 }}>
                                                <h3 className="rnp-card-title">{req.title}</h3>
                                                <p className="rnp-card-desc">{req.description}</p>
                                            </div>
                                        </div>
                                        <button className="rnp-delete-btn"
                                            onClick={() => handleDelete(req._id)}
                                            disabled={actionLoading === req._id + "-del"}
                                            title={t('delete')}
                                            style={{ color:"#f87171" }}>
                                            <Trash2 size={12} />
                                            {actionLoading === req._id + "-del" ? "…" : ""}
                                        </button>
                                    </div>

                                    {/* Status badge row */}
                                    <div style={{ padding:"10px 20px 0", display:"flex", alignItems:"center", gap:"8px" }}>
                                        <span className="rnp-badge" style={{ color:sc.color, background:sc.color.replace(')', ',0.12)').replace('#', 'rgba(') + (sc.color.length === 7 ? ',0.12)' : ''), border:`1px solid ${sc.color}4d` }}>
                                            {sc.icon} {sc.label}
                                        </span>
                                        {req.createdAt && (
                                            <span style={{ fontSize:"11px", color:"#475569", marginLeft:"auto" }}>
                                                {new Date(req.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                                            </span>
                                        )}
                                    </div>

                                    {/* Metrics */}
                                    <div className="rnp-metrics">
                                        <div className="rnp-metric">
                                            <Clock size={15} color="#60a5fa" className="rnp-metric-icon" />
                                            <div>
                                                <p className="rnp-metric-lbl">Deadline</p>
                                                <p className="rnp-metric-val">{req.deadline || "—"}</p>
                                            </div>
                                        </div>
                                        <div className="rnp-metric">
                                            <DollarSign size={15} color="#10b981" className="rnp-metric-icon" />
                                            <div>
                                                <p className="rnp-metric-lbl">Budget</p>
                                                <p className="rnp-metric-val">₹{req.budget || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    {req.requirements && (
                                        <div className="rnp-requirements">
                                            <p className="rnp-requirements-lbl">{t('requirements_services')}</p>
                                            <p className="rnp-requirements-text">{req.requirements}</p>
                                        </div>
                                    )}

                                    {/* Admin Message */}
                                    {req.adminMessage && (
                                        <div className="rnp-admin-msg">
                                            <AlertCircle size={15} color="#f59e0b" style={{ flexShrink:0, marginTop:2 }} />
                                            <div>
                                                <p className="rnp-admin-msg-title">{t('admin_response') || "Admin Response"}</p>
                                                <p className="rnp-admin-msg-text">"{req.adminMessage}"</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* meeting details panel */}
                                    {(req.status === "meeting_scheduled" || req.status === "completed") && req.meetingDate && (() => {
                                        const isDone = req.status === "completed";
                                        return (
                                            <div className="rnp-meeting-panel" style={{
                                                borderColor: isDone ? "rgba(16,185,129,0.25)" : "rgba(96,165,250,0.25)",
                                                background:  isDone ? "rgba(16,185,129,0.06)" : "rgba(59,130,246,0.06)"
                                            }}>
                                                <p className="rnp-meeting-panel-title" style={{ color: isDone ? "#10b981" : "#60a5fa" }}>
                                                    {isDone ? "✓ Meeting Completed" : "📅 Your Meeting"}
                                                </p>
                                                <div className="rnp-meeting-row"><b>Date:</b> {req.meetingDate}</div>
                                                <div className="rnp-meeting-row"><b>Time:</b> {req.meetingTime}</div>
                                                {req.meetingMessage && (
                                                    <div className="rnp-meeting-row" style={{ fontStyle:"italic", marginTop:"6px", color:"#64748b" }}>
                                                        "{req.meetingMessage}"
                                                    </div>
                                                )}
                                                {req.status === "meeting_scheduled" && req.zoomMeetingId && (
                                                    <button className="rnp-zoom-btn"
                                                        onClick={() => navigate(`/video-room/req-${req._id}?role=client&meetingId=${req.zoomMeetingId}&name=${encodeURIComponent(localStorage.getItem("clientName")||"Client")}&email=${encodeURIComponent(localStorage.getItem("clientEmail")||"")}`)}>
                                                        <Video size={16} /> Join Zoom Meeting
                                                    </button>
                                                )}
                                                {req.status === "meeting_scheduled" && !req.zoomMeetingId && req.meetingLocation && (
                                                    <a href={req.meetingLocation.startsWith("http") || req.meetingLocation.startsWith("/") ? req.meetingLocation : `https://${req.meetingLocation}`}
                                                        target="_blank" rel="noreferrer"
                                                        style={{ marginTop:"10px", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", padding:"10px", background:"rgba(96,165,250,0.1)", color:"#60a5fa", border:"1px solid rgba(96,165,250,0.25)", borderRadius:"10px", fontWeight:600, fontSize:"13px", textDecoration:"none" }}>
                                                        <Video size={14} /> Open Meeting Link
                                                    </a>
                                                )}
                                                {isDone && (
                                                    <div style={{ 
                                                        marginTop:"10px", display:"flex", alignItems:"center", justifyContent:"center", 
                                                        gap:"8px", padding:"12px", background:"rgba(16,185,129,0.08)", 
                                                        color:"#10b981", border:"1px solid rgba(16,185,129,0.2)", 
                                                        borderRadius:"10px", fontWeight:700, fontSize:"14px" 
                                                    }}>
                                                        <CheckCircle size={18} /> Zoom meeting ended
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Card footer actions */}
                                    <div className="rnp-card-footer">
                                        {/* Request Meeting */}
                                        {["approved","completed","meeting_scheduled"].includes(req.status) && (
                                            <button className="rnp-meeting-btn"
                                                onClick={() => handleRequestMeeting(req._id)}
                                                disabled={actionLoading === req._id}>
                                                <Video size={15} />
                                                {actionLoading === req._id ? "..." : t('request_meeting')}
                                            </button>
                                        )}

                                        {/* Awaiting scheduling */}
                                        {req.status === "meeting_requested" && (
                                            <div className="rnp-waiting-chip">
                                                <Hourglass size={14} />
                                                {t('waiting_for_admin') || "Waiting for admin to schedule the meeting…"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <RequestProjectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchRequests}
                />
            </div>
        </>
    );
}
