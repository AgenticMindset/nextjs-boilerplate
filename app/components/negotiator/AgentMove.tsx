"use client";

import { useState } from "react";
import type { AgentMove as AgentMoveType, AgentStance } from "../../../lib/negotiator/types";

type StanceInfo = { label: string; color: string };

const STANCE_LABELS: Record<AgentStance, StanceInfo> = {
  advancing: { label: "Pushing", color: "#4CAF50" },
  conceding: { label: "Conceding", color: "#FF9800" },
  holding: { label: "Holding", color: "#9E9E9E" },
  creative: { label: "Creative", color: "#7C4DFF" },
  walkaway: { label: "Walking Away", color: "#F44336" },
};

interface AgentMoveProps {
  move: AgentMoveType;
  agentName: string;
  agentColor: string;
  roundNumber: number;
}

export default function AgentMove({
  move,
  agentName,
  agentColor,
  roundNumber,
}: AgentMoveProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const stanceInfo = STANCE_LABELS[move.stance];

  return (
    <div
      style={{
        border: "1px solid " + agentColor + "33",
        borderRadius: 12,
        padding: 18,
        background: "linear-gradient(135deg, " + agentColor + "08, transparent)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: agentColor,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {agentName}
          </span>
          <span style={{ fontSize: 11, color: "#666" }}>
            Round {roundNumber}
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            padding: "3px 10px",
            borderRadius: 20,
            background: stanceInfo.color + "22",
            color: stanceInfo.color,
            fontWeight: 600,
          }}
        >
          {stanceInfo.label}
        </span>
      </div>

      {/* Public move */}
      <p
        style={{
          color: "#e0e0e0",
          fontSize: 14,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {move.publicMove}
      </p>

      {/* Deal-breaker warning */}
      {move.dealBreakerViolation && (
        <div
          style={{
            marginTop: 10,
            padding: "6px 12px",
            borderRadius: 6,
            background: "rgba(244,67,54,0.12)",
            color: "#F44336",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {"\u26A0"} Deal-breaker violation detected
        </div>
      )}

      {/* Reasoning toggle */}
      <button
        onClick={function() { setShowReasoning(!showReasoning); }}
        style={{
          marginTop: 12,
          background: "none",
          border: "none",
          color: "#888",
          cursor: "pointer",
          fontSize: 12,
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: showReasoning ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          {"\u25B8"}
        </span>
        {showReasoning ? "Hide" : "Show"} reasoning
      </button>

      {showReasoning && (
        <div
          style={{
            marginTop: 10,
            padding: 14,
            borderRadius: 8,
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p
            style={{
              color: "#999",
              fontSize: 13,
              lineHeight: 1.6,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {move.reasoning}
          </p>
        </div>
      )}
    </div>
  );
}
