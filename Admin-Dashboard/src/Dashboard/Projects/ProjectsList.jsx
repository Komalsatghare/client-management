import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLanguage } from "../../context/LanguageContext";

const ProjectsList = ({ setSelectedProject, initialFilter }) => {
  const { t } = useLanguage();
  const [projectsData, setProjectsData] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(initialFilter || "");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);

  // Inline status update state
  const [statusEditId, setStatusEditId] = useState(null);
  const [statusDraft, setStatusDraft] = useState("");

  const initialFormState = {
    name: '', clientId: '', status: 'Pending', startDate: '', endDate: '',
    deadline: '', budget: '', paymentDetails: '', notes: '', locationLink: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [existingImagesList, setExistingImagesList] = useState([]);

  useEffect(() => {
    setFilterStatus(initialFilter || "");
  }, [initialFilter]);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjectsData(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clients');
      setClients(res.data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditProjectId(null);
    setFormData(initialFormState);
    setImages([]);
    setExistingImagesList([]);
    setIsAddModalOpen(true);
  };

  const openEditModal = (project) => {
    setIsEditMode(true);
    setEditProjectId(project._id);

    // Format dates for html date input
    const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

    setFormData({
      name: project.name || '',
      clientId: project.clientId || '',
      status: project.status || 'Pending',
      startDate: formatDate(project.startDate),
      endDate: formatDate(project.endDate),
      deadline: project.deadline || '',
      budget: project.budget || '',
      paymentDetails: project.paymentDetails || '',
      notes: project.notes || '',
      locationLink: project.locationLink || ''
    });
    setImages([]);
    setExistingImagesList(project.images || []);
    setIsAddModalOpen(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/projects/${id}`, { status: newStatus });
      setStatusEditId(null);
      setStatusDraft("");
      fetchProjects();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleAddProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      images.forEach(img => {
        submitData.append('images', img);
      });

      if (isEditMode) {
        // Append existing images so they aren't lost
        existingImagesList.forEach(imgUrl => {
          submitData.append('existingImages', imgUrl);
        });
        await axios.put(`http://localhost:5000/api/projects/${editProjectId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5000/api/projects', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setIsAddModalOpen(false);
      setFormData(initialFormState);
      setImages([]);
      fetchProjects(); // refresh list
    } catch (err) {
      console.error("Failed to add project", err);
      alert("Failed to add project. Please try again.");
    }
  };

  const filteredProjects = projectsData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus ? p.status === filterStatus : true)
  );

  // Summary stats
  const totalProjects = projectsData.length;
  const activeProjects = projectsData.filter((p) => p.status === "Active").length;
  const completedProjects = projectsData.filter((p) => p.status === "Completed").length;
  const pendingApprovals = projectsData.filter((p) => p.status === "Pending").length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🏗️ {t('projects')}</h1>
          <p className="page-subtitle">{t('manage_projects_desc') || "Manage all construction projects, status and budgets"}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        {[
          { label: t('total_projects') || 'Total Projects', val: totalProjects, color: 'bg-blue', icon: '📁', filter: '' },
          { label: t('status_active') || 'Active', val: activeProjects, color: 'bg-green', icon: '⚡', filter: 'Active' },
          { label: t('status_completed') || 'Completed', val: completedProjects, color: 'bg-indigo', icon: '✅', filter: 'Completed' },
          { label: t('pending_approval') || 'Pending Approval', val: pendingApprovals, color: 'bg-yellow', icon: '⏳', filter: 'Pending' },
        ].map(card => (
          <div key={card.label} className="stat-card" onClick={() => setFilterStatus(card.filter)} style={{ cursor: 'pointer' }}>
            <div className="stat-content">
              <div className={`stat-icon-wrapper ${card.color}`} style={{ fontSize: 22 }}>{card.icon}</div>
              <div className="stat-info">
                <dt className="stat-label">{card.label}</dt>
                <dd className="stat-value">{card.val}</dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={openAddModal}>+ {t('add_new_project_btn') || "Add New Project"}</button>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: 12, color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 36, maxWidth: 260 }}
            placeholder={t('search_by_name_placeholder') || "Search by project name…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ maxWidth: 180 }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">{t('all_status') || "All Status"}</option>
          <option value="Pending">{t('status_pending') || "Pending"}</option>
          <option value="Active">{t('status_active') || "Active"}</option>
          <option value="Completed">{t('status_completed') || "Completed"}</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="section-card">
        <div className="section-card-header">
          <span className="section-card-title">{t('all_projects') || "All Projects"} ({filteredProjects.length})</span>
        </div>
        <table className="dark-table">
          <thead>
            <tr>
              <th>{t('project_name') || "Project Name"}</th>
              <th>{t('client') || "Client"}</th>
              <th>{t('status') || "Status"}</th>
              <th>{t('start_date') || "Start Date"}</th>
              <th>{t('end_date') || "End Date"}</th>
              <th>{t('budget') || "Budget"}</th>
              <th>{t('actions') || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#475569' }}>{t('no_projects_found') || "No projects found"}</td></tr>
            ) : filteredProjects.map((project, index) => (
              <tr key={index}>
                <td>{project.name}</td>
                <td>{project.clientId?.name || project.client || '—'}</td>
                <td>
                  {statusEditId === project._id ? (
                    <div className="status-edit-row">
                      <select value={statusDraft} onChange={e => setStatusDraft(e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button className="btn-status-save" onClick={() => handleUpdateStatus(project._id, statusDraft)}>{t('save_btn') || "Save"}</button>
                      <button className="btn-status-cancel" onClick={() => { setStatusEditId(null); setStatusDraft(''); }}>✕</button>
                    </div>
                  ) : (
                    <>
                      <span className={`status-badge ${project.status}`}>{t(`status_${project.status.toLowerCase()}`) || project.status}</span>
                      <button className="btn-update-status" onClick={() => { setStatusEditId(project._id); setStatusDraft(project.status || 'Pending'); }}>{t('update_status_btn') || "Update"}</button>
                    </>
                  )}
                </td>
                <td>{project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}</td>
                <td>{project.endDate ? new Date(project.endDate).toLocaleDateString() : '—'}</td>
                <td style={{ fontWeight: 700, color: '#34d399' }}>{project.budget || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-info btn-sm" onClick={() => setSelectedProject(project)}>{t('view_at') || "View"}</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(project)}>{t('edit') || "Edit"}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProject(project._id)}>{t('delete') || "Delete"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Project Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditMode ? '✏️ Edit Project' : '➕ Add New Project'}</h2>
            <p>{isEditMode ? 'Update the project details below.' : 'Fill in the details to create a new project.'}</p>
            <form onSubmit={handleAddProjectSubmit}>
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input className="form-input" type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Skyline Apartments" />
              </div>
              <div className="form-group">
                <label className="form-label">Assign Client (Optional)</label>
                <select className="form-select" name="clientId" value={formData.clientId} onChange={handleInputChange}>
                  <option value="">-- Select Client --</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>{client.name} ({client.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Budget</label>
                  <input className="form-input" type="text" name="budget" placeholder="e.g. ₹5,00,000" value={formData.budget} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input className="form-input" type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Deadline</label>
                  <input className="form-input" type="text" name="deadline" placeholder="e.g. 3 Months" value={formData.deadline} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{isEditMode ? 'Add More Images (optional)' : 'Project Images'}</label>
                <input className="form-input" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ padding: '7px' }} />
                {isEditMode && existingImagesList.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Current Images:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {existingImagesList.map((img, idx) => (
                        <div key={`existing-${idx}`} style={{ width: 60, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={`http://localhost:5000${img}`} alt="existing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    {images.map((img, idx) => (
                      <div key={idx} style={{ width: 80, height: 80, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" name="notes" rows="3" value={formData.notes} onChange={handleInputChange} placeholder="Project notes, special instructions…"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Project Location Link (Google Maps etc.)</label>
                <input className="form-input" type="text" name="locationLink" value={formData.locationLink} onChange={handleInputChange} placeholder="e.g. https://goo.gl/maps/..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save">{isEditMode ? '💾 Save Changes' : '✅ Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
