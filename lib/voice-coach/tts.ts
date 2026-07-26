/**
 * Small seam so the speech synthesis backend can be swapped without
 * touching any caller. Default implementation (`ReplicateKokoroTTS`) calls
 * our own API route, which runs the open-source Kokoro-82M model hosted on
 * Replicate and returns real synthesized audio - `onAmplitude` during
 * playback is genuine signal energy from that audio, not an approximation.
 *
 * `BrowserSpeechSynthesisTTS` is kept below as a zero-dependency fallback
 * that demonstrates the interface is swappable; it does not expose the
 * synthesized audio stream, so its `onAmplitude` is an approximate pulse
 * derived from word-boundary events instead of true signal energy.
 */
export interface TextToSpeech {
  speak(text: string, onAmplitude?: (amplitude: number) => void): Promise<void>;
  cancel(): void;
}

export class ReplicateKokoroTTS implements TextToSpeech {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private rafId: number | null = null;
  private cancelRequested = false;
  // The Replicate account backing this demo throttles accounts under its
  // credit threshold to a burst of 1 prediction with a ~10s token-bucket
  // refill - not just concurrency, sequential calls a couple seconds apart
  // get rejected too. So there's only ever one TTS call per reply (see
  // VoiceSession), but this queue is kept as a safety net in case a second
  // call (e.g. the feedback summary) ever lands close behind the first.
  private requestQueue: Promise<void> = Promise.resolve();

  private ensureContext(): AudioContext {
    if (!this.audioContext) this.audioContext = new AudioContext();
    return this.audioContext;
  }

  // One persistent analyser reused across every utterance, instead of
  // wiring up a new one per sentence and leaving it permanently connected
  // to the output - that leak was piling up dangling audio-graph nodes
  // over the course of a session.
  private ensureAnalyser(audioContext: AudioContext): AnalyserNode {
    if (!this.analyserNode) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.6;
      analyser.connect(audioContext.destination);
      this.analyserNode = analyser;
    }
    return this.analyserNode;
  }

  private fetchAndDecode(text: string): Promise<AudioBuffer> {
    const run = async () => {
      const response = await fetch("/api/voice-coach/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Speech synthesis failed.");
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = this.ensureContext();
      if (audioContext.state === "suspended") await audioContext.resume();
      return audioContext.decodeAudioData(arrayBuffer);
    };

    const result = this.requestQueue.then(run);
    // Advance the queue regardless of whether this request succeeded, so
    // one failure doesn't wedge every request queued behind it.
    this.requestQueue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  }

  async speak(text: string, onAmplitude?: (amplitude: number) => void): Promise<void> {
    this.cancelRequested = false;

    const audioBuffer = await this.fetchAndDecode(text.trim());
    if (this.cancelRequested) {
      onAmplitude?.(0);
      return;
    }

    const audioContext = this.ensureContext();
    const analyser = this.ensureAnalyser(audioContext);
    return new Promise((resolve, reject) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      this.sourceNode = source;

      const dataArray = new Float32Array(analyser.fftSize) as Float32Array<ArrayBuffer>;
      const tick = () => {
        analyser.getFloatTimeDomainData(dataArray);
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) sumSquares += dataArray[i] * dataArray[i];
        const rms = Math.sqrt(sumSquares / dataArray.length);
        onAmplitude?.(Math.min(1, rms * 4));
        this.rafId = requestAnimationFrame(tick);
      };

      source.onended = () => {
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
        this.rafId = null;
        onAmplitude?.(0);
        source.disconnect();
        this.sourceNode = null;
        resolve();
      };

      try {
        source.start();
        this.rafId = requestAnimationFrame(tick);
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Playback failed to start."));
        return;
      }

      if (this.cancelRequested) {
        try {
          source.stop();
        } catch {
          // already stopped
        }
      }
    });
  }

  cancel(): void {
    this.cancelRequested = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch {
        // already stopped
      }
      this.sourceNode = null;
    }
  }
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
