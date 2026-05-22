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
    slug: "your-margin-is-your-metadata",
    title: "Your Margin Is Your Metadata",
    description:
      "Why unindexed product data is the real margin killer in commerce, and what the shift to agentic commerce means for retailers who can't describe what they sell.",
    date: "2026-02-21",
    topic: "Agentic Commerce",
    thumbnail: "/blog/your-margin-is-your-metadata.jpg",
    readingTime: "6 min",
  },
  {
    slug: "iceberg-theory",
    title: "The Iceberg Theory of AI Commerce",
    description:
      "Why the chatbot is not the product, and why the invisible 90% of intelligence infrastructure determines who wins in agentic commerce.",
    date: "2026-05-17",
    topic: "Protocol Infrastructure",
    thumbnail: "/blog/iceberg-theory-cover.jpg",
    readingTime: "5 min",
  },
  {
    slug: "agent-market-fit",
    title: "Agent-Market Fit: How the Hierarchy of Value Is Changing in E-Commerce",
    description:
      "Why Product-Market Fit is losing relevance in the age of AI agents, and what Agent-Market Fit means for retailers who want to survive.",
    date: "2026-01-19",
    topic: "AI Agents",
    thumbnail: "/blog/agent-market-fit-cover.jpg",
    readingTime: "2 min",
  },

{
    slug: "world-models",
    title: "World Models: The Architecture That Will Define the Next Decade of AI",
    description:
      "Why LLMs alone will plateau, and how world models unlock the predictive reasoning that AI agents need to plan, act, and learn.",
    date: "2025-11-24",
    topic: "AI Infrastructure",
    thumbnail: "/blog/world-models-cover.jpg",
    readingTime: "6 min",
  },

{
    slug: "geo",
    title: "Generative Engine Optimization: The Next Frontier in Discoverability",
    description:
      "How GEO is replacing traditional SEO as the framework for brand visibility in a world where AI agents mediate discovery and decisions.",
    date: "2025-10-20",
    topic: "Generative Engine Optimization",
    thumbnail: "/blog/geo-cover.PNG",
    readingTime: "6 min",
  },
  
  {
    slug: "semantic-gap",
    title: "The Semantic Gap: Why Returns Are a Failure of Architecture, Not Logistics",
    description:
      "Why product returns are a data problem, not a shipping problem, and how Knowledge Graphs and agent-to-agent infrastructure can prevent the mismatch before it happens.",
    date: "2025-09-14",
    topic: "E-Commerce",
    thumbnail: "/blog/semantic-cover.jpg",
    readingTime: "4 min",
  },

  {
    slug: "singularity",
    title: "The Technological Singularity: A Future We Must Understand, Not Fear",
    description:
      "What the singularity actually means, why the conversation is no longer theoretical, and five principles for approaching a world of accelerating intelligence.",
    date: "2026-04-04",
    topic: "Technology Paradigms",
    thumbnail: "/blog/singularity-cover.jpg",
    readingTime: "4 min",
  },


];