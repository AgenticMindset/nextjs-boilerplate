import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "../../lib/og";

export const alt = "Writing by Álvaro Tomás";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Writing",
    title: "Notes on AI systems",
    subtitle: "Infrastructure, governance, and what agents actually change.",
  });
}
