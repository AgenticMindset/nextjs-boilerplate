# Evals

`npm test` runs these against pure, deterministic logic only (tool result
builders, scoring math, Zod schema contracts, guardrails) - no LLM calls,
so the suite is free, fast, and safe to run in CI without touching the
shared Groq account.

Deliberately out of scope: live checks against the `generateObject` /
`streamText` routes themselves (wargame, negotiator, problem solver,
tokenomics stress test, voice coach, tech stack advisor). Groq's 8,000
TPM cap on this account is shared across every agent on the site (see
`lib/wargame/retrieval.ts` and `lib/agent/tools.ts`), and an automated
suite that fires real completions on every run would compete with actual
site traffic for that budget. If you need to verify a prompt or schema
change against the real model, do it manually with a couple of live
requests rather than adding it here.
