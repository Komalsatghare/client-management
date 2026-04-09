import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";

const Inquiries = () => {
    const { t } = useLanguage();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/inquiries");
            setInquiries(response.data);
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/inquiries/${id}`);
            fetchInquiries();
        } catch (error) {
            console.error("Failed to delete inquiry:", error);
            alert("Failed to delete inquiry.");
        }
    };

    return (
        <div className="container" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ marginBottom: "20px" }}>{t('website_inquiries_title') || "Website Inquiries"}</h1>

            {loading ? (
                <p>{t('loading_inquiries') || "Loading inquiries..."}</p>
            ) : inquiries.length === 0 ? (
                <div style={{ padding: "30px", background: "#f8f9fa", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ color: "#666", fontSize: "16px" }}>{t('no_inquiries_found') || "No inquiries found."}</p>
                </div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
                        <thead style={{ background: "#f4f4f4" }}>
                            <tr>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{t('date_label') || "Date"}</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{t('name_label') || "Name"}</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{t('contact_info_label') || "Contact Info"}</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{t('service_involved_label') || "Service Involved"}</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{t('message_label') || "Message"}</th>
                                <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #ddd" }}>{t('actions_label') || "Actions"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry._id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "12px", verticalAlign: "top" }}>
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: "12px", verticalAlign: "top", fontWeight: "bold" }}>
                                        {inquiry.firstName} {inquiry.lastName}
                                    </td>
                                    <td style={{ padding: "12px", verticalAlign: "top" }}>
                                        <div>{inquiry.email}</div>
                                        <div style={{ color: "#666", fontSize: "0.9em", marginTop: "4px" }}>{inquiry.phone}</div>
                                    </td>
                                    <td style={{ padding: "12px", verticalAlign: "top" }}>
                                        <span style={{ display: "inline-block", background: "#e9ecef", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85em" }}>
                                            {inquiry.service}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px", verticalAlign: "top", maxWidth: "300px" }}>
                                        <p style={{ margin: 0, fontSize: "0.95em", lineHeight: "1.4" }}>
                                            {inquiry.message}
                                        </p>
                                    </td>
                                    <td style={{ padding: "12px", verticalAlign: "top", textAlign: "center" }}>
                                        <button
                                            onClick={() => handleDelete(inquiry._id)}
                                            style={{ background: "#dc3545", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85em" }}
                                        >
                                            {t('delete_btn') || "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Inquiries;
