import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Trash2, Search, AlertCircle, Loader2, User, Calendar, Trash } from "lucide-react";
import { API_BASE_URL } from "../../config";
import { useLanguage } from "../../context/LanguageContext";

const AdminReviews = () => {
    const { t } = useLanguage();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/reviews`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('confirm_delete_review') || "Are you sure you want to delete this review?")) return;
        
        setActionLoading(id);
        try {
            await axios.delete(`${API_BASE_URL}/api/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(reviews.filter(r => r._id !== id));
        } catch (err) {
            alert("Failed to delete review.");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredReviews = reviews.filter(r => 
        r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatRating = (rating) => {
        return (
            <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map(s => (
                    <Star 
                        key={s} 
                        size={14} 
                        color={s <= rating ? "#fbbf24" : "rgba(255,255,255,0.1)"}
                        fill={s <= rating ? "#fbbf24" : "none"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div style={{ padding: "28px", maxWidth: "1000px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        {t('client_reviews') || "Client Reviews"}
                    </h1>
                    <p style={{ margin: "5px 0 0", fontSize: "14px", color: "#64748b" }}>
                        {t('manage_reviews_desc') || "Manage and moderate client feedback across the platform."}
                    </p>
                </div>
                <div style={{ position: "relative", minWidth: "260px" }}>
                    <input 
                        type="text" 
                        placeholder={t('search_reviews') || "Search by name or content..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%", padding: "11px 16px 11px 40px",
                            background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px", color: "white", fontSize: "14px", outline: "none",
                            boxSizing: "border-box", transition: "all 0.2s"
                        }}
                    />
                    <Search size={18} color="#475569" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
                    <Loader2 className="animate-spin" size={36} color="#60a5fa" />
                </div>
            ) : filteredReviews.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: "80px 40px", background: "rgba(15,23,42,0.4)",
                    borderRadius: "20px", border: "1px dashed rgba(255,255,255,0.1)"
                }}>
                    <AlertCircle size={48} color="#334155" style={{ margin: "0 auto 20px" }} />
                    <p style={{ fontWeight: 700, color: "#94a3b8", fontSize: "18px" }}>{t('no_reviews_found') || "No reviews found."}</p>
                    <p style={{ color: "#475569", fontSize: "14px" }}>{t('no_reviews_sub') || "Client reviews will appear here once submitted."}</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                    {filteredReviews.map(review => (
                        <div key={review._id} style={{
                            background: "rgba(15,23,42,0.8)", backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px",
                            padding: "24px", display: "flex", flexDirection: "column",
                            position: "relative", transition: "transform 0.2s"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{
                                        width: "40px", height: "40px", borderRadius: "12px",
                                        background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "white", fontWeight: 800, fontSize: "16px"
                                    }}>
                                        {review.clientName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, color: "white", fontSize: "15px" }}>{review.clientName}</p>
                                        <div style={{ marginTop: "2px" }}>{formatRating(review.rating)}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(review._id)}
                                    disabled={actionLoading === review._id}
                                    style={{
                                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                                        color: "#f87171", padding: "8px", borderRadius: "10px",
                                        cursor: "pointer", transition: "all 0.2s"
                                    }}
                                >
                                    {actionLoading === review._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                </button>
                            </div>

                            <p style={{ 
                                margin: "0 0 20px", fontSize: "14px", color: "#94a3b8", lineHeight: 1.6,
                                fontStyle: "italic", flex: 1
                            }}>
                                "{review.comment}"
                            </p>

                            <div style={{ 
                                paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)",
                                display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569", fontSize: "11px" }}>
                                    <Calendar size={12} />
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569", fontSize: "11px" }}>
                                    <AlertCircle size={12} />
                                    {review.rating >= 4 ? "Positive" : "Critical"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
