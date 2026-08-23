"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { StressDimensions, Verdict } from "../../../lib/tokenomics/types";

interface ResilienceRadarProps {
  dimensions: StressDimensions;
  verdict: Verdict;
}

const VERDICT_COLOR: Record<Verdict, string> = {
  survives: "#4CAF50",
  "at-risk": "#FF9800",
  "critical-failure": "#F44336",
};

const DIMENSION_LABELS: { key: keyof StressDimensions; label: string }[] = [
  { key: "emissionResilience", label: "Emission Resilience" },
  { key: "liquidityDepth", label: "Liquidity Depth" },
  { key: "governanceIntegrity", label: "Governance Integrity" },
  { key: "reserveAdequacy", label: "Reserve Adequacy" },
  { key: "priceStability", label: "Price Stability" },
];

export default function ResilienceRadar({ dimensions, verdict }: ResilienceRadarProps) {
  const postColor = VERDICT_COLOR[verdict];

  const data = DIMENSION_LABELS.map(function (d) {
    return {
      dimension: d.label,
      preStress: dimensions[d.key].preStress,
      postStress: dimensions[d.key].postStress,
    };
  });

  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.25)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#ffffff", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
          />
          <Radar
            name="Pre-Stress"
            dataKey="preStress"
            stroke="#4FC3F7"
            fill="#4FC3F7"
            fillOpacity={0.3}
          />
          <Radar
            name="Post-Stress"
            dataKey="postStress"
            stroke={postColor}
            fill={postColor}
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginTop: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#4FC3F7",
              display: "inline-block",
            }}
          />
          <span style={{ color: "#ccc", fontSize: 12 }}>Pre-Stress</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: postColor,
              display: "inline-block",
            }}
          />
          <span style={{ color: "#ccc", fontSize: 12 }}>Post-Stress</span>
        </div>
      </div>
    </div>
  );
}
