import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare,
    Clock, Wifi, Shield, ExternalLink, CheckCircle
} from "lucide-react";
import { API_BASE_URL } from "../config";


/* ─────────────────────────────────────
   Video Room — Zoom Meeting Launcher
   Approach: Show lobby with camera preview,
   then open Zoom meeting in external tab
   (avoids Zoom SDK bundler compatibility issues)
───────────────────────────────────────── */
export default function VideoRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [isMuted, setIsMuted]       = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [joinedZoom, setJoinedZoom] = useState(false);
    const [showChat, setShowChat]     = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [chatInput, setChatInput]   = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [elapsed, setElapsed]       = useState(0);
    const [localStream, setLocalStream] = useState(null);
    const [cameraError, setCameraError] = useState(false);

    const localVideoRef = useRef(null);
    const timerRef      = useRef(null);

    /* URL params */
    const meetingNumber = searchParams.get("meetingId") || roomId;
    const role          = searchParams.get("role") === "admin" ? 1 : 0;
    const joinUrl       = searchParams.get("joinUrl") ? decodeURIComponent(searchParams.get("joinUrl")) : null;
    const startUrl      = searchParams.get("startUrl") ? decodeURIComponent(searchParams.get("startUrl")) : null;
    const zoomUrl       = role === 1 ? (startUrl || joinUrl) : (joinUrl || startUrl);
    const userName      = searchParams.get("name")
        ? decodeURIComponent(searchParams.get("name"))
        : role === 1 ? "Admin (Host)" : (localStorage.getItem("clientName") || "Client");

    /* Camera preview */
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            })
            .catch(() => setCameraError(true));
        return () => { if (localStream) localStream.getTracks().forEach(t => t.stop()); };
    }, []);

    /* 40-minute timer (starts when user clicks Join) */
    useEffect(() => {
        if (joinedZoom) {
            timerRef.current = setInterval(() => {
                setElapsed(prev => {
                    if (prev >= 2400) { clearInterval(timerRef.current); return prev; }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [joinedZoom]);

    const toggleMute = () => {
        if (localStream) {
            const t = localStream.getAudioTracks()[0];
            if (t) t.enabled = isMuted;
        }
        setIsMuted(p => !p);
    };

    const toggleVideo = () => {
        if (localStream) {
            const t = localStream.getVideoTracks()[0];
            if (t) t.enabled = isVideoOff;
        }
        setIsVideoOff(p => !p);
    };

    const handleJoinZoom = () => {
        // Redirect to the enhanced EJS join hub which handles 'OS not supported' issues
        // and provides direct App vs Browser options.
        const hubUrl = `${API_BASE_URL}/api/zoom/join/${roomId.replace('req-', '')}`;
        window.open(hubUrl, "_blank");
        setJoinedZoom(true);
    };

    const handleLeave = () => {
        if (localStream) localStream.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
        navigate(-1);
    };

    const sendChat = () => {
        if (!chatInput.trim()) return;
        setChatMessages(prev => [...prev, {
            from: userName, text: chatInput,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }]);
        setChatInput("");
    };

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    const remaining = 2400 - elapsed;
    const noMeeting = !meetingNumber || meetingNumber === "null" || meetingNumber === "undefined";

    return (
        <div style={S.page}>
            <style>{css}</style>

            {/* ── Top bar ── */}
            <div style={S.topBar}>
                <div style={S.topBarL}>
                    <div style={S.zLogo}>Z</div>
                    <span style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: "700" }}>
                        Dhanvij Builders — Video Meeting
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {joinedZoom && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Clock size={14} color={remaining < 300 ? "#ef4444" : "#60a5fa"} />
                            <span style={{ color: remaining < 300 ? "#ef4444" : "#60a5fa", fontWeight: "700", fontSize: "14px" }}>
                                {fmt(remaining)} left
                            </span>
                        </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Shield size={14} color="#10b981" />
                        <span style={{ fontSize: "12px", color: "#10b981" }}>End-to-end encrypted</span>
                    </div>
                </div>
            </div>

            {/* ── Main content ── */}
            <div style={S.main}>

                {/* Camera preview */}
                <div style={S.previewCol}>
                    <div style={S.previewBox}>
                        <video ref={localVideoRef} autoPlay muted playsInline
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "14px", transform: "scaleX(-1)", display: isVideoOff ? "none" : "block" }} />
                        {(isVideoOff || cameraError) && (
                            <div style={S.camOff}>
                                <div style={S.avatar}>{userName.charAt(0).toUpperCase()}</div>
                                <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "12px" }}>
                                    {cameraError ? "Camera unavailable" : "Camera is off"}
                                </p>
                            </div>
                        )}
                        {/* Mic/Video controls overlay */}
                        <div style={S.previewOverlay}>
                            <button style={isMuted ? S.ctrlRed : S.ctrl} onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>
                            <button style={isVideoOff ? S.ctrlRed : S.ctrl} onClick={toggleVideo} title={isVideoOff ? "Start Video" : "Stop Video"}>
                                {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                            </button>
                        </div>
                    </div>
                    <p style={{ margin: "12px 0 2px", color: "#fff", fontWeight: "700", fontSize: "16px" }}>{userName}</p>
                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>{role === 1 ? "Host" : "Participant"}</p>
                </div>

                {/* Join panel */}
                <div style={S.joinPanel}>

                    {/* Zoom badge */}
                    <div style={S.zBadge}>
                        <div style={S.zIcon}>Z</div>
                        <div>
                            <p style={{ margin: 0, color: "#fff", fontWeight: "700", fontSize: "14px" }}>Zoom Video Conference</p>
                            <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Powered by Zoom APIs</p>
                        </div>
                    </div>

                    {noMeeting ? (
                        /* No meeting scheduled state */
                        <div style={{ textAlign: "center", padding: "16px", background: "rgba(239,68,68,0.08)", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)" }}>
                            <p style={{ color: "#fca5a5", fontSize: "15px", fontWeight: "700", margin: "0 0 8px" }}>⚠️ Zoom Meeting Not Linked</p>
                            <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0, lineHeight: "1.6" }}>
                                A Zoom ID hasn't been linked to this room yet. Ask the admin to "Confirm & Sync Zoom" in the Project Requests page to enable the meeting link.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h2 style={{ margin: "0 0 4px", color: "#fff", fontSize: "22px", fontWeight: "800" }}>
                                    {joinedZoom ? "You're in the meeting!" : "Ready to join?"}
                                </h2>
                                <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
                                    Meeting ID: <strong style={{ color: "#e2e8f0" }}>{meetingNumber}</strong>
                                </p>
                            </div>

                            {/* Info items */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {[
                                    { icon: <Clock size={15} color="#60a5fa" />, text: "40-minute session limit" },
                                    { icon: <Users size={15} color="#60a5fa" />, text: role === 1 ? "You are the host" : "Joining as participant" },
                                    { icon: <Wifi size={15} color="#10b981" />, text: "HD Video & Audio via Zoom" },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "13px" }}>
                                        {item.icon} {item.text}
                                    </div>
                                ))}
                            </div>

                            {!joinedZoom ? (
                                <button className="join-btn" onClick={handleJoinZoom}>
                                    <ExternalLink size={18} />
                                    {role === 1 ? "Start Meeting (Host)" : "Join Zoom Meeting"}
                                </button>
                            ) : (
                                <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                                    <CheckCircle size={24} color="#10b981" style={{ display: "block", margin: "0 auto 8px" }} />
                                    <p style={{ margin: "0 0 4px", color: "#10b981", fontWeight: "700" }}>Zoom opened in new tab</p>
                                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>Your 40-minute timer has started</p>
                                </div>
                            )}

                            {joinedZoom && (
                                <button className="join-btn" onClick={handleJoinZoom} style={{ background: "rgba(37,99,235,0.3)", boxShadow: "none", border: "1px solid rgba(37,99,235,0.4)" }}>
                                    <ExternalLink size={16} /> Reopen Zoom Meeting
                                </button>
                            )}
                        </>
                    )}

                    <button style={S.cancelBtn} onClick={handleLeave}>
                        ← Leave / Go Back
                    </button>
                </div>
            </div>

            {/* ── Bottom control bar ── */}
            <div style={S.ctrlBar}>
                {[
                    { label: isMuted ? "Unmute" : "Mute", icon: isMuted ? <MicOff size={22} /> : <Mic size={22} />, red: isMuted, action: toggleMute },
                    { label: isVideoOff ? "Start Video" : "Stop Video", icon: isVideoOff ? <VideoOff size={22} /> : <Video size={22} />, red: isVideoOff, action: toggleVideo },
                    { label: "Participants", icon: <Users size={22} />, active: showParticipants, action: () => setShowParticipants(p => !p) },
                    { label: "Chat", icon: <MessageSquare size={22} />, active: showChat, action: () => setShowChat(p => !p) },
                ].map((btn, i) => (
                    <div key={i} style={S.ctrlGroup}>
                        <button
                            style={btn.red ? S.ctrlBtnRed : (btn.active ? { ...S.ctrlBtn, background: "rgba(37,99,235,0.3)" } : S.ctrlBtn)}
                            onClick={btn.action} title={btn.label}
                        >
                            {btn.icon}
                        </button>
                        <span style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "600" }}>{btn.label}</span>
                    </div>
                ))}
                <div style={S.ctrlGroup}>
                    <button style={S.leaveBtn} onClick={handleLeave} title="Leave">
                        <PhoneOff size={22} />
                    </button>
                    <span style={{ color: "#ef4444", fontSize: "11px", fontWeight: "600" }}>Leave</span>
                </div>
            </div>

            {/* Participants panel */}
            {showParticipants && (
                <div style={S.panel}>
                    <div style={S.panelHead}>
                        <span style={{ color: "#fff", fontWeight: "700" }}>Participants</span>
                        <button style={S.closeBtn} onClick={() => setShowParticipants(false)}>✕</button>
                    </div>
                    <div style={S.pRow}>
                        <div style={S.pAvatar}>{userName.charAt(0).toUpperCase()}</div>
                        <div>
                            <p style={{ margin: 0, color: "#fff", fontSize: "14px" }}>{userName} (You)</p>
                            <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>{role === 1 ? "Host" : "Participant"}</p>
                        </div>
                        {isMuted && <MicOff size={14} color="#ef4444" style={{ marginLeft: "auto" }} />}
                    </div>
                    <p style={{ color: "#64748b", fontSize: "13px", padding: "12px 16px" }}>
                        Waiting for others to join via Zoom...
                    </p>
                </div>
            )}

            {/* Chat panel */}
            {showChat && (
                <div style={S.panel}>
                    <div style={S.panelHead}>
                        <span style={{ color: "#fff", fontWeight: "700" }}>Meeting Chat</span>
                        <button style={S.closeBtn} onClick={() => setShowChat(false)}>✕</button>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {chatMessages.length === 0
                            ? <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center", marginTop: "40px" }}>No messages yet.</p>
                            : chatMessages.map((msg, i) => (
                                <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "10px 12px" }}>
                                    <span style={{ color: "#60a5fa", fontWeight: "700", fontSize: "13px" }}>{msg.from}</span>
                                    <span style={{ color: "#94a3b8", fontSize: "11px", marginLeft: "8px" }}>{msg.time}</span>
                                    <p style={{ margin: "4px 0 0", color: "#e2e8f0", fontSize: "14px" }}>{msg.text}</p>
                                </div>
                            ))}
                    </div>
                    <div style={{ display: "flex", gap: "8px", padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                        <input
                            style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "13px", outline: "none" }}
                            placeholder="Type a message..."
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendChat()}
                        />
                        <button onClick={sendChat} style={{ padding: "8px 14px", background: "#2563eb", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const S = {
    page:       { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#0f172a 100%)", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" },
    topBar:     { height: "56px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", flexShrink: 0 },
    topBarL:    { display: "flex", alignItems: "center", gap: "12px" },
    zLogo:      { width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#2563eb,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "16px" },
    main:       { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", padding: "24px 32px", flexWrap: "wrap" },
    previewCol: { width: "360px", display: "flex", flexDirection: "column", alignItems: "center" },
    previewBox: { width: "100%", height: "230px", borderRadius: "16px", overflow: "hidden", background: "#0f172a", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 48px rgba(0,0,0,0.4)", position: "relative" },
    camOff:     { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#1e293b" },
    avatar:     { width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "28px" },
    previewOverlay: { position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "12px" },
    ctrl:       { width: "40px", height: "40px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", backdropFilter: "blur(10px)" },
    ctrlRed:    { width: "40px", height: "40px", borderRadius: "50%", background: "rgba(239,68,68,0.7)", border: "1px solid rgba(239,68,68,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" },
    joinPanel:  { width: "380px", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px" },
    zBadge:     { display: "flex", alignItems: "center", gap: "12px", background: "rgba(37,99,235,0.1)", borderRadius: "12px", padding: "12px 16px", border: "1px solid rgba(37,99,235,0.2)" },
    zIcon:      { width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg,#2563eb,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "18px", flexShrink: 0 },
    cancelBtn:  { padding: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "#94a3b8", fontSize: "14px", cursor: "pointer", fontWeight: "600" },
    ctrlBar:    { height: "80px", background: "rgba(0,0,0,0.85)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "0 24px", flexShrink: 0, zIndex: 10 },
    ctrlGroup:  { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "68px" },
    ctrlBtn:    { width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" },
    ctrlBtnRed: { width: "48px", height: "48px", borderRadius: "12px", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", cursor: "pointer" },
    leaveBtn:   { width: "48px", height: "48px", borderRadius: "12px", background: "#ef4444", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.4)" },
    panel:      { position: "fixed", top: "56px", right: 0, bottom: "80px", width: "300px", background: "#1e293b", borderLeft: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", zIndex: 20 },
    panelHead:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)" },
    closeBtn:   { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" },
    pRow:       { display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px" },
    pAvatar:    { width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "14px", flexShrink: 0 },
};

const css = `
.join-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 14px; background: linear-gradient(135deg,#2563eb,#4f46e5);
    border: none; border-radius: 12px; color: #fff; font-size: 15px;
    font-weight: 700; cursor: pointer; width: 100%;
    box-shadow: 0 8px 24px rgba(37,99,235,0.4);
    transition: transform 0.15s, box-shadow 0.15s;
}
.join-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.5); }
`;
