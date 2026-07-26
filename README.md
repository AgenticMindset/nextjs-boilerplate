This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Voice Communication Coach

A voice-only agent at `/agents/voice-coach`. Pick a suggested topic, talk
about it like you would to a person, and receive spoken plus written
feedback on how you communicated. Like ChatGPT's voice mode, it's adaptive
rather than a fixed number of stops: you speak once, and the coach only asks
a follow-up (up to two, one at a time) if it still needs more material to
reliably assess your delivery, content, and articulation.

### Running it

1. Add the env vars below to `.env.local`.
2. `npm run dev` and open `/agents/voice-coach`.
3. Allow microphone access when prompted. Requires a browser with
   `MediaRecorder`, `getUserMedia`, and `AudioContext` support (recent
   Chrome, Edge, or Safari).

### Required env vars

| Var | Purpose |
| --- | --- |
| `GROQ_API_KEY` | Speech-to-text (Whisper large-v3-turbo) and conversation/feedback (GPT-OSS 120B), both hosted on Groq |
| `REPLICATE_API_TOKEN` | Text-to-speech (Kokoro-82M, open source, hosted on Replicate) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limiting on the voice-coach API routes (shared with the other agent demos) |

### Architecture

Each stage is isolated behind a small interface so the backend can be swapped
without touching callers:

- **Capture** - `lib/voice-coach/audio.ts`: `MediaRecorder` for the full
  clip, an `AnalyserNode` for live amplitude during "listening" and
  "speaking", and post-hoc pitch/energy analysis via autocorrelation over
  the decoded `AudioBuffer`. Nothing here blocks the main thread - live
  monitoring runs off `requestAnimationFrame`.
- **Transcribe** - `lib/voice-coach/stt.ts` exports a `SpeechToText`
  interface. The default `GroqWhisperSTT` implementation posts the recorded
  clip to `app/api/voice-coach/transcribe/route.ts`, which calls Groq-hosted
  Whisper large-v3-turbo with word-level timestamps. Swap providers by
  implementing `SpeechToText` and passing a different instance into
  `VoiceSession`.
- **Converse** - `app/api/voice-coach/converse/route.ts` calls the
  open-source GPT-OSS 120B model hosted on Groq via `@ai-sdk/groq`'s
  `streamText` (same provider/model used by the other agent demos on this
  site). The persona/system prompt is one editable constant: `SYSTEM_PROMPT`
  in `lib/voice-coach/prompts.ts`. Swap models by changing the `groq(...)`
  call, or swap providers entirely by replacing `createGroq` with another
  Vercel AI SDK provider.
- **Speak** - `lib/voice-coach/tts.ts` exports a `TextToSpeech` interface.
  The default `ReplicateKokoroTTS` implementation posts the reply text to
  `app/api/voice-coach/speak/route.ts`, which calls Kokoro-82M (Apache-2.0,
  hexgrad/Kokoro-82M) hosted on Replicate and returns real synthesized
  audio. That audio is played through a Web Audio `AudioBufferSourceNode`
  routed through an `AnalyserNode`, so the orb's "speaking" animation reacts
  to genuine signal amplitude, not an approximation. A zero-dependency
  `BrowserSpeechSynthesisTTS` fallback (browser `SpeechSynthesis`, no server
  round trip) is kept in the same file to demonstrate the interface is
  swappable - to use it instead, or to swap in ElevenLabs or another
  provider, implement `TextToSpeech` and change the instance constructed in
  `VoiceSession`.
- **Measure** - `lib/voice-coach/metrics.ts` computes pace (WPM), pause
  pattern, filler-word rate, pitch variation, energy, and an articulation
  approximation for each utterance from the actual audio and transcript.
  Any metric that can't be reliably computed (e.g. pitch on a too-short
  clip) is returned as `null` and the feedback report is instructed to omit
  it rather than invent a value - see `app/api/voice-coach/feedback/route.ts`
  and the schema in `lib/voice-coach/schema.ts`. `hasSufficientSample()` in
  the same file decides, after each utterance, whether the aggregate sample
  (total words, total duration, at least one usable pitch reading) is
  enough for a reliable assessment; if not, and the two-follow-up budget
  isn't spent, the conversation route asks for more instead of wrapping up.

The reactive orb (`app/components/voice-coach/VoiceOrb.tsx`) is a
`react-three-fiber` scene: a shader-displaced icosahedron core plus an
instanced particle layer, both driven by the same simplex-noise field. It
degrades to a static CSS gradient circle if WebGL2 isn't available.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
