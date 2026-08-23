"use client";

import VoiceSession from "../../components/voice-coach/VoiceSession";

export default function VoiceCoachPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        padding: "80px 20px 40px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <a
          href="/agents"
          style={{
            color: "#888",
            fontSize: 13,
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 10,
          }}
        >
          {"←"} Back to Agents
        </a>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Voice Communication Coach
        </h1>
        <p
          style={{
            color: "#888",
            fontSize: 14,
            marginTop: 8,
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Tap the orb and talk. Three short spoken exchanges, then a feedback
          report on how you communicated - grounded only in what was actually
          measured.
        </p>
      </div>
      <VoiceSession />
    </main>
  );
}
