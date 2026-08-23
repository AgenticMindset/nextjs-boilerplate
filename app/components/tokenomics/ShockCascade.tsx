"use client";

import type { CascadeSeverity, ShockCascadeStep } from "../../../lib/tokenomics/types";

const SEVERITY_INFO: Record<CascadeSeverity, { label: string; color: string }> = {
  low: { label: "Low", color: "#4CAF50" },
  medium: { label: "Medium", color: "#FF9800" },
  high: { label: "High", color: "#FF5722" },
  critical: { label: "Critical", color: "#F44336" },
};

interface ShockCascadeProps {
  steps: ShockCascadeStep[];
}

export default function ShockCascade({ steps }: ShockCascadeProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {steps.map(function (step) {
        const info = SEVERITY_INFO[step.severity];
        return (
          <div
            key={step.step}
            style={{
              border: "1px solid " + info.color + "33",
              borderRadius: 12,
              padding: 18,
              background: "linear-gradient(135deg, " + info.color + "08, transparent)",
            }}
          >
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
                    color: "var(--color-accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Step {step.step}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                  {step.title}
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: info.color + "22",
                  color: info.color,
                  fontWeight: 600,
                }}
              >
                {info.label}
              </span>
            </div>
            <p style={{ color: "#e0e0e0", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
