import React, { useState } from "react";

const categories = ["All", "Residential", "Commercial", "Infrastructure", "Other"];

export default function ProjectFilters({ setCategory, activeCategory, totalCount, filteredCount }) {
  const [active, setActive] = useState("All");

  const handleClick = (cat) => {
    setActive(cat);
    setCategory(cat);
  };

  return (
    <>
      <style>{`
        .pf-bar {
          background: #0f172a;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 20px 24px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          position: sticky; top: 72px; z-index: 50;
          backdrop-filter: blur(12px);
        }
        .pf-inner {
          max-width: 1240px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
        }
        .pf-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        .pf-tab {
          padding: 8px 20px; border-radius: 50px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: #94a3b8;
          font-family: inherit;
        }
        .pf-tab:hover { border-color: rgba(255,255,255,0.25); color: #cbd5e1; }
        .pf-tab.active {
          background: #d62b1b; border-color: #d62b1b; color: #fff;
          box-shadow: 0 4px 14px rgba(214,43,27,0.4);
        }
        .pf-count { font-size: 13px; color: #64748b; white-space: nowrap; }
        .pf-count span { color: #fff; font-weight: 700; }
      `}</style>
      <div className="pf-bar">
        <div className="pf-inner">
          <div className="pf-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pf-tab${active === cat ? " active" : ""}`}
                onClick={() => handleClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="pf-count">
            Showing <span>{filteredCount ?? "—"}</span> of <span>{totalCount ?? "—"}</span> projects
          </div>
        </div>
      </div>
    </>
  );
}
