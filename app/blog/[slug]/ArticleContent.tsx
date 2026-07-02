"use client";

import YourMarginIsYourMetadata from "./content/your-margin-is-your-metadata";
import IcebergTheory from "./content/iceberg-theory";
import AgentMarketFit from "./content/agent-market-fit";
import WorldModels from "./content/world-models";
import Geo from "./content/geo";
import SemanticGap from "./content/semantic-gap";
import Singularity from "./content/singularity";
import ModelRiskManagement from "./content/model-risk-management";

const contentMap: Record<string, React.ComponentType> = {
  "your-margin-is-your-metadata": YourMarginIsYourMetadata,
  "iceberg-theory": IcebergTheory,
  "agent-market-fit": AgentMarketFit,
  "world-models": WorldModels,
  "geo": Geo,
  "semantic-gap": SemanticGap,
  "singularity": Singularity,
  "model-risk-management": ModelRiskManagement,
};

export default function ArticleContent({ slug }: { slug: string }) {
  const Content = contentMap[slug];

  if (!Content) {
    return <p>Article content coming soon.</p>;
  }

  return <Content />;
}