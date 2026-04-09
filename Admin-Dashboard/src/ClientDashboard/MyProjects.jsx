import { FolderGit2, Calendar, DollarSign, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function MyProjects() {
    const { t } = useLanguage();
    // Mock data for the client's projects
    const projects = [
        {
            id: 1,
            name: "Skyline Apartments",
            description: "High-rise luxury residential building.",
            status: "In Progress",
            startDate: "01 Jan 2026",
            endDate: "31 Dec 2026",
            budget: "₹5,00,00,000",
            progress: 35
        },
        {
            id: 2,
            name: "Oak Valley Residency",
            description: "Suburban family homes complex.",
            status: "Planning",
            startDate: "15 Apr 2026",
            endDate: "20 May 2027",
            budget: "₹2,50,00,000",
            progress: 10
        }
    ];

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f1f5f9", margin: 0 }}>
                    {t('my_active_projects') || "My Active Projects"}
                </h2>
            </div>
            <div className="client-projects-grid">
                {projects.map((project) => (
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
                            <span className="client-status-badge">
                                {project.status}
                            </span>
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
                ))}
            </div>
        </div>
    );
}
