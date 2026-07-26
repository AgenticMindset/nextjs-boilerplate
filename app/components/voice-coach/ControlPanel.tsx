"use client";

import type { MaterialPreset, OrbSettings } from "../../../lib/voice-coach/types";

const MATERIAL_OPTIONS: { value: MaterialPreset; label: string }[] = [
  { value: "smoke", label: "Smoke" },
  { value: "liquid", label: "Liquid" },
  { value: "sand", label: "Sand" },
];

interface ControlPanelProps {
  settings: OrbSettings;
  onChange: (settings: OrbSettings) => void;
}

export default function ControlPanel({ settings, onChange }: ControlPanelProps) {
  return (
    <div style={styles.panel}>
      <div style={styles.row}>
        <label style={styles.label}>
          Base color
          <input
            type="color"
            value={settings.baseColor}
            onChange={(e) => onChange({ ...settings, baseColor: e.target.value })}
            style={styles.colorInput}
          />
        </label>
        <label style={styles.label}>
          Accent color
          <input
            type="color"
            value={settings.accentColor}
            onChange={(e) => onChange({ ...settings, accentColor: e.target.value })}
            style={styles.colorInput}
          />
        </label>
      </div>

      <label style={styles.sliderLabel}>
        Particle density ({settings.particleCount})
        <input
          type="range"
          min={500}
          max={6000}
          step={100}
          value={settings.particleCount}
          onChange={(e) => onChange({ ...settings, particleCount: Number(e.target.value) })}
          style={styles.slider}
        />
      </label>

      <label style={styles.sliderLabel}>
        Turbulence ({settings.turbulence.toFixed(1)})
        <input
          type="range"
          min={0.2}
          max={3}
          step={0.1}
          value={settings.turbulence}
          onChange={(e) => onChange({ ...settings, turbulence: Number(e.target.value) })}
          style={styles.slider}
        />
      </label>

      <div style={styles.materialRow}>
        {MATERIAL_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange({ ...settings, material: option.value })}
            style={{
              ...styles.materialButton,
              ...(settings.material === option.value ? styles.materialButtonActive : {}),
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "18px 20px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(30, 30, 30, 0.6)",
    backdropFilter: "blur(16px)",
    fontFamily: "Inter, sans-serif",
  },
  row: {
    display: "flex",
    gap: "20px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.55)",
  },
  colorInput: {
    width: "40px",
    height: "28px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "6px",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
  },
  sliderLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.55)",
  },
  slider: {
    width: "100%",
    accentColor: "#b89c5a",
  },
  materialRow: {
    display: "flex",
    gap: "8px",
  },
  materialButton: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.03)",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "12px",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  },
  materialButtonActive: {
    border: "1px solid rgba(184, 156, 90, 0.6)",
    background: "rgba(184, 156, 90, 0.18)",
    color: "#e0d6c0",
  },
};
