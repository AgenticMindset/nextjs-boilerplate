import type { FrameworkId } from "./frameworks";

export type DomainHint =
  | "Not sure"
  | "Business & Strategy"
  | "Team & Org"
  | "Product & Technical"
  | "Personal & Career"
  | "Creative & Open-ended";

export interface ProblemSolverInput {
  problemDescription: string;
  domainHint: DomainHint;
}

export type Confidence = "high" | "medium" | "low";

export interface RecommendedFramework {
  id: FrameworkId;
  whyThisFits: string;
  howToApply: string[];
}

export interface AlternativeFramework {
  id: FrameworkId;
  whenToUseInstead: string;
}

export interface ProblemSolverOutput {
  problemType: string;
  recommendedFramework: RecommendedFramework;
  alternativeFrameworks: AlternativeFramework[];
  confidence: Confidence;
  confidenceReason: string;
}

export interface ProblemSolverResult extends ProblemSolverOutput {
  generatedAt: string;
  problemDescription: string;
  domainHint: DomainHint;
}
