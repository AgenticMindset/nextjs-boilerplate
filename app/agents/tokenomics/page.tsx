import AgentShell, { agentMetadata } from "../../components/agents/AgentShell";
import { getAgent } from "../../../lib/agents/registry";
import TokenomicsClient from "./TokenomicsClient";

const agent = getAgent("tokenomics")!;

export const metadata = agentMetadata(agent);

export default function TokenomicsPage() {
  return (
    <AgentShell agent={agent}>
      <TokenomicsClient />
    </AgentShell>
  );
}
