import { z } from "zod";

export const agentMoveSchema = z.object({
  publicMove: z
    .string()
    .describe(
      "The agent's proposal or counter-proposal in natural language. Concise and specific. 2-4 sentences max."
    ),
  reasoning: z
    .string()
    .describe(
      "The agent's internal strategy logic. What they know, what they're testing, why they're making this move. 3-5 sentences."
    ),
  proposedTerms: z
    .object({
      price: z.number().optional(),
      contractLength: z.number().optional(),
      apiAccess: z.boolean().optional(),
      soc2: z.boolean().optional(),
      implementationDays: z.number().optional(),
      pricingModel: z
        .enum(["annual", "monthly", "usage-based"])
        .optional(),
      sla: z.string().optional(),
    })
    .describe(
      "Only include terms this agent is actively proposing to change this round. Omit terms not under discussion."
    ),
  stance: z
    .enum(["advancing", "conceding", "holding", "creative", "walkaway"])
    .describe(
      "advancing = pushing for more, conceding = giving ground, holding = not moving, creative = package deal or novel structure, walkaway = signaling or executing exit"
    ),
  dealBreakerViolation: z
    .boolean()
    .describe(
      "True if the opposing agent's last proposal violated one of this agent's stated deal-breakers."
    ),
});

export type AgentMoveSchema = z.infer<typeof agentMoveSchema>;

export const negotiationResultSchema = z.object({
  sellerMove: agentMoveSchema,
  buyerMove: agentMoveSchema,
});