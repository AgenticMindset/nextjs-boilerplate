export type IndustryVertical =
  | "Customer Support"
  | "Legal Services"
  | "Healthcare"
  | "Financial Services"
  | "Education"
  | "HR & Recruitment"
  | "Supply Chain & Logistics"
  | "Marketing & Advertising"
  | "Real Estate"
  | "Insurance"
  | "Cybersecurity"
  | "E-commerce & Retail"
  | "Manufacturing"
  | "Media & Entertainment"
  | "Agriculture"
  | "Energy"
  | "Travel & Hospitality"
  | "Construction"
  | "Telecommunications"
  | "Government & Public Sector"
  | "Other";

export type TechnologyLayer =
  | "Conversational AI / Chatbots"
  | "Autonomous Agents"
  | "Predictive Analytics"
  | "Document Intelligence"
  | "Code Generation"
  | "Search & Retrieval"
  | "Computer Vision"
  | "Recommendation Systems"
  | "Process Automation (RPA+AI)"
  | "Data Integration & Pipelines"
  | "Voice AI"
  | "Content Generation"
  | "Decision Intelligence"
  | "Simulation & Digital Twins"
  | "Other";

export type TargetGeography =
  | "United States"
  | "DACH (DE/AT/CH)"
  | "United Kingdom"
  | "Nordics (SE/NO/DK/FI)"
  | "Benelux (NL/BE/LU)"
  | "France"
  | "Southern Europe (ES/IT/PT)"
  | "Eastern Europe"
  | "Canada"
  | "Latin America"
  | "Middle East & GCC"
  | "Southeast Asia"
  | "India"
  | "Japan & South Korea"
  | "Australia & New Zealand"
  | "Africa"
  | "Global (no geo focus)"
  | "Other";

export type CustomerSegment =
  | "Enterprise (1000+ employees)"
  | "Mid-Market (100-999)"
  | "SMB (10-99)"
  | "Micro / Solo operators"
  | "Consumer (B2C)"
  | "Developer / Technical buyer"
  | "Government & Public sector"
  | "Other";

export interface MarketDefinition {
  vertical: IndustryVertical;
  customVertical: string;
  technology: TechnologyLayer;
  customTechnology: string;
  geography: TargetGeography;
  customGeography: string;
  segment: CustomerSegment;
  customSegment: string;
}

export type DefensiveArchetype =
  | "Price pressure"
  | "Feature acceleration"
  | "Partnership lock-in"
  | "Ecosystem bundling"
  | "Data moat deepening"
  | "Regulatory capture"
  | "Talent denial"
  | "Open-source counter"
  | "FUD and narrative control";

export const DEFENSIVE_ARCHETYPES: {
  name: DefensiveArchetype;
  description: string;
  whenItMatters: string;
}[] = [
  {
    name: "Price pressure",
    description:
      "Incumbent undercuts or offers a free tier to starve the entrant of revenue.",
    whenItMatters: "Markets with low switching costs, commodity features.",
  },
  {
    name: "Feature acceleration",
    description:
      "Incumbent ships the entrant's differentiator within 3-6 months.",
    whenItMatters:
      "When the entrant's edge is a feature, not a distribution advantage.",
  },
  {
    name: "Partnership lock-in",
    description:
      "Incumbent signs exclusive channel/integration deals to block distribution.",
    whenItMatters:
      "Platform-dependent markets (Shopify apps, Salesforce ecosystem).",
  },
  {
    name: "Ecosystem bundling",
    description:
      "Incumbent bundles their AI product with adjacent tools at a discount, making standalone entrants uneconomical.",
    whenItMatters: "Multi-product incumbents (Microsoft, Google, Salesforce).",
  },
  {
    name: "Data moat deepening",
    description:
      "Incumbent accelerates its data flywheel: more users feed better models, widening the accuracy gap.",
    whenItMatters: "Markets where model quality is the buying criterion.",
  },
  {
    name: "Regulatory capture",
    description:
      "Incumbent uses compliance certifications, lobbying, or standard-setting to raise the bar for new entrants.",
    whenItMatters:
      "Healthcare, financial services, government, EU AI Act contexts.",
  },
  {
    name: "Talent denial",
    description:
      "Incumbent hires aggressively from the entrant's talent pool or acqui-hires competing teams.",
    whenItMatters: "Small markets with scarce domain + AI expertise.",
  },
  {
    name: "Open-source counter",
    description:
      "Incumbent releases a free/open version of the entrant's core product to commoditize the layer.",
    whenItMatters: "Infrastructure and developer-facing markets.",
  },
  {
    name: "FUD and narrative control",
    description:
      "Incumbent runs public messaging questioning the entrant's reliability, security, or longevity.",
    whenItMatters: "Enterprise markets where buyer risk aversion is high.",
  },
];

export type ConfidenceLevel = "High" | "Moderate" | "Low";
export type SourceMode = "Corpus + Live Data" | "Live Data Only";

export interface Incumbent {
  name: string;
  positioning: string;
  primaryMoat: string;
  marketTier: string;
}

export interface DefensiveResponse {
  incumbentName: string;
  archetype: DefensiveArchetype;
  predictedAction: string;
  trigger: string;
}

export interface EntryStrategy {
  wedge: string;
  sequence: string;
  differentiationAxis: string;
}

export interface WargameOutput {
  topIncumbents: Incumbent[];
  defensiveResponses: DefensiveResponse[];
  strategy: EntryStrategy;
  survivalConditions: string[];
  failureReason: string;
}

export interface WargameResult extends WargameOutput {
  generatedAt: string;
  confidence: ConfidenceLevel;
  sourceMode: SourceMode;
  marketDefinition: MarketDefinition;
}
