import type {
  ScenarioConfig,
  DealTerms,
  NegotiationRound,
  Personality,
} from "./types";

// ─── Product definitions ───────────────────────────────────────────────

export const PRODUCT_LABELS: Record<string, string> = {
  "ai-analytics": "AI Analytics Platform",
  cybersecurity: "Cybersecurity Monitoring Tool",
  "dev-productivity": "Developer Productivity Suite",
  custom: "Custom Product",
};

export const PRODUCT_CONTEXT: Record<string, string> = {
  "ai-analytics":
    "An AI-powered analytics platform that processes behavioral data, generates predictive insights, and surfaces anomalies in real time. Typical deals: $80K–$300K/year depending on data volume and seat count.",
  cybersecurity:
    "A continuous security monitoring tool covering threat detection, incident response automation, and compliance reporting. Typical deals: $60K–$250K/year. SOC2 compliance is standard for this category.",
  "dev-productivity":
    "A developer productivity suite including code review automation, CI/CD optimization, and engineering metrics. Typical deals: $40K–$180K/year based on developer seat count.",
  custom: "A B2B SaaS product being negotiated between a vendor and a buyer.",
};

// ─── Starting positions ────────────────────────────────────────────────

export function getSellerStartingTerms(config: ScenarioConfig): DealTerms {
  const budgetAnchor = Math.round(config.budgetCeiling * 0.85);
  return {
    price: budgetAnchor,
    contractLength: 24,
    apiAccess: config.dealBreakers.includes("api-access") ? true : false,
    soc2: config.dealBreakers.includes("soc2") ? true : false,
    implementationDays: config.dealBreakers.includes("fast-implementation")
      ? 25
      : 60,
    pricingModel: config.dealBreakers.includes("usage-based")
      ? "usage-based"
      : "annual",
    sla: "99.5%",
  };
}

export function getBuyerTargetTerms(config: ScenarioConfig): DealTerms {
  return {
    price: Math.round(config.budgetCeiling * 0.65),
    contractLength: config.dealBreakers.includes("no-multiyear") ? 12 : 18,
    apiAccess: config.dealBreakers.includes("api-access"),
    soc2: config.dealBreakers.includes("soc2"),
    implementationDays: config.dealBreakers.includes("fast-implementation")
      ? 20
      : 45,
    pricingModel: config.dealBreakers.includes("usage-based")
      ? "usage-based"
      : "monthly",
    sla: "99.9%",
  };
}

// ─── Personality modifiers ─────────────────────────────────────────────

const PERSONALITY_DESCRIPTION: Record<Personality, string> = {
  Aggressive:
    "You open high and concede slowly and reluctantly. You test the other party's limits aggressively. You use pressure tactics: artificial urgency, competitive comparisons, take-it-or-leave-it framing. You never volunteer concessions without extracting something in return. You signal walkaway credibly when you hit your floor.",
  Collaborative:
    "You treat this as a partnership negotiation, not a win-lose contest. You share reasoning openly, acknowledge the other party's constraints, and actively look for package deals that expand value for both sides. You still advocate firmly for your interests but you use principled argument rather than pressure.",
  "Risk-Averse":
    "You prioritize certainty over upside. You are uncomfortable with open-ended commitments, flexible pricing, or ambiguous terms. You ask for specifics, request guarantees, and prefer shorter contracts with renewal options over longer commitments. You are slow to agree and quick to flag concerns.",
  "Time-Pressured":
    "You need this deal closed quickly. You are willing to make concessions you might not otherwise make just to reach agreement. You show impatience when discussions stall, you skip secondary issues to focus on the core terms, and you signal clearly that dragging this out has a cost for you.",
};

// ─── Round guidance ────────────────────────────────────────────────────

