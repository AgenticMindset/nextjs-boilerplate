"use client";
import { useState, useCallback } from "react";
import SetupPanel from "../../components/negotiator/SetupPanel";
import NegotiationView from "../../components/negotiator/NegotiationView";
import DebriefPanel from "../../components/negotiator/DebriefPanel";
import { AgentError } from "../../components/agents/AgentStatus";
import { getSellerStartingTerms } from "../../../lib/negotiator/prompts";
import type {
  ScenarioConfig,
  NegotiationState,
  DebriefData,
  TermStatuses,
  Intervention,
  Personality,
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
export default function NegotiatorClient() {
  const [config, setConfig] = useState<ScenarioConfig | null>(null);
  const [negotiation, setNegotiation] = useState<NegotiationState | null>(null);
  const [debrief, setDebrief] = useState<DebriefData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingIntervention, setPendingIntervention] = useState<Intervention | null>(null);
  const [sellerPersonality, setSellerPersonality] = useState<Personality>("Collaborative");
  const [buyerPersonality, setBuyerPersonality] = useState<Personality>("Risk-Averse");
  const handleStart = useCallback(function(newConfig: ScenarioConfig) {
    const startingTerms = getSellerStartingTerms(newConfig);
    setConfig(newConfig);
    setDebrief(null);
    setError(null);
    setPendingIntervention(null);
    setSellerPersonality(newConfig.sellerPersonality);
    setBuyerPersonality(newConfig.buyerPersonality);
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
  const handleIntervene = useCallback(function(intervention: Intervention) {
    setPendingIntervention(intervention);
    if (intervention.type === "personality-switch") {
      if (intervention.targetAgent === "seller") {
        setSellerPersonality(intervention.newPersonality);
      } else {
        setBuyerPersonality(intervention.newPersonality);
      }
    }
    if (intervention.type === "force-deadline") {
      setNegotiation(function(prev) {
        if (!prev) return prev;
        const newMaxRounds = prev.transcript.length + intervention.roundsRemaining;
        return { ...prev, maxRounds: newMaxRounds };
      });
    }
  }, []);
  const handleAdvanceRound = useCallback(async function() {
    if (!negotiation || !config || negotiation.isLoading) return;
    const nextRound = negotiation.transcript.length + 1;
    setNegotiation(function(prev) {
      return prev ? { ...prev, isLoading: true } : prev;
    });
    setError(null);
    try {
      const bodyData: Record<string, unknown> = {
        config: {
          ...config,
          sellerPersonality: sellerPersonality,
          buyerPersonality: buyerPersonality,
        },
        currentTerms: negotiation.currentTerms,
        transcript: negotiation.transcript,
        roundNumber: nextRound,
        maxRounds: negotiation.maxRounds,
      };
      if (pendingIntervention) {
        bodyData.intervention = pendingIntervention;
      }
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error: " + response.status);
      }
      const data = await response.json();
      setPendingIntervention(null);
      setNegotiation(function(prev) {
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
      setNegotiation(function(prev) {
        return prev ? { ...prev, isLoading: false } : prev;
      });
    }
  }, [negotiation, config, pendingIntervention, sellerPersonality, buyerPersonality]);
  const handleReplay = useCallback(function() {
    setNegotiation(null);
    setDebrief(null);
    setConfig(null);
    setError(null);
    setPendingIntervention(null);
  }, []);
  return (
    <>
      {error && <AgentError message={error} />}
      {!negotiation && <SetupPanel onStart={handleStart} />}
      {negotiation && negotiation.phase !== "complete" && (
        <NegotiationView
          state={negotiation}
          onAdvanceRound={handleAdvanceRound}
          onIntervene={handleIntervene}
          pendingIntervention={pendingIntervention}
          currentSellerPersonality={sellerPersonality}
          currentBuyerPersonality={buyerPersonality}
        />
      )}
      {debrief && negotiation?.phase === "complete" && (
        <DebriefPanel debrief={debrief} onReplay={handleReplay} />
      )}
    </>
  );
}
