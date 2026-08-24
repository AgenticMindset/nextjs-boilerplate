import { Pinecone } from "@pinecone-database/pinecone";
import { buildMarketQueryText, marketDefinitionToLabels } from "./prompts";
import type { ConfidenceLevel, MarketDefinition, SourceMode } from "./types";

const INDEX_NAME = "wargame-corpus";

let pineconeClient: Pinecone | null = null;
function getPinecone(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  }
  return pineconeClient;
}

interface CorpusHit {
  score: number;
  title: string;
  chunk_text: string;
  vertical: string;
  technology: string;
  geography: string;
  segment: string;
  date: string;
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

export interface RetrievalResult {
  confidence: ConfidenceLevel;
  sourceMode: SourceMode;
  contextBlock: string;
}

// Groq's TPM (tokens-per-minute) limit for gpt-oss-120b on this account is
// 8,000 tokens per request, shared between input context and generated
// output. These caps keep the merged context comfortably under that ceiling.
const CORPUS_TOP_K = 2;
const CORPUS_CHUNK_CHAR_LIMIT = 900;
const TAVILY_CONTENT_CHAR_LIMIT = 300;

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "...";
}

async function queryCorpus(market: MarketDefinition): Promise<CorpusHit[]> {
  const index = getPinecone().index(INDEX_NAME);
  const queryText = buildMarketQueryText(market);

  const response = await index.searchRecords({
    query: { inputs: { text: queryText }, topK: CORPUS_TOP_K },
    fields: [
      "chunk_text",
      "title",
      "vertical",
      "technology",
      "geography",
      "segment",
      "date",
    ],
  });

  return response.result.hits.map((hit) => {
    const fields = hit.fields as Record<string, string>;
    return {
      score: hit._score,
      title: fields.title,
      chunk_text: truncate(fields.chunk_text, CORPUS_CHUNK_CHAR_LIMIT),
      vertical: fields.vertical,
      technology: fields.technology,
      geography: fields.geography,
      segment: fields.segment,
      date: fields.date,
    };
  });
}

async function tavilySearch(query: string, maxResults: number): Promise<TavilyResult[]> {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      search_depth: "basic",
      max_results: maxResults,
      topic: "news",
    }),
  });

  if (!response.ok) {
    console.error("Tavily search failed:", response.status, await response.text());
    return [];
  }

  const data = await response.json();
  return (data.results ?? []).map((r: TavilyResult) => ({
    title: r.title,
    url: r.url,
    content: truncate(r.content, TAVILY_CONTENT_CHAR_LIMIT),
  }));
}

// Thresholds calibrated empirically against llama-text-embed-v2 cosine
// scores on this corpus: exact market-intersection matches land ~0.60-0.67,
// adjacent/partial matches ~0.45-0.59, unrelated verticals ~0.15-0.30.
function confidenceFromScore(topScore: number | undefined): ConfidenceLevel {
  if (topScore === undefined) return "Low";
  if (topScore >= 0.6) return "High";
  if (topScore >= 0.45) return "Moderate";
  return "Low";
}

function formatCorpusHits(hits: CorpusHit[]): string {
  if (hits.length === 0) return "No indexed corpus coverage for this market.";
  return hits
    .map(
      (h) =>
        `[Corpus | ${h.date} | match ${(h.score * 100).toFixed(0)}%] ${h.title}\n${h.chunk_text}`
    )
    .join("\n\n---\n\n");
}

function formatTavilyResults(results: TavilyResult[]): string {
  if (results.length === 0) return "No live search results returned.";
  return results
    .map((r) => `[Live | ${r.url}] ${r.title}\n${r.content}`)
    .join("\n\n---\n\n");
}

export async function retrieveContext(
  market: MarketDefinition
): Promise<RetrievalResult> {
  const retrievalStart = Date.now();
  const { vertical, technology, geography } = marketDefinitionToLabels(market);

  const [corpusHits, landscapeResults, fundingResults] = await Promise.all([
    queryCorpus(market).catch((err) => {
      console.error("Pinecone query failed:", err);
      return [] as CorpusHit[];
    }),
    tavilySearch(`${vertical} ${technology} market leaders ${geography} 2026`, 3),
    tavilySearch(`${vertical} ${technology} funding rounds acquisitions ${geography} 2026`, 2),
  ]);

  const topScore = corpusHits[0]?.score;
  const confidence = confidenceFromScore(topScore);
  const hasCorpusCoverage = corpusHits.length > 0 && topScore !== undefined && topScore >= 0.45;
  const sourceMode: SourceMode = hasCorpusCoverage ? "Corpus + Live Data" : "Live Data Only";

  const contextBlock = `PRE-INDEXED KNOWLEDGE BASE (structural, may be slightly dated):
${formatCorpusHits(corpusHits)}

LIVE SEARCH RESULTS (recency layer, as of today):
${formatTavilyResults([...landscapeResults, ...fundingResults])}`;

  console.log(
    JSON.stringify({
      event: "retrieval_end",
      feature: "wargame.retrieval",
      vertical,
      technology,
      geography,
      durationMs: Date.now() - retrievalStart,
      corpusHitCount: corpusHits.length,
      topCorpusScore: topScore,
      liveResultCount: landscapeResults.length + fundingResults.length,
      confidence,
      sourceMode,
      ts: new Date().toISOString(),
    })
  );

  return { confidence, sourceMode, contextBlock };
}
