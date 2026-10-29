import Link from "next/link";
import type { Metadata } from "next";
import {
  fullStack,
  type AgentDefinition,
} from "../../../lib/agents/registry";

interface AgentShellProps {
  agent: AgentDefinition;
  children: React.ReactNode;
}

/**
 * Shared chrome for every individual agent route: back link, heading, what the
 * agent does, the agent itself, then its limits and its stack. Replaces the
 * header that was duplicated inline across five pages, each with slightly
 * different spacing and colours.
 *
 * Deliberately not a <main>: the root layout already renders one, and two main
 * landmarks is invalid and confusing to screen readers.
 */
export default function AgentShell({ agent, children }: AgentShellProps) {
  const stack = fullStack(agent);

  return (
    <div className="agent-page">
      <Link href="/agents" className="agent-page__back">
        &larr; Back to Agents
      </Link>

      <div className="agent-page__header">
        {agent.eyebrow && <p className="agent-page__eyebrow">{agent.eyebrow}</p>}
        <h1 className="agent-page__title">{agent.name}</h1>
        <p className="agent-page__subtitle">{agent.intro}</p>
      </div>

      <ul className="agent-page__highlights">
        {agent.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      {children}

      <div className="agent-page__footer">
        <section className="agent-limits" aria-labelledby="limits">
          <h2 id="limits" className="agent-limits__title">
            What to expect
          </h2>
          <p className="agent-limits__body">{agent.limits}</p>
        </section>

        <section aria-labelledby="built-with">
          <h2 id="built-with" className="agent-limits__title">
            Built with
          </h2>
          {agent.usesSharedStack && agent.distinctiveStack.length > 0 && (
            <p className="agent-limits__body">
              Particular to this agent, on top of the shared foundation every
              agent here is built on.
            </p>
          )}
          <div className="metrics-row">
            {stack.map((item) => (
              <div key={item.name} className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>
                  {item.name}
                </span>
                <span className="metric__label">{item.role}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/** Builds the per-route metadata from the registry entry. */
export function agentMetadata(agent: AgentDefinition): Metadata {
  const title = `${agent.name} - Álvaro Tomás`;
  return {
    title,
    description: agent.metaDescription,
    openGraph: {
      title,
      description: agent.metaDescription,
      type: "website",
    },
  };
}
