"use client";

import ResilienceRadar from "./ResilienceRadar";
import ShockCascade from "./ShockCascade";
import HistoricalAnalogue from "./HistoricalAnalogue";
import SurvivalConditions from "./SurvivalConditions";
import type { StressTestResult, Verdict } from "../../../lib/tokenomics/types";

interface ResultsPanelProps {
  result: StressTestResult;
  onRerun: () => void;
}

const VERDICT_DISPLAY: Record<Verdict, { label: string; color: string; icon: string }> = {
  survives: { label: "Survives", color: "#4CAF50", icon: "✓" },
  "at-risk": { label: "At Risk", color: "#FF9800", icon: "⚠" },
  "critical-failure": { label: "Critical Failure", color: "#F44336", icon: "✗" },
};

export default function ResultsPanel({ result, onRerun }: ResultsPanelProps) {
  const verdictInfo = VERDICT_DISPLAY[result.verdict];

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
      {/* Verdict badge */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 28px",
            borderRadius: 14,
            background: verdictInfo.color + "15",
            border: "1px solid " + verdictInfo.color + "44",
          }}
        >
          <span style={{ fontSize: 24 }}>{verdictInfo.icon}</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: verdictInfo.color }}>
            {verdictInfo.label}
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
          {result.verdictSummary}
        </p>
        <div style={{ marginTop: 8, color: "#666", fontSize: 12 }}>
          {result.tokenLabel} &middot; {result.scenario} &middot; {result.severity} severity
        </div>
      </div>

      {/* Radar chart */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#d4af37",
            fontWeight: 700,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Resilience Profile
        </div>
        <ResilienceRadar dimensions={result.dimensions} verdict={result.verdict} />
      </div>

      {/* Shock cascade */}
      <div>
        <div
          style={{
            fontSize: 12,
            color: "#d4af37",
            fontWeight: 700,
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Shock Cascade
        </div>
        <ShockCascade steps={result.shockCascade} />
      </div>

      {/* Historical analogue */}
      <HistoricalAnalogue analogue={result.historicalAnalogue} />

      {/* Survival conditions */}
      <SurvivalConditions
        survivesIf={result.survivesIf}
        breaksWhen={result.breaksWhen}
      />

      {/* Rerun */}
      <button
        onClick={onRerun}
        style={{
          padding: "14px 28px",
          borderRadius: 10,
          border: "1px solid #d4af37",
          background: "transparent",
          color: "#d4af37",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.3s",
          width: "100%",
        }}
      >
        Run Another Test
      </button>
    </div>
  );
}
