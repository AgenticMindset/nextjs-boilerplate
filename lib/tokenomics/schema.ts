import { z } from "zod";

function normalizeDashes(value: unknown): unknown {
  // Models occasionally emit typographic hyphen/dash variants (e.g. the
  // non-breaking hyphen U+2011) instead of a plain ASCII hyphen, which would
  // otherwise fail strict enum matching.
  if (typeof value !== "string") return value;
  return value.replace(/[‐‑‒–—―−]/g, "-");
}

const verdictEnum = z.preprocess(
  normalizeDashes,
  z.enum(["survives", "at-risk", "critical-failure"])
);

const cascadeSeverityEnum = z.enum(["low", "medium", "high", "critical"]);

const dimensionScoreSchema = z.object({
  preStress: z.number().min(0).max(100).describe("Resilience score before the shock, 0-100."),
  postStress: z.number().min(0).max(100).describe("Resilience score after the shock, 0-100."),
  explanation: z.string().describe("One to two sentences on why these scores were assigned."),
});

export const stressTestOutputSchema = z.object({
  verdict: verdictEnum,
  verdictSummary: z
    .string()
    .describe("2-3 sentence overall assessment of how the token responds to this stress scenario."),
  dimensions: z.object({
    emissionResilience: dimensionScoreSchema,
    liquidityDepth: dimensionScoreSchema,
    governanceIntegrity: dimensionScoreSchema,
    reserveAdequacy: dimensionScoreSchema,
    priceStability: dimensionScoreSchema,
  }),
  shockCascade: z
    .array(
      z.object({
        step: z.number().describe("Sequential step number, 1 through 4."),
        title: z.string().describe("Short title for this stage of the cascade."),
        description: z
          .string()
          .describe("2-3 sentences on how the shock propagates at this stage."),
        severity: cascadeSeverityEnum,
      })
    )
    .length(4)
    .describe("Exactly four sequential steps showing how the shock propagates through the system."),
  historicalAnalogue: z.object({
    name: z.string().describe("The name of the historical failure case this most resembles."),
    comparison: z
      .string()
      .describe("One sentence: 'This resembles X because...'"),
    details: z
      .string()
      .describe("3-5 sentences on the specific structural parallels and differences."),
  }),
  survivesIf: z
    .array(z.string())
    .min(3)
    .max(4)
    .describe("3-4 specific conditions under which the token survives this scenario."),
  breaksWhen: z
    .array(z.string())
    .min(3)
    .max(4)
    .describe("3-4 specific thresholds at which the token's design fails."),
});

export type StressTestOutputSchema = z.infer<typeof stressTestOutputSchema>;
