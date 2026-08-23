import { z } from "zod";
import { FRAMEWORK_LIST, type FrameworkId } from "./frameworks";

const frameworkIds = FRAMEWORK_LIST.map((f) => f.id) as [FrameworkId, ...FrameworkId[]];

const frameworkIdEnum = z.enum(frameworkIds);

const confidenceEnum = z.enum(["high", "medium", "low"]);

export const problemSolverOutputSchema = z.object({
  problemType: z
    .string()
    .describe("A short (3-6 word) classification of the problem, e.g. 'Root-cause diagnostic problem'."),
  recommendedFramework: z.object({
    id: frameworkIdEnum.describe("The id of the single best-fit framework from the provided catalog. Must be one of the catalog ids — never invent a framework."),
    whyThisFits: z
      .string()
      .describe("2-4 sentences explaining why THIS specific framework fits THIS specific problem, referencing details from the problem description. Do not restate generic framework facts."),
    howToApply: z
      .array(z.string())
      .min(4)
      .max(6)
      .describe("4-6 concrete steps for applying the framework to this specific problem, tailored with the user's own details where possible."),
  }),
  alternativeFrameworks: z
    .array(
      z.object({
        id: frameworkIdEnum,
        whenToUseInstead: z
          .string()
          .describe("1-2 sentences on the condition under which this alternative would be the better pick instead of the primary recommendation."),
      })
    )
    .length(2)
    .describe("Exactly two runner-up frameworks from the catalog, different from the primary recommendation and from each other."),
  confidence: confidenceEnum,
  confidenceReason: z
    .string()
    .describe("1-2 sentences on what drives the confidence level, e.g. how much detail was in the problem description."),
});

export type ProblemSolverOutputSchema = z.infer<typeof problemSolverOutputSchema>;
