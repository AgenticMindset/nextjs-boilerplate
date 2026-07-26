/**
 * Small seam so the speech synthesis backend can be swapped (e.g. for
 * ElevenLabs) without touching any caller. Default implementation uses the
 * browser's built-in SpeechSynthesis API.
 *
 * The browser API does not expose the synthesized audio stream, so there is
 * no real amplitude signal to analyze during playback. `onAmplitude` is fed
 * an approximate pulse derived from word-boundary events instead of true
 * signal energy - this is documented as an approximation, never presented
 * as a measured value.
 */
export interface TextToSpeech {
  speak(text: string, onAmplitude?: (amplitude: number) => void): Promise<void>;
  cancel(): void;
}

// Ordered by how well they read as a grown-up, expressive female voice.
// Neural/"Online (Natural)" voices (Aria, Jenny) sound the most energised;
// the rest are common built-in fallbacks across Windows, macOS, and Chrome.
const VOICE_NAME_PREFERENCE = [
  /aria/i,
  /jenny/i,
  /samantha/i,
  /zira/i,
  /victoria/i,
  /karen/i,
  /moira/i,
  /tessa/i,
  /susan/i,
  /allison/i,
  /female/i,
];

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = english.length > 0 ? english : voices;
  for (const pattern of VOICE_NAME_PREFERENCE) {
    const match = pool.find((v) => pattern.test(v.name));
    if (match) return match;
  }
  return pool[0] ?? voices[0] ?? null;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    const handleVoicesChanged = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    // Some browsers never fire voiceschanged if voices were already ready.
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

const BASE_RATE = 1.7;
const BASE_PITCH = 1.15;
// Natural breathing gap after a sentence vs. a shorter beat after a comma -
// real speech isn't a flat monotone stream, it has rhythm.
const SENTENCE_PAUSE_MS = 260;
const CLAUSE_PAUSE_MS = 110;

// Splits on sentence boundaries first, then commas within long sentences,
// so each chunk is spoken as its own utterance with a pause after it.
function splitIntoSpeechChunks(text: string): { text: string; pauseAfterMs: number }[] {
  const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) ?? [text];
  const chunks: { text: string; pauseAfterMs: number }[] = [];

  for (const rawSentence of sentences) {
    const sentence = rawSentence.trim();
    if (!sentence) continue;
    const clauses = sentence.split(/(?<=,)\s+/).map((c) => c.trim()).filter(Boolean);
    clauses.forEach((clause, i) => {
      const isLastClause = i === clauses.length - 1;
      chunks.push({ text: clause, pauseAfterMs: isLastClause ? SENTENCE_PAUSE_MS : CLAUSE_PAUSE_MS });
    });
  }
  return chunks;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class BrowserSpeechSynthesisTTS implements TextToSpeech {
  private utterance: SpeechSynthesisUtterance | null = null;
  private voicePromise: Promise<SpeechSynthesisVoice | null> | null = null;
  private cancelRequested = false;

  private getVoice(): Promise<SpeechSynthesisVoice | null> {
    if (!this.voicePromise) {
      this.voicePromise = loadVoices().then(pickVoice);
    }
    return this.voicePromise;
  }

  private speakChunk(
    text: string,
    voice: SpeechSynthesisVoice | null,
    onAmplitude?: (amplitude: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      // Small per-chunk jitter so consecutive sentences don't sound like a
      // robotic loop at one fixed pitch/rate - real speech varies slightly.
      utterance.pitch = BASE_PITCH + (Math.random() - 0.5) * 0.08;
      utterance.rate = BASE_RATE + (Math.random() - 0.5) * 0.1;
      utterance.volume = 1;
      if (voice) utterance.voice = voice;
      this.utterance = utterance;

      let pulseTimer: ReturnType<typeof setInterval> | null = null;

      utterance.onstart = () => {
        if (onAmplitude) {
          let phase = 0;
          pulseTimer = setInterval(() => {
            phase += 1;
            onAmplitude(0.35 + 0.25 * Math.abs(Math.sin(phase * 0.6)));
          }, 80);
        }
      };
      utterance.onboundary = () => {
        onAmplitude?.(0.7);
      };
      utterance.onend = () => {
        if (pulseTimer) clearInterval(pulseTimer);
        this.utterance = null;
        resolve();
      };
      utterance.onerror = (event) => {
        if (pulseTimer) clearInterval(pulseTimer);
        this.utterance = null;
        if (this.cancelRequested || event.error === "interrupted" || event.error === "canceled") {
          resolve();
          return;
        }
        reject(new Error(event.error || "Speech synthesis failed."));
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  async speak(text: string, onAmplitude?: (amplitude: number) => void): Promise<void> {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      throw new Error("Speech synthesis is not supported in this browser.");
    }
    window.speechSynthesis.cancel();
    this.cancelRequested = false;

    const voice = await this.getVoice();
    const chunks = splitIntoSpeechChunks(text);

    for (let i = 0; i < chunks.length; i++) {
      if (this.cancelRequested) break;
      await this.speakChunk(chunks[i].text, voice, onAmplitude);
      if (this.cancelRequested) break;
      if (i < chunks.length - 1) await wait(chunks[i].pauseAfterMs);
    }
    onAmplitude?.(0);
  }

  cancel(): void {
    this.cancelRequested = true;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.utterance = null;
  }
}
