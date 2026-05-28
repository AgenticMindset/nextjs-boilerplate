import { tool } from "ai";
import { z } from "zod";

export const agentTools = {
  recommend_stack: tool({
    description:
      "Recommend a complete open-source technology stack for a product idea. Call this after you have gathered enough information about the product requirements, expected scale, team size, and constraints. Returns a structured recommendation covering each layer of the stack.",
    parameters: z.object({
      product_summary: z
        .string()
        .describe("A concise summary of what the product does"),
      expected_users: z
        .enum(["small", "medium", "large"])
        .describe(
          "Expected user scale: small (<1K users), medium (1K-100K), large (100K+)"
        ),
      team_skill_level: z
        .enum(["beginner", "intermediate", "advanced"])
        .describe("Technical skill level of the development team"),
      key_features: z
        .array(z.string())
        .describe("List of the most important features the product needs"),
      constraints: z
        .array(z.string())
        .optional()
        .describe(
          "Any technical constraints like existing infrastructure, language preferences, etc."
        ),
    }),
    execute: async ({
      product_summary,
      expected_users,
      team_skill_level,
      key_features,
      constraints,
    }) => {
      const stack = buildStackRecommendation(
        product_summary,
        expected_users,
        team_skill_level,
        key_features,
        constraints || []
      );
      return stack;
    },
  }),

  estimate_costs: tool({
    description:
      "Estimate the monthly infrastructure costs for a recommended tech stack. Call this after recommend_stack has returned a stack recommendation.",
    parameters: z.object({
      frontend_hosting: z
        .string()
        .describe("The frontend hosting solution, e.g. Vercel, Netlify"),
      backend_framework: z
        .string()
        .describe("The backend framework, e.g. FastAPI, Express"),
      database: z
        .string()
        .describe("The database, e.g. PostgreSQL, MongoDB"),
      expected_users: z
        .enum(["small", "medium", "large"])
        .describe("Expected user scale"),
    }),
    execute: async ({
      frontend_hosting,
      backend_framework,
      database,
      expected_users,
    }) => {
      return estimateCosts(
        frontend_hosting,
        backend_framework,
        database,
        expected_users
      );
    },
  }),

  generate_diagram: tool({
    description:
      "Generate a Mermaid.js architecture diagram for a recommended tech stack. Call this after recommend_stack has returned a stack recommendation. Returns Mermaid syntax that can be rendered as a visual diagram.",
    parameters: z.object({
      product_name: z.string().describe("Short name for the product"),
      frontend: z
        .string()
        .describe("Frontend framework, e.g. Next.js, SvelteKit"),
      backend: z
        .string()
        .describe("Backend framework, e.g. FastAPI, Express"),
      database: z.string().describe("Database, e.g. PostgreSQL, Redis"),
      hosting: z
        .string()
        .describe("Hosting/infrastructure, e.g. Vercel, Railway"),
      extras: z
        .array(z.string())
        .optional()
        .describe(
          "Additional services like message queues, search engines, CDNs"
        ),
    }),
    execute: async ({
      product_name,
      frontend,
      backend,
      database,
      hosting,
      extras,
    }) => {
      return generateMermaidDiagram(
        product_name,
        frontend,
        backend,
        database,
        hosting,
        extras || []
      );
    },
  }),
};

