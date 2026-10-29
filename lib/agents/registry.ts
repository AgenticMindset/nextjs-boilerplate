// Single source of truth for the agents tab.
//
// The index page, each agent's own route, their <title>/description metadata
// and (from Phase 5) the sitemap and JSON-LD all read from this array, so
// adding an agent is one entry here rather than ~70 lines of copy-pasted JSX
// in four places.

/** How the agent's own page presents it. */
export type AgentMedium =
  /** Its own interactive route, reached from a launch button. */
  | "launch"
  /** A chat transcript rendered inline on the agent's page. */
  | "chat"
  /** A recorded demo of a system that runs elsewhere. */
  | "video";

export interface StackItem {
  /** The tool or model. */
  name: string;
  /** What it does in this agent. */
  role: string;
}

/**
 * What every agent on this site is built on. Listing it once here, rather than
 * repeating it on all six cards, keeps each agent's own stack list to the part
 * that is actually particular to it.
 */
export const SHARED_STACK: StackItem[] = [
  { name: "Next.js 16", role: "App Router, React 19" },
  { name: "GPT-OSS 120B", role: "Open-weights LLM via Groq" },
  { name: "Vercel AI SDK", role: "Streaming + structured output" },
  { name: "Zod", role: "Schema validation on every response" },
  { name: "Upstash Redis", role: "Per-IP rate limiting" },
];

export interface AgentDefinition {
  /** URL segment under /agents. */
  slug: string;
  /** Display name, used as the <h2> on the index and <h1> on its own page. */
  name: string;
  /** One line under the name on the index card. */
  tagline: string;
  /** Lead paragraph on the agent's own page. */
  intro: string;
  /** What the agent actually does, as a short list. */
  highlights: string[];
  /**
   * The honest caveat: how long it takes, what it will not do, where its
   * answer stops being trustworthy. Shown on the agent's own page.
   */
  limits: string;
  /** The two headline figures shown on the index card. */
  facts: { value: string; label: string }[];
  /** Only what is particular to this agent; SHARED_STACK covers the rest. */
  distinctiveStack: StackItem[];
  /** False for systems that are not built on this site's shared foundation. */
  usesSharedStack: boolean;
  medium: AgentMedium;
  /** Label on the call to action. */
  cta: string;
  /** Lower sorts first on the index. */
  order: number;
  /** Shown above the name where the agent needs framing. */
  eyebrow?: string;
  /** YouTube embed id, for medium "video". */
  videoId?: string;
  /** <title> and description for the agent's own route. */
  metaDescription: string;
}

