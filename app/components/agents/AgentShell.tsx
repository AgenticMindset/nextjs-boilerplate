import Link from "next/link";
import type { Metadata } from "next";
import {
  fullStack,
  type AgentDefinition,
} from "../../../lib/agents/registry";
import { AUTHOR_NAME, SITE_NAME, absoluteUrl } from "../../../lib/site";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentJsonLd(agent)) }}
      />
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
  const path = `/agents/${agent.slug}`;
  return {
    title,
    description: agent.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: agent.metaDescription,
      url: path,
      type: "website",
    },
    twitter: { title, description: agent.metaDescription },
  };
}

/**
 * SoftwareApplication, because that is what each of these is: a thing you can
 * run, free, in a browser. The registry already states the name, the pitch and
 * whether it is runnable here, so the structured data says the same as the page
 * rather than a second, drifting description of it.
 */
function agentJsonLd(agent: AgentDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: agent.name,
    applicationCategory: "BusinessApplication",
    description: agent.metaDescription,
    url: absoluteUrl(`/agents/${agent.slug}`),
    author: { "@type": "Person", name: AUTHOR_NAME, url: absoluteUrl("/") },
    publisher: { "@type": "Person", name: AUTHOR_NAME },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
    // Every runnable agent here is browser-based and costs nothing to try.
    ...(agent.medium === "video"
      ? {}
      : {
          operatingSystem: "Web browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
    featureList: agent.highlights,
  };
}
