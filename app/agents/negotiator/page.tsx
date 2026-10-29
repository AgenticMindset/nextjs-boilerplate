import AgentShell, { agentMetadata } from "../../components/agents/AgentShell";
import { getAgent } from "../../../lib/agents/registry";
import NegotiatorClient from "./NegotiatorClient";

const agent = getAgent("negotiator")!;

export const metadata = agentMetadata(agent);

export default function NegotiatorPage() {
  return (
    <AgentShell agent={agent}>
      <NegotiatorClient />
    </AgentShell>
  );
}
