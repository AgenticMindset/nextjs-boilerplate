"use client";

import AgentMove from "./AgentMove";
import DealTable from "./DealTable";
import InterventionBar from "./InterventionBar";
import type {
  NegotiationState,
  NegotiationRound,
  DealTerms,
  TermStatuses,
  Intervention,
  Personality,
} from "../../../lib/negotiator/types";

interface NegotiationViewProps {
  state: NegotiationState;
  onAdvanceRound: () => void;
  onIntervene: (intervention: Intervention) => void;
  pendingIntervention: Intervention | null;
  currentSellerPersonality: Personality;
  currentBuyerPersonality: Personality;
}

export default function NegotiationView({
  state,
  onAdvanceRound,
  onIntervene,
  pendingIntervention,
  currentSellerPersonality,
  currentBuyerPersonality,
}: NegotiationViewProps) {
  var latestRound: NegotiationRound | null =
    state.transcript.length > 0
      ? state.transcript[state.transcript.length - 1]
      : null;

  var displayTerms: DealTerms = latestRound
    ? latestRound.termsAfterRound
    : state.currentTerms;

  var displayStatuses: TermStatuses = latestRound
    ? latestRound.termStatusesAfterRound
    : state.termStatuses;

  var completedRounds = state.transcript.length;
  var isFinished = state.phase === "complete";

  function getInterventionLabel(intervention: Intervention): string {
    switch (intervention.type) {
      case "whisper":
        return "Whisper to " + intervention.targetAgent + ': "' + intervention.message + '"';
      case "market-event":
        return "Market event: " + intervention.event;
      case "personality-switch":
        return intervention.targetAgent.charAt(0).toUpperCase() + intervention.targetAgent.slice(1) + " personality switched to " + intervention.newPersonality;
      case "force-deadline":
        return "Deadline forced: " + intervention.roundsRemaining + " rounds remaining";
    }
  }

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
          <span style={{ color: "var(--color-accent)", fontSize: 14, fontWeight: 600 }}>
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
                  background: "var(--color-accent)",
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
              background: "linear-gradient(90deg, #ffffff, rgba(255,255,255,0.65))",
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

      {/* Intervention bar - shown between rounds when not loading */}
      {!isFinished && !state.isLoading && completedRounds > 0 && (
        <InterventionBar
          onIntervene={onIntervene}
          currentSellerPersonality={currentSellerPersonality}
          currentBuyerPersonality={currentBuyerPersonality}
          roundsCompleted={completedRounds}
          maxRounds={state.maxRounds}
          disabled={state.isLoading}
        />
      )}

      {/* Pending intervention indicator */}
      {pendingIntervention && !state.isLoading && (
        <div
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            fontSize: 13,
            color: "var(--color-accent)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{getInterventionLabel(pendingIntervention)}</span>
          <span style={{ fontSize: 11, color: "#888" }}>Will apply next round</span>
        </div>
      )}

      {/* Action */}
      {!isFinished && (
        <button
          onClick={onAdvanceRound}
          disabled={state.isLoading}
          style={{
            padding: "12px 24px",
            borderRadius: 10,
            background: state.isLoading
              ? "#333"
              : "rgba(255, 255, 255, 0.1)",
            color: state.isLoading ? "#666" : "#fff",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: state.isLoading ? "none" : "1px solid rgba(255, 255, 255, 0.25)",
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
