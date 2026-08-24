// Golden-case tests for the negotiator's scoring/debrief logic
// (lib/negotiator/scoring.ts) - pure functions, no LLM calls.
import { describe, it, expect } from "vitest";
import { computeDebrief } from "../lib/negotiator/scoring";
import type { ScenarioConfig, NegotiationRound, DealTerms } from "../lib/negotiator/types";

const baseConfig: ScenarioConfig = {
  product: "ai-analytics",
  customProduct: "",
  budgetCeiling: 80000,
  dealBreakers: [],
  sellerPersonality: "Collaborative",
  buyerPersonality: "Collaborative",
};

const baseTerms: DealTerms = {
  price: 80000,
  contractLength: 12,
  apiAccess: true,
  soc2: true,
  implementationDays: 30,
  pricingModel: "annual",
  sla: "99.9%",
};

function makeRound(roundNumber: number, price: number): NegotiationRound {
  return {
    roundNumber,
    sellerMove: {
      publicMove: "Proposal",
      reasoning: "Test",
      proposedTerms: { price },
      stance: "advancing",
      dealBreakerViolation: false,
    },
    buyerMove: {
      publicMove: "Counter",
      reasoning: "Test",
      proposedTerms: { price },
      stance: "advancing",
      dealBreakerViolation: false,
    },
    termsAfterRound: { ...baseTerms, price },
    termStatusesAfterRound: {
      price: "discussing",
      contractLength: "pending",
      apiAccess: "pending",
      soc2: "pending",
      implementationDays: "pending",
      pricingModel: "pending",
      sla: "pending",
    },
  };
}

describe("computeDebrief", () => {
  it("keeps seller and buyer scores within 0-100 and summing to 100", () => {
    const transcript = [makeRound(1, 90000), makeRound(2, 82000)];
    const debrief = computeDebrief(baseConfig, transcript, "closed");
    expect(debrief.sellerScorePct).toBeGreaterThanOrEqual(0);
    expect(debrief.sellerScorePct).toBeLessThanOrEqual(100);
    expect(debrief.sellerScorePct + debrief.buyerScorePct).toBe(100);
  });

  it("falls back to seller starting terms when the transcript is empty", () => {
    const debrief = computeDebrief(baseConfig, [], "deadlock");
    expect(debrief.finalTerms).toEqual(debrief.startingSellerTerms);
    expect(debrief.turningPointRound).toBe(1);
  });

  it("identifies the round with the largest price movement as the turning point", () => {
    const transcript = [
      makeRound(1, 79000), // small move from 80000 start
      makeRound(2, 60000), // big move
      makeRound(3, 58000), // small move
    ];
    const debrief = computeDebrief(baseConfig, transcript, "closed");
    expect(debrief.turningPointRound).toBe(2);
  });

  it("preserves the outcome passed in", () => {
    const debrief = computeDebrief(baseConfig, [makeRound(1, 75000)], "walkaway");
    expect(debrief.outcome).toBe("walkaway");
  });
});
