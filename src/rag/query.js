import path from "path";
import { embedText } from "./embeddings.js";
import { cosineSimilarity } from "./vector.js";

export function formatHit(hit) {
  const rel = path.relative(process.cwd(), hit.absPath);
  return `${hit.score.toFixed(4)} ${rel}:${hit.startLine}-${hit.endLine}`;
}

/**
 * Query a loaded index with semantic similarity.
 */
export async function queryIndex(indexData, query, { model, k = 6 } = {}) {
  if (!indexData?.chunks?.length) {
    throw new Error("RAG index is empty. Run: npm run refine -- rag index");
  }

  const queryEmbedding = await embedText(query, {
    model: model || indexData.model || "gemini-embedding-001",
  });

  const scored = [];
  for (const ch of indexData.chunks) {
    if (!Array.isArray(ch.embedding)) continue;
    const score = cosineSimilarity(queryEmbedding, ch.embedding);
    scored.push({ ...ch, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, Math.max(1, k));
}

/**
 * Turn hits into a prompt-ready context block.
 * (What each agent should retrieve is intentionally left configurable; this is generic.)
 */
export function hitsToContextBlock(hits) {
  const blocks = hits.map((h) => {
    const rel = path.relative(process.cwd(), h.absPath);
    return `SOURCE: ${rel}:${h.startLine}-${h.endLine}\n${h.text}`.trimEnd();
  });
  return blocks.join("\n\n---\n\n");
}

