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

    // Close on click outside
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
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    color: "#475569",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s"
                }}
            >
                <Globe size={16} />
                <span>{currentLanguageName}</span>
                <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>

            {isOpen && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    marginTop: "8px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    zIndex: 2000,
                    minWidth: "120px",
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
                                padding: "10px 14px",
                                cursor: "pointer",
                                transition: "background 0.2s",
                                background: language === lang.code ? "rgba(59, 130, 246, 0.1)" : "transparent",
                                color: language === lang.code ? "#3b82f6" : "#475569",
                                fontWeight: language === lang.code ? "700" : "500",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
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
