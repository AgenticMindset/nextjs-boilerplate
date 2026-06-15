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
  Intervention,
  Personality,
} from "../../../lib/negotiator/types";
var MAX_ROUNDS = 6;
var INITIAL_STATUSES: TermStatuses = {
  price: "pending",
  contractLength: "pending",
  apiAccess: "pending",
  soc2: "pending",
  implementationDays: "pending",
  pricingModel: "pending",
  sla: "pending",
};
export default function NegotiatorPage() {
  var [config, setConfig] = useState<ScenarioConfig | null>(null);
  var [negotiation, setNegotiation] = useState<NegotiationState | null>(null);
  var [debrief, setDebrief] = useState<DebriefData | null>(null);
  var [error, setError] = useState<string | null>(null);
  var [pendingIntervention, setPendingIntervention] = useState<Intervention | null>(null);
  var [sellerPersonality, setSellerPersonality] = useState<Personality>("Collaborative");
  var [buyerPersonality, setBuyerPersonality] = useState<Personality>("Risk-Averse");
  var handleStart = useCallback(function(newConfig: ScenarioConfig) {
    var startingTerms = getSellerStartingTerms(newConfig);
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
  var handleIntervene = useCallback(function(intervention: Intervention) {
    setPendingIntervention(intervention);
    if (intervention.type === "personality-switch") {
      if (intervention.targetAgent === "seller") {
        setSellerPersonality(intervention.newPersonality);
      } else {
        setBuyerPersonality(intervention.newPersonality);
      }
    }
  }, []);
  var handleAdvanceRound = useCallback(async function() {
    if (!negotiation || !config || negotiation.isLoading) return;
    var nextRound = negotiation.transcript.length + 1;
    setNegotiation(function(prev) {
      return prev ? { ...prev, isLoading: true } : prev;
    });
    setError(null);
    try {
      var bodyData: Record<string, unknown> = {
        config: {
          ...config,
          sellerPersonality: sellerPersonality,
          buyerPersonality: buyerPersonality,
        },
        currentTerms: negotiation.currentTerms,
        transcript: negotiation.transcript,
        roundNumber: nextRound,
        maxRounds: MAX_ROUNDS,
      };
      if (pendingIntervention) {
        bodyData.intervention = pendingIntervention;
      }
      var response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) {
        var errData = await response.json();
        throw new Error(errData.error || "Server error: " + response.status);
      }
      var data = await response.json();
      setPendingIntervention(null);
      setNegotiation(function(prev) {
        if (!prev) return prev;
        var newTranscript = [...prev.transcript, data.round];
        var isFinal = data.outcome !== null;
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
      var message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setNegotiation(function(prev) {
        return prev ? { ...prev, isLoading: false } : prev;
      });
    }
  }, [negotiation, config, pendingIntervention, sellerPersonality, buyerPersonality]);
  var handleReplay = useCallback(function() {
    setNegotiation(null);
    setDebrief(null);
    setConfig(null);
    setError(null);
    setPendingIntervention(null);
  }, []);
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        padding: "80px 20px 40px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 10}}>
        <a href="/agents" style={{ color: "#888", fontSize: 13, textDecoration: "none", display: "inline-block", marginBottom: 10}}>{"\u2190"} Back to Agents</a>
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
          onIntervene={handleIntervene}
          pendingIntervention={pendingIntervention}
          currentSellerPersonality={sellerPersonality}
          currentBuyerPersonality={buyerPersonality}
        />
      )}
      {debrief && negotiation?.phase === "complete" && (
        <DebriefPanel debrief={debrief} onReplay={handleReplay} />
      )}
    </main>
  );
}
