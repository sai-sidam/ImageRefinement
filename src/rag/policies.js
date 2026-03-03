import path from "path";

/**
 * Per-agent RAG retrieval policies. See docs/RAG_AGENT_POLICIES.md for full narrative.
 * allowedPathPatterns: substrings to match against path relative to cwd; hit is kept if any pattern matches.
 */

export const POLICY_SMM = {
  id: "smm",
  name: "Social Media Manager",
  k: 8,
  queryPrefix:
    "June & Ember Social Media Manager. Content mix, format rules, captions, hashtags, early-stage goals, algorithm. ",
  allowedPathPatterns: [
    "docs/SOCIAL_MEDIA_EXPERT",
    "docs/INSTAGRAM_GUIDE",
    "docs/INSTAGRAM_RESEARCH",
    "docs/JUNE_EMBER_BRAND",
    "docs/CUSTOMER_AND_EMPATHY",
    "docs/CAPTION_AND_HASHTAG",
    "docs/VISUAL_SYSTEM",
    "docs/NO_GAPS",
    "instagram-output/ALL_POSTS_READY",
    "knowledge/exemplars",
    "knowledge/lessons",
  ],
};

export const POLICY_DIRECTOR = {
  id: "director",
  name: "Director (Creative Director / Art Director)",
  k: 6,
  queryPrefix:
    "June & Ember Creative Director. Director's scene standard, set variety, approved-image workflow, single vs carousel. ",
  allowedPathPatterns: [
    "docs/DIRECTORS_SCENE_STANDARD",
    "docs/DIRECTORS_VIEW",
    "docs/JUNE_EMBER_BRAND",
    "docs/ARCHITECTURE",
    "instagram-output/prompts",
    "instagram-output/ALL_POSTS_READY",
    "knowledge/exemplars",
    "knowledge/lessons",
  ],
};

const POLICIES = new Map([
  ["smm", POLICY_SMM],
  ["director", POLICY_DIRECTOR],
]);

export function getPolicy(agentId) {
  return POLICIES.get(agentId?.toLowerCase()) ?? null;
}

/**
 * Filter RAG hits to only those allowed by the agent's policy.
 * @param {Array<{ absPath: string }>} hits - Scored hits from queryIndex
 * @param {{ allowedPathPatterns: string[] }} policy - Policy object (e.g. POLICY_SMM)
 * @param {string} [cwd] - Project root; defaults to process.cwd()
 * @returns {Array} Filtered hits in same order (only allowed sources)
 */
export function filterHitsByPolicy(hits, policy, cwd = process.cwd()) {
  if (!policy?.allowedPathPatterns?.length) return hits;
  const patterns = policy.allowedPathPatterns;
  return hits.filter((hit) => {
    const rel = path.relative(cwd, hit.absPath);
    const normalized = rel.replace(/\\/g, "/");
    return patterns.some((p) => normalized.includes(p.replace(/\\/g, "/")));
  });
}

/**
 * Build a full query string for an agent: prefix + task-specific part.
 */
export function buildQueryForAgent(agentId, taskQuery) {
  const policy = getPolicy(agentId);
  const prefix = policy?.queryPrefix ?? "";
  const part = typeof taskQuery === "string" ? taskQuery.trim() : "";
  return prefix ? `${prefix}${part}` : part;
}
