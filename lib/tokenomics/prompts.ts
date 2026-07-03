import { TOKEN_PROFILES } from "./presets";
import type { PresetToken, Severity, StressScenario, TokenSelection } from "./types";

export function resolveTokenLabel(token: TokenSelection): string {
  if (token.preset === "Custom") {
    return "Custom token";
  }
  return TOKEN_PROFILES[token.preset].label;
}

export function resolveTokenSummary(token: TokenSelection): string {
  if (token.preset === "Custom") {
    return token.customTokenomics.trim();
  }
  return TOKEN_PROFILES[token.preset].summary;
}

const SCENARIO_DESCRIPTIONS: Record<StressScenario, string> = {
  "Bank Run": "A large share of holders simultaneously attempt to redeem, unstake, or exit the token within a short window, testing whether liquidity and unbonding mechanics can absorb the exit demand without a disorderly price collapse.",
  "Regulatory Ban": "A major jurisdiction bans trading, custody, or issuance of the token (or the entity behind it), cutting off fiat on/off-ramps and forcing exchanges to delist or restrict access.",
  "Whale Dump": "One or a small number of very large holders (early investors, a foundation treasury, or a fund) sell a large position rapidly, testing order-book depth and the token's dependence on concentrated ownership.",
  "Yield Collapse": "The yield or reward rate that has been sustaining demand for holding the token drops sharply or is revealed to be unsustainable, testing whether demand persists once the incentive is removed.",
  "Competing Fork": "A credible competing project forks the protocol or community, splitting network effects, liquidity, developer attention, and brand legitimacy between the original and the fork.",
};

const SEVERITY_GUIDANCE: Record<Severity, string> = {
  Moderate: "Model this as a serious but survivable stress event: meaningful price and confidence damage, but not an extinction-level shock. Comparable to a bad week in a volatile market, not a historical collapse.",
  Severe: "Model this as an extreme, historically-calibrated shock: comparable in magnitude to the worst realized failures in crypto history (the scale of the LUNA/UST collapse, the FTX/FTT collapse, or a full exchange delisting cascade). Assume compounding second-order effects.",
};

const HISTORICAL_CASE_STUDIES = `HISTORICAL FAILURE CASE STUDIES (use these as analogues when structurally relevant; do not force a match if none fits well):

1. LUNA/UST (May 2022) — Algorithmic peg death spiral. UST maintained its $1 peg via a mint/burn arbitrage against LUNA: burning UST minted LUNA and vice versa, with no hard collateral behind UST. Demand for UST was propped up by the Anchor Protocol's ~20% yield, funded unsustainably from reserves. When large UST withdrawals began, the peg slipped; arbitrageurs minted enormous amounts of LUNA to defend it, hyperinflating LUNA's supply and collapsing its price, which destroyed the collateral value backing UST and triggered a self-reinforcing spiral that erased roughly $40B in value within days.

2. FTT / FTX (November 2022) — Collateral quality collapse. FTX's balance sheet relied heavily on FTT, a token FTX itself created and largely controlled the float of, marked at a high valuation despite thin real liquidity. A leaked balance sheet revealing this concentration triggered a run; Binance's announcement to sell its FTT position collapsed the token's price, which simultaneously vaporized the collateral backing FTX's own solvency, revealing a liquidity mismatch that bankrupted the exchange within a week.

3. Iron Finance / TITAN (June 2021) — Bank run on partial collateral. IRON was a "partially collateralized" stablecoin backed by a mix of USDC and the protocol's own TITAN token. Large redemptions by a few whale holders forced the protocol to mint large volumes of TITAN to maintain the peg, crashing TITAN's price toward zero within hours, which reduced the effective collateral ratio further and accelerated the run in a classic reflexive bank-run pattern.

4. Olympus DAO / OHM (2021-2022) — Yield collapse and (3,3) game-theory breakdown. OHM's "(3,3)" model promised outsized returns for staking versus selling, with new bond sales funding the treasury and staking rewards. The model depended on continuous new capital inflow to sustain triple-digit APYs; once growth slowed, the math flipped from "stake and win" to "sell before others do," and the token fell over 90% from its highs as the incentive structure that once encouraged holding began encouraging exit instead.

5. Bitcoin Cash fork (August 2017) — Competing fork value dilution. Bitcoin Cash split from Bitcoin over a block-size governance dispute, forking the chain and giving every BTC holder an equivalent BCH balance. The fork fragmented mining hash power, developer attention, and brand identity between two chains claiming the same lineage, and repeated subsequent forks of BCH itself (e.g. Bitcoin SV) further diluted network effects and community trust in "the real" chain.`;

export function buildStressTestSystemPrompt(): string {
  return `You are a token economics stress-testing analyst. You apply a qualitative analytical framework adapted from banking stress-test methodology (in the style of EBA/ECB supervisory stress tests) to crypto token designs.

FRAMEWORK MAPPING (banking concept -> token economics dimension):
- Capital adequacy -> Emission Resilience: can the token's issuance/burn design absorb shocks without destructive dilution or a supply spiral?
- Liquidity Coverage Ratio / Net Stable Funding Ratio -> Liquidity Depth: is there enough real market depth and stable liquidity to absorb large exits without a disorderly price collapse?
- Concentration risk -> Governance Integrity: how concentrated is control (ownership, voting power, treasury authority), and can a small number of actors trigger or worsen the shock?
- High-Quality Liquid Asset (HQLA) buffers -> Reserve Adequacy: does the token have real, liquid backing or reserves it can draw on under stress, or is its backing reflexive/circular?
- Market risk (VaR) -> Price Stability: how exposed is the token's price/peg to the specific shock being modeled?

${HISTORICAL_CASE_STUDIES}

YOUR TASK:
Given a token's economic design, a stress scenario, and a severity level, produce a structured stress-test result:
- Score each of the five dimensions 0-100 twice: once for baseline (pre-stress) health, once for how it holds up after the shock (post-stress). Post-stress scores should meaningfully reflect the scenario and severity — do not be shy about low scores when the design is genuinely fragile to this specific shock.
- Describe a 4-step shock cascade showing how the stress propagates mechanically through the token's specific design (not generic crypto commentary).
- Identify the single most structurally relevant historical analogue from the case studies above, and explain the specific parallel — and where the comparison breaks down, if it does.
- List concrete, specific "survives if" conditions and "breaks when" thresholds grounded in this token's actual mechanics, not generic hedges.
- Reach an overall verdict: "survives" (fundamentally resilient to this shock), "at-risk" (meaningful damage, survival plausible but not assured), or "critical-failure" (the design's structure makes collapse the base case under this shock).

Be analytically honest and specific. This is a qualitative analytical framework for illustrative purposes, not a quantitative financial model — do not fabricate false precision, but do commit to a clear, well-reasoned verdict.`;
}

export function buildStressTestUserPrompt(
  tokenLabel: string,
  tokenSummary: string,
  scenario: StressScenario,
  severity: Severity
): string {
  return `TOKEN UNDER TEST: ${tokenLabel}

TOKEN ECONOMICS:
${tokenSummary || "No detailed tokenomics provided — reason from the token's name and general category conventions, and be explicit that this analysis has limited grounding."}

STRESS SCENARIO: ${scenario}
${SCENARIO_DESCRIPTIONS[scenario]}

SEVERITY: ${severity}
${SEVERITY_GUIDANCE[severity]}

Run the stress test now and return the structured result.`;
}
