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
          quality={90}
        />
        <div className="hero-wrapper__overlay" />
        <div className="hero-wrapper__content">
          <h1 className="hero__title animate-in animate-in--delay-1">
            Álvaro Tomás
          </h1>
          <p className="hero__subtitle animate-in animate-in--delay-2">
            Operator-founder bridging{" "}
            <span className="hero__accent">AI agent systems</span> {"with "}
            <span className="hero__accent">interoperability protocols</span> and{" "}
            <span className="hero__accent">regulatory governance. </span>
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
              href="https://x.com/AgenticMindset"
              target="_blank"
              rel="noopener noreferrer"
              className="links-row__item"
            >
              X
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
                <h3>StyleAI | Co-Founder & CEO </h3>
                <p>
                  AI commerce infrastructure for mid-market
                 retailers: A multi-agent system powering AI product discovery, along with agentic commerce tools
                 to help online retailers increase contribution margins and AI-native demand.
                </p>
                <span className="arc__tag">AI Agents</span>
                <span className="arc__tag">Agentic Commerce Infrastructure</span>
                <span className="arc__tag">B2B SaaS</span>
              </div>
            </div>

            <div className="arc__item">
              <span className="arc__year">2024 - 2025</span>
              <div className="arc__content">
                <h3>Velatrix | Co-Founder & COO</h3>
                <p>
                  Web3 infrastructure for digital content creators:
                  A blockchain protocol designed to manage Intellectual Property rights, where developers can deploy DApps. It incorporates AI-driven tools to help creators maximize monetization opportunities.
                </p>
                <span className="arc__tag">Web3 ecosystem</span>
                <span className="arc__tag">Blockchain Protocol</span>
                <span className="arc__tag">DAO</span>
                <span className="arc__tag">DApp</span>
              </div>
            </div>

            <div className="arc__item">
              <span className="arc__year">2013 — 24</span>
              <div className="arc__content">
                <h3>Management Solutions | Senior Manager</h3>
                <p>
                  Credit risk IRB model 
                  development. Regulatory ECB inspections. 
                  Data Management (CDO) function. Blockchain Solutions
                  .Madrid, Frankfurt, Helsinki, London, Amsterdam
                </p>
                <span className="arc__tag">Data Management</span>
                <span className="arc__tag">IT Regulation</span>
                <span className="arc__tag">Blockchain Technology</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p className="footer__text">
            Álvaro Tomás · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </>
  );
}
