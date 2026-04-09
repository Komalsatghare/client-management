import { CheckCircle2, Circle, Clock, Building2 } from "lucide-react";
import "./ClientDashboard.css";
import { useLanguage } from "../context/LanguageContext";

export default function TrackProject() {
    const { t } = useLanguage();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Retrieve the logged-in client's ID (this should have been set during login)
    // To be safe and since login might not store clientId directly, we can fetch all client projects 
    // alternatively based on token authentication if backend was set up for it. 
    // Here we use the clientId if available in localStorage.
    const clientId = localStorage.getItem("clientId");

    useEffect(() => {
        const fetchMyProjects = async () => {
            try {
                if (!clientId) {
                    setError("Client ID not found. Please log in again.");
                    setLoading(false);
                    return;
                }
                const token = localStorage.getItem("authToken");
                const res = await axios.get(`http://localhost:5000/api/clients/${clientId}/projects`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(res.data);
                setError(null);
            } catch (err) {
                console.error("Failed to load tracking data:", err);
                setError("Failed to load your projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyProjects();
    }, [clientId]);

    if (loading) return <div className="p-4">{t('loading') || "Loading project timeline..."}</div>;
    if (error) return <div className="p-4 text-red-500">{t(error) || error}</div>;

    if (projects.length === 0) {
        return (
            <div className="client-timeline-wrapper">
                <div className="p-8 text-center text-gray-500">
                    <Building2 size={48} className="mx-auto mb-4 opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">{t('no_active_projects') || "No Projects Assigned Yet"}</h2>
                    <p>{t('no_projects_desc') || "When an admin assigns a project to you, its timeline will appear here."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="client-timeline-wrapper">
            {projects.map((project) => (
                <div key={project._id} style={{ marginBottom: '3rem' }}>
                    <div className="client-timeline-header">
                        <div className="client-timeline-header-icon">
                            <Building2 size={32} />
                        </div>
                        <div>
                            <h2 className="client-timeline-title">{project.name}</h2>
                            <p className="client-timeline-subtitle">{t('status') || "Status"}: {t(project.status.toLowerCase()) || project.status}</p>
                        </div>
                    </div>

                    <div className="client-timeline-container">
                        {/* Vertical Line */}
                        <div className="client-timeline-line" />

                        <div className="client-timeline-list">
                            {(!project.progress || project.progress.length === 0) ? (
                                <p style={{ paddingLeft: '2rem', color: '#666', fontStyle: 'italic' }}>
                                    No tracking milestones have been added for this project yet.
                                </p>
                            ) : (
                                project.progress.map((step, index) => {
                                    const isEven = index % 2 === 0;
                                    // Map backend string status to frontend visual class
                                    const statusClass = step.status === 'Completed' ? 'completed' :
                                        step.status === 'In Progress' ? 'in-progress' : 'pending';

                                    return (
                                        <div key={index} className={`client-timeline-item ${isEven ? 'even' : ''}`}>
                                            {/* Timeline Node */}
                                            <div className={`client-timeline-node ${statusClass}`}>
                                                {statusClass === 'completed' ? <CheckCircle2 size={16} /> :
                                                    statusClass === 'in-progress' ? <div className="client-timeline-pulse" /> :
                                                        <Circle size={16} />}
                                            </div>

                                            {/* Content Box */}
                                            <div className={`client-timeline-content ${statusClass}`}>
                                                <h3 className="client-timeline-box-title">{step.title}</h3>
                                                <p className="client-timeline-date" style={{ color: statusClass === 'in-progress' ? '#3b82f6' : '' }}>
                                                    <Clock size={14} />
                                                    {new Date(step.date).toLocaleDateString()}
                                                </p>
                                                <p className="client-timeline-desc">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Add More Steps Button Placeholder */}
                        <div style={{ padding: '20px 0 0 30px', textAlign: 'left' }}>
                            <button
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 16px', background: '#f8fafc',
                                    border: '1px dashed #cbd5e1', borderRadius: '6px',
                                    color: '#64748b', fontSize: '14px', cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                                onClick={() => alert("This functionality allows adding customized client-side steps or requesting project extensions.")}
                            >
                                <Circle size={16} /> Add more steps
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
