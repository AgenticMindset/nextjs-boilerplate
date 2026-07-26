import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { voiceCoachConverseRateLimiter } from "../../../../lib/rate-limit";
import { SYSTEM_PROMPT } from "../../../../lib/voice-coach/prompts";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const { success } = await voiceCoachConverseRateLimiter.limit(ip);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, turnNumber } = await request.json();

    const contextNote =
      turnNumber >= 3
        ? "\n\nThis is the visitor's third reply. Do not ask another question - deliver the brief closing line now."
        : "";

    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      system: SYSTEM_PROMPT + contextNote,
      messages,
      onError: ({ error }) => {
        console.error(
          "Voice coach converse stream error:",
          JSON.stringify(error, Object.getOwnPropertyNames(error as object))
        );
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(
      "Voice coach converse error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
