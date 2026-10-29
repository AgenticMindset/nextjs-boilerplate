"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import type { MaterialPreset, OrbSettings, VoiceState } from "../../../lib/voice-coach/types";
import { usePrefersReducedMotion } from "../../../lib/use-prefers-reduced-motion";
import {
  CORE_FRAGMENT_SHADER,
  CORE_VERTEX_SHADER,
  PARTICLE_FRAGMENT_SHADER,
  PARTICLE_VERTEX_SHADER,
} from "./shaders";

const MAX_PARTICLES = 6000;

// Detail 32 meant ~21.7k triangles / ~65k non-indexed vertices, each now
// running three octaves of noise three times over (position plus two tangent
// neighbours for the normal). The displacement is low-frequency and the orb
// renders at ~360px, so the extra silhouette resolution bought nothing -
// spending that budget on the noise detail instead looks better and costs
// less.
const CORE_DETAIL = 16;

const MATERIAL_PRESETS: Record<
  MaterialPreset,
  {
    turbulenceMultiplier: number;
    noiseSpeed: number;
    particleSize: number;
    coreOpacity: number;
    particleOpacity: number;
    specular: number;
  }
> = {
  // particleOpacity is tuned for additive blending, where overlapping specks
  // accumulate - the pre-additive values blew out to flat white at the high
  // end of the density slider.
  smoke: {
    turbulenceMultiplier: 1.6,
    noiseSpeed: 0.08,
    particleSize: 5.5,
    coreOpacity: 0.55,
    particleOpacity: 0.18,
    specular: 0.15,
  },
  liquid: {
    turbulenceMultiplier: 0.9,
    noiseSpeed: 0.22,
    particleSize: 3,
    coreOpacity: 0.92,
    particleOpacity: 0.26,
    specular: 1,
  },
  sand: {
    turbulenceMultiplier: 2.4,
    noiseSpeed: 0.5,
    particleSize: 2,
    coreOpacity: 0.4,
    particleOpacity: 0.38,
    specular: 0.4,
  },
};

const STATE_MOTION: Record<VoiceState, { idleAmplitude: number; speed: number }> = {
  idle: { idleAmplitude: 0.05, speed: 0.15 },
  listening: { idleAmplitude: 0, speed: 0.4 },
  thinking: { idleAmplitude: 0.18, speed: 0.9 },
  speaking: { idleAmplitude: 0, speed: 0.5 },
};

// Deterministic PRNG (mulberry32) so particle layout is a pure function of
// `count` - no Math.random() during render.
function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useSphereParticlePositions(count: number) {
  return useMemo(() => {
    const random = createSeededRandom(count * 7919 + 1);
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 1.15 + random() * 0.25;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      randoms[i] = random();
    }
    return { positions, randoms };
  }, [count]);
}

interface OrbSceneProps {
  state: VoiceState;
  amplitude: number;
  settings: OrbSettings;
  reduceMotion: boolean;
}

