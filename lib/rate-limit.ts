import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "1 h"),
  analytics: true,
  prefix: "agent-ratelimit",
});

export const wargameRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "1 h"),
  analytics: true,
  prefix: "wargame-ratelimit",
});

export const stressTestRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "1 h"),
  analytics: true,
  prefix: "stress-test-ratelimit",
});

export const voiceCoachTranscribeRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "1 h"),
  analytics: true,
  prefix: "voice-coach-transcribe-ratelimit",
});

export const voiceCoachConverseRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "1 h"),
  analytics: true,
  prefix: "voice-coach-converse-ratelimit",
});

export const voiceCoachFeedbackRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "1 h"),
  analytics: true,
  prefix: "voice-coach-feedback-ratelimit",
});

export const voiceCoachSpeakRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "1 h"),
  analytics: true,
  prefix: "voice-coach-speak-ratelimit",
});

export const problemSolverRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "1 h"),
  analytics: true,
  prefix: "problem-solver-ratelimit",
});

/**
 * The verdict every agent route acts on.
 *
 * `degraded` is true when Redis could not be reached at all, so the caller
 * knows the allowance was granted without being counted.
 */
export interface RateLimitVerdict {
  success: boolean;
  reset: number;
  remaining: number;
  degraded: boolean;
}

/**
 * Runs a limiter and FAILS OPEN if Upstash is unreachable.
 *
 * Every agent route calls its limiter before doing anything else, so an
 * unresolvable `*.upstash.io` host (observed intermittently from this
 * machine: `getaddrinfo ENOTFOUND`) used to throw past the route body and
 * surface as a generic 500 on all six agents at once. A rate limiter is a
 * budget guard on a free tier, not a dependency worth taking the whole
 * agents tab down for, so an outage is logged loudly and the request is let
 * through instead.
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  ip: string
): Promise<RateLimitVerdict> {
  try {
    const { success, reset, remaining } = await limiter.limit(ip);
    return { success, reset, remaining, degraded: false };
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "rate_limit_unavailable",
        reason: error instanceof Error ? error.message : String(error),
        ip,
        action: "failed_open",
        ts: new Date().toISOString(),
      })
    );
    return { success: true, reset: Date.now(), remaining: 0, degraded: true };
  }
}
