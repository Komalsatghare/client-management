import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import DashboardHome from "./Frontpage/DashboardHome";
import ClientRecords from "./ClientRecords/ClientRecords";
import Payments from "./Payments/Payments";
import Settings from "./Settings/Settings";
import UserProfile from "./profile/UserProfile";
import ProjectRequests from "./ProjectRequests";
import TrackProject from "./Projects/TrackProject";
import Inquiries from "./Inquiries/Inquiries";
import { API_BASE_URL } from "../config";
import "./dashboard.css";
import axios from 'axios';
import UploadAgreement from '../components/UploadAgreement';

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFilter, setProjectFilter] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [adminData, setAdminData] = useState({
    name: localStorage.getItem("adminName") || "Admin User",
    email: localStorage.getItem("adminEmail") || "admin@example.com",
    avatar: ""
  });

  const handleNavClick = (section) => {
    setProjectFilter("");
    setSelectedProject(null);
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.user) {
        const { name, email, username } = res.data.user;
        setAdminData({ name, email, avatar: "" });
        localStorage.setItem("adminName", name || "");
        localStorage.setItem("adminEmail", email || "");
        localStorage.setItem("adminUsername", username || "");
      }
    } catch (err) {
      console.error("Error fetching admin profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Simulate auth check
    const token = localStorage.getItem("authToken");
    if (!token) {
      // navigate('/login'); // implement if you have login
    }
  }, []);

  // Projects Data
  const projectsData = [
    {
      name: "Skyline Apartments",
      client: "ABC Developers",
      status: "Active",
      startDate: "01 Jan 2026",
      endDate: "31 Dec 2026",
      budget: "₹5,00,00,000",
    },
    {
      name: "Bridge Renovation",
      client: "City Infrastructure",
      status: "Completed",
      startDate: "01 Mar 2025",
      endDate: "30 Sep 2025",
      budget: "₹2,50,00,000",
    },
    {
      name: "Industrial Complex",
      client: "XYZ Industries",
      status: "Active",
      startDate: "01 May 2026",
      endDate: "30 Mar 2027",
      budget: "₹8,00,00,000",
    },
  ];

  // Dynamic Content Renderer
  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardHome onStatClick={(section, filter) => {
          setProjectFilter(filter || "");
          setSelectedProject(null);
          setActiveSection(section);
        }} />;
      case "Client Records":
        return <ClientRecords />;
      case "Project Requests":
        return <ProjectRequests />;
      case "Projects":
        return selectedProject ? (
          <ProjectDetails
            project={selectedProject}
            goBack={() => setSelectedProject(null)}
          />
        ) : (
          <Projects
            projectsData={projectsData}
            setSelectedProject={setSelectedProject}
            initialFilter={projectFilter}
          />
        );
      case "Track My Project":
        return <TrackProject />;
      case "Payments":
        return <Payments />;
      case "Inquiries":
        return <Inquiries />;
      case "Public Projects":
        return <PublicProjectsManager />;
      case "Settings":
        return <Settings />;
      case "My Profile":
        return <UserProfile onProfileUpdate={fetchProfile} />;
      case "Agreements":
        return <UploadAgreement uploadedByRole="admin" uploadedByName={adminData.name} />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
          activeSection={activeSection} 
          setActiveSection={handleNavClick} 
          adminData={adminData}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
      />
      {/* Main Content */}
      <div className="dashboard-main-content">
        {/* Top Navbar */}
        <TopNavbar 
            activeSection={activeSection} 
            setActiveSection={handleNavClick} 
            adminData={adminData}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Content Area */}
        <main className="dashboard-content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

// -----------------------------
// Projects Component
// -----------------------------

const Projects = ({ setSelectedProject, initialFilter }) => {
  const [projectsData, setProjectsData] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(initialFilter || "");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);

  // Form State
  const initialFormState = {
    name: '', clientId: '', status: 'Pending', startDate: '', endDate: '',
    deadline: '', budget: '', paymentDetails: '', notes: ''
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
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjectsData(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      notes: project.notes || ''
    });
    setImages([]);
    setExistingImagesList(project.images || []);
    setIsAddModalOpen(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      await axios.delete(`${API_BASE_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project. Please try again.");
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

      const token = localStorage.getItem("authToken");
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      if (isEditMode) {
        // Append existing images so they aren't lost
        existingImagesList.forEach(imgUrl => {
          submitData.append('existingImages', imgUrl);
        });
        await axios.put(`${API_BASE_URL}/api/projects/${editProjectId}`, submitData, config);
      } else {
        await axios.post(`${API_BASE_URL}/api/projects`, submitData, config);
      }

      setIsAddModalOpen(false);
      setFormData(initialFormState);
      setImages([]);
      fetchProjects(); // refresh list
    } catch (err) {
      console.error("Failed to default add project", err);
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
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", maxWidth: '1200px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .proj-stat { background:rgba(15,23,42,0.8); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:18px 20px; cursor:pointer; transition:all 0.2s; }
        .proj-stat:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.35); }
        .proj-stat.sel { border-color:rgba(96,165,250,0.4); box-shadow:0 0 0 1px rgba(96,165,250,0.15); }
        .proj-stat-num { font-size:30px; font-weight:800; margin:6px 0 0; }
        .proj-stat-lbl { font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.06em; }
        .proj-fsel { padding:9px 14px; border:1px solid rgba(255,255,255,0.1); border-radius:9px; font-size:13px; outline:none; background:rgba(255,255,255,0.04); color:#e2e8f0; font-family:inherit; transition:all .2s; cursor:pointer; color-scheme:dark; }
        .proj-fsel:focus { border-color:rgba(96,165,250,0.4); }
        .proj-fsel option { background:#1e293b; }
        .proj-act-btn { display:inline-flex; align-items:center; gap:4px; padding:5px 12px; border:none; border-radius:7px; font-size:12px; font-weight:600; cursor:pointer; transition:all .18s; font-family:inherit; }
        .proj-act-btn:hover { transform:scale(1.04); }
        .proj-dark-modal { background:#0f172a; border:1px solid rgba(255,255,255,0.1); border-radius:16px; width:90%; max-width:620px; max-height:90vh; overflow-y:auto; padding:28px; box-shadow:0 24px 60px rgba(0,0,0,0.7); }
        .proj-form-lbl { display:block; margin-bottom:6px; font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.06em; }
        .proj-form-inp { width:100%; padding:10px 13px; border:1px solid rgba(255,255,255,0.1); border-radius:9px; font-size:13px; outline:none; background:rgba(255,255,255,0.04); color:#e2e8f0; font-family:inherit; box-sizing:border-box; transition:all .2s; color-scheme:dark; }
        .proj-form-inp::placeholder { color:#475569; }
        .proj-form-inp:focus { border-color:rgba(96,165,250,0.4); background:rgba(96,165,250,0.06); box-shadow:0 0 0 3px rgba(96,165,250,0.1); }
        .proj-form-inp option { background:#1e293b; }
        .proj-empty { text-align:center; padding:60px; color:#475569; background:rgba(15,23,42,0.6); border-radius:14px; border:1px solid rgba(255,255,255,0.06); }
        
        @media (max-width: 600px) {
          .proj-dark-modal { padding: 20px; }
          .modal-row-flex { flex-direction: column; gap: 14px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'24px', fontWeight:800, background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Projects Dashboard</h1>
          <p style={{ margin:'4px 0 0', fontSize:'13px', color:'#64748b' }}>Manage and track all your projects</p>
        </div>
        <button onClick={openAddModal} className="btn-primary" style={{ padding:'10px 20px', gap:'6px' }}>+ Add New Project</button>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Total Projects',   value:totalProjects,    color:'#60a5fa', filter:''          },
          { label:'Active',           value:activeProjects,   color:'#10b981', filter:'Active'    },
          { label:'Completed',        value:completedProjects,color:'#818cf8', filter:'Completed' },
          { label:'Pending',          value:pendingApprovals, color:'#f59e0b', filter:'Pending'   },
        ].map(c => (
          <div key={c.label} className={`proj-stat${filterStatus===c.filter?' sel':''}`} onClick={()=>setFilterStatus(c.filter)}>
            <p className="proj-stat-lbl">{c.label}</p>
            <p className="proj-stat-num" style={{ color:c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'18px', flexWrap:'wrap' }}>
        <div className="search-wrapper" style={{ flex:1, minWidth:'200px' }}>
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search by project name…" value={search} onChange={e=>setSearch(e.target.value)} className="search-input" style={{ width:'100%' }} />
        </div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="proj-fsel">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      {/* Table */}
      {filteredProjects.length === 0 ? (
        <div className="proj-empty">
          <p style={{ fontSize:36, margin:'0 0 10px' }}>🏗️</p>
          <p style={{ fontWeight:700, color:'#475569', margin:0 }}>No projects found</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Budget</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => {
                  const sc = project.status==='Active' ? {c:'#10b981',b:'rgba(16,185,129,0.12)',bdr:'rgba(16,185,129,0.25)'}
                           : project.status==='Completed' ? {c:'#60a5fa',b:'rgba(96,165,250,0.12)',bdr:'rgba(96,165,250,0.25)'}
                           : project.status==='On Hold' ? {c:'#94a3b8',b:'rgba(148,163,184,0.12)',bdr:'rgba(148,163,184,0.25)'}
                           : {c:'#f59e0b',b:'rgba(245,158,11,0.12)',bdr:'rgba(245,158,11,0.25)'};
                  return (
                    <tr key={index}>
                      <td><span className="cell-primary">{project.name}</span></td>
                      <td><span className="cell-secondary">{project.client || '—'}</span></td>
                      <td>
                        <span style={{ padding:'4px 12px', borderRadius:'999px', fontSize:'11px', fontWeight:700, color:sc.c, background:sc.b, border:`1px solid ${sc.bdr}` }}>
                          {project.status}
                        </span>
                      </td>
                      <td><span className="cell-secondary">{project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}</span></td>
                      <td><span className="cell-primary">₹{project.budget || '—'}</span></td>
                      <td>
                        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                          <button className="proj-act-btn" onClick={()=>setSelectedProject(project)} style={{ background:'rgba(96,165,250,0.12)',color:'#60a5fa',border:'1px solid rgba(96,165,250,0.25)' }}>View</button>
                          <button className="proj-act-btn" onClick={()=>openEditModal(project)} style={{ background:'rgba(167,139,250,0.12)',color:'#a78bfa',border:'1px solid rgba(167,139,250,0.25)' }}>Edit</button>
                          <button className="proj-act-btn" onClick={()=>handleDeleteProject(project._id)} style={{ background:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.2)' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="proj-dark-modal">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'22px' }}>
              <h2 style={{ margin:0, fontSize:'18px', fontWeight:700, background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {isEditMode ? '✏️ Edit Project' : '➕ Add New Project'}
              </h2>
              <button onClick={()=>setIsAddModalOpen(false)} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#94a3b8',borderRadius:'8px',padding:'6px 10px',cursor:'pointer',fontSize:'16px' }}>✕</button>
            </div>
            <form onSubmit={handleAddProjectSubmit}>
              <div style={{ marginBottom:14 }}>
                <label className="proj-form-lbl">Project Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="proj-form-inp" placeholder="e.g. Skyline Apartments" />
              </div>
              <div style={{ marginBottom:14 }}>
                <label className="proj-form-lbl">Assign Client (Optional)</label>
                <select name="clientId" value={formData.clientId} onChange={handleInputChange} className="proj-form-inp">
                  <option value="">-- Select Client --</option>
                  {clients.map(c=><option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
                </select>
              </div>
              <div className="modal-row-flex" style={{ display:'flex', gap:'10px', marginBottom:14 }}>
                <div style={{ flex:1 }}>
                  <label className="proj-form-lbl">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="proj-form-inp">
                    <option value="Pending">Pending</option><option value="Active">Active</option>
                    <option value="On Hold">On Hold</option><option value="Completed">Completed</option>
                  </select>
                </div>
                <div style={{ flex:1 }}>
                  <label className="proj-form-lbl">Budget</label>
                  <input type="text" name="budget" placeholder="e.g. ₹5,00,000" value={formData.budget} onChange={handleInputChange} className="proj-form-inp" />
                </div>
              </div>
              <div className="modal-row-flex" style={{ display:'flex', gap:'10px', marginBottom:14 }}>
                <div style={{ flex:1 }}>
                  <label className="proj-form-lbl">Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="proj-form-inp" />
                </div>
                <div style={{ flex:1 }}>
                  <label className="proj-form-lbl">Expected Deadline</label>
                  <input type="text" name="deadline" placeholder="e.g. 3 Months" value={formData.deadline} onChange={handleInputChange} className="proj-form-inp" />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label className="proj-form-lbl">{isEditMode ? 'Add More Images (optional)' : 'Project Images'}</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="proj-form-inp" style={{ paddingTop:'7px' }} />
                {isEditMode && existingImagesList.length > 0 && (
                  <div style={{ marginTop:'8px' }}>
                    <p style={{ fontSize:'11px', color:'#64748b', marginBottom:'6px' }}>Current Images:</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                      {existingImagesList.map((img,idx)=>(
                        <div key={`e-${idx}`} style={{ width:'56px', height:'56px', borderRadius:'6px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)' }}>
                          <img src={`${API_BASE_URL}${img}`} alt="existing" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {images.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'8px' }}>
                    {images.map((img,idx)=>(
                      <div key={idx} style={{ width:'72px', height:'72px', borderRadius:'6px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)' }}>
                        <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginBottom:14 }}>
                <label className="proj-form-lbl">Notes</label>
                <textarea name="notes" rows="3" value={formData.notes} onChange={handleInputChange} className="proj-form-inp" style={{ resize:'vertical' }} placeholder="Any additional notes…" />
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', paddingTop:'18px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <button type="button" onClick={()=>setIsAddModalOpen(false)} style={{ padding:'9px 18px', background:'rgba(255,255,255,0.05)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'13px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding:'9px 22px' }}>{isEditMode ? 'Save Changes' : 'Save Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------
// Project Details Component
// -----------------------------
const ProjectDetails = ({ project, goBack }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: 'Bank Transfer',
    notes: ''
  });

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${API_BASE_URL}/api/payments`, {
        projectId: project._id,
        clientId: project.clientId,
        amount: Number(paymentData.amount),
        paymentMode: paymentData.paymentMode,
        notes: paymentData.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Payment recorded successfully! Invoice generated.");
      setIsPaymentModalOpen(false);
      setPaymentData({ amount: '', paymentMode: 'Bank Transfer', notes: '' });
      // In a full implementation, you'd want to refresh the specific project data here
      // For now, goBack() triggers a re-render of the list on the next click
    } catch (err) {
      console.error("Failed to record payment", err);
      alert("Failed to record payment. Please try again.");
    }
  };

  const paymentStatusColor = project.paymentStatus === 'completed' ? { c:'#10b981', b:'rgba(16,185,129,0.12)', bdr:'rgba(16,185,129,0.3)' }
    : project.paymentStatus === 'partial' ? { c:'#f59e0b', b:'rgba(245,158,11,0.12)', bdr:'rgba(245,158,11,0.3)' }
    : { c:'#f87171', b:'rgba(239,68,68,0.12)', bdr:'rgba(239,68,68,0.3)' };
  const projStatusColor = project.status === 'Active' ? { c:'#10b981', b:'rgba(16,185,129,0.12)', bdr:'rgba(16,185,129,0.3)' }
    : project.status === 'Completed' ? { c:'#60a5fa', b:'rgba(96,165,250,0.12)', bdr:'rgba(96,165,250,0.3)' }
    : { c:'#f59e0b', b:'rgba(245,158,11,0.12)', bdr:'rgba(245,158,11,0.3)' };

  return (
    <div style={{ padding:'24px', fontFamily:"'Inter',sans-serif", color:'#e2e8f0' }}>
      {/* Back */}
      <button onClick={goBack} style={{ display:'inline-flex', alignItems:'center', gap:'7px', marginBottom:'22px', padding:'9px 18px', background:'rgba(255,255,255,0.05)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'13px', transition:'all .2s' }}
        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.09)';e.currentTarget.style.color='#e2e8f0';}}
        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='#94a3b8';}}>
        ← Back to Projects
      </button>

      <div style={{ background:'rgba(15,23,42,0.8)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', overflow:'hidden', backdropFilter:'blur(10px)' }}>
        {/* Card Header */}
        <div style={{ padding:'24px 28px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h2 style={{ margin:0, fontSize:'22px', fontWeight:800, background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{project.name}</h2>
            <p style={{ margin:'4px 0 0', fontSize:'13px', color:'#64748b' }}>Project Details & Payment Overview</p>
          </div>
          <button onClick={()=>setIsPaymentModalOpen(true)} className="btn-primary" style={{ padding:'10px 20px', gap:'6px', background:'linear-gradient(135deg,#059669,#10b981)', boxShadow:'0 4px 14px rgba(16,185,129,0.3)' }}>
            + Add Payment / Generate Bill
          </button>
        </div>

        <div style={{ padding:'28px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
          {/* Left col */}
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <p style={{ margin:'0 0 4px', fontSize:'11px', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'.06em' }}>Client</p>
              <p style={{ margin:0, fontSize:'14px', fontWeight:600, color:'#e2e8f0' }}>{project.clientId || project.client || 'N/A'}</p>
            </div>
            <div>
              <p style={{ margin:'0 0 6px', fontSize:'11px', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'.06em' }}>Project Status</p>
              <span style={{ padding:'5px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:700, color:projStatusColor.c, background:projStatusColor.b, border:`1px solid ${projStatusColor.bdr}` }}>{project.status}</span>
            </div>
            <div>
              <p style={{ margin:'0 0 6px', fontSize:'11px', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'.06em' }}>Payment Status</p>
              <span style={{ padding:'5px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:700, color:paymentStatusColor.c, background:paymentStatusColor.b, border:`1px solid ${paymentStatusColor.bdr}` }}>{project.paymentStatus ? project.paymentStatus.toUpperCase() : 'PENDING'}</span>
            </div>
            <div>
              <p style={{ margin:'0 0 4px', fontSize:'11px', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'.06em' }}>Start Date</p>
              <p style={{ margin:0, fontSize:'14px', color:'#94a3b8' }}>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p style={{ margin:'0 0 4px', fontSize:'11px', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'.06em' }}>Expected Deadline</p>
              <p style={{ margin:0, fontSize:'14px', color:'#94a3b8' }}>{project.deadline || 'N/A'}</p>
            </div>
          </div>

          {/* Right col — Budget */}
          <div>
            <div style={{ background:'rgba(99,102,241,0.07)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'12px', padding:'20px', marginBottom:'16px' }}>
              <p style={{ margin:'0 0 14px', fontSize:'13px', fontWeight:700, color:'#818cf8' }}>💰 Budget Overview</p>
              {[
                { label:'Total Budget', val:`₹${project.totalBudget||project.budget||0}`, color:'#e2e8f0' },
                { label:'Amount Paid',  val:`₹${project.totalPaid||0}`,                  color:'#10b981' },
                { label:'Remaining',    val:`₹${project.remainingAmount||(Number(project.budget)||0)}`, color:'#f87171' },
              ].map(row=>(
                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize:'13px', color:'#64748b' }}>{row.label}</span>
                  <span style={{ fontSize:'15px', fontWeight:700, color:row.color }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        {project.notes && (
          <div style={{ margin:'0 28px 24px', padding:'16px', background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.18)', borderRadius:'12px', borderLeft:'3px solid #3b82f6' }}>
            <p style={{ margin:'0 0 8px', fontWeight:700, fontSize:'13px', color:'#60a5fa' }}>📝 Project Notes</p>
            <p style={{ margin:0, color:'#94a3b8', lineHeight:'1.65', fontSize:'13px' }}>{project.notes}</p>
          </div>
        )}

        {/* Images */}
        <div style={{ padding:'0 28px 28px' }}>
          <p style={{ margin:'0 0 14px', fontWeight:700, fontSize:'14px', color:'#e2e8f0', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'20px' }}>Attached Images</p>
          {project.images && project.images.length > 0 ? (
            <div style={{ display:'flex', flexWrap:'wrap', gap:'14px' }}>
              {project.images.map((img,index)=>(
                <div key={index} style={{ width:'200px', height:'140px', borderRadius:'10px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 4px 14px rgba(0,0,0,0.3)' }}>
                  <img src={`${API_BASE_URL}${img}`} alt={`Project Img ${index+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.onerror=null;e.target.src='https://placehold.co/400x300/1e293b/94a3b8?text=No+Image'}} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color:'#475569', fontStyle:'italic', fontSize:'13px', margin:0 }}>No images uploaded for this project.</p>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', width:'90%', maxWidth:'420px', padding:'28px', boxShadow:'0 24px 60px rgba(0,0,0,0.7)', fontFamily:"'Inter',sans-serif" }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ margin:0, fontSize:'18px', fontWeight:700, background:'linear-gradient(135deg,#10b981,#059669)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Add Offline Payment</h2>
              <button onClick={()=>setIsPaymentModalOpen(false)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', fontSize:'16px' }}>✕</button>
            </div>
            <p style={{ fontSize:'13px', color:'#64748b', marginBottom:'18px' }}>Recording a payment will automatically generate a PDF invoice.</p>
            <form onSubmit={handlePaymentSubmit}>
              {[
                { label:'Amount (₹) *', type:'number', val:paymentData.amount, onChange:e=>setPaymentData({...paymentData,amount:e.target.value}), placeholder:'e.g. 50000', required:true },
              ].map(f=>(
                <div key={f.label} style={{ marginBottom:14 }}>
                  <label style={{ display:'block', marginBottom:'6px', fontSize:'11px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.06em' }}>{f.label}</label>
                  <input type={f.type} required={f.required} value={f.val} onChange={f.onChange} placeholder={f.placeholder} style={{ width:'100%', padding:'10px 13px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', fontSize:'13px', outline:'none', background:'rgba(255,255,255,0.04)', color:'#e2e8f0', fontFamily:'inherit', boxSizing:'border-box' }} />
                </div>
              ))}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', marginBottom:'6px', fontSize:'11px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.06em' }}>Payment Mode *</label>
                <select value={paymentData.paymentMode} onChange={e=>setPaymentData({...paymentData,paymentMode:e.target.value})} style={{ width:'100%', padding:'10px 13px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', fontSize:'13px', outline:'none', background:'rgba(255,255,255,0.04)', color:'#e2e8f0', fontFamily:'inherit', boxSizing:'border-box', colorScheme:'dark' }}>
                  <option value="Cash">Cash</option><option value="UPI">UPI</option><option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', marginBottom:'6px', fontSize:'11px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.06em' }}>Notes (Optional)</label>
                <textarea rows="2" value={paymentData.notes} onChange={e=>setPaymentData({...paymentData,notes:e.target.value})} style={{ width:'100%', padding:'10px 13px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', fontSize:'13px', outline:'none', background:'rgba(255,255,255,0.04)', color:'#e2e8f0', fontFamily:'inherit', boxSizing:'border-box', resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <button type="button" onClick={()=>setIsPaymentModalOpen(false)} style={{ padding:'9px 18px', background:'rgba(255,255,255,0.05)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'13px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding:'9px 22px', background:'linear-gradient(135deg,#059669,#10b981)', boxShadow:'0 4px 14px rgba(16,185,129,0.3)' }}>Submit & Generate Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC PROJECTS MANAGER — Admin-only, manages homepage showcase projects
// ─────────────────────────────────────────────────────────────────────────────
const PublicProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const blankForm = {
    title: '',
    category: 'Residential',
    image: '',
    shortDescription: '',
    location: '',
    status: 'Completed',
    mapLink: '',
    order: 0
  };
  const [form, setForm] = useState(blankForm);

  const token = localStorage.getItem('authToken');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/public-projects`);
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch public projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setIsEditMode(false);
    setEditId(null);
    setForm(blankForm);
    setSelectedFile(null);
    setPreviewUrl('');
    setSaveFeedback('');
    setIsModalOpen(true);
  };

  const openEdit = (project) => {
    setIsEditMode(true);
    setEditId(project._id);
    setForm({
      title: project.title || '',
      category: project.category || 'Residential',
      image: project.image || '',
      shortDescription: project.shortDescription || '',
      location: project.location || '',
      status: project.status || 'Completed',
      mapLink: project.mapLink || '',
      order: project.order || 0
    });
    setSelectedFile(null);
    setPreviewUrl(project.image ? `${API_BASE_URL}${project.image}` : '');
    setSaveFeedback('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this project from the public showcase?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/public-projects/${id}`, authHeader);
      fetchProjects();
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.message || 'Failed to delete. Make sure you are logged in as admin.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveFeedback('');
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'image') formData.append(key, form[key]);
      });
      if (selectedFile) {
        formData.append('imageFile', selectedFile);
      } else if (form.image) {
        formData.append('image', form.image);
      }

      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/api/public-projects/${editId}`, formData, {
            headers: { 
                ...authHeader.headers,
                'Content-Type': 'multipart/form-data'
            }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/public-projects`, formData, {
            headers: { 
                ...authHeader.headers,
                'Content-Type': 'multipart/form-data'
            }
        });
      }
      setSaveFeedback('✅ Saved successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveFeedback('');
        fetchProjects();
      }, 800);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveFeedback(err.response?.data?.message || '❌ Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #d1d5db',
    borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.2s'
  };
  const categoryBadgeColor = (cat) => {
    const map = { Residential: '#3b82f6', Commercial: '#8b5cf6', Industrial: '#f59e0b', Infrastructure: '#10b981', Other: '#64748b' };
    return map[cat] || '#64748b';
  };
  const ppInp = { width:'100%', padding:'10px 13px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', fontSize:'13px', outline:'none', background:'rgba(255,255,255,0.04)', color:'#e2e8f0', fontFamily:"'Inter',sans-serif", boxSizing:'border-box', transition:'all .2s', colorScheme:'dark' };
  const ppLbl = { display:'block', marginBottom:'6px', fontSize:'11px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.06em' };

  return (
    <div style={{ padding:'24px', fontFamily:"'Inter',sans-serif", maxWidth:'1200px', color:'#e2e8f0' }}>
      <style>{`
        .pp2-card { background:rgba(15,23,42,0.8); border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow:hidden; transition:all 0.25s; }
        .pp2-card:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(0,0,0,0.45); border-color:rgba(96,165,250,0.2); }
        .pp2-img { width:100%; height:180px; object-fit:cover; display:block; background:rgba(15,23,42,0.6); }
        .pp2-img-wrap { position:relative; overflow:hidden; }
        .pp2-img-wrap::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom, transparent 50%, rgba(10,15,30,0.7) 100%); }
        .pp2-body { padding:16px; }
        .pp2-actions { display:flex; gap:8px; margin-top:14px; }
        .pp2-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 15px; border:none; border-radius:8px; cursor:pointer; font-size:12px; font-weight:600; transition:all .18s; font-family:inherit; }
        .pp2-btn:hover { transform:scale(1.04); }
        .pp2-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:20px; }
        .pp2-empty { text-align:center; padding:64px 32px; color:#475569; background:rgba(15,23,42,0.6); border-radius:14px; border:1px solid rgba(255,255,255,0.06); }
        .pp2-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(5,10,24,0.8); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:1200; }
        .pp2-modal { background:#0f172a; border:1px solid rgba(255,255,255,0.1); border-radius:16px; width:90%; max-width:580px; max-height:92vh; overflow-y:auto; padding:28px; box-shadow:0 24px 60px rgba(0,0,0,0.7); }
        .pp2-feedback { margin-top:10px; padding:10px 14px; border-radius:8px; font-size:13px; background:rgba(16,185,129,0.1); color:#10b981; border:1px solid rgba(16,185,129,0.3); }
        .pp2-feedback.error { background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.3); }
        .pp2-loading { text-align:center; padding:64px; color:#475569; font-size:14px; }
        .pp2-spinner { width:32px; height:32px; border:3px solid rgba(255,255,255,0.07); border-top-color:#60a5fa; border-radius:50%; animation:pp2spin .8s linear infinite; margin:0 auto 16px; }
        @keyframes pp2spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px', flexWrap:'wrap', gap:'14px' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'24px', fontWeight:800, background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            🌐 Public Projects
          </h1>
          <p style={{ margin:'5px 0 0', color:'#64748b', fontSize:'13px' }}>
            Manage projects displayed on the <span style={{ color:'#818cf8', fontWeight:600 }}>public homepage</span>. Changes are visible to all visitors.
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ padding:'10px 20px', gap:'6px' }}>
          + Add New Project
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="pp2-loading">
          <div className="pp2-spinner" />
          Loading projects…
        </div>
      )}

      {/* Empty */}
      {!loading && projects.length === 0 && (
        <div className="pp2-empty">
          <p style={{ fontSize:'3rem', margin:'0 0 12px' }}>🏗️</p>
          <p style={{ fontWeight:700, color:'#475569', margin:'0 0 6px' }}>No public projects yet</p>
          <p style={{ fontSize:'13px', color:'#334155', margin:0 }}>Click <strong style={{ color:'#60a5fa' }}>+ Add New Project</strong> to add your first one.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && projects.length > 0 && (
        <div className="pp2-grid">
          {projects.map((project) => {
            const stColor = project.status === 'Completed' ? {c:'#10b981',b:'rgba(16,185,129,0.12)',bdr:'rgba(16,185,129,0.3)'}
              : project.status === 'Ongoing' ? {c:'#60a5fa',b:'rgba(96,165,250,0.12)',bdr:'rgba(96,165,250,0.3)'}
              : {c:'#f59e0b',b:'rgba(245,158,11,0.12)',bdr:'rgba(245,158,11,0.3)'};
            return (
              <div key={project._id} className="pp2-card">
                <div className="pp2-img-wrap">
                  <img src={project.image} alt={project.title} className="pp2-img"
                    onError={e=>{e.target.onerror=null;e.target.src='https://placehold.co/400x300/1e293b/94a3b8?text=No+Image';}} />
                </div>
                <div className="pp2-body">
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px', flexWrap:'wrap', gap:'6px' }}>
                    <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700, color:'white', background:categoryBadgeColor(project.category) }}>
                      {project.category}
                    </span>
                    <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700, color:stColor.c, background:stColor.b, border:`1px solid ${stColor.bdr}` }}>
                      {project.status}
                    </span>
                  </div>
                  <h3 style={{ margin:'0 0 6px', fontSize:'15px', fontWeight:700, color:'#f1f5f9', lineHeight:'1.4' }}>{project.title}</h3>
                  <p style={{ margin:'0 0 8px', fontSize:'13px', color:'#64748b', lineHeight:'1.55' }}>
                    {project.shortDescription?.slice(0,100)}{project.shortDescription?.length>100?'…':''}
                  </p>
                  <p style={{ margin:0, fontSize:'12px', color:'#475569' }}>📍 {project.location}</p>
                  <div className="pp2-actions">
                    <button className="pp2-btn" onClick={()=>openEdit(project)} style={{ background:'rgba(96,165,250,0.12)', color:'#60a5fa', border:'1px solid rgba(96,165,250,0.25)', flex:1, justifyContent:'center' }}>✏️ Edit</button>
                    <button className="pp2-btn" onClick={()=>handleDelete(project._id)} style={{ background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)', flex:1, justifyContent:'center' }}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="pp2-overlay">
          <div className="pp2-modal">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'22px' }}>
              <h2 style={{ margin:0, fontSize:'18px', fontWeight:700, background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {isEditMode ? '✏️ Edit Public Project' : '➕ Add Public Project'}
              </h2>
              <button onClick={()=>setIsModalOpen(false)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', fontSize:'16px' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:14 }}>
                <label style={ppLbl}>Project Title *</label>
                <input style={ppInp} required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Modern Residential Villa – Wardha" />
              </div>
              <div style={{ display:'flex', gap:'12px', marginBottom:14 }}>
                <div style={{ flex:1 }}>
                  <label style={ppLbl}>Category *</label>
                  <select style={ppInp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    <option value="Residential">Residential</option><option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option><option value="Infrastructure">Infrastructure</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ flex:1 }}>
                  <label style={ppLbl}>Status</label>
                  <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={ppInp}>
                    <option value="Completed">Completed</option><option value="Ongoing">Ongoing</option><option value="Planning">Planning</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={ppLbl}>Project Showcase Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={ppInp} />
                {previewUrl && (
                  <div style={{ marginTop:10, borderRadius:8, overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', width:'fit-content' }}>
                    <img src={previewUrl} alt="preview" style={{ maxHeight:100, display:'block' }} />
                  </div>
                )}
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={ppLbl}>Short Description</label>
                <textarea rows="3" value={form.shortDescription} onChange={e=>setForm({...form,shortDescription:e.target.value})} style={{ ...ppInp, resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', gap:'12px', marginBottom:14 }}>
                <div style={{ flex:1 }}>
                  <label style={ppLbl}>Location</label>
                  <input style={ppInp} value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Wardha, Maharashtra" />
                </div>
                <div style={{ flex:1 }}>
                  <label style={ppLbl}>Display Order</label>
                  <input style={ppInp} type="number" value={form.order} onChange={e=>setForm({...form,order:Number(e.target.value)})} placeholder="0 = first" />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={ppLbl}>Google Maps Link (Optional)</label>
                <input style={ppInp} value={form.mapLink} onChange={e=>setForm({...form,mapLink:e.target.value})} placeholder="https://maps.app.goo.gl/..." />
              </div>
              {saveFeedback && (
                <div className={`pp2-feedback${saveFeedback.startsWith('❌')?' error':''}`}>{saveFeedback}</div>
              )}
              <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', paddingTop:'18px', borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:'6px' }}>
                <button type="button" onClick={()=>setIsModalOpen(false)} style={{ padding:'9px 18px', background:'rgba(255,255,255,0.05)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'13px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding:'9px 22px' }} disabled={saving}>
                  {saving ? 'Saving…' : (isEditMode ? 'Save Changes' : 'Add Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