function buildStackRecommendation(
  product_summary: string,
  expected_users: string,
  team_skill_level: string,
  key_features: string[],
  constraints: string[]
) {
  const needsRealtime = key_features.some(
    (f) =>
      f.toLowerCase().includes("real-time") ||
      f.toLowerCase().includes("realtime") ||
      f.toLowerCase().includes("chat") ||
      f.toLowerCase().includes("live") ||
      f.toLowerCase().includes("websocket")
  );

  const needsSearch = key_features.some(
    (f) =>
      f.toLowerCase().includes("search") ||
      f.toLowerCase().includes("filter") ||
      f.toLowerCase().includes("catalog")
  );

  const needsAuth = key_features.some(
    (f) =>
      f.toLowerCase().includes("auth") ||
      f.toLowerCase().includes("login") ||
      f.toLowerCase().includes("user") ||
      f.toLowerCase().includes("account")
  );

  const needsPayments = key_features.some(
    (f) =>
      f.toLowerCase().includes("payment") ||
      f.toLowerCase().includes("checkout") ||
      f.toLowerCase().includes("billing") ||
      f.toLowerCase().includes("subscription")
  );

  const needsFileUpload = key_features.some(
    (f) =>
      f.toLowerCase().includes("upload") ||
      f.toLowerCase().includes("image") ||
      f.toLowerCase().includes("file") ||
      f.toLowerCase().includes("media") ||
      f.toLowerCase().includes("photo")
  );

  const needsBlockchain = key_features.some(
    (f) =>
      f.toLowerCase().includes("blockchain") ||
      f.toLowerCase().includes("crypto") ||
      f.toLowerCase().includes("web3") ||
      f.toLowerCase().includes("defi") ||
      f.toLowerCase().includes("token") ||
      f.toLowerCase().includes("wallet") ||
      f.toLowerCase().includes("smart contract") ||
      f.toLowerCase().includes("nft") ||
      f.toLowerCase().includes("decentralized")
  );

  const needsAPI = key_features.some(
    (f) =>
      f.toLowerCase().includes("api") ||
      f.toLowerCase().includes("integration") ||
      f.toLowerCase().includes("third-party") ||
      f.toLowerCase().includes("webhook")
  );

  const needsAgentInfra = key_features.some(
    (f) =>
      f.toLowerCase().includes("agent") ||
      f.toLowerCase().includes("a2a") ||
      f.toLowerCase().includes("mcp") ||
      f.toLowerCase().includes("multi-agent") ||
      f.toLowerCase().includes("autonomous") ||
      f.toLowerCase().includes("agentic")
  );

  const needsMessaging = key_features.some(
    (f) =>
      f.toLowerCase().includes("queue") ||
      f.toLowerCase().includes("event") ||
      f.toLowerCase().includes("messaging") ||
      f.toLowerCase().includes("pub/sub") ||
      f.toLowerCase().includes("notification") ||
      f.toLowerCase().includes("async")
  );

  const needsMarketplace = key_features.some(
    (f) =>
      f.toLowerCase().includes("marketplace") ||
      f.toLowerCase().includes("multi-vendor") ||
      f.toLowerCase().includes("two-sided") ||
      f.toLowerCase().includes("platform") ||
      f.toLowerCase().includes("listing")
  );

  let frontend, backend, database, hosting, cicd;
  const additionalTools: string[] = [];

  // Frontend
  if (team_skill_level === "beginner") {
    frontend = {
      tool: "Next.js",
      reason:
        "Best documentation, largest community, easiest learning curve for React-based apps. Includes routing, API routes, and SSR out of the box.",
    };
  } else if (needsRealtime) {
    frontend = {
      tool: "SvelteKit",
      reason:
        "Lighter bundle size and built-in reactivity make it ideal for real-time UIs. Less boilerplate than React.",
    };
  } else {
    frontend = {
      tool: "Next.js",
      reason:
        "Most versatile choice. Server components, API routes, middleware, and the largest ecosystem of open-source components.",
    };
  }

  // Backend
  if (team_skill_level === "beginner") {
    backend = {
      tool: "Next.js API Routes",
      reason:
        "No separate backend needed. API routes live alongside your frontend code, simplifying deployment and reducing moving parts.",
    };
  } else if (needsAgentInfra) {
    backend = {
      tool: "FastAPI (Python)",
      reason:
        "The standard runtime for AI agent systems. Native async support, strong LangChain/LangGraph integration, and the richest ecosystem of AI/ML libraries.",
    };
  } else if (expected_users === "large") {
    backend = {
      tool: "FastAPI (Python)",
      reason:
        "Async-native, extremely fast, auto-generates API documentation. Scales well for high-traffic applications.",
    };
  } else {
    backend = {
      tool: "Hono",
      reason:
        "Ultrafast, lightweight, runs on any runtime (Node, Deno, Bun, edge). TypeScript-native with excellent middleware support.",
    };
  }

  // Database
  if (needsBlockchain) {
    database = {
      tool: "PostgreSQL + Redis",
      reason:
        "PostgreSQL for relational data, user accounts, and transaction records. Redis for caching blockchain state, session management, and real-time price feeds. On-chain data lives on the blockchain itself; these databases handle the off-chain application layer.",
    };
  } else if (needsRealtime && expected_users === "large") {
    database = {
      tool: "PostgreSQL + Redis",
      reason:
        "PostgreSQL for persistent data with ACID compliance. Redis for caching, sessions, and pub/sub for real-time features.",
    };
  } else if (expected_users === "small" && team_skill_level === "beginner") {
    database = {
      tool: "SQLite (via Turso)",
      reason:
        "Zero configuration, serverless, generous free tier. Perfect for MVPs and small-scale apps. Easy migration to PostgreSQL later.",
    };
  } else {
    database = {
      tool: "PostgreSQL",
      reason:
        "The gold standard of open-source databases. Handles relational data, JSON, full-text search, and vector embeddings. Scales from prototype to millions of users.",
    };
  }

  // Hosting
  if (
    frontend.tool === "Next.js" &&
    backend.tool === "Next.js API Routes"
  ) {
    hosting = {
      tool: "Vercel",
      reason:
        "Native Next.js hosting with zero configuration. Free tier covers most MVPs. Automatic HTTPS, CDN, and preview deployments.",
    };
  } else if (expected_users === "large") {
    hosting = {
      tool: "Railway + Vercel",
      reason:
        "Vercel for the frontend, Railway for the backend and database. Railway offers easy PostgreSQL hosting with automatic backups.",
    };
  } else {
    hosting = {
      tool: "Railway",
      reason:
        "Simple deployment for any stack. Supports Docker, automatic SSL, built-in PostgreSQL. Free tier available, paid starts at $5/month.",
    };
  }

  // CI/CD
  cicd = {
    tool: "GitHub Actions",
    reason:
      "Free for public repos, 2000 minutes/month for private repos. Native integration with GitHub. Handles testing, linting, and deployment.",
  };

  // Additional tools based on features
  if (needsSearch) {
    additionalTools.push(
      "Meilisearch - Open-source search engine. Fast, typo-tolerant, easy to set up. Alternative to Algolia without the cost."
    );
  }
  if (needsAuth) {
    additionalTools.push(
      "Lucia Auth - Open-source authentication library. Lightweight, database-agnostic, no vendor lock-in. Alternative to Auth0/Clerk."
    );
  }
  if (needsPayments) {
    additionalTools.push(
      "Stripe (proprietary, no viable open-source alternative for payment processing) - Industry standard for payments. Note: this is the one component where no open-source alternative can fully replace a proprietary solution due to regulatory requirements."
    );
  }
  if (needsFileUpload) {
    additionalTools.push(
      "MinIO - Open-source S3-compatible object storage. Self-host your file storage instead of paying for AWS S3."
    );
  }
  if (needsRealtime) {
    additionalTools.push(
      "Socket.IO - Open-source real-time communication library. Handles WebSocket connections with automatic fallbacks."
    );
  }
  if (needsBlockchain) {
    additionalTools.push(
      "Hardhat - Open-source Ethereum development environment for compiling, deploying, and testing smart contracts."
    );
    additionalTools.push(
      "Ethers.js - Lightweight library for interacting with the Ethereum blockchain and smart contracts from your backend."
    );
    additionalTools.push(
      "IPFS (via Kubo) - Open-source decentralized storage for off-chain data, metadata, and media files."
    );
  }
  if (needsAPI) {
    additionalTools.push(
      "Hoppscotch - Open-source API development and testing tool. Alternative to Postman."
    );
  }
  if (needsAgentInfra) {
    additionalTools.push(
      "LangGraph - Open-source framework for building stateful, multi-agent workflows with cycles and persistence."
    );
    additionalTools.push(
      "Model Context Protocol (MCP) Server - Open standard for connecting AI agents to external tools and data sources."
    );
    if (key_features.some((f) => f.toLowerCase().includes("a2a"))) {
      additionalTools.push(
        "Agent-to-Agent (A2A) Protocol - Google's open protocol for inter-agent communication, discovery, and task delegation."
      );
    }
  }
  if (needsMessaging) {
    additionalTools.push(
      "BullMQ + Redis - Open-source job queue for background tasks, scheduled jobs, and async event processing in Node.js."
    );
  }
  if (needsMarketplace) {
    additionalTools.push(
      "Meilisearch - Open-source search engine for fast, typo-tolerant catalog search across listings."
    );
    additionalTools.push(
      "MinIO - Open-source S3-compatible storage for listing images, documents, and media."
    );
  }

  return {
    product_summary,
    stack: {
      frontend,
      backend,
      database,
      hosting,
      cicd,
      additional_tools: additionalTools,
    },
    philosophy:
      "Every recommendation is open-source unless no viable open-source alternative exists. Proprietary tools are explicitly flagged.",
  };
}

