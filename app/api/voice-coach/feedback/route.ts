import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { voiceCoachFeedbackRateLimiter } from "../../../../lib/rate-limit";
import { FEEDBACK_SYSTEM_PROMPT } from "../../../../lib/voice-coach/prompts";
import { feedbackOutputSchema } from "../../../../lib/voice-coach/schema";
import type { UtteranceMetrics } from "../../../../lib/voice-coach/types";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

function formatMetric(label: string, value: number | string | null, unit = ""): string {
  if (value === null) return `${label}: not measured`;
  return `${label}: ${value}${unit}`;
}

function buildPrompt(utterances: UtteranceMetrics[]): string {
  const sections = utterances.map((u, i) => {
    return `Utterance ${i + 1} transcript: "${u.transcript}"
Measured metrics for utterance ${i + 1}:
- ${formatMetric("Words per minute", u.wordsPerMinute)}
- ${formatMetric("Pause count (>=200ms)", u.pauseCount)}
- ${formatMetric("Average pause length", u.avgPauseMs, "ms")}
- ${formatMetric("Longest pause", u.longestPauseMs, "ms")}
- ${formatMetric("Filler word count", u.fillerWordCount)}
- ${formatMetric("Filler word rate", u.fillerWordRatePer100Words, " per 100 words")}
- Filler words found: ${u.fillerWordsFound.length > 0 ? u.fillerWordsFound.join(", ") : "none"}
- ${formatMetric("Pitch variation (stddev)", u.pitchVariationHz, " Hz")}
- ${formatMetric("Average energy (RMS)", u.avgEnergyRms)}
- ${formatMetric("Articulation approximation (0-1)", u.articulationApprox)}
- ${formatMetric("STT confidence approximation (0-1)", u.sttConfidenceApprox)}
- Duration: ${u.durationSec.toFixed(1)}s, word count: ${u.wordCount}`;
  });

  return `Here are the three user utterances from a short voice coaching conversation, with pre-computed delivery metrics for each:\n\n${sections.join(
    "\n\n"
  )}\n\nWrite the feedback report now, following the rules exactly.`;
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const { success } = await voiceCoachFeedbackRateLimiter.limit(ip);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { utterances } = (await request.json()) as {
      utterances: UtteranceMetrics[];
    };

    if (!Array.isArray(utterances) || utterances.length === 0) {
      return new Response(JSON.stringify({ error: "No utterances provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: feedbackOutputSchema,
      system: FEEDBACK_SYSTEM_PROMPT,
      prompt: buildPrompt(utterances),
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      "Voice coach feedback error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    return new Response(JSON.stringify({ error: "Feedback generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
