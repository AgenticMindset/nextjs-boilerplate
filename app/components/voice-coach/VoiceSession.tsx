"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import VoiceOrb from "./VoiceOrb";
import ControlPanel from "./ControlPanel";
import FeedbackReport from "./FeedbackReport";
import {
  createLiveAnalyser,
  decodeAudioBlob,
  getRmsAmplitude,
  type LiveAnalyser,
} from "../../../lib/voice-coach/audio";
import { computeUtteranceMetrics, hasSufficientSample } from "../../../lib/voice-coach/metrics";
import { GroqWhisperSTT } from "../../../lib/voice-coach/stt";
import { ReplicateKokoroTTS } from "../../../lib/voice-coach/tts";
import type {
  ConversationTurn,
  FeedbackReportData,
  OrbSettings,
  UtteranceMetrics,
  VoiceState,
} from "../../../lib/voice-coach/types";

const MAX_TURNS = 2;
const SILENCE_THRESHOLD = 0.02;
const SILENCE_MS = 2500;
const MIN_SPEECH_MS = 600;
const MAX_RECORDING_MS = 30000;

const SUGGESTED_TOPICS = [
  "A project you're proud of, and what made it hard",
  "A skill or hobby you'd explain to a total beginner",
  "A story about a time something didn't go as planned",
  "Something you've changed your mind about recently",
];

const DEFAULT_SETTINGS: OrbSettings = {
  baseColor: "#1a1a2e",
  accentColor: "#ffffff",
  particleCount: 4000,
  turbulence: 2.5,
  material: "liquid",
};

function checkBrowserSupport(): string | null {
  if (typeof window === "undefined") return null;
  if (!navigator.mediaDevices?.getUserMedia) {
    return "This browser does not support microphone capture.";
  }
  if (typeof window.MediaRecorder === "undefined") {
    return "This browser does not support audio recording (MediaRecorder).";
  }
  if (typeof window.AudioContext === "undefined") {
    return "This browser does not support the Web Audio API needed to play the agent's voice.";
  }
  return null;
}

