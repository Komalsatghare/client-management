import React, { useState, useEffect } from 'react';
import { Plus, X, Folder, Calendar, DollarSign, FileText, Image as ImageIcon, Eye, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import '../dashboard.css';


const Projects = ({ initialFilter = 'All' }) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [filterStatus, setFilterStatus] = useState(initialFilter);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setFilterStatus(initialFilter);
    }, [initialFilter]);

    // Form State
    const [currentProject, setCurrentProject] = useState({
        id: null,
        name: '',
        status: 'Pending',
        startDate: '',
        endDate: '',
        deadline: '', // New field for text-based duration
        budget: '', // Now text
        paymentDetails: '',
        services: [{ name: '', price: '' }], // Array of objects
        notes: '',
        locationLink: '',
        totalPaid: 0,
        remainingAmount: 0,
        images: []
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/projects`);
            setProjects(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject({ ...currentProject, [name]: value });
    };

    const handleServiceChange = (index, field, value) => {
        const newServices = [...currentProject.services];
        newServices[index][field] = value;
        setCurrentProject({ ...currentProject, services: newServices });
    };

    const addService = () => {
        setCurrentProject({ ...currentProject, services: [...currentProject.services, { name: '', price: '' }] });
    };

    const removeService = (index) => {
        const newServices = currentProject.services.filter((_, i) => i !== index);
        setCurrentProject({ ...currentProject, services: newServices });
    };

    const [viewImage, setViewImage] = useState(null); // State for full-size image view

    const openImageViewer = (src) => {
        setViewImage(src);
    };

    const closeImageViewer = () => {
        setViewImage(null);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Append new files to existing selection
        setSelectedImages(prev => [...prev, ...files]);

        // Create preview URLs for new files and append to existing previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imagePath) => {
        // Remove from currentProject.images
        const updatedImages = currentProject.images.filter(img => img !== imagePath);
        setCurrentProject({ ...currentProject, images: updatedImages });
    };

    const openModal = (project = null) => {
        if (project) {
            setIsEditing(true);
            setCurrentProject({
                ...project,
                // Ensure services is an array of objects
                services: Array.isArray(project.services) && project.services.length > 0
                    ? project.services
                    : [{ name: '', price: '' }],
                startDate: project.startDate ? project.startDate.split('T')[0] : '',
                endDate: project.endDate ? project.endDate.split('T')[0] : '',
            });
            // Don't set previewImages here, we render existing images separately
            setPreviewImages([]);
        } else {
            setIsEditing(false);
            setCurrentProject({
                id: null, name: '', status: 'Pending', startDate: '', endDate: '', deadline: '',
                budget: '', paymentDetails: '', services: [{ name: '', price: '' }], notes: '', 
                locationLink: '', totalPaid: 0, remainingAmount: 0, images: []
            });
            setPreviewImages([]);
        }
        setSelectedImages([]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDetailsOpen(false);
        setCurrentProject({
            id: null, name: '', status: 'Pending', startDate: '', endDate: '', deadline: '',
            budget: '', paymentDetails: '', services: [{ name: '', price: '' }], notes: '', 
            locationLink: '', totalPaid: 0, remainingAmount: 0, images: []
        });
        setPreviewImages([]);
        setSelectedImages([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', currentProject.name);
        formData.append('status', currentProject.status);
        formData.append('startDate', currentProject.startDate);
        formData.append('endDate', currentProject.endDate);
        formData.append('deadline', currentProject.deadline);
        formData.append('budget', currentProject.budget);
        formData.append('paymentDetails', currentProject.paymentDetails);
        formData.append('services', JSON.stringify(currentProject.services)); // Send as JSON string
        formData.append('notes', currentProject.notes);
        formData.append('locationLink', currentProject.locationLink);
        formData.append('totalPaid', currentProject.totalPaid);
        formData.append('remainingAmount', currentProject.remainingAmount);
        formData.append('totalBudget', currentProject.budget); // We'll treat budget as totalBudget for persistence

        // Append existing images (for updates)
        if (isEditing && currentProject.images && currentProject.images.length > 0) {
            currentProject.images.forEach(img => {
                formData.append('existingImages', img);
            });
        }

        // Append new images
        selectedImages.forEach(image => {
            formData.append('images', image);
        });

        try {
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/api/projects/${currentProject._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/projects`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchProjects();
            closeModal();
        } catch (err) {
            console.error('Error saving project:', err);
            alert('Failed to save project.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/projects/${id}`);
                fetchProjects();
            } catch (err) {
                console.error('Error deleting project:', err);
            }
        }
    };

    const openDetails = (project) => {
        setCurrentProject(project);
        setIsDetailsOpen(true);
    };

    const handleQuickUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('totalPaid', currentProject.totalPaid);
            formData.append('remainingAmount', currentProject.remainingAmount);
            formData.append('totalBudget', currentProject.budget);
            formData.append('locationLink', currentProject.locationLink);
            
            // Keep existing images
            if (currentProject.images) {
                currentProject.images.forEach(img => formData.append('existingImages', img));
            }

            await axios.put(`${API_BASE_URL}/api/projects/${currentProject._id}`, formData);
            fetchProjects();
            alert('Quick updates saved!');
        } catch (err) {
            console.error('Error in quick update:', err);
            alert('Failed to save quick updates.');
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="table-container">
            <div className="table-header">
                <h3 className="table-title">Projects</h3>
                <div className="table-actions">
                    <button className="btn-primary" onClick={() => openModal()}>
                        <Plus size={16} style={{ marginRight: '0.5rem' }} />
                        Add Project
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="filter-tabs" style={{ marginBottom: 0 }}>
                        {['All', 'Pending', 'Active', 'Completed', 'On Hold'].map(status => (
                            <button
                                key={status}
                                className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                                onClick={() => setFilterStatus(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <div className="search-wrapper" style={{ width: '100%', maxWidth: '300px' }}>
                        <div className="search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div> : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th scope="col">Project Name</th>
                                <th scope="col">Status</th>
                                <th scope="col">Budget</th>
                                <th scope="col">Timelines</th>
                                <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr key={project._id}>
                                    <td className="cell-primary font-medium">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Folder size={16} color="#6b7280" />
                                            {project.name}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${project.status === 'Completed' ? 'status-active' : project.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="cell-secondary">{project.budget || 'N/A'}</td>
                                    <td className="cell-secondary">
                                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                                            <span>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span>
                                            {project.endDate ? (
                                                <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                                            ) : (
                                                <span>Deadline: {project.deadline || 'N/A'}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => openDetails(project)} className="action-link" style={{ marginRight: '0.5rem' }} title="View Details">
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={() => openModal(project)} className="action-link" style={{ marginRight: '0.5rem' }} title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(project._id)} className="action-link" style={{ color: '#ef4444' }} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container" style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
                            <button onClick={closeModal} className="modal-close">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Project Name</label>
                                    <input type="text" name="name" value={currentProject.name} onChange={handleInputChange} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select name="status" value={currentProject.status} onChange={handleInputChange} className="form-select">
                                        <option value="Pending">Pending</option>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Start Date</label>
                                    <input type="date" name="startDate" value={currentProject.startDate ? currentProject.startDate.split('T')[0] : ''} onChange={handleInputChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Date (Optional)</label>
                                    <input type="date" name="endDate" value={currentProject.endDate ? currentProject.endDate.split('T')[0] : ''} onChange={handleInputChange} className="form-input" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Budget</label>
                                    <input type="text" name="budget" value={currentProject.budget} onChange={handleInputChange} className="form-input" placeholder="" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deadline / Duration (if no end date)</label>
                                    <input type="text" name="deadline" value={currentProject.deadline} onChange={handleInputChange} className="form-input" placeholder="" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Amount Paid</label>
                                    <input type="number" name="totalPaid" value={currentProject.totalPaid} onChange={handleInputChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Remaining Amount</label>
                                    <input type="number" name="remainingAmount" value={currentProject.remainingAmount} onChange={handleInputChange} className="form-input" />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Project Location Link (Google Maps)</label>
                                    <input type="text" name="locationLink" value={currentProject.locationLink} onChange={handleInputChange} className="form-input" placeholder="" />
                                </div>

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        Services & Pricing
                                        <button type="button" onClick={addService} className="action-link" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                            <Plus size={14} style={{ marginRight: '0.25rem' }} /> Add Service
                                        </button>
                                    </label>
                                    {currentProject.services.map((service, index) => (
                                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Service Name"
                                                value={service.name}
                                                onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                                                className="form-input"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Price"
                                                value={service.price}
                                                onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                                                className="form-input"
                                            />
                                            {currentProject.services.length > 1 && (
                                                <button type="button" onClick={() => removeService(index)} className="action-link" style={{ color: '#ef4444', alignSelf: 'center' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Payment Details</label>
                                    <textarea name="paymentDetails" value={currentProject.paymentDetails} onChange={handleInputChange} className="form-input" rows="2"></textarea>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Notes</label>
                                    <textarea name="notes" value={currentProject.notes} onChange={handleInputChange} className="form-input" rows="3"></textarea>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Project Images</label>
                                    <input type="file" multiple onChange={handleImageChange} className="form-input" accept="image/*" />

                                    <div style={{ marginTop: '0.5rem' }}>
                                        {/* Existing Images */}
                                        {isEditing && currentProject.images && currentProject.images.length > 0 && (
                                            <div style={{ marginBottom: '0.5rem' }}>
                                                <small style={{ color: '#6b7280' }}>Existing Images:</small>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                                    {currentProject.images.map((img, index) => (
                                                        <div key={`existing-${index}`} style={{ position: 'relative' }}>
                                                            <img
                                                                src={`${API_BASE_URL}${img}`}
                                                                alt="Existing"
                                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                                                                onClick={() => openImageViewer(`${API_BASE_URL}${img}`)}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage(img)}
                                                                style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontSize: '10px' }}
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* New Images */}
                                        {previewImages.length > 0 && (
                                            <div>
                                                <small style={{ color: '#6b7280' }}>New Images to Upload:</small>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                                    {previewImages.map((src, index) => (
                                                        <div key={`new-${index}`} style={{ position: 'relative' }}>
                                                            <img
                                                                src={src}
                                                                alt="New Preview"
                                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                                                                onClick={() => openImageViewer(src)}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewImage(index)}
                                                                style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontSize: '10px' }}
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">{isEditing ? 'Update Project' : 'Create Project'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isDetailsOpen && currentProject && (
                <div className="modal-overlay">
                    <div className="modal-container" style={{ maxWidth: '900px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">{currentProject.name}</h3>
                            <button onClick={closeModal} className="modal-close">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Project Details</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div><strong>Status:</strong> {currentProject.status}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <strong>Budget:</strong> 
                                            <input type="text" name="budget" value={currentProject.budget} onChange={handleInputChange} className="form-input" style={{ padding: '0.25rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <strong>Amount Paid:</strong> 
                                            <input type="number" name="totalPaid" value={currentProject.totalPaid} onChange={handleInputChange} className="form-input" style={{ padding: '0.25rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <strong>Remaining Amount:</strong> 
                                            <input type="number" name="remainingAmount" value={currentProject.remainingAmount} onChange={handleInputChange} className="form-input" style={{ padding: '0.25rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: '1 / -1' }}>
                                            <strong>Location Link:</strong> 
                                            <input type="text" name="locationLink" value={currentProject.locationLink} onChange={handleInputChange} className="form-input" style={{ padding: '0.25rem' }} placeholder="Maps Link" />
                                            {currentProject.locationLink && (
                                                <a href={currentProject.locationLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>View on Maps</a>
                                            )}
                                        </div>
                                        <div><strong>Start Date:</strong> {new Date(currentProject.startDate).toLocaleDateString()}</div>
                                        <div><strong>End Date:</strong> {currentProject.endDate ? new Date(currentProject.endDate).toLocaleDateString() : currentProject.deadline}</div>
                                    </div>
                                    
                                    <button onClick={handleQuickUpdate} className="btn-primary" style={{ marginBottom: '1.5rem', width: '100%', padding: '0.5rem' }}>
                                        💾 Save Financial/Location Updates
                                    </button>

                                    <h4 style={{ marginBottom: '0.5rem' }}>Services</h4>
                                    <div style={{ marginBottom: '1.5rem', border: '1px solid #f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left' }}>
                                                    <th style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem' }}>Service</th>
                                                    <th style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem' }}>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentProject.services && currentProject.services.length > 0 ? (
                                                    currentProject.services.map((service, index) => (
                                                        <tr key={index} style={{ borderBottom: index < currentProject.services.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                                                            <td style={{ padding: '0.5rem', fontSize: '0.9rem' }}>{service.name}</td>
                                                            <td style={{ padding: '0.5rem', fontSize: '0.9rem' }}>{service.price}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="2" style={{ padding: '0.5rem' }}>No services listed</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <h4 style={{ marginBottom: '0.5rem' }}>Payment Details</h4>
                                    <p style={{ marginBottom: '1.5rem', color: '#666' }}>{currentProject.paymentDetails || 'No payment details provided.'}</p>

                                    <h4 style={{ marginBottom: '0.5rem' }}>Notes</h4>
                                    <p style={{ color: '#666' }}>{currentProject.notes || 'No notes.'}</p>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '1rem' }}>Images</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                        {currentProject.images && currentProject.images.length > 0 ? (
                                            currentProject.images.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={`${API_BASE_URL}${img}`}
                                                    alt={`Project ${index + 1}`}
                                                    style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee', cursor: 'pointer' }}
                                                    onClick={() => openImageViewer(`${API_BASE_URL}${img}`)}
                                                />
                                            ))
                                        ) : (
                                            <p style={{ color: '#999', fontStyle: 'italic' }}>No images uploaded.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={closeModal} className="btn-secondary">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Screen Image Viewer */}
            {viewImage && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 60,
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                    onClick={closeImageViewer}
                >
                    <button
                        onClick={closeImageViewer}
                        style={{
                            position: 'absolute', top: '20px', right: '30px',
                            background: 'transparent', border: 'none', color: 'white',
                            fontSize: '2rem', cursor: 'pointer'
                        }}
                    >
                        <X size={32} />
                    </button>
                    {/* DOWNLOAD BUTTON */}
                    <a
                        href={viewImage}
                        download
                        style={{
                            position: 'absolute', top: '25px', left: '30px',
                            background: '#312e81', color: 'white', padding: '10px 20px',
                            borderRadius: '6px', textDecoration: 'none', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: '8px', zIndex: 100
                        }}
                        onClick={(e) => {
                            // Simple download trigger
                            const link = document.createElement('a');
                            link.href = viewImage;
                            link.download = 'project-image.jpg';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download Full Photo
                    </a>
                    <img
                        src={viewImage}
                        alt="Full Size"
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
                    />
                </div>
            )}
        </div>
    );
};

export default Projects;
