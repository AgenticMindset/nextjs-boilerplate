import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "../../lib/og";

export const alt = "AI Agents by Álvaro Tomás";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "AI Agents",
    title: "Six agents you can run",
    subtitle:
      "Each one states what it measured, what it assumed, and where its answer stops being worth trusting.",
  });
}
