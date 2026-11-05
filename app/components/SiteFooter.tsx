import { SITE_NAME } from "../../lib/site";

/**
 * The one footer. It was pasted inline on the home, blog and career pages,
 * identical each time, and missing from /agents and the agent routes
 * entirely, so a page's foot depended on which page you were on.
 */
export function SiteFooter() {
  return (
    <footer className="footer">
      <p className="footer__text">
        {SITE_NAME} · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
