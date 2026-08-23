"use client";

import { useCallback, useState } from "react";
import SetupPanel from "../../components/problem-solver/SetupPanel";
import ResultsPanel from "../../components/problem-solver/ResultsPanel";
import type { ProblemSolverInput, ProblemSolverResult } from "../../../lib/problem-solver/types";

export default function ProblemSolverPage() {
  const [result, setResult] = useState<ProblemSolverResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = useCallback(async function (input: ProblemSolverInput) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/problem-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error: " + response.status);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleRerun() {
    setResult(null);
    setError(null);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        padding: "80px 20px 40px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <a
          href="/agents"
          style={{
            color: "#888",
            fontSize: 13,
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 10,
          }}
        >
          {"←"} Back to Agents
        </a>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Problem Solver
        </h1>
        <p
          style={{
            color: "#888",
            fontSize: 14,
            marginTop: 8,
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Describe a problem in your own words. This agent classifies its
          shape and recommends the best-fit problem-solving framework from a
          curated catalog, with concrete steps for applying it.
        </p>
      </div>

      {error && (
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto 20px",
            padding: "12px 18px",
            borderRadius: 10,
            background: "rgba(244,67,54,0.1)",
            border: "1px solid rgba(244,67,54,0.3)",
            color: "#F44336",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {!result && !loading && <SetupPanel onRun={handleRun} />}

      {loading && (
        <div style={{ maxWidth: 640, margin: "40px auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--color-accent)",
              animation: "problemSolverPulse 1.2s ease-in-out infinite",
              marginBottom: 16,
            }}
          />
          <div style={{ color: "#ccc", fontSize: 14 }}>
            Diagnosing the problem and matching it to a framework...
          </div>
          <style>
            {
              "\n            @keyframes problemSolverPulse {\n              0%, 100% { opacity: 1; transform: scale(1); }\n              50% { opacity: 0.3; transform: scale(1.3); }\n            }\n          "
            }
          </style>
        </div>
      )}

      {result && !loading && (
        <ResultsPanel result={result} onRerun={handleRerun} />
      )}
    </main>
  );
}
