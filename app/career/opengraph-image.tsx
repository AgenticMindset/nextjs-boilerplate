import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "../../lib/og";

export const alt = "Selected work by Álvaro Tomás";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Selected work",
    title: "Things I've built",
    subtitle:
      "From banking consultant to founder of startups building infrastructure for AI agents and decentralized platforms.",
  });
}
