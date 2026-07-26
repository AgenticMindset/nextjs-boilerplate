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