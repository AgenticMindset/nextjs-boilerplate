export type Product =
  | "ai-analytics"
  | "cybersecurity"
  | "dev-productivity"
  | "custom";

export type Personality =
  | "Aggressive"
  | "Collaborative"
  | "Risk-Averse"
  | "Time-Pressured";

export type DealBreaker =
  | "no-multiyear"
  | "api-access"
  | "soc2"
  | "fast-implementation"
  | "usage-based";

export type NegotiationPhase =
  | "setup"
  | "negotiating"
  | "intervention"
  | "complete";

export type TermStatus = "agreed" | "discussing" | "deadlocked" | "pending";

export interface DealTerms {
  price: number;
  contractLength: number; // months
  apiAccess: boolean;
  soc2: boolean;
  implementationDays: number;
  pricingModel: "annual" | "monthly" | "usage-based";
  sla: string; // e.g. "99.9%"
}

export interface TermStatuses {
  price: TermStatus;
  contractLength: TermStatus;
  apiAccess: TermStatus;
  soc2: TermStatus;
  implementationDays: TermStatus;
  pricingModel: TermStatus;
  sla: TermStatus;
}

export type AgentStance =
  | "advancing"
  | "conceding"
  | "holding"
  | "creative"
  | "walkaway";

export interface AgentMove {
  publicMove: string;
  reasoning: string;
  proposedTerms: Partial<DealTerms>;
  stance: AgentStance;
  dealBreakerViolation: boolean;
}

export interface NegotiationRound {
  roundNumber: number;
  sellerMove: AgentMove;
  buyerMove: AgentMove;
  termsAfterRound: DealTerms;
  termStatusesAfterRound: TermStatuses;
}

export interface ScenarioConfig {
  product: Product;
  customProduct: string;
  budgetCeiling: number;
  dealBreakers: DealBreaker[];
  sellerPersonality: Personality;
  buyerPersonality: Personality;
}

export type NegotiationOutcome = "closed" | "walkaway" | "deadlock";

export interface DebriefData {
  outcome: NegotiationOutcome;
  finalTerms: DealTerms;
  startingSellerTerms: DealTerms;
  startingBuyerTarget: DealTerms;
  sellerScorePct: number;
  buyerScorePct: number;
  turningPointRound: number;
  turningPointExplanation: string;
}

export interface NegotiationState {
  phase: NegotiationPhase;
  currentRound: number;
  maxRounds: number;
  currentTerms: DealTerms;
  termStatuses: TermStatuses;
  transcript: NegotiationRound[];
  outcome: NegotiationOutcome | null;
  isLoading: boolean;
}