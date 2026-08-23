"use client";

import { useState } from "react";
import type {
  ScenarioConfig,
  Product,
  Personality,
  DealBreaker,
} from "../../../lib/negotiator/types";

const PRODUCTS: { value: Product; label: string }[] = [
  { value: "ai-analytics", label: "AI Analytics Platform" },
  { value: "cybersecurity", label: "Cybersecurity Monitoring Tool" },
  { value: "dev-productivity", label: "Developer Productivity Suite" },
  { value: "custom", label: "Custom Product" },
];

const PERSONALITIES: Personality[] = [
  "Aggressive",
  "Collaborative",
  "Risk-Averse",
  "Time-Pressured",
];

const DEAL_BREAKERS: { value: DealBreaker; label: string }[] = [
  { value: "no-multiyear", label: "No multi-year lock-in" },
  { value: "api-access", label: "Must include API access" },
  { value: "soc2", label: "Needs SOC2 compliance" },
  { value: "fast-implementation", label: "Under 30-day implementation" },
  { value: "usage-based", label: "Usage-based pricing only" },
];

interface SetupPanelProps {
  onStart: (config: ScenarioConfig) => void;
}

export default function SetupPanel({ onStart }: SetupPanelProps) {
  const [product, setProduct] = useState<Product>("ai-analytics");
  const [customProduct, setCustomProduct] = useState("");
  const [budget, setBudget] = useState(200000);
  const [dealBreakers, setDealBreakers] = useState<DealBreaker[]>([]);
  const [sellerPersonality, setSellerPersonality] =
    useState<Personality>("Collaborative");
  const [buyerPersonality, setBuyerPersonality] =
    useState<Personality>("Risk-Averse");

  function toggleDealBreaker(db: DealBreaker) {
    setDealBreakers(function(prev) {
      if (prev.includes(db)) return prev.filter(function(d) { return d !== db; });
      if (prev.length >= 2) return prev;
      return [...prev, db];
    });
  }

  function handleStart() {
    if (product === "custom" && !customProduct.trim()) return;
    onStart({
      product,
      customProduct: customProduct.trim(),
      budgetCeiling: budget,
      dealBreakers,
      sellerPersonality,
      buyerPersonality,
    });
  }

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Product */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 8,
            color: "var(--color-accent)",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Product being negotiated
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRODUCTS.map(function(p) {
            return (
              <button
                key={p.value}
                onClick={function() { setProduct(p.value); }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border:
                    product === p.value
                      ? "1px solid var(--color-accent)"
                      : "1px solid rgba(255,255,255,0.1)",
                  background:
                    product === p.value
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.03)",
                  color: product === p.value ? "var(--color-accent)" : "#ccc",
                  cursor: "pointer",
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        {product === "custom" && (
          <input
            type="text"
            value={customProduct}
            onChange={function(e) { setCustomProduct(e.target.value); }}
            placeholder="Name your product..."
            style={{
              marginTop: 10,
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              fontSize: 14,
              outline: "none",
            }}
          />
        )}
      </div>

      {/* Budget */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 8,
            color: "var(--color-accent)",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {"Buyer\u2019s annual budget ceiling: "}
          <span style={{ color: "#fff", fontWeight: 400 }}>
            {"$" + budget.toLocaleString()}
          </span>
        </label>
        <input
          type="range"
          min={50000}
          max={500000}
          step={10000}
          value={budget}
          onChange={function(e) { setBudget(Number(e.target.value)); }}
          style={{ width: "100%", accentColor: "var(--color-accent)" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#888",
            marginTop: 4,
          }}
        >
          <span>$50K</span>
          <span>$500K</span>
        </div>
      </div>

      {/* Deal-breakers */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 8,
            color: "var(--color-accent)",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {"Buyer\u2019s deal-breakers "}
          <span style={{ color: "#888", fontWeight: 400 }}>
            (pick up to 2)
          </span>
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DEAL_BREAKERS.map(function(db) {
            var selected = dealBreakers.includes(db.value);
            var disabled = !selected && dealBreakers.length >= 2;
            return (
              <button
                key={db.value}
                onClick={function() { toggleDealBreaker(db.value); }}
                disabled={disabled}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: selected
                    ? "1px solid var(--color-accent)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: selected
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.03)",
                  color: selected ? "var(--color-accent)" : disabled ? "#555" : "#ccc",
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontSize: 13,
                  transition: "all 0.2s",
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                {db.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Personalities */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {/* Seller */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              color: "var(--color-accent)",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Seller personality
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {PERSONALITIES.map(function(p) {
              return (
                <button
                  key={p}
                  onClick={function() { setSellerPersonality(p); }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border:
                      sellerPersonality === p
                        ? "1px solid var(--color-accent)"
                        : "1px solid rgba(255,255,255,0.1)",
                    background:
                      sellerPersonality === p
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.03)",
                    color: sellerPersonality === p ? "var(--color-accent)" : "#ccc",
                    cursor: "pointer",
                    fontSize: 13,
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buyer */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              color: "var(--color-accent)",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Buyer personality
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {PERSONALITIES.map(function(p) {
              return (
                <button
                  key={p}
                  onClick={function() { setBuyerPersonality(p); }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border:
                      buyerPersonality === p
                        ? "1px solid var(--color-accent)"
                        : "1px solid rgba(255,255,255,0.1)",
                    background:
                      buyerPersonality === p
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.03)",
                    color: buyerPersonality === p ? "var(--color-accent)" : "#ccc",
                    cursor: "pointer",
                    fontSize: 13,
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* How this works */}
      <details
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          padding: "12px 16px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            color: "#888",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          How this works
        </summary>
        <p
          style={{
            marginTop: 10,
            color: "#aaa",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          Two genuinely separate AI agents negotiate this deal, each with its
          own system prompt, private constraints, and independent reasoning.
          Neither agent sees the other{"'"}s internal strategy. Their
          responses are validated against a strict schema to ensure every move
          produces structured, machine-readable terms that update the deal
          table deterministically. The orchestration runs server-side; no API
          keys touch the browser. History is compressed between rounds to stay
          within token limits while preserving negotiation continuity.
        </p>
      </details>

      {/* Start */}
      <button
        onClick={handleStart}
        disabled={product === "custom" && !customProduct.trim()}
        style={{
          padding: "14px 28px",
          borderRadius: 10,
          background:
            product === "custom" && !customProduct.trim()
              ? "#333"
              : "rgba(255, 255, 255, 0.1)",
          border:
            product === "custom" && !customProduct.trim()
              ? "none"
              : "1px solid rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          color:
            product === "custom" && !customProduct.trim() ? "#666" : "#fff",
          fontSize: 16,
          fontWeight: 700,
          cursor:
            product === "custom" && !customProduct.trim()
              ? "not-allowed"
              : "pointer",
          transition: "all 0.3s",
          width: "100%",
        }}
      >
        Start Negotiation
      </button>
    </div>
  );
}
