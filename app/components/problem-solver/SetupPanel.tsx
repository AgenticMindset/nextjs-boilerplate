"use client";

import { useState } from "react";
import type { DomainHint, ProblemSolverInput } from "../../../lib/problem-solver/types";

const DOMAIN_HINTS: DomainHint[] = [
  "Not sure",
  "Business & Strategy",
  "Team & Org",
  "Product & Technical",
  "Personal & Career",
  "Creative & Open-ended",
];

const EXAMPLES: string[] = [
  "Our onboarding funnel drop-off jumped 15% last week and we don't know why.",
  "We need to ship faster AND with fewer bugs, and everyone says that's impossible.",
  "I have three job offers and no idea how to actually compare them.",
];

interface SetupPanelProps {
  onRun: (input: ProblemSolverInput) => void;
}

export default function SetupPanel({ onRun }: SetupPanelProps) {
  const [problemDescription, setProblemDescription] = useState("");
  const [domainHint, setDomainHint] = useState<DomainHint>("Not sure");

  const missingDescription = !problemDescription.trim();

  function handleRun() {
    if (missingDescription) return;
    onRun({ problemDescription: problemDescription.trim(), domainHint });
  }

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Problem description */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 8,
            color: "var(--color-accent)",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Describe your problem
        </label>
        <textarea
          value={problemDescription}
          onChange={function (e) {
            setProblemDescription(e.target.value);
          }}
          placeholder="What's going on? Be as specific as you can: what's happening, what you'd expect instead, and anything you've already tried."
          rows={6}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            color: "#fff",
            fontSize: 14,
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {EXAMPLES.map(function (example) {
            return (
              <button
                key={example}
                onClick={function () {
                  setProblemDescription(example);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#999",
                  cursor: "pointer",
                  fontSize: 12,
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
              >
                {example.length > 46 ? example.slice(0, 46) + "…" : example}
              </button>
            );
          })}
        </div>
      </div>

      {/* Domain hint */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 8,
            color: "var(--color-accent)",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Domain (optional)
        </label>
        <select
          value={domainHint}
          onChange={function (e) {
            setDomainHint(e.target.value as DomainHint);
          }}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#141414",
            color: "#fff",
            fontSize: 14,
            outline: "none",
          }}
        >
          {DOMAIN_HINTS.map(function (d) {
            return (
              <option key={d} value={d}>
                {d}
              </option>
            );
          })}
        </select>
      </div>

      {/* How this works */}
      <details
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          padding: "12px 16px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            color: "#888",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          How framework selection works
        </summary>
        <p
          style={{
            marginTop: 10,
            color: "#aaa",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          This agent picks from a fixed catalog of 12 well-established
          problem-solving frameworks spanning root-cause analysis,
          structured decomposition, strategic positioning, decision-making,
          and process improvement. It never invents a framework — it
          classifies the shape of your problem and matches it to the
          closest fit from the catalog, then explains why and gives you
          concrete steps to apply it.
        </p>
      </details>

      {/* Run */}
      <button
        onClick={handleRun}
        disabled={missingDescription}
        style={{
          padding: "14px 28px",
          borderRadius: 10,
          border: missingDescription ? "none" : "1px solid rgba(255, 255, 255, 0.25)",
          background: missingDescription
            ? "#333"
            : "rgba(255, 255, 255, 0.1)",
          backdropFilter: missingDescription ? undefined : "blur(20px) saturate(180%)",
          WebkitBackdropFilter: missingDescription ? undefined : "blur(20px) saturate(180%)",
          color: missingDescription ? "#666" : "#fff",
          fontSize: 16,
          fontWeight: 700,
          cursor: missingDescription ? "not-allowed" : "pointer",
          transition: "all 0.3s",
          width: "100%",
        }}
      >
        Recommend a Framework
      </button>
    </div>
  );
}
