"use client";

import { useState } from "react";
import type { HistoricalAnalogue as HistoricalAnalogueType } from "../../../lib/tokenomics/types";

interface HistoricalAnalogueProps {
  analogue: HistoricalAnalogueType;
}

export default function HistoricalAnalogue({ analogue }: HistoricalAnalogueProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      style={{
        border: "1px solid rgba(124,77,255,0.3)",
        borderRadius: 12,
        padding: 18,
        background: "rgba(124,77,255,0.06)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#7C4DFF",
          fontWeight: 600,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Historical Analogue: {analogue.name}
      </div>
      <p style={{ color: "#e0e0e0", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
        {analogue.comparison}
      </p>

      <button
        onClick={function () {
          setShowDetails(!showDetails);
        }}
        style={{
          marginTop: 12,
          background: "none",
          border: "none",
          color: "#9575FF",
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
            transform: showDetails ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          {"▸"}
        </span>
        {showDetails ? "Hide" : "Show"} structural parallels
      </button>

      {showDetails && (
        <div
          style={{
            marginTop: 10,
            padding: 14,
            borderRadius: 8,
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <p
            style={{
              color: "#ccc",
              fontSize: 13,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {analogue.details}
          </p>
        </div>
      )}
    </div>
  );
}
