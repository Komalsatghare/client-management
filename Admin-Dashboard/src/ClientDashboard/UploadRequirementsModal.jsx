import React, { useState } from "react";
import axios from "axios";

export default function UploadRequirementsModal({ isOpen, onClose, requestId, onSuccess }) {
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError("Please provide a description.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("clientAuthToken");
            const formData = new FormData();
            formData.append("requirementsDescription", description);
            images.forEach(img => formData.append("images", img));

            await axios.post(`http://localhost:5000/api/project-requests/${requestId}/requirements`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            onSuccess();
            onClose();
            setDescription("");
            setImages([]);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit requirements.");
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
                width: "100%", maxWidth: "520px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
            }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>
                    Upload Project Requirements
                </h2>
                <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "14px" }}>
                    Provide details and images for your approved project.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                            Requirements Description *
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={5}
                            placeholder="Describe your project requirements in detail..."
                            style={{
                                width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
                                borderRadius: "8px", fontSize: "14px", resize: "vertical",
                                outline: "none", boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                            Attachment Images (optional, max 5)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={e => setImages(Array.from(e.target.files).slice(0, 5))}
                            style={{ fontSize: "14px" }}
                        />
                        {images.length > 0 && (
                            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                                {images.length} image(s) selected
                            </p>
                        )}
                    </div>

                    {error && (
                        <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "16px" }}>{error}</p>
                    )}

                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1, padding: "10px", background: "#2563eb", color: "white",
                                border: "none", borderRadius: "8px", fontWeight: "600",
                                fontSize: "14px", cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? "Submitting..." : "Submit Requirements"}
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
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
