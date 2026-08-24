// Lightweight input guardrails shared across the agent routes. Not a full
// moderation pipeline - just the cheap, high-value checks: cap free-text
// length before it reaches the model (protects the shared Groq TPM budget
// documented in lib/wargame/retrieval.ts and lib/agent/tools.ts from a
// single oversized paste), and flag - but don't hard-block - text that
// looks like a prompt-injection attempt, since these are low-stakes public
// demos and false positives would just be annoying.

const INJECTION_PATTERNS: RegExp[] = [
  /ignore (all |any |the )?(previous|prior|above|earlier) instructions/i,
  /disregard (all |any |the )?(previous|prior|above|earlier) instructions/i,
  /you are now/i,
  /new system prompt/i,
  /reveal (your |the )?system prompt/i,
  /act as (if you|though you)/i,
  /\bDAN\b/,
];

export function looksLikePromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

// Built from character codes rather than a literal regex so no raw control
// bytes live in this source file. Matches ASCII control characters other
// than newline (10) and tab (9).
const CONTROL_CHAR_CODES = Array.from({ length: 32 }, (_, i) => i).filter(
  (code) => code !== 9 && code !== 10
);
CONTROL_CHAR_CODES.push(127);
const CONTROL_CHAR_PATTERN = new RegExp(
  "[" + CONTROL_CHAR_CODES.map((code) => "\\u" + code.toString(16).padStart(4, "0")).join("") + "]",
  "g"
);

export function sanitizeText(text: string, maxLength: number): string {
  // Strip control characters (except newline/tab) that have no business
  // being in user-facing text and can be used to smuggle formatting tricks.
  const stripped = text.replace(CONTROL_CHAR_PATTERN, "");
  return stripped.length > maxLength ? stripped.slice(0, maxLength) : stripped;
}

export function logIfSuspicious(feature: string, text: string): void {
  if (looksLikePromptInjection(text)) {
    console.warn(
      JSON.stringify({
        event: "guardrail_flag",
        feature,
        reason: "possible_prompt_injection",
        textPreview: text.slice(0, 200),
        ts: new Date().toISOString(),
      })
    );
  }
}
