import Image from "next/image";
import ChatInterface from "./components/ChatInterface";

export default function AgentsPage() {
  return (
    <section className="work-wrapper">
      <Image
        src="/agents-bg.jpg"
        alt=""
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        quality={85}
      />
      <div className="work-wrapper__overlay" />
      <div className="work-wrapper__content">
        {/* Intro */}
        <div className="work-header" style={{ maxWidth: "100%" }}>
          <p className="work-header__greeting animate-in">AI Agent Demo</p>
          <h1 className="work-header__title animate-in animate-in--delay-1">
            Open Source Tech Stack Advisor
          </h1>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            This AI Agent takes your product idea, gathers requirements through
            conversation, then autonomously calls three tools to deliver a
            structured tech stack recommendation, monthly cost estimate, and
            visual architecture diagram. All open-source-first.
          </p>
        </div>

        {/* Chat */}
        <div className="animate-in animate-in--delay-3">
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
                <span className="metric__value" style={{ fontSize: "0.85rem" }}>Llama 3.3 70B</span>
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
      </div>
    </section>
  );
}