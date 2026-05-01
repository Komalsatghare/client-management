import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, CheckCircle, Clock, Activity, Image as ImageIcon, LayoutDashboard, Download, Maximize2, X } from "lucide-react";
import { API_BASE_URL, resolveUrl } from "../config";
import { useLanguage } from "../context/LanguageContext";

const ClientTrackProject = () => {
    const { t } = useLanguage();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [viewerImage, setViewerImage] = useState(null);

    const token = localStorage.getItem("clientAuthToken");

    useEffect(() => {
        fetchMyProjects();
    }, []);

    const fetchMyProjects = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/projects/my-projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
            if (res.data.length > 0) setExpandedId(res.data[0]._id);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError("Failed to load your projects.");
        } finally {
            setLoading(false);
        }
    };

    const calcProgress = (progress = []) => {
        if (!progress.length) return 0;
        const done = progress.filter(m => m.status === 'Completed').length;
        return Math.round((done / progress.length) * 100);
    };

    const MS_STATUS = {
        Completed:   { c:'#10b981', b:'rgba(16,185,129,0.12)',  bdr:'rgba(16,185,129,0.3)',  dot:'#10b981' },
        'In Progress':{ c:'#f59e0b', b:'rgba(245,158,11,0.12)', bdr:'rgba(245,158,11,0.3)',  dot:'#f59e0b' },
        Pending:     { c:'#64748b', b:'rgba(100,116,139,0.12)', bdr:'rgba(100,116,139,0.3)', dot:'#334155' },
    };

    const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

    if (loading) return (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div className="tp-spinner" style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.07)", borderTopColor: "#60a5fa", borderRadius: "50%", animation: "tpspin .8s linear infinite", margin: "0 auto 20px" }} />
            <p style={{ color: "#64748b", fontSize: "14px" }}>Fetching your project status...</p>
            <style>{`@keyframes tpspin { to{transform:rotate(360deg);} }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: "center", padding: "60px", background: "rgba(239,68,68,0.05)", borderRadius: "20px", border: "1px solid rgba(239,68,68,0.1)" }}>
            <p style={{ color: "#f87171", fontWeight: 700 }}>{error}</p>
            <button onClick={fetchMyProjects} style={{ marginTop: "12px", background: "none", border: "none", color: "#60a5fa", cursor: "pointer", textDecoration: "underline" }}>Try Again</button>
        </div>
    );

    if (projects.length === 0) return (
        <div style={{ textAlign: "center", padding: "80px 40px", background: "#ffffff", borderRadius: "20px", border: "1px dashed #cbd5e1" }}>
            <LayoutDashboard size={48} color="#94a3b8" style={{ margin: "0 auto 20px" }} />
            <p style={{ fontWeight: 700, color: "#334155", fontSize: "18px" }}>{t('no_active_projects') || "No active projects found."}</p>
            <p style={{ color: "#64748b", fontSize: "14px" }}>{t('no_active_projects_sub') || "Once your project starts, you can track milestones and progress here."}</p>
        </div>
    );

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px 40px", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {t('track_my_project') || "Project Tracking"}
                </h1>
                <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#64748b" }}>
                    {t('track_my_project_desc') || "Stay updated with real-time milestones and progress photos from our team."}
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {projects.map(project => {
                    const isOpen = expandedId === project._id;
                    const progress = calcProgress(project.progress);
                    
                    return (
                        <div key={project._id} style={{
                            background: "#ffffff",
                            backdropFilter: "blur(12px)",
                            border: "1px solid #e2e8f0",
                            borderRadius: "24px",
                            overflow: "hidden",
                            transition: "all 0.3s ease"
                        }}>
                            {/* Card Header */}
                            <div 
                                onClick={() => toggle(project._id)}
                                style={{
                                    padding: "24px", display: "flex", justifyContent: "space-between",
                                    alignItems: "center", cursor: "pointer", gap: "16px"
                                }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{project.name}</h3>
                                        <span style={{ 
                                            padding: "4px 12px", borderRadius: "999px", background: "rgba(96,165,250,0.1)",
                                            color: "#60a5fa", fontSize: "11px", fontWeight: 700, border: "1px solid rgba(96,165,250,0.2)"
                                        }}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div style={{ flex: 1, maxWidth: "240px", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "10px", overflow: "hidden" }}>
                                            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #3b82f6, #6366f1)", transition: "width 1s ease-out" }} />
                                        </div>
                                        <span style={{ fontSize: "13px", fontWeight: 800, color: "#60a5fa" }}>{progress}% Complete</span>
                                    </div>
                                </div>
                                <div style={{ 
                                    width: "40px", height: "40px", borderRadius: "12px",
                                    background: "rgba(0,0,0,0.03)", display: "flex", alignItems: "center",
                                    justifyContent: "center", color: "#64748b"
                                }}>
                                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isOpen && (
                                <div style={{ padding: "0 24px 24px", borderTop: "1px solid #e2e8f0" }}>
                                    <div style={{ padding: "24px 0" }}>
                                        <h4 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".1em" }}>
                                            Project Timeline
                                        </h4>
                                        
                                        {(!project.progress || project.progress.length === 0) ? (
                                            <p style={{ color: "#64748b", fontSize: "14px", fontStyle: "italic" }}>No milestones recorded yet.</p>
                                        ) : (
                                            <div style={{ position: "relative", paddingLeft: "32px", borderLeft: "2px solid #e2e8f0" }}>
                                                {project.progress.map((ms, idx) => {
                                                    const sc = MS_STATUS[ms.status] || MS_STATUS['Pending'];
                                                    return (
                                                        <div key={idx} style={{ position: "relative", marginBottom: "32px" }}>
                                                            {/* Dot */}
                                                            <div style={{
                                                                position: "absolute", left: "-41px", top: "4px",
                                                                width: "16px", height: "16px", borderRadius: "50%",
                                                                background: sc.dot, border: "4px solid #ffffff",
                                                                boxShadow: `0 0 10px ${sc.dot}66`, zIndex: 1
                                                            }} />
                                                            
                                                            <div style={{
                                                                background: "#f8fafc",
                                                                border: "1px solid #e2e8f0",
                                                                borderRadius: "16px", padding: "16px 20px"
                                                            }}>
                                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                                                    <h5 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{ms.title}</h5>
                                                                    <span style={{ 
                                                                        padding: "2px 10px", borderRadius: "6px", fontSize: "10px", 
                                                                        fontWeight: 800, color: sc.c, background: sc.b, border: `1px solid ${sc.bdr}`
                                                                    }}>
                                                                        {ms.status.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>{ms.description}</p>
                                                                
                                                                {/* Images */}
                                                                {ms.images && ms.images.length > 0 && (
                                                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px", marginBottom: "16px" }}>
                                                                        {ms.images.map((img, i) => (
                                                                            <div key={i} style={{ 
                                                                                position: "relative", aspectRatio: "1/1", borderRadius: "10px", 
                                                                                overflow: "hidden", cursor: "pointer", group: "true"
                                                                            }} onClick={() => setViewerImage(img)}>
                                                                                <img src={resolveUrl(img)} alt="Milestone" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} />
                                                                                <div style={{ 
                                                                                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", 
                                                                                    opacity: 0, display: "flex", alignItems: "center",
                                                                                    justifyContent: "center", transition: "opacity 0.2s"
                                                                                }} className="img-hover">
                                                                                    <Maximize2 size={20} color="white" />
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "12px" }}>
                                                                    <Clock size={12} />
                                                                    {new Date(ms.date).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Image Viewer Overlay */}
            {viewerImage && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(5,10,24,0.95)",
                    zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "40px", backdropFilter: "blur(10px)"
                }} onClick={() => setViewerImage(null)}>
                    <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: "100%", maxHeight: "100%" }}>
                        <button 
                            onClick={() => setViewerImage(null)}
                            style={{ position: "absolute", top: "-50px", right: 0, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", color: "white", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <X size={20} />
                        </button>
                        <button 
                            onClick={async () => {
                                try {
                                    const response = await fetch(resolveUrl(viewerImage));
                                    const blob = await response.blob();
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = viewerImage.split('/').pop() || 'project-photo.jpg';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                } catch (err) {
                                    console.error("Download failed", err);
                                    alert("Failed to download image.");
                                }
                            }}
                            style={{ position: "absolute", top: "-50px", left: 0, background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", padding: "8px 20px", borderRadius: "999px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700 }}
                        >
                            <Download size={16} /> Download Full Photo
                        </button>
                        <img src={resolveUrl(viewerImage)} alt="Full View" style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    </div>
                </div>
            )}

            <style>{`
                .img-hover:hover { opacity: 1 !important; }
            `}</style>
        </div>
    );
};

export default ClientTrackProject;
