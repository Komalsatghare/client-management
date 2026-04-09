import React from "react";

function ProjectsGrid({ projects, setSelectedProject }) {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "40px" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #f3f4f6",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s"
            }}
            onClick={() => setSelectedProject(project)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div
              style={{ position: "relative", height: "500px", overflow: "hidden", cursor: project.mapLink ? "pointer" : "default" }}
              title={project.mapLink ? "Click to view on map" : ""}
              onClick={(e) => {
                if (project.mapLink) {
                  e.stopPropagation(); // prevent opening project details
                  window.open(project.mapLink, "_blank");
                }
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#f3f4f6" }}
              />
              <div style={{
                position: "absolute", top: "16px", left: "16px"
              }}>
                <span style={{
                  display: "inline-block", padding: "4px 12px", fontSize: "12px", fontWeight: "bold", letterSpacing: "0.05em", color: "white", backgroundColor: "rgba(37, 99, 235, 0.9)", borderRadius: "9999px", textTransform: "uppercase"
                }}>
                  {project.category}
                </span>
              </div>
              {project.mapLink && (
                <div style={{
                  position: "absolute", bottom: "16px", right: "16px"
                }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", padding: "6px 16px", fontSize: "13px", fontWeight: "bold", color: "#111827", backgroundColor: "white", borderRadius: "9999px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}>
                    📍 View Location
                  </span>
                </div>
              )}
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
                  {project.title}
                </h3>
                <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.5 }}>
                  {project.shortDescription}
                </p>
              </div>

              <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", paddingTop: "16px", borderTop: "1px solid #f9fafb", fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
                <div>
                  <span style={{ display: "block", color: "#9ca3af", marginBottom: "4px" }}>Location</span>
                  {project.location}
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ display: "block", color: "#9ca3af", marginBottom: "4px" }}>Status</span>
                  <span style={{ display: "inline-flex", alignItems: "center", color: project.status === 'Completed' ? "#16a34a" : "#d97706" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", marginRight: "6px", backgroundColor: project.status === 'Completed' ? "#16a34a" : "#d97706" }}></span>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsGrid;