export const AGENTS: AgentDefinition[] = [
  {
    slug: "voice-coach",
    name: "Voice Communication Coach",
    tagline:
      "Speak to it, and it grades your delivery on audio it actually measured.",
    intro:
      "A voice-only agent: you talk, it talks back. After one or two exchanges it has enough to assess how you communicate.",
    highlights: [
      "Transcribes and analyses your speech for pace, pitch variation, energy and pause patterns.",
      "Returns spoken and written feedback on delivery and articulation, with specific things to change.",
      "A shader-and-particle orb tracks listening, thinking and speaking in real time.",
    ],
    limits:
      "Feedback is drawn only from metrics computed from your audio and transcript. It will not comment on anything it did not measure. Needs a microphone and roughly 30 seconds of speech to say anything useful.",
    facts: [
      { value: "Adaptive", label: "One exchange, more only if needed" },
      { value: "Measured", label: "No guessed metrics" },
    ],
    distinctiveStack: [
      { name: "Whisper Large v3 Turbo", role: "Speech to text via Groq" },
      { name: "Kokoro-82M", role: "Open-source TTS via Replicate" },
      { name: "react-three-fiber", role: "GLSL shader + particle orb" },
      { name: "Web Audio API", role: "Pitch, energy, pause analysis" },
    ],
    usesSharedStack: true,
    medium: "launch",
    cta: "Launch Voice Coach",
    order: 10,
    metaDescription:
      "Talk to a voice-only coach and get spoken and written feedback on your delivery, grounded only in pitch, energy and pause metrics measured from your own audio.",
  },
  {
    slug: "wargame",
    name: "Market Entry Wargame",
    tagline: "Predicts how incumbents will defend a market you want to enter.",
    intro:
      "Define a market along four variables and the agent retrieves what it can find on it, then plays out the defence.",
    highlights: [
      "Retrieves competitive intelligence from a pre-indexed vector corpus and live web search.",
      "Predicts how incumbents respond to entry, and recommends a strategy against that response.",
    ],
    limits:
      "Takes 10-20 seconds. Every run reports its own confidence, derived from how well the retrieval actually matched your market — treat a low-confidence run as a prompt to think, not an answer.",
    facts: [
      { value: "4 Variables", label: "Market definition" },
      { value: "Hybrid RAG", label: "Corpus + live search" },
    ],
    distinctiveStack: [
      { name: "Pinecone", role: "Vector index + embeddings" },
      { name: "Tavily", role: "Live search layer" },
    ],
    usesSharedStack: true,
    medium: "launch",
    cta: "Launch Wargame",
    order: 20,
    metaDescription:
      "Define a market entry scenario and this hybrid-RAG agent retrieves competitive intelligence, predicts incumbent defence and reports an honest confidence level.",
  },
  {
    slug: "negotiator",
    name: "Agent-to-Agent Negotiation Simulator",
    tagline: "Two agents negotiate a B2B SaaS deal, and you can intervene.",
    intro:
      "A buyer and a seller, each its own agent with its own system prompt and private constraints, negotiating across seven deal terms.",
    highlights: [
      "Each side reasons independently: neither can see the other's instructions or walk-away point.",
      "Change a negotiator's personality or impose a deadline mid-deal and watch the terms move.",
      "Ends with a debrief scoring what each side gave away.",
    ],
    limits:
      "Six rounds, one LLM call per agent per round, so a full run is a dozen calls against a shared free-tier budget. The outcome is a simulation of negotiating dynamics, not advice on your actual deal.",
    facts: [
      { value: "2 Agents", label: "Independent reasoning" },
      { value: "6 Rounds", label: "With live intervention" },
    ],
    distinctiveStack: [],
    usesSharedStack: true,
    medium: "launch",
    cta: "Launch Simulator",
    order: 30,
    metaDescription:
      "Two autonomous AI agents negotiate a B2B SaaS deal round by round, each with its own system prompt, private constraints and independent reasoning.",
  },
  {
    slug: "tokenomics",
    name: "Token Economics Stress Tester",
    tagline:
      "Bank supervisory stress-testing methodology, pointed at token design.",
    intro:
      "Pick a token and a shock, and the agent runs it through a framework adapted from how regulators stress-test banks.",
    highlights: [
      "Scores design resilience across the dimensions that decide whether a token survives a shock.",
      "Traces how that shock propagates through the system, and names the historical failure it most resembles.",
    ],
    limits:
      "One structured call, so a run is fast but shallow: it reasons from the token's published design, not from live on-chain data or current market conditions. Not investment advice.",
    facts: [
      { value: "5 Presets", label: "Or paste your own" },
      { value: "5 Scenarios", label: "Stress archetypes" },
    ],
    distinctiveStack: [{ name: "Recharts", role: "Resilience radar chart" }],
    usesSharedStack: true,
    medium: "launch",
    cta: "Launch Stress Tester",
    order: 40,
    metaDescription:
      "Stress-test a token's economic design with a framework adapted from banking supervision: a resilience radar, a shock cascade and a historical failure analogue.",
  },
  {
    slug: "tech-stack",
    name: "Open Source Tech Stack Advisor",
    tagline:
      "Interviews you about your product, then calls three tools to design the stack.",
    intro:
      "Describe what you want to build. The agent works out what it still needs to know, asks, and only then starts calling tools.",
    highlights: [
      "Decides for itself when it has enough on scale, team skill and constraints to proceed.",
      "Calls three tools in sequence: a stack recommendation, a monthly cost estimate, an architecture diagram.",
      "Recommends open-source by default, and flags anything proprietary as such.",
    ],
    limits:
      "Opinionated on purpose: it gives you one stack and its reasoning rather than a survey of options. Cost estimates are list-price arithmetic, not a quote.",
    facts: [
      { value: "3 Tools", label: "Called autonomously" },
      { value: "Open source", label: "Recommended by default" },
    ],
    distinctiveStack: [
      { name: "Mermaid.js", role: "Architecture diagrams, loaded on demand" },
    ],
    usesSharedStack: true,
    medium: "chat",
    cta: "Open Advisor",
    order: 50,
    metaDescription:
      "Describe a product idea and this agent gathers requirements, then autonomously calls three tools for an open-source stack, a cost estimate and an architecture diagram.",
  },
  {
    slug: "problem-solver",
    name: "Problem Solver",
    tagline: "Works out what shape your problem is, then picks the method for it.",
    intro:
      "Describe a problem in your own words. The agent diagnoses its structure before recommending anything.",
    highlights: [
      "Classifies the problem's shape and the characteristics that constrain how it can be attacked.",
      "Recommends one best-fit framework from a curated catalog of twelve, with the steps to apply it and two alternatives for when the situation shifts.",
    ],
    limits:
      "It can only choose from the twelve frameworks in its catalog; it will not invent one to fit. If none of them fits your problem, that is the useful answer.",
    facts: [
      { value: "12 Frameworks", label: "Curated catalog" },
      { value: "Grounded", label: "Never invents a method" },
    ],
    distinctiveStack: [],
    usesSharedStack: true,
    medium: "launch",
    cta: "Launch Problem Solver",
    order: 60,
    metaDescription:
      "Describe a problem in your own words and this agent diagnoses its shape, recommends the best-fit framework from a curated catalog of 12, and shows how to apply it.",
  },
  {
    slug: "styleai",
    name: "StyleAI Commerce Agent",
    tagline: "An agentic commerce system running in a client's retail storefront.",
    eyebrow: "Client work",
    intro:
      "Not a demo: a deployed system handling product discovery inside a retailer's own storefront.",
    highlights: [
      "Styling suggestions personalised to the brand's identity rather than generic recommendations.",
      "Upselling aligned to the retailer's own sales strategy.",
      "Delivered conversationally, integrated directly into the storefront.",
    ],
    limits:
      "Client-owned and not publicly runnable, so this one is a recorded walkthrough. It is also the only system here not built on this site's stack.",
    facts: [
      { value: "Deployed", label: "Live client environment" },
      { value: "Embedded", label: "Native storefront widget" },
    ],
    distinctiveStack: [
      { name: "TypeScript", role: "Monorepo" },
      { name: "Hono", role: "Backend" },
      { name: "SolidJS", role: "Widget + admin" },
      { name: "Google Gemini", role: "AI engine" },
      { name: "PostgreSQL", role: "Database" },
    ],
    usesSharedStack: false,
    medium: "video",
    videoId: "XS-DMn7mgjg",
    cta: "Watch Demo",
    order: 70,
    metaDescription:
      "A deployed agentic commerce system handling product discovery, brand-aligned styling suggestions and strategic upselling inside a retailer's own storefront.",
  },
];

/** Index order. */
export const AGENTS_BY_ORDER = [...AGENTS].sort((a, b) => a.order - b.order);

export function getAgent(slug: string): AgentDefinition | undefined {
  return AGENTS.find((agent) => agent.slug === slug);
}

/** Everything an agent's "Built with" list should show. */
export function fullStack(agent: AgentDefinition): StackItem[] {
  return agent.usesSharedStack
    ? [...agent.distinctiveStack, ...SHARED_STACK]
    : agent.distinctiveStack;
}
