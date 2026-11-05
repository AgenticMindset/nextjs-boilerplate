import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "../../../lib/og";
import { getAgent } from "../../../lib/agents/registry";

const agent = getAgent("styleai")!;

export const alt = `${agent.name} by Álvaro Tomás`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Client work",
    title: agent.name,
    subtitle: agent.tagline,
  });
}
