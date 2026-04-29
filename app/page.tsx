export default function Home() {
  return (
    <div className="page-container">
      {/* Hero */}
      <section className="hero">
        <p className="hero__greeting animate-in">Amsterdam, NL</p>
        <h1 className="hero__title animate-in animate-in--delay-1">
          Álvaro Tomás
          <br />
          González Alcañiz
        </h1>
        <p className="hero__subtitle animate-in animate-in--delay-2">
          Founder building at the intersection of{" "}
          <span className="hero__accent">AI agents</span>,{" "}
          <span className="hero__accent">blockchain</span>, and{" "}
          <span className="hero__accent">commerce</span>. Previously 12 years
          in banking consulting across Europe.
        </p>

        <div className="links-row animate-in animate-in--delay-3">
          <a
            href="https://www.linkedin.com/in/alvarogonzalezalcaniz"
            target="_blank"
            rel="noopener noreferrer"
            className="links-row__item"
          >
            LinkedIn
          </a>
          <a
            href="https://medium.com/@StyleAIofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="links-row__item"
          >
            Medium
          </a>
          <a
            href="https://github.com/AgenticMindset"
            target="_blank"
            rel="noopener noreferrer"
            className="links-row__item"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Professional arc */}
      <section className="section">
        <div className="section__divider" />
        <p className="section__label">The arc</p>

        <div className="arc">
          <div className="arc__item">
            <span className="arc__year">2025 -</span>
            <div className="arc__content">
              <h3>StyleAI</h3>
              <p>
                Co-Founder & CEO. Building AI commerce infrastructure for
                fashion retailers. Multi-agent systems for product discovery,
                styling, and conversion optimization.
              </p>
              <span className="arc__tag">AI Agents</span>
              <span className="arc__tag">Commerce</span>
              <span className="arc__tag">SaaS</span>
            </div>
          </div>

          <div className="arc__item">
            <span className="arc__year">2024</span>
            <div className="arc__content">
              <h3>Velatrix</h3>
              <p>
                Co-Founder & COO. Web3 infrastructure for decentralized IP
                distribution and AI-driven content monetization. Led operations,
                GTM, and fundraising.
              </p>
              <span className="arc__tag">Web3</span>
              <span className="arc__tag">Protocol Design</span>
              <span className="arc__tag">Tokenomics</span>
            </div>
          </div>

          <div className="arc__item">
            <span className="arc__year">2013 - 24</span>
            <div className="arc__content">
              <h3>Management Solutions</h3>
              <p>
                From Consultant to Senior Manager over 12 years. Credit risk
                modeling, regulatory inspections (ECB), data governance, and
                blockchain business development. Deployed across Madrid,
                Frankfurt, Helsinki, London, and Amsterdam.
              </p>
              <span className="arc__tag">Banking</span>
              <span className="arc__tag">Risk</span>
              <span className="arc__tag">Blockchain</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer__text">
          Álvaro Tomás González Alcañiz · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
