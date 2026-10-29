"use client";

import { useCallback, useState } from "react";

/**
 * The run-once-and-show-the-result cycle shared by the wargame, tokenomics and
 * problem-solver pages: POST a payload, surface an error or a typed result,
 * and reset back to the setup panel.
 */
export function useAgentRun<TPayload, TResult>(endpoint: string) {
  const [result, setResult] = useState<TResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (payload: TPayload) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Server error: " + response.status);
        }
        setResult((await response.json()) as TResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, run, reset };
}
