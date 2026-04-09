import React, { useState, useEffect, useRef } from 'react';
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';

/**
 * A premium input component that supports English and Marathi transliteration.
 * Features:
 * - Language selection (EN/MR)
 * - Persistent language choice via localStorage
 * - Supports both <input> and <textarea>
 * - Custom premium styling with floating language switcher
 */
const TransliteratedInput = ({ 
    value, 
    onChange, 
    placeholder, 
    label, 
    type = 'text', 
    isTextArea = false, 
    containerStyle = {},
    inputClassName = "ua-input",
    rows = 2,
    id
}) => {
    // Persistent language choice: 'en' or 'mr'
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('dhanvij_agreement_lang') || 'en';
    });
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);

    const toggleLang = (newLang) => {
        setLang(newLang);
        localStorage.setItem('dhanvij_agreement_lang', newLang);
    };

    // Style for the container to position the language switcher
    const wrapperStyle = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
        ...containerStyle
    };

    const switcherStyle = {
        position: 'absolute',
        top: '-10px',
        right: '10px',
        display: 'flex',
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '2px',
        zIndex: 5,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        opacity: isFocused ? 1 : 0.4,
        transition: 'opacity 0.2s',
        pointerEvents: 'auto'
    };

    const btnStyle = (active) => ({
        padding: '2px 8px',
        fontSize: '10px',
        fontWeight: '800',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        background: active ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
        color: active ? 'white' : '#94a3b8',
        transition: 'all 0.2s'
    });

    return (
        <div style={wrapperStyle} onFocus={() => setIsFocused(true)} onBlur={(e) => {
            // Only hide switcher if focus moves outside the entire container
            if (!containerRef.current.contains(e.relatedTarget)) {
                setIsFocused(false);
            }
        }} ref={containerRef}>
            {label && <label className="ua-label">{label}</label>}
            
            <div style={switcherStyle}>
                <button 
                    type="button" 
                    style={btnStyle(lang === 'en')} 
                    onClick={() => toggleLang('en')}
                >
                    EN
                </button>
                <button 
                    type="button" 
                    style={btnStyle(lang === 'mr')} 
                    onClick={() => toggleLang('mr')}
                >
                    MR
                </button>
            </div>

            <ReactTransliterate
                value={value}
                onChangeText={onChange}
                lang={lang === 'mr' ? 'mr' : 'en'}
                enabled={lang === 'mr'}
                renderComponent={(props) => {
                    const { onChange: onLibChange, ...rest } = props;
                    if (isTextArea) {
                        return (
                            <textarea 
                                {...rest} 
                                onChange={onLibChange}
                                rows={rows} 
                                className={inputClassName} 
                                placeholder={placeholder}
                                id={id}
                            />
                        );
                    }
                    return (
                        <input 
                            {...rest} 
                            onChange={onLibChange}
                            type={type} 
                            className={inputClassName} 
                            placeholder={placeholder}
                            id={id}
                        />
                    );
                }}
            />
        </div>
    );
};

export default TransliteratedInput;
