// Contract tests for the Zod schemas that constrain each generateObject
// call's output (lib/*/schema.ts). These don't call any LLM - they just
// lock in that a known-good shape still validates and a known-bad shape
// still gets rejected, so a schema edit that accidentally loosens or
// breaks validation shows up here instead of live in production.
import { describe, it, expect } from "vitest";
import { stressTestOutputSchema } from "../lib/tokenomics/schema";
import { problemSolverOutputSchema } from "../lib/problem-solver/schema";
import { wargameOutputSchema } from "../lib/wargame/schema";
import { agentMoveSchema } from "../lib/negotiator/schema";
import { feedbackOutputSchema } from "../lib/voice-coach/schema";

describe("stressTestOutputSchema", () => {
  const dim = { preStress: 80, postStress: 40, explanation: "Test explanation." };

  it("accepts a well-formed golden fixture", () => {
    const result = stressTestOutputSchema.safeParse({
      verdict: "at-risk",
      verdictSummary: "Test summary.",
      dimensions: {
        emissionResilience: dim,
        liquidityDepth: dim,
        governanceIntegrity: dim,
        reserveAdequacy: dim,
        priceStability: dim,
      },
      shockCascade: [1, 2, 3, 4].map((step) => ({
        step,
        title: `Stage ${step}`,
        description: "Test description.",
        severity: "medium",
      })),
      historicalAnalogue: { name: "Test Case", comparison: "Test.", details: "Test details." },
      survivesIf: ["A", "B", "C"],
      breaksWhen: ["X", "Y", "Z"],
    });
    expect(result.success).toBe(true);
  });

  it("normalizes typographic dash variants in the verdict enum", () => {
    const result = stressTestOutputSchema.safeParse({
      verdict: "critical‑failure", // non-breaking hyphen
      verdictSummary: "Test summary.",
      dimensions: {
        emissionResilience: dim,
        liquidityDepth: dim,
        governanceIntegrity: dim,
        reserveAdequacy: dim,
        priceStability: dim,
      },
      shockCascade: [1, 2, 3, 4].map((step) => ({
        step,
        title: `Stage ${step}`,
        description: "Test description.",
        severity: "high",
      })),
      historicalAnalogue: { name: "Test Case", comparison: "Test.", details: "Test details." },
      survivesIf: ["A", "B", "C"],
      breaksWhen: ["X", "Y", "Z"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a shockCascade with the wrong number of steps", () => {
    const result = stressTestOutputSchema.safeParse({
      verdict: "survives",
      verdictSummary: "Test summary.",
      dimensions: {
        emissionResilience: dim,
        liquidityDepth: dim,
        governanceIntegrity: dim,
        reserveAdequacy: dim,
        priceStability: dim,
      },
      shockCascade: [{ step: 1, title: "Only one", description: "Test.", severity: "low" }],
      historicalAnalogue: { name: "Test Case", comparison: "Test.", details: "Test details." },
      survivesIf: ["A", "B", "C"],
      breaksWhen: ["X", "Y", "Z"],
    });
    expect(result.success).toBe(false);
  });
});

describe("problemSolverOutputSchema", () => {
  it("rejects a recommendedFramework.id outside the known catalog", () => {
    const result = problemSolverOutputSchema.safeParse({
      problemType: "Test problem",
      recommendedFramework: {
        id: "not-a-real-framework-id",
        whyThisFits: "Test.",
        howToApply: ["1", "2", "3", "4"],
      },
      alternativeFrameworks: [],
      confidence: "high",
      confidenceReason: "Test.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects fewer than 2 alternativeFrameworks", () => {
    const result = problemSolverOutputSchema.safeParse({
      problemType: "Test problem",
      recommendedFramework: {
        id: "five-whys",
        whyThisFits: "Test.",
        howToApply: ["1", "2", "3", "4"],
      },
      alternativeFrameworks: [{ id: "5-whys", whenToUseInstead: "Test." }],
      confidence: "high",
      confidenceReason: "Test.",
    });
    expect(result.success).toBe(false);
  });
});

describe("wargameOutputSchema", () => {
  it("rejects topIncumbents arrays that aren't exactly length 3", () => {
    const result = wargameOutputSchema.safeParse({
      topIncumbents: [{ name: "A", positioning: "x", primaryMoat: "x", marketTier: "x" }],
      defensiveResponses: [1, 2, 3].map(() => ({
        incumbentName: "A",
        archetype: "Price pressure",
        predictedAction: "x",
        trigger: "x",
      })),
      strategy: { wedge: "x", sequence: "x", differentiationAxis: "x" },
      survivalConditions: ["a", "b", "c"],
      failureReason: "x",
    });
    expect(result.success).toBe(false);
  });
});

describe("agentMoveSchema", () => {
  it("accepts a move with only some proposedTerms present", () => {
    const result = agentMoveSchema.safeParse({
      publicMove: "We propose $70k over 12 months.",
      reasoning: "Testing budget flexibility.",
      proposedTerms: { price: 70000 },
      stance: "advancing",
      dealBreakerViolation: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid stance value", () => {
    const result = agentMoveSchema.safeParse({
      publicMove: "x",
      reasoning: "x",
      proposedTerms: {},
      stance: "furious",
      dealBreakerViolation: false,
    });
    expect(result.success).toBe(false);
  });
});

describe("feedbackOutputSchema", () => {
  it("has a schema exported and importable without throwing", () => {
    expect(feedbackOutputSchema).toBeDefined();
  });
});
