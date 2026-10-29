import AgentShell, { agentMetadata } from "../../components/agents/AgentShell";
import { getAgent } from "../../../lib/agents/registry";
import LazyChatInterface from "../components/LazyChatInterface";

const agent = getAgent("tech-stack")!;

export const metadata = agentMetadata(agent);

export default function TechStackPage() {
  return (
    <AgentShell agent={agent}>
      <LazyChatInterface />
    </AgentShell>
  );
}
