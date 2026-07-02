"use client";

import { useCallback, useState } from "react";
import WargameSetupPanel from "../../components/wargame/WargameSetupPanel";
import WargameOutputView from "../../components/wargame/WargameOutputView";
import type { MarketDefinition, WargameResult } from "../../../lib/wargame/types";

export default function WargamePage() {
  const [result, setResult] = useState<WargameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = useCallback(async function (market: MarketDefinition) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/wargame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ market }),
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

  function handleReset() {
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
            background: "linear-gradient(135deg, #d4af37, #b8962e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Market Entry Wargame
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
          Define a market entry scenario and this agent retrieves competitive
          intelligence from a pre-indexed knowledge base plus live search, then
          predicts how incumbents will defend their position and recommends an
          entry strategy.
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

      {!result && !loading && <WargameSetupPanel onRun={handleRun} />}

      {loading && (
        <div style={{ maxWidth: 640, margin: "40px auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#d4af37",
              animation: "wargamePulse 1.2s ease-in-out infinite",
              marginBottom: 16,
            }}
          />
          <div style={{ color: "#ccc", fontSize: 14 }}>
            Querying the knowledge base, pulling live market data, and running the
            simulation...
          </div>
          <div style={{ color: "#666", fontSize: 12, marginTop: 6 }}>
            This takes 10-20 seconds.
          </div>
          <style>{"\n            @keyframes wargamePulse {\n              0%, 100% { opacity: 1; transform: scale(1); }\n              50% { opacity: 0.3; transform: scale(1.3); }\n            }\n          "}</style>
        </div>
      )}

      {result && !loading && (
        <WargameOutputView result={result} onReset={handleReset} />
      )}
    </main>
  );
}
