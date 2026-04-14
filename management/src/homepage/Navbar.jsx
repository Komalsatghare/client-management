import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";

const NAV_LINKS = [
  { label: "Home",     key: "home",     path: "/" },
  { label: "Services", key: "services", path: "/services" },
  { label: "Projects", key: "projects", path: "/projects" },
  { label: "About",    key: "about",    path: "/about" },
];

function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signUpDropdownOpen, setSignUpDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const dropdownRef = useRef(null);
  const signUpRef   = useRef(null);
  const mobileRef   = useRef(null);

  const clientToken = localStorage.getItem("clientAuthToken");
  const adminToken  = localStorage.getItem("authToken");
  const clientName  = localStorage.getItem("clientName") || "Client";

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function close(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (signUpRef.current && !signUpRef.current.contains(e.target)) setSignUpDropdownOpen(false);
      if (mobileRef.current  && !mobileRef.current.contains(e.target))  setMobileOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavigate = (section) => {
    setDropdownOpen(false);
    setSignUpDropdownOpen(false);
    setMobileOpen(false);
    switch (section) {
      case "home":          navigate("/");                break;
      case "projects":      navigate("/projects");        break;
      case "services":      navigate("/services");        break;
      case "about":         navigate("/about");           break;
      case "client-signup": navigate("/client-signup");   break;

      case "signup":        navigate("/signup");          break;
      case "client-login":  navigate("/client-login");    break;
      case "admin-login":   navigate("/login");           break;
      case "dashboard":     navigate("/client-dashboard"); break;
      case "admin":         navigate("/admin-dashboard"); break;
      default: break;
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ─── Navbar shell ─────────────────────────────── */
        .nb {
          position: sticky; top: 0; z-index: 1000;
          height: 68px;
          background: rgba(10, 14, 30, 0.72);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: box-shadow 0.3s, background 0.3s;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        .nb.scrolled {
          background: rgba(10,14,30,0.95);
          box-shadow: 0 4px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06);
        }
        .nb-inner {
          max-width: 1280px; margin: 0 auto; height: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; gap: 20px;
        }

        /* ─── Logo ─────────────────────────────────────── */
        .nb-logo {
          display: flex; align-items: center; gap: 11px;
          cursor: pointer; flex-shrink: 0; text-decoration: none;
        }
        .nb-logo-img-wrap {
          position: relative; width: 38px; height: 38px;
        }
        .nb-logo-img {
          width: 38px; height: 38px; border-radius: 10px; object-fit: cover;
          border: 2px solid rgba(214,43,27,0.5);
          box-shadow: 0 0 0 4px rgba(214,43,27,0.1), 0 4px 14px rgba(0,0,0,0.4);
          transition: box-shadow 0.3s;
        }
        .nb-logo:hover .nb-logo-img {
          box-shadow: 0 0 0 4px rgba(214,43,27,0.25), 0 6px 20px rgba(214,43,27,0.3);
        }
        .nb-logo-text-wrap {}
        .nb-logo-name {
          font-size: 16px; font-weight: 800; color: #fff;
          letter-spacing: -0.2px; line-height: 1.1;
        }
        .nb-logo-sub {
          font-size: 10px; color: #64748b; font-weight: 500;
          letter-spacing: 1.2px; text-transform: uppercase;
        }

        /* ─── Desktop nav links ─────────────────────────── */
        .nb-links {
          display: flex; align-items: center; gap: 4px; list-style: none;
          flex: 1; justify-content: center;
        }
        .nb-link {
          position: relative; padding: 7px 14px; border-radius: 8px;
          font-size: 14px; font-weight: 600; color: #94a3b8;
          cursor: pointer; user-select: none;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .nb-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .nb-link.active { color: #fff; }
        .nb-link.active::after {
          content: '';
          position: absolute; bottom: -2px; left: 14px; right: 14px; height: 2px;
          background: linear-gradient(90deg, #d62b1b, #f87171);
          border-radius: 2px;
        }

        /* ─── Right section (auth) ──────────────────────── */
        .nb-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        /* Sign Up */
        .nb-signup {
          padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 700;
          color: #fff; cursor: pointer; transition: all 0.2s;
          background: transparent; border: 1px solid rgba(255,255,255,0.18);
          font-family: inherit;
        }
        .nb-signup:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.06); }

        /* Sign In button */
        .nb-signin-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 9px; font-size: 13px; font-weight: 700;
          background: linear-gradient(135deg, #d62b1b, #b91c1c);
          color: #fff; cursor: pointer; border: none;
          box-shadow: 0 4px 18px rgba(214,43,27,0.4);
          transition: all 0.22s; font-family: inherit;
        }
        .nb-signin-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(214,43,27,0.55);
          filter: brightness(1.08);
        }
        .nb-chevron {
          font-size: 11px; display: inline-block;
          transition: transform 0.25s ease; font-style: normal; margin-left: 2px;
        }
        .nb-chevron.open { transform: rotate(180deg); }

        /* ─── Sign In Dropdown ──────────────────────────── */
        .nb-dropdown-wrap { position: relative; }
        .nb-dropdown {
          position: absolute; top: calc(100% + 12px); right: 0;
          min-width: 240px;
          background: #1e293b;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.3);
          overflow: hidden;
          animation: nbDropIn 0.2s cubic-bezier(0.34,1.36,0.64,1);
          z-index: 200;
        }
        @keyframes nbDropIn {
          from { opacity:0; transform: translateY(-8px) scale(0.97); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        .nb-dropdown-head {
          padding: 12px 16px 10px;
          font-size: 10px; font-weight: 700; color: #64748b;
          text-transform: uppercase; letter-spacing: 1px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nb-dropdown-item {
          display: flex; align-items: center; gap: 12px; padding: 13px 16px;
          cursor: pointer; transition: background 0.18s; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .nb-dropdown-item:last-child { border-bottom: none; }
        .nb-dropdown-item:hover { background: rgba(255,255,255,0.05); }
        .nb-di-icon {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .nb-di-icon.client { background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.15)); }
        .nb-di-icon.admin  { background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.15)); }
        .nb-di-title { font-size: 14px; font-weight: 700; color: #f1f5f9; }
        .nb-di-sub { font-size: 11px; color: #64748b; margin-top: 2px; }

        /* ─── Logged-in states ──────────────────────────── */
        .nb-user-chip {
          display: flex; align-items: center; gap: 8px; cursor: default;
        }
        .nb-user-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 800; font-size: 13px;
          box-shadow: 0 3px 12px rgba(59,130,246,0.4);
        }
        .nb-user-name { font-size: 13px; font-weight: 700; color: #e2e8f0; }
        .nb-dashboard-btn {
          padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700;
          background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff;
          border: none; cursor: pointer; transition: all 0.2s; font-family: inherit;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
        }
        .nb-dashboard-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,0.5); }
        .nb-admin-btn {
          padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700;
          background: linear-gradient(135deg, #1e293b, #0f172a); color: #fff;
          border: 1px solid rgba(255,255,255,0.12); cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .nb-admin-btn:hover { border-color: rgba(255,255,255,0.3); background: #1e293b; }

        /* ─── Hamburger ─────────────────────────────────── */
        .nb-hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; padding: 6px; border-radius: 8px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s;
        }
        .nb-hamburger:hover { background: rgba(255,255,255,0.1); }
        .nb-bar {
          width: 22px; height: 2px; border-radius: 2px; background: #cbd5e1;
          transition: all 0.3s ease; display: block;
        }
        .nb-hamburger.open .nb-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nb-hamburger.open .nb-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nb-hamburger.open .nb-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ─── Mobile menu ───────────────────────────────── */
        .nb-mobile-backdrop {
          display: none; position: fixed; inset: 0; z-index: 900;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          animation: nbFadeIn 0.2s ease;
        }
        @keyframes nbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .nb-mobile-menu {
          position: fixed; top: 68px; right: 0; bottom: 0; width: 300px;
          background: #0f172a; border-left: 1px solid rgba(255,255,255,0.08);
          z-index: 950; display: flex; flex-direction: column;
          padding: 24px 20px;
          animation: nbSlideIn 0.28s cubic-bezier(0.34,1.06,0.64,1);
          box-shadow: -20px 0 60px rgba(0,0,0,0.6);
        }
        @keyframes nbSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        .nb-mobile-link {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 14px; border-radius: 10px;
          font-size: 15px; font-weight: 600; color: #94a3b8;
          cursor: pointer; transition: all 0.2s; margin-bottom: 4px;
          border: 1px solid transparent;
        }
        .nb-mobile-link:hover { color: #fff; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
        .nb-mobile-link.active { color: #fff; background: rgba(214,43,27,0.1); border-color: rgba(214,43,27,0.3); }
        .nb-mobile-link-icon { font-size: 18px; width: 22px; }
        .nb-mobile-divider {
          height: 1px; background: rgba(255,255,255,0.07); margin: 16px 0;
        }
        .nb-mobile-signin {
          width: 100%; padding: 13px; margin-top: 8px;
          background: linear-gradient(135deg, #d62b1b, #b91c1c);
          border: none; border-radius: 10px; color: #fff;
          font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
          box-shadow: 0 6px 20px rgba(214,43,27,0.35);
        }
        .nb-mobile-signup {
          width: 100%; padding: 13px; margin-top: 8px;
          background: transparent; border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit;
        }

        /* ─── Responsive ────────────────────────────────── */
        @media (max-width: 840px) {
          .nb-links { display: none; }
          .nb-hamburger { display: flex; }
          .nb-right .nb-signup,
          .nb-right .nb-dropdown-wrap { display: none; }
        }
        @media (max-width: 840px) {
          .nb-mobile-backdrop.open,
          .nb-mobile-menu.open { display: flex; }
        }
        .nb-mobile-backdrop { display: none; }
        .nb-mobile-menu { display: none; }

        @media (min-width: 841px) {
          .nb-mobile-backdrop, .nb-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* ── Mobile Backdrop ── */}
      {mobileOpen && (
        <div className="nb-mobile-backdrop open" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Navbar ── */}
      <nav className={`nb${scrolled ? " scrolled" : ""}`}>
        <div className="nb-inner">

          {/* Logo */}
          <div className="nb-logo" onClick={() => handleNavigate("home")}>
            <div className="nb-logo-img-wrap">
              <img src="/images/dhanvij builders.jpeg" alt="Dhanvij Builders Logo" className="nb-logo-img" />
            </div>
            <div className="nb-logo-text-wrap">
              <div className="nb-logo-name">Dhanvij Builders</div>
              <div className="nb-logo-sub">Civil Engineering</div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <ul className="nb-links">
            {NAV_LINKS.map((link) => (
              <li
                key={link.key}
                className={`nb-link${isActive(link.path) ? " active" : ""}`}
                onClick={() => handleNavigate(link.key)}
              >
                {link.label}
              </li>
            ))}
          </ul>

          {/* Right section */}
          <div className="nb-right">
            <div style={{ marginRight: "8px" }}>
              <LanguageSwitcher />
            </div>
            {clientToken ? (
              <>
                <div className="nb-user-chip">
                  <div className="nb-user-avatar">{clientName.charAt(0).toUpperCase()}</div>
                  <span className="nb-user-name">{clientName}</span>
                </div>
                <button className="nb-dashboard-btn" onClick={() => handleNavigate("dashboard")}>
                  My Dashboard
                </button>
              </>
            ) : adminToken ? (
              <button className="nb-admin-btn" onClick={() => handleNavigate("admin")}>
                🛡️ Admin Panel
              </button>
            ) : (
              <>
                {/* Sign Up Dropdown */}
                <button
                  className="nb-signup"
                  onClick={() => handleNavigate("client-signup")}
                >
                  Sign Up
                </button>

                {/* Sign In Dropdown */}
                <div className="nb-dropdown-wrap" ref={dropdownRef}>
                  <button
                    className="nb-signin-btn"
                    onClick={() => setDropdownOpen((p) => !p)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    Sign In
                    <i className={`nb-chevron${dropdownOpen ? " open" : ""}`}>▾</i>
                  </button>
                  {dropdownOpen && (
                    <div className="nb-dropdown" role="menu">
                      <div className="nb-dropdown-head">Select Portal</div>
                      <div className="nb-dropdown-item" onClick={() => handleNavigate("client-login")}>
                        <div className="nb-di-icon client">👤</div>
                        <div>
                          <div className="nb-di-title">Client Login</div>
                          <div className="nb-di-sub">Track projects & payments</div>
                        </div>
                      </div>
                      <div className="nb-dropdown-item" onClick={() => handleNavigate("admin-login")}>
                        <div className="nb-di-icon admin">🛡️</div>
                        <div>
                          <div className="nb-di-title">Admin Login</div>
                          <div className="nb-di-sub">Manage clients & projects</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Hamburger */}
            <div
              className={`nb-hamburger${mobileOpen ? " open" : ""}`}
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              <span className="nb-bar" />
              <span className="nb-bar" />
              <span className="nb-bar" />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Slide-in Menu ── */}
      {mobileOpen && (
        <div className="nb-mobile-menu open" ref={mobileRef}>
          {[
            { key: "home",     icon: "🏠", label: "Home",     path: "/" },
            { key: "services", icon: "⚙️", label: "Services", path: "/services" },
            { key: "projects", icon: "🏗️", label: "Projects", path: "/projects" },
            { key: "about",    icon: "ℹ️", label: "About",    path: "/about" },
          ].map((link) => (
            <div
              key={link.key}
              className={`nb-mobile-link${isActive(link.path) ? " active" : ""}`}
              onClick={() => handleNavigate(link.key)}
            >
              <span className="nb-mobile-link-icon">{link.icon}</span>
              {link.label}
            </div>
          ))}

          <div className="nb-mobile-divider" />

          {clientToken ? (
            <>
              <div className="nb-mobile-link" onClick={() => handleNavigate("dashboard")}>
                <span className="nb-mobile-link-icon">📊</span> My Dashboard
              </div>
            </>
          ) : adminToken ? (
            <div className="nb-mobile-link" onClick={() => handleNavigate("admin")}>
              <span className="nb-mobile-link-icon">🛡️</span> Admin Panel
            </div>
          ) : (
            <>
              <button className="nb-mobile-signin" onClick={() => handleNavigate("client-login")}>
                Sign In as Client
              </button>
              <button className="nb-mobile-signin" onClick={() => handleNavigate("admin-login")}
                style={{ marginTop: 8, background: "linear-gradient(135deg,#1e293b,#0f172a)", border: "1px solid rgba(255,255,255,0.12)" }}>
                Sign In as Admin
              </button>
              <button className="nb-mobile-signin" onClick={() => handleNavigate("client-signup")}
                style={{ background: "#10b981", boxShadow: "0 6px 20px rgba(16,185,129,0.35)" }}>
                Create Client Account
              </button>

            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
