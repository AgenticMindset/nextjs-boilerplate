"use client";

import type { DealTerms, TermStatuses, TermStatus } from "../../../lib/negotiator/types";

const STATUS_COLORS: Record<TermStatus, string> = {
  agreed: "#4CAF50",
  discussing: "#FF9800",
  deadlocked: "#F44336",
  pending: "#616161",
};

const STATUS_LABELS: Record<TermStatus, string> = {
  agreed: "Agreed",
  discussing: "In Discussion",
  deadlocked: "Deadlocked",
  pending: "Pending",
};

interface DealTableProps {
  terms: DealTerms;
  statuses: TermStatuses;
}

function formatValue(key: keyof DealTerms, value: unknown): string {
  switch (key) {
    case "price":
      return "$" + (value as number).toLocaleString() + "/year";
    case "contractLength":
      return value + " months";
    case "apiAccess":
    case "soc2":
      return value ? "Included" : "Not included";
    case "implementationDays":
      return value + " days";
    case "pricingModel": {
      const s = value as string;
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    case "sla":
      return value + " uptime";
    default:
      return String(value);
  }
}

const TERM_LABELS: Record<keyof DealTerms, string> = {
  price: "Annual Price",
  contractLength: "Contract Length",
  apiAccess: "API Access",
  soc2: "SOC2 Compliance",
  implementationDays: "Implementation",
  pricingModel: "Pricing Model",
  sla: "SLA",
};

export default function DealTable({ terms, statuses }: DealTableProps) {
  const termKeys = Object.keys(TERM_LABELS) as (keyof DealTerms)[];

  return (
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
          padding: "12px 18px",
          background: "rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--color-accent)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Deal Terms
        </span>
      </div>
      <div>
        {termKeys.map(function(key) {
          var status = statuses[key];
          var statusColor = STATUS_COLORS[status];
          return (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span style={{ color: "#aaa", fontSize: 13 }}>
                {TERM_LABELS[key]}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    color: "#e0e0e0",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {formatValue(key, terms[key])}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: statusColor + "22",
                    color: statusColor,
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {STATUS_LABELS[status]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
