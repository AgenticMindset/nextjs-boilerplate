"use client";

import SetupPanel from "../../components/tokenomics/SetupPanel";
import ResultsPanel from "../../components/tokenomics/ResultsPanel";
import { AgentError, AgentLoading } from "../../components/agents/AgentStatus";
import { useAgentRun } from "../../components/agents/useAgentRun";
import type { StressTestInput, StressTestResult } from "../../../lib/tokenomics/types";

export default function TokenomicsClient() {
  const { result, loading, error, run, reset } = useAgentRun<
    { input: StressTestInput },
    StressTestResult
  >("/api/stress-test");

  return (
    <>
      {error && <AgentError message={error} />}
      {!result && !loading && <SetupPanel onRun={(input) => run({ input })} />}
      {loading && (
        <AgentLoading message="Running the stress scenario against the token's economic design..." />
      )}
      {result && !loading && <ResultsPanel result={result} onRerun={reset} />}
    </>
  );
}
