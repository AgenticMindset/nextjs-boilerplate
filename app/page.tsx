import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero with background image */}
      <section className="hero-wrapper">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
          quality={85}
        />
        <div className="hero-wrapper__overlay" />
        <div className="hero-wrapper__content">
          <p className="hero__greeting animate-in">Amsterdam, NL</p>
          <h1 className="hero__title animate-in animate-in--delay-1">
            Álvaro Tomás
            <br />
            González Alcañiz
          </h1>
          <p className="hero__subtitle animate-in animate-in--delay-2">
            Operator-founder bridging{" "}
            <span className="hero__accent">AI agent systems</span>,{" "}
            <span className="hero__accent">blockchain</span>, and{" "}
            <span className="hero__accent">commerce infrastructure</span>.
            14 years across agentic commerce, Web3 infrastructure, and
            regulatory consulting spanning 6 EU markets and the U.S.
          </p>

          <div className="links-row animate-in animate-in--delay-3">
            <a
              href="https://www.linkedin.com/in/alvarogonzalezalcaniz/"
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
        </div>
      </section>

      {/* Professional arc */}
      <div className="page-container">
        <section className="section">
          <div className="section__divider" />
          <p className="section__label">The arc</p>

          <div className="arc">
            <div className="arc__item">
              <span className="arc__year">2025 —</span>
              <div className="arc__content">
                <h3>StyleAI</h3>
                <p>
                  Co-Founder & CEO. AI commerce infrastructure for mid-market
                 retailers: AI product discovery and agentic commerce tools
                 to increase traffic and contribution margins.
                </p>
                <span className="arc__tag">AI Agents</span>
                <span className="arc__tag">Commerce</span>
                <span className="arc__tag">SaaS</span>
              </div>
            </div>

            <div className="arc__item">
              <span className="arc__year">2024 - 2025</span>
              <div className="arc__content">
                <h3>Velatrix</h3>
                <p>
                  Co-Founder & COO. Web3 infrastructure for decentralized IP
                  distribution and AI-driven content monetization. Led
                  operations, GTM, and fundraising.
                </p>
                <span className="arc__tag">Web3</span>
                <span className="arc__tag">Protocol Design</span>
                <span className="arc__tag">Tokenomics</span>
              </div>
            </div>

            <div className="arc__item">
              <span className="arc__year">2013 — 24</span>
              <div className="arc__content">
                <h3>Management Solutions</h3>
                <p>
                  Consultant to Senior Manager. Led Credit risk IRB model 
                  development,  steered 6 regulatory ECB inspections, deployed
                  bank-wide data management, and built the firm's blockchain
                  practice. Madrid, Frankfurt, Helsinki, London, Amsterdam
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
    </>
  );
}
