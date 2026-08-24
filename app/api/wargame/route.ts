import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { wargameRateLimiter } from "../../../lib/rate-limit";
import { wargameOutputSchema } from "../../../lib/wargame/schema";
import { retrieveContext } from "../../../lib/wargame/retrieval";
import {
  buildWargameSystemPrompt,
  buildWargameUserPrompt,
} from "../../../lib/wargame/prompts";
import type { MarketDefinition, WargameResult } from "../../../lib/wargame/types";
import { traceAgentCall, otelConfig } from "../../../lib/telemetry";
import { sanitizeText, logIfSuspicious } from "../../../lib/guardrails";

export const maxDuration = 60;
const MAX_CUSTOM_FIELD_LENGTH = 200;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const { success, reset } = await wargameRateLimiter.limit(ip);

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
    const market: MarketDefinition = body.market;

    if (!market || !market.vertical || !market.technology || !market.geography || !market.segment) {
      return new Response(JSON.stringify({ error: "Incomplete market definition." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    for (const field of ["customVertical", "customTechnology", "customGeography", "customSegment"] as const) {
      if (market[field]) {
        market[field] = sanitizeText(market[field], MAX_CUSTOM_FIELD_LENGTH);
        logIfSuspicious("wargame." + field, market[field]);
      }
    }

    const { confidence, sourceMode, contextBlock } = await retrieveContext(market);

    const object = await traceAgentCall(
      "wargame",
      { vertical: market.vertical, technology: market.technology, sourceMode, confidence },
      async () => {
        const result = await generateObject({
          model: groq("openai/gpt-oss-120b"),
          schema: wargameOutputSchema,
          system: buildWargameSystemPrompt(),
          prompt: buildWargameUserPrompt(market, contextBlock),
          experimental_telemetry: otelConfig("wargame"),
        });
        return { data: result.object, usage: result.usage };
      }
    );

    const wargameResult: WargameResult = {
      ...object,
      generatedAt: new Date().toISOString(),
      confidence,
      sourceMode,
      marketDefinition: market,
    };

    return new Response(JSON.stringify(wargameResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Wargame error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
