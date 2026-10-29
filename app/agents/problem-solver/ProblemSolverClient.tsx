"use client";

import SetupPanel from "../../components/problem-solver/SetupPanel";
import ResultsPanel from "../../components/problem-solver/ResultsPanel";
import { AgentError, AgentLoading } from "../../components/agents/AgentStatus";
import { useAgentRun } from "../../components/agents/useAgentRun";
import type {
  ProblemSolverInput,
  ProblemSolverResult,
} from "../../../lib/problem-solver/types";

export default function ProblemSolverClient() {
  const { result, loading, error, run, reset } = useAgentRun<
    { input: ProblemSolverInput },
    ProblemSolverResult
  >("/api/problem-solver");

  return (
    <>
      {error && <AgentError message={error} />}
      {!result && !loading && <SetupPanel onRun={(input) => run({ input })} />}
      {loading && (
        <AgentLoading message="Diagnosing the problem and matching it to a framework..." />
      )}
      {result && !loading && <ResultsPanel result={result} onRerun={reset} />}
    </>
  );
}
