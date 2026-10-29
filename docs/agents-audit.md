# Site audit & improvement plan — focus: `/agents`

Audited 2026-10-29 against the working tree on `main` (Next 16.2.4, React 19.2.4, Tailwind 4,
Turbopack). Everything proposed here stays on free tiers and open-source tooling — no new paid
services, no new runtime dependencies except optionally `schema-dts` (types only, zero runtime).

Measured baseline:

> **Phases 1-4 are complete** (see the status column). `/agents` eager JS is **632 KB**, down
> from 1,379 KB. The index is a Server Component driven by a registry, every agent has its own
> route, `<h1>`, metadata, honest-limits note and distinctive stack, the engineering behind them
> is visible on the page, and the whole tab is now keyboard-operable with reduced-motion and
> screen-reader support. ESLint is down from 43 errors to 19. Phases 5-6 are unstarted.

| Signal | Value | Status |
| --- | --- | --- |
| JS referenced by `/agents` HTML | **1,379 KB uncompressed across 17 chunks** | fixed - now 636 KB / 9 chunks |
| Of which Mermaid + its Langium/vscode-languageserver tree | **~600 KB eagerly, ~570 KB more prefetched** | fixed - absent from initial payload |
| `three.js` chunk (voice-coach route) | 892 KB, eagerly imported by `VoiceSession` | fixed - loads after mount |
| ESLint | **43 errors, 16 warnings** | 19 errors - rest are Phase 6 |
| `tsc --noEmit` | clean | still clean |
| `<h1>` elements on `/agents` | **7** | fixed - 1 per page, 7 `<h2>` on the index |
| `aria-*` / `role` attributes in all agent UI | **0** | fixed - chat, orb, dropdown, errors |
| `:focus-visible` rules in `globals.css` | **0** | fixed - global ring |
| `prefers-reduced-motion` blocks | **0** | fixed - CSS plus the WebGL loop |
| Per-route `metadata` outside `/blog` | **none** | fixed for all 8 agent routes; `/` and `/career` are Phase 5 |
| `sitemap.ts` / `robots.ts` | missing | Phase 5 |
| `metadataBase` | missing (build warns; OG images resolve to `localhost:3000`) | Phase 5 |
| `public/` weight | ~46 MB, incl. `hero-bg.jpg` 7.7 MB, `steps-bg.jpg` 6.1 MB, `alvaro.png` 5.0 MB | Phase 6 |

---

## 1. Findings — `/agents` (the priority)

### 1.1 Performance

**P1 — Mermaid is in the critical path of `/agents`.** `DiagramRenderer` statically imports
`mermaid`, `ChatInterface` statically imports `DiagramRenderer`, and `app/agents/page.tsx`
statically imports `ChatInterface`. Mermaid drags in Langium + `vscode-languageserver-protocol`
(~600 KB of the 1,379 KB eager payload, plus a 571 KB sibling chunk). Every visitor pays for it
even though a diagram only appears after a full 5-step tool conversation. `next/dynamic` with
`ssr: false`, rendered only when a `generate_diagram` tool result exists, removes it from first
load entirely. Expected: **~1.38 MB → ~0.45 MB** eager JS on `/agents`.

**P1 — `mermaid.initialize()` runs at module scope**, so importing the module has a side effect
before any diagram is requested. It belongs inside the render effect (and with
`securityLevel: "strict"`, see 1.4).

**P2 — the whole agents index is one client-heavy page.** `ChatInterface` (802 lines) is mounted
on page load for all six agents' worth of marketing copy. Once Mermaid is split out the remaining
win is to also defer `ChatInterface` until the Tech Stack Advisor section is scrolled into view
or clicked.

**P2 — `three.js` loads before the user opts in.** `VoiceSession` statically imports `VoiceOrb`,
pulling the 892 KB three/fiber/drei chunk on route entry. Deferring `VoiceOrb` behind
`next/dynamic` with a lightweight CSS placeholder means `/agents/voice-coach` becomes openable on
a phone.

**P2 — `agents-bg.jpg` (406 KB) is `priority` + `fill`** with no `placeholder="blur"`. It is the
LCP element and it has no low-quality stand-in. Convert to AVIF/WebP and add a blur placeholder.

**P3 — no `next.config.ts` image/compression config at all.** No `formats`, no
`deviceSizes` tuning, no long-term `Cache-Control` headers for `/_next/static`.

### 1.2 Markup correctness, SEO & structure