function OrbScene({ state, amplitude, settings, reduceMotion }: OrbSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const particleMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef = useRef(0);

  const particleCount = Math.min(MAX_PARTICLES, Math.max(200, settings.particleCount));
  const { positions, randoms } = useSphereParticlePositions(particleCount);

  const preset = MATERIAL_PRESETS[settings.material];
  const motion = STATE_MOTION[state];

  const baseColor = useMemo(() => new THREE.Color(settings.baseColor), [settings.baseColor]);
  const accentColor = useMemo(() => new THREE.Color(settings.accentColor), [settings.accentColor]);

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0 },
      uTurbulence: { value: 1.2 },
      uNoiseSpeed: { value: 0.1 },
      uBaseColor: { value: baseColor.clone() },
      uAccentColor: { value: accentColor.clone() },
      uOpacity: { value: preset.coreOpacity },
      uSpecular: { value: preset.specular },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const particleUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0 },
      uTurbulence: { value: 1.2 },
      uNoiseSpeed: { value: 0.1 },
      uSize: { value: preset.particleSize },
      uColor: { value: accentColor.clone() },
      uOpacity: { value: preset.particleOpacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((_, delta) => {
    // Reduced motion: hold the orb at its first frame. No noise advance, no
    // rotation, no idle pulse. The state it would have conveyed through
    // movement is carried by the status badge and the canvas's aria-label.
    if (reduceMotion) return;

    timeRef.current += delta;
    const syntheticPulse =
      motion.idleAmplitude > 0
        ? motion.idleAmplitude * (0.5 + 0.5 * Math.sin(timeRef.current * motion.speed * 4))
        : 0;
    const effectiveAmplitude = Math.max(amplitude, syntheticPulse);
    const turbulence = settings.turbulence * preset.turbulenceMultiplier;

    if (coreMaterialRef.current) {
      const u = coreMaterialRef.current.uniforms;
      u.uTime.value = timeRef.current;
      u.uAmplitude.value = effectiveAmplitude;
      u.uTurbulence.value = turbulence;
      u.uNoiseSpeed.value = preset.noiseSpeed * motion.speed;
      u.uBaseColor.value.set(settings.baseColor);
      u.uAccentColor.value.set(settings.accentColor);
      u.uOpacity.value = preset.coreOpacity;
      u.uSpecular.value = preset.specular;
    }
    if (particleMaterialRef.current) {
      const u = particleMaterialRef.current.uniforms;
      u.uTime.value = timeRef.current;
      u.uAmplitude.value = effectiveAmplitude;
      u.uTurbulence.value = turbulence;
      u.uNoiseSpeed.value = preset.noiseSpeed * motion.speed;
      u.uSize.value = preset.particleSize;
      u.uColor.value.set(settings.accentColor);
      u.uOpacity.value = preset.particleOpacity;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05 * motion.speed;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1, CORE_DETAIL]} />
        <shaderMaterial
          ref={coreMaterialRef}
          uniforms={coreUniforms}
          vertexShader={CORE_VERTEX_SHADER}
          fragmentShader={CORE_FRAGMENT_SHADER}
          transparent
        />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={particleMaterialRef}
          uniforms={particleUniforms}
          vertexShader={PARTICLE_VERTEX_SHADER}
          fragmentShader={PARTICLE_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          // Points are never depth-sorted, so with normal alpha blending the
          // ones drawn behind the core composited over it in arbitrary order
          // and the whole cloud muddied into grey haze. Additive blending is
          // order-independent and makes the specks read as emissive dust.
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function isWebGL2Available(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

interface VoiceOrbProps {
  state: VoiceState;
  amplitude: number;
  settings: OrbSettings;
}

// The orb is the only indicator of what the agent is doing that some people
// will notice, and a <canvas> has no text equivalent. Each of the three render
// paths below carries this as its accessible name.
const STATE_LABELS: Record<VoiceState, string> = {
  idle: "Voice coach orb, idle and waiting for you to start",
  listening: "Voice coach orb, listening to you speak",
  thinking: "Voice coach orb, thinking about your answer",
  speaking: "Voice coach orb, speaking its reply",
};

export default function VoiceOrb({ state, amplitude, settings }: VoiceOrbProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  // A lost WebGL context (GPU reset, driver hiccup, resource pressure from a
  // long session) otherwise leaves the canvas permanently blank with no
  // error - track it explicitly so we can fall back, then recover once the
  // browser restores the context.
  const [contextLost, setContextLost] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  useEffect(() => {
    // WebGL2 support can only be detected in the browser and legitimately
    // differs between the server-rendered shell and the client - this is
    // exactly the "synchronize with an external system after mount" case
    // effects are for, not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebglSupported(isWebGL2Available());
  }, []);

  const handleCanvasCreated = useCallback((canvasState: { gl: THREE.WebGLRenderer }) => {
    const canvas = canvasState.gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    const onRestored = () => {
      // A fresh mount is the reliable way to recover - re-uploading
      // geometries/textures/materials onto a restored context in place is
      // fragile across browsers, a full remount just rebuilds everything.
      setContextLost(false);
      setCanvasKey((k) => k + 1);
    };
    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
  }, []);

  if (webglSupported === false || contextLost) {
    return (
      <div
        role="img"
        aria-label={STATE_LABELS[state]}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          maxWidth: 360,
          margin: "0 auto",
          borderRadius: "50%",
          background: `radial-gradient(circle at 40% 35%, ${settings.accentColor}, ${settings.baseColor})`,
          opacity: state === "idle" ? 0.6 : 0.6 + amplitude * 0.4,
          transition: "opacity 0.15s ease-out",
          boxShadow: `0 0 60px ${settings.accentColor}55`,
        }}
      />
    );
  }

  if (webglSupported === null) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          maxWidth: 360,
          margin: "0 auto",
          borderRadius: "24px",
        }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={STATE_LABELS[state]}
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 360,
        margin: "0 auto",
        borderRadius: "24px",
        overflow: "hidden",
      }}
    >
      <Canvas
        key={canvasKey}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={handleCanvasCreated}
        frameloop={reduceMotion ? "demand" : "always"}
      >
        {/* No scene lights: both layers are raw ShaderMaterials, which ignore
            them. The core shades itself from a fixed light direction. */}
        <OrbScene
          state={state}
          amplitude={amplitude}
          settings={settings}
          reduceMotion={reduceMotion}
        />
      </Canvas>
    </div>
  );
}