function getRoundGuidance(round: number, maxRounds: number): string {
  if (round === 1)
    return "This is Round 1. Open with a positional anchor. State your terms clearly and confidently. Do not concede anything yet. Establish what you want.";
  if (round === 2)
    return "Round 2. You have heard the other party's opening position. Respond to their anchor. You may concede on one secondary term to demonstrate good faith, but hold firm on your core issue (price or a key deal-breaker).";
  if (round <= maxRounds - 2)
    return "Round " + round + ". The negotiation is in its middle phase. Look for trades: give ground on something you care less about in exchange for movement on something you care more about. Consider introducing a package proposal.";
  if (round === maxRounds - 1)
    return "Round " + round + ". You are approaching the final round. Make your most important remaining ask now. Signal whether you are close to agreement or approaching your walkaway point.";
  return "Round " + round + " — FINAL ROUND. This is the last chance to reach agreement. Either close the deal with your best offer, split the difference on any remaining gaps, or execute a credible walkaway if the terms are genuinely unacceptable.";
}

// ─── Compressed history ────────────────────────────────────────────────

function compressHistory(transcript: NegotiationRound[]): string {
  if (transcript.length === 0) return "No prior rounds.";
  const last2 = transcript.slice(-2);
  return last2
    .map(function(r) {
      return "Round " + r.roundNumber + ": Seller offered — " + r.sellerMove.publicMove.slice(0, 120) + "... Buyer responded — " + r.buyerMove.publicMove.slice(0, 120) + "...";
    })
    .join("\n");
}

function formatTerms(terms: DealTerms): string {
  return "Price: $" + terms.price.toLocaleString() + "/year | Contract: " + terms.contractLength + " months | API access: " + (terms.apiAccess ? "yes" : "no") + " | SOC2: " + (terms.soc2 ? "yes" : "no") + " | Implementation: " + terms.implementationDays + " days | Pricing model: " + terms.pricingModel + " | SLA: " + terms.sla;
}

// ─── Seller system prompt ──────────────────────────────────────────────

export function buildSellerSystemPrompt(config: ScenarioConfig): string {
  const productLabel =
    config.product === "custom"
      ? config.customProduct
      : PRODUCT_LABELS[config.product];
  const productContext =
    config.product === "custom"
      ? 'A B2B SaaS product called "' + config.customProduct + '" being negotiated.'
      : PRODUCT_CONTEXT[config.product];

  return "You are a B2B SaaS Account Executive negotiating the sale of " + productLabel + ".\n\nPRODUCT CONTEXT:\n" + productContext + "\n\nYOUR PERSONALITY: " + config.sellerPersonality + "\n" + PERSONALITY_DESCRIPTION[config.sellerPersonality] + "\n\nYOUR CONSTRAINTS (private — the buyer does not know these):\n- Your floor price: $" + Math.round(config.budgetCeiling * 0.55).toLocaleString() + "/year. You will not go below this.\n- You prefer longer contracts (24 months ideal) but can accept 12 months.\n- You have flexibility on implementation timeline and SLA but prefer not to offer SOC2 unless required.\n- You will not offer usage-based pricing unless the buyer makes it a firm deal-breaker.\n\nOUTPUT FORMAT:\nYou must respond with valid JSON matching the required schema exactly. No prose outside the JSON.\n- publicMove: what you say to the buyer. Specific, natural, professional. 2-4 sentences.\n- reasoning: your private strategy logic. What you know, what you're testing, why this move. 3-5 sentences.\n- proposedTerms: only include terms you are actively changing this round.\n- stance: one of advancing | conceding | holding | creative | walkaway\n- dealBreakerViolation: true if the buyer's last move crossed one of your hard lines.";
}

// ─── Buyer system prompt ───────────────────────────────────────────────

