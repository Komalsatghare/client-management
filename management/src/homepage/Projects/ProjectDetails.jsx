import React, { useEffect } from "react";

export default function ProjectDetails({ project, setSelectedProject }) {
  // Close on Escape key
  useEffect(() => {
    if (!project) return;
    const handler = (e) => { if (e.key === "Escape") setSelectedProject(null); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [project]);

  if (!project) return null;

  const statusColor = project.status === "Completed"
    ? { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", text: "#34d399", dot: "#10b981" }
    : { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", text: "#fbbf24", dot: "#f59e0b" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .pd-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(0,0,0,0.88); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px; font-family: 'Inter', 'Segoe UI', sans-serif;
          animation: pdFadeIn 0.22s ease;
        }
        @keyframes pdFadeIn { from { opacity: 0 } to { opacity: 1 } }

        .pd-modal {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 1060px;
          max-height: 92vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          box-shadow: 0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05);
          animation: pdSlideUp 0.3s cubic-bezier(0.34,1.36,0.64,1);
          scrollbar-width: none;
        }
        .pd-modal::-webkit-scrollbar { display: none; }

        @keyframes pdSlideUp {
          from { transform: translateY(32px) scale(0.96); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* ── Close button ── */
        .pd-close {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(15,23,42,0.75); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.18);
          color: #94a3b8; font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .pd-close:hover { background: #d62b1b; color: #fff; border-color: #d62b1b; }

        /* ── Full image section ── */
        .pd-img-section {
          position: relative;
          width: 100%;
          background: #000;
          border-radius: 24px 24px 0 0;
          overflow: hidden;
          flex-shrink: 0;
        }
        .pd-full-img {
          width: 100%;
          max-height: 520px;
          object-fit: contain;
          display: block;
          background: #0a0f1e;
        }
        /* bottom fade so text overlaps nicely */
        .pd-img-fade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 140px;
          background: linear-gradient(to top, #0f172a 0%, transparent 100%);
          pointer-events: none;
        }
        /* Overlaid badges on top-left of image */
        .pd-img-badges {
          position: absolute; top: 14px; left: 16px;
          display: flex; gap: 8px; flex-wrap: wrap; z-index: 2;
        }
        .pd-cat-badge {
          padding: 5px 12px; border-radius: 6px;
          background: rgba(15,23,42,0.82); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.14);
          font-size: 11px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.8px;
        }
        .pd-status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 20px; border: 1px solid;
          font-size: 11px; font-weight: 700;
          backdrop-filter: blur(8px);
        }
        .pd-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* ── Info body ── */
        .pd-body {
          padding: 28px 32px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pd-title {
          font-size: 30px; font-weight: 900; color: #fff;
          margin: 0; line-height: 1.2; letter-spacing: -0.5px;
        }
        .pd-description {
          font-size: 15px; color: #94a3b8; line-height: 1.8; margin: 0;
        }

        /* Meta grid */
        .pd-meta-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        }
        .pd-meta-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 14px 16px;
          transition: border-color 0.2s, background 0.2s;
        }
        .pd-meta-card:hover { border-color: rgba(214,43,27,0.3); background: rgba(214,43,27,0.04); }
        .pd-meta-label { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 5px; }
        .pd-meta-value { font-size: 14px; color: #e2e8f0; font-weight: 600; }

        /* Action buttons */
        .pd-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .pd-btn-primary {
          flex: 1; padding: 14px; background: #d62b1b; border: none; border-radius: 12px;
          color: #fff; font-size: 14px; font-weight: 800; cursor: pointer;
          font-family: inherit; transition: all 0.2s; min-width: 160px;
          box-shadow: 0 6px 24px rgba(214,43,27,0.4);
        }
        .pd-btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(214,43,27,0.5); }
        .pd-btn-secondary {
          padding: 14px 24px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;
          color: #94a3b8; font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.2s; white-space: nowrap;
        }
        .pd-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .pd-hint { font-size: 12px; color: #334155; text-align: center; }

        @media (max-width: 700px) {
          .pd-modal { border-radius: 16px; max-height: 94vh; }
          .pd-full-img { max-height: 300px; }
          .pd-meta-grid { grid-template-columns: 1fr 1fr; }
          .pd-body { padding: 20px; gap: 16px; }
          .pd-title { font-size: 22px; }
        }
        @media (max-width: 440px) {
          .pd-overlay { padding: 8px; }
          .pd-meta-grid { grid-template-columns: 1fr; }
          .pd-full-img { max-height: 240px; }
        }
      `}</style>

      {/* Backdrop — click outside closes */}
      <div className="pd-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}>
        <div className="pd-modal" style={{ position: "relative" }}>

          {/* ── Close button ── */}
          <button className="pd-close" onClick={() => setSelectedProject(null)}>✕</button>

          {/* ── FULL IMAGE ── */}
          <div className="pd-img-section">
            <img
              src={project.image}
              alt={project.title}
              className="pd-full-img"
            />
            <div className="pd-img-fade" />

            {/* Badges over image */}
            <div className="pd-img-badges">
              <span className="pd-cat-badge">{project.category || "General"}</span>
              <span
                className="pd-status-badge"
                style={{ background: statusColor.bg, borderColor: statusColor.border, color: statusColor.text }}
              >
                <span className="pd-status-dot" style={{ background: statusColor.dot }} />
                {project.status || "Completed"}
              </span>
            </div>
          </div>

          {/* ── Info Body ── */}
          <div className="pd-body">
            <h2 className="pd-title">{project.title}</h2>

            <p className="pd-description">
              {project.fullDescription || project.shortDescription || "No additional details available for this project."}
            </p>

            {/* Meta cards */}
            <div className="pd-meta-grid">
              <div className="pd-meta-card">
                <div className="pd-meta-label">📍 Location</div>
                <div className="pd-meta-value">{project.location || "Wardha, Maharashtra"}</div>
              </div>
              <div className="pd-meta-card">
                <div className="pd-meta-label">🏷️ Project Type</div>
                <div className="pd-meta-value">{project.category || "General"}</div>
              </div>
              <div className="pd-meta-card">
                <div className="pd-meta-label">📊 Status</div>
                <div className="pd-meta-value" style={{ color: statusColor.text }}>
                  {project.status || "Completed"}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pd-actions">
              {project.mapLink && (
                <button
                  className="pd-btn-primary"
                  onClick={() => window.open(project.mapLink, "_blank")}
                >
                  📍 View Location on Map
                </button>
              )}
              <button className="pd-btn-secondary" onClick={() => setSelectedProject(null)}>
                Close
              </button>
            </div>

            <p className="pd-hint">Press Esc or click outside to close</p>
          </div>
        </div>
      </div>
    </>
  );
}
