import React from "react";

function ProjectFilters({ setCategory }) {
  const categories = ["All", "Residential", "Commercial", "Infrastructure", "Industrial"];

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "12px",
    margin: "48px 0",
    padding: "0 16px",
  };

  const buttonStyle = {
    padding: "10px 24px",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    color: "#4b5563",
    fontWeight: 500,
    borderRadius: "9999px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#eff6ff";
            e.target.style.color = "#2563eb";
            e.target.style.borderColor = "#bfdbfe";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "#4b5563";
            e.target.style.borderColor = "#e5e7eb";
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default ProjectFilters;
