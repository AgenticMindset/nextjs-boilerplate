export type FrameworkId =
  | "five-whys"
  | "fishbone"
  | "mece-issue-tree"
  | "first-principles"
  | "ooda-loop"
  | "kepner-tregoe"
  | "swot"
  | "theory-of-constraints"
  | "weighted-decision-matrix"
  | "triz"
  | "pdca"
  | "double-diamond";

export interface Framework {
  id: FrameworkId;
  name: string;
  category: string;
  oneLiner: string;
  whenToUse: string;
  howItWorks: string[];
}

export const FRAMEWORKS: Record<FrameworkId, Framework> = {
  "five-whys": {
    id: "five-whys",
    name: "5 Whys",
    category: "Root Cause Analysis",
    oneLiner: "Ask 'why' repeatedly to drill from a symptom down to its root cause.",
    whenToUse: "A single, fairly linear cause-and-effect chain behind one clear symptom.",
    howItWorks: [
      "State the problem precisely.",
      "Ask why it happens; write down the answer.",
      "Ask why that answer is true; repeat.",
      "Continue roughly five times until you reach a root cause you can act on.",
      "Verify the chain by reading it back forwards.",
    ],
  },
  fishbone: {
    id: "fishbone",
    name: "Fishbone (Ishikawa) Diagram",
    category: "Root Cause Analysis",
    oneLiner: "Map every plausible contributing cause across categories to find where multiple factors intersect.",
    whenToUse: "A problem with several plausible contributing factors that a single why-chain can't capture.",
    howItWorks: [
      "Write the problem as the 'head' of the fish.",
      "Draw major cause categories as bones (e.g. People, Process, Tools, Environment).",
      "Brainstorm specific causes under each category.",
      "Look for causes that appear in multiple branches or interact with each other.",
      "Prioritize the most likely and most testable causes.",
    ],
  },
  "mece-issue-tree": {
    id: "mece-issue-tree",
    name: "MECE Issue Tree",
    category: "Structured Problem Breakdown",
    oneLiner: "Break a broad, fuzzy problem into mutually exclusive, collectively exhaustive sub-problems.",
    whenToUse: "A broad or vague problem that needs to be decomposed before it can be tackled at all.",
    howItWorks: [
      "State the problem as a single top-level question.",
      "Split it into a small set of sub-questions that don't overlap and together cover the whole problem.",
      "Recurse on each sub-question until branches are small enough to investigate directly.",
      "Investigate or assign owners to the smallest branches.",
      "Roll findings back up to answer the top-level question.",
    ],
  },
  "first-principles": {
    id: "first-principles",
    name: "First Principles Thinking",
    category: "Assumption-Challenging",
    oneLiner: "Strip a problem down to its fundamental truths and reason back up, ignoring inherited assumptions.",
    whenToUse: "The current approach is constrained by 'this is how it's always been done' rather than real constraints.",
    howItWorks: [
      "Identify and write down every assumption embedded in the current approach.",
      "For each assumption, ask whether it is a fundamental truth or just convention.",
      "Discard the conventions; keep only what is actually true (physics, law, hard resource limits).",
      "Rebuild a solution from those fundamentals alone, without importing the old approach's shape.",
      "Sanity-check the new solution against the real constraints you kept.",
    ],
  },
  "ooda-loop": {
    id: "ooda-loop",
    name: "OODA Loop",
    category: "Fast/Adversarial Decision-Making",
    oneLiner: "Observe, Orient, Decide, Act — cycle faster than the situation changes.",
    whenToUse: "A fast-moving, competitive, or time-pressured situation where speed of adaptation matters more than perfect analysis.",
    howItWorks: [
      "Observe: gather the latest real data on the situation, discarding stale assumptions.",
      "Orient: interpret it through your goals, constraints, and what's changed since last cycle.",
      "Decide: commit to the best available action, not the perfect one.",
      "Act: execute quickly.",
      "Immediately re-observe and repeat, cycling faster than the situation can outpace you.",
    ],
  },
  "kepner-tregoe": {
    id: "kepner-tregoe",
    name: "Kepner-Tregoe Problem Analysis",
    category: "Root Cause Analysis",
    oneLiner: "Precisely define what changed, when, and where to isolate the cause of a new deviation.",
    whenToUse: "Something that used to work correctly has started failing, and you need to pinpoint exactly what changed.",
    howItWorks: [
      "Describe the deviation: what is wrong, and what would 'normal' look like instead.",
      "Specify IS vs IS NOT: where/when/on what does it occur, and where/when/on what does it not occur despite being a plausible candidate.",
      "Identify distinctions: what is unique about the IS cases compared to the IS NOT cases.",
      "Identify changes: what changed around the time the problem started.",
      "Test the most probable cause against all the IS/IS NOT facts before accepting it.",
    ],
  },
  swot: {
    id: "swot",
    name: "SWOT Analysis",
    category: "Strategic Positioning",
    oneLiner: "Map Strengths, Weaknesses, Opportunities, and Threats to clarify strategic position.",
    whenToUse: "A strategic or positioning question where internal capability and external environment both matter.",
    howItWorks: [
      "List internal Strengths: what gives you an advantage.",
      "List internal Weaknesses: what puts you at a disadvantage.",
      "List external Opportunities: favorable trends or gaps you could exploit.",
      "List external Threats: unfavorable trends or competitive pressure.",
      "Pair them (e.g. Strength vs Opportunity) to generate concrete strategic moves, not just a static list.",
    ],
  },
  "theory-of-constraints": {
    id: "theory-of-constraints",
    name: "Theory of Constraints",
    category: "Systems/Process",
    oneLiner: "Find the single bottleneck capping the whole system's output and fix that first.",
    whenToUse: "A system or process is underperforming and one stage is likely capping everything downstream of it.",
    howItWorks: [
      "Identify the constraint: the single step that limits overall throughput.",
      "Exploit it: get the most out of that step without spending on anything else yet.",
      "Subordinate everything else to that decision, even if it looks locally inefficient elsewhere.",
      "Elevate the constraint: invest to increase its capacity if exploiting it wasn't enough.",
      "Once it's no longer the constraint, repeat the process on the new bottleneck.",
    ],
  },
  "weighted-decision-matrix": {
    id: "weighted-decision-matrix",
    name: "Weighted Decision Matrix",
    category: "Decision-Making",
    oneLiner: "Score multiple well-defined options against weighted criteria to make the trade-offs explicit.",
    whenToUse: "Choosing between several concrete, already-identified options on more than one criterion.",
    howItWorks: [
      "List the candidate options.",
      "List the criteria that matter and assign each a weight reflecting its importance.",
      "Score every option against every criterion.",
      "Multiply each score by its criterion's weight and sum per option.",
      "Use the ranked totals as an input to the decision, then sanity-check against anything the matrix can't capture.",
    ],
  },
  triz: {
    id: "triz",
    name: "TRIZ (Inventive Problem Solving)",
    category: "Innovation/Contradiction Resolution",
    oneLiner: "Resolve a hard trade-off (faster AND cheaper AND better) instead of accepting it as fixed.",
    whenToUse: "The problem is framed as a contradiction between two requirements that both seem non-negotiable.",
    howItWorks: [
      "State the contradiction precisely: improving X worsens Y.",
      "Ask what would have to be true to get more of X without giving up Y.",
      "Look for ways to separate the conflicting requirements — in time, in space, by condition, or by changing the system's structure.",
      "Search for analogous problems (in other industries or fields) that already resolved a similar contradiction.",
      "Adapt the most promising resolution to your specific system.",
    ],
  },
  pdca: {
    id: "pdca",
    name: "PDCA (Plan-Do-Check-Act)",
    category: "Continuous Improvement",
    oneLiner: "Run small, controlled improvement cycles on an ongoing process.",
    whenToUse: "An ongoing process needs steady, iterative improvement rather than a one-off fix.",
    howItWorks: [
      "Plan: define the change you'll test and the outcome you expect.",
      "Do: implement it on a small, controlled scale.",
      "Check: compare actual results against what you expected.",
      "Act: standardize the change if it worked, or adjust and re-plan if it didn't.",
      "Repeat the cycle continuously rather than treating any single pass as final.",
    ],
  },
  "double-diamond": {
    id: "double-diamond",
    name: "Double Diamond (Discover-Define-Develop-Deliver)",
    category: "Design/Open-Ended Innovation",
    oneLiner: "Diverge to explore the real problem, converge on a definition, diverge on solutions, converge on one to ship.",
    whenToUse: "The problem itself is unclear or under-defined, typically in design or open-ended innovation work.",
    howItWorks: [
      "Discover: diverge — explore the problem space broadly without judging ideas yet.",
      "Define: converge — synthesize what you learned into one clear, specific problem statement.",
      "Develop: diverge again — generate and prototype multiple possible solutions to that problem.",
      "Deliver: converge — test, refine, and ship the strongest solution.",
    ],
  },
};

export const FRAMEWORK_LIST: Framework[] = Object.values(FRAMEWORKS);
