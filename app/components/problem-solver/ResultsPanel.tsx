"use client";

import { FRAMEWORKS } from "../../../lib/problem-solver/frameworks";
import type { Confidence, ProblemSolverResult } from "../../../lib/problem-solver/types";

interface ResultsPanelProps {
  result: ProblemSolverResult;
  onRerun: () => void;
}

const CONFIDENCE_DISPLAY: Record<Confidence, { label: string; color: string; icon: string }> = {
  high: { label: "High Confidence", color: "#4CAF50", icon: "✓" },
  medium: { label: "Medium Confidence", color: "#FF9800", icon: "~" },
  low: { label: "Low Confidence", color: "#9E9E9E", icon: "?" },
};

export default function ResultsPanel({ result, onRerun }: ResultsPanelProps) {
  const confidenceInfo = CONFIDENCE_DISPLAY[result.confidence];
  const primary = FRAMEWORKS[result.recommendedFramework.id];

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Confidence badge */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 28px",
            borderRadius: 14,
            background: confidenceInfo.color + "15",
            border: "1px solid " + confidenceInfo.color + "44",
          }}
        >
          <span style={{ fontSize: 24 }}>{confidenceInfo.icon}</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: confidenceInfo.color }}>
            {confidenceInfo.label}
          </span>
        </div>
        <p
          style={{
            marginTop: 14,
            color: "#ccc",
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {result.problemType}
        </p>
        <div style={{ marginTop: 8, color: "#666", fontSize: 12 }}>
          {result.confidenceReason}
        </div>
      </div>

      {/* Recommended framework */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 12,
          padding: 20,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "var(--color-accent)",
            fontWeight: 700,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Recommended Framework
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "4px 0 2px", color: "#fff" }}>
          {primary.name}
        </h2>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>{primary.category}</div>
        <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
          {result.recommendedFramework.whyThisFits}
        </p>
        <div
          style={{
            fontSize: 12,
            color: "#888",
            fontWeight: 600,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          How to apply it
        </div>
        <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {result.recommendedFramework.howToApply.map(function (step, i) {
            return (
              <li key={i} style={{ color: "#ddd", fontSize: 14, lineHeight: 1.6 }}>
                {step}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Alternative frameworks */}
      <div>
        <div
          style={{
            fontSize: 12,
            color: "var(--color-accent)",
            fontWeight: 700,
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Alternatives Considered
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {result.alternativeFrameworks.map(function (alt) {
            const framework = FRAMEWORKS[alt.id];
            return (
              <div
                key={alt.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
                  {framework.name}
                </div>
                <div style={{ fontSize: 11, color: "#777", marginBottom: 8 }}>{framework.category}</div>
                <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  {alt.whenToUseInstead}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rerun */}
      <button
        onClick={onRerun}
        style={{
          padding: "14px 28px",
          borderRadius: 10,
          border: "1px solid var(--color-accent)",
          background: "transparent",
          color: "var(--color-accent)",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.3s",
          width: "100%",
        }}
      >
        Solve Another Problem
      </button>
    </div>
  );
}