**P1 — seven `<h1>` elements on one page.** Each agent block uses `work-header__title` as `<h1>`.
Correct structure is one page `<h1>` ("AI Agents") with each agent as `<h2>`. This currently
costs real search ranking and makes the page unparseable to a screen reader's heading list.

**P1 — invalid HTML: `<ul>` nested inside `<p>`** in the Tokenomics, Problem Solver and StyleAI
blocks (`app/agents/page.tsx:182`, `:425`, `:472`). The browser auto-closes the `<p>`, so the
trailing prose ends up as a stray text node outside any paragraph — this is why spacing in those
three blocks looks different from the others.

**P1 — nested `<main>`.** `app/layout.tsx` renders `<main>{children}</main>`, and every agent
sub-page (`negotiator`, `wargame`, `voice-coach`, `problem-solver`, `tokenomics`) renders its own
`<main>`. Two `main` landmarks is an accessibility failure and invalid.

**P1 — no `metadata` on `/agents` or any sub-page.** All six agent pages share the root title
"Álvaro Tomás" / "Professional Portfolio". Every agent deserves its own title, description and
OG image. Because all five sub-pages are `"use client"` at the page level, they *cannot* export
metadata — this requires the refactor in 1.3.

**P1 — `metadataBase` unset**, so OG/Twitter images resolve against `http://localhost:3000`.
Link previews are broken on LinkedIn/X/Slack right now.

**P2 — no `sitemap.ts`, no `robots.ts`, no JSON-LD.** For a portfolio whose point is discovery,
`SoftwareApplication` structured data per agent plus a `Person` graph on the home page is cheap
and high-leverage.

**P3 — `<a href="/agents">` instead of `<Link>`** on all back-links and all six "Launch" buttons.
Every navigation is a full document reload; the client-side router and its prefetching are
bypassed.

**P3 — nav mystery link.** `app/components/Navigation.tsx:21` renders a `<Link>` whose only child
is `<span style={{opacity: 0}}>.</span>` — an invisible, unlabelled link to `/`. Either give it a
real label (visually hidden text) or remove it.

### 1.3 Code quality

**P1 — 43 ESLint errors**, concentrated in the agents tree:

- `no-var`: 36 errors across `app/agents/negotiator/page.tsx` (24 of them) and four negotiator /
  wargame components. ES3-style `var` in React 19 code; `--fix` handles it mechanically.
- `no-explicit-any`: 5 errors in `ChatInterface.tsx` (`result: any`, `[string, any]`). Tool
  results already have Zod schemas in `lib/agent/tools.ts` — infer the types from them with
  `z.infer` instead of `any`, which also makes the render functions self-checking.
- `react/no-unescaped-entities` at `app/agents/page.tsx:440`.
- `prefer-const` in `lib/agent/tools.ts:407`, unused vars in `lib/agent/tools.ts:211`,
  `lib/tokenomics/prompts.ts:5`, `app/api/negotiate/route.ts:10`.

A `lint` gate should be wired into the build so this cannot regress.

**P1 — the design system is bypassed.** `globals.css` has 946 lines of tokens and BEM classes,
but the five agent sub-pages hardcode `background: "#0a0a0a"`, `color: "#888"`,
`fontFamily: "'Inter', sans-serif"` (re-declaring a font the layout already loads via
`next/font`), `padding: "80px 20px 40px"` as inline objects. `ChatInterface` carries its own
~200-line `styles` object; `DiagramRenderer` another. Consequences: no responsive breakpoints, no
hover/focus states, no dark/light consistency, and nothing is reusable.

**P1 — the same header is copy-pasted five times.** Back-link + gradient/accent `<h1>` + muted
subtitle + red error box is duplicated verbatim across all five sub-pages, with small
inconsistencies (negotiator uses flat accent, voice-coach uses a gradient clip; `marginBottom` 10
vs 30). One `<AgentShell>` component removes ~250 lines and makes the five pages look like one
product.

**P2 — `app/agents/page.tsx` is 502 lines of repeated JSX.** Six near-identical blocks (header →
metrics → launch CTA → "Built with" card → divider) differing only in strings. This belongs in a
data file (`lib/agents/registry.ts`) rendered by one `<AgentCard>` component. That single change
is what makes everything else in this plan cheap: new agents become a 15-line data entry,
metadata generates itself, and the sitemap and JSON-LD derive from the same source.

**P2 — inline-style soup defeats CSS extraction.** Styles shipped as JS objects can't be
cached, minified as CSS, or deduped. Moving the agent chrome to `globals.css` (or Tailwind 4
utilities, already installed) shrinks the JS and speeds up paint.

