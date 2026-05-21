export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  topic: string;
  thumbnail: string;
  readingTime: string;
}

export const articles: Article[] = [
  {
    slug: "agentic-commerce-thesis",
    title: "The Agentic Commerce Thesis",
    description:
      "Why AI agents will reshape how consumers discover and buy products online, and what retailers need to do now.",
    date: "2025-12-15",
    topic: "Agentic Commerce",
    thumbnail: "/blog/agentic-commerce-thesis.jpg",
    readingTime: "8 min",
  },
  {
    slug: "multi-agent-systems-retail",
    title: "Multi-Agent Systems for Retail",
    description:
      "How we designed StyleAI's multi-agent architecture for semantic product discovery and AI-driven styling.",
    date: "2025-11-20",
    topic: "AI Agents",
    thumbnail: "/blog/multi-agent-systems-retail.jpg",
    readingTime: "6 min",
  },
  {
    slug: "decentralized-ip-rights",
    title: "Decentralized IP Rights for Creators",
    description:
      "Building a blockchain protocol to give digital creators ownership and monetization control over their content.",
    date: "2025-06-10",
    topic: "Web3",
    thumbnail: "/blog/decentralized-ip-rights.jpg",
    readingTime: "7 min",
  },
];