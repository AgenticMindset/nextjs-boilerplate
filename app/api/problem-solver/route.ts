import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { problemSolverRateLimiter } from "../../../lib/rate-limit";
import { problemSolverOutputSchema } from "../../../lib/problem-solver/schema";
import {
  buildProblemSolverSystemPrompt,
  buildProblemSolverUserPrompt,
} from "../../../lib/problem-solver/prompts";
import type { ProblemSolverInput, ProblemSolverResult } from "../../../lib/problem-solver/types";

export const maxDuration = 30;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const { success, reset } = await problemSolverRateLimiter.limit(ip);

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
    const input: ProblemSolverInput = body.input;

    if (!input || !input.problemDescription || !input.problemDescription.trim()) {
      return new Response(JSON.stringify({ error: "Please describe the problem you want help with." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const domainHint = input.domainHint || "Not sure";

    const result = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: problemSolverOutputSchema,
      system: buildProblemSolverSystemPrompt(),
      prompt: buildProblemSolverUserPrompt(input.problemDescription.trim(), domainHint),
    });

    const problemSolverResult: ProblemSolverResult = {
      ...result.object,
      generatedAt: new Date().toISOString(),
      problemDescription: input.problemDescription.trim(),
      domainHint,
    };

    return new Response(JSON.stringify(problemSolverResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Problem solver error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
