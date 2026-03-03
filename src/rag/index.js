import path from "path";
import { DEFAULT_EMBEDDING_MODEL, DEFAULT_INDEX_PATH, DEFAULT_SOURCE_ROOTS } from "./constants.js";
import { indexCorpus } from "./indexer.js";
import { getPolicy, filterHitsByPolicy, buildQueryForAgent } from "./policies.js";
import { queryIndex, hitsToContextBlock } from "./query.js";
import { loadIndex, saveIndex } from "./store.js";

export function resolveIndexPath(p) {
  return path.resolve(p || DEFAULT_INDEX_PATH);
}

export function resolveSourceRoots(roots) {
  if (!roots?.length) return DEFAULT_SOURCE_ROOTS;
  return roots.map((r) => path.resolve(r));
}

export async function runRagIndex({
  sourceRoots,
  indexPath,
  model = DEFAULT_EMBEDDING_MODEL,
  maxChars = 1800,
  overlapLines = 8,
  log,
}) {
  const resolvedIndexPath = resolveIndexPath(indexPath);
  const resolvedRoots = resolveSourceRoots(sourceRoots);
  const existing = loadIndex(resolvedIndexPath);

  const indexData = await indexCorpus({
    sourceRoots: resolvedRoots,
    indexPath: resolvedIndexPath,
    model,
    maxChars,
    overlapLines,
    existingIndex: existing,
    log,
  });

  saveIndex(resolvedIndexPath, indexData);
  return { indexPath: resolvedIndexPath, indexData };
}

export async function runRagQuery({
  indexPath,
  query,
  k = 6,
  model,
  agentId,
}) {
  const resolvedIndexPath = resolveIndexPath(indexPath);
  const indexData = loadIndex(resolvedIndexPath);
  if (!indexData) {
    throw new Error(`RAG index not found at ${resolvedIndexPath}. Run: npm run refine -- rag index`);
  }

  let effectiveQuery = query;
  let effectiveK = k;
  const policy = agentId ? getPolicy(agentId) : null;
  if (policy) {
    effectiveQuery = buildQueryForAgent(agentId, query);
    effectiveK = policy.k;
  }

  const fetchK = Math.max(effectiveK * 2, 20);
  let hits = await queryIndex(indexData, effectiveQuery, { k: fetchK, model });

  if (policy) {
    hits = filterHitsByPolicy(hits, policy);
    hits = hits.slice(0, policy.k);
  }

  const context = hitsToContextBlock(hits);
  return { indexPath: resolvedIndexPath, hits, context };
}

