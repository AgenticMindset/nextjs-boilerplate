import { voiceCoachSpeakRateLimiter } from "../../../../lib/rate-limit";

// Kokoro-82M (Apache-2.0, hexgrad/Kokoro-82M) hosted on Replicate. "af_bella"
// is one of Kokoro's flagship American-English voices - a warm, expressive
// adult female voice, a good match for "emphatic and energised".
//
// jaaari/kokoro-82m is a community model, not a Replicate "official" model,
// so the /v1/models/{owner}/{name}/predictions shorthand 404s for it - it
// must be run through the universal /v1/predictions endpoint with an
// explicit version id instead. Confirmed against the live API on 2026-07-26;
// refresh via `GET https://api.replicate.com/v1/models/jaaari/kokoro-82m`
// (`latest_version.id`) if this ever needs updating.
const REPLICATE_MODEL_VERSION = "f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13";
const VOICE = "af_bella";
const SPEED = 1.3;

interface ReplicatePrediction {
  status: string;
  output: string | string[] | null;
  error: string | null;
  urls?: { get?: string };
  // Present on request-level errors (e.g. 402 insufficient credit, 401 bad
  // token) rather than prediction-level ones - Replicate uses this shape
  // for errors that never became a prediction at all.
  title?: string;
  detail?: string;
}

async function pollPrediction(getUrl: string, token: string, deadlineMs: number): Promise<ReplicatePrediction> {
  const start = Date.now();
  for (;;) {
    const response = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const prediction = (await response.json()) as ReplicatePrediction;
    if (prediction.status === "succeeded" || prediction.status === "failed" || prediction.status === "canceled") {
      return prediction;
    }
    if (Date.now() - start > deadlineMs) {
      throw new Error("Speech synthesis timed out.");
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const { success } = await voiceCoachSpeakRateLimiter.limit(ip);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { text } = (await request.json()) as { text?: string };
    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      throw new Error("REPLICATE_API_TOKEN is not configured");
    }

    const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        version: REPLICATE_MODEL_VERSION,
        input: { text, voice: VOICE, speed: SPEED },
      }),
    });

    let prediction = (await createResponse.json()) as ReplicatePrediction;
    if (!createResponse.ok) {
      throw new Error(
        prediction.detail || prediction.error || `Replicate request failed: ${createResponse.status}`
      );
    }

    if (prediction.status !== "succeeded" && prediction.urls?.get) {
      prediction = await pollPrediction(prediction.urls.get, token, 25000);
    }

    if (prediction.status !== "succeeded" || !prediction.output) {
      throw new Error(prediction.error || "Speech synthesis failed.");
    }

    const audioUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok || !audioResponse.body) {
      throw new Error("Could not download synthesized audio.");
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": audioResponse.headers.get("content-type") || "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "Voice coach speak error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    return new Response(JSON.stringify({ error: "Speech synthesis failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
