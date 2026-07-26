"use client";

import type { DimensionFeedback, FeedbackReportData } from "../../../lib/voice-coach/types";

interface FeedbackReportProps {
  feedback: FeedbackReportData;
}

function DimensionCard({ title, data, note }: { title: string; data: DimensionFeedback; note?: string }) {
  return (
    <div style={styles.dimensionCard}>
      <h3 style={styles.dimensionTitle}>{title}</h3>
      {note && <p style={styles.dimensionNote}>{note}</p>}
      {data.observations.length === 0 ? (
        <p style={styles.emptyNote}>Not enough signal in this session to report on this dimension.</p>
      ) : (
        <ul style={styles.observationList}>
          {data.observations.map((obs, i) => (
            <li key={i} style={styles.observationItem}>
              <span style={styles.claim}>{obs.claim}</span>
              <span style={styles.evidence}>{obs.evidence}</span>
            </li>
          ))}
        </ul>
      )}
      {data.notMeasured.length > 0 && (
        <p style={styles.notMeasured}>Not measured: {data.notMeasured.join(", ")}</p>
      )}
    </div>
  );
}

export default function FeedbackReport({ feedback }: FeedbackReportProps) {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Communication Feedback</h2>
      <DimensionCard title="Delivery" data={feedback.delivery} />
      <DimensionCard title="Content" data={feedback.content} />
      <DimensionCard
        title="Articulation"
        data={feedback.articulation}
        note="Approximated from speech-to-text confidence and pace steadiness - not a precise acoustic measurement."
      />
      <div style={styles.suggestionsCard}>
        <h3 style={styles.dimensionTitle}>Suggestions</h3>
        <ol style={styles.suggestionsList}>
          {feedback.suggestions.map((s, i) => (
            <li key={i} style={styles.suggestionItem}>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    fontFamily: "Inter, sans-serif",
  },
  heading: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#e0e0e0",
    margin: "0 0 4px",
    textAlign: "center" as const,
  },
  dimensionCard: {
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(255, 255, 255, 0.03)",
  },
  dimensionTitle: {
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    color: "#b89c5a",
    margin: "0 0 10px",
  },
  dimensionNote: {
    fontSize: "12px",
    fontStyle: "italic",
    color: "rgba(255, 255, 255, 0.4)",
    margin: "0 0 10px",
  },
  observationList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  observationItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 1.5,
  },
  claim: {
    color: "rgba(255, 255, 255, 0.85)",
  },
  evidence: {
    color: "rgba(184, 156, 90, 0.85)",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  notMeasured: {
    marginTop: "10px",
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.35)",
    fontStyle: "italic",
  },
  emptyNote: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.4)",
    fontStyle: "italic",
    margin: 0,
  },
  suggestionsCard: {
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid rgba(184, 156, 90, 0.25)",
    background: "rgba(184, 156, 90, 0.06)",
  },
  suggestionsList: {
    margin: 0,
    paddingLeft: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  suggestionItem: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 1.5,
  },
};
