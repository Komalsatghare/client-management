import { API_BASE_URL } from "../config";
import { FolderGit2, DollarSign, Clock, Plus, AlertCircle, Video, CheckCircle, XCircle, Calendar, Hourglass, CalendarCheck } from "lucide-react";
import axios from "axios";
import RequestProjectModal from "./RequestProjectModal";
import "./ClientDashboard.css";
import { useLanguage } from "../context/LanguageContext";

export function useStatusCfg() {
    const { t } = useLanguage();
    return {
        pending:           { label: t('pending'),          color: "#92400e", bg: "#fef3c7", border: "#fde68a", icon: <Hourglass size={12}/> },
        approved:          { label: t('approved'),         color: "#065f46", bg: "#d1fae5", border: "#6ee7b7", icon: <CheckCircle size={12}/> },
        rejected:          { label: t('rejected'),         color: "#991b1b", bg: "#fee2e2", border: "#fecaca", icon: <XCircle size={12}/> },
        meeting_requested: { label: t('meeting_requested'), color: "#5b21b6", bg: "#ede9fe", border: "#c4b5fd", icon: <Hourglass size={12}/> },
        meeting_scheduled: { label: t('meeting_scheduled'), color: "#1e40af", bg: "#dbeafe", border: "#93c5fd", icon: <CalendarCheck size={12}/> },
        completed:         { label: t('completed'),         color: "#065f46", bg: "#d1fae5", border: "#6ee7b7", icon: <CheckCircle size={12}/> },
    };
}

