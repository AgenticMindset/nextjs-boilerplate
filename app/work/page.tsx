import Image from "next/image";

export default function Work() {
  return (
    <section className="work-wrapper">
      <Image
        src="/work-bg.jpg"
        alt=""
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        quality={85}
      />
      <div className="work-wrapper__overlay" />
      <div className="work-wrapper__content">
        {/* Header */}
        <div className="work-header">
          <p className="work-header__greeting animate-in">Selected work</p>
          <h1 className="work-header__title animate-in animate-in--delay-1">
            Things I&apos;ve built
          </h1>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            From regulatory frameworks for Europe&apos;s largest banks to AI
            agent systems for fashion retail. Each project taught me something
            different about building at the edge of new technology.
          </p>
        </div>

        {/* Work cards */}
        <div className="work-grid">
          {/* StyleAI */}
          <article className="work-card animate-in">
            <div className="work-card__header">
              <div className="work-card__meta">
                <span className="work-card__period">Sept 2025 — Present</span>
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
                Defined company vision, product strategy, and GTM strategy for
                an AI-native B2B SaaS targeting small-to-mid market retailers.
                Designed a multi-agent system covering semantic discovery, AI
                styling, and agentic upsell. Structured a &euro;600K pre-seed
                fundraise, managing relations with EU & US VCs. Managed
                founding team (AI engineering, Product) and built a 3-person
                Board of Advisors. Partnership launch at Amsterdam Fashion
                Week 2025. Keynote speaker at MLOps Community and WAiR on
                agentic commerce.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <span className="metric__value">12%</span>
                  <span className="metric__label">AOV increase</span>
                </div>
                <div className="metric">
                  <span className="metric__value">20%</span>
                  <span className="metric__label">Returns reduction</span>
                </div>
                <div className="metric">
                  <span className="metric__value">&euro;600K</span>
                  <span className="metric__label">Pre-seed raised</span>
                </div>
              </div>

              <h4 className="work-card__section-title">Key topics</h4>
              <div className="work-card__tags">
                <span className="work-card__tag">Multi-Agent Systems</span>
                <span className="work-card__tag">Agentic Commerce</span>
                <span className="work-card__tag">
                  Semantic Product Discovery
                </span>
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
                <span className="work-card__period">
                  Oct 2024 — Sept 2025
                </span>
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
                integrations with Web3 and AI content platforms including
                Halborn, Hypernative, and Flowdesk. Led the economic and
                strategic design of the Synapse Protocol, a blockchain-agnostic
                system for decentralized content distribution. Designed
                tokenomics, vesting schedules, and DAO governance architecture.
                Structured the $1.3M seed round with financial projections and
                market positioning within the $400B+ digital media market.
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
                <span className="work-card__period">
                  Jan 2013 — Dec 2024
                </span>
                <span className="work-card__dot" />
                <span className="work-card__role">
                  Consultant to Senior Manager
                </span>
              </div>
              <h2 className="work-card__title">Management Solutions</h2>
              <p className="work-card__tagline">
                12 years in banking consulting across Europe. Credit risk
                modeling, regulatory inspections, data governance, and blockchain
                business development for Global Systemically Important Banks.
              </p>
            </div>
            <div className="work-card__body">
              <h4 className="work-card__section-title">What I did</h4>
              <p className="work-card__text">
                As Senior Manager, managed an 18-person team to build the
                firm&apos;s blockchain practice, forging partnerships with Ripple,
                Adhara, Calypso, and Coinffeine. Led credit risk IRB model
                development for portfolios over &euro;120B EAD. As Manager,
                served as bank&apos;s lead for 6 regulatory ECB inspections,
                defining a governance model coordinating 80+ stakeholders
                from 15 departments. Advised the European Central Bank as
                specialist in IT Risk & Data Management across 3 inspections,
                raising 22 critical findings. As Consultant, deployed bank-wide
                data management function at a EU G-SIB implementing BCBS 239
                requirements.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <span className="metric__value">6</span>
                  <span className="metric__label">ECB inspections</span>
                </div>
                <div className="metric">
                  <span className="metric__value">&euro;120B+</span>
                  <span className="metric__label">Portfolio EAD</span>
                </div>
                <div className="metric">
                  <span className="metric__value">22</span>
                  <span className="metric__label">Critical findings</span>
                </div>
                <div className="metric">
                  <span className="metric__value">18</span>
                  <span className="metric__label">Team managed</span>
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
    </section>
  );
}
