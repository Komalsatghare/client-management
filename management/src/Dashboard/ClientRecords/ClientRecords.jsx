// ClientRecords.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import '../dashboard.css';


const ClientRecords = () => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClient, setCurrentClient] = useState({ id: null, name: '', email: '', phone: '', project: '', projectStatus: 'Not Started' });

    // Fetch clients on mount
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/clients`);
            setClients(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Failed to load clients.');
            setIsLoading(false);
        }
    };

    const openModal = (client = null) => {
        if (client) {
            setIsEditing(true);
            setCurrentClient(client);
        } else {
            setIsEditing(false);
            setCurrentClient({ id: null, name: '', email: '', phone: '', project: '', projectStatus: 'Not Started' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentClient({ id: null, name: '', email: '', phone: '', project: '', projectStatus: 'Not Started' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentClient({ ...currentClient, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Update existing client
                if (!currentClient._id) {
                    throw new Error("Client ID is missing for update");
                }
                const { _id, createdAt, updatedAt, __v, ...updateData } = currentClient; // Remove immutable fields
                const response = await axios.put(`${API_BASE_URL}/api/clients/${currentClient._id}`, updateData);
                setClients(clients.map(c => c._id === currentClient._id ? response.data : c));
            } else {
                // Add new client
                const response = await axios.post(`${API_BASE_URL}/api/clients`, currentClient);
                setClients([...clients, response.data]);
            }
            closeModal();
        } catch (err) {
            console.error('Error saving client:', err);
            setError(err.response?.data?.error || err.message || 'Failed to save client');
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error("Attempted to delete with invalid ID");
            return;
        }
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/clients/${id}`);
                setClients(clients.filter(c => c._id !== id));
            } catch (err) {
                console.error('Error deleting client:', err);
                setError(err.response?.data?.error || err.message || 'Failed to delete client');
            }
        }
    };

    // Filter clients based on search term
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.project && client.project.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="table-container">
            <div className="table-header">
                <h3 className="table-title">Client Records</h3>
                <div className="table-actions">
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            name="search"
                            className="search-input"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-secondary">
                        <Filter size={16} style={{ marginRight: '0.5rem' }} />
                        Filter
                    </button>
                    <button className="btn-primary" onClick={() => openModal()}>
                        <Plus size={16} style={{ marginRight: '0.5rem' }} />
                        Add Client
                    </button>
                </div>
            </div>

            {error && <div className="error-message" style={{ color: 'red', padding: '1rem' }}>{error}</div>}

            <div className="table-wrapper">
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading clients...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Project</th>
                                <th scope="col">Project Status</th>
                                <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client) => (
                                    <tr key={client._id || client.id}>
                                        <td className="cell-primary font-medium">{client.name}</td>
                                        <td className="cell-secondary">{client.email}</td>
                                        <td className="cell-secondary">{client.phone}</td>
                                        <td className="cell-secondary">{client.project}</td>
                                        <td>
                                            <span className={`status-badge ${client.projectStatus === 'Completed' ? 'status-active' : client.projectStatus === 'In Progress' ? 'status-inactive' : 'status-inactive'}`}>
                                                {client.projectStatus}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                onClick={() => openModal(client)}
                                                className="action-link"
                                                style={{ marginRight: '1rem' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(client._id || client.id)}
                                                className="action-link"
                                                style={{ color: '#ef4444' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No clients found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3 className="modal-title">{isEditing ? 'Edit Client' : 'Add New Client'}</h3>
                            <button onClick={closeModal} className="modal-close">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={currentClient.name}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={currentClient.email}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={currentClient.phone}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Project Name/Type</label>
                                    <input
                                        type="text"
                                        name="project"
                                        value={currentClient.project}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Project Status</label>
                                    <select
                                        name="projectStatus"
                                        value={currentClient.projectStatus}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {isEditing ? 'Update' : 'Add Client'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientRecords;
