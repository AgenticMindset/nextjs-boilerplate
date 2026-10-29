import AgentShell, { agentMetadata } from "../../components/agents/AgentShell";
import { getAgent } from "../../../lib/agents/registry";
import ProblemSolverClient from "./ProblemSolverClient";

const agent = getAgent("problem-solver")!;

export const metadata = agentMetadata(agent);

export default function ProblemSolverPage() {
  return (
    <AgentShell agent={agent}>
      <ProblemSolverClient />
    </AgentShell>
  );
}
