import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Globe, ChevronDown } from "lucide-react";

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: "en", name: "English" },
        { code: "mr", name: "मराठी" },
        { code: "hi", name: "हिंदी" }
    ];

    const currentLanguageName = languages.find(l => l.code === language)?.name || "English";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="language-switcher-container" style={{ position: "relative", marginLeft: "10px" }} ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    color: "#1e293b",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "all 0.2s"
                }}
            >
                <Globe size={16} color="#64748b" />
                <span>{currentLanguageName}</span>
                <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>

            {isOpen && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    marginTop: "8px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    zIndex: 2000,
                    minWidth: "130px",
                    overflow: "hidden"
                }}>
                    {languages.map((lang) => (
                        <div 
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            style={{
                                padding: "12px 16px",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                background: language === lang.code ? "#f1f5f9" : "transparent",
                                color: language === lang.code ? "#2563eb" : "#475569",
                                fontWeight: language === lang.code ? "700" : "500",
                            }}
                            onMouseEnter={(e) => language !== lang.code && (e.currentTarget.style.background = "#f8fafc")}
                            onMouseLeave={(e) => language !== lang.code && (e.currentTarget.style.background = "transparent")}
                        >
                            {lang.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
