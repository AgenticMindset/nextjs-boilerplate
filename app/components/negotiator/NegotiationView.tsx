"use client";

import AgentMove from "./AgentMove";
import DealTable from "./DealTable";
import type {
  NegotiationState,
  NegotiationRound,
  DealTerms,
  TermStatuses,
} from "../../../lib/negotiator/types";

interface NegotiationViewProps {
  state: NegotiationState;
  onAdvanceRound: () => void;
}

export default function NegotiationView({
  state,
  onAdvanceRound,
}: NegotiationViewProps) {
  const latestRound: NegotiationRound | null =
    state.transcript.length > 0
      ? state.transcript[state.transcript.length - 1]
      : null;

  const displayTerms: DealTerms = latestRound
    ? latestRound.termsAfterRound
    : state.currentTerms;

  const displayStatuses: TermStatuses = latestRound
    ? latestRound.termStatusesAfterRound
    : state.termStatuses;

  const completedRounds = state.transcript.length;
  const isFinished = state.phase === "complete";

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Progress bar */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ color: "#d4af37", fontSize: 14, fontWeight: 600 }}>
            Round {completedRounds} of {state.maxRounds}
          </span>
          {state.isLoading && (
            <span
              style={{
                color: "#888",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#d4af37",
                  animation: "pulse 1.2s ease-in-out infinite",
                }}
              />
              Agents negotiating...
            </span>
          )}
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: (completedRounds / state.maxRounds) * 100 + "%",
              background: "linear-gradient(90deg, #d4af37, #b8962e)",
              borderRadius: 2,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Rounds */}
      {state.transcript.map(function(round) {
        return (
          <div
            key={round.roundNumber}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              paddingBottom: 20,
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <AgentMove
              move={round.sellerMove}
              agentName="Seller"
              agentColor="#4FC3F7"
              roundNumber={round.roundNumber}
            />
            <AgentMove
              move={round.buyerMove}
              agentName="Buyer"
              agentColor="#FF8A65"
              roundNumber={round.roundNumber}
            />
          </div>
        );
      })}

      {/* Deal table */}
      <DealTable terms={displayTerms} statuses={displayStatuses} />

      {/* Action */}
      {!isFinished && (
        <button
          onClick={onAdvanceRound}
          disabled={state.isLoading}
          style={{
            padding: "12px 24px",
            borderRadius: 10,
            border: "none",
            background: state.isLoading
              ? "#333"
              : "linear-gradient(135deg, #d4af37, #b8962e)",
            color: state.isLoading ? "#666" : "#000",
            fontSize: 15,
            fontWeight: 700,
            cursor: state.isLoading ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            width: "100%",
          }}
        >
          {state.isLoading
            ? "Negotiating..."
            : completedRounds === 0
              ? "Begin Round 1"
              : "Advance to Round " + (completedRounds + 1)}
        </button>
      )}

      {/* Pulse animation */}
      <style>{"\n        @keyframes pulse {\n          0%, 100% { opacity: 1; }\n          50% { opacity: 0.3; }\n        }\n      "}</style>
    </div>
  );
}
