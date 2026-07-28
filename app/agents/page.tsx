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
        {/* Market Entry Wargame */}
        <div className="work-header" style={{ maxWidth: "100%", marginBottom: "-3rem" }}>
          <h1 className="work-header__title animate-in animate-in--delay-1">
            Market Entry Wargame
          </h1>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            Define a market entry scenario and this RAG agent retrieves competitive
            intelligence from a pre-indexed knowledge base plus live search, then
            predicts how incumbents defend their position.
          </p>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            Every run reports an honest confidence level based on how much real coverage it found.
          </p>
        </div>
        <div className="work-card animate-in" style={{ marginTop: "0.1rem" }}>
          <div className="work-card__body" style={{ textAlign: "center", padding: "1rem 1.5rem" }}>
            <div className="metrics-row metrics-row--compact" style={{ marginBottom: "1.5rem" }}>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>4 Variables</span>
                <span className="metric__label">Market definition</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Hybrid RAG</span>
                <span className="metric__label">Corpus + live search</span>
              </div>
            </div>
            <a
              href="/agents/wargame"
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
              Launch Wargame
            </a>
          </div>
        </div>
        {/* Stack summary - Market Entry Wargame */}
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
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Pinecone</span>
                <span className="metric__label">Vector DB + embeddings</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Tavily</span>
                <span className="metric__label">Live search layer</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>GPT-OSS 120B</span>
                <span className="metric__label">LLM via Groq</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Zod</span>
                <span className="metric__label">Schema Validation</span>
              </div>
            </div>
          </div>
        </div>
        {/* Separator */}
        <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
          <div className="section__divider" />
        </div>
        {/* Token Economics Stress Tester */}
        <div className="work-header" style={{ maxWidth: "100%", marginBottom: "-3rem" }}>
          <h1 className="work-header__title animate-in animate-in--delay-1">
            Token Economics Stress Tester
          </h1>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            Select a token and a stress scenario, and this agent applies a
            stress-testing framework adapted from banking supervisory
            methodology (EBA/ECB) to predict how the token&apos;s economic
            design holds up.
          </p>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            One structured LLM call returns a resilience radar, a shock
            propagation cascade, and a historical failure analogue.
          </p>
        </div>
        <div className="work-card animate-in" style={{ marginTop: "0.1rem" }}>
          <div className="work-card__body" style={{ textAlign: "center", padding: "1rem 1.5rem" }}>
            <div className="metrics-row metrics-row--compact" style={{ marginBottom: "1.5rem" }}>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>5 Presets</span>
                <span className="metric__label">Or paste your own</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>5 Scenarios</span>
                <span className="metric__label">Stress archetypes</span>
              </div>
            </div>
            <a
              href="/agents/tokenomics"
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
              Launch Stress Tester
            </a>
          </div>
        </div>
        {/* Stack summary - Token Economics Stress Tester */}
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
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Recharts</span>
                <span className="metric__label">Radar Chart</span>
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
        {/* Voice Communication Coach */}
        <div className="work-header" style={{ maxWidth: "100%", marginBottom: "-3rem" }}>
          <h1 className="work-header__title animate-in animate-in--delay-1">
            Voice Communication Coach
          </h1>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            A voice-only agent: talk to it out loud for three short exchanges,
            and it replies by voice too. A reactive shader-and-particle orb
            reflects listening, thinking, and speaking states in real time.
          </p>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            Afterward it delivers spoken and written feedback on your
            communication, grounded only in metrics actually measured from
            your audio and transcript.
          </p>
        </div>
        <div className="work-card animate-in" style={{ marginTop: "0.1rem" }}>
          <div className="work-card__body" style={{ textAlign: "center", padding: "1rem 1.5rem" }}>
            <div className="metrics-row metrics-row--compact" style={{ marginBottom: "1.5rem" }}>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Adaptive</span>
                <span className="metric__label">Talk once, follow-ups only if needed</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Measured, not guessed</span>
                <span className="metric__label">Delivery metrics</span>
              </div>
            </div>
            <a
              href="/agents/voice-coach"
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
              Launch Voice Coach
            </a>
          </div>
        </div>
        {/* Stack summary - Voice Communication Coach */}
        <div className="work-card animate-in" style={{ marginTop: "2rem" }}>
          <div className="work-card__header">
            <h2 className="work-card__title">Built with</h2>
          </div>
          <div className="work-card__body">
            <div className="metrics-row">
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Whisper Large v3 Turbo</span>
                <span className="metric__label">STT via Groq</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>GPT-OSS 120B</span>
                <span className="metric__label">Conversation + feedback via Groq</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Kokoro-82M</span>
                <span className="metric__label">Open-source TTS via Replicate</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>react-three-fiber</span>
                <span className="metric__label">Shader + particle orb</span>
              </div>
              <div className="metric">
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Web Audio API</span>
                <span className="metric__label">Pitch, energy, pause analysis</span>
              </div>
            </div>
          </div>
        </div>
        {/* Separator */}
        <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
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
