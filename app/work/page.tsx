export default function Work() {
  return (
    <div className="page-container page-container--wide">
      {/* Header */}
      <section className="hero">
        <p className="hero__greeting animate-in">Selected work</p>
        <h1
          className="hero__title animate-in animate-in--delay-1"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          Things I&apos;ve built
        </h1>
        <p className="hero__subtitle animate-in animate-in--delay-2">
          From regulatory frameworks for Europe&apos;s largest banks to AI agent
          systems for fashion retail. Each project taught me something different
          about building at the edge of new technology.
        </p>
      </section>

      {/* Work cards */}
      <div className="work-grid">
        {/* StyleAI */}
        <article className="work-card animate-in">
          <div className="work-card__header">
            <div className="work-card__meta">
              <span className="work-card__period">Sept 2025 - Present</span>
              <span className="work-card__dot" />
              <span className="work-card__role">Co-Founder & CEO</span>
            </div>
            <h2 className="work-card__title">StyleAI</h2>
            <p className="work-card__tagline">
              AI commerce infrastructure for fashion retailers. Combining deep
              brand personalization with AI product discovery and agentic
              commerce tools to increase margins and AI-native demand.
            </p>
          </div>
          <div className="work-card__body">
            <h4 className="work-card__section-title">What I did</h4>
            <p className="work-card__text">
              Architected the go-to-market strategy for an AI-native SaaS
              platform targeting reduction in return rates through autonomous
              style agents. Defined the vision, strategy, and product roadmap.
              Spearheaded the development of multi-agent systems for automated
              customer journey mapping. Led fundraising strategy for a
              &euro;1.5M seed round, managing relations with Tier-1 EU and US
              VCs. Built and managed the cross-functional founding team across
              AI engineering, data science, product, and business.
            </p>

            <div className="metrics-row">
              <div className="metric">
                <span className="metric__value">30%</span>
                <span className="metric__label">AOV increase</span>
              </div>
              <div className="metric">
                <span className="metric__value">20%</span>
                <span className="metric__label">Return rate reduction</span>
              </div>
              <div className="metric">
                <span className="metric__value">&euro;1.5M</span>
                <span className="metric__label">Seed round target</span>
              </div>
            </div>

            <h4 className="work-card__section-title">Key topics</h4>
            <div className="work-card__tags">
              <span className="work-card__tag">Multi-Agent Systems</span>
              <span className="work-card__tag">Agentic Commerce</span>
              <span className="work-card__tag">Semantic Product Discovery</span>
              <span className="work-card__tag">Conversational UI</span>
              <span className="work-card__tag">Fashion Retail</span>
              <span className="work-card__tag">GTM Strategy</span>
            </div>
          </div>
        </article>

        {/* Velatrix */}
        <article className="work-card animate-in">
          <div className="work-card__header">
            <div className="work-card__meta">
              <span className="work-card__period">Nov 2024 - Sept 2025</span>
              <span className="work-card__dot" />
              <span className="work-card__role">Co-Founder & COO</span>
            </div>
            <h2 className="work-card__title">Velatrix</h2>
            <p className="work-card__tagline">
              Web3 infrastructure for the digital content economy. A modular
              blockchain protocol to help digital creators manage their
              Intellectual Property, with AI-driven monetization tools.
            </p>
          </div>
          <div className="work-card__body">
            <h4 className="work-card__section-title">What I did</h4>
            <p className="work-card__text">
              Built the core governance and operating model (OKRs, processes,
              governance) for a cross-functional team of 8. Negotiated key
              integrations with Web3 and AI content platforms including Halborn,
              Hypernative, and Flowdesk. Led the economic and strategic design of
              the Synapse Protocol, a blockchain-agnostic system for
              decentralized content distribution. Designed tokenomics, vesting
              schedules, and DAO governance architecture. Structured the $1.3M
              seed round with financial projections and market positioning within
              the $400B+ digital media market.
            </p>

            <div className="metrics-row">
              <div className="metric">
                <span className="metric__value">300+</span>
                <span className="metric__label">Creators onboarded</span>
              </div>
              <div className="metric">
                <span className="metric__value">$1.3M</span>
                <span className="metric__label">Seed round</span>
              </div>
              <div className="metric">
                <span className="metric__value">8</span>
                <span className="metric__label">Team members</span>
              </div>
            </div>

            <h4 className="work-card__section-title">Key topics</h4>
            <div className="work-card__tags">
              <span className="work-card__tag">Protocol Design</span>
              <span className="work-card__tag">Tokenomics</span>
              <span className="work-card__tag">DAO Governance</span>
              <span className="work-card__tag">Creator Economy</span>
              <span className="work-card__tag">IP Rights</span>
              <span className="work-card__tag">AI Content Discovery</span>
            </div>
          </div>
        </article>

        {/* Management Solutions */}
        <article className="work-card animate-in">
          <div className="work-card__header">
            <div className="work-card__meta">
              <span className="work-card__period">Jan 2013 - Dec 2024</span>
              <span className="work-card__dot" />
              <span className="work-card__role">
                Consultant to Senior Manager
              </span>
            </div>
            <h2 className="work-card__title">Management Solutions</h2>
            <p className="work-card__tagline">
              12 years in banking consulting across Europe. Credit risk modeling,
              regulatory inspections, data governance, and blockchain business
              development for Global Systemically Important Banks.
            </p>
          </div>
          <div className="work-card__body">
            <h4 className="work-card__section-title">What I did</h4>
            <p className="work-card__text">
              Led the development of Credit Risk IRB models for strategic
              portfolios exceeding &euro;150B in exposure. Spearheaded 6
              regulatory ECB inspections, coordinating 80+ stakeholders from 12
              departments. Directed blockchain business development, creating
              partnerships with Ripple, Adhara, Calypso, and Coinffeine. Built
              business cases for RWA tokenization, treasury management, and
              legacy IT replacement with blockchain solutions. Defined
              bank-wide data management frameworks including governance,
              ownership, taxonomy, and quality assessment. Coached 25+
              colleagues on complex problem-solving and strategic leadership.
            </p>

            <div className="metrics-row">
              <div className="metric">
                <span className="metric__value">6</span>
                <span className="metric__label">ECB inspections</span>
              </div>
              <div className="metric">
                <span className="metric__value">&euro;150B+</span>
                <span className="metric__label">Portfolio exposure</span>
              </div>
              <div className="metric">
                <span className="metric__value">80+</span>
                <span className="metric__label">Stakeholders managed</span>
              </div>
              <div className="metric">
                <span className="metric__value">5</span>
                <span className="metric__label">European cities</span>
              </div>
            </div>

            <h4 className="work-card__section-title">Key topics</h4>
            <div className="work-card__tags">
              <span className="work-card__tag">Credit Risk IRB</span>
              <span className="work-card__tag">ECB Regulatory</span>
              <span className="work-card__tag">Data Governance</span>
              <span className="work-card__tag">BCBS 239</span>
              <span className="work-card__tag">Blockchain Strategy</span>
              <span className="work-card__tag">RWA Tokenization</span>
              <span className="work-card__tag">IT Risk</span>
            </div>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="footer__text">
          Álvaro Tomás González Alcañiz · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
