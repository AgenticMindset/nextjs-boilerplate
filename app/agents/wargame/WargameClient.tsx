"use client";

import WargameSetupPanel from "../../components/wargame/WargameSetupPanel";
import WargameOutputView from "../../components/wargame/WargameOutputView";
import { AgentError, AgentLoading } from "../../components/agents/AgentStatus";
import { useAgentRun } from "../../components/agents/useAgentRun";
import type { MarketDefinition, WargameResult } from "../../../lib/wargame/types";

export default function WargameClient() {
  const { result, loading, error, run, reset } = useAgentRun<
    { market: MarketDefinition },
    WargameResult
  >("/api/wargame");

  return (
    <>
      {error && <AgentError message={error} />}
      {!result && !loading && (
        <WargameSetupPanel onRun={(market) => run({ market })} />
      )}
      {loading && (
        <AgentLoading
          message="Querying the knowledge base, pulling live market data, and running the simulation..."
          hint="This takes 10-20 seconds."
        />
      )}
      {result && !loading && (
        <WargameOutputView result={result} onReset={reset} />
      )}
    </>
  );
}
