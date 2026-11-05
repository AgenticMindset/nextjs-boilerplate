import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";

export const metadata: Metadata = {
  title: "Page not found - Álvaro Tomás",
  // A 404 has nothing worth indexing, and letting it into the index
  // competes with the real pages for the same queries.
  robots: { index: false, follow: true },
};

/**
 * Replaces Next's unstyled default 404, which rendered as black-on-white
 * system text inside this site's dark chrome.
 */
export default function NotFound() {
  return (
    <section className="work-wrapper">
      <div className="work-wrapper__content">
        <div className="agents-intro">
          <p className="agent-card__eyebrow">404</p>
          <h1 className="agents-intro__title">This page does not exist</h1>
          <p className="agents-intro__lede">
            The link is wrong, or whatever used to be here has moved. The
            places worth going are below.
          </p>
        </div>

        <div className="links-row" style={{ marginTop: "32px" }}>
          <Link href="/" className="links-row__item">
            Home
          </Link>
          <Link href="/agents" className="links-row__item">
            AI Agents
          </Link>
          <Link href="/blog" className="links-row__item">
            Blog
          </Link>
          <Link href="/career" className="links-row__item">
            Selected work
          </Link>
        </div>

        <SiteFooter />
      </div>
    </section>
  );
}
