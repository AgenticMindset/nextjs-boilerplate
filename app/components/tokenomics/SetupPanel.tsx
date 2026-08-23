"use client";

import { useState } from "react";
import { TOKEN_PROFILES } from "../../../lib/tokenomics/presets";
import type {
  PresetToken,
  Severity,
  StressScenario,
  StressTestInput,
} from "../../../lib/tokenomics/types";

const PRESETS: PresetToken[] = [
  "ETH",
  "SOL",
  "USDT",
  "Algorithmic Stablecoin",
  "Governance Token",
  "Custom",
];

const SCENARIOS: StressScenario[] = [
  "Bank Run",
  "Regulatory Ban",
  "Whale Dump",
  "Yield Collapse",
  "Competing Fork",
];

interface SetupPanelProps {
  onRun: (input: StressTestInput) => void;
}

function labelForPreset(preset: PresetToken): string {
  if (preset === "Custom") return "Custom (paste tokenomics)";
  return TOKEN_PROFILES[preset].label;
}

export default function SetupPanel({ onRun }: SetupPanelProps) {
  const [preset, setPreset] = useState<PresetToken>("ETH");
  const [customTokenomics, setCustomTokenomics] = useState("");
  const [scenario, setScenario] = useState<StressScenario>("Bank Run");
  const [severity, setSeverity] = useState<Severity>("Moderate");

  const missingCustom = preset === "Custom" && !customTokenomics.trim();

  function handleRun() {
    if (missingCustom) return;
    onRun({
      token: { preset, customTokenomics: customTokenomics.trim() },
      scenario,
      severity,
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
      {/* Token selection */}
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
          Token
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRESETS.map(function (p) {
            return (
              <button
                key={p}
                onClick={function () {
                  setPreset(p);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border:
                    preset === p
                      ? "1px solid var(--color-accent)"
                      : "1px solid rgba(255,255,255,0.1)",
                  background:
                    preset === p
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.03)",
                  color: preset === p ? "var(--color-accent)" : "#ccc",
                  cursor: "pointer",
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              >
                {labelForPreset(p)}
              </button>
            );
          })}
        </div>
        {preset === "Custom" && (
          <textarea
            value={customTokenomics}
            onChange={function (e) {
              setCustomTokenomics(e.target.value);
            }}
            placeholder="Paste a tokenomics summary: emission schedule, staking mechanics, governance structure, liquidity characteristics, reserve/backing mechanism..."
            rows={6}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              fontSize: 14,
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        )}
      </div>

      {/* Scenario */}
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
          Stress Scenario
        </label>
        <select
          value={scenario}
          onChange={function (e) {
            setScenario(e.target.value as StressScenario);
          }}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#141414",
            color: "#fff",
            fontSize: 14,
            outline: "none",
          }}
        >
          {SCENARIOS.map(function (s) {
            return (
              <option key={s} value={s}>
                {s}
              </option>
            );
          })}
        </select>
      </div>

      {/* Severity */}
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
          Severity
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {(["Moderate", "Severe"] as Severity[]).map(function (s) {
            return (
              <button
                key={s}
                onClick={function () {
                  setSeverity(s);
                }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border:
                    severity === s
                      ? "1px solid var(--color-accent)"
                      : "1px solid rgba(255,255,255,0.1)",
                  background:
                    severity === s
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.03)",
                  color: severity === s ? "var(--color-accent)" : "#ccc",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                {s}
              </button>
            );
          })}
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
          Banking Framework Applied
        </summary>
        <p
          style={{
            marginTop: 10,
            color: "#aaa",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          This agent applies a qualitative stress-testing framework adapted
          from EBA/ECB banking methodology. Five risk dimensions from banking
          (capital adequacy, liquidity coverage, concentration risk, HQLA
          buffers, market risk) are mapped to token economics (emission
          resilience, liquidity depth, governance integrity, reserve
          adequacy, price stability). The model reasons from curated
          tokenomics profiles and structural comparisons to five historical
          crypto failures (LUNA/UST, FTX/FTT, Iron Finance, Olympus DAO,
          Bitcoin Cash). This is a structured analytical framework for
          illustration, not a quantitative financial model or investment
          advice.
        </p>
      </details>

      {/* Run */}
      <button
        onClick={handleRun}
        disabled={missingCustom}
        style={{
          padding: "14px 28px",
          borderRadius: 10,
          border: missingCustom ? "none" : "1px solid rgba(255, 255, 255, 0.25)",
          background: missingCustom
            ? "#333"
            : "rgba(255, 255, 255, 0.1)",
          backdropFilter: missingCustom ? undefined : "blur(20px) saturate(180%)",
          WebkitBackdropFilter: missingCustom ? undefined : "blur(20px) saturate(180%)",
          color: missingCustom ? "#666" : "#fff",
          fontSize: 16,
          fontWeight: 700,
          cursor: missingCustom ? "not-allowed" : "pointer",
          transition: "all 0.3s",
          width: "100%",
        }}
      >
        Run Stress Test
      </button>
    </div>
  );
}
