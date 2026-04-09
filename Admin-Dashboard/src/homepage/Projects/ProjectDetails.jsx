import React, { useEffect } from "react";
import { X, MapPin, Calendar, Ruler, User, CheckCircle2 } from "lucide-react";

function ProjectDetails({ project, setSelectedProject }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [project]);

  if (!project) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)"
      }}
      onClick={() => setSelectedProject(null)}
    >
      <div
        style={{
          backgroundColor: "white", borderRadius: "16px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", width: "100%", maxWidth: "896px", maxHeight: "90vh", overflowY: "auto", position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProject(null)}
          style={{
            position: "absolute", top: "16px", right: "16px", padding: "8px", backgroundColor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(12px)", borderRadius: "50%", zIndex: 20, color: "white", border: "1px solid rgba(255, 255, 255, 0.2)", cursor: "pointer"
          }}
        >
          <X size={24} />
        </button>

        {/* Hero Image */}
        <div style={{ position: "relative", height: "480px" }}>
          <img
            src={project.image}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)" }} />

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px" }}>
            <span style={{ display: "inline-block", padding: "4px 12px", fontSize: "12px", fontWeight: "bold", color: "white", backgroundColor: "#2563eb", borderRadius: "9999px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {project.category}
            </span>
            <h2 style={{ fontSize: "3rem", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
              {project.title}
            </h2>
            <div style={{ display: "flex", alignItems: "center", color: "#d1d5db", fontSize: "16px" }}>
              <MapPin size={18} style={{ marginRight: "8px", color: "#60a5fa" }} />
              {project.location}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "40px" }}>

          {/* Key Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "40px", padding: "24px", backgroundColor: "#f9fafb", borderRadius: "12px", border: "1px solid #f3f4f6" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", color: "#6b7280", marginBottom: "4px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <User size={14} style={{ marginRight: "8px" }} /> Client
              </div>
              <div style={{ fontWeight: 600, color: "#111827" }}>{project.client || "Confidential"}</div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", color: "#6b7280", marginBottom: "4px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <Ruler size={14} style={{ marginRight: "8px" }} /> Area
              </div>
              <div style={{ fontWeight: 600, color: "#111827" }}>{project.area || "N/A"}</div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", color: "#6b7280", marginBottom: "4px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <CheckCircle2 size={14} style={{ marginRight: "8px" }} /> Status
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", fontWeight: 600, color: project.status === 'Completed' ? '#16a34a' : '#d97706' }}>
                {project.status || "Ongoing"}
              </span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", color: "#6b7280", marginBottom: "4px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <Calendar size={14} style={{ marginRight: "8px" }} /> Year
              </div>
              <div style={{ fontWeight: 600, color: "#111827" }}>2023</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>Project Overview</h3>
              <p style={{ color: "#4b5563", lineHeight: 1.625, fontSize: "1.125rem", marginBottom: "24px" }}>
                {project.fullDescription}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ backgroundColor: "#eff6ff", padding: "24px", borderRadius: "12px", border: "1px solid #dbeafe" }}>
                <h4 style={{ fontWeight: "bold", color: "#1e3a8a", marginBottom: "8px" }}>Interested in a similar project?</h4>
                <p style={{ color: "#1d4ed8", fontSize: "14px", marginBottom: "16px" }}>Contact us today to discuss your construction needs.</p>
                <button style={{ width: "100%", padding: "8px 0", backgroundColor: "#2563eb", color: "white", borderRadius: "8px", fontWeight: 600, border: "none", cursor: "pointer" }}>
                  Get a Quote
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
