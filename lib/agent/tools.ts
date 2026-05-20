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
  if (needsRealtime && expected_users === "large") {
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
  diagram += `  User["👤 User"] --> CDN["🌐 CDN/Edge"]\n`;
  diagram += `  CDN --> Frontend["📱 ${frontend}"]\n`;

  if (
    backend.toLowerCase().includes("api routes") ||
    backend.toLowerCase().includes("next.js")
  ) {
    diagram += `  Frontend --> |"API Routes"| Backend["⚙️ ${backend}"]\n`;
  } else {
    diagram += `  Frontend --> |"REST/GraphQL"| Backend["⚙️ ${backend}"]\n`;
  }

  diagram += `  Backend --> Database[("🗄️ ${database}")]\n`;

  extras.forEach((extra, i) => {
    const cleanName = extra.split(" ")[0].split("-")[0];
    diagram += `  Backend --> Extra${i}["🔧 ${cleanName}"]\n`;
  });

  diagram += `  Backend --> Hosting["☁️ ${hosting}"]\n`;

  diagram += `\n  style User fill:#b89c5a,stroke:#8a7440,color:#0a0a0a\n`;
  diagram += `  style Frontend fill:#1a3a2a,stroke:#2d5a3f,color:#e0e0e0\n`;
  diagram += `  style Backend fill:#1a2a3a,stroke:#2d4a5f,color:#e0e0e0\n`;
  diagram += `  style Database fill:#2a1a2a,stroke:#4a2d4a,color:#e0e0e0\n`;
  diagram += `  style Hosting fill:#1a1a2a,stroke:#2d2d5a,color:#e0e0e0\n`;
  diagram += `  style CDN fill:#2a2a1a,stroke:#5a5a2d,color:#e0e0e0\n`;

  return {
    product_name,
    mermaid_code: diagram,
    instructions:
      "Render this Mermaid diagram to visualize the architecture. The diagram shows the flow from user to frontend to backend to database, with any additional services connected to the backend.",
  };
}