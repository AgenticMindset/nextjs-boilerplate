// Who and where this site is, in one place.
//
// Before this existed the production origin was hard-coded in the blog's
// JSON-LD and nowhere else, so `metadataBase` was unset and every Open Graph
// image URL resolved against http://localhost:3000 — which is what broke link
// previews on LinkedIn, X and Slack. The sitemap, robots file, JSON-LD and
// metadata now all read from here.

export const SITE_URL = "https://alvarotomas.com";

/** Short display name, used as the site name and in <title>s. */
export const SITE_NAME = "Álvaro Tomás";

/** Full name, for structured data where the legal name is the useful one. */
export const AUTHOR_NAME = "Álvaro Tomás González";

export const SITE_DESCRIPTION =
  "AI engineer building agents that state what they measured and where their answer stops being worth trusting.";

/** Absolute URL for a site-relative path, for the places that require one. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
