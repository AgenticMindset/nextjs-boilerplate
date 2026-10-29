import AgentShell, { agentMetadata } from "../../components/agents/AgentShell";
import { getAgent } from "../../../lib/agents/registry";
import WargameClient from "./WargameClient";

const agent = getAgent("wargame")!;

export const metadata = agentMetadata(agent);

export default function WargamePage() {
  return (
    <AgentShell agent={agent}>
      <WargameClient />
    </AgentShell>
  );
}