export default function RequestNewProject() {
    const { t } = useLanguage();
    const STATUS_LABELS = useStatusCfg();
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("clientAuthToken");
            const res = await axios.get("${API_BASE_URL}/api/project-requests/my-requests", {
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

    const handleRequestMeeting = async (id) => {
        setActionLoading(id);
        try {
            const token = localStorage.getItem("clientAuthToken");
            await axios.put(`${API_BASE_URL}/api/project-requests/${id}/request-meeting`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRequests();
        } catch (error) {
            console.error("Failed to request meeting", error);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        const s = STATUS_LABELS[status] || { label: status, color: "#374151", bg: "#f3f4f6", border: "#d1d5db" };
        return (
            <span style={{
                padding: "4px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
                color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}`, whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: "6px"
            }}>
                {s.icon} {s.label}
            </span>
        );
    };

    return (
        <div className="req-page-container">
            {/* Header */}
            <div className="req-page-header">
                <div>
                    <h2 className="req-page-title">{t('my_project_requests') || "My Project Requests"}</h2>
                    <p className="req-page-subtitle">{t('submit_proposal_desc') || "Submit new proposals and track your request status"}</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="req-btn-primary">
                    <Plus size={18} /> {t('request_project_btn') || "Request New Project"}
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>{t('loading') || "Loading your requests..."}</div>
            ) : requests.length === 0 ? (
                <div className="req-empty-state">
                    <FolderGit2 size={48} className="req-empty-icon" />
                    <h3 className="req-empty-title">{t('no_requests_yet') || "No Requests Yet"}</h3>
                    <p className="req-empty-subtitle">{t('submit_proposal_first') || "Submit your first project proposal to get started."}</p>
                    <button onClick={() => setIsModalOpen(true)} className="req-btn-primary">
                        <Plus size={18} /> {t('request_project_btn') || "Request Your First Project"}
                    </button>
                </div>
            ) : (
                <div className="client-projects-grid">
                    {requests.map((req) => (
                        <div key={req._id} className="client-project-card">

                            {/* Card Header: Title + Status */}
                            <div className="client-card-header">
                                <div className="client-card-title-group">
                                    <div className="client-card-icon"><FolderGit2 size={24} /></div>
                                    <div>
                                        <h3 className="client-card-title">{req.title}</h3>
                                        <p className="client-card-desc" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {req.description}
                                        </p>
                                    </div>
                                </div>
                                {getStatusBadge(req.status)}
                            </div>

                            {/* Metrics */}
                            <div className="client-card-metrics">
                                <div className="client-metric-item">
                                    <Clock size={16} color="#94a3b8" />
                                    <div className="client-profile-text">
                                        <span className="client-metric-label">{t('deadline') || "Deadline"}</span>
                                        <span className="client-metric-value">{req.deadline}</span>
                                    </div>
                                </div>
                                <div className="client-metric-item">
                                    <DollarSign size={16} color="#94a3b8" />
                                    <div className="client-profile-text">
                                        <span className="client-metric-label">{t('budget') || "Budget"}</span>
                                        <span className="client-metric-value">₹{req.budget}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements preview */}
                            {req.requirements && (
                                <div style={{ margin: "10px 0 0", padding: "10px 12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                    <p style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "4px" }}>REQUIREMENTS</p>
                                    <p style={{ margin: 0, fontSize: "13px", color: "#334155", whiteSpace: "pre-line" }}>{req.requirements}</p>
                                </div>
                            )}

                            {/* Admin message (rejection or note) */}
                            {req.adminMessage && (
                                <div className="req-admin-msg" style={{ marginTop: "10px" }}>
                                    <AlertCircle size={16} className="req-admin-msg-icon" />
                                    <div>
                                        <p className="req-admin-msg-title">{t('admin_response') || "Admin Response:"}</p>
                                        <p className="req-admin-msg-text">"{req.adminMessage}"</p>
                                    </div>
                                </div>
                            )}

                            {/* Meeting details — shown when scheduled or done */}
                            {(req.status === "meeting_scheduled" || req.status === "completed") && req.meetingDate && (
                                <div style={{
                                    marginTop: "12px", padding: "12px 14px",
                                    background: req.status === "completed" ? "#f0fdf4" : "#eff6ff",
                                    border: `1px solid ${req.status === "completed" ? "#bbf7d0" : "#bfdbfe"}`,
                                    borderRadius: "10px"
                                }}>
                                    <p style={{ margin: "0 0 8px", fontWeight: "700", fontSize: "13px", color: req.status === "completed" ? "#065f46" : "#1d4ed8" }}>
                                        {req.status === "completed" ? "✓ Meeting Completed" : "📅 Your Meeting Details"}
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <span style={{ fontSize: "13px" }}><b>Date:</b> {req.meetingDate}</span>
                                        <span style={{ fontSize: "13px" }}><b>Time:</b> {req.meetingTime}</span>
                                        <span style={{ fontSize: "13px" }}><b>Location:</b> {req.meetingLocation}</span>
                                        {req.meetingMessage && (
                                            <span style={{ fontSize: "13px", fontStyle: "italic", color: "#6b7280", marginTop: "4px" }}>
                                                "{req.meetingMessage}"
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action: Request Meeting — only shown when approved */}
                            {req.status === "approved" && (
                                <button
                                    onClick={() => handleRequestMeeting(req._id)}
                                    disabled={actionLoading === req._id}
                                    style={{
                                        marginTop: "14px", display: "flex", alignItems: "center",
                                        justifyContent: "center", gap: "8px", width: "100%",
                                        padding: "10px", background: "#7c3aed", color: "white",
                                        border: "none", borderRadius: "8px", fontWeight: "600",
                                        fontSize: "14px", cursor: "pointer"
                                    }}
                                >
                                    <Video size={16} />
                                    {actionLoading === req._id ? "Requesting..." : "Request a Meeting"}
                                </button>
                            )}

                            {/* Waiting states */}
                            {req.status === "meeting_requested" && (
                                <div style={{ marginTop: "12px", padding: "10px", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "8px", textAlign: "center" }}>
                                    <p style={{ margin: 0, fontSize: "13px", color: "#7c3aed", fontWeight: "600" }}>
                                        ⏳ {t('waiting_for_admin') || "Waiting for admin to schedule the meeting..."}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <RequestProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchRequests}
            />
        </div>
    );
}


