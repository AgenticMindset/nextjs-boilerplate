"use client";

import { useState } from "react";
import type { Intervention, Personality } from "../../../lib/negotiator/types";

const MARKET_EVENTS = [
  "Competitor just raised their prices by 20%",
  "Buyer's Q3 budget was cut by 15%",
  "A new open-source alternative just launched",
  "Industry analyst report ranks this vendor #1",
  "Buyer's CEO just mandated cost cuts across all departments",
];

const PERSONALITIES: Personality[] = [
  "Aggressive",
  "Collaborative",
  "Risk-Averse",
  "Time-Pressured",
];

interface InterventionBarProps {
  onIntervene: (intervention: Intervention) => void;
  currentSellerPersonality: Personality;
  currentBuyerPersonality: Personality;
  roundsCompleted: number;
  maxRounds: number;
  disabled: boolean;
}

export default function InterventionBar({
  onIntervene,
  currentSellerPersonality,
  currentBuyerPersonality,
  roundsCompleted,
  maxRounds,
  disabled,
}: InterventionBarProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [whisperTarget, setWhisperTarget] = useState<"seller" | "buyer">("seller");
  const [whisperText, setWhisperText] = useState("");

  function togglePanel(panel: string) {
    setActivePanel(activePanel === panel ? null : panel);
  }

  function handleWhisper() {
    if (!whisperText.trim()) return;
    onIntervene({
      type: "whisper",
      targetAgent: whisperTarget,
      message: whisperText.trim(),
    });
    setWhisperText("");
    setActivePanel(null);
  }

  function handleMarketEvent(event: string) {
    onIntervene({ type: "market-event", event });
    setActivePanel(null);
  }

  function handlePersonalitySwitch(target: "seller" | "buyer", personality: Personality) {
    onIntervene({
      type: "personality-switch",
      targetAgent: target,
      newPersonality: personality,
    });
    setActivePanel(null);
  }

  function handleForceDeadline() {
    var remaining = maxRounds - roundsCompleted;
    var deadlineRounds = Math.min(2, remaining);
    if (deadlineRounds <= 0) return;
    onIntervene({
      type: "force-deadline",
      roundsRemaining: deadlineRounds,
    });
    setActivePanel(null);
  }

  var buttonStyle = function(isActive: boolean) {
    return {
      padding: "8px 14px",
      borderRadius: 8,
      border: isActive ? "1px solid #d4af37" : "1px solid rgba(255,255,255,0.1)",
      background: isActive ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
      color: isActive ? "#d4af37" : "#ccc",
      cursor: disabled ? "not-allowed" as const : "pointer" as const,
      fontSize: 13,
      fontWeight: 500 as const,
      transition: "all 0.2s",
      opacity: disabled ? 0.5 : 1,
    };
  };

  return (
    <div
      style={{
        border: "1px solid rgba(212,175,55,0.2)",
        borderRadius: 12,
        padding: 16,
        background: "rgba(212,175,55,0.04)",
      }}
    >
      <div style={{ fontSize: 12, color: "#d4af37", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Intervene
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: activePanel ? 14 : 0 }}>
        <button onClick={function() { if (!disabled) togglePanel("whisper"); }} style={buttonStyle(activePanel === "whisper")} disabled={disabled}>
          Whisper to Agent
        </button>
        <button onClick={function() { if (!disabled) togglePanel("market"); }} style={buttonStyle(activePanel === "market")} disabled={disabled}>
          Market Event
        </button>
        <button onClick={function() { if (!disabled) togglePanel("personality"); }} style={buttonStyle(activePanel === "personality")} disabled={disabled}>
          Switch Personality
        </button>
        <button onClick={function() { if (!disabled) handleForceDeadline(); }} style={buttonStyle(false)} disabled={disabled}>
          Force Deadline (2 rounds)
        </button>
      </div>

      {/* Whisper panel */}
      {activePanel === "whisper" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={function() { setWhisperTarget("seller"); }}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "none",
                background: whisperTarget === "seller" ? "rgba(79,195,247,0.2)" : "rgba(255,255,255,0.05)",
                color: whisperTarget === "seller" ? "#4FC3F7" : "#888",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Seller
            </button>
            <button
              onClick={function() { setWhisperTarget("buyer"); }}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "none",
                background: whisperTarget === "buyer" ? "rgba(255,138,101,0.2)" : "rgba(255,255,255,0.05)",
                color: whisperTarget === "buyer" ? "#FF8A65" : "#888",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Buyer
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={whisperText}
              onChange={function(e) { setWhisperText(e.target.value); }}
              onKeyDown={function(e) { if (e.key === "Enter") handleWhisper(); }}
              placeholder={"Whisper to " + whisperTarget + "..."}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(0,0,0,0.3)",
                color: "#fff",
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              onClick={handleWhisper}
              disabled={!whisperText.trim()}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: whisperText.trim() ? "rgba(212,175,55,0.3)" : "#333",
                color: whisperText.trim() ? "#d4af37" : "#666",
                cursor: whisperText.trim() ? "pointer" : "not-allowed",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Send
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#666" }}>
            The other agent will not see this instruction but may detect the strategy shift.
          </div>
        </div>
      )}

      {/* Market event panel */}
      {activePanel === "market" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {MARKET_EVENTS.map(function(event) {
            return (
              <button
                key={event}
                onClick={function() { handleMarketEvent(event); }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#ccc",
                  cursor: "pointer",
                  fontSize: 13,
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
              >
                {event}
              </button>
            );
          })}
        </div>
      )}

      {/* Personality switch panel */}
      {activePanel === "personality" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#4FC3F7", fontWeight: 600, marginBottom: 6 }}>
              SELLER (current: {currentSellerPersonality})
            </div>
            {PERSONALITIES.filter(function(p) { return p !== currentSellerPersonality; }).map(function(p) {
              return (
                <button
                  key={"seller-" + p}
                  onClick={function() { handlePersonalitySwitch("seller", p); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "6px 10px",
                    marginBottom: 4,
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#ccc",
                    cursor: "pointer",
                    fontSize: 12,
                    textAlign: "left",
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#FF8A65", fontWeight: 600, marginBottom: 6 }}>
              BUYER (current: {currentBuyerPersonality})
            </div>
            {PERSONALITIES.filter(function(p) { return p !== currentBuyerPersonality; }).map(function(p) {
              return (
                <button
                  key={"buyer-" + p}
                  onClick={function() { handlePersonalitySwitch("buyer", p); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "6px 10px",
                    marginBottom: 4,
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#ccc",
                    cursor: "pointer",
                    fontSize: 12,
                    textAlign: "left",
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
