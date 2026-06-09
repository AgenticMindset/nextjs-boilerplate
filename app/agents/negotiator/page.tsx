"use client";

import { useState, useCallback } from "react";
import SetupPanel from "../../components/negotiator/SetupPanel";
import NegotiationView from "../../components/negotiator/NegotiationView";
import DebriefPanel from "../../components/negotiator/DebriefPanel";
import { getSellerStartingTerms } from "../../../lib/negotiator/prompts";
import type {
  ScenarioConfig,
  NegotiationState,
  DebriefData,
  TermStatuses,
} from "../../../lib/negotiator/types";

const MAX_ROUNDS = 6;

const INITIAL_STATUSES: TermStatuses = {
  price: "pending",
  contractLength: "pending",
  apiAccess: "pending",
  soc2: "pending",
  implementationDays: "pending",
  pricingModel: "pending",
  sla: "pending",
};

export default function NegotiatorPage() {
  const [config, setConfig] = useState<ScenarioConfig | null>(null);
  const [negotiation, setNegotiation] = useState<NegotiationState | null>(null);
  const [debrief, setDebrief] = useState<DebriefData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback((newConfig: ScenarioConfig) => {
    const startingTerms = getSellerStartingTerms(newConfig);
    setConfig(newConfig);
    setDebrief(null);
    setError(null);
    setNegotiation({
      phase: "negotiating",
      currentRound: 0,
      maxRounds: MAX_ROUNDS,
      currentTerms: startingTerms,
      termStatuses: INITIAL_STATUSES,
      transcript: [],
      outcome: null,
      isLoading: false,
    });
  }, []);

  const handleAdvanceRound = useCallback(async () => {
    if (!negotiation || !config || negotiation.isLoading) return;

    const nextRound = negotiation.transcript.length + 1;

    setNegotiation((prev) =>
      prev ? { ...prev, isLoading: true } : prev
    );
    setError(null);

    try {
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          currentTerms: negotiation.currentTerms,
          transcript: negotiation.transcript,
          roundNumber: nextRound,
          maxRounds: MAX_ROUNDS,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      setNegotiation((prev) => {
        if (!prev) return prev;

        const newTranscript = [...prev.transcript, data.round];
        const isFinal = data.outcome !== null;

        return {
          ...prev,
          currentRound: nextRound,
          currentTerms: data.updatedTerms,
          termStatuses: data.termStatuses,
          transcript: newTranscript,
          outcome: data.outcome,
          phase: isFinal ? "complete" : "negotiating",
          isLoading: false,
        };
      });

      if (data.debrief) {
        setDebrief(data.debrief);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setNegotiation((prev) =>
        prev ? { ...prev, isLoading: false } : prev
      );
    }
  }, [negotiation, config]);

  const handleReplay = useCallback(() => {
    setNegotiation(null);
    setDebrief(null);
    setConfig(null);
    setError(null);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <a href="/agents" style={{ color: "#888", fontSize: 13, textDecoration: "none", display: "inline-block", marginBottom: 16 }}>{"\u2190"} Back to Agents</a>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            background: "linear-gradient(135deg, #d4af37, #b8962e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Agent-to-Agent Negotiation Simulator
        </h1>
        <p
          style={{
            color: "#888",
            fontSize: 14,
            marginTop: 8,
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Two autonomous AI agents negotiate a B2B SaaS deal in real time.
          Configure the scenario, watch the negotiation unfold, and see the
          outcome.
        </p>
      </div>

      {error && (
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto 20px",
            padding: "12px 18px",
            borderRadius: 10,
            background: "rgba(244,67,54,0.1)",
            border: "1px solid rgba(244,67,54,0.3)",
            color: "#F44336",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {!negotiation && <SetupPanel onStart={handleStart} />}

      {negotiation && negotiation.phase !== "complete" && (
        <NegotiationView
          state={negotiation}
          onAdvanceRound={handleAdvanceRound}
        />
      )}

      {debrief && negotiation?.phase === "complete" && (
        <DebriefPanel debrief={debrief} onReplay={handleReplay} />
      )}
    </main>
  );
}
