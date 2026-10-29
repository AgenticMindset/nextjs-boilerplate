import AgentShell, { agentMetadata } from "../../components/agents/AgentShell";
import { getAgent } from "../../../lib/agents/registry";

const agent = getAgent("styleai")!;

export const metadata = agentMetadata(agent);

export default function StyleAIPage() {
  return (
    <AgentShell agent={agent}>
      <div className="work-card">
        <div className="agent-video">
          <iframe
            src={`https://www.youtube.com/embed/${agent.videoId}`}
            title={`${agent.name} demo`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </AgentShell>
  );
}