function estimateCosts(
  frontend_hosting: string,
  backend_framework: string,
  database: string,
  expected_users: string
) {
  const costs: { item: string; monthlyCost: string; notes: string }[] = [];

  // Frontend hosting
  const frontendLower = frontend_hosting.toLowerCase();
  if (frontendLower.includes("vercel")) {
    costs.push({
      item: "Frontend hosting (Vercel)",
      monthlyCost: expected_users === "large" ? "$20" : "$0",
      notes:
        expected_users === "large"
          ? "Pro plan needed for higher limits"
          : "Free tier covers hobby and small-scale projects",
    });
  } else if (frontendLower.includes("netlify")) {
    costs.push({
      item: "Frontend hosting (Netlify)",
      monthlyCost: expected_users === "large" ? "$19" : "$0",
      notes: "Similar to Vercel pricing",
    });
  } else {
    costs.push({
      item: `Frontend hosting (${frontend_hosting})`,
      monthlyCost: "$0-20",
      notes: "Varies by provider",
    });
  }

  // Backend
  const backendLower = backend_framework.toLowerCase();
  if (
    backendLower.includes("next.js api") ||
    backendLower.includes("api routes")
  ) {
    costs.push({
      item: "Backend (included in frontend hosting)",
      monthlyCost: "$0",
      notes: "API routes run on the same deployment as the frontend",
    });
  } else {
    costs.push({
      item: `Backend hosting (Railway)`,
      monthlyCost: expected_users === "large" ? "$20" : "$5",
      notes: "Railway starter plan",
    });
  }

  // Database
  const dbLower = database.toLowerCase();
  if (dbLower.includes("sqlite") || dbLower.includes("turso")) {
    costs.push({
      item: "Database (Turso SQLite)",
      monthlyCost: "$0",
      notes: "Free tier: 9GB storage, 500M row reads/month",
    });
  } else if (dbLower.includes("postgres")) {
    costs.push({
      item: "Database (PostgreSQL on Railway)",
      monthlyCost: expected_users === "large" ? "$15-30" : "$5",
      notes: "Or use Supabase free tier for small projects (500MB, 50K rows)",
    });
  } else {
    costs.push({
      item: `Database (${database})`,
      monthlyCost: "$0-20",
      notes: "Varies by provider and scale",
    });
  }

  // Domain
  costs.push({
    item: "Domain name",
    monthlyCost: "~$1",
    notes: "$10-15/year for a .com domain",
  });

  const totalMin = costs.reduce((sum, c) => {
    const match = c.monthlyCost.match(/\$(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  return {
    breakdown: costs,
    estimated_total: `$${totalMin}/month`,
    notes:
      "All estimates assume open-source self-hosted options where possible. Costs scale with usage. Most projects start at $0-10/month and grow gradually.",
  };
}

function generateMermaidDiagram(
  product_name: string,
  frontend: string,
  backend: string,
  database: string,
  hosting: string,
  extras: string[]
) {
  let diagram = `graph TB\n`;
  diagram += `  User["👤 User/Client"] --> CDN["🌐 CDN/Edge"]\n`;
  diagram += `  CDN --> Frontend["📱 ${frontend}"]\n`;

  if (
    backend.toLowerCase().includes("api routes") ||
    backend.toLowerCase().includes("next.js")
  ) {
    diagram += `  Frontend --> |"API Routes"| Backend["⚙️ ${backend}"]\n`;
  } else {
    diagram += `  Frontend --> |"REST/GraphQL"| Backend["⚙️ ${backend}"]\n`;
  }

  // Split database if it contains multiple (e.g., "PostgreSQL + Redis")
  const dbParts = database.split("+").map((d) => d.trim());
  if (dbParts.length > 1) {
    diagram += `  Backend --> DB_Primary[("🗄️ ${dbParts[0]}")]\n`;
    diagram += `  Backend --> DB_Cache[("⚡ ${dbParts[1]}")]\n`;
    diagram += `  DB_Cache -.->|"cache sync"| DB_Primary\n`;
  } else {
    diagram += `  Backend --> Database[("🗄️ ${database}")]\n`;
  }

  // Categorize extras into layers
  const blockchainExtras: string[] = [];
  const serviceExtras: string[] = [];
  const infraExtras: string[] = [];

  extras.forEach((extra) => {
    const lower = extra.toLowerCase();
    if (
      lower.includes("hardhat") ||
      lower.includes("ethers") ||
      lower.includes("ipfs") ||
      lower.includes("solidity") ||
      lower.includes("blockchain") ||
      lower.includes("smart contract")
    ) {
      blockchainExtras.push(extra);
    } else if (
      lower.includes("minio") ||
      lower.includes("cdn") ||
      lower.includes("docker") ||
      lower.includes("nginx")
    ) {
      infraExtras.push(extra);
    } else {
      serviceExtras.push(extra);
    }
  });

  // Add blockchain layer as a subgraph if present
  if (blockchainExtras.length > 0) {
    diagram += `\n  subgraph Blockchain["⛓️ Blockchain Layer"]\n`;
    blockchainExtras.forEach((extra, i) => {
      const cleanName = extra.split(" - ")[0].split(" ")[0];
      diagram += `    Chain${i}["${cleanName}"]\n`;
    });
    diagram += `  end\n`;
    diagram += `  Backend --> Blockchain\n`;
  }

  // Add agent layer as a subgraph if present
  const agentExtras: string[] = [];
  const remainingServiceExtras: string[] = [];
  serviceExtras.forEach((extra) => {
    const lower = extra.toLowerCase();
    if (
      lower.includes("langgraph") ||
      lower.includes("mcp") ||
      lower.includes("a2a") ||
      lower.includes("agent") ||
      lower.includes("langchain")
    ) {
      agentExtras.push(extra);
    } else {
      remainingServiceExtras.push(extra);
    }
  });

  if (agentExtras.length > 0) {
    diagram += `\n  subgraph AgentLayer["🤖 Agent Infrastructure"]\n`;
    agentExtras.forEach((extra, i) => {
      const cleanName = extra.split(" - ")[0];
      diagram += `    Agent${i}["${cleanName}"]\n`;
    });
    diagram += `  end\n`;
    diagram += `  Backend --> AgentLayer\n`;

    if (agentExtras.length > 1) {
      for (let i = 0; i < agentExtras.length - 1; i++) {
        diagram += `  Agent${i} -.->|"protocol"| Agent${i + 1}\n`;
      }
    }
  }
  
  // Add service extras
  remainingServiceExtras.forEach((extra, i) => {
    const cleanName = extra.split(" - ")[0].split(" ")[0];
    diagram += `  Backend --> Svc${i}["🔧 ${cleanName}"]\n`;
  });

  // Add infra extras
  infraExtras.forEach((extra, i) => {
    const cleanName = extra.split(" - ")[0].split(" ")[0];
    diagram += `  Backend --> Infra${i}["📦 ${cleanName}"]\n`;
  });

  diagram += `  Backend --> Hosting["☁️ ${hosting}"]\n`;

  // Styling
  diagram += `\n  style User fill:#b89c5a,stroke:#8a7440,color:#0a0a0a\n`;
  diagram += `  style Frontend fill:#1a3a2a,stroke:#2d5a3f,color:#e0e0e0\n`;
  diagram += `  style Backend fill:#1a2a3a,stroke:#2d4a5f,color:#e0e0e0\n`;
  diagram += `  style Hosting fill:#1a1a2a,stroke:#2d2d5a,color:#e0e0e0\n`;
  diagram += `  style CDN fill:#2a2a1a,stroke:#5a5a2d,color:#e0e0e0\n`;

  if (dbParts.length > 1) {
    diagram += `  style DB_Primary fill:#2a1a2a,stroke:#4a2d4a,color:#e0e0e0\n`;
    diagram += `  style DB_Cache fill:#2a1a1a,stroke:#4a2d2d,color:#e0e0e0\n`;
  } else {
    diagram += `  style Database fill:#2a1a2a,stroke:#4a2d4a,color:#e0e0e0\n`;
  }

  if (blockchainExtras.length > 0) {
    diagram += `  style Blockchain fill:#1a1a1a,stroke:#b89c5a,color:#e0e0e0\n`;
  }

  if (agentExtras.length > 0) {
    diagram += `  style AgentLayer fill:#1a1a1a,stroke:#5ab89c,color:#e0e0e0\n`;
  }

  return {
    product_name,
    mermaid_code: diagram,
    instructions:
      "Render this Mermaid diagram to visualize the architecture. The diagram shows the flow from user to frontend to backend, with database, blockchain, and service layers connected to the backend.",
  };
}