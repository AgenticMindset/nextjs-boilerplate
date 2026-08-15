import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero with background image */}
      <section className="hero-wrapper">
        <Image
          src="/ams4-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 62%" }}
          quality={80}
        />
        <div className="hero-wrapper__overlay" />
        <div className="hero-wrapper__content">
          <h1 className="hero__title animate-in animate-in--delay-1">
            Álvaro Tomás
          </h1>
          <div className="hero__subtitle animate-in animate-in--delay-2">
            <p style={{ marginBottom: "12px" }}>
              I am a founder specialized in AI agents and decentralized governance.
            </p>
            <p>
              Technology companies need someone who can drive operations and turn their product strategy into commercial traction.
              That&apos;s what I do.
            </p>
          </div>
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
              href="https://github.com/AgenticMindset"
              target="_blank"
              rel="noopener noreferrer"
              className="links-row__item"
            >
              GitHub
            </a>
          </div>
          <div className="animate-in animate-in--delay-3" style={{ marginTop: "42px" }}>
            <Image
              src="/AT_fair_square.png"
              alt="Álvaro Tomás"
              width={350}
              height={380}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)",
              }}
              quality={90}
            />
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
