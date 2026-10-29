import AgentShell, { agentMetadata } from "../../components/agents/AgentShell";
import { getAgent } from "../../../lib/agents/registry";
import VoiceSession from "../../components/voice-coach/VoiceSession";

const agent = getAgent("voice-coach")!;

export const metadata = agentMetadata(agent);

export default function VoiceCoachPage() {
  return (
    <AgentShell agent={agent}>
      <VoiceSession />
    </AgentShell>
  );
}
