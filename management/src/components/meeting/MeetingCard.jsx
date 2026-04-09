import React from "react";
import { CalendarClock, Clock3, Video, AlertCircle } from "lucide-react";
import styles from "./MeetingCard.module.css";

function getCardStatus(status, isExpired) {
  if (status === "meeting_scheduled" && !isExpired) {
    return { text: "Scheduled", cls: styles.scheduled };
  }
  if (status === "meeting_requested") {
    return { text: "Pending", cls: styles.pending };
  }
  return { text: "Completed", cls: styles.completed };
}

function buildDateTime(date, time) {
  if (!date || !time) return null;
  const val = new Date(`${date}T${time}`);
  return Number.isNaN(val.getTime()) ? null : val;
}

function isZoomLink(link) {
  if (!link) return false;
  return /^https?:\/\/.+/i.test(link) || /^\//.test(link);
}

export default function MeetingCard({ meeting, role = "client" }) {
  const dt = buildDateTime(meeting.meetingDate, meeting.meetingTime);
  const expired = dt ? dt.getTime() < Date.now() : false;
  const status = getCardStatus(meeting.status, expired);
  const canJoin = isZoomLink(meeting.meetingLocation);
  const openLink = () => {
    if (!canJoin) return;
    const href = meeting.meetingLocation.startsWith("/")
      ? `${window.location.origin}${meeting.meetingLocation}`
      : meeting.meetingLocation;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const countdownText = (() => {
    if (!dt || expired || meeting.status !== "meeting_scheduled") return "";
    const diff = dt.getTime() - Date.now();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min remaining`;
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hours}h ${rem}m remaining`;
  })();

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <div>
          <p className={styles.topic}>{meeting.title || "Meeting Topic"}</p>
          <p className={styles.sub}>{meeting.clientName || "Client request"}</p>
        </div>
        <span className={`${styles.status} ${status.cls}`}>{status.text}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.meta}>
          <CalendarClock size={14} />
          {meeting.meetingDate || "Date not set"}
        </span>
        <span className={styles.meta}>
          <Clock3 size={14} />
          {meeting.meetingTime || "Time not set"}
        </span>
      </div>

      {meeting.meetingMessage ? (
        <p className={styles.note}>{meeting.meetingMessage}</p>
      ) : null}

      {countdownText ? <p className={styles.countdown}>{countdownText}</p> : null}

      <div className={styles.actions}>
        <button
          className={styles.btnPrimary}
          disabled={!canJoin}
          onClick={openLink}
          title={!isZoomLink(meeting.meetingLocation) ? "Meeting link is not available yet" : ""}
        >
          <Video size={14} style={{ marginRight: 6 }} />
          Join Zoom Meeting
        </button>
        {expired || meeting.status === "completed" ? (
          <span className={styles.meta}>
            <AlertCircle size={14} />
            {role === "admin" ? "Session closed" : "Meeting ended"}
          </span>
        ) : null}
      </div>
    </article>
  );
}
