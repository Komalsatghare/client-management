import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../config";


const ACCENT = "#d62b1b";
const API = `${API_BASE_URL}/api/feedback`;

function StarRating({ value, onChange, readonly = false, size = 22 }) {
  const [hovered, setHovered] = useState(0);
  const display = readonly ? value : (hovered || value);
  return (
    <div style={{ display: "flex", gap: 4, cursor: readonly ? "default" : "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: size,
            color: star <= display ? "#f59e0b" : "#d1d5db",
            transition: "color 0.15s, transform 0.15s",
            transform: !readonly && star <= display ? "scale(1.2)" : "scale(1)",
            display: "inline-block",
          }}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarPalette = [
  ["#f43f5e", "#fff"],
  ["#8b5cf6", "#fff"],
  ["#06b6d4", "#fff"],
  ["#10b981", "#fff"],
  ["#f97316", "#fff"],
  ["#3b82f6", "#fff"],
  ["#ec4899", "#fff"],
  ["#6366f1", "#fff"],
];

export default function TestimonialsSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", rating: 0, message: "" });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // Fetch real feedback from DB
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();
        setFeedbacks(data);
      } catch (e) {
        console.error("Failed to load feedback:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    if (feedbacks.length > 1 && !paused) {
      timerRef.current = setInterval(() => {
        setCurrentIdx((i) => (i + 1) % feedbacks.length);
      }, 4500);
    }
    return () => clearInterval(timerRef.current);
  }, [feedbacks.length, paused]);

  const goTo = (idx) => {
    setCurrentIdx(idx);
    setPaused(true);
    clearInterval(timerRef.current);
    setTimeout(() => setPaused(false), 8000);
  };
  const prev = () => goTo((currentIdx - 1 + feedbacks.length) % feedbacks.length);
  const next = () => goTo((currentIdx + 1) % feedbacks.length);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim() || !form.message.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (!form.rating) {
      setFormError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Submission failed");
      }
      const saved = await res.json();
      setFeedbacks((prev) => [saved, ...prev]);
      setSubmitted(true);
      setForm({ name: "", rating: 0, message: "" });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const visibleCount = Math.min(feedbacks.length, 3);
  const getVisible = () => {
    if (feedbacks.length === 0) return [];
    return Array.from({ length: visibleCount }, (_, i) =>
      feedbacks[(currentIdx + i) % feedbacks.length]
    );
  };

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
      : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .tm-section {
          padding: 100px 24px;
          background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%);
          font-family: 'Inter', 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .tm-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.18;
        }
        .tm-bg-orb-1 { width: 500px; height: 500px; background: #d62b1b; top: -150px; right: -100px; }
        .tm-bg-orb-2 { width: 400px; height: 400px; background: #7c3aed; bottom: -120px; left: -80px; }

        .tm-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

        .tm-header { text-align: center; margin-bottom: 64px; }
        .tm-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(214,43,27,0.15); border: 1px solid rgba(214,43,27,0.35);
          padding: 6px 18px; border-radius: 50px; margin-bottom: 20px;
        }
        .tm-eyebrow span { color: ${ACCENT}; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .tm-title {
          font-size: clamp(28px, 4vw, 44px); font-weight: 800; color: #fff;
          line-height: 1.2; margin: 0 0 16px;
        }
        .tm-title span { color: ${ACCENT}; }
        .tm-desc { font-size: 16px; color: #94a3b8; max-width: 560px; margin: 0 auto 28px; line-height: 1.7; }

        .tm-stats {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25);
          padding: 8px 20px; border-radius: 50px;
        }
        .tm-stats-num { font-size: 20px; font-weight: 800; color: #f59e0b; }
        .tm-stats-star { color: #f59e0b; font-size: 16px; }
        .tm-stats-cnt { font-size: 13px; color: #94a3b8; font-weight: 500; }

        .tm-carousel { position: relative; }
        .tm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .tm-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(10px);
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .tm-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(214,43,27,0.08) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
          border-radius: 20px;
        }
        .tm-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,0.35); border-color: rgba(214,43,27,0.4); }
        .tm-card:hover::before { opacity: 1; }

        .tm-quote-mark {
          font-size: 80px; line-height: 0.7; color: rgba(214,43,27,0.2);
          font-family: Georgia, serif; margin-bottom: 16px; display: block;
        }
        .tm-card-text { font-size: 15px; color: #cbd5e1; line-height: 1.75; margin-bottom: 24px; font-style: italic; }
        .tm-card-footer { display: flex; align-items: center; gap: 14px; }
        .tm-avatar {
          width: 46px; height: 46px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 16px; flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        }
        .tm-card-author { flex: 1; }
        .tm-card-name { font-size: 15px; font-weight: 700; color: #f1f5f9; margin-bottom: 2px; }
        .tm-card-date { font-size: 12px; color: #64748b; }

        .tm-nav {
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .tm-nav-btn {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
          color: #94a3b8; cursor: pointer; font-size: 18px; display: flex;
          align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .tm-nav-btn:hover { background: ${ACCENT}; border-color: ${ACCENT}; color: #fff; }
        .tm-dots { display: flex; gap: 8px; align-items: center; }
        .tm-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.2); border: none; cursor: pointer;
          transition: all 0.3s; padding: 0;
        }
        .tm-dot.active { background: ${ACCENT}; width: 24px; border-radius: 4px; }

        .tm-feedback-bar {
          margin-top: 60px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 32px 36px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
        }
        .tm-feedback-left h3 { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .tm-feedback-left p { font-size: 14px; color: #64748b; margin: 0; }
        .tm-leave-btn {
          background: ${ACCENT}; color: #fff;
          border: none; padding: 13px 28px; border-radius: 12px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
          box-shadow: 0 8px 24px rgba(214,43,27,0.35);
        }
        .tm-leave-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(214,43,27,0.45); filter: brightness(1.1); }

        .tm-empty {
          text-align: center; padding: 60px 20px;
          color: #475569; font-size: 16px;
        }
        .tm-empty-icon { font-size: 48px; margin-bottom: 12px; display: block; }

        /* Modal */
        .tm-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: tmFadeIn 0.2s ease;
        }
        @keyframes tmFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .tm-modal {
          background: #1e293b; border-radius: 20px; padding: 36px;
          width: 100%; max-width: 460px; position: relative;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          animation: tmSlideUp 0.25s ease;
        }
        @keyframes tmSlideUp { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }
        .tm-modal-close {
          position: absolute; top: 14px; right: 14px;
          background: rgba(255,255,255,0.07); border: none; border-radius: 8px;
          width: 32px; height: 32px; color: #94a3b8; cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s;
        }
        .tm-modal-close:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .tm-modal-title { font-size: 20px; font-weight: 800; color: #fff; margin: 0 0 6px; }
        .tm-modal-sub { font-size: 13px; color: #64748b; margin: 0 0 24px; }
        .tm-field { margin-bottom: 16px; }
        .tm-field label { display: block; font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 6px; }
        .tm-field input, .tm-field textarea {
          width: 100%; padding: 11px 14px;
          background: rgba(15,23,42,0.5); border: 1px solid #334155;
          border-radius: 10px; color: #fff; font-size: 14px;
          outline: none; transition: border-color 0.2s; box-sizing: border-box;
          font-family: inherit;
        }
        .tm-field input:focus, .tm-field textarea:focus { border-color: ${ACCENT}; }
        .tm-field input::placeholder, .tm-field textarea::placeholder { color: #475569; }
        .tm-field textarea { resize: vertical; min-height: 90px; }
        .tm-form-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          border-radius: 8px; padding: 10px 14px; color: #f87171; font-size: 13px; margin-bottom: 14px; }
        .tm-submit-btn {
          width: 100%; padding: 13px; background: ${ACCENT};
          border: none; border-radius: 11px; color: #fff; font-size: 14px;
          font-weight: 700; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(214,43,27,0.3);
        }
        .tm-submit-btn:hover:not(:disabled) { filter: brightness(1.1); box-shadow: 0 12px 30px rgba(214,43,27,0.4); }
        .tm-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .tm-success {
          text-align: center; padding: 16px 0;
        }
        .tm-success-icon { font-size: 52px; display: block; margin-bottom: 12px; }
        .tm-success h3 { color: #fff; font-size: 20px; font-weight: 800; margin: 0 0 8px; }
        .tm-success p { color: #94a3b8; font-size: 14px; margin: 0 0 20px; }
        .tm-success-close { padding: 11px 28px; background: ${ACCENT}; border: none;
          border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer;
          font-size: 14px; transition: filter 0.2s; }
        .tm-success-close:hover { filter: brightness(1.1); }

        @media (max-width: 640px) {
          .tm-section { padding: 70px 16px; }
          .tm-feedback-bar { flex-direction: column; text-align: center; }
          .tm-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="tm-section">
        {/* Background orbs */}
        <div className="tm-bg-orb tm-bg-orb-1" />
        <div className="tm-bg-orb tm-bg-orb-2" />

        <div className="tm-inner">
          {/* Header */}
          <div className="tm-header">
            <div className="tm-eyebrow">
              <span>✦ TESTIMONIALS</span>
            </div>
            <h2 className="tm-title">
              What Our <span>Clients</span> Say
            </h2>
            <p className="tm-desc">
              Real feedback from real clients — unedited and straight from the people who trusted us with their projects.
            </p>
            {feedbacks.length > 0 && (
              <div className="tm-stats">
                <span className="tm-stats-star">★</span>
                <span className="tm-stats-num">{avgRating}</span>
                <span className="tm-stats-cnt">/ 5 · {feedbacks.length} review{feedbacks.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          {/* Carousel / Grid */}
          {loading ? (
            <div className="tm-empty">
              <span className="tm-empty-icon">⏳</span>
              Loading reviews...
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="tm-empty">
              <span className="tm-empty-icon">💬</span>
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            <div className="tm-carousel">
              <div className="tm-grid">
                {getVisible().map((fb, i) => {
                  const [bg, fg] = avatarPalette[
                    (fb.name.charCodeAt(0) || i) % avatarPalette.length
                  ];
                  const date = fb.createdAt
                    ? new Date(fb.createdAt).toLocaleDateString("en-IN", {
                        month: "short", year: "numeric",
                      })
                    : "";
                  return (
                    <div className="tm-card" key={fb._id || i}>
                      <span className="tm-quote-mark">"</span>
                      <p className="tm-card-text">{fb.message}</p>
                      <div className="tm-card-footer">
                        <div
                          className="tm-avatar"
                          style={{ background: bg, color: fg }}
                        >
                          {getInitials(fb.name)}
                        </div>
                        <div className="tm-card-author">
                          <div className="tm-card-name">{fb.name}</div>
                          <div className="tm-card-date">
                            <StarRating value={fb.rating} readonly size={14} />
                          </div>
                        </div>
                        <div style={{ color: "#64748b", fontSize: 12 }}>{date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              {feedbacks.length > 3 && (
                <div className="tm-nav">
                  <button className="tm-nav-btn" onClick={prev}>‹</button>
                  <div className="tm-dots">
                    {feedbacks.slice(0, Math.min(feedbacks.length, 8)).map((_, i) => (
                      <button
                        key={i}
                        className={`tm-dot${i === currentIdx % feedbacks.length ? " active" : ""}`}
                        onClick={() => goTo(i)}
                      />
                    ))}
                  </div>
                  <button className="tm-nav-btn" onClick={next}>›</button>
                </div>
              )}
            </div>
          )}

          {/* Leave Feedback Bar */}
          <div className="tm-feedback-bar">
            <div className="tm-feedback-left">
              <h3>Share Your Experience</h3>
              <p>Have we worked with you? We'd love to hear your feedback.</p>
            </div>
            <button className="tm-leave-btn" onClick={() => { setShowModal(true); setSubmitted(false); }}>
              ✍ Leave a Review
            </button>
          </div>
        </div>
      </section>

      {/* Feedback Modal */}
      {showModal && (
        <div className="tm-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="tm-modal">
            <button className="tm-modal-close" onClick={() => setShowModal(false)}>✕</button>

            {submitted ? (
              <div className="tm-success">
                <span className="tm-success-icon">🎉</span>
                <h3>Thank You!</h3>
                <p>Your review has been posted and is now visible to others.</p>
                <button className="tm-success-close" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="tm-modal-title">Leave a Review</h2>
                <p className="tm-modal-sub">Share your honest experience with others</p>

                <form onSubmit={handleSubmit}>
                  <div className="tm-field">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="tm-field">
                    <label>Your Rating *</label>
                    <StarRating
                      value={form.rating}
                      onChange={(r) => setForm({ ...form, rating: r })}
                      size={28}
                    />
                  </div>
                  <div className="tm-field">
                    <label>Your Review *</label>
                    <textarea
                      placeholder="Tell us about your experience..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  {formError && <div className="tm-form-error">⚠️ {formError}</div>}

                  <button className="tm-submit-btn" type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Review →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

