import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Pinecone } from "@pinecone-database/pinecone";

const INDEX_NAME = "wargame-corpus";
const CORPUS_DIR = path.join(process.cwd(), "data", "wargame-corpus");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("File is missing a --- frontmatter block");
  }
  const [, frontmatterBlock, body] = match;
  const metadata = {};
  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const lineMatch = line.match(/^([a-zA-Z0-9_]+):\s*"?(.*?)"?\s*$/);
    if (!lineMatch) continue;
    const [, key, value] = lineMatch;
    metadata[key] = value;
  }
  return { metadata, body: body.trim() };
}

async function main() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.index(INDEX_NAME);

  const files = (await readdir(CORPUS_DIR)).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    console.log("No corpus files found in", CORPUS_DIR);
    return;
  }

  const records = [];
  for (const file of files) {
    const raw = await readFile(path.join(CORPUS_DIR, file), "utf-8");
    const { metadata, body } = parseFrontmatter(raw);
    const required = ["title", "vertical", "technology", "geography", "segment", "date"];
    for (const key of required) {
      if (!metadata[key]) {
        throw new Error(`${file} is missing required frontmatter field "${key}"`);
      }
    }
    records.push({
      id: file.replace(/\.md$/, ""),
      chunk_text: `${metadata.title}\n\n${body}`,
      title: metadata.title,
      vertical: metadata.vertical,
      technology: metadata.technology,
      geography: metadata.geography,
      segment: metadata.segment,
      date: metadata.date,
    });
  }

  console.log(`Upserting ${records.length} records into "${INDEX_NAME}"...`);
  await index.upsertRecords({ records });
  console.log("Done.");
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