**P2 — `setTimeout(..., 0)` + synthetic event hack** in `ChatInterface.handleQuickReply` /
`handleClarifySend` to work around `useChat`'s `input` state. Fragile. The AI SDK supports
submitting a message directly; use that path.

**P3 — inline `<style>` tag injected in JSX** for `@keyframes wargamePulse`
(`app/agents/wargame/page.tsx`). Belongs in `globals.css`.

**P3 — `var MAX_ROUNDS = 6`** in the negotiator page duplicates server-side knowledge; it should
come from `lib/negotiator/`.

### 1.4 Accessibility

**P1 — zero `aria-*` or `role` attributes in the entire agents UI**, including the chat (which
needs `role="log"` + `aria-live="polite"` on the message area so new agent turns are announced),
the loading states, and the voice-coach orb (a canvas with no text alternative).

**P1 — no focus styles anywhere.** `globals.css` contains no `:focus-visible` rule, so keyboard
users cannot see where they are on a page built almost entirely of buttons, dropdowns and
launch CTAs.

**P1 — no `prefers-reduced-motion` support**, despite `animate-in` entrance animations on every
block, a pulsing wargame loader, and a continuously animating WebGL orb. This is a vestibular
accessibility issue and a battery issue.

**P2 — decorative background `<Image alt="">`** is correct, but `agents-bg.jpg` sits behind text
at `rgba(10,10,10,0.75)` overlay in the mid-band. Worth verifying contrast ≥ 4.5:1 for
`--color-text-secondary` over the lightest part of that photo.

**P2 — YouTube iframe** has a `title` (good) but no `loading="lazy"`, so the StyleAI embed
competes with the agents above it.

**P3 — `SearchableDropdown`** is a hand-rolled combobox with no `role="combobox"`,
`aria-expanded`, `aria-activedescendant` or arrow-key handling.

### 1.5 Content & positioning

The copy is substantive and technically honest — that's the strongest thing about this tab. What
holds it back is **framing, not prose**:

**P1 — no index.** Six agents arrive as one 502-line vertical scroll with no overview. A visitor
cannot see at a glance what exists. The tab needs a top-of-page `<h1>` + a one-paragraph thesis +
a grid of six cards; the long-form blocks move below or onto their own pages.

**P1 — mixed grammar and leftovers.** "Select a token and a stress scenario, and this agent: "
(trailing colon + space, then a list, then an orphaned paragraph). `work-header__greeting` says
"AI Agent Demo" on only one of six blocks. "Enjoy it!" sits oddly against otherwise precise
engineering copy.

**P2 — the ordering buries the best work.** The Voice Coach (open-source Whisper + Kokoro + a
custom GLSL orb) is fifth. The Negotiation Simulator leads. Put the most visually striking and
most technically distinctive first, and make the ordering data-driven so it's one line to change.

**P2 — six identical "Built with" cards, five of which repeat "Next.js 16 / GPT-OSS 120B /
Vercel AI SDK / Zod".** Repeated five times it reads as padding. Factor the shared stack into one
site-level "how everything here is built" statement and let each card list only what is
*distinctive* (Pinecone + Tavily, Kokoro + react-three-fiber, Recharts).

**P2 — the engineering is invisible.** `lib/guardrails.ts`, `lib/telemetry.ts`,
`lib/rate-limit.ts`, the versioned prompts (`// PROMPT VERSION: v2`), the `evals/` directory and
the Zod-validated structured outputs are exactly what a hiring manager or client wants to see —
and none of it is mentioned on the page. A short "how these are engineered" section (guardrails,
prompt versioning, evals, tracing, rate limiting, honest confidence reporting) would differentiate
this from every other "I built an AI demo" portfolio.

**P2 — no per-agent "what to expect".** Latency ("10–20 s") appears only inside the wargame
loader. State it up front on each card, along with "free tier, shared rate limit" so a 429 reads
as a documented constraint rather than a broken demo.

**P3 — no empty/error states on the index**, no "this demo is live and costs me nothing because
it runs on free tiers" note — which is itself a selling point worth stating.

**P3 — the apostrophe in "the brand's identity"** (`app/agents/page.tsx:440`) is a raw `'` while
the rest of the file uses `&apos;`.

---

## 2. Findings — rest of the site

