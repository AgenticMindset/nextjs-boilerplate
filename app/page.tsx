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
            Companies building {" "}
            <span className="hero__accent">AI agents</span> {"or "}
            <span className="hero__accent">protocol-based infrastructure</span> need someone who can set the{" "}
            <span className="hero__accent">strategy</span>{", structure "} 
            <span className="hero__accent">governance</span>{", and close "} 
            <span className="hero__accent">deals.</span> {"That's what I do."}
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
      {/* Footer */}
      <footer className="footer">
        <p className="footer__text">
          Álvaro Tomás · {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
