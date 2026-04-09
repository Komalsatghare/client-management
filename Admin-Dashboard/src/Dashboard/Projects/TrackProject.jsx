import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import './../dashboard.css';
import { useLanguage } from '../../context/LanguageContext';

const TrackProject = () => {
    const { t } = useLanguage();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedProjectId, setExpandedProjectId] = useState(null);

    // Milestone Modal State
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [selectedProjectForMilestone, setSelectedProjectForMilestone] = useState(null);
    const [milestoneForm, setMilestoneForm] = useState({
        title: '',
        description: '',
        status: 'Pending'
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5000/api/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(t('fail_load_projects') || 'Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMilestoneClick = (project) => {
        setSelectedProjectForMilestone(project);
        setMilestoneForm({ title: '', description: '', status: 'Pending' });
        setIsMilestoneModalOpen(true);
    };

    const handleMilestoneSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `http://localhost:5000/api/projects/${selectedProjectForMilestone._id}/progress`,
                milestoneForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsMilestoneModalOpen(false);
            fetchProjects(); // Refresh the list
        } catch (err) {
            console.error('Error adding milestone:', err);
            alert(t('fail_add_milestone') || 'Failed to add milestone.');
        }
    };

    const toggleProjectExpand = (id) => {
        if (expandedProjectId === id) {
            setExpandedProjectId(null);
        } else {
            setExpandedProjectId(id);
        }
    };

    const getStatusIndicator = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle size={16} className="text-success" />;
            case 'In Progress': return <Clock size={16} className="text-warning" />;
            default: return <Clock size={16} className="text-muted" />;
        }
    };

    if (loading) return <div>{t('loading_tracking') || "Loading project tracking data..."}</div>;
    if (error) return <div className="text-danger">{t(error) || error}</div>;

    return (
        <div className="track-project-container p-6">
            <h2 className="text-2xl font-bold mb-6">{t('track_active_projects_admin') || "Track Active Projects"}</h2>

            <div className="projects-list flex flex-col gap-4">
                {projects.length === 0 ? (
                    <p className="text-gray-500">{t('no_active_projects_found') || "No active projects found."}</p>
                ) : (
                    projects.map(project => (
                        <div key={project._id} className="project-tracking-card border rounded-lg p-4 bg-white shadow-sm">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => toggleProjectExpand(project._id)}
                            >
                                <div>
                                    <h3 className="text-xl font-semibold">{project.name}</h3>
                                    <p className="text-gray-500 text-sm">{t('client_id') || "Client ID"}: {project.clientId || t('unassigned') || 'Unassigned'}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {project.status}
                                    </span>
                                    {expandedProjectId === project._id ? <ChevronUp /> : <ChevronDown />}
                                </div>
                            </div>

                            {expandedProjectId === project._id && (
                                <div className="mt-6 border-t pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-medium">{t('timeline_milestones') || "Timeline & Milestones"}</h4>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddMilestoneClick(project);
                                            }}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                                        >
                                            <Plus size={16} /> {t('add_milestone_btn') || "Add Milestone"}
                                        </button>
                                    </div>

                                    <div className="timeline-container relative pl-4 border-l-2 border-gray-200 space-y-6">
                                        {(!project.progress || project.progress.length === 0) ? (
                                            <p className="text-gray-500 text-sm italic ml-4">{t('no_milestones_recorded') || "No milestones recorded yet."}</p>
                                        ) : (
                                            project.progress.map((milestone, idx) => (
                                                <div key={idx} className="timeline-item relative ml-4">
                                                    <div className="timeline-dot absolute w-3 h-3 bg-blue-500 rounded-full -left-[1.35rem] top-1.5 border-2 border-white"></div>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                                                                {milestone.title}
                                                                {getStatusIndicator(milestone.status)}
                                                            </h5>
                                                            <p className="text-gray-600 mt-1">{milestone.description}</p>
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex flex-col items-end">
                                                            <span>{new Date(milestone.date).toLocaleDateString()}</span>
                                                            <span className={`text-xs mt-1 ${milestone.status === 'Completed' ? 'text-green-600' :
                                                                milestone.status === 'In Progress' ? 'text-yellow-600' : 'text-gray-500'
                                                                }`}>{milestone.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Milestone Modal */}
            {isMilestoneModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add Milestone to {selectedProjectForMilestone?.name}</h3>
                        <form onSubmit={handleMilestoneSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={milestoneForm.title}
                                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                    value={milestoneForm.description}
                                    onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={milestoneForm.status}
                                    onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsMilestoneModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    {t('cancel') || "Cancel"}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {t('save_milestone') || "Save Milestone"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackProject;
