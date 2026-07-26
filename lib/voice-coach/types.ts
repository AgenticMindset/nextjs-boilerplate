export type VoiceState = "idle" | "listening" | "thinking" | "speaking";

export type MaterialPreset = "smoke" | "liquid" | "sand";

export interface OrbSettings {
  baseColor: string;
  accentColor: string;
  particleCount: number;
  turbulence: number;
  material: MaterialPreset;
}

export type ConversationRole = "user" | "assistant";

export interface ConversationTurn {
  role: ConversationRole;
  text: string;
}

export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export interface TranscriptionResult {
  text: string;
  words: WordTiming[] | null;
  avgLogprob: number | null;
  durationSec: number;
}

export interface UtteranceMetrics {
  transcript: string;
  durationSec: number;
  wordCount: number;
  wordsPerMinute: number | null;
  pauseCount: number | null;
  avgPauseMs: number | null;
  longestPauseMs: number | null;
  fillerWordCount: number | null;
  fillerWordRatePer100Words: number | null;
  fillerWordsFound: string[];
  pitchVariationHz: number | null;
  avgEnergyRms: number | null;
  articulationApprox: number | null;
  sttConfidenceApprox: number | null;
}

export interface DimensionFeedback {
  observations: {
    claim: string;
    evidence: string;
  }[];
  notMeasured: string[];
}

export interface FeedbackReportData {
  spokenSummary: string;
  delivery: DimensionFeedback;
  content: DimensionFeedback;
  articulation: DimensionFeedback;
  suggestions: string[];
}
