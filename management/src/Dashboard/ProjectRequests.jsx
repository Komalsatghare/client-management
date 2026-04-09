import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import {
    Search, CheckCircle, XCircle, AlertCircle, Calendar,
    User, FileText, Video, Trash2, Clock, DollarSign, Edit3,
    Briefcase, Bell, ChevronDown, ChevronUp, Zap, PenTool
} from "lucide-react";

/* ─── Inline CSS ─────────────────────────────────────────────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.pr-root {
    padding: 28px;
    max-width: 980px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
    color: #e2e8f0;
}

.pr-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
    gap: 16px;
    flex-wrap: wrap;
}
.pr-title {
    font-size: 26px;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.pr-subtitle {
    color: #64748b;
    font-size: 13px;
    margin: 4px 0 0;
}
.pr-badge-alert {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #fbbf24;
    background: rgba(251,191,36,0.12);
    border: 1px solid rgba(251,191,36,0.3);
    animation: pulse-badge 2s ease-in-out infinite;
}
@keyframes pulse-badge {
    0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.3); }
    50%       { box-shadow: 0 0 0 6px rgba(251,191,36,0); }
}

.pr-search-wrap {
    position: relative;
    flex-shrink: 0;
}
.pr-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #475569;
    pointer-events: none;
}
.pr-search {
    padding: 10px 16px 10px 40px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    font-size: 13px;
    outline: none;
    width: 260px;
    background: rgba(255,255,255,0.04);
    color: #e2e8f0;
    transition: all 0.2s;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
}
.pr-search::placeholder { color: #475569; }
.pr-search:focus {
    border-color: rgba(96,165,250,0.4);
    background: rgba(96,165,250,0.06);
    box-shadow: 0 0 0 3px rgba(96,165,250,0.1);
}

.pr-list { display: flex; flex-direction: column; gap: 18px; }

.pr-card {
    background: rgba(15,23,42,0.7);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    backdrop-filter: blur(10px);
}
.pr-card:hover {
    transform: translateY(-2px);
    border-color: rgba(96,165,250,0.2);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(96,165,250,0.08);
}

.pr-client-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
    background: rgba(15,23,42,0.5);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-wrap: wrap;
    gap: 10px;
}
.pr-client-info {
    display: flex;
    align-items: center;
    gap: 12px;
}
.pr-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(59,130,246,0.3);
}
.pr-client-name {
    margin: 0;
    font-weight: 700;
    font-size: 14px;
    color: #f1f5f9;
}
.pr-client-email {
    margin: 0;
    font-size: 12px;
    color: #64748b;
}
.pr-strip-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.pr-status-badge {
    padding: 4px 13px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
    letter-spacing: 0.03em;
    transition: all 0.2s;
}

.pr-btn-delete {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    background: rgba(239,68,68,0.1);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
}
.pr-btn-delete:hover {
    background: rgba(239,68,68,0.18);
    border-color: rgba(239,68,68,0.4);
    color: #fca5a5;
    transform: scale(1.02);
}

.pr-card-body { padding: 20px; }

.pr-project-title {
    margin: 0 0 6px;
    font-size: 19px;
    font-weight: 700;
    color: #f1f5f9;
}
.pr-project-desc {
    margin: 0 0 16px;
    font-size: 13px;
    color: #64748b;
    line-height: 1.65;
}

.pr-meta-row {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}
.pr-meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
}
.pr-meta-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.pr-meta-label {
    margin: 0;
    font-size: 10px;
    color: #475569;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}
.pr-meta-value {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #cbd5e1;
}

.pr-requirements {
    margin-bottom: 14px;
    padding: 14px 16px;
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 12px;
}
.pr-req-heading {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 8px;
}
.pr-req-title {
    margin: 0;
    font-weight: 700;
    font-size: 12px;
    color: #60a5fa;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.pr-req-text {
    margin: 0;
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.7;
    white-space: pre-line;
}

.pr-banner {
    padding: 14px 16px;
    border-radius: 12px;
    margin-bottom: 12px;
}
.pr-banner-purple {
    background: rgba(139,92,246,0.08);
    border: 1px solid rgba(139,92,246,0.2);
}
.pr-banner-green {
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.2);
}
.pr-banner-red {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
}
.pr-banner-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}
.pr-banner-title {
    margin: 0;
    font-weight: 700;
    font-size: 13px;
}
.pr-banner-text {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
}

.pr-pending-divider {
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
}

.pr-inp {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9px;
    font-size: 13px;
    outline: none;
    box-sizing: border-box;
    background: rgba(255,255,255,0.04);
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
}
.pr-inp::placeholder { color: #475569; }
.pr-inp:focus {
    border-color: rgba(96,165,250,0.4);
    background: rgba(96,165,250,0.06);
    box-shadow: 0 0 0 3px rgba(96,165,250,0.1);
}
.pr-inp-date {
    color-scheme: dark;
}

.pr-zoom-info {
    padding: 9px 13px;
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 9px;
    font-size: 12px;
    color: #60a5fa;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.pr-meeting-details {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 10px;
}
.pr-meeting-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    font-size: 12px;
    color: #94a3b8;
}
.pr-meeting-chip b { color: #e2e8f0; }
.pr-meeting-msg {
    margin: 0 0 12px;
    font-size: 13px;
    color: #64748b;
    font-style: italic;
}

.pr-btn-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 10px;
}
.pr-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    border: none;
    border-radius: 9px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 4px 14px rgba(99,102,241,0.3);
}
.pr-btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.45);
    opacity: 0.92;
}
.pr-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.pr-btn-green {
    background: linear-gradient(135deg, #059669, #10b981);
    box-shadow: 0 4px 14px rgba(16,185,129,0.3);
}
.pr-btn-red {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    box-shadow: 0 4px 14px rgba(239,68,68,0.3);
}
.pr-btn-purple {
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    box-shadow: 0 4px 14px rgba(139,92,246,0.3);
}

.pr-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    background: rgba(255,255,255,0.04);
    color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
}
.pr-btn-ghost:hover {
    background: rgba(255,255,255,0.08);
    color: #e2e8f0;
    border-color: rgba(255,255,255,0.18);
}
.pr-btn-ghost-purple {
    color: #a78bfa;
    border-color: rgba(167,139,250,0.25);
    background: rgba(139,92,246,0.06);
}

.pr-form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
}

.pr-empty {
    text-align: center;
    padding: 64px 32px;
    background: rgba(15,23,42,0.6);
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
}
.pr-loading {
    text-align: center;
    padding: 64px;
    color: #475569;
    font-size: 14px;
}
.pr-loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255,255,255,0.07);
    border-top-color: #60a5fa;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.pr-card-enter {
    animation: cardEnter 0.3s ease-out both;
}
@keyframes cardEnter {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}

.pr-inapp-hint {
    font-size: 11px;
    color: #475569;
    align-self: center;
}
`;

export default function ProjectRequests() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    
    /* ─── Status Config ─────────────────────────────────────────────────────────── */
    const STATUS_CONFIG = {
        pending:           { label: t('pending'),           color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  glow: "rgba(245,158,11,0.2)"  },
        approved:          { label: t('approved'),          color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  glow: "rgba(16,185,129,0.2)"  },
        rejected:          { label: t('rejected'),          color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   glow: "rgba(239,68,68,0.2)"   },
        meeting_requested: { label: t('meeting_requested'), color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)", glow: "rgba(167,139,250,0.2)" },
        meeting_scheduled: { label: t('meeting_scheduled'), color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.3)",  glow: "rgba(96,165,250,0.2)"  },
        completed:         { label: t('completed'),         color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  glow: "rgba(16,185,129,0.2)"  },
    };

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [zoomCreating, setZoomCreating] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    const [rejectState, setRejectState] = useState({ id: null, message: '' });
    const [scheduleForm, setScheduleForm] = useState({ id: null, date: '', time: '', location: '', message: '', dateTime: '' });

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get('http://localhost:5000/api/project-requests', {
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
            await axios.put(`http://localhost:5000/api/project-requests/${id}/status`,
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
            await axios.put(`http://localhost:5000/api/project-requests/${id}/status`,
                { status: 'rejected', adminMessage: message },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setRejectState({ id: null, message: '' });
            fetchRequests();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleSchedule = async (e) => {
        if (e) e.preventDefault();
        const { id, date, time, location, message, dateTime } = scheduleForm;
        const resolvedDate = date || (dateTime ? dateTime.split("T")[0] : "");
        const resolvedTime = time || (dateTime ? dateTime.split("T")[1] : "");
        setActionLoading(id + '-sched');
        try {
            await axios.put(`http://localhost:5000/api/project-requests/${id}/schedule-meeting`,
                { meetingDate: resolvedDate, meetingTime: resolvedTime, meetingLocation: location, meetingMessage: message },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setScheduleForm({ id: null, date: '', time: '', location: '', message: '', dateTime: '' });
            fetchRequests();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleAdminRequestMeeting = async (id) => {
        setActionLoading(id + '-req');
        try {
            await axios.put(
                `http://localhost:5000/api/project-requests/${id}/admin-request-meeting`,
                { adminMessage: "Admin requested another meeting. Please wait for updated schedule." },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            fetchRequests();
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const handleComplete = async (id) => {
        setActionLoading(id + '-done');
        try {
            await axios.put(`http://localhost:5000/api/project-requests/${id}/complete`, {},
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
            await axios.delete(`http://localhost:5000/api/project-requests/${id}`,
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
            location: req.meetingLocation || '',
            message: req.meetingMessage || '',
            dateTime: req.meetingDate && req.meetingTime ? `${req.meetingDate}T${req.meetingTime}` : ''
        });
    };

    const handleZoomSchedule = async (e) => {
        e.preventDefault();
        const { id, date, time, location, message, dateTime } = scheduleForm;
        const resolvedDate = date || (dateTime ? dateTime.split("T")[0] : "");
        const resolvedTime = time || (dateTime ? dateTime.split("T")[1] : "");
        if (!resolvedDate || !resolvedTime) return;

        setZoomCreating(id);
        try {
            const token = getToken();
            const req = requests.find(r => r._id === id);
            const startIso = new Date(`${resolvedDate}T${resolvedTime}:00`).toISOString();

            let zoomData = {};
            try {
                const zoomRes = await axios.post(
                    'http://localhost:5000/api/zoom/create-meeting',
                    {
                        requestId: id,
                        topic: `Project Meeting – ${req?.title || 'Discussion'}`,
                        startTime: startIso,
                        agenda: message || ''
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                zoomData = zoomRes.data;
            } catch (zoomErr) {
                console.warn('Zoom API failed:', zoomErr.response?.data?.detail || zoomErr.message);
            }

            await axios.put(
                `http://localhost:5000/api/project-requests/${id}/schedule-meeting`,
                {
                    meetingDate: resolvedDate,
                    meetingTime: resolvedTime,
                    meetingLocation: zoomData.joinUrl || location || 'To be confirmed',
                    meetingMessage: message
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setScheduleForm({ id: null, date: '', time: '', location: '', message: '', dateTime: '' });
            fetchRequests();
        } catch (err) {
            console.error('Schedule error:', err);
        } finally {
            setZoomCreating(null);
        }
    };

    const handleGenerateAgreement = async (req) => {
        if (!window.confirm(`Generate digital agreement for "${req.title}"?`)) return;
        
        const agreementNumber = window.prompt("Enter Agreement Number (e.g., DB_MH_W_002):", "DB_MH_W_002") || "TBD";
        const clientAddress = window.prompt("Enter Client Address:", req.location || "At. Parsodi, Po. Pimpalgaon Raja, Tah. Kalamb, Dist. Yavatmal 445401") || "";
        const meetingPlace = window.prompt("Enter Place of Meeting:", "WARDHA & PARSODI BK") || "Office";
        const plotDetails = window.prompt("Enter Plot Survey Number:", "181") || "181";

        try {
            await axios.post('http://localhost:5000/api/agreements/digital', {
                projectName: req.title,
                uploadedByRole: 'admin',
                uploadedByName: req.clientId?.name || 'Admin',
                contactNumber: req.clientId?.phone || '',
                totalCost: `₹${req.budget}`,
                location: req.location || 'Wardha',
                area: '800 Sq.Ft (Approx)',
                agreementNumber,
                clientAddress,
                meetingPlace,
                plotDetails
            }, { headers: { Authorization: `Bearer ${getToken()}` } });
            alert('Agreement generated safely! Please navigate to your Agreements tab to review and sign.');
        } catch (e) {
            console.error('Error generating agreement', e);
            alert('Failed to generate agreement.');
        }
    };

    const buildInAppMeetingLink = (reqId) => `/video-room/req-${reqId}`;
    const applyInAppLink = (reqId) => {
        setScheduleForm((f) => ({ ...f, location: buildInAppMeetingLink(reqId) }));
    };

    const getStatusBadge = (status) => {
        const s = STATUS_CONFIG[status] || { label: status, color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" };
        return (
            <span className="pr-status-badge" style={{
                color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}`,
                boxShadow: `0 0 8px ${s.glow || 'transparent'}`
            }}>
                {s.label}
            </span>
        );
    };

    const filteredRequests = requests.filter(req =>
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.clientId?.name && req.clientId.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <>
            <style>{styles}</style>
            <div className="pr-root">

                <div className="pr-header">
                    <div>
                        <h1 className="pr-title">{t('project_requests')}</h1>
                        <p className="pr-subtitle">{t('manage_proposals')}</p>
                        {filteredRequests.length > 0 && (
                            <div className="pr-badge-alert">
                                <Zap size={14} fill="#fbbf24" stroke="none" />
                                {filteredRequests.length} {t('active_requests')}
                            </div>
                        )}
                    </div>
                    <div className="pr-search-wrap">
                        <Search className="pr-search-icon" size={16} />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-search"
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "100px", color: "#475569" }}>
                        <div className="pr-loader" style={{ marginBottom: 12 }}></div>
                        <p style={{ fontWeight: 700, fontSize: 16 }}>{t('loading')}</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "80px 40px",
                        background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)",
                        borderRadius: "20px"
                    }}>
                        <AlertCircle size={48} color="#475569" style={{ margin: "0 auto 16px" }} />
                        <p style={{ fontWeight: 800, fontSize: 20, color: "#64748b", margin: 0 }}>{t('no_requests_found')}</p>
                        <p style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>No data matches your current search filters.</p>
                    </div>
                ) : (
                    <div className="pr-list">
                        {filteredRequests.map((req, idx) => {
                            const sc = STATUS_CONFIG[req.status] || {};
                            return (
                                <div
                                    key={req._id}
                                    className="pr-card pr-card-enter"
                                    style={{
                                        animationDelay: `${idx * 0.05}s`,
                                        borderColor: hoveredCard === req._id
                                            ? (sc.border || 'rgba(96,165,250,0.25)')
                                            : 'rgba(255,255,255,0.07)'
                                    }}
                                    onMouseEnter={() => setHoveredCard(req._id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div className="pr-client-strip">
                                        <div className="pr-client-info">
                                            <div className="pr-avatar">
                                                <User size={18} color="white" />
                                            </div>
                                            <div>
                                                <p className="pr-client-name">{req.clientId?.name || "Unknown Client"}</p>
                                                <p className="pr-client-email">
                                                    {req.clientId?.email}
                                                    {req.clientId?.phone ? ` · ${req.clientId.phone}` : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pr-strip-right">
                                            {getStatusBadge(req.status)}
                                            <div style={{ display: "flex", gap: "10px" }}>
                                            <button onClick={() => handleDelete(req._id)} disabled={actionLoading === req._id + '-del'}
                                                className="pr-btn pr-btn-ghost" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}>
                                                <Trash2 size={15} /> {t('delete')}
                                            </button>
                                        </div>
                                        </div>
                                    </div>

                                    <div className="pr-card-body">

                                        <h3 className="pr-project-title">{req.title}</h3>
                                        <p className="pr-project-desc">{req.description}</p>

                                        <div className="pr-meta-row">
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <DollarSign size={15} color="#475569" />
                                                <div>
                                                    <p className="pr-meta-label">{t('budget')}</p>
                                                    <p className="pr-meta-value">₹{req.budget}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <Clock size={15} color="#475569" />
                                                <div>
                                                    <p className="pr-meta-label">{t('deadline')}</p>
                                                    <p className="pr-meta-value">{req.deadline}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <Calendar size={15} color="#475569" />
                                                <div>
                                                    <p className="pr-meta-label">{t('received')}</p>
                                                    <p className="pr-meta-value">
                                                        {new Date(req.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {req.requirements && (
                                            <div className="pr-requirements">
                                                <div className="pr-req-heading">
                                                    <FileText size={14} color="#60a5fa" />
                                                    <p className="pr-req-title">{t('requirements_needed')}</p>
                                                </div>
                                                <p className="pr-req-text">{req.requirements}</p>
                                            </div>
                                        )}

                                        {req.status === 'rejected' && req.adminMessage && (
                                            <div className="pr-banner pr-banner-red" style={{ marginBottom: 12 }}>
                                                <p className="pr-banner-text" style={{ color: '#fca5a5' }}>
                                                    <strong style={{ color: '#f87171' }}>{t('rejection_reason')}: </strong>
                                                    {req.adminMessage}
                                                </p>
                                            </div>
                                        )}

                                        {req.status === 'meeting_requested' && (
                                            <div className="pr-banner pr-banner-purple">
                                                <div className="pr-banner-heading">
                                                    <Video size={15} color="#a78bfa" />
                                                    <p className="pr-banner-title" style={{ color: '#a78bfa' }}>
                                                        {req.meetingRequestedBy === 'admin' ? t('admin_followup') : t('client_requested')}
                                                    </p>
                                                </div>
                                                <p className="pr-banner-text" style={{ color: '#8b5cf6', marginBottom: 4 }}>
                                                    {req.meetingRequestedBy === 'admin' 
                                                        ? t('you_requested_followup') 
                                                        : `${req.clientId?.name} ${t('client_wants_meeting')}`}
                                                </p>
                                                <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#7c3aed', fontWeight: 700 }}>
                                                    🎥 Zoom Video Meeting
                                                </p>

                                                <form onSubmit={handleZoomSchedule}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                                                        <input type="date" required
                                                            value={scheduleForm.id === req._id ? scheduleForm.date : ''}
                                                            onChange={e => { if (scheduleForm.id !== req._id) openScheduleForm(req); setScheduleForm(f => ({ ...f, id: req._id, date: e.target.value })); }}
                                                            className="pr-inp pr-inp-date" />
                                                        <input type="time" required
                                                            value={scheduleForm.id === req._id ? scheduleForm.time : ''}
                                                            onChange={e => { if (scheduleForm.id !== req._id) openScheduleForm(req); setScheduleForm(f => ({ ...f, id: req._id, time: e.target.value })); }}
                                                            className="pr-inp pr-inp-date" />
                                                    </div>
                                                    <input type="text" placeholder="Add an optional message to the client..."
                                                        value={scheduleForm.id === req._id ? scheduleForm.message : ''}
                                                        onChange={e => { if (scheduleForm.id !== req._id) openScheduleForm(req); setScheduleForm(f => ({ ...f, id: req._id, message: e.target.value })); }}
                                                        className="pr-inp" style={{ marginBottom: "10px" }} />
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <button type="submit" disabled={zoomCreating === req._id} className="pr-btn-primary pr-btn-purple">
                                                            <Video size={15} />
                                                            {zoomCreating === req._id ? '...' : t('schedule_zoom')}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                        {req.status === 'meeting_scheduled' && (
                                            <div className="pr-banner pr-banner-green">
                                                <div className="pr-banner-heading">
                                                    <Calendar size={15} color="#10b981" />
                                                    <p className="pr-banner-title" style={{ color: '#10b981' }}>{t('meeting_scheduled')}</p>
                                                </div>
                                                <div className="pr-meeting-details">
                                                    <span className="pr-meeting-chip"><b>Date:</b> {req.meetingDate}</span>
                                                    <span className="pr-meeting-chip"><b>Time:</b> {req.meetingTime}</span>
                                                    <span className="pr-meeting-chip"><b>Location:</b> {req.meetingLocation}</span>
                                                </div>
                                                {req.meetingMessage && (
                                                    <p className="pr-meeting-msg">"{req.meetingMessage}"</p>
                                                )}

                                                {scheduleForm.id === req._id ? (
                                                    <form onSubmit={handleZoomSchedule}>
                                                        <div className="pr-form-grid-2">
                                                            <input type="date" required value={scheduleForm.date}
                                                                onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))}
                                                                className="pr-inp pr-inp-date" />
                                                            <input type="time" required value={scheduleForm.time}
                                                                onChange={e => setScheduleForm(f => ({ ...f, time: e.target.value }))}
                                                                className="pr-inp pr-inp-date" />
                                                        </div>
                                                        <input type="text" placeholder="Update message..."
                                                            value={scheduleForm.message}
                                                            onChange={e => setScheduleForm(f => ({ ...f, message: e.target.value }))}
                                                            className="pr-inp" style={{ marginBottom: "10px" }} />
                                                        <div style={{ display: "flex", gap: "10px" }}>
                                                            <button type="submit" disabled={zoomCreating === req._id} className="pr-btn-primary">
                                                                <CheckCircle size={15} />
                                                                {zoomCreating === req._id ? '...' : t('update_meeting')}
                                                            </button>
                                                            <button type="button" onClick={() => setScheduleForm({ id: null, date: '', time: '', message: '' })} className="pr-btn-ghost">{t('cancel')}</button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                        {req.zoomMeetingId && (
                                                            <div style={{ padding: "10px", background: "rgba(37, 99, 235, 0.05)", borderRadius: "8px", border: "1px solid rgba(37, 99, 235, 0.1)" }}>
                                                                <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#2563eb", fontWeight: "700" }}>{t('zoom_access')}</p>
                                                                <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#cbd5e1" }}>
                                                                    <span><b>ID:</b> {req.zoomMeetingId}</span>
                                                                    <span><b>Pass:</b> {req.zoomPassword}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <div style={{ display: "flex", gap: "10px" }}>
                                                            {req.zoomMeetingId && (
                                                                <a href={`http://localhost:5000/api/zoom/join/${req._id}`} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: "none" }}>
                                                                    <button className="pr-btn-primary pr-btn-purple" style={{ width: "100%" }}>
                                                                        <Video size={16} /> {t('meeting_hub')}
                                                                    </button>
                                                                </a>
                                                            )}
                                                            <button onClick={() => openScheduleForm(req)} className="pr-btn-ghost">
                                                                <Edit3 size={15} /> {t('update_meeting')}
                                                            </button>
                                                            <button onClick={() => handleComplete(req._id)} disabled={actionLoading === req._id + '-done'}
                                                                className="pr-btn-primary pr-btn-green">
                                                                <CheckCircle size={15} />
                                                                {actionLoading === req._id + '-done' ? '...' : t('mark_done')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {req.status === 'completed' && (
                                            <div className="pr-banner pr-banner-green">
                                                <p style={{ margin: '0', fontWeight: 700, fontSize: 13, color: '#10b981' }}>
                                                    ✅ {t('completed')}
                                                </p>
                                            </div>
                                        )}

                                        {req.status === 'pending' && (
                                            <div className="pr-pending-divider">
                                                {rejectState.id === req._id ? (
                                                    <div style={{ background: 'rgba(239,68,68,0.05)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.1)' }}>
                                                        <textarea
                                                            placeholder="Enter reason for rejection..."
                                                            value={rejectState.message}
                                                            onChange={e => setRejectState({ ...rejectState, message: e.target.value })}
                                                            className="pr-inp"
                                                            style={{ display: 'block', resize: 'none', marginBottom: '10px', height: '60px' }}
                                                        ></textarea>
                                                        <div style={{ display: "flex", gap: "10px" }}>
                                                            <button onClick={handleReject} disabled={actionLoading === req._id + '-reject'}
                                                                className="pr-btn-primary pr-btn-red">
                                                                <XCircle size={15} />
                                                                {actionLoading === req._id + '-reject' ? '...' : t('reject')}
                                                            </button>
                                                            <button onClick={() => setRejectState({ id: null, message: '' })} className="pr-btn-ghost">{t('cancel')}</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <button onClick={() => handleApprove(req._id)} disabled={actionLoading === req._id + '-approve'}
                                                            className="pr-btn-primary pr-btn-green" style={{ flex: 1 }}>
                                                            <CheckCircle size={15} />
                                                            {actionLoading === req._id + '-approve' ? '...' : t('approve')}
                                                        </button>
                                                        <button onClick={() => setRejectState({ id: req._id, message: '' })}
                                                            className="pr-btn-ghost" style={{ flex: 1, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>
                                                            <XCircle size={15} /> {t('reject')}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {(req.status === 'approved' || req.status === 'meeting_requested' || req.status === 'meeting_scheduled' || req.status === 'completed') && (
                                            <div style={{ marginTop: '12px' }}>
                                                <button onClick={() => handleAdminRequestMeeting(req._id)} disabled={actionLoading === req._id + '-req'}
                                                    className="pr-btn-ghost pr-btn-ghost-purple" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>
                                                    <Video size={15} /> {t('request_another')}
                                                </button>
                                                <button onClick={() => handleGenerateAgreement(req)} className="pr-btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                                                    <PenTool size={14} /> Generate Digital Agreement
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
