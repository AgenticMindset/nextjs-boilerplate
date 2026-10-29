"use client";

import dynamic from "next/dynamic";
import type { OrbSettings, VoiceState } from "../../../lib/voice-coach/types";

interface LazyVoiceOrbProps {
  state: VoiceState;
  amplitude: number;
  settings: OrbSettings;
}

// three / @react-three/fiber / drei are ~890KB of JS and are useless until the
// orb actually paints, so the WebGL orb is fetched after mount rather than as
// part of the route's initial bundle. The placeholder reuses the same radial
// gradient VoiceOrb itself falls back to without WebGL, so the swap is not a
// visible pop. Its colours are the session defaults: the placeholder is gone
// well before anyone can reach the colour sliders in ControlPanel.
const VoiceOrb = dynamic(() => import("./VoiceOrb"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 360,
        margin: "0 auto",
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, #ffffff, #1a1a2e)",
        opacity: 0.6,
        boxShadow: "0 0 60px #ffffff55",
      }}
    />
  ),
});

export default function LazyVoiceOrb({ state, amplitude, settings }: LazyVoiceOrbProps) {
  return <VoiceOrb state={state} amplitude={amplitude} settings={settings} />;
}
