export type PresetToken =
  | "ETH"
  | "SOL"
  | "USDT"
  | "Algorithmic Stablecoin"
  | "Governance Token"
  | "Custom";

export type StressScenario =
  | "Bank Run"
  | "Regulatory Ban"
  | "Whale Dump"
  | "Yield Collapse"
  | "Competing Fork";

export type Severity = "Moderate" | "Severe";

export interface TokenSelection {
  preset: PresetToken;
  customTokenomics: string;
}

export interface StressTestInput {
  token: TokenSelection;
  scenario: StressScenario;
  severity: Severity;
}

export type Verdict = "survives" | "at-risk" | "critical-failure";

export interface DimensionScore {
  preStress: number;
  postStress: number;
  explanation: string;
}

export interface StressDimensions {
  emissionResilience: DimensionScore;
  liquidityDepth: DimensionScore;
  governanceIntegrity: DimensionScore;
  reserveAdequacy: DimensionScore;
  priceStability: DimensionScore;
}

export type CascadeSeverity = "low" | "medium" | "high" | "critical";

export interface ShockCascadeStep {
  step: number;
  title: string;
  description: string;
  severity: CascadeSeverity;
}

export interface HistoricalAnalogue {
  name: string;
  comparison: string;
  details: string;
}

export interface StressTestOutput {
  verdict: Verdict;
  verdictSummary: string;
  dimensions: StressDimensions;
  shockCascade: ShockCascadeStep[];
  historicalAnalogue: HistoricalAnalogue;
  survivesIf: string[];
  breaksWhen: string[];
}

export interface StressTestResult extends StressTestOutput {
  generatedAt: string;
  tokenLabel: string;
  scenario: StressScenario;
  severity: Severity;
}