export function buildBuyerSystemPrompt(config: ScenarioConfig): string {
  const productLabel =
    config.product === "custom"
      ? config.customProduct
      : PRODUCT_LABELS[config.product];

  const dealBreakerLabels: Record<string, string> = {
    "no-multiyear": "no multi-year lock-in (12 months max)",
    "api-access": "API access must be included",
    soc2: "SOC2 compliance required",
    "fast-implementation": "implementation must complete within 30 days",
    "usage-based": "usage-based pricing only, no fixed annual fee",
  };

  const dealBreakerText =
    config.dealBreakers.length === 0
      ? "You have no absolute deal-breakers this time."
      : "Your deal-breakers (absolute, non-negotiable): " + config.dealBreakers
          .map(function(db) { return dealBreakerLabels[db]; })
          .join("; ") + ".";

  return "You are a Procurement Lead evaluating a purchase of " + productLabel + " for your company.\n\nYOUR PERSONALITY: " + config.buyerPersonality + "\n" + PERSONALITY_DESCRIPTION[config.buyerPersonality] + "\n\nYOUR CONSTRAINTS (private — the seller does not know these):\n- Your budget ceiling: $" + config.budgetCeiling.toLocaleString() + "/year. You cannot approve anything above this.\n- Your target: $" + Math.round(config.budgetCeiling * 0.65).toLocaleString() + "/year or below.\n- " + dealBreakerText + "\n- You want a strong SLA (99.9% uptime) but will accept 99.5% if price is right.\n\nOUTPUT FORMAT:\nYou must respond with valid JSON matching the required schema exactly. No prose outside the JSON.\n- publicMove: what you say to the seller. Specific, natural, professional. 2-4 sentences.\n- reasoning: your private strategy logic. What you know, what you're testing, why this move. 3-5 sentences.\n- proposedTerms: only include terms you are actively changing this round.\n- stance: one of advancing | conceding | holding | creative | walkaway\n- dealBreakerViolation: true if the seller's last move crossed one of your deal-breakers.";
}

// ─── Dynamic round messages ────────────────────────────────────────────

export function buildSellerRoundMessage(
  round: number,
  maxRounds: number,
  currentTerms: DealTerms,
  transcript: NegotiationRound[],
  lastBuyerMove: string | null,
  intervention?: { whisper?: string; marketEvent?: string; deadlineRounds?: number }
): string {
  const history = compressHistory(transcript);
  const terms = formatTerms(currentTerms);
  const guidance = getRoundGuidance(round, maxRounds);

  let interventionText = "";
  if (intervention && intervention.whisper) {
    interventionText += "\n\nCONFIDENTIAL INSTRUCTION FROM YOUR MANAGER: " + intervention.whisper + "\nIncorporate this into your strategy. The other party does not know about this instruction.";
  }
  if (intervention && intervention.marketEvent) {
    interventionText += "\n\nBREAKING MARKET EVENT: " + intervention.marketEvent + "\nBoth parties are now aware of this. Adjust your strategy accordingly.";
  }
  if (intervention && intervention.deadlineRounds !== undefined) {
    interventionText += "\n\nURGENT: You have been informed that this deal must close within " + intervention.deadlineRounds + " more rounds or negotiations end permanently. Act accordingly.";
  }

  const buyerLine = lastBuyerMove
    ? 'BUYER\'S LAST MOVE: "' + lastBuyerMove + '"'
    : "You are opening the negotiation.";

  return guidance + "\n\nCURRENT DEAL TABLE:\n" + terms + "\n\nRECENT HISTORY:\n" + history + "\n\n" + buyerLine + interventionText + "\n\nMake your move now. Return valid JSON only.";
}

export function buildBuyerRoundMessage(
  round: number,
  maxRounds: number,
  currentTerms: DealTerms,
  transcript: NegotiationRound[],
  sellerMove: string,
  intervention?: { whisper?: string; marketEvent?: string; deadlineRounds?: number }
): string {
  const history = compressHistory(transcript);
  const terms = formatTerms(currentTerms);
  const guidance = getRoundGuidance(round, maxRounds);

  let interventionText = "";
  if (intervention && intervention.whisper) {
    interventionText += "\n\nCONFIDENTIAL INSTRUCTION FROM YOUR MANAGER: " + intervention.whisper + "\nIncorporate this into your strategy. The other party does not know about this instruction.";
  }
  if (intervention && intervention.marketEvent) {
    interventionText += "\n\nBREAKING MARKET EVENT: " + intervention.marketEvent + "\nBoth parties are now aware of this. Adjust your strategy accordingly.";
  }
  if (intervention && intervention.deadlineRounds !== undefined) {
    interventionText += "\n\nURGENT: You have been informed that this deal must close within " + intervention.deadlineRounds + " more rounds or negotiations end permanently. Act accordingly.";
  }

  return guidance + "\n\nCURRENT DEAL TABLE:\n" + terms + "\n\nRECENT HISTORY:\n" + history + '\n\nSELLER\'S MOVE THIS ROUND: "' + sellerMove + '"' + interventionText + "\n\nRespond now. Return valid JSON only.";
}