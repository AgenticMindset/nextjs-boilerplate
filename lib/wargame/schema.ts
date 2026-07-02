import { z } from "zod";

function normalizeDashes(value: unknown): unknown {
  // Models occasionally emit typographic hyphen/dash variants (e.g. the
  // non-breaking hyphen U+2011) instead of a plain ASCII hyphen, which would
  // otherwise fail strict enum matching.
  if (typeof value !== "string") return value;
  return value.replace(/[‐‑‒–—―−]/g, "-");
}

const archetypeEnum = z.preprocess(
  normalizeDashes,
  z.enum([
    "Price pressure",
    "Feature acceleration",
    "Partnership lock-in",
    "Ecosystem bundling",
    "Data moat deepening",
    "Regulatory capture",
    "Talent denial",
    "Open-source counter",
    "FUD and narrative control",
  ])
);

export const wargameOutputSchema = z.object({
  topIncumbents: z
    .array(
      z.object({
        name: z.string().describe("The incumbent company's real name."),
        positioning: z
          .string()
          .describe("One sentence on how this incumbent positions itself."),
        primaryMoat: z
          .string()
          .describe("The incumbent's main structural advantage."),
        marketTier: z
          .string()
          .describe(
            "Rough market share tier or category leadership claim, e.g. 'category leader' or 'fast-growing challenger'."
          ),
      })
    )
    .length(3)
    .describe("The three most relevant incumbents for this exact market definition."),
  defensiveResponses: z
    .array(
      z.object({
        incumbentName: z
          .string()
          .describe("Must match one of the names in topIncumbents."),
        archetype: archetypeEnum,
        predictedAction: z
          .string()
          .describe("The specific action this incumbent is likely to take."),
        trigger: z
          .string()
          .describe("What the entrant would do that triggers this response."),
      })
    )
    .length(3)
    .describe(
      "Ranked by probability, most likely first. Select archetypes from the provided list based on which genuinely fit this market — do not force variety."
    ),
  strategy: z.object({
    wedge: z.string().describe("The specific beachhead the entrant should attack first."),
    sequence: z.string().describe("The land-to-expand path, in one or two sentences."),
    differentiationAxis: z
      .string()
      .describe("What the entrant can do that incumbents cannot easily replicate."),
  }),
  survivalConditions: z
    .array(z.string())
    .length(3)
    .describe("Three necessary conditions for the entrant to survive."),
  failureReason: z
    .string()
    .describe(
      "The pre-mortem: 1-2 honest, specific sentences on the most likely reason this entrant fails."
    ),
});

export type WargameOutputSchema = z.infer<typeof wargameOutputSchema>;
