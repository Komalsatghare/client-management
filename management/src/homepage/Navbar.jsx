import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Menu, X, Home, Briefcase, Info, LayoutGrid, User, Shield, ChevronDown, LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",     key: "home",     path: "/",         icon: Home },
  { label: "Services", key: "services", path: "/services", icon: Briefcase },
  { label: "Projects", key: "projects", path: "/projects", icon: LayoutGrid },
  { label: "About",    key: "about",    path: "/about",    icon: Info },
];

function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  
  const dropdownRef = useRef(null);
  const mobileRef   = useRef(null);

  const clientToken = localStorage.getItem("clientAuthToken");
  const adminToken  = localStorage.getItem("authToken");
  const clientName  = localStorage.getItem("clientName") || "Client";

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function close(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavigate = (path, isKey = false) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    
    if (isKey) {
      switch (path) {
        case "home":          navigate("/");                break;
        case "projects":      navigate("/projects");        break;
        case "services":      navigate("/services");        break;
        case "about":         navigate("/about");           break;
        case "client-signup": navigate("/client-signup");   break;
        case "client-login":  navigate("/client-login");    break;
        case "admin-login":   navigate("/login");           break;
        case "dashboard":     navigate("/client-dashboard"); break;
        case "admin":         navigate("/admin-dashboard"); break;
        default: break;
      }
    } else {
      navigate(path);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── Navbar Container ── */}
      <nav 
        className={`sticky top-0 z-[1000] w-full h-[72px] transition-all duration-300 border-b flex items-center
          ${scrolled 
            ? "bg-[#0a0e1e]/95 backdrop-blur-md shadow-lg border-white/10" 
            : "bg-[#0a0e1e]/40 backdrop-blur-sm border-white/5"}`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group no-underline"
            onClick={() => handleNavigate("/")}
          >
            <div className="relative shrink-0">
              <img 
                src="/images/photo.jpeg" 
                alt="Dhanvij Builders Logo" 
                className="w-10 h-10 rounded-xl object-cover border-2 border-[#d62b1b]/40 group-hover:border-[#d62b1b]/80 shadow-md transition-all duration-300" 
              />
              <div className="absolute inset-0 rounded-xl bg-[#d62b1b]/10 blur shadow-[0_0_15px_rgba(214,43,27,0.2)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-extrabold text-base sm:text-lg tracking-tight">Dhanvij Builders</span>
              <span className="text-[#cbd5e1] font-bold text-[10px] uppercase tracking-widest hidden sm:block">Civil Engineering</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            {NAV_LINKS.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavigate(link.path)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative
                  ${isActive(link.path) 
                    ? "text-white bg-white/10" 
                    : "text-[#cbd5e1] hover:text-white hover:bg-white/5"}`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#d62b1b] to-[#f87171] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-3">
            <div className="mr-1">
              <LanguageSwitcher />
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden sm:flex items-center gap-2">
              {clientToken ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xs">
                      {clientName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[#e2e8f0] text-sm font-semibold hidden md:inline">{clientName}</span>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:scale-[1.02] active:scale-[0.98] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md"
                    onClick={() => handleNavigate("/client-dashboard")}
                  >
                    Dashboard
                  </button>
                </div>
              ) : adminToken ? (
                <button 
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                  onClick={() => handleNavigate("/admin-dashboard")}
                >
                  <Shield size={16} /> Admin Panel
                </button>
              ) : (
                <>
                  <button 
                    className="text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    onClick={() => handleNavigate("/client-signup")}
                  >
                    Sign Up
                  </button>
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      className="bg-gradient-to-r from-[#d62b1b] to-[#b91c1c] hover:contrast-125 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-red-900/20"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      Sign In
                      <ChevronDown size={14} className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    {/* Sign In Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute top-full right-0 mt-3 w-64 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 bg-white/5 text-[10px] font-bold text-[#64748b] uppercase tracking-wider border-b border-white/5">Select Portal</div>
                        <button 
                          className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left group"
                          onClick={() => handleNavigate("/client-login")}
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">👤</div>
                          <div>
                            <div className="text-white text-sm font-bold">Client Login</div>
                            <div className="text-[#64748b] text-[11px]">Track projects & payments</div>
                          </div>
                        </button>
                        <button 
                          className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left group border-t border-white/5"
                          onClick={() => handleNavigate("/login")}
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🛡️</div>
                          <div>
                            <div className="text-white text-sm font-bold">Admin Login</div>
                            <div className="text-[#64748b] text-[11px]">Manage operations</div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-[#cbd5e1] hover:bg-white/10 hover:text-white transition-all active:scale-95"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sidebar Menu ── */}
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] transition-opacity duration-300 lg:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <div 
        ref={mobileRef}
        className={`fixed top-0 right-0 h-full w-[300px] bg-[#0f172a] border-l border-white/10 z-[1200] p-6 flex flex-col gap-8 shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/photo.jpeg" alt="Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-white font-bold">Navigation</span>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg bg-white/5 text-[#94a3b8] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNavigate(link.path)}
              className={`flex items-center gap-3 p-4 rounded-xl text-base font-semibold transition-all
                ${isActive(link.path) 
                  ? "bg-[#d62b1b]/10 text-[#d62b1b] border border-[#d62b1b]/20" 
                  : "text-[#cbd5e1] hover:bg-white/5 hover:text-white border border-transparent"}`}
            >
              <link.icon size={20} />
              {link.label}
            </button>
          ))}
        </div>

        <div className="h-px bg-white/5 w-full mt-2" />

        {/* Mobile Auth Actions */}
        <div className="flex flex-col gap-3 mt-auto mb-10">
          {clientToken ? (
            <button 
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white p-4 rounded-xl font-bold"
              onClick={() => handleNavigate("/client-dashboard")}
            >
              <LayoutDashboard size={20} /> My Dashboard
            </button>
          ) : adminToken ? (
            <button 
              className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white p-4 rounded-xl font-bold"
              onClick={() => handleNavigate("/admin-dashboard")}
            >
              <Shield size={20} /> Admin Panel
            </button>
          ) : (
            <>
              <button 
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d62b1b] to-[#b91c1c] text-white p-4 rounded-xl font-bold shadow-lg shadow-red-950/20"
                onClick={() => handleNavigate("/client-login")}
              >
                Sign In as Client
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 bg-[#1e293b] border border-white/10 text-white p-4 rounded-xl font-bold"
                onClick={() => handleNavigate("/login")}
              >
                Sign In as Admin
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white p-4 rounded-xl font-bold mt-2"
                onClick={() => handleNavigate("/client-signup")}
              >
                Create Client Account
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
