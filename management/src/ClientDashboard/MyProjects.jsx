import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

import { FolderGit2, Calendar, DollarSign, Clock, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useStatusCfg } from "./RequestNewProject";

export default function MyProjects() {
    const { t } = useLanguage();
    const STATUS_CFG = useStatusCfg();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get(`${API_BASE_URL}/api/projects/my-projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f1f5f9", margin: 0 }}>
                    {t('my_active_projects') || "My Active Projects"}
                </h2>
            </div>
            <div className="client-projects-grid">
                {projects.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.08)" }}>
                        <h3 style={{ color: "#64748b", margin: 0 }}>{t('no_active_projects') || "No active projects found."}</h3>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="client-project-card">
                            <div className="client-card-header">
                                <div className="client-card-title-group">
                                    <div className="client-card-icon">
                                        <FolderGit2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="client-card-title">{project.name}</h3>
                                        <p className="client-card-desc">{project.description}</p>
                                    </div>
                                </div>
                                {(() => {
                                    const sc = STATUS_CFG[project.status] || { label: project.status, color: '#64748b' };
                                    return (
                                        <span className="client-status-badge" style={{ 
                                            background: `${sc.color}20`, 
                                            color: sc.color, 
                                            border: `1px solid ${sc.color}40`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {sc.icon} {sc.label}
                                        </span>
                                    );
                                })()}
                            </div>

                            <div className="client-card-metrics">
                                <div className="client-metric-item">
                                    <Calendar size={16} color="#94a3b8" />
                                    <div className="client-profile-text">
                                        <span className="client-metric-label">{t('start_date') || "Start Date"}</span>
                                        <span className="client-metric-value">{project.startDate}</span>
                                    </div>
                                </div>
                                <div className="client-metric-item">
                                    <Clock size={16} color="#94a3b8" />
                                    <div className="client-profile-text">
                                        <span className="client-metric-label">{t('end_date') || "End Date"}</span>
                                        <span className="client-metric-value">{project.endDate}</span>
                                    </div>
                                </div>
                                <div className="client-metric-item client-metric-full">
                                    <DollarSign size={16} color="#94a3b8" />
                                    <div className="client-profile-text" style={{ alignItems: 'flex-start' }}>
                                        <span className="client-metric-label">{t('total_budget') || "Total Budget"}</span>
                                        <span className="client-metric-value">{project.budget}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="client-progress-section">
                                <div className="client-progress-header">
                                    <span className="client-progress-label">{t('project_progress') || "Project Progress"}</span>
                                    <span className="client-progress-value">{project.progress}%</span>
                                </div>
                                <div className="client-progress-bar-bg">
                                    <div
                                        className="client-progress-bar-fill"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
