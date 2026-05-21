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
            From AI agent systems for retail SMBs, to decentralized blockchain
            protocols and regulatory frameworks for systemically important banks
            around the globe. Each project taught me something different about
            building at the edge of new technology.
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
                <span className="work-card__role">Co-Founder &amp; CEO</span>
              </div>
              <h2 className="work-card__title">
                <a href="https://www.styleai.me/" target="_blank" rel="noopener noreferrer">
                  StyleAI
                </a>
              </h2>
              <p className="work-card__tagline">
                AI commerce infrastructure for mid-market retailers. StyleAI
                combines deep brand personalization with AI product discovery and
                agentic commerce tools to increase contribution margins and
                AI-native demand.
              </p>
            </div>
            <div className="work-card__body">
              <h4 className="work-card__section-title">What I did</h4>
              <p className="work-card__text">
                Defined vision and operating model of an AI-native startup,
                including product development roadmap, and GTM strategy for an
                AI-native B2B SaaS targeting retail SMBs. Designed a multi-agent
                system for AI-driven styling and upselling. Structured our
                Pre-Seed Fundraising round, managing VC relations. Built Board
                of Advisors and led the reporting cadence. Keynote speaker at{" "}
                <a href="https://www.linkedin.com/posts/alvarogonzalezalcaniz_agenticai-ecommerce-fashiontech-activity-7395188611207417856-3wJV?utm_source=share&utm_medium=member_desktop&rcm=ACoAAA7U6bAB8adi3qm1xzlFF_qbMbZWvQZV5JU" target="_blank" rel="noopener noreferrer">MLOps Community</a>,{" "}
                <a href="https://www.linkedin.com/posts/alvarogonzalezalcaniz_afw2025-styleai-thecollectivesamsterdam-activity-7370376211908431872-OH6I?utm_source=share&utm_medium=member_desktop&rcm=ACoAAA7U6bAB8adi3qm1xzlFF_qbMbZWvQZV5JU" target="_blank" rel="noopener noreferrer">AFW</a>,{" "}
                <a href="https://www.linkedin.com/posts/alvarogonzalezalcaniz_worldaiweek-aiinfashion-aiinretail-activity-7381357973698191361-7Suy?utm_source=share&utm_medium=member_desktop&rcm=ACoAAA7U6bAB8adi3qm1xzlFF_qbMbZWvQZV5JU" target="_blank" rel="noopener noreferrer">WAiR</a>,{" "}
                <a href="https://www.linkedin.com/posts/alvarogonzalezalcaniz_ai-is-changing-how-we-shop-but-most-brands-activity-7406979638138195968-Pw42?utm_source=share&utm_medium=member_desktop&rcm=ACoAAA7U6bAB8adi3qm1xzlFF_qbMbZWvQZV5JU" target="_blank" rel="noopener noreferrer">Biz Riz</a>{" "}
                on agentic commerce.
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
                  <span className="metric__value">$600K</span>
                  <span className="metric__label">Pre-seed round</span>
                </div>
              </div>
              <h4 className="work-card__section-title">Skills</h4>
              <div className="work-card__tags">
                <span className="work-card__tag">Multi-Agent Systems</span>
                <span className="work-card__tag">Agentic Commerce Protocols</span>
                <span className="work-card__tag">AI B2B SaaS</span>
                <span className="work-card__tag">GTM Strategy</span>
                <span className="work-card__tag">Business Dev.</span>
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
                Web3 infrastructure for the digital content economy. A modular
                blockchain protocol to help digital creators manage their
                Intellectual Property rights, along with AI-driven tools to help
                creators maximize content monetization.
              </p>
            </div>
            <div className="work-card__body">
              <h4 className="work-card__section-title">What I did</h4>
              <p className="work-card__text">
                Steered economic design of a blockchain protocol: incentive
                systems, payment infrastructure, DAO transition strategy,
                tokenomics (utility, treasury logic). Led GTM strategy &amp;
                partnerships, onboarding 300+ creators to{" "}
                <a href="https://watchit.movie/" target="_blank" rel="noopener noreferrer">Watchit</a>,
                our Web3 video platform. Structured the Seed Fundraising round
                and managed VC relationships. Built operating system: OKRs,
                coordination across Product, Legal, Business. Built and reported
                to our Board of Advisors.
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
              </div>
              <h4 className="work-card__section-title">Skills</h4>
              <div className="work-card__tags">
                <span className="work-card__tag">Blockchain Protocol Design</span>
                <span className="work-card__tag">Tokenomics Design</span>
                <span className="work-card__tag">AI-Driven Discovery</span>
                <span className="work-card__tag">DAO Governance</span>
                <span className="work-card__tag">GTM Strategy</span>
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
                My career in consulting spans 12 years across 6 EU markets and
                the U.S., bridging experience in Blockchain solutions, Regulatory
                Compliance (advising the European Central Bank and multiple
                Global-Systemically Important Banks), Data Management, IT Risk,
                and Credit Risk IRB Modelling. My involvement in projects was
                complemented with parallel Business Development activities for
                Enterprise clients.
              </p>
              <div className="metrics-row">
                <div className="metric">
                  <span className="metric__value">7</span>
                  <span className="metric__label">Tier 1 Banks Advised</span>
                </div>
                <div className="metric">
                  <span className="metric__value">&euro;600B+</span>
                  <span className="metric__label">Inspected Portfolio Size</span>
                </div>
                <div className="metric">
                  <span className="metric__value">+20 People</span>
                  <span className="metric__label">Team managed</span>
                </div>
              </div>
              <h4 className="work-card__section-title">Skills</h4>
              <div className="work-card__tags">
                <span className="work-card__tag">Blockchain Solutions</span>
                <span className="work-card__tag">Business Development</span>
                <span className="work-card__tag">Data Management</span>
                <span className="work-card__tag">Credit Risk IRB</span>
                <span className="work-card__tag">Corporate Governance</span>
                <span className="work-card__tag">Banking Regulation</span>
                <span className="work-card__tag">Executive Management Reporting</span>
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