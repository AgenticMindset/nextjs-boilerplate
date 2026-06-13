import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { rateLimiter } from "../../../lib/rate-limit";
import { agentMoveSchema } from "../../../lib/negotiator/schema";
import {
  buildSellerSystemPrompt,
  buildBuyerSystemPrompt,
  buildSellerRoundMessage,
  buildBuyerRoundMessage,
  getSellerStartingTerms,
} from "../../../lib/negotiator/prompts";
import { computeDebrief } from "../../../lib/negotiator/scoring";
import type {
  ScenarioConfig,
  DealTerms,
  NegotiationRound,
  TermStatuses,
  Intervention,
} from "../../../lib/negotiator/types";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

function mergeTerms(
  current: DealTerms,
  sellerProposed: Partial<DealTerms>,
  buyerProposed: Partial<DealTerms>
): DealTerms {
  const merged = { ...current };

  if (sellerProposed.contractLength !== undefined)
    merged.contractLength = sellerProposed.contractLength;
  if (buyerProposed.contractLength !== undefined)
    merged.contractLength = Math.round(
      (merged.contractLength + buyerProposed.contractLength) / 2
    );

  if (sellerProposed.price !== undefined && buyerProposed.price !== undefined) {
    merged.price = Math.round(
      (sellerProposed.price + buyerProposed.price) / 2
    );
  } else if (sellerProposed.price !== undefined) {
    merged.price = sellerProposed.price;
  } else if (buyerProposed.price !== undefined) {
    merged.price = buyerProposed.price;
  }

  if (buyerProposed.apiAccess !== undefined)
    merged.apiAccess = buyerProposed.apiAccess;
  else if (sellerProposed.apiAccess !== undefined)
    merged.apiAccess = sellerProposed.apiAccess;

  if (buyerProposed.soc2 !== undefined) merged.soc2 = buyerProposed.soc2;
  else if (sellerProposed.soc2 !== undefined) merged.soc2 = sellerProposed.soc2;

  if (buyerProposed.implementationDays !== undefined)
    merged.implementationDays = buyerProposed.implementationDays;
  else if (sellerProposed.implementationDays !== undefined)
    merged.implementationDays = sellerProposed.implementationDays;

  if (buyerProposed.pricingModel !== undefined)
    merged.pricingModel = buyerProposed.pricingModel;
  else if (sellerProposed.pricingModel !== undefined)
    merged.pricingModel = sellerProposed.pricingModel;

  if (buyerProposed.sla !== undefined) merged.sla = buyerProposed.sla;
  else if (sellerProposed.sla !== undefined) merged.sla = sellerProposed.sla;

  return merged;
}

function computeTermStatuses(
  current: DealTerms,
  previous: DealTerms,
  sellerProposed: Partial<DealTerms>,
  buyerProposed: Partial<DealTerms>,
  sellerWalkaway: boolean,
  buyerWalkaway: boolean
): TermStatuses {
  function termStatus(
    key: keyof DealTerms,
    currentVal: unknown,
    prevVal: unknown
  ): import("../../../lib/negotiator/types").TermStatus {
    if (sellerWalkaway || buyerWalkaway) return "deadlocked";
    const sellerTouched = key in sellerProposed;
    const buyerTouched = key in buyerProposed;
    if (!sellerTouched && !buyerTouched) {
      if (currentVal === prevVal) return "pending";
      return "agreed";
    }
    if (sellerTouched && buyerTouched) {
      const sv = sellerProposed[key as keyof typeof sellerProposed];
      const bv = buyerProposed[key as keyof typeof buyerProposed];
      if (sv === bv) return "agreed";
      return "discussing";
    }
    return "discussing";
  }

  return {
    price: termStatus("price", current.price, previous.price),
    contractLength: termStatus(
      "contractLength",
      current.contractLength,
      previous.contractLength
    ),
    apiAccess: termStatus("apiAccess", current.apiAccess, previous.apiAccess),
    soc2: termStatus("soc2", current.soc2, previous.soc2),
    implementationDays: termStatus(
      "implementationDays",
      current.implementationDays,
      previous.implementationDays
    ),
    pricingModel: termStatus(
      "pricingModel",
      current.pricingModel,
      previous.pricingModel
    ),
    sla: termStatus("sla", current.sla, previous.sla),
  };
}

