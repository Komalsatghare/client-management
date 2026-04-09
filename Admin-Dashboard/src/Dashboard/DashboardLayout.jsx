import React, { useState, useEffect } from "react";
import { X, Download, Maximize2 } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import DashboardHome from "./Frontpage/DashboardHome";
import ClientRecords from "./ClientRecords/ClientRecords";
import Payments from "./Payments/Payments";
import Settings from "./Settings/Settings";
import UserProfile from "./profile/UserProfile";
import ProjectRequests from "./ProjectRequests";
import ProjectsList from "./Projects/ProjectsList";
import ProjectDetailsView from "./Projects/ProjectDetailsView";
import TrackProject from "./Projects/TrackProject";
import Inquiries from "./Inquiries/Inquiries";
import "./dashboard.css";

const DashboardLayout = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Full-screen Lightbox State
  const [projectFilter, setProjectFilter] = useState("");
  const [adminData, setAdminData] = useState({
    name: localStorage.getItem("adminName") || "Admin User",
    email: localStorage.getItem("adminEmail") || "admin@dhanvij.com",
    avatar: ""
  });

  const handleNavClick = (section) => {
    setProjectFilter("");
    setSelectedProject(null);
    setActiveSection(section);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok && data.role === 'admin' && data.user) {
          const user = data.user;
          localStorage.setItem("adminName", user.name || "Admin User");
          localStorage.setItem("adminEmail", user.email || "admin@dhanvij.com");
          localStorage.setItem("adminPhone", user.phone || "");
          localStorage.setItem("adminUsername", user.username || "");
          
          setAdminData({
              name: user.name || "Admin User",
              email: user.email || "admin@dhanvij.com",
              avatar: (user.name && typeof user.name === 'string') ? user.name.charAt(0).toUpperCase() : "A"
          });
        }
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
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
          <ProjectDetailsView
            project={selectedProject}
            goBack={() => setSelectedProject(null)}
            onImageClick={(url) => setSelectedImage(url)}
          />
        ) : (
          <ProjectsList
            projectsData={projectsData}
            setSelectedProject={setSelectedProject}
            initialFilter={projectFilter}
          />
        );
      case "Track Project":
        return <TrackProject />;
      case "Payments":
        return <Payments />;
      case "Inquiries":
        return <Inquiries />;
      case "Settings":
        return <Settings />;
      case "My Profile":
        return <UserProfile onProfileUpdate={fetchProfile} />;
      default:
        return <DashboardHome />;
    }
  };

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split('/').pop() || 'project-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download image.");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar 
          activeSection={activeSection} 
          setActiveSection={handleNavClick} 
          adminData={adminData}
      />

      {/* Main Content */}
      <div className="dashboard-main-content">
        {/* Top Navbar */}
        <TopNavbar 
            activeSection={activeSection} 
            setActiveSection={handleNavClick} 
            adminData={adminData}
        />

        {/* Dynamic Content Area */}
        <div className="dashboard-content-area">
          {renderContent()}
        </div>
      </div>

      {/* GLOBAL IMAGE LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
          >
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute', top: '-40px', right: 0, background: 'transparent',
                border: 'none', color: 'white', cursor: 'pointer', padding: '10px'
              }}
            >
              <X size={32} />
            </button>

            {/* DOWNLOAD BUTTON */}
            <button 
              onClick={() => downloadImage(selectedImage)}
              style={{
                position: 'absolute', top: '-40px', left: 0, background: 'rgba(255,255,255,0.15)',
                color: 'white', padding: '8px 16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer'
              }}
            >
              <Download size={20} /> Download Full Photo
            </button>

            <img 
              src={selectedImage} 
              alt="Project Full Size" 
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '8px', boxShadow: '0 10px 50px rgba(0,0,0,1)' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
