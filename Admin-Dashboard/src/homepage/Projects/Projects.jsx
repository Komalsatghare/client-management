import React, { useState } from "react";
import ProjectsHero from "./ProjectsHero";
import ProjectFilters from "./ProjectFilters";
import ProjectsGrid from "./ProjectsGrid";
import ProjectDetails from "./ProjectDetails";
import Navbar from "../Navbar";
import Footer from "../Footer";

function Projects() {
  const [category, setCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const projectsData = [
    {
      id: 1,
      title: "Skyline Heights Residency",
      category: "Residential",
      image: "/images/image1.jpeg",
      shortDescription: "Luxury high-rise apartments with smart home integration.",
      fullDescription:
        "Skyline Heights is a premium residential complex featuring three 45-story towers. The project integrates sustainable design with luxury living, offering smart home automation, a rooftop infinity pool, and a private community park. Our team handled the complete structural engineering and construction management.",
      location: "Pune, Maharashtra",
      status: "Completed",
      client: "Skyline Developers",
      area: "500,000 sq. ft.",
      mapLink: "https://maps.app.goo.gl/zQLzWG5mNoaA7ihk7?g_st=aw",
    },

    {
      id: 3,
      title: "Mumbai-Pune Expressway Link",
      category: "Infrastructure",
      image: "/images/image3.jpeg",
      shortDescription: "Critical highway expansion including two major bridges.",
      fullDescription:
        "This infrastructure project involved the widening of a critical 15km stretch of the expressway, including the construction of two multi-span bridges and improved drainage systems. The project was delivered 3 months ahead of schedule.",
      location: "Lonavala, India",
      status: "Completed",
      client: "NHAI",
      area: "15 km",
    },
    {
      id: 4,
      title: "Green Valley Eco-Township",
      category: "Residential",
      image: "/images/image5.jpeg",
      shortDescription: "Sustainable township with 200+ villas and community center.",
      fullDescription:
        "Green Valley is an eco-friendly township designed to minimize carbon footprint. It features rainwater harvesting, solar power generation, and extensive green cover. The project includes 200 luxury villas and a central community hub.",
      location: "Nashik, India",
      status: "Completed",
      client: "Green Earth Group",
      area: "50 Acres",
      mapLink: "https://maps.app.goo.gl/JTUyWiJuNERcwXXm6?g_st=aw",
    },
    {
      id: 5,
      title: "City Center Mall",
      category: "Commercial",
      image: "https://images.unsplash.com/photo-1519567241046-7f570eee3d9f?auto=format&fit=crop&q=80",
      shortDescription: "Premier shopping and entertainment destination.",
      fullDescription:
        "A 5-story shopping complex with a multiplex cinema, food court, and underground parking for 1000 cars. The structural design utilized post-tensioned slabs to allow for large column-free spaces suitable for retail outlets.",
      location: "Nagpur, India",
      status: "Completed",
      client: "City Retail Corp",
      area: "350,000 sq. ft.",
    },
    {
      id: 6,
      title: "Riverside Water Treatment Plant",
      category: "Infrastructure",
      image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80",
      shortDescription: "Modern water purification facility for the municipal corporation.",
      fullDescription:
        "This critical public health infrastructure project provides clean drinking water to over 100,000 households. The facility uses advanced filtration and chemical treatment processes.",
      location: "Pune, India",
      status: "In Progress",
      client: "PMC",
      area: "10 Acres",
    },
  ];

  const filteredProjects =
    category === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === category);

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flexGrow: 1 }}>
        <ProjectsHero />
        <ProjectFilters setCategory={setCategory} />
        <ProjectsGrid
          projects={filteredProjects}
          setSelectedProject={setSelectedProject}
        />
        <ProjectDetails
          project={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Projects;
