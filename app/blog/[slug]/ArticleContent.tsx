"use client";

import YourMarginIsYourMetadata from "./content/your-margin-is-your-metadata";
import IcebergTheory from "./content/iceberg-theory";
import AgentMarketFit from "./content/agent-market-fit";
import WorldModels from "./content/world-models";

const contentMap: Record<string, React.ComponentType> = {
  "your-margin-is-your-metadata": YourMarginIsYourMetadata,
  "iceberg-theory": IcebergTheory,
  "agent-market-fit": AgentMarketFit,
  "world-models": WorldModels,
};

export default function ArticleContent({ slug }: { slug: string }) {
  const Content = contentMap[slug];

  if (!Content) {
    return <p>Article content coming soon.</p>;
  }

  return <Content />;
}