import React from "react";

function Team() {
  const containerStyle = {
    width: "90%",
    maxWidth: "1000px",
    margin: "50px auto",
  };

  const sectionTitleStyle = {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "50px",
    color: "#222",
  };

  const teamRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    lineHeight: "1.8",
    fontSize: "1.1em",
    flexWrap: "wrap",
  };

  const imageColumnStyle = {
    flex: "0 0 250px",
    textAlign: "center",
  };

  const imageStyle = {
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  };

  const textColumnStyle = {
    flex: "1 1 300px",
    color: "#555",
  };

  const linkStyle = {
    color: "#007bff",
    textDecoration: "none",
  };

  return (
    <div style={containerStyle}>
      {/* Section Title */}
      <h1 style={sectionTitleStyle}>People</h1>

      {/* Team Member */}
      <div style={teamRowStyle}>
        {/* Left Column - Circular Image */}
        <div style={imageColumnStyle}>
          <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=faces&fit=crop&h=400&w=400"
            alt="Swapnil Dhanvij"
            style={imageStyle}
          />
          <h5>Swapnil Dhanvij</h5>
          <h6>Civil Engineer</h6>
        </div>

        {/* Right Column - Bio */}
        <div style={textColumnStyle}>
          <p>
            Swapnil Dhanvij is a highly experienced civil engineer with over a decade of expertise in planning, designing, and managing large-scale construction projects. He has successfully overseen residential, commercial, and industrial developments, ensuring that every project is delivered on time and meets the highest safety and quality standards.
          </p>
          <p>
            He specializes in structural engineering, project management, and sustainable construction techniques. Swapnil has led multiple high-profile projects, including multi-story complexes, bridges, and infrastructure upgrades, consistently implementing innovative solutions to optimize cost and efficiency.
          </p>
          <p>
            Passionate about advancing construction technology, he integrates modern tools like BIM (Building Information Modeling) and CAD software into his workflow, improving design accuracy and team collaboration.
          </p>
          <p>
            Outside of work, Swapnil enjoys mentoring young engineers and contributing to community construction initiatives. Connect with him on{" "}
            <a href="#" style={linkStyle}>LinkedIn</a> /{" "}
            <a href="#" style={linkStyle}>Portfolio</a> /{" "}
            <a href="#" style={linkStyle}>Twitter</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
