import type {
  ScenarioConfig,
  DealTerms,
  NegotiationRound,
  NegotiationOutcome,
  DebriefData,
} from "./types";
import { getSellerStartingTerms, getBuyerTargetTerms } from "./prompts";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function computeSellerScore(
  finalTerms: DealTerms,
  sellerStart: DealTerms,
  buyerTarget: DealTerms
): number {
  // Score = how close final price is to seller's anchor vs buyer's target
  const range = sellerStart.price - buyerTarget.price;
  if (range <= 0) return 50;
  const sellerGain = finalTerms.price - buyerTarget.price;
  return clamp(Math.round((sellerGain / range) * 100), 0, 100);
}

function computeBuyerScore(
  finalTerms: DealTerms,
  sellerStart: DealTerms,
  buyerTarget: DealTerms
): number {
  return 100 - computeSellerScore(finalTerms, sellerStart, buyerTarget);
}

function findTurningPoint(transcript: NegotiationRound[]): {
  round: number;
  explanation: string;
} {
  if (transcript.length === 0) return { round: 1, explanation: "Negotiation did not progress." };

  let maxMovement = 0;
  let turningRound = transcript[0];

  for (let i = 1; i < transcript.length; i++) {
    const prev = transcript[i - 1].termsAfterRound.price;
    const curr = transcript[i].termsAfterRound.price;
    const movement = Math.abs(curr - prev);
    if (movement > maxMovement) {
      maxMovement = movement;
      turningRound = transcript[i];
    }
  }

  const round = turningRound.roundNumber;
  const sellerStance = turningRound.sellerMove.stance;
  const buyerStance = turningRound.buyerMove.stance;

  let explanation = `Round ${round} was the turning point. `;
  if (sellerStance === "conceding" && buyerStance === "conceding") {
    explanation += "Both parties made significant concessions simultaneously, breaking the impasse.";
  } else if (sellerStance === "conceding") {
    explanation += "The seller made a major concession on price that shifted the negotiation's center of gravity.";
  } else if (buyerStance === "conceding") {
    explanation += "The buyer moved significantly toward the seller's position, signaling real budget flexibility.";
  } else if (sellerStance === "creative" || buyerStance === "creative") {
    explanation += "A creative package proposal restructured the deal and unlocked agreement on previously stuck terms.";
  } else {
    explanation += "The largest single-round price movement occurred here, resetting expectations for both parties.";
  }

  return { round, explanation };
}

export function computeDebrief(
  config: ScenarioConfig,
  transcript: NegotiationRound[],
  outcome: NegotiationOutcome
): DebriefData {
  const sellerStart = getSellerStartingTerms(config);
  const buyerTarget = getBuyerTargetTerms(config);
  const finalTerms =
    transcript.length > 0
      ? transcript[transcript.length - 1].termsAfterRound
      : sellerStart;

  const { round, explanation } = findTurningPoint(transcript);

  return {
    outcome,
    finalTerms,
    startingSellerTerms: sellerStart,
    startingBuyerTarget: buyerTarget,
    sellerScorePct: computeSellerScore(finalTerms, sellerStart, buyerTarget),
    buyerScorePct: computeBuyerScore(finalTerms, sellerStart, buyerTarget),
    turningPointRound: round,
    turningPointExplanation: explanation,
  };
}