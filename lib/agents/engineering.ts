// What the agents tab says about how these agents are built, as opposed to
// what they do. Each claim here corresponds to something that actually exists
// in this repository - keep it that way, and keep `source` pointing at the
// file that backs the claim. A visitor who does not believe the claim can
// click it, which is the entire point of the section.

const REPO = "https://github.com/AgenticMindset/nextjs-boilerplate/blob/main";

export interface EngineeringPractice {
  title: string;
  body: string;
  /** Path within the repository that demonstrates the claim. */
  source: string;
  /** Full URL to that file on the default branch. */
  href: string;
}

function practice(
  title: string,
  body: string,
  source: string
): EngineeringPractice {
  return { title, body, source, href: `${REPO}/${source}` };
}

export const ENGINEERING_PRACTICES: EngineeringPractice[] = [
  practice(
    "Structured output, validated",
    "Every agent that returns structured data defines it as a Zod schema and validates against it. A malformed model response fails loudly at the boundary instead of rendering as a half-empty card.",
    "lib/tokenomics/schema.ts"
  ),
  practice(
    "Versioned prompts",
    "Each prompt module carries a dated version header and a note on what changed and why. Prompts are treated as code that ships, not as strings that drift.",
    "app/api/agent/route.ts"
  ),
  practice(
    "Input guardrails",
    "Shared across every route: free text is length-capped before it reaches the model, control characters are stripped, and text matching known prompt-injection patterns is flagged and logged. Flagged, not blocked — these are low-stakes public demos, and false positives would only be annoying.",
    "lib/guardrails.ts"
  ),
  practice(
    "Tracing on every call",
    "One structured JSON line per call start and finish, carrying a trace id, duration, token usage and outcome. Zero dependencies and no external account; it registers an OpenTelemetry exporter the moment one is worth adding.",
    "lib/telemetry.ts"
  ),
  practice(
    "Rate limiting per agent",
    "A sliding window of 40 requests per hour per IP, held in Redis and scoped separately for each agent, so one busy demo cannot exhaust the budget for the rest.",
    "lib/rate-limit.ts"
  ),
  practice(
    "Deterministic evals",
    "A test suite covering the rule-based tools, the guardrails, the negotiation scoring and the schemas. No LLM calls, so it runs fast, free and repeatably — the parts that can be pinned down are pinned down.",
    "evals"
  ),
  practice(
    "Honest uncertainty",
    "Where an agent cannot know something, it says so rather than filling the gap. The wargame reports a confidence level derived from how well retrieval matched your market; the voice coach refuses to comment on anything it did not measure.",
    "lib/wargame/retrieval.ts"
  ),
];

export const FREE_TIER_NOTE =
  "Everything here runs on free tiers and open-weights models: Groq for inference and speech-to-text, Replicate for speech synthesis, Upstash for rate limiting, Pinecone for vectors, Vercel for hosting. That is a design constraint, not a disclaimer — it is why the engineering above exists. A shared budget is one you have to be deliberate about, so if an agent returns a rate-limit message, it is working as intended.";
