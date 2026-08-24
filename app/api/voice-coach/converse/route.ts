import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { voiceCoachConverseRateLimiter } from "../../../../lib/rate-limit";
import { SYSTEM_PROMPT } from "../../../../lib/voice-coach/prompts";
import { traceAgentCall, otelConfig } from "../../../../lib/telemetry";
import { sanitizeText, logIfSuspicious } from "../../../../lib/guardrails";

const MAX_MESSAGE_LENGTH = 2000;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Smaller open models like GPT-OSS 120B don't reliably reproduce a verbatim
// closing phrase when asked to (tested live: it got dropped, paraphrased,
// or replaced with a follow-up question across repeated tries). Since this
// exact line needs to appear every time, it's appended deterministically in
// code instead of trusted to the model - the model only has to produce a
// short natural reaction.
const WRAP_UP_CLOSING_LINE = "I have enough context, here's your feedback.";
// Deterministic backstop for the other branch: asked to ask a follow-up
// question, the model sometimes just reacts and stops - live-tested and
// reproduced (a reaction with no question mark at all, leaving the session
// stuck with neither a question nor feedback). If its reply has no "?",
// this generic nudge is appended so the conversation always moves forward.
const FALLBACK_FOLLOW_UP = "Can you tell me a bit more about that?";

// Same reliability gap as the closing line above: asked not to ask a
// question on the wrap-up turn, the model still slipped one in a
// noticeable fraction of live test runs. Stripping any sentence that ends
// in "?" is a deterministic backstop regardless of what the model does.
function stripQuestions(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) ?? [text];
  return sentences
    .map((s) => s.trim())
    .filter((s) => s && !s.endsWith("?"))
    .join(" ")
    .trim();
}

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

    const { messages: rawMessages, isFinalTurn } = (await request.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
      isFinalTurn: boolean;
    };

    const messages = rawMessages.map((m) => ({
      ...m,
      content: sanitizeText(m.content, MAX_MESSAGE_LENGTH),
    }));
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      logIfSuspicious("voice-coach.converse", lastUserMessage.content);
    }

    if (isFinalTurn) {
      const reactionNote =
        "\n\nWRAP UP: this is the last turn. React briefly and warmly (one short sentence) to what they just said, like a friend would. Do NOT ask a question, do NOT say goodbye, and do NOT mention feedback, analysis, or that you have enough context - a fixed closing line covering that will be appended after your reaction, so just give the reaction and nothing else.";

      const text = await traceAgentCall(
        "voice-coach.converse.final",
        { messageCount: messages.length },
        async () => {
          const result = await generateText({
            model: groq("openai/gpt-oss-120b"),
            system: SYSTEM_PROMPT + reactionNote,
            messages,
            experimental_telemetry: otelConfig("voice-coach.converse.final"),
          });
          return { data: result.text, usage: result.usage };
        }
      );

      const reaction = stripQuestions(text);
      const finalText = reaction ? `${reaction} ${WRAP_UP_CLOSING_LINE}` : WRAP_UP_CLOSING_LINE;
      return new Response(finalText, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const contextNote =
      "\n\nNEEDS MORE: their sample so far is a bit thin for a reliable read on some aspect of their speech. React briefly and warmly to what they just said, then ask ONE natural follow-up that invites them to keep elaborating on the same topic.";

    const text = await traceAgentCall(
      "voice-coach.converse.continue",
      { messageCount: messages.length },
      async () => {
        const result = await generateText({
          model: groq("openai/gpt-oss-120b"),
          system: SYSTEM_PROMPT + contextNote,
          messages,
          experimental_telemetry: otelConfig("voice-coach.converse.continue"),
        });
        return { data: result.text, usage: result.usage };
      }
    );

    const trimmed = text.trim();
    const finalText = trimmed.includes("?") ? trimmed : `${trimmed} ${FALLBACK_FOLLOW_UP}`.trim();
    return new Response(finalText, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
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
