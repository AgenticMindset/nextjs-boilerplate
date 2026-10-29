import Link from "next/link";
import type { AgentDefinition } from "../../../lib/agents/registry";

interface AgentCardProps {
  agent: AgentDefinition;
  /** Staggers the entrance animation across the grid. */
  delay?: number;
}

export default function AgentCard({ agent, delay = 1 }: AgentCardProps) {
  // The whole card is the link, so there is one tab stop and one accessible
  // name per agent rather than a card full of separately focusable fragments.
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className={`agent-card animate-in animate-in--delay-${Math.min(delay, 3)}`}
    >
      {agent.eyebrow && <p className="agent-card__eyebrow">{agent.eyebrow}</p>}
      <h2 className="agent-card__title">{agent.name}</h2>
      <p className="agent-card__tagline">{agent.tagline}</p>
      <div className="agent-card__facts">
        {agent.facts.map((fact) => (
          <div key={fact.label} className="agent-card__fact">
            <span className="agent-card__fact-value">{fact.value}</span>
            <span className="agent-card__fact-label">{fact.label}</span>
          </div>
        ))}
      </div>
      <span className="agent-card__cta">{agent.cta}</span>
    </Link>
  );
}
