import React, { useState, useEffect } from "react";
import ProjectsHero from "./ProjectsHero";
import ProjectFilters from "./ProjectFilters";
import ProjectsGrid from "./ProjectsGrid";
import ProjectDetails from "./ProjectDetails";
import Navbar from "../Navbar";
import Footer from "../Footer";

function Projects() {
  const [category, setCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch public projects from backend — unchanged
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/public-projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjectsData(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Map DB fields to the format used by ProjectsGrid — unchanged
  const mappedProjects = projectsData.map((p) => ({
    id: p._id,
    title: p.title,
    category: p.category,
    image: p.image,
    shortDescription: p.shortDescription,
    location: p.location,
    status: p.status,
    mapLink: p.mapLink,
  }));

  const filteredProjects =
    category === "All"
      ? mappedProjects
      : mappedProjects.filter((p) => p.category === category);

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      <Navbar />

      <ProjectsHero totalCount={mappedProjects.length} />

      <ProjectFilters
        setCategory={setCategory}
        totalCount={mappedProjects.length}
        filteredCount={filteredProjects.length}
      />

      {loading && (
        <div style={{
          background: "#0f172a", textAlign: "center", padding: "80px 24px",
          fontFamily: "'Inter', sans-serif",
        }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>⏳</div>
          <p style={{ color: "#64748b", fontSize: 16 }}>Loading projects...</p>
        </div>
      )}

      {error && (
        <div style={{
          background: "#0f172a", textAlign: "center", padding: "80px 24px",
          fontFamily: "'Inter', sans-serif",
        }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
          <p style={{ color: "#f87171", fontSize: 16 }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <ProjectsGrid
          projects={filteredProjects}
          setSelectedProject={setSelectedProject}
        />
      )}

      <ProjectDetails
        project={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      <Footer />
    </div>
  );
}

export default Projects;
