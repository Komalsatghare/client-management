import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const quickLinks = [
  { label: "Home",        path: "/" },
  { label: "Services",    path: "/services" },
  { label: "Projects",    path: "/projects" },
  { label: "About Us",    path: "/about" },
];

const services = [
  "Building Construction",
  "Interior Design",
  "Land Development",
  "2D / 3D Design Planning",
  "Structural Renovation",
  "Project Management",
];

const contactInfo = [
  { icon: "✉️", label: "swapnildhanvij@gmail.com", href: "mailto:swapnildhanvij@gmail.com" },
  { icon: "📞", label: "+91 90116 66255",           href: "tel:+919011666255" },
  { icon: "📍", label: "Wardha, Maharashtra",       href: "https://maps.app.goo.gl/QQGbzAQSXpp8hm1b8?g_st=aw" },
];

export default function Footer() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .ft {
          background: #060c1a;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Grid noise texture */
        .ft::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* Background glow */
        .ft-glow {
          position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; opacity: 0.07;
        }
        .ft-glow-1 { width: 600px; height: 600px; background: #d62b1b; top: -200px; left: -100px; }
        .ft-glow-2 { width: 500px; height: 500px; background: #7c3aed; bottom: -150px; right: -80px; }

        /* ── Top CTA strip ───────────────────────────────── */
        .ft-cta {
          position: relative; z-index: 1;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 56px 24px;
        }
        .ft-cta-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px; flex-wrap: wrap;
        }
        .ft-cta-left {}
        .ft-cta-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(214,43,27,0.12); border: 1px solid rgba(214,43,27,0.3);
          padding: 5px 14px; border-radius: 50px; margin-bottom: 14px;
          font-size: 10px; color: #d62b1b; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;
        }
        .ft-cta-title {
          font-size: clamp(22px, 3.5vw, 36px); font-weight: 900; color: #fff;
          margin: 0 0 8px; line-height: 1.2; letter-spacing: -0.4px;
        }
        .ft-cta-sub { font-size: 14px; color: #64748b; margin: 0; }
        .ft-cta-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .ft-cta-btn {
          padding: 13px 28px; background: linear-gradient(135deg, #d62b1b, #b91c1c);
          border: none; border-radius: 11px; color: #fff; font-size: 14px; font-weight: 800;
          cursor: pointer; font-family: inherit; transition: all 0.25s;
          box-shadow: 0 6px 24px rgba(214,43,27,0.4);
          white-space: nowrap;
        }
        .ft-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(214,43,27,0.55); filter: brightness(1.08); }
        .ft-cta-btn-sec {
          padding: 13px 24px; background: transparent; border: 1px solid rgba(255,255,255,0.14);
          border-radius: 11px; color: #94a3b8; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .ft-cta-btn-sec:hover { border-color: rgba(255,255,255,0.35); color: #fff; }

        /* ── Main columns ────────────────────────────────── */
        .ft-main {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
          padding: 60px 24px 48px;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: 48px;
        }

        /* Column 1 — Brand */
        .ft-brand {}
        .ft-brand-logo {
          display: flex; align-items: center; gap: 12px; margin-bottom: 18px; cursor: pointer;
        }
        .ft-brand-img {
          width: 44px; height: 44px; border-radius: 12px; object-fit: cover;
          border: 2px solid rgba(214,43,27,0.5);
          box-shadow: 0 4px 16px rgba(0,0,0,0.4), 0 0 0 4px rgba(214,43,27,0.08);
        }
        .ft-brand-name { font-size: 17px; font-weight: 800; color: #fff; display: block; }
        .ft-brand-tagline { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1.2px; }
        .ft-brand-desc {
          font-size: 13px; color: #64748b; line-height: 1.8; margin: 0 0 24px;
          max-width: 280px;
        }
        /* Social icons */
        .ft-socials { display: flex; gap: 10px; }
        .ft-social {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; cursor: pointer; transition: all 0.22s;
          text-decoration: none; color: inherit;
        }
        .ft-social:hover { background: #d62b1b; border-color: #d62b1b; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(214,43,27,0.4); }

        /* Column headers */
        .ft-col-head {
          font-size: 12px; font-weight: 800; color: #475569;
          text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px;
          padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* Quick links */
        .ft-links { list-style: none; display: flex; flex-direction: column; gap: 2px; }
        .ft-link-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 8px;
          font-size: 13px; color: #64748b; cursor: pointer;
          transition: all 0.2s; border: 1px solid transparent;
        }
        .ft-link-item:hover { color: #fff; background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.07); padding-left: 14px; }
        .ft-link-arrow { font-size: 10px; color: #d62b1b; opacity: 0; transition: opacity 0.2s; }
        .ft-link-item:hover .ft-link-arrow { opacity: 1; }

        /* Contact column */
        .ft-contact-items { display: flex; flex-direction: column; gap: 10px; }
        .ft-contact-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer; transition: all 0.22s; text-decoration: none;
        }
        .ft-contact-item:hover { border-color: rgba(214,43,27,0.3); background: rgba(214,43,27,0.05); }
        .ft-contact-icon { font-size: 17px; flex-shrink: 0; line-height: 1.4; }
        .ft-contact-text { font-size: 12px; color: #64748b; word-break: break-all; }
        .ft-mapbtn {
          display: flex; align-items: center; gap: 8px; margin-top: 12px;
          padding: 10px 16px; border-radius: 10px;
          background: rgba(214,43,27,0.1); border: 1px solid rgba(214,43,27,0.25);
          color: #f87171; font-size: 12px; font-weight: 700;
          cursor: pointer; text-decoration: none; transition: all 0.2s;
        }
        .ft-mapbtn:hover { background: #d62b1b; color: #fff; border-color: #d62b1b; }

        /* ── Sub-footer ─────────────────────────────────── */
        .ft-sub {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 22px 24px;
        }
        .ft-sub-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 14px; flex-wrap: wrap;
        }
        .ft-copy { font-size: 12px; color: #334155; }
        .ft-copy span { color: #d62b1b; }
        .ft-legal { display: flex; gap: 20px; }
        .ft-legal-link {
          font-size: 12px; color: #334155; text-decoration: none; cursor: pointer;
          transition: color 0.2s;
        }
        .ft-legal-link:hover { color: #94a3b8; }
        .ft-made { font-size: 12px; color: #1e293b; }

        @media (max-width: 1024px) {
          .ft-main { grid-template-columns: 1fr 1fr; gap: 36px; }
        }
        @media (max-width: 640px) {
          .ft-main { grid-template-columns: 1fr; padding: 40px 20px 32px; gap: 32px; }
          .ft-cta-inner { flex-direction: column; }
          .ft-cta { padding: 40px 20px; }
          .ft-sub-inner { justify-content: center; text-align: center; }
          .ft-legal { justify-content: center; }
        }
      `}</style>

      <footer className="ft">
        {/* ── Gradient separator line at very top ── */}
        <div style={{
          height: "3px",
          background: "linear-gradient(90deg, #d62b1b 0%, #7c3aed 50%, #06b6d4 100%)",
          width: "100%",
          display: "block",
        }} />

        {/* Background decorations */}
        <div className="ft-glow ft-glow-1" />
        <div className="ft-glow ft-glow-2" />

        {/* ── Top CTA Strip ── */}
        <div className="ft-cta">
          <div className="ft-cta-inner">
            <div className="ft-cta-left">
              <div className="ft-cta-badge">📞 Let's Work Together</div>
              <h2 className="ft-cta-title">
                Ready to Start Your<br />Next Project?
              </h2>
              <p className="ft-cta-sub">
                Free consultation — our engineers respond within 24 hours.
              </p>
            </div>
            <div className="ft-cta-actions">
              <button className="ft-cta-btn" onClick={() => {
                if (window.location.pathname === "/") {
                  document.getElementById("enquiry-section")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/#enquiry-section");
                }
              }}>
                Get Free Consultation →
              </button>
              <button className="ft-cta-btn-sec" onClick={() => navigate("/projects")}>
                View Our Work
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="ft-main">

          {/* Col 1 — Brand */}
          <div className="ft-brand">
            <div className="ft-brand-logo" onClick={() => navigate("/")}>
              <img src="/images/dhanvij builders.jpeg" alt="Dhanvij Builders" className="ft-brand-img" />
              <div>
                <span className="ft-brand-name">Dhanvij Builders</span>
                <span className="ft-brand-tagline">Civil Engineering · Est. 2025</span>
              </div>
            </div>
            <p className="ft-brand-desc">
              Delivering trusted, quality-driven construction solutions across Wardha, Maharashtra — from residential homes to commercial complexes, built with precision and integrity.
            </p>
            <div className="ft-socials">
              {[
                { icon: "📘", label: "Facebook",  href: "#" },
                { icon: "📸", label: "Instagram", href: "#" },
                { icon: "💼", label: "LinkedIn",  href: "#" },
                { icon: "🐦", label: "Twitter",   href: "#" },
              ].map((s) => (
                <a key={s.label} className="ft-social" href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <div className="ft-col-head">Quick Links</div>
            <ul className="ft-links">
              {quickLinks.map((l) => (
                <li key={l.path} className="ft-link-item" onClick={() => navigate(l.path)}>
                  <span className="ft-link-arrow">▶</span>
                  {l.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <div className="ft-col-head">Our Services</div>
            <ul className="ft-links">
              {services.map((s) => (
                <li key={s} className="ft-link-item" onClick={() => navigate("/services")}>
                  <span className="ft-link-arrow">▶</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <div className="ft-col-head">Contact Us</div>
            <div className="ft-contact-items">
              {contactInfo.map((c) => (
                <a key={c.label} className="ft-contact-item" href={c.href} target="_blank" rel="noopener noreferrer">
                  <span className="ft-contact-icon">{c.icon}</span>
                  <span className="ft-contact-text">{c.label}</span>
                </a>
              ))}
            </div>
            <a
              className="ft-mapbtn"
              href="https://maps.app.goo.gl/QQGbzAQSXpp8hm1b8?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 View Us on Google Maps
            </a>
          </div>

        </div>

        {/* ── Sub-footer ── */}
        <div className="ft-sub">
          <div className="ft-sub-inner">
            <div className="ft-copy">
              © {year} <span>Dhanvij Builders</span>. All rights reserved.
            </div>
            <div className="ft-legal">
              <span className="ft-legal-link">Privacy Policy</span>
              <span className="ft-legal-link">Terms of Service</span>
              <span className="ft-legal-link">Sitemap</span>
            </div>
            <div className="ft-made">Built with ❤️ in Wardha</div>
          </div>
        </div>
      </footer>
    </>
  );
}
