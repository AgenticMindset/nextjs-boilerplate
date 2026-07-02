import { DEFENSIVE_ARCHETYPES, type MarketDefinition } from "./types";

export function resolveLabel(
  selected: string,
  custom: string
): string {
  return selected === "Other" && custom.trim() ? custom.trim() : selected;
}

export function marketDefinitionToLabels(market: MarketDefinition) {
  return {
    vertical: resolveLabel(market.vertical, market.customVertical),
    technology: resolveLabel(market.technology, market.customTechnology),
    geography: resolveLabel(market.geography, market.customGeography),
    segment: resolveLabel(market.segment, market.customSegment),
  };
}

export function buildMarketQueryText(market: MarketDefinition): string {
  const { vertical, technology, geography, segment } =
    marketDefinitionToLabels(market);
  return `${technology} for ${vertical} in ${geography}, targeting ${segment} buyers`;
}

const ARCHETYPE_MENU = DEFENSIVE_ARCHETYPES.map(
  (a) => `- ${a.name}: ${a.description} (Matters most when: ${a.whenItMatters})`
).join("\n");

export function buildWargameSystemPrompt(): string {
  return `You are a competitive strategy analyst running a "Market Entry Wargame" simulation. Given a market definition and supporting research context, you predict how incumbent companies will defend their position against a new AI-native entrant, and you recommend an entry strategy.

DEFENSIVE RESPONSE ARCHETYPES available to you:
${ARCHETYPE_MENU}

RULES:
- Identify the three real, specific incumbents most relevant to this exact market definition (vertical + technology + geography + segment combination), not just generic category leaders.
- For each incumbent, select the ONE archetype from the list above that is most plausible for that specific company given its actual business model and structural position. Do not force variety — if two incumbents would realistically respond the same way, say so.
- Ground every claim in the provided context. If the context is thin, reason from general market dynamics but say so implicitly by being appropriately general rather than inventing specifics.
- Be honest and specific in the failure pre-mortem. A portfolio audience reading this expects candor, not boosterism.
- Never break character to mention you are an AI or that this is a simulation.`;
}

export function buildWargameUserPrompt(
  market: MarketDefinition,
  contextBlock: string
): string {
  const { vertical, technology, geography, segment } =
    marketDefinitionToLabels(market);

  return `MARKET DEFINITION
Vertical: ${vertical}
Technology: ${technology}
Geography: ${geography}
Target Segment: ${segment}

RESEARCH CONTEXT
${contextBlock}

Analyze this market entry scenario now and return the structured wargame output.`;
}
