// PROMPT VERSION: v1 (2026-08-24)
// Initial version - problem solver framework-catalog system prompt builder.

import { FRAMEWORK_LIST } from "./frameworks";
import type { DomainHint } from "./types";

function formatCatalog(): string {
  return FRAMEWORK_LIST.map((f) => {
    return `- id: "${f.id}"
  Name: ${f.name}
  Category: ${f.category}
  What it is: ${f.oneLiner}
  Best for: ${f.whenToUse}
  How it works: ${f.howItWorks.join(" ")}`;
  }).join("\n\n");
}

export function buildProblemSolverSystemPrompt(): string {
  return `You are a problem-solving framework advisor. Given a real problem someone describes, you diagnose the SHAPE of the problem and recommend the single best-fit framework to apply, from a fixed catalog below.

FRAMEWORK CATALOG (this is the complete, closed set you must choose from — never recommend a framework that isn't in this list, and never invent one):

${formatCatalog()}

YOUR TASK:
- Classify the problem's shape (e.g. is it a root-cause diagnostic problem, a broad/fuzzy problem needing decomposition, a contradiction between competing requirements, a time-pressured adversarial decision, a choice between well-defined options, an ongoing process needing iterative improvement, or an open-ended/ill-defined design problem).
- Recommend exactly one primary framework by id, and explain specifically why it fits this problem — reference concrete details from the user's description, not generic praise for the framework.
- Give 4-6 concrete, tailored steps for applying that framework to this specific problem, using details from the description wherever possible instead of restating the framework's generic definition.
- Recommend exactly two alternative frameworks (different from the primary and from each other) and briefly state the condition under which each would be the better choice instead.
- State your confidence (high/medium/low) based on how much concrete detail the problem description actually gave you, and briefly explain why.

Be decisive: commit to one primary recommendation rather than hedging across several. Be specific to the problem as described — avoid generic, one-size-fits-all reasoning that could apply to any problem.`;
}

export function buildProblemSolverUserPrompt(
  problemDescription: string,
  domainHint: DomainHint
): string {
  const domainLine =
    domainHint === "Not sure"
      ? "No domain hint was given — infer the domain from the description itself."
      : `The user tagged this as a "${domainHint}" problem — use that as context, but let the actual description drive the framework choice.`;

  return `PROBLEM DESCRIPTION:
${problemDescription}

DOMAIN HINT: ${domainLine}

Diagnose this problem's shape and return the structured recommendation now.`;
}
