import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "../lib/og";
import { SITE_NAME } from "../lib/site";

// Root card: the fallback for every route without one of its own, so /, /career
// and /blog stop sharing as a 512px app icon.
export const alt = `${SITE_NAME} - AI agents and operations`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Founder & Operator",
    title: SITE_NAME,
    subtitle: "AI agents, agentic commerce, and decentralized governance.",
  });
}
