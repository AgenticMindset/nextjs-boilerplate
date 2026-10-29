import type { Metadata } from "next";
import Image from "next/image";
import AgentCard from "../components/agents/AgentCard";
import { AGENTS_BY_ORDER, SHARED_STACK } from "../../lib/agents/registry";
import {
  ENGINEERING_PRACTICES,
  FREE_TIER_NOTE,
} from "../../lib/agents/engineering";
import { AGENTS_BG_BLUR } from "../../lib/images/blur";

export const metadata: Metadata = {
  title: "AI Agents - Álvaro Tomás",
  description:
    "Six AI agents you can run in the browser plus one deployed client system, built on open-weights models and free infrastructure, with guardrails, tracing and evals in the open.",
};

export default function AgentsPage() {
  return (
    <section className="work-wrapper" id="top">
      <Image
        src="/agents-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
        quality={85}
        placeholder="blur"
        blurDataURL={AGENTS_BG_BLUR}
      />
      <div className="work-wrapper__overlay" />
      <div className="work-wrapper__content">
        <div className="agents-intro">
          <h1 className="agents-intro__title animate-in">AI Agents</h1>
          <p className="agents-intro__lede animate-in animate-in--delay-1">
            Six agents you can run right now in the browser, and one deployed in
            a client&apos;s storefront. They are built to be looked at, not just
            tried: each one states what it measured, what it assumed, and where
            its answer stops being worth trusting.
          </p>
        </div>

        <div className="agents-grid">
          {AGENTS_BY_ORDER.map((agent, index) => (
            <AgentCard key={agent.slug} agent={agent} delay={index % 3} />
          ))}
        </div>

        <section className="agents-section" aria-labelledby="foundation">
          <h2 id="foundation" className="agents-section__title">
            Shared foundation
          </h2>
          <p className="agents-section__lede">
            Every agent on this site runs on the same base, so each one&apos;s
            own page lists only what is particular to it.
          </p>
          <div className="metrics-row">
            {SHARED_STACK.map((item) => (
              <div key={item.name} className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>
                  {item.name}
                </span>
                <span className="metric__label">{item.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="agents-section" aria-labelledby="engineering">
          <h2 id="engineering" className="agents-section__title">
            How these are engineered
          </h2>
          <p className="agents-section__lede">
            The interesting part of an agent is rarely the prompt. It is what
            happens around it.
          </p>
          <div className="practice-grid">
            {ENGINEERING_PRACTICES.map((practice) => (
              <div key={practice.title} className="practice">
                <h3 className="practice__title">{practice.title}</h3>
                <p className="practice__body">{practice.body}</p>
              </div>
            ))}
          </div>
          <p className="agents-note">{FREE_TIER_NOTE}</p>
        </section>
      </div>
    </section>
  );
}
