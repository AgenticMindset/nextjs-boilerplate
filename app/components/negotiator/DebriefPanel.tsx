"use client";

import type { DebriefData, NegotiationOutcome } from "../../../lib/negotiator/types";

type OutcomeInfo = { label: string; color: string; icon: string };

const OUTCOME_DISPLAY: Record<NegotiationOutcome, OutcomeInfo> = {
  closed: { label: "Deal Closed", color: "#4CAF50", icon: "\u2713" },
  walkaway: { label: "Walkaway", color: "#F44336", icon: "\u2717" },
  deadlock: { label: "Deadlock", color: "#FF9800", icon: "\u2014" },
};

interface DebriefPanelProps {
  debrief: DebriefData;
  onReplay: () => void;
}

interface TermRow {
  label: string;
  s: string;
  b: string;
  f: string;
}

export default function DebriefPanel({ debrief, onReplay }: DebriefPanelProps) {
  const outcomeInfo = OUTCOME_DISPLAY[debrief.outcome];

  const termRows: TermRow[] = [
    {
      label: "Price",
      s: "$" + debrief.startingSellerTerms.price.toLocaleString(),
      b: "$" + debrief.startingBuyerTarget.price.toLocaleString(),
      f: "$" + debrief.finalTerms.price.toLocaleString(),
    },
    {
      label: "Contract",
      s: debrief.startingSellerTerms.contractLength + "mo",
      b: debrief.startingBuyerTarget.contractLength + "mo",
      f: debrief.finalTerms.contractLength + "mo",
    },
    {
      label: "API Access",
      s: debrief.startingSellerTerms.apiAccess ? "Yes" : "No",
      b: debrief.startingBuyerTarget.apiAccess ? "Yes" : "No",
      f: debrief.finalTerms.apiAccess ? "Yes" : "No",
    },
    {
      label: "SOC2",
      s: debrief.startingSellerTerms.soc2 ? "Yes" : "No",
      b: debrief.startingBuyerTarget.soc2 ? "Yes" : "No",
      f: debrief.finalTerms.soc2 ? "Yes" : "No",
    },
    {
      label: "Implementation",
      s: debrief.startingSellerTerms.implementationDays + "d",
      b: debrief.startingBuyerTarget.implementationDays + "d",
      f: debrief.finalTerms.implementationDays + "d",
    },
    {
      label: "Pricing",
      s: debrief.startingSellerTerms.pricingModel,
      b: debrief.startingBuyerTarget.pricingModel,
      f: debrief.finalTerms.pricingModel,
    },
    {
      label: "SLA",
      s: debrief.startingSellerTerms.sla,
      b: debrief.startingBuyerTarget.sla,
      f: debrief.finalTerms.sla,
    },
  ];

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Outcome badge */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 28px",
            borderRadius: 14,
            background: outcomeInfo.color + "15",
            border: "1px solid " + outcomeInfo.color + "44",
          }}
        >
          <span style={{ fontSize: 28 }}>{outcomeInfo.icon}</span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: outcomeInfo.color,
            }}
          >
            {outcomeInfo.label}
          </span>
        </div>
      </div>

      {/* Score cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            padding: 18,
            borderRadius: 12,
            background: "rgba(79,195,247,0.06)",
            border: "1px solid rgba(79,195,247,0.15)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 12, color: "#4FC3F7", fontWeight: 600, marginBottom: 6 }}>SELLER SCORE</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>{debrief.sellerScorePct}%</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>of target achieved</div>
        </div>
        <div
          style={{
            padding: 18,
            borderRadius: 12,
            background: "rgba(255,138,101,0.06)",
            border: "1px solid rgba(255,138,101,0.15)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 12, color: "#FF8A65", fontWeight: 600, marginBottom: 6 }}>BUYER SCORE</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>{debrief.buyerScorePct}%</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>of target achieved</div>
        </div>
      </div>

      {/* Term comparison */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            padding: "10px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>TERM</span>
          <span style={{ fontSize: 11, color: "#4FC3F7", fontWeight: 600 }}>SELLER START</span>
          <span style={{ fontSize: 11, color: "#FF8A65", fontWeight: 600 }}>BUYER TARGET</span>
          <span style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 600 }}>FINAL</span>
        </div>
        {termRows.map(function(row) {
          return (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                padding: "8px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <span style={{ fontSize: 13, color: "#aaa" }}>{row.label}</span>
              <span style={{ fontSize: 13, color: "#ccc" }}>{row.s}</span>
              <span style={{ fontSize: 13, color: "#ccc" }}>{row.b}</span>
              <span style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 600 }}>{row.f}</span>
            </div>
          );
        })}
      </div>

      {/* Turning point */}
      <div
        style={{
          padding: 18,
          borderRadius: 12,
          background: "rgba(124,77,255,0.06)",
          border: "1px solid rgba(124,77,255,0.15)",
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
          Turning Point
        </div>
        <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          {debrief.turningPointExplanation}
        </p>
      </div>

      {/* Replay */}
      <button
        onClick={onReplay}
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
        Replay with Different Settings
      </button>
    </div>
  );
}
