// Golden-case tests for the Tech Stack Advisor's deterministic tools
// (recommend_stack, estimate_costs, generate_diagram). These are pure
// rule-based functions wrapped by the AI SDK's tool() helper - no LLM
// calls, so they run fast, free, and deterministically in CI. The one
// tool that does hit a live API (research_current_landscape, via Tavily)
// is intentionally not covered here; see evals/README.md.
import { describe, it, expect } from "vitest";
import { agentTools } from "../lib/agent/tools";

const stub = { toolCallId: "eval", messages: [] };

describe("recommend_stack", () => {
  it("recommends a beginner-friendly stack for a small, beginner team", async () => {
    const result = await agentTools.recommend_stack.execute(
      {
        product_summary: "A simple todo list app",
        expected_users: "small",
        team_skill_level: "beginner",
        key_features: ["task list"],
      },
      stub
    );
    expect(result.stack.frontend.tool).toBe("Next.js");
    expect(result.stack.backend.tool).toBe("Next.js API Routes");
    expect(result.stack.hosting.tool).toBe("Vercel");
  });

  it("recommends Python/FastAPI backend for agent infrastructure needs", async () => {
    const result = await agentTools.recommend_stack.execute(
      {
        product_summary: "A multi-agent orchestration platform",
        expected_users: "large",
        team_skill_level: "advanced",
        key_features: ["multi-agent workflows", "MCP integration"],
      },
      stub
    );
    expect(result.stack.backend.tool).toBe("FastAPI (Python)");
    expect(
      result.stack.additional_tools.some((t: string) => t.includes("LangGraph"))
    ).toBe(true);
    expect(
      result.stack.additional_tools.some((t: string) => t.includes("Model Context Protocol"))
    ).toBe(true);
  });

  it("flags Stripe as the one proprietary exception for payments", async () => {
    const result = await agentTools.recommend_stack.execute(
      {
        product_summary: "An e-commerce checkout flow",
        expected_users: "medium",
        team_skill_level: "intermediate",
        key_features: ["checkout", "subscription billing"],
      },
      stub
    );
    const paymentsNote = result.stack.additional_tools.find((t: string) =>
      t.includes("Stripe")
    );
    expect(paymentsNote).toBeDefined();
    expect(paymentsNote).toMatch(/proprietary/i);
  });

  it("recommends PostgreSQL + Redis for realtime apps at large scale", async () => {
    const result = await agentTools.recommend_stack.execute(
      {
        product_summary: "A live collaborative whiteboard",
        expected_users: "large",
        team_skill_level: "advanced",
        key_features: ["real-time sync", "websocket presence"],
      },
      stub
    );
    expect(result.stack.database.tool).toBe("PostgreSQL + Redis");
  });
});

describe("estimate_costs", () => {
  it("returns a zero-cost breakdown for a small Next.js-on-Vercel stack", async () => {
    const result = await agentTools.estimate_costs.execute(
      {
        frontend_hosting: "Vercel",
        backend_framework: "Next.js API Routes",
        database: "SQLite (Turso)",
        expected_users: "small",
      },
      stub
    );
    expect(result.breakdown.length).toBeGreaterThan(0);
    expect(result.estimated_total).toMatch(/^\$\d+\/month$/);
  });

  it("scales cost estimates up for large user counts", async () => {
    const result = await agentTools.estimate_costs.execute(
      {
        frontend_hosting: "Vercel",
        backend_framework: "FastAPI (Python)",
        database: "PostgreSQL",
        expected_users: "large",
      },
      stub
    );
    const totalMatch = result.estimated_total.match(/\$(\d+)/);
    expect(totalMatch).not.toBeNull();
    expect(Number(totalMatch![1])).toBeGreaterThan(10);
  });
});

describe("generate_diagram", () => {
  it("produces valid-looking Mermaid syntax with the given layers", async () => {
    const result = await agentTools.generate_diagram.execute(
      {
        product_name: "TestApp",
        frontend: "Next.js",
        backend: "Hono",
        database: "PostgreSQL",
        hosting: "Railway",
        extras: ["Socket.IO"],
      },
      stub
    );
    expect(result.mermaid_code).toContain("graph TB");
    expect(result.mermaid_code).toContain("Next.js");
    expect(result.mermaid_code).toContain("Socket.IO");
  });

  it("splits a combined database string into two nodes", async () => {
    const result = await agentTools.generate_diagram.execute(
      {
        product_name: "TestApp",
        frontend: "SvelteKit",
        backend: "Hono",
        database: "PostgreSQL + Redis",
        hosting: "Railway",
        extras: [],
      },
      stub
    );
    expect(result.mermaid_code).toContain("DB_Primary");
    expect(result.mermaid_code).toContain("DB_Cache");
  });
});
