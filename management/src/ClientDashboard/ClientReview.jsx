import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, MessageSquare, Send, CheckCircle, AlertCircle, Loader2, Edit3 } from "lucide-react";
import { API_BASE_URL } from "../config";
import { useLanguage } from "../context/LanguageContext";

const ClientReview = () => {
    const { t } = useLanguage();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [hover, setHover] = useState(null);

    const token = localStorage.getItem("clientAuthToken");

    useEffect(() => {
        fetchMyReview();
    }, []);

    const fetchMyReview = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/reviews/my-review`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data) {
                setRating(res.data.rating);
                setComment(res.data.comment);
                setIsEditing(true);
            }
        } catch (err) {
            console.error("Error fetching review:", err);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            await axios.post(`${API_BASE_URL}/api/reviews`, 
                { rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(true);
            setIsEditing(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save review.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
                <Loader2 className="animate-spin" size={32} color="#60a5fa" />
            </div>
        );
    }

    return (
        <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }}>
            <div style={{
                background: "#ffffff",
                backdropFilter: "blur(12px)",
                border: "1px solid #e2e8f0",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{
                        width: "64px", height: "64px", borderRadius: "18px",
                        background: "rgba(96,165,250,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 16px", color: "#60a5fa"
                    }}>
                        <Star size={32} fill={rating >= 1 ? "currentColor" : "none"} />
                    </div>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        {isEditing ? (t('edit_your_review') || "Edit Your Review") : (t('leave_a_review') || "Leave a Review")}
                    </h2>
                    <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "8px" }}>
                        {t('review_desc') || "Your feedback helps us improve our services for everyone."}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Stars */}
                    <div style={{ marginBottom: "28px", textAlign: "center" }}>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "12px" }}>
                            {t('rate_our_service') || "How would you rate our service?"}
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(null)}
                                    style={{
                                        background: "none", border: "none", cursor: "pointer",
                                        color: (hover || rating) >= star ? "#fbbf24" : "#cbd5e1",
                                        transition: "transform 0.1s ease, color 0.1s ease",
                                        transform: hover === star ? "scale(1.2)" : "scale(1)"
                                    }}
                                >
                                    <Star size={36} fill={(hover || rating) >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block", marginBottom: "8px", fontSize: "12px",
                            fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em"
                        }}>
                            {t('your_comment') || "Your Experience"}
                        </label>
                        <div style={{ position: "relative" }}>
                            <textarea
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t('review_placeholder') || "Tell us what you liked or how we can improve..."}
                                style={{
                                    width: "100%", height: "140px", padding: "14px 16px",
                                    background: "#f8fafc", border: "1px solid #cbd5e1",
                                    borderRadius: "16px", color: "#0f172a", fontSize: "14px",
                                    outline: "none", transition: "all 0.2s", resize: "none",
                                    boxSizing: "border-box"
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#3b82f6";
                                    e.target.style.background = "#ffffff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#cbd5e1";
                                    e.target.style.background = "#f8fafc";
                                }}
                            />
                            <MessageSquare size={16} color="#475569" style={{ position: "absolute", bottom: "16px", right: "16px" }} />
                        </div>
                    </div>

                    {/* Feedback */}
                    {error && (
                        <div style={{
                            padding: "12px 16px", borderRadius: "12px", background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.2)", color: "#f87171",
                            fontSize: "13px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px"
                        }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            padding: "12px 16px", borderRadius: "12px", background: "rgba(16,185,129,0.1)",
                            border: "1px solid rgba(16,185,129,0.2)", color: "#34d399",
                            fontSize: "13px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px"
                        }}>
                            <CheckCircle size={16} /> {t('review_success') || "Thank you! Your review has been saved."}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%", padding: "14px", borderRadius: "14px",
                            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                            color: "white", border: "none", fontWeight: 700,
                            fontSize: "15px", cursor: loading ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                            boxShadow: "0 10px 20px rgba(99,102,241,0.3)",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => { if (!loading) e.target.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { if (!loading) e.target.style.transform = "none"; }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? <Edit3 size={18} /> : <Send size={18} />)}
                        {loading ? (t('saving') || "Saving...") : (isEditing ? (t('update_review') || "Update Review") : (t('submit_review') || "Submit Review"))}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClientReview;
