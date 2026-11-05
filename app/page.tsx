import Image from "next/image";
import type { Metadata } from "next";
import { AUTHOR_NAME, SITE_NAME, SITE_URL, absoluteUrl } from "../lib/site";

const HOME_DESCRIPTION =
  "Founder and operator specialised in AI agents and decentralized governance, turning product strategy into commercial traction.";

export const metadata: Metadata = {
  title: `${SITE_NAME} - AI Agents & Operations`,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} - AI Agents & Operations`,
    description: HOME_DESCRIPTION,
    url: "/",
    type: "profile",
  },
  twitter: { title: SITE_NAME, description: HOME_DESCRIPTION },
};

// Person, so a search engine or an assistant answering "who is Álvaro Tomás"
// has the same facts the page states, in a form it can read.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR_NAME,
  alternateName: SITE_NAME,
  url: SITE_URL,
  image: absoluteUrl("/AT_fair_square.png"),
  jobTitle: "Founder and operator",
  description: HOME_DESCRIPTION,
  knowsAbout: [
    "AI agents",
    "Agentic commerce",
    "Decentralized governance",
    "AI governance",
    "Model risk management",
  ],
  sameAs: [
    "https://www.linkedin.com/in/alvarogonzalezalcaniz/",
    "https://x.com/AgenticMindset",
    "https://github.com/AgenticMindset",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
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
              I am a founder and operator specialized in AI agents and decentralized governance.
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