export default function VoiceSession() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [turnNumber, setTurnNumber] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [micAmplitude, setMicAmplitude] = useState(0);
  const [ttsAmplitude, setTtsAmplitude] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [unsupported, setUnsupported] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackReportData | null>(null);
  const [orbSettings, setOrbSettings] = useState<OrbSettings>(DEFAULT_SETTINGS);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const utteranceMetricsRef = useRef<UtteranceMetrics[]>([]);
  const conversationHistoryRef = useRef<ConversationTurn[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const liveAnalyserRef = useRef<LiveAnalyser | null>(null);
  const rafRef = useRef<number | null>(null);
  const recordStartRef = useRef(0);
  const silenceStartRef = useRef<number | null>(null);
  const sttRef = useRef(new GroqWhisperSTT());
  const ttsRef = useRef(new ReplicateKokoroTTS());
  const sessionEpochRef = useRef(0);

  useEffect(() => {
    // Browser capability detection only runs client-side and legitimately
    // differs from the server-rendered shell - synchronizing with the
    // browser environment after mount, not deriving render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnsupported(checkBrowserSupport());
  }, []);

  const cleanupCapture = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (liveAnalyserRef.current) {
      liveAnalyserRef.current.audioContext.close().catch(() => {});
      liveAnalyserRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const monitorAmplitude = useCallback(() => {
    const live = liveAnalyserRef.current;
    if (!live) return;
    const rms = getRmsAmplitude(live);
    setMicAmplitude(Math.min(1, rms * 6));

    const elapsed = performance.now() - recordStartRef.current;
    if (elapsed > MAX_RECORDING_MS) {
      stopListening();
      return;
    }
    if (elapsed > MIN_SPEECH_MS) {
      if (rms < SILENCE_THRESHOLD) {
        if (silenceStartRef.current === null) silenceStartRef.current = performance.now();
        else if (performance.now() - silenceStartRef.current > SILENCE_MS) {
          stopListening();
          return;
        }
      } else {
        silenceStartRef.current = null;
      }
    }
    rafRef.current = requestAnimationFrame(monitorAmplitude);
  }, [stopListening]);

  const runConversationTurn = useCallback(
    async (userText: string, metrics: UtteranceMetrics, epoch: number) => {
      const history = [...conversationHistoryRef.current, { role: "user" as const, text: userText }];
      conversationHistoryRef.current = history;
      setConversationHistory(history);

      const nextTurnNumber = utteranceMetricsRef.current.length;
      const isFinalTurn =
        nextTurnNumber >= MAX_TURNS || hasSufficientSample(utteranceMetricsRef.current);

      setVoiceState("thinking");
      const response = await fetch("/api/voice-coach/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((t) => ({ role: t.role, content: t.text })),
          turnNumber: nextTurnNumber,
          isFinalTurn,
        }),
      });
      if (!response.ok || !response.body) {
        throw new Error("The agent could not respond. Please try again.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
      }
      if (!assistantText.trim()) {
        throw new Error("The agent could not respond. Please try again.");
      }
      if (sessionEpochRef.current !== epoch) return;

      const updatedHistory = [...history, { role: "assistant" as const, text: assistantText }];
      conversationHistoryRef.current = updatedHistory;
      setConversationHistory(updatedHistory);

      // One TTS call for the whole reply rather than one per sentence: the
      // Replicate account backing this demo throttles to a burst of 1
      // prediction with a ~10s refill, so multiple calls per turn - even
      // spaced a couple seconds apart, not just concurrent ones - get
      // rejected outright. Kokoro already paces multi-sentence text fine in
      // a single call.
      //
      // Stay in "thinking" (still animated) through the synthesis network
      // round trip, and only switch to "speaking" once audio actually
      // starts - otherwise the orb goes visually idle for however long
      // Kokoro takes, which reads as a stall rather than active work.
      await ttsRef.current.speak(assistantText, setTtsAmplitude, () => {
        if (sessionEpochRef.current === epoch) setVoiceState("speaking");
      });
      if (sessionEpochRef.current !== epoch) return;
      setTtsAmplitude(0);

      if (isFinalTurn) {
        setVoiceState("thinking");
        const feedbackResponse = await fetch("/api/voice-coach/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ utterances: utteranceMetricsRef.current }),
        });
        if (!feedbackResponse.ok) {
          throw new Error("Could not generate the feedback report.");
        }
        const feedbackData: FeedbackReportData = await feedbackResponse.json();
        if (sessionEpochRef.current !== epoch) return;
        setFeedback(feedbackData);
        await ttsRef.current.speak(feedbackData.spokenSummary, setTtsAmplitude, () => {
          if (sessionEpochRef.current === epoch) setVoiceState("speaking");
        });
        if (sessionEpochRef.current !== epoch) return;
        setTtsAmplitude(0);
      }

      setVoiceState("idle");
      void metrics;
    },
    []
  );

  const handleRecordingStopped = useCallback(
    async (blob: Blob, durationSec: number, epoch: number) => {
      setVoiceState("thinking");
      try {
        const transcription = await sttRef.current.transcribe(blob, durationSec);
        if (sessionEpochRef.current !== epoch) return;
        if (!transcription.text.trim()) {
          setError("I didn't catch that - please try again.");
          setVoiceState("idle");
          return;
        }
        const audioBuffer = await decodeAudioBlob(blob);
        if (sessionEpochRef.current !== epoch) return;
        const metrics = computeUtteranceMetrics(transcription, audioBuffer);
        utteranceMetricsRef.current = [...utteranceMetricsRef.current, metrics];
        setTurnNumber(utteranceMetricsRef.current.length);

        await runConversationTurn(transcription.text, metrics, epoch);
      } catch (err) {
        if (sessionEpochRef.current !== epoch) return;
        const message = err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        setVoiceState("idle");
      }
    },
    [runConversationTurn]
  );

  const startListening = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionRequested(true);
      streamRef.current = stream;
      liveAnalyserRef.current = createLiveAnalyser(stream);

      const epoch = sessionEpochRef.current;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const durationSec = (performance.now() - recordStartRef.current) / 1000;
        const blob = new Blob(chunksRef.current, {
          type: chunksRef.current[0]?.type || "audio/webm",
        });
        cleanupCapture();
        setMicAmplitude(0);
        if (sessionEpochRef.current !== epoch) return;
        void handleRecordingStopped(blob, durationSec, epoch);
      };
      mediaRecorderRef.current = recorder;

      recordStartRef.current = performance.now();
      silenceStartRef.current = null;
      recorder.start();
      setVoiceState("listening");
      rafRef.current = requestAnimationFrame(monitorAmplitude);
    } catch {
      setError(
        "Microphone access was denied or is unavailable. Please allow microphone access and try again."
      );
    }
  }, [cleanupCapture, handleRecordingStopped, monitorAmplitude]);

  useEffect(() => {
    const tts = ttsRef.current;
    return () => {
      cleanupCapture();
      tts.cancel();
    };
  }, [cleanupCapture]);

  const handleMicClick = () => {
    if (voiceState === "idle") {
      void startListening();
    } else if (voiceState === "listening") {
      stopListening();
    }
  };

  const resetSession = useCallback(() => {
    sessionEpochRef.current += 1;

    const recorder = mediaRecorderRef.current;
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      if (recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // already stopped
        }
      }
      mediaRecorderRef.current = null;
    }
    cleanupCapture();
    ttsRef.current.cancel();
    chunksRef.current = [];

    utteranceMetricsRef.current = [];
    conversationHistoryRef.current = [];
    setConversationHistory([]);
    setTurnNumber(0);
    setFeedback(null);
    setError(null);
    setMicAmplitude(0);
    setTtsAmplitude(0);
    setVoiceState("idle");
  }, [cleanupCapture]);

  const isComplete = feedback !== null;
  const currentAmplitude = voiceState === "listening" ? micAmplitude : voiceState === "speaking" ? ttsAmplitude : 0;

  const lastAssistantTurn = [...conversationHistory].reverse().find((t) => t.role === "assistant");
  const lastUserTurn = [...conversationHistory].reverse().find((t) => t.role === "user");

  return (
    <div style={styles.container}>
      {!unsupported && !isComplete && turnNumber === 0 && voiceState === "idle" && (
        <div style={styles.suggestionsBox}>
          <p style={styles.suggestionsHeading}>
            For richer feedback, try talking through one of these for 30-60 seconds. If it needs a
            bit more to work with, the coach will ask one quick follow-up, then give you feedback.
          </p>
          <ul style={styles.suggestionsList}>
            {SUGGESTED_TOPICS.map((topic, i) => (
              <li key={i} style={styles.suggestionItem}>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}

      <VoiceOrb state={voiceState} amplitude={currentAmplitude} settings={orbSettings} />

      <div style={styles.statusRow}>
        <span style={styles.statusBadge}>{describeState(voiceState, isComplete)}</span>
        <span style={styles.turnCounter}>
          {Math.min(turnNumber, MAX_TURNS)} of up to {MAX_TURNS} exchanges
        </span>
        {(turnNumber > 0 || isComplete || error) && (
          <button onClick={resetSession} style={styles.resetButton}>
            Reset session
          </button>
        )}
      </div>

      {unsupported && <div style={styles.errorBox}>{unsupported}</div>}
      {error && <div style={styles.errorBox}>{error}</div>}

      {!unsupported && !isComplete && (
        <button
          onClick={handleMicClick}
          disabled={voiceState === "thinking" || voiceState === "speaking"}
          style={{
            ...styles.micButton,
            ...(voiceState === "listening" ? styles.micButtonActive : {}),
            ...(voiceState === "thinking" || voiceState === "speaking"
              ? styles.micButtonDisabled
              : {}),
          }}
        >
          {micButtonLabel(voiceState, permissionRequested)}
        </button>
      )}

      {(lastUserTurn || lastAssistantTurn) && !isComplete && (
        <div style={styles.captions}>
          {lastUserTurn && (
            <p style={styles.captionYou}>
              <strong>You:</strong> {lastUserTurn.text}
            </p>
          )}
          {lastAssistantTurn && (
            <p style={styles.captionAgent}>
              <strong>Coach:</strong> {lastAssistantTurn.text}
            </p>
          )}
        </div>
      )}

      {isComplete && feedback && <FeedbackReport feedback={feedback} />}

      <ControlPanel settings={orbSettings} onChange={setOrbSettings} />
    </div>
  );
}

function describeState(state: VoiceState, isComplete: boolean): string {
  if (isComplete) return "Session complete";
  switch (state) {
    case "idle":
      return "Idle";
    case "listening":
      return "Listening";
    case "thinking":
      return "Thinking";
    case "speaking":
      return "Speaking";
  }
}

function micButtonLabel(state: VoiceState, permissionRequested: boolean): string {
  if (state === "listening") return "Tap to stop";
  if (state === "thinking") return "Thinking...";
  if (state === "speaking") return "Speaking...";
  return permissionRequested ? "Tap to talk" : "Tap to start - allow microphone access";
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontFamily: "Inter, sans-serif",
  },
  statusBadge: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--color-accent)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  turnCounter: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.4)",
  },
  resetButton: {
    marginLeft: "4px",
    padding: "4px 12px",
    borderRadius: "999px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(255, 255, 255, 0.03)",
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "12px",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  },
  suggestionsBox: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    fontFamily: "Inter, sans-serif",
  },
  suggestionsHeading: {
    margin: "0 0 8px",
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.5)",
  },
  suggestionsList: {
    margin: 0,
    paddingLeft: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  suggestionItem: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 1.5,
  },
  micButton: {
    padding: "14px 32px",
    borderRadius: "999px",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    background: "rgba(255, 255, 255, 0.15)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  },
  micButtonActive: {
    border: "1px solid rgba(220, 60, 60, 0.5)",
    background: "rgba(220, 60, 60, 0.15)",
    color: "#e0a0a0",
  },
  micButtonDisabled: {
    opacity: 0.5,
    cursor: "default",
  },
  errorBox: {
    padding: "12px 18px",
    borderRadius: 10,
    background: "rgba(244,67,54,0.1)",
    border: "1px solid rgba(244,67,54,0.3)",
    color: "#F44336",
    fontSize: 13,
    fontFamily: "Inter, sans-serif",
    textAlign: "center" as const,
  },
  captions: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    fontFamily: "Inter, sans-serif",
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 1.6,
  },
  captionYou: {
    margin: "0 0 8px",
  },
  captionAgent: {
    margin: 0,
    color: "rgba(255, 255, 255, 0.85)",
  },
};
