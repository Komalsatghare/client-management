import React, { useState } from "react";

function ProjectCard({ project, index, onSelect }) {
  const [hovered, setHovered] = useState(false);

  const statusColor = project.status === "Completed"
    ? { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.35)", text: "#34d399", dot: "#10b981" }
    : { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", text: "#fbbf24", dot: "#f59e0b" };

  return (
    <div
      className={`pgrid-card${hovered ? " pgrid-hovered" : ""}`}
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="pgrid-img-wrap">
        <img
          src={project.image}
          alt={project.title}
          className="pgrid-img"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
        />
        {/* Overlay on hover */}
        <div className="pgrid-overlay" style={{ opacity: hovered ? 1 : 0 }}>
          <button className="pgrid-view-btn" onClick={() => onSelect(project)}>
            View Details →
          </button>
          {project.mapLink && (
            <button
              className="pgrid-map-btn"
              onClick={(e) => { e.stopPropagation(); window.open(project.mapLink, "_blank"); }}
            >
              📍 View on Map
            </button>
          )}
        </div>
        {/* Category badge */}
        <span className="pgrid-cat-badge">{project.category || "General"}</span>
      </div>

      {/* Info */}
      <div className="pgrid-info">
        {/* Status pill */}
        <div className="pgrid-status" style={{ background: statusColor.bg, borderColor: statusColor.border }}>
          <span className="pgrid-status-dot" style={{ background: statusColor.dot }} />
          <span style={{ color: statusColor.text, fontSize: 11, fontWeight: 700 }}>
            {project.status || "Completed"}
          </span>
        </div>

        <h3 className="pgrid-title">{project.title}</h3>
        <p className="pgrid-desc">{project.shortDescription}</p>

        <div className="pgrid-meta">
          <span className="pgrid-meta-item">
            <span className="pgrid-meta-icon">📍</span>
            {project.location || "Wardha, Maharashtra"}
          </span>
        </div>

        <div className="pgrid-actions">
          <button className="pgrid-details-btn" onClick={() => onSelect(project)}>
            View Details
          </button>
          {project.mapLink && (
            <button
              className="pgrid-loc-btn"
              onClick={() => window.open(project.mapLink, "_blank")}
            >
              📍 Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsGrid({ projects, setSelectedProject }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="pgrid-empty">
        <span className="pgrid-empty-icon">🏗️</span>
        <p>No projects found in this category.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .pgrid-section {
          background: #0f172a;
          padding: 52px 24px 80px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          min-height: 50vh;
        }
        .pgrid-inner { max-width: 1240px; margin: 0 auto; }

        .pgrid-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
        }

        /* Card */
        .pgrid-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          display: flex; flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.34,1.36,0.64,1),
                      box-shadow 0.35s, border-color 0.35s;
          animation: pgFadeUp 0.5s ease both;
        }
        @keyframes pgFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pgrid-hovered {
          transform: translateY(-8px);
          box-shadow: 0 28px 60px rgba(0,0,0,0.5);
          border-color: rgba(214,43,27,0.35);
        }

        /* Image */
        .pgrid-img-wrap {
          position: relative; overflow: hidden;
          height: 240px; flex-shrink: 0;
        }
        .pgrid-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
          display: block;
        }
        .pgrid-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,15,30,0.9) 0%, rgba(10,15,30,0.5) 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; transition: opacity 0.3s; pointer-events: none;
        }
        .pgrid-hovered .pgrid-overlay { pointer-events: auto; }
        .pgrid-view-btn {
          padding: 11px 24px; background: #d62b1b; border: none; border-radius: 10px;
          color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
          transform: translateY(8px); transition: transform 0.3s, box-shadow 0.3s;
          font-family: inherit;
          box-shadow: 0 6px 20px rgba(214,43,27,0.5);
        }
        .pgrid-hovered .pgrid-view-btn { transform: translateY(0); }
        .pgrid-view-btn:hover { filter: brightness(1.1); }
        .pgrid-map-btn {
          padding: 8px 18px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px; color: #fff; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: background 0.2s;
          transform: translateY(8px); transition: transform 0.35s 0.05s, background 0.2s;
        }
        .pgrid-hovered .pgrid-map-btn { transform: translateY(0); }
        .pgrid-map-btn:hover { background: rgba(255,255,255,0.2); }

        .pgrid-cat-badge {
          position: absolute; top: 14px; left: 14px;
          background: rgba(15,23,42,0.85); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 6px;
          padding: 4px 10px; font-size: 11px; font-weight: 700;
          color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px;
        }

        /* Info */
        .pgrid-info { padding: 22px 22px 20px; display: flex; flex-direction: column; gap: 10px; flex: 1; }

        .pgrid-status {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px; border: 1px solid; align-self: flex-start;
        }
        .pgrid-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .pgrid-title { font-size: 18px; font-weight: 800; color: #f1f5f9; margin: 0; line-height: 1.3; }
        .pgrid-desc { font-size: 13px; color: #64748b; line-height: 1.7; margin: 0; flex: 1; }

        .pgrid-meta { display: flex; flex-wrap: wrap; gap: 12px; }
        .pgrid-meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #475569; font-weight: 500; }
        .pgrid-meta-icon { font-size: 14px; }

        .pgrid-actions { display: flex; gap: 10px; margin-top: 4px; }
        .pgrid-details-btn {
          flex: 1; padding: 10px; background: rgba(214,43,27,0.1);
          border: 1px solid rgba(214,43,27,0.25); border-radius: 10px;
          color: #f87171; font-size: 13px; font-weight: 700; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .pgrid-details-btn:hover { background: #d62b1b; color: #fff; border-color: #d62b1b; }
        .pgrid-loc-btn {
          padding: 10px 16px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          color: #94a3b8; font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; font-family: inherit; white-space: nowrap;
        }
        .pgrid-loc-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        /* Empty state */
        .pgrid-empty {
          background: #0f172a; padding: 80px 24px;
          text-align: center; font-family: 'Inter', sans-serif;
        }
        .pgrid-empty-icon { font-size: 56px; display: block; margin-bottom: 16px; }
        .pgrid-empty p { font-size: 16px; color: #475569; }

        @media (max-width: 1024px) { .pgrid-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) {
          .pgrid-grid { grid-template-columns: 1fr; }
          .pgrid-section { padding: 36px 16px 60px; }
        }
      `}</style>

      <div className="pgrid-section">
        <div className="pgrid-inner">
          <div className="pgrid-grid">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
