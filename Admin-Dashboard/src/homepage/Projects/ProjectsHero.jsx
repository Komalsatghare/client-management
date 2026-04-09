import React from "react";

function ProjectsHero() {
  const sectionStyle = {
    position: "relative",
    height: "60vh",
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    overflow: "hidden",
  };

  const bgStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6))",
  };

  const contentStyle = {
    position: "relative",
    zIndex: 10,
    padding: "0 24px",
    maxWidth: "896px",
    margin: "0 auto",
  };

  return (
    <section style={sectionStyle}>
      <div style={bgStyle} />
      <div style={overlayStyle} />
      <div style={contentStyle}>
        <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "9999px", backgroundColor: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(96, 165, 250, 0.3)", color: "#93c5fd", fontSize: "14px", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "24px" }}>
          OUR PORTFOLIO
        </span>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "32px", lineHeight: 1.2 }}>
          Building the <span style={{ color: "#60a5fa" }}>Future</span>
        </h1>
        <p style={{ fontSize: "1.125rem", color: "#cbd5e1", lineHeight: 1.625, maxWidth: "672px", margin: "0 auto" }}>
          Explore our diverse portfolio of residential, commercial, and infrastructure projects that redefine the skyline.
        </p>
      </div>
    </section>
  );
}

export default ProjectsHero;
