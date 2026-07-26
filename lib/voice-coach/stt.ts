import type { TranscriptionResult } from "./types";

/**
 * Small seam so the transcription backend can be swapped without touching
 * any caller. Default implementation below calls our own API route, which
 * uses Groq-hosted Whisper large-v3-turbo (open source model).
 */
export interface SpeechToText {
  transcribe(audio: Blob, durationSec: number): Promise<TranscriptionResult>;
}

export class GroqWhisperSTT implements SpeechToText {
  async transcribe(audio: Blob, durationSec: number): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append("audio", audio, "utterance.webm");

    const response = await fetch("/api/voice-coach/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Transcription failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text ?? "",
      words: data.words ?? null,
      avgLogprob: data.avgLogprob ?? null,
      durationSec,
    };
  }
}

/**
 * Alternative backend using the browser's built-in Web Speech API.
 * Kept here (unused by default) to demonstrate the interface is swappable
 * without a server round trip. No word-level timings or confidence scores
 * are available from this API, so those fields are always null.
 */
interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: unknown;
  webkitSpeechRecognition?: unknown;
}

export class BrowserSpeechToText implements SpeechToText {
  async transcribe(audio: Blob, durationSec: number): Promise<TranscriptionResult> {
    const win = window as WindowWithSpeechRecognition;
    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      throw new Error("Web Speech API is not supported in this browser.");
    }
    // Browser SpeechRecognition listens live rather than accepting a Blob;
    // real usage of this backend would restructure capture to call
    // recognition.start()/stop() directly instead of recording a Blob first.
    void audio;
    return { text: "", words: null, avgLogprob: null, durationSec };
  }
}
