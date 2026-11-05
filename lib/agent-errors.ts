// Shared failure handling for the agent routes.
//
// Everything here runs on Groq's free tier, whose per-minute token budget
// (8,000 TPM on gpt-oss-120b, shared across every agent on this site) is
// easy to hit with two runs in quick succession. That is a wait-and-retry
// condition, not a fault, but it used to reach the user as a flat
// "Something went wrong" on every route except the tech stack advisor,
// which had its own copy of the friendly wording. This module holds the one
// definition both now use.

/**
 * What an upstream provider says when the shared per-minute budget is spent.
 * Groq phrases it as "tokens per minute (TPM)"; the broader patterns catch
 * the same condition from the other providers behind these routes.
 */
const UPSTREAM_RATE_LIMIT_PATTERN = /rate limit|rate_limit|tokens per minute|\bTPM\b|too many requests/i;

export const UPSTREAM_RATE_LIMIT_MESSAGE =
  "This demo is on a shared, rate-limited free tier and just hit its per-minute cap. Please wait about 20 seconds and try again.";

/** True when `error` is an upstream provider refusing on rate grounds. */
export function isUpstreamRateLimit(error: unknown): boolean {
  if (error && typeof error === "object") {
    // AI SDK and the provider SDKs surface the HTTP status directly, which is
    // more reliable than matching on prose.
    const status = (error as { statusCode?: unknown; status?: unknown });
    if (status.statusCode === 429 || status.status === 429) return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return UPSTREAM_RATE_LIMIT_PATTERN.test(message);
}

/**
 * Logs a route failure in full and turns it into the response the user sees.
 *
 * An upstream rate limit becomes a 429 carrying
 * {@link UPSTREAM_RATE_LIMIT_MESSAGE}, so the client's existing error banner
 * explains the wait. Anything else keeps the route's own wording at 500.
 *
 * The log line retains the complete serialized error, including non-enumerable
 * properties like `stack` and `cause` — that detail is what makes an
 * intermittent dependency failure diagnosable after the fact.
 */
export function agentErrorResponse(
  feature: string,
  error: unknown,
  fallbackMessage = "Something went wrong"
): Response {
  const rateLimited = isUpstreamRateLimit(error);

  console.error(
    JSON.stringify({
      event: "agent_route_error",
      feature,
      isRateLimit: rateLimited,
      message: error instanceof Error ? error.message : String(error),
      detail: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      ts: new Date().toISOString(),
    })
  );

  return new Response(
    JSON.stringify({
      error: rateLimited ? UPSTREAM_RATE_LIMIT_MESSAGE : fallbackMessage,
    }),
    {
      status: rateLimited ? 429 : 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}
