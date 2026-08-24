// Zero-dependency structured tracing for the agent routes. Logs one JSON
// line per call start/end (duration, token usage, success/error) to
// console, which lands in Vercel's function logs (or the local terminal)
// with no external account or service required. If this project later
// registers @vercel/otel in instrumentation.ts, the experimental_telemetry
// options passed alongside AI SDK calls will also start appearing in
// Vercel's Observability dashboard automatically, at no extra cost.

type TraceMeta = Record<string, string | number | boolean | undefined>;

interface Usage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

interface TraceOutcome<T> {
  data: T;
  usage?: Usage;
}

function genTraceId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function traceAgentCall<T>(
  feature: string,
  meta: TraceMeta,
  fn: () => Promise<TraceOutcome<T>>
): Promise<T> {
  const traceId = genTraceId();
  const start = Date.now();

  console.log(
    JSON.stringify({
      event: "agent_call_start",
      traceId,
      feature,
      ...meta,
      ts: new Date().toISOString(),
    })
  );

  try {
    const { data, usage } = await fn();
    console.log(
      JSON.stringify({
        event: "agent_call_end",
        traceId,
        feature,
        ...meta,
        durationMs: Date.now() - start,
        promptTokens: usage?.promptTokens,
        completionTokens: usage?.completionTokens,
        totalTokens: usage?.totalTokens,
        success: true,
        ts: new Date().toISOString(),
      })
    );
    return data;
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "agent_call_end",
        traceId,
        feature,
        ...meta,
        durationMs: Date.now() - start,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        ts: new Date().toISOString(),
      })
    );
    throw error;
  }
}

// Passed as `experimental_telemetry` to streamText/generateObject calls.
// No-ops today (no OTel SDK registered); starts exporting to Vercel's
// Observability dashboard for free the moment @vercel/otel is added.
export function otelConfig(functionId: string, metadata?: TraceMeta) {
  const cleanMetadata: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(metadata ?? {})) {
    if (value !== undefined) cleanMetadata[key] = value;
  }

  return {
    isEnabled: true,
    functionId,
    metadata: cleanMetadata,
  };
}