**P1 — `public/` is ~46 MB.** `hero-bg.jpg` 7.7 MB, `steps-bg.jpg` 6.1 MB, `alvaro.png` 5.0 MB,
`sf2-bg.jpg` 4.3 MB, `work-bg.jpg` 4.9 MB. `next/image` optimizes delivery, but on Vercel's free
tier every one of these also burns source-image transformation budget, and the repo is heavy to
clone. Re-encode to AVIF/WebP at sensible dimensions (expect 90 %+ reduction) and delete the
unused ones — several (`ams2`, `ams3`, `sf2`, `sf3`, `wall2`, `next.svg`, `vercel.svg`,
`file.svg`, `globe.svg`, `window.svg`) look unreferenced.

**P2 — 14 blog images use raw `<img>`** (16 ESLint warnings), so they are unoptimized and
layout-shifting.

**P2 — no `/career` metadata, no home-page metadata**, no OG image generation. Next 16's
`opengraph-image.tsx` can generate per-page OG cards at build time for free.

**P2 — `app/career/page.tsx` has an uncommitted edit** changing "Sept 2025 — Present" to
"September 2025 — October 2026 " (note the trailing space, and that an end-dated co-founder role
reads as departed — confirm that's intended).

**P3 — `next.config.ts` is empty**, no security headers (`X-Content-Type-Options`,
`Referrer-Policy`, a CSP). Free to add.

**P3 — `.footer` / `.footer__text` styles exist in `globals.css` but no footer is rendered.**

**P3 — no `app/not-found.tsx`** styled to match the site.

**P3 — `evals/` and `vitest` exist but no CI.** A free GitHub Actions workflow running
`tsc --noEmit`, `eslint`, `vitest run` on push would lock in the cleanups below.

---

## 3. Plan

Six phases. Phases 1–3 are the ones that change how the agents tab looks and feels; 4–6 are
hardening. Each phase is independently shippable and leaves the site working.

### Phase 1 — Performance (highest ratio, lowest risk) — DONE

Result: `/agents` **1,379 KB → 636 KB** eager JS (-54%), 17 chunks → 9. Mermaid, Langium and
three.js confirmed absent from the initial payload on both `/agents` and `/agents/voice-coach`
by scanning the built chunks. Also fixed in this phase, because it turned out to be a
performance bug rather than only a markup one: the `<ul>`-inside-`<p>` nesting was throwing
`Hydration failed because the server rendered HTML didn't match the client`, which discarded and
regenerated the whole client tree on every single page load.

Verified in the browser: diagrams still render through the lazy Mermaid path, the WebGL orb still
paints, the chat mounts on scroll, `tsc` is clean and all 26 tests pass.

1. `app/agents/components/DiagramRenderer.tsx`: move `mermaid` to a dynamic `await import()`
   inside the render effect; move `mermaid.initialize` into that effect with
   `securityLevel: "strict"`; render the raw Mermaid source in a `<pre>` until the library lands.
2. `ChatInterface.tsx`: load `DiagramRenderer` via
   `dynamic(() => import("./DiagramRenderer"), { ssr: false })`.
3. `app/agents/page.tsx`: load `ChatInterface` via `next/dynamic` behind an
   `IntersectionObserver`/click gate so it's fetched when the section is approached.
4. `app/components/voice-coach/VoiceSession.tsx`: `VoiceOrb` via `next/dynamic`,
   `ssr: false`, with a CSS-only orb placeholder.
5. `next.config.ts`: `images.formats = ["image/avif", "image/webp"]`, and
   `loading="lazy"` on the YouTube iframe.
6. Re-encode `agents-bg.jpg` to AVIF + WebP and add `placeholder="blur"`.

**Target: `/agents` eager JS 1,379 KB → under 500 KB; `/agents/voice-coach` first load under
400 KB until the user taps the orb.** Verify by re-running the chunk measurement in this
document's baseline table.

### Phase 2 — Restructure the agents tab (the "looks professional" phase) — DONE

Result: `app/agents/page.tsx` went from **502 lines to 46**, and the changed files lost 1,166
lines against 146 added. The tab is now an index of seven cards over a registry, with each agent
on its own route behind a shared shell.

Corrections made while doing the work:

- There are **seven** entries, not six: six live agents plus the StyleAI client video. The audit
  undercounted.
- The Tech Stack Advisor and StyleAI had no routes of their own - one was an inline chat, the
  other an inline video. Both now have real pages (`/agents/tech-stack`, `/agents/styleai`), so
  all seven agents are uniform and every card links somewhere.
- The entrance animation declared `opacity: 0` on the delayed variants *outside* the keyframes,
  so anything that stopped the animation from attaching left the content permanently invisible
  rather than merely un-animated. Switched to `animation-fill-mode: both`, which holds the same
  states from inside the animation.

1. **`lib/agents/registry.ts`** — one typed array, the single source of truth per agent:
   `slug`, `name`, `tagline`, `thesis`, `highlights[]`, `distinctiveStack[]`, `expectedLatency`,
   `status`, `heroKind` (`"launch" | "inline-chat" | "video"`), `order`, `metaDescription`.
2. **`app/components/agents/AgentCard.tsx`** — renders one registry entry. Fixes the invalid
   `<ul>`-in-`<p>` nesting once, for all six.
3. **Rewrite `app/agents/page.tsx` as a Server Component**: one `<h1>` ("AI Agents") + thesis
   paragraph + a responsive card grid mapped from the registry; every agent heading becomes
   `<h2>`. Expect ~502 lines → ~80.
4. **`app/components/agents/AgentShell.tsx`** — the shared sub-page chrome (back `<Link>`,
   title, subtitle, error banner, loading state), using `globals.css` classes, no `<main>`
   (the layout already provides it).
5. **Split each sub-page**: a thin Server Component `page.tsx` that exports `metadata` and
   renders `<AgentShell>`, wrapping a `"use client"` child that holds the state. This is what
   unlocks per-agent titles, descriptions and OG images.
6. **Move all agent styling into `globals.css`** (or Tailwind utilities): `.agent-page`,
   `.agent-page__header`, `.agent-error`, `.agent-card`, `.agent-grid`, `.chat-*`,
   `@keyframes wargamePulse`. Delete the inline `styles` objects from `ChatInterface` and
   `DiagramRenderer`.
7. Replace every `<a href="/agents...">` with `<Link>`; fix or label the invisible nav link.

### Phase 3 — Content & positioning — DONE

Every agent's copy now follows one shape: tagline, intro, 2-3 highlights, and a **"What to
expect"** paragraph stating latency, cost constraints and where the answer stops being
trustworthy. The trailing colons, orphaned paragraphs, "Enjoy it!", the raw apostrophe and the
one-off "AI Agent Demo" eyebrow are gone; the only eyebrow left is StyleAI's "Client work",
which earns it.

The seven duplicated "Built with" cards are now one site-level **Shared foundation** block plus a
per-agent `distinctiveStack`. StyleAI carries `usesSharedStack: false`, since it is a client
system that shares none of it.

New **"How these are engineered"** section on the index, surfacing seven practices that already
existed in the repo but were invisible: Zod-validated structured output, versioned prompts, the
shared input guardrails, per-call tracing, per-agent rate limiting (40/hour/IP), the deterministic
eval suite, and honest uncertainty. Each claim was checked against the source before being
written. Closes with a note framing the free-tier constraint as a design choice.

**Deviation from the plan:** the plan said to link each claim to its file on GitHub. The
repository is private, so those links would 404 for every visitor; the claims are stated without
links instead. `lib/agents/engineering.ts` carries a note to add a `source` field if the repo is
ever made public.

1. Write the `/agents` opening: one `<h1>`, one paragraph of thesis ("six working agents, all on
   open-source models and free infrastructure, each one built to be inspected not just demoed").
2. Reorder via `registry.order`: Voice Coach and Wargame first.
3. Normalize every agent's copy to one shape: one-line tagline → 2–3 `highlights` → one line of
   honest limits (latency, shared rate limit, what it does *not* do). Fix the trailing colons,
   the orphaned paragraphs, "Enjoy it!", the raw apostrophe, and the one-off "AI Agent Demo"
   eyebrow.
4. Collapse the six "Built with" cards: one site-level "Shared foundation" block (Next 16, Groq
   GPT-OSS 120B, Vercel AI SDK, Zod, Upstash) plus per-card `distinctiveStack` chips only.
5. **New "How these are engineered" section** surfacing what already exists in the repo but is
   invisible on the page: Zod-validated structured outputs, prompt versioning, prompt-injection
   guardrails (`lib/guardrails.ts`), OTel tracing (`lib/telemetry.ts`), per-IP rate limiting,
   the `evals/` suite, and the wargame's honest-confidence reporting. Link each claim to the
   file on GitHub.
6. Add a short "runs entirely on free tiers" note — it's a credibility asset, not an apology.

### Phase 4 — Accessibility — DONE

The worst finding was not in the original audit list: **`SearchableDropdown`'s options were plain
`<div onClick>`**, so the entire wargame setup panel - four dropdowns, the only way to configure
that agent - could not be operated without a mouse at all. Rewritten to the ARIA listbox pattern
and verified end to end by driving it with the keyboard: arrow keys move the highlight, Enter
selects, Escape closes, and focus returns to the trigger.

Also done: a global `:focus-visible` ring (there was no focus rule anywhere on the site), a
reduced-motion block that resolves entrance animations to their finished state rather than
removing them, `role="log"` + `aria-live` on the chat transcript, a per-state `role="img"` label
on the voice orb, live captions, and `role="alert"` on error boxes.

`prefers-reduced-motion` needed JavaScript as well as CSS: no stylesheet can stop
`requestAnimationFrame`, so `VoiceOrb` reads the preference through a `useSyncExternalStore` hook
and switches its Canvas to `frameloop="demand"`.

**Contrast was checked, not assumed.** The audit flagged the hero overlay as "worth verifying";
sampling the photo's luminance per band against the overlay gradient gives **13.85:1** for body
text and **6.07:1** for tertiary text at the lightest band, both well past 4.5:1. No change made.

1. `globals.css`: a global `:focus-visible` ring using the accent token; a
   `@media (prefers-reduced-motion: reduce)` block that disables `animate-in`, the wargame
   pulse, and (via a prop into `VoiceOrb`) freezes the orb to a static state.
2. `ChatInterface`: `role="log"` + `aria-live="polite"` on the message area, `aria-busy` while
   streaming, labelled textarea, `aria-pressed` on the clarify toggles.
3. `VoiceOrb`: `role="img"` + `aria-label` describing the current state; the control button gets
   an explicit label rather than relying on the orb.
4. `SearchableDropdown`: proper combobox semantics + arrow-key/Escape handling.
5. Verify text contrast over the mid-band of `agents-bg.jpg`; darken the overlay if short of
   4.5:1.
6. Keyboard-walk all six agents end to end.

### Phase 5 — SEO & discoverability

1. `metadataBase` in `app/layout.tsx` (kills the build warning, fixes every link preview).
2. `metadata` on `/`, `/career`, `/agents` and all six agent pages, generated from the registry.
3. `app/sitemap.ts` and `app/robots.ts`, with agent routes derived from the registry and blog
   routes from `lib/articles.ts`.
4. `opengraph-image.tsx` for `/agents` and per agent, generated at build time with Next's
   `ImageResponse` — free, no design tool needed.
5. JSON-LD: `Person` on the home page, `SoftwareApplication` per agent, `BlogPosting` per
   article.

### Phase 6 — Code hygiene & guardrails against regression

1. `npx eslint . --fix` (clears the 36 `no-var` + `prefer-const`), then fix the rest by hand:
   type `ChatInterface`'s tool results from the Zod schemas in `lib/agent/tools.ts` via
   `z.infer`, escape the apostrophe, delete the unused imports.
2. Replace the `setTimeout(0)` + synthetic-event submit hack with the AI SDK's direct
   append/submit API.
3. Re-encode and prune `public/` (target under 5 MB); convert the 14 blog `<img>` to
   `next/image`.
4. `next.config.ts`: security headers.
5. `app/not-found.tsx` styled to match; render the already-styled footer.
6. GitHub Actions workflow (free for public repos): `tsc --noEmit`, `eslint`, `vitest run`.

---

## 4. Suggested sequencing

| Order | Phase | Why here |
| --- | --- | --- |
| 1 | Phase 1 (perf) | Pure win, no visual risk, biggest single number |
| 2 | Phase 6.1 (lint `--fix`) | Clean tree before any refactor |
| 3 | Phase 2 (restructure) | Everything else keys off the registry |
| 4 | Phase 3 (content) | Cheap once the registry exists |
| 5 | Phase 5 (SEO) | Generated from the registry, near-free |
| 6 | Phase 4 (a11y) | Needs the final markup to be worth doing once |
| 7 | Phase 6.2–6.6 | Hardening |

## 5. Cost check

Every item above is free and open-source: `next/dynamic`, `next/image`, Next's own
`sitemap`/`robots`/`ImageResponse` metadata conventions, ESLint, Vitest, GitHub Actions (free for
public repos), and local AVIF/WebP re-encoding (e.g. `sharp`, already a Next dependency, or
`libavif`/ImageMagick). The runtime stack stays exactly as it is — Groq's free tier for
GPT-OSS 120B and Whisper, Replicate for Kokoro-82M, Upstash free Redis, Pinecone free index,
Tavily free search, Vercel Hobby. `schema-dts` for JSON-LD types is the only candidate addition
and is a dev-only type package.
