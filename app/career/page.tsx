import Image from "next/image";
export default function Work() {
  return (
    <section className="work-wrapper">
      <Image
        src="/build-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
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
            From banking consultant to founder of startups developing infrastructure for AI agents or decentralized platforms, each project 
            taught me something different about operating at the intersection of new technology and enterprise adoption.
          </p>
        </div>
        {/* Work cards */}
        <div className="work-grid">
          {/* StyleAI */}
          <article className="work-card animate-in">
            <div className="work-card__header">
              <div className="work-card__meta">
                <span className="work-card__period">September 2025 — October 2026 </span>
                <span className="work-card__dot" />
                <span className="work-card__role">Co-Founder</span>
              </div>
              <h2 className="work-card__title">
                <a href="https://www.styleai.me/" target="_blank" rel="noopener noreferrer">
                  StyleAI
                </a>
              </h2>
              <p className="work-card__tagline">
                AI commerce infrastructure for mid-market retailers. StyleAI
                combines AI-driven product discovery and
                agentic commerce tools to increase contribution margins and
                AI-native demand.
              </p>
            </div>
            <div className="work-card__body">
              <h4 className="work-card__section-title">Role</h4>
              <p className="work-card__text">
                Drive product strategy and operating model of an AI-native startup building 
                a multi-agent system and agentic commerce tools for SMBs.
              </p>
              <p className="work-card__text">
                Lead GTM execution and structure the pre-seed round. Keynote speaker at{" "}
                <a href="https://www.linkedin.com/posts/alvarogonzalezalcaniz_agenticai-ecommerce-fashiontech-activity-7395188611207417856-3wJV?utm_source=share&utm_medium=member_desktop&rcm=ACoAAA7U6bAB8adi3qm1xzlFF_qbMbZWvQZV5JU" target="_blank" rel="noopener noreferrer">MLOps Community</a>,{" "}
                <a href="https://www.linkedin.com/posts/alvarogonzalezalcaniz_afw2025-styleai-thecollectivesamsterdam-activity-7370376211908431872-OH6I?utm_source=share&utm_medium=member_desktop&rcm=ACoAAA7U6bAB8adi3qm1xzlFF_qbMbZWvQZV5JU" target="_blank" rel="noopener noreferrer">AFW</a>,{" "}
                <a href="https://www.linkedin.com/posts/alvarogonzalezalcaniz_worldaiweek-aiinfashion-aiinretail-activity-7381357973698191361-7Suy?utm_source=share&utm_medium=member_desktop&rcm=ACoAAA7U6bAB8adi3qm1xzlFF_qbMbZWvQZV5JU" target="_blank" rel="noopener noreferrer">WAiR</a>,{" "}
                <a href="https://www.linkedin.com/posts/alvarogonzalezalcaniz_ai-is-changing-how-we-shop-but-most-brands-activity-7406979638138195968-Pw42?utm_source=share&utm_medium=member_desktop&rcm=ACoAAA7U6bAB8adi3qm1xzlFF_qbMbZWvQZV5JU" target="_blank" rel="noopener noreferrer">Biz Riz</a>{""}.
              </p>
              <p className="work-card__text">
                Build operating model leveraging agent-driven workflows and local inference. Built Board of Advisors.
              </p>
              <div className="metrics-row">
                <div className="metric">
                  <span className="metric__value">Multi-Agent System</span>
                  <span className="metric__label">for H2A</span>
                </div>
                <div className="metric">
                  <span className="metric__value">EU & US</span>
                  <span className="metric__label">markets</span>
                </div>
                <div className="metric">
                  <span className="metric__value">Agentic Commerce tools</span>
                  <span className="metric__label"> for A2A</span>
                </div>
              </div>
              <h4 className="work-card__section-title">Skills</h4>
              <div className="work-card__tags">
                <span className="work-card__tag">Multi-Agent Systems</span>
                <span className="work-card__tag">Agentic Commerce Protocols</span>
                <span className="work-card__tag">AI B2B SaaS</span>
                <span className="work-card__tag">GTM</span>
                <span className="work-card__tag">Product Strategy</span>
                <span className="work-card__tag">Pre-seed Fundraising</span>
              </div>
            </div>
          </article>
          {/* Velatrix */}
          <article className="work-card animate-in">
            <div className="work-card__header">
              <div className="work-card__meta">
                <span className="work-card__period">Oct 2024 — Sept 2025</span>
                <span className="work-card__dot" />
                <span className="work-card__role">Co-Founder &amp; COO</span>
              </div>
              <h2 className="work-card__title">
                <a href="https://velatrix.tech/" target="_blank" rel="noopener noreferrer">
                  Velatrix
                </a>
              </h2>
              <p className="work-card__tagline">
                Web3 infrastructure for the digital content economy. 
                Velatrix is a blockchain-agnostic protocol enabling decentralized IP rights management. 
                It provides infrastructure where developers can deploy DApps, and AI-driven tools to help creators monetize their work.
              </p>
            </div>
            <div className="work-card__body">
              <h4 className="work-card__section-title">What I did</h4>
              <p className="work-card__text">
                Owned functional protocol design: operational standards, incentive
                systems, payment infrastructure, DAO transition,
                and tokenomics model.
              </p>
              <p className="work-card__text">
                Built operating model (governance, delegation, RACI, OKRs) incorporating agent-driven workflows (n8n, open-source LLM routing).
              </p>
              <p className="work-card__text">
                Built the GTM engine, led the creator onboarding to Watchit, our Web3 video DApp, and structured the seed fundraising round. 
              </p>
              <div className="metrics-row">
                <div className="metric">
                  <span className="metric__value">Blockchain Protocol</span>
                  <span className="metric__label">deployed in testnet</span>
                </div>
                <div className="metric">
                  <span className="metric__value">300+ creators</span>
                  <span className="metric__label">onboarded in our 1st DApp</span>
                </div>
                <div className="metric">
                  <span className="metric__value">$1.3M seed</span>
                  <span className="metric__label">round structured</span>
                </div>
              </div>
              <h4 className="work-card__section-title">Skills</h4>
              <div className="work-card__tags">
                <span className="work-card__tag">Decentralized Infrastructure</span>
                <span className="work-card__tag">Agent-Driven Content Discovery</span>
                <span className="work-card__tag">Operating Model</span>
                <span className="work-card__tag">GTM</span>
                <span className="work-card__tag">Seed Fundraising</span>
              </div>
            </div>
          </article>
          {/* Management Solutions */}
          <article className="work-card animate-in">
            <div className="work-card__header">
              <div className="work-card__meta">
                <span className="work-card__period">Jan 2013 — Dec 2024</span>
                <span className="work-card__dot" />
                <span className="work-card__role">Consultant to Senior Manager</span>
              </div>
              <h2 className="work-card__title">
                <a href="https://www.managementsolutions.com/en" target="_blank" rel="noopener noreferrer">
                  Management Solutions
                </a>
              </h2>
              <p className="work-card__tagline">
                Management Solutions is a global consulting firm specializing in
                business, risk, finance, and technology advisory for regulated
                industries. Founded in 2002 as a spin-off from Arthur Andersen,
                nowadays has more than 5,000+ professionals operating across 50+
                countries.
              </p>
            </div>
            <div className="work-card__body">
              <h4 className="work-card__section-title">What I did</h4>
              <p className="work-card__text">
                My consulting career spans 12 years across 6 EU markets, bridging experience in Blockchain solutions, Regulatory
                Compliance (advising the European Central Bank and multiple
                Global-Systemically Important Banks), Data Management, IT Risk,
                and Credit Risk IRB Modelling.
              </p>
              <p className="work-card__text">
                Project execution tasks were
                complemented with Business Development activities for
                Enterprise clients during the last 9 years.
              </p>
              <div className="metrics-row">
                <div className="metric">
                  <span className="metric__value">7 Top-tier Banks</span>
                  <span className="metric__label"> Advised</span>
                </div>
                <div className="metric">
                  <span className="metric__value">6 Inspections</span>
                  <span className="metric__label">steered </span>
                </div>
                <div className="metric">
                  <span className="metric__value">&euro;14M+ revenue</span>
                  <span className="metric__label">through consulting fees</span>
                </div>
              </div>
              <h4 className="work-card__section-title">Skills</h4>
              <div className="work-card__tags">
                <span className="work-card__tag">Blockchain Solutions</span>
                <span className="work-card__tag">Business Development</span>
                <span className="work-card__tag">Data Management</span>
                <span className="work-card__tag">Regulatory Governance</span>
                <span className="work-card__tag">IT &amp; Credit Risk Management</span>
              </div>
            </div>
          </article>
        </div>
        {/* Footer */}
        <footer className="footer">
          <p className="footer__text">
            Álvaro Tomás · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </section>
  );
}