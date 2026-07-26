import {
  computePitchTrack,
  computeRmsWindows,
  mean,
  stddev,
} from "./audio";
import type { TranscriptionResult, UtteranceMetrics, WordTiming } from "./types";

const FILLER_PATTERNS = [
  "um+",
  "uh+",
  "erm+",
  "like",
  "you know",
  "i mean",
  "sort of",
  "kind of",
];

const FILLER_REGEX = new RegExp(
  `\\b(${FILLER_PATTERNS.join("|")})\\b`,
  "gi"
);

const MIN_VOICED_SAMPLE_SEC = 1.5;
const SILENCE_RMS_THRESHOLD = 0.015;
const MIN_PAUSE_MS = 200;

function countWords(transcript: string): number {
  return transcript
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function findFillerWords(transcript: string): string[] {
  const matches = transcript.match(FILLER_REGEX);
  return matches ? matches.map((m) => m.toLowerCase()) : [];
}

/** Pauses derived from STT word timings: gaps between consecutive words. */
function pausesFromWordTimings(words: WordTiming[]): number[] {
  const pauses: number[] = [];
  for (let i = 1; i < words.length; i++) {
    const gapMs = (words[i].start - words[i - 1].end) * 1000;
    if (gapMs >= MIN_PAUSE_MS) pauses.push(gapMs);
  }
  return pauses;
}

/** Fallback pause detection from raw amplitude when no word timings exist. */
function pausesFromSilence(buffer: AudioBuffer): number[] {
  const windows = computeRmsWindows(buffer, 0.05);
  const pauses: number[] = [];
  let silenceStart: number | null = null;
  for (const w of windows) {
    const silent = w.rms < SILENCE_RMS_THRESHOLD;
    if (silent && silenceStart === null) {
      silenceStart = w.startSec;
    } else if (!silent && silenceStart !== null) {
      const durationMs = (w.startSec - silenceStart) * 1000;
      if (durationMs >= MIN_PAUSE_MS) pauses.push(durationMs);
      silenceStart = null;
    }
  }
  return pauses;
}

export function computeUtteranceMetrics(
  transcription: TranscriptionResult,
  audioBuffer: AudioBuffer | null
): UtteranceMetrics {
  const transcript = transcription.text.trim();
  const wordCount = countWords(transcript);
  const durationSec = transcription.durationSec;

  const wordsPerMinute =
    durationSec > 0 && wordCount > 0
      ? Math.round((wordCount / durationSec) * 60)
      : null;

  let pauses: number[] = [];
  if (transcription.words && transcription.words.length > 1) {
    pauses = pausesFromWordTimings(transcription.words);
  } else if (audioBuffer) {
    pauses = pausesFromSilence(audioBuffer);
  }
  const pauseCount = pauses.length > 0 ? pauses.length : audioBuffer || transcription.words ? 0 : null;
  const avgPauseMs = pauses.length > 0 ? Math.round(mean(pauses)!) : null;
  const longestPauseMs = pauses.length > 0 ? Math.round(Math.max(...pauses)) : null;

  const fillerWordsFound = findFillerWords(transcript);
  const fillerWordCount = wordCount > 0 ? fillerWordsFound.length : null;
  const fillerWordRatePer100Words =
    wordCount > 0 ? Math.round((fillerWordsFound.length / wordCount) * 1000) / 10 : null;

  let pitchVariationHz: number | null = null;
  let avgEnergyRms: number | null = null;
  if (audioBuffer && audioBuffer.duration >= MIN_VOICED_SAMPLE_SEC) {
    const pitchTrack = computePitchTrack(audioBuffer);
    if (pitchTrack.length >= 5) {
      pitchVariationHz = Math.round((stddev(pitchTrack) ?? 0) * 10) / 10;
    }
    const rmsWindows = computeRmsWindows(audioBuffer).map((w) => w.rms);
    const avgRms = mean(rmsWindows);
    avgEnergyRms = avgRms !== null ? Math.round(avgRms * 1000) / 1000 : null;
  }

  // Articulation approximation: blend STT confidence (avg logprob -> [0,1])
  // with pace steadiness (lower variance across word-to-word timing = steadier).
  let articulationApprox: number | null = null;
  let sttConfidenceApprox: number | null = null;
  if (transcription.avgLogprob !== null) {
    // avgLogprob is typically in [-1, 0]; map to [0, 1].
    sttConfidenceApprox =
      Math.round(Math.max(0, Math.min(1, 1 + transcription.avgLogprob)) * 100) / 100;
  }
  if (sttConfidenceApprox !== null) {
    let steadiness = 1;
    if (transcription.words && transcription.words.length > 3) {
      const wordDurations = transcription.words.map((w) => w.end - w.start);
      const durationStd = stddev(wordDurations);
      const durationMean = mean(wordDurations);
      if (durationStd !== null && durationMean && durationMean > 0) {
        steadiness = Math.max(0, 1 - durationStd / durationMean);
      }
    }
    articulationApprox =
      Math.round((sttConfidenceApprox * 0.6 + steadiness * 0.4) * 100) / 100;
  }

  return {
    transcript,
    durationSec,
    wordCount,
    wordsPerMinute,
    pauseCount,
    avgPauseMs,
    longestPauseMs,
    fillerWordCount,
    fillerWordRatePer100Words,
    fillerWordsFound,
    pitchVariationHz,
    avgEnergyRms,
    articulationApprox,
    sttConfidenceApprox,
  };
}

// Minimum aggregate signal (across however many utterances have been given
// so far) needed to produce a reliable assessment on every dimension -
// enough words for pace/filler-rate to mean anything, enough total speech
// time, and at least one utterance long enough to have yielded a pitch
// reading. Below this, the conversation asks a follow-up instead of wrapping
// up, so the eventual feedback isn't built on a too-thin sample.
const MIN_TOTAL_WORDS = 60;
const MIN_TOTAL_DURATION_SEC = 25;

export function hasSufficientSample(utterances: UtteranceMetrics[]): boolean {
  if (utterances.length === 0) return false;
  const totalWords = utterances.reduce((sum, u) => sum + u.wordCount, 0);
  const totalDuration = utterances.reduce((sum, u) => sum + u.durationSec, 0);
  const hasPitchReading = utterances.some((u) => u.pitchVariationHz !== null);
  return totalWords >= MIN_TOTAL_WORDS && totalDuration >= MIN_TOTAL_DURATION_SEC && hasPitchReading;
}
