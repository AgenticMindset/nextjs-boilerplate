import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { agentTools } from "../../../lib/agent/tools";
import { rateLimiter } from "../../../lib/rate-limit";
import { otelConfig } from "../../../lib/telemetry";
import { sanitizeText, logIfSuspicious } from "../../../lib/guardrails";

const MAX_MESSAGE_LENGTH = 4000;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// PROMPT VERSION: v2 (2026-08-24)
// v2: added research_current_landscape (live Tavily search) as a real tool,
//     called in parallel with recommend_stack (same step, not sequential)
//     to ground answers in current info without adding a full extra
//     round-trip - Groq's 8,000 TPM budget on this account is shared
//     across every agent on the site and doesn't leave room for one.
// v1: initial 4-step workflow (recommend, estimate, diagram, follow-up).
const SYSTEM_PROMPT = `You are the Open Source Tech Stack Advisor, an AI agent built by Álvaro Tomás González.

Your purpose: help visitors design technology stacks for their product ideas using open-source tools.

Personality and rules:
- You are strongly open-source-first. Always recommend open-source tools and frameworks.
- Only mention closed-source or proprietary alternatives when no viable open-source option exists, and explicitly flag them as proprietary.
- Be opinionated. When multiple open-source options exist, recommend the one you believe is best and explain why.
- Keep responses concise and practical. No filler.

Workflow - follow this exact sequence:

STEP 1 - GATHER INFORMATION:
When a user first describes their product idea, carefully analyze their message for these three pieces of information:
- Expected user scale: any mention of user counts, transaction volumes, or words like "small", "medium", "large" counts. Examples: "50K transactions" = medium/large, "3 expert devs" implies scale awareness, "just me and a friend" = small.
- Team skill level: any mention of experience level, years of experience, or technical roles counts. Examples: "expert devs" = advanced, "we know React" = intermediate, "never coded" = beginner.
- Technical constraints: any mention of specific technologies, languages, blockchains, or infrastructure counts. Examples: "using Polygon" = constraint, "want to use Rust" = constraint, "no constraints" = none.

RULES FOR STEP 1:
- You MUST have explicit information about user scale AND team skill level before proceeding. A product description alone is NEVER enough.
- If the user only describes what they want to build but does not mention team size/skill or expected users, you MUST ask about the missing items.
- Only skip questions if the user explicitly states numbers like "100K users", "3 expert devs", or "beginner team". Vague descriptions do not count.
- If all three are explicitly provided, go directly to STEP 2 without asking anything.

STEP 2 - RESEARCH + RECOMMEND (same turn):
Once you have all three pieces of information, call research_current_landscape AND recommend_stack TOGETHER in the same turn (two parallel tool calls, not one after another) - do not wait for the research result before calling recommend_stack. Give research_current_landscape a targeted query about the most technically significant or fast-moving requirement in the request (e.g. the realtime layer, the search engine, the blockchain tooling). Do NOT write any text before calling these tools.

STEP 3 - COSTS:
Immediately after recommend_stack returns, call estimate_costs. No transition text needed between these tool calls.

STEP 4 - DIAGRAM:
Immediately after estimate_costs returns, call generate_diagram. No transition text needed.

STEP 5 - FOLLOW UP:
After the generate_diagram tool has returned, write ONLY this sentence and nothing else: "Would you like to adjust any part of the stack?" Do NOT write this or any other text before or between tool calls. The ONLY text you write in the entire STEP 2-5 sequence is this single sentence after the last tool returns.

Critical rules:
- NEVER call tools on the same turn as asking clarifying questions. Ask questions first, wait for answers, then use tools.
- NEVER repeat or summarize tool results in your text. The results are rendered as visual cards. Writing them out causes duplicate content.
- Keep your text responses between tool calls to a minimum. One short sentence or nothing at all.
- If the user asks about a specific tool or technology, answer from your own knowledge without calling tools.

You are a demo agent on a portfolio website. Be helpful but keep conversations focused on tech stack advice.`;

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const { success, remaining, reset } = await rateLimiter.limit(ip);

    if (!success) {
      const resetDate = new Date(reset);
      const minutesLeft = Math.ceil(
        (reset - Date.now()) / 1000 / 60
      );
      return new Response(
        JSON.stringify({
          error: `Rate limit reached. This is a demo with limited capacity. Please try again in ${minutesLeft} minutes.`,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": resetDate.toISOString(),
          },
        }
      );
    }

    const { messages: rawMessages } = await request.json();

    const messages = (rawMessages ?? []).map(
      (m: { role: string; content: string }) => ({
        ...m,
        content:
          typeof m.content === "string"
            ? sanitizeText(m.content, MAX_MESSAGE_LENGTH)
            : m.content,
      })
    );
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage && typeof lastUserMessage.content === "string") {
      logIfSuspicious("tech-stack-advisor", lastUserMessage.content);
    }

    const traceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const start = Date.now();
    console.log(
      JSON.stringify({
        event: "agent_call_start",
        traceId,
        feature: "tech-stack-advisor",
        messageCount: messages?.length,
        ts: new Date().toISOString(),
      })
    );

    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      system: SYSTEM_PROMPT,
      messages,
      tools: agentTools,
      maxSteps: 5,
      experimental_telemetry: otelConfig("tech-stack-advisor", { traceId }),
      onFinish: ({ usage, finishReason }) => {
        console.log(
          JSON.stringify({
            event: "agent_call_end",
            traceId,
            feature: "tech-stack-advisor",
            durationMs: Date.now() - start,
            promptTokens: usage?.promptTokens,
            completionTokens: usage?.completionTokens,
            totalTokens: usage?.totalTokens,
            finishReason,
            success: true,
            ts: new Date().toISOString(),
          })
        );
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        const message = error instanceof Error ? error.message : String(error);
        const isRateLimit = /rate limit|tokens per minute|TPM/i.test(message);

        console.error(
          JSON.stringify({
            event: "agent_call_end",
            traceId,
            feature: "tech-stack-advisor",
            durationMs: Date.now() - start,
            success: false,
            error: message,
            isRateLimit,
            ts: new Date().toISOString(),
          })
        );

        return isRateLimit
          ? "This demo is on a shared, rate-limited free tier and just hit its per-minute cap. Please wait about 20 seconds and try again."
          : "Something went wrong generating a response. Please try again.";
      },
    });
  } catch (error) {
    console.error(
      "Agent error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}