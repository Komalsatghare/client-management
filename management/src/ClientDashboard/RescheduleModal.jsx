import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

export default function RescheduleModal({ isOpen, onClose, requestId, onSuccess }) {
    const { t } = useLanguage();
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("clientAuthToken");
            await axios.put(`http://localhost:5000/api/project-requests/${requestId}/reschedule-request`,
                { rescheduleReason: reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSuccess();
            onClose();
            setReason("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to request reschedule.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
            <div style={{
                background: "white", borderRadius: "16px", padding: "32px",
                width: "100%", maxWidth: "460px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
            }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>
                    {t('request_reschedule') || "Request Reschedule"}
                </h2>
                <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "14px" }}>
                    {t('provide_reschedule_reason_sub') || "Provide a reason for rescheduling (optional)."}
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                            {t('reason_optional') || "Reason (optional)"}
                        </label>
                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            rows={4}
                            placeholder={t('reschedule_reason_placeholder') || "Why do you need to reschedule?"}
                            style={{
                                width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
                                borderRadius: "8px", fontSize: "14px", resize: "vertical",
                                outline: "none", boxSizing: "border-box"
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "16px" }}>{error}</p>
                    )}

                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1, padding: "10px", background: "#f59e0b", color: "white",
                                border: "none", borderRadius: "8px", fontWeight: "600",
                                fontSize: "14px", cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? (t('sending') || "Sending...") : (t('request_reschedule') || "Request Reschedule")}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1, padding: "10px", background: "#f1f5f9", color: "#374151",
                                border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "600",
                                fontSize: "14px", cursor: "pointer"
                            }}
                        >
                            {t('cancel') || "Cancel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
