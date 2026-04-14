import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";
import { API_BASE_URL } from "../config";
import {
    Search, CheckCircle, XCircle, AlertCircle, Calendar,
    User, FileText, Video, Trash2, Clock, DollarSign, Edit3
} from "lucide-react";

export default function ProjectRequests() {
    const { t } = useLanguage();
    
    const STATUS_CONFIG = {
        pending:           { label: t('pending'),           color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
        approved:          { label: t('approved'),          color: "#065f46", bg: "#d1fae5", border: "#6ee7b7" },
        rejected:          { label: t('rejected'),          color: "#991b1b", bg: "#fee2e2", border: "#fecaca" },
        meeting_requested: { label: t('meeting_requested'), color: "#5b21b6", bg: "#ede9fe", border: "#c4b5fd" },
        meeting_scheduled: { label: t('meeting_scheduled'), color: "#1e40af", bg: "#dbeafe", border: "#93c5fd" },
        completed:         { label: t('completed'),         color: "#065f46", bg: "#d1fae5", border: "#6ee7b7" },
    };

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [rejectState, setRejectState] = useState({ id: null, message: '' });
    const [scheduleForm, setScheduleForm] = useState({ id: null, date: '', time: '', message: '' });

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get(`${API_BASE_URL}/api/project-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (error) {
            console.error("Failed to fetch project requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const getToken = () => localStorage.getItem('authToken');

    const handleApprove = async (id) => {
        setActionLoading(id + '-approve');
        try {
            await axios.put(`${API_BASE_URL}/api/project-requests/${id}/status`,
                { status: 'approved', adminMessage: 'Your project request has been approved.' },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            fetchRequests();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleReject = async () => {
        const { id, message } = rejectState;
        setActionLoading(id + '-reject');
        try {
            await axios.put(`${API_BASE_URL}/api/project-requests/${id}/status`,
                { status: 'rejected', adminMessage: message },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setRejectState({ id: null, message: '' });
            fetchRequests();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        const { id, date, time, message } = scheduleForm;
        try {
            setActionLoading(id + '-sched');
            await axios.put(`${API_BASE_URL}/api/project-requests/${id}/schedule-meeting`,
                { meetingDate: date, meetingTime: time, meetingLocation: 'Online / Zoom', meetingMessage: message },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            try {
                const startTimeISO = new Date(`${date}T${time}:00`).toISOString();
                await axios.post(`${API_BASE_URL}/api/zoom/create-meeting`, {
                    requestId: id,
                    topic: `Project Discussion: ${requests.find(r => r._id === id)?.title || 'Discussion'}`,
                    startTime: startTimeISO,
                    agenda: message || 'Meeting to discuss project details and requirements.'
                }, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
            } catch (zoomErr) {
                console.error("Zoom Creation Error:", zoomErr.response?.data || zoomErr.message);
                alert("Internal schedule saved, but Zoom meeting creation failed. Please check Zoom App settings.");
            }

            setScheduleForm({ id: null, date: '', time: '', message: '' });
            fetchRequests();
        } catch (e) {
            console.error("Schedule Error:", e);
            alert("Failed to save schedule.");
        }
        finally { setActionLoading(null); }
    };

    const handleComplete = async (id) => {
        setActionLoading(id + '-done');
        try {
            await axios.put(`${API_BASE_URL}/api/project-requests/${id}/complete`, {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            fetchRequests();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this request permanently?')) return;
        setActionLoading(id + '-del');
        try {
            await axios.delete(`${API_BASE_URL}/api/project-requests/${id}`,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            fetchRequests();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const openScheduleForm = (req) => {
        setScheduleForm({
            id: req._id,
            date: req.meetingDate || '',
            time: req.meetingTime || '',
            message: req.meetingMessage || ''
        });
    };

    const getStatusBadge = (status) => {
        const s = STATUS_CONFIG[status] || { label: status, color: "#374151", bg: "#f3f4f6", border: "#d1d5db" };
        return (
            <span style={{
                padding: "5px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
                color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}`, whiteSpace: "nowrap"
            }}>
                {s.label}
            </span>
        );
    };

    const filteredRequests = requests.filter(req =>
        (req.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (req.clientId?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ padding: "32px", maxWidth: "960px", margin: "0 auto" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                    <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#1e293b", margin: 0 }}>{t('project_requests')}</h1>
                    <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
                        {t('manage_proposals')}
                    </p>
                </div>
                <div style={{ position: "relative" }}>
                    <Search style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={16} />
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            paddingLeft: "34px", paddingRight: "14px", paddingTop: "9px", paddingBottom: "9px",
                            border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "14px",
                            outline: "none", width: "260px", background: "white"
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>{t('loading')}</div>
            ) : filteredRequests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    <AlertCircle size={40} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
                    <p style={{ fontWeight: "700", color: "#475569" }}>{t('no_requests_found') || "No project requests found"}</p>
                    <p style={{ color: "#94a3b8", fontSize: "14px" }}>{t('no_search_match') || "No project requests match your search."}</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {filteredRequests.map(req => (
                        <div key={req._id} style={{
                            background: "white", borderRadius: "16px",
                            border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            overflow: "hidden"
                        }}>

                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "14px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{
                                        width: "38px", height: "38px", borderRadius: "50%", background: "#2563eb",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                    }}>
                                        <User size={18} color="white" />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>
                                            {req.clientId?.name || t('unknown_client') || "Unknown Client"}
                                        </p>
                                        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                                            {req.clientId?.email}
                                            {req.clientId?.phone ? ` · ${req.clientId.phone}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    {getStatusBadge(req.status)}
                                    <button
                                        onClick={() => handleDelete(req._id)}
                                        disabled={actionLoading === req._id + '-del'}
                                        title={t('delete')}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "5px",
                                            padding: "6px 12px", background: "#fff1f2", color: "#e11d48",
                                            border: "1px solid #fecdd3", borderRadius: "8px",
                                            fontWeight: "700", fontSize: "13px", cursor: "pointer"
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        {actionLoading === req._id + '-del' ? '...' : t('delete')}
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: "20px" }}>

                                <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>
                                    {req.title}
                                </h3>
                                <p style={{ margin: "0 0 14px", fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
                                    {req.description}
                                </p>

                                <div style={{ display: "flex", gap: "28px", marginBottom: "16px", flexWrap: "wrap" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <DollarSign size={15} color="#94a3b8" />
                                        <div>
                                            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>{t('budget')}</p>
                                            <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#334155" }}>₹{req.budget}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Clock size={15} color="#94a3b8" />
                                        <div>
                                            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>{t('deadline')}</p>
                                            <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#334155" }}>{req.deadline}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Calendar size={15} color="#94a3b8" />
                                        <div>
                                            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>{t('received')}</p>
                                            <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#334155" }}>
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {req.requirements && (
                                    <div style={{
                                        marginBottom: "14px", padding: "14px 16px",
                                        background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
                                            <FileText size={15} color="#1d4ed8" />
                                            <p style={{ margin: 0, fontWeight: "700", fontSize: "13px", color: "#1d4ed8" }}>
                                                {t('requirements_needed')}
                                            </p>
                                        </div>
                                        <p style={{ margin: 0, fontSize: "13px", color: "#1e40af", lineHeight: "1.7", whiteSpace: "pre-line" }}>
                                            {req.requirements}
                                        </p>
                                    </div>
                                )}

                                {req.status === 'rejected' && req.adminMessage && (
                                    <div style={{ padding: "10px 14px", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "10px", fontSize: "13px", marginBottom: "10px" }}>
                                        <strong style={{ color: "#be123c" }}>{t('rejection_reason')}: </strong>
                                        <span style={{ color: "#9f1239" }}>{req.adminMessage}</span>
                                    </div>
                                )}

                                {req.status === 'meeting_requested' && (
                                    <div style={{
                                        padding: "14px 16px", background: "#faf5ff",
                                        border: "1px solid #e9d5ff", borderRadius: "12px", marginBottom: "10px"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                                            <Video size={16} color="#7c3aed" />
                                            <p style={{ margin: 0, fontWeight: "700", fontSize: "13px", color: "#7c3aed" }}>
                                                {req.meetingRequestedBy === 'admin' ? t('admin_followup') : t('client_requested')}
                                            </p>
                                        </div>
                                        <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#6d28d9" }}>
                                            {req.meetingRequestedBy === 'admin' 
                                                ? t('you_requested_followup') 
                                                : `${req.clientId?.name} ${t('client_wants_meeting')}`}
                                        </p>

                                        <form onSubmit={handleSchedule} onFocus={() => { if (scheduleForm.id !== req._id) openScheduleForm(req); }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                                                <input type="date" required
                                                    value={scheduleForm.id === req._id ? scheduleForm.date : ''}
                                                    onChange={e => { if (scheduleForm.id !== req._id) openScheduleForm(req); setScheduleForm(f => ({ ...f, id: req._id, date: e.target.value })); }}
                                                    style={inpStyle} />
                                                <input type="time" required
                                                    value={scheduleForm.id === req._id ? scheduleForm.time : ''}
                                                    onChange={e => { if (scheduleForm.id !== req._id) openScheduleForm(req); setScheduleForm(f => ({ ...f, id: req._id, time: e.target.value })); }}
                                                    style={inpStyle} />
                                            </div>
                                            <input type="text" placeholder={t('optional_msg_client') || "Optional message to client..."}
                                                value={scheduleForm.id === req._id ? scheduleForm.message : ''}
                                                onChange={e => { if (scheduleForm.id !== req._id) openScheduleForm(req); setScheduleForm(f => ({ ...f, id: req._id, message: e.target.value })); }}
                                                style={{ ...inpStyle, display: "block", marginBottom: "10px" }} />
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button type="submit" disabled={actionLoading === req._id + '-sched'} style={primaryBtn}>
                                                    <CheckCircle size={15} />
                                                    {actionLoading === req._id + '-sched' ? '...' : t('schedule_zoom')}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {req.status === 'meeting_scheduled' && (
                                    <div style={{ padding: "14px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", marginBottom: "10px" }}>
                                        <p style={{ margin: "0 0 10px", fontWeight: "700", fontSize: "13px", color: "#15803d" }}>
                                            📅 {t('meeting_scheduled')}
                                        </p>
                                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "13px" }}><b>Date:</b> {req.meetingDate}</span>
                                            <span style={{ fontSize: "13px" }}><b>Time:</b> {req.meetingTime}</span>
                                        </div>
                                        {req.meetingMessage && (
                                            <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#6b7280", fontStyle: "italic" }}>
                                                "{req.meetingMessage}"
                                            </p>
                                        )}

                                        {scheduleForm.id === req._id ? (
                                            <form onSubmit={handleSchedule}>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                                                    <input type="date" required value={scheduleForm.date}
                                                        onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))}
                                                        style={inpStyle} />
                                                    <input type="time" required value={scheduleForm.time}
                                                        onChange={e => setScheduleForm(f => ({ ...f, time: e.target.value }))}
                                                        style={inpStyle} />
                                                </div>
                                                <input type="text" placeholder={t('optional_msg') || "Optional message..."} value={scheduleForm.message}
                                                    onChange={e => setScheduleForm(f => ({ ...f, message: e.target.value }))}
                                                    style={{ ...inpStyle, display: "block", marginBottom: "10px" }} />
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button type="submit" disabled={actionLoading === req._id + '-sched'} style={primaryBtn}>
                                                        <CheckCircle size={15} />
                                                        {actionLoading === req._id + '-sched' ? '...' : t('update_meeting')}
                                                    </button>
                                                    <button type="button" onClick={() => setScheduleForm({ id: null, date: '', time: '', message: '' })} style={ghostBtn}>{t('cancel')}</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                {req.zoomJoinUrl && (
                                                    <div style={{ padding: "10px", background: "rgba(37, 99, 235, 0.05)", borderRadius: "8px", border: "1px solid rgba(37, 99, 235, 0.1)" }}>
                                                        <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#2563eb", fontWeight: "700" }}>{t('zoom_access')}</p>
                                                        <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "#64748b" }}>
                                                            <span><b>ID:</b> {req.zoomMeetingId}</span>
                                                            <span><b>Pass:</b> {req.zoomPassword}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    {req.zoomMeetingId && (
                                                        <a href={`${API_BASE_URL}/api/zoom/join/${req._id}`} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: "none" }}>
                                                            <button style={{ ...primaryBtn, background: "#7c3aed", width: "100%" }}>
                                                                <Video size={16} /> {t('meeting_hub')}
                                                            </button>
                                                        </a>
                                                    )}
                                                    <button onClick={() => openScheduleForm(req)} style={{ ...ghostBtn, display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <Edit3 size={14} /> {t('update_meeting')}
                                                    </button>
                                                    <button onClick={() => handleComplete(req._id)} disabled={actionLoading === req._id + '-done'}
                                                        style={{ ...primaryBtn, background: "#059669" }}>
                                                        <CheckCircle size={15} />
                                                        {actionLoading === req._id + '-done' ? '...' : t('mark_done')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {req.status === 'completed' && (
                                    <div style={{ padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", marginBottom: "10px" }}>
                                        <p style={{ margin: 0, fontWeight: "700", fontSize: "13px", color: "#15803d" }}>
                                            ✅ {t('completed')}
                                        </p>
                                    </div>
                                )}

                                {req.status === 'pending' && (
                                    <div style={{ paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
                                        {rejectState.id === req._id ? (
                                            <div>
                                                <textarea
                                                    rows={3}
                                                    placeholder={t('rejection_reason_optional') || "Reason for rejection (optional)..."}
                                                    value={rejectState.message}
                                                    onChange={e => setRejectState(s => ({ ...s, message: e.target.value }))}
                                                    style={{ ...inpStyle, display: "block", resize: "none", marginBottom: "8px" }}
                                                />
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button onClick={handleReject} disabled={actionLoading === req._id + '-reject'}
                                                        style={{ ...primaryBtn, background: "#dc2626" }}>
                                                        <XCircle size={15} />
                                                        {actionLoading === req._id + '-reject' ? '...' : t('reject')}
                                                    </button>
                                                    <button onClick={() => setRejectState({ id: null, message: '' })} style={ghostBtn}>{t('cancel')}</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button onClick={() => handleApprove(req._id)} disabled={actionLoading === req._id + '-approve'}
                                                    style={{ ...primaryBtn, background: "#059669" }}>
                                                    <CheckCircle size={15} />
                                                    {actionLoading === req._id + '-approve' ? '...' : t('approve')}
                                                </button>
                                                <button onClick={() => setRejectState({ id: req._id, message: '' })}
                                                    style={{ ...ghostBtn, color: "#dc2626", border: "1px solid #fca5a5" }}>
                                                    <XCircle size={15} /> {t('reject')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const inpStyle = {
    width: "100%", padding: "8px 10px", border: "1px solid #e2e8f0",
    borderRadius: "8px", fontSize: "13px", outline: "none",
    boxSizing: "border-box", background: "white"
};

const primaryBtn = {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "9px 18px", background: "#2563eb", color: "white",
    border: "none", borderRadius: "9px", fontWeight: "700",
    fontSize: "13px", cursor: "pointer", flex: 1, justifyContent: "center"
};

const ghostBtn = {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "9px 16px", background: "#f8fafc", color: "#374151",
    border: "1px solid #e2e8f0", borderRadius: "9px", fontWeight: "700",
    fontSize: "13px", cursor: "pointer"
};

