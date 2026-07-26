"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import type { MaterialPreset, OrbSettings, VoiceState } from "../../../lib/voice-coach/types";
import {
  CORE_FRAGMENT_SHADER,
  CORE_VERTEX_SHADER,
  PARTICLE_FRAGMENT_SHADER,
  PARTICLE_VERTEX_SHADER,
} from "./shaders";

const MAX_PARTICLES = 6000;

const MATERIAL_PRESETS: Record<
  MaterialPreset,
  {
    turbulenceMultiplier: number;
    noiseSpeed: number;
    particleSize: number;
    coreOpacity: number;
    particleOpacity: number;
  }
> = {
  smoke: {
    turbulenceMultiplier: 1.6,
    noiseSpeed: 0.08,
    particleSize: 5.5,
    coreOpacity: 0.55,
    particleOpacity: 0.35,
  },
  liquid: {
    turbulenceMultiplier: 0.9,
    noiseSpeed: 0.22,
    particleSize: 3,
    coreOpacity: 0.92,
    particleOpacity: 0.55,
  },
  sand: {
    turbulenceMultiplier: 2.4,
    noiseSpeed: 0.5,
    particleSize: 2,
    coreOpacity: 0.4,
    particleOpacity: 0.85,
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
}

function OrbScene({ state, amplitude, settings }: OrbSceneProps) {
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
        <icosahedronGeometry args={[1, 32]} />
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

export default function VoiceOrb({ state, amplitude, settings }: VoiceOrbProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // WebGL2 support can only be detected in the browser and legitimately
    // differs between the server-rendered shell and the client - this is
    // exactly the "synchronize with an external system after mount" case
    // effects are for, not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebglSupported(isWebGL2Available());
  }, []);

  if (webglSupported === false) {
    return (
      <div
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
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 360,
        margin: "0 auto",
        borderRadius: "24px",
        overflow: "hidden",
      }}
    >
      <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <OrbScene state={state} amplitude={amplitude} settings={settings} />
      </Canvas>
    </div>
  );
}
