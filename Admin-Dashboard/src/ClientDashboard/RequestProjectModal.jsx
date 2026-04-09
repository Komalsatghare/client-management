import { X, Upload, Calendar, IndianRupee, ListChecks } from 'lucide-react';
import axios from 'axios';
import "./ClientDashboard.css";
import { useLanguage } from "../context/LanguageContext";

export default function RequestProjectModal({ isOpen, onClose, onSuccess }) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        requirements: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const token = localStorage.getItem('clientAuthToken');
            await axios.post('http://localhost:5000/api/project-requests', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
            setFormData({ title: '', description: '', budget: '', deadline: '', requirements: '' });
        } catch (err) {
            setError(err.response?.data?.message || t('fail_submit_request') || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="req-modal-overlay">
            <div className="req-modal-content" style={{ maxWidth: "580px", maxHeight: "90vh", overflowY: "auto" }}>
                {/* Header */}
                <div className="req-modal-header">
                    <h2 className="req-modal-title">{t('request_project_btn') || "Request New Project"}</h2>
                    <button onClick={onClose} className="req-modal-close">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="req-modal-body">
                    {error && (
                        <div style={{ padding: "12px", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", border: "1px solid #fee2e2" }}>
                            {error}
                        </div>
                    )}

                    {/* Project Title */}
                    <div className="req-form-group">
                        <label className="req-form-label">{t('project_title_label') || "Project Title *"}</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Skyline Luxury Apartments"
                            className="req-form-input"
                            required
                        />
                    </div>

                    {/* Project Description */}
                    <div className="req-form-group">
                        <label className="req-form-label">{t('project_desc_label') || "Project Description *"}</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your project goals and overall vision..."
                            rows="3"
                            className="req-form-input"
                            required
                        />
                    </div>

                    {/* Requirements & Services */}
                    <div className="req-form-group">
                        <label className="req-form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <ListChecks size={16} />
                            {t('requirements_services') || "Requirements & Services Needed"}
                        </label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="List the specific requirements and services you need, e.g.&#10;- 3D architectural rendering&#10;- Interior design consultation&#10;- Structural engineering review"
                            rows="5"
                            className="req-form-input"
                            style={{ resize: "vertical" }}
                        />
                    </div>

                    {/* Budget + Deadline */}
                    <div className="req-form-row">
                        <div className="req-input-icon-wrapper">
                            <label className="req-form-label">{t('estimated_budget') || "Estimated Budget *"}</label>
                            <IndianRupee size={18} className="req-input-icon" style={{ top: "36px" }} />
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                placeholder="5000000"
                                className="req-form-input req-input-with-icon"
                                required
                            />
                        </div>

                        <div className="req-input-icon-wrapper">
                            <label className="req-form-label">{t('expected_deadline') || "Expected Deadline *"}</label>
                            <Calendar size={18} className="req-input-icon" style={{ top: "36px" }} />
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="req-form-input req-input-with-icon"
                                required
                            />
                        </div>
                    </div>

                    {/* Supporting Documents */}
                    <div className="req-form-group">
                        <label className="req-form-label">{t('supporting_docs') || "Supporting Documents (Optional)"}</label>
                        <div className="req-file-upload">
                            <Upload size={24} className="req-file-icon" />
                            <p className="req-file-text">{t('click_to_upload') || "Click to upload blueprints or docs"}</p>
                            <p className="req-file-subtext">{t('file_types') || "PDF, JPG, PNG up to 10MB"}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="req-modal-footer">
                        <button type="button" onClick={onClose} className="req-btn-secondary">{t('cancel') || "Cancel"}</button>
                        <button type="submit" disabled={loading} className="req-btn-primary">
                            {loading ? (t('submitting') || 'Submitting...') : (t('submit_request') || 'Submit Request')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