function detectOutcome(
  round: NegotiationRound,
  config: ScenarioConfig,
  isLastRound: boolean
): "closed" | "walkaway" | "deadlock" | "continue" {
  const { sellerMove, buyerMove, termsAfterRound } = round;

  if (sellerMove.stance === "walkaway" || buyerMove.stance === "walkaway")
    return "walkaway";

  if (sellerMove.dealBreakerViolation && buyerMove.dealBreakerViolation)
    return "deadlock";

  if (config.dealBreakers.includes("no-multiyear") && termsAfterRound.contractLength > 12)
    return "continue";
  if (config.dealBreakers.includes("api-access") && !termsAfterRound.apiAccess)
    return "continue";
  if (config.dealBreakers.includes("soc2") && !termsAfterRound.soc2)
    return "continue";
  if (config.dealBreakers.includes("usage-based") && termsAfterRound.pricingModel !== "usage-based")
    return "continue";

  if (termsAfterRound.price > config.budgetCeiling) return "continue";

  if (
    !sellerMove.dealBreakerViolation &&
    !buyerMove.dealBreakerViolation &&
    termsAfterRound.price <= config.budgetCeiling
  ) {
    if (isLastRound) return "closed";
    if (sellerMove.stance === "holding" && buyerMove.stance === "holding")
      return "deadlock";
  }

  if (isLastRound) {
    if (termsAfterRound.price <= config.budgetCeiling) return "closed";
    return "deadlock";
  }

  return "continue";
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const { success, remaining, reset } = await rateLimiter.limit(ip);

    if (!success) {
      const minutesLeft = Math.ceil((reset - Date.now()) / 1000 / 60);
      return new Response(
        JSON.stringify({
          error: "Rate limit reached. Please try again in " + minutesLeft + " minutes.",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await request.json();
    const {
      config,
      currentTerms,
      transcript,
      roundNumber,
      maxRounds,
      intervention,
    }: {
      config: ScenarioConfig;
      currentTerms: DealTerms;
      transcript: NegotiationRound[];
      roundNumber: number;
      maxRounds: number;
      intervention?: Intervention;
    } = body;

    const lastBuyerMove =
      transcript.length > 0
        ? transcript[transcript.length - 1].buyerMove.publicMove
        : null;

    // ── Apply personality switch if active ───────────────────────────
    const effectiveConfig = { ...config };
    if (intervention && intervention.type === "personality-switch") {
      if (intervention.targetAgent === "seller") {
        effectiveConfig.sellerPersonality = intervention.newPersonality;
      } else {
        effectiveConfig.buyerPersonality = intervention.newPersonality;
      }
    }

    // ── Build intervention data for prompts ──────────────────────────
    const sellerInterventionData = {
      whisper: intervention && intervention.type === "whisper" && intervention.targetAgent === "seller" ? intervention.message : undefined,
      marketEvent: intervention && intervention.type === "market-event" ? intervention.event : undefined,
      deadlineRounds: intervention && intervention.type === "force-deadline" ? intervention.roundsRemaining : undefined,
    };

    const buyerInterventionData = {
      whisper: intervention && intervention.type === "whisper" && intervention.targetAgent === "buyer" ? intervention.message : undefined,
      marketEvent: intervention && intervention.type === "market-event" ? intervention.event : undefined,
      deadlineRounds: intervention && intervention.type === "force-deadline" ? intervention.roundsRemaining : undefined,
    };

    // ── Seller turn ──────────────────────────────────────────────────
    const sellerResult = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: agentMoveSchema,
      system: buildSellerSystemPrompt(effectiveConfig),
      prompt: buildSellerRoundMessage(
        roundNumber,
        maxRounds,
        currentTerms,
        transcript,
        lastBuyerMove,
        sellerInterventionData
      ),
    });

    const sellerMove = sellerResult.object;

    // ── Buyer turn ───────────────────────────────────────────────────
    const buyerResult = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: agentMoveSchema,
      system: buildBuyerSystemPrompt(effectiveConfig),
      prompt: buildBuyerRoundMessage(
        roundNumber,
        maxRounds,
        currentTerms,
        transcript,
        sellerMove.publicMove,
        buyerInterventionData
      ),
    });

    const buyerMove = buyerResult.object;

    // ── Merge terms ──────────────────────────────────────────────────
    const updatedTerms = mergeTerms(
      currentTerms,
      sellerMove.proposedTerms,
      buyerMove.proposedTerms
    );

    const termStatuses = computeTermStatuses(
      updatedTerms,
      currentTerms,
      sellerMove.proposedTerms,
      buyerMove.proposedTerms,
      sellerMove.stance === "walkaway",
      buyerMove.stance === "walkaway"
    );

    const round: NegotiationRound = {
      roundNumber,
      sellerMove: {
        publicMove: sellerMove.publicMove,
        reasoning: sellerMove.reasoning,
        proposedTerms: sellerMove.proposedTerms,
        stance: sellerMove.stance,
        dealBreakerViolation: sellerMove.dealBreakerViolation,
      },
      buyerMove: {
        publicMove: buyerMove.publicMove,
        reasoning: buyerMove.reasoning,
        proposedTerms: buyerMove.proposedTerms,
        stance: buyerMove.stance,
        dealBreakerViolation: buyerMove.dealBreakerViolation,
      },
      termsAfterRound: updatedTerms,
      termStatusesAfterRound: termStatuses,
    };

    const isLastRound = roundNumber >= maxRounds;
    const outcomeSignal = detectOutcome(round, effectiveConfig, isLastRound);
    const isFinal = outcomeSignal !== "continue";

    const debrief = isFinal
      ? computeDebrief(effectiveConfig, [...transcript, round], outcomeSignal as "closed" | "walkaway" | "deadlock")
      : null;

    return new Response(
      JSON.stringify({
        round,
        updatedTerms,
        termStatuses,
        outcome: isFinal ? outcomeSignal : null,
        debrief,
        rateLimitRemaining: remaining,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Negotiate error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}