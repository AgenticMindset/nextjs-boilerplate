import Groq from "groq-sdk";
import { voiceCoachTranscribeRateLimiter } from "../../../../lib/rate-limit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const { success } = await voiceCoachTranscribeRateLimiter.limit(ip);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");
    if (!audio || !(audio instanceof Blob)) {
      return new Response(JSON.stringify({ error: "No audio provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const file = new File([audio], "utterance.webm", {
      type: audio.type || "audio/webm",
    });

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    const raw = transcription as unknown as {
      text: string;
      words?: { word: string; start: number; end: number }[];
      segments?: { avg_logprob?: number }[];
    };

    const avgLogprob =
      raw.segments && raw.segments.length > 0
        ? raw.segments.reduce((sum, s) => sum + (s.avg_logprob ?? 0), 0) /
          raw.segments.length
        : null;

    return new Response(
      JSON.stringify({
        text: raw.text ?? "",
        words: raw.words ?? null,
        avgLogprob,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(
      "Voice coach transcribe error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    return new Response(JSON.stringify({ error: "Transcription failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
