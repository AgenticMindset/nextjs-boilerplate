import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { stressTestRateLimiter } from "../../../lib/rate-limit";
import { stressTestOutputSchema } from "../../../lib/tokenomics/schema";
import {
  buildStressTestSystemPrompt,
  buildStressTestUserPrompt,
  resolveTokenLabel,
  resolveTokenSummary,
} from "../../../lib/tokenomics/prompts";
import type { StressTestInput, StressTestResult } from "../../../lib/tokenomics/types";

export const maxDuration = 30;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const { success, reset } = await stressTestRateLimiter.limit(ip);

    if (!success) {
      const minutesLeft = Math.ceil((reset - Date.now()) / 1000 / 60);
      return new Response(
        JSON.stringify({
          error: "Rate limit reached. Please try again in " + minutesLeft + " minutes.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const input: StressTestInput = body.input;

    if (!input || !input.token || !input.scenario || !input.severity) {
      return new Response(JSON.stringify({ error: "Incomplete stress test input." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (input.token.preset === "Custom" && !input.token.customTokenomics.trim()) {
      return new Response(
        JSON.stringify({ error: "Please paste a tokenomics summary for a custom token." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const tokenLabel = resolveTokenLabel(input.token);
    const tokenSummary = resolveTokenSummary(input.token);

    const result = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: stressTestOutputSchema,
      system: buildStressTestSystemPrompt(),
      prompt: buildStressTestUserPrompt(tokenLabel, tokenSummary, input.scenario, input.severity),
    });

    const stressTestResult: StressTestResult = {
      ...result.object,
      generatedAt: new Date().toISOString(),
      tokenLabel,
      scenario: input.scenario,
      severity: input.severity,
    };

    return new Response(JSON.stringify(stressTestResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stress test error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
