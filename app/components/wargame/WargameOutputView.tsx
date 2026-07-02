"use client";

import type { WargameResult } from "../../../lib/wargame/types";
import { marketDefinitionToLabels } from "../../../lib/wargame/prompts";

interface WargameOutputViewProps {
  result: WargameResult;
  onReset: () => void;
}

const CONFIDENCE_COLOR: Record<string, string> = {
  High: "#4CAF50",
  Moderate: "#d4af37",
  Low: "#FF8A65",
};

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        color: "#d4af37",
        fontSize: 13,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

export default function WargameOutputView({ result, onReset }: WargameOutputViewProps) {
  const labels = marketDefinitionToLabels(result.marketDefinition);
  const confidenceColor = CONFIDENCE_COLOR[result.confidence] ?? "#d4af37";
  const generatedDate = new Date(result.generatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      {/* Header */}
      <div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            marginBottom: 8,
          }}
        >
          Market Entry Wargame
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <span style={{ color: "#888", fontSize: 13 }}>Generated: {generatedDate}</span>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              color: confidenceColor,
              border: `1px solid ${confidenceColor}55`,
              background: `${confidenceColor}15`,
            }}
          >
            Confidence: {result.confidence}
          </span>
          <span style={{ color: "#888", fontSize: 13 }}>
            Sources: {result.sourceMode}
          </span>
        </div>
      </div>

      {/* Market definition */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <SectionLabel>Market Definition</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            fontSize: 14,
          }}
        >
          <div>
            <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase" }}>Vertical</div>
            <div style={{ color: "#fff" }}>{labels.vertical}</div>
          </div>
          <div>
            <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase" }}>Technology</div>
            <div style={{ color: "#fff" }}>{labels.technology}</div>
          </div>
          <div>
            <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase" }}>Geography</div>
            <div style={{ color: "#fff" }}>{labels.geography}</div>
          </div>
          <div>
            <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase" }}>Segment</div>
            <div style={{ color: "#fff" }}>{labels.segment}</div>
          </div>
        </div>
      </div>

      {/* Top incumbents */}
      <div>
        <SectionLabel>Top Three Incumbents</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.topIncumbents.map(function (inc, i) {
            return (
              <div
                key={inc.name + i}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: 14,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  {i + 1}. {inc.name}{" "}
                  <span style={{ color: "#888", fontWeight: 400, fontSize: 12 }}>
                    ({inc.marketTier})
                  </span>
                </div>
                <div style={{ color: "#ccc", fontSize: 13, marginBottom: 4 }}>
                  {inc.positioning}
                </div>
                <div style={{ color: "#4FC3F7", fontSize: 12 }}>
                  Primary moat: {inc.primaryMoat}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defensive responses */}
      <div>
        <SectionLabel>Defensive Responses (ranked by probability)</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.defensiveResponses.map(function (dr, i) {
            return (
              <div
                key={dr.incumbentName + i}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: 14,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  {dr.incumbentName} →{" "}
                  <span style={{ color: "#d4af37" }}>{dr.archetype}</span>
                </div>
                <div style={{ color: "#ccc", fontSize: 13, marginBottom: 4 }}>
                  {dr.predictedAction}
                </div>
                <div style={{ color: "#888", fontSize: 12 }}>Trigger: {dr.trigger}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategy */}
      <div
        style={{
          border: "1px solid rgba(212,175,55,0.25)",
          borderRadius: 12,
          padding: 18,
          background: "rgba(212,175,55,0.04)",
        }}
      >
        <SectionLabel>Recommended Entry Strategy</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
          <div>
            <span style={{ color: "#d4af37", fontWeight: 600 }}>Wedge: </span>
            <span style={{ color: "#ccc" }}>{result.strategy.wedge}</span>
          </div>
          <div>
            <span style={{ color: "#d4af37", fontWeight: 600 }}>Sequence: </span>
            <span style={{ color: "#ccc" }}>{result.strategy.sequence}</span>
          </div>
          <div>
            <span style={{ color: "#d4af37", fontWeight: 600 }}>Differentiation axis: </span>
            <span style={{ color: "#ccc" }}>{result.strategy.differentiationAxis}</span>
          </div>
        </div>
      </div>

      {/* Survival conditions */}
      <div>
        <SectionLabel>Survival Conditions</SectionLabel>
        <ol style={{ margin: 0, paddingLeft: 20, color: "#ccc", fontSize: 13, lineHeight: 1.8 }}>
          {result.survivalConditions.map(function (c, i) {
            return <li key={i}>{c}</li>;
          })}
        </ol>
      </div>

      {/* Failure pre-mortem */}
      <div
        style={{
          border: "1px solid rgba(244,67,54,0.25)",
          borderRadius: 12,
          padding: 18,
          background: "rgba(244,67,54,0.05)",
        }}
      >
        <div
          style={{
            color: "#F44336",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}
        >
          Most Likely To Fail Because
        </div>
        <div style={{ color: "#ddd", fontSize: 14, lineHeight: 1.6 }}>{result.failureReason}</div>
      </div>

      <button
        onClick={onReset}
        style={{
          padding: "12px 24px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "transparent",
          color: "#ccc",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Run Another Scenario
      </button>
    </div>
  );
}
