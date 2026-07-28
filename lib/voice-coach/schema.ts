import { z } from "zod";

const observationSchema = z.object({
  claim: z.string().describe("What was observed, in plain language."),
  evidence: z
    .string()
    .describe(
      "The exact measured number (with unit) or the exact transcript quote backing this claim."
    ),
});

const dimensionFeedbackSchema = z.object({
  observations: z.array(observationSchema).min(0).max(4),
  notMeasured: z
    .array(z.string())
    .describe(
      "Plain-language names of metrics that were null/unavailable and therefore omitted above."
    ),
});

export const feedbackOutputSchema = z.object({
  spokenSummary: z
    .string()
    .describe(
      "2-3 sentences, written to be read aloud by a TTS voice: warm, direct, references at most one number and one suggestion."
    ),
  delivery: dimensionFeedbackSchema,
  content: dimensionFeedbackSchema,
  articulation: dimensionFeedbackSchema,
  suggestions: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe("Concrete, prioritized suggestions tied to specific observations above."),
});
