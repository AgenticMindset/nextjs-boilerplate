import Image from "next/image";
import ChatInterface from "./components/ChatInterface";
export default function AgentsPage() {
  return (
    <section className="work-wrapper" id="top">
      <Image
        src="/agents-bg.jpg"
        alt=""
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        quality={85}
      />
      <div className="work-wrapper__overlay" />
      <div className="work-wrapper__content">
        {/* Negotiation Simulator */}
        <div className="work-header" style={{ maxWidth: "100%", marginBottom: "-3rem" }}>
          <h1 className="work-header__title animate-in animate-in--delay-1">
            Agent-to-Agent Negotiation Simulator
          </h1>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            Two AI agents negotiate a B2B SaaS deal in real time.
            Each agent has its own system prompt, private constraints, and
            independent reasoning.
          </p>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            Configure the scenario, watch the negotiation unfold round by round, and see the outcome.
          </p>
        </div>
        <div className="work-card animate-in" style={{ marginTop: "0.1rem" }}>
          <div className="work-card__body" style={{ textAlign: "center", padding: "1rem 1.5rem" }}>
            <div className="metrics-row metrics-row--compact" style={{ marginBottom: "1.5rem" }}>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>2 Agents</span>
                <span className="metric__label">Independent LLM calls</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>6 Rounds</span>
                <span className="metric__label">Live negotiation</span>
              </div>
            </div>
            <a
              href="/agents/negotiator"
              style={{
                display: "inline-block",
                padding: "14px 36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #d4af37, #b8962e)",
                color: "#000",
                fontSize: "1rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              Launch Simulator
            </a>
          </div>
        </div>
        {/* Stack summary - Negotiation Simulator */}
        <div className="work-card animate-in" style={{ marginTop: "2rem" }}>
          <div className="work-card__header">
            <h2 className="work-card__title">Built with</h2>
          </div>
          <div className="work-card__body">
            <div className="metrics-row">
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Next.js 16</span>
                <span className="metric__label">Framework</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>GPT-OSS 120B</span>
                <span className="metric__label">LLM via Groq</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Vercel AI SDK</span>
                <span className="metric__label">Structured Output</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Zod</span>
                <span className="metric__label">Schema Validation</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Upstash Redis</span>
                <span className="metric__label">Rate Limiting</span>
              </div>
            </div>
          </div>
        </div>
        {/* Separator */}
        <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
          <div className="section__divider" />
        </div>
        {/* Tech Stack Advisor */}
        <div className="work-header" style={{ maxWidth: "100%" }}>
          <p className="work-header__greeting animate-in">AI Agent Demo</p>
          <h1 className="work-header__title animate-in animate-in--delay-1">
            Open Source Tech Stack Advisor
          </h1>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            This AI Agent takes your product idea, gathers requirements through
            conversation, then autonomously calls three tools to deliver:
          </p>
          <ul className="agents-features animate-in animate-in--delay-2">
              <li>A structured tech stack recommendation</li>
              <li>The monthly cost estimate</li>
              <li>A visual architecture diagram</li>
          </ul>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            All open-source-first. Enjoy it!
          </p>
        </div>
        {/* Chat */}
        <div className="animate-in animate-in--delay-3" style={{ marginTop: "-3rem" }}>
          <ChatInterface />
        </div>
        {/* Stack summary */}
        <div className="work-card animate-in" style={{ marginTop: "2rem" }}>
          <div className="work-card__header">
            <h2 className="work-card__title">Built with</h2>
          </div>
          <div className="work-card__body">
            <div className="metrics-row">
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Next.js 16</span>
                <span className="metric__label">Framework</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>GPT-OSS 120B</span>
                <span className="metric__label">LLM via Groq</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Vercel AI SDK</span>
                <span className="metric__label">Chat + Tools</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Mermaid.js</span>
                <span className="metric__label">Diagrams</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Upstash Redis</span>
                <span className="metric__label">Rate Limiting</span>
              </div>
            </div>
          </div>
        </div>
        {/* Separator */}
        <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <div className="section__divider" />
        </div>
        {/* StyleAI Agent Demo */}
        <div className="work-header" style={{ maxWidth: "100%" }}>
          <p className="work-header__greeting animate-in">Client Agent - Video Demo</p>
          <h1 className="work-header__title animate-in animate-in--delay-1">
            StyleAI Commerce Agent
          </h1>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            An agentic commerce system deployed in a client retail environment.
            The agent handles product discovery and offers brand-personalized styling and
            upselling through conversational AI, integrated directly into the
            retailer&apos;s storefront.
          </p>
        </div>
        {/* Video */}
        <div className="work-card animate-in" style={{ marginTop: "2rem", overflow: "hidden" }}>
          <div style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
          }}>
            <iframe
              src="https://www.youtube.com/embed/XS-DMn7mgjg"
              title="StyleAI Commerce Agent Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
        </div>
        {/* Stack summary - StyleAI */}
        <div className="work-card animate-in" style={{ marginTop: "2rem" }}>
          <div className="work-card__header">
            <h2 className="work-card__title">Built with</h2>
          </div>
          <div className="work-card__body">
            <div className="metrics-row">
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>TypeScript</span>
                <span className="metric__label">Monorepo</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Hono</span>
                <span className="metric__label">Backend</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>SolidJS</span>
                <span className="metric__label">Widget + Admin</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Google Gemini</span>
                <span className="metric__label">AI Engine</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>PostgreSQL</span>
                <span className="metric__label">Database</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
