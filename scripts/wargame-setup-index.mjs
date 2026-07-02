import { Pinecone } from "@pinecone-database/pinecone";

const INDEX_NAME = "wargame-corpus";

async function main() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

  const existing = await pc.listIndexes();
  if (existing.indexes?.some((i) => i.name === INDEX_NAME)) {
    console.log(`Index "${INDEX_NAME}" already exists. Nothing to do.`);
    return;
  }

  await pc.createIndexForModel({
    name: INDEX_NAME,
    cloud: "aws",
    region: "us-east-1",
    embed: {
      model: "llama-text-embed-v2",
      metric: "cosine",
      fieldMap: { text: "chunk_text" },
    },
    waitUntilReady: true,
  });

  console.log(`Index "${INDEX_NAME}" created and ready.`);
}

main().catch((err) => {
  console.error("Failed to set up Pinecone index:", err);
  process.exit(1);
});
