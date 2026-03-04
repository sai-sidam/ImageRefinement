/**
 * Expert-draft flow: ask Gemini for creative/strategic advice on guidelines.
 * Gemini is the "brain" (expertise, creativity); Cursor/the user implement.
 * Use when the user is defining or questioning what the Director, SMM, or process should do.
 */

import fs from "fs";
import path from "path";
import { generateText } from "./google-ai.js";
import { ensureConfig } from "./config.js";

/** Key guideline docs for Gemini to review (paths relative to project root). */
export const GUIDELINE_DOCS_FOR_REVIEW = [
  "docs/DIRECTOR_BRIEF_AND_VISION.md",
  "docs/RAG_AGENT_POLICIES.md",
  "docs/AI_ASSISTANT_WORKFLOW.md",
  "docs/INSPIRATION_STRATEGY.md",
  "docs/SOCIAL_MEDIA_EXPERT.md",
  "docs/AI_CREATIVE_GUIDELINES.md",
  "docs/TOOL_FEEDBACK.md",
  "docs/BRAND_ASSET_MANAGEMENT.md",
  "docs/COLLECTION_AND_CAMPAIGN_GUIDELINES.md",
  "docs/SMM_PLAN_POST.md",
];

const EXPERT_SYSTEM = `You are the creative and strategic expert for June & Ember (junenember.com), a women's occasion-wear brand on Instagram. The user is defining or questioning what the Director (Creative Director / Art Director), the SMM (Social Media Manager), or the content process should or shouldn't do.

Your role: Give your expert view — suggest, refine, or flag issues. Be concise but substantive. If the user asks "what do you think?", give a clear opinion and reasoning. If they propose a rule or constraint, say whether it makes sense and how you'd sharpen or broaden it. You're the brain for creative and strategic decisions; the user (and their dev environment) will implement.`;

/**
 * Ask Gemini for guideline/expert advice. Use this when the user's question is creative or strategic (e.g. "Director should do X, not Y. What do you think?").
 * @param {string} userMessage - What the user said or asked (e.g. their guideline idea or follow-up question).
 * @param {object} [options]
 * @param {string} [options.retrievedContext] - Current guidelines from RAG (Director/SMM docs) so Gemini can respond in context.
 * @param {string} [options.previousExchange] - Previous Q&A (e.g. "User said: ... You replied: ...") for follow-up turns.
 * @returns {Promise<{ text: string }>} Gemini's reply (to show in chat).
 */
export async function askGeminiForGuidelineAdvice(userMessage, options = {}) {
  ensureConfig();
  const { retrievedContext, previousExchange } = options;

  let prompt = EXPERT_SYSTEM + "\n\n";

  if (retrievedContext) {
    prompt += "**Current guidelines (for context):**\n" + retrievedContext + "\n\n";
  }
  if (previousExchange) {
    prompt += "**Previous exchange:**\n" + previousExchange + "\n\n";
  }

  prompt += "**User message:**\n" + userMessage + "\n\nRespond with your expert view (directly, no preamble).";

  const { text } = await generateText(prompt);
  return { text: text.trim() };
}

const REVIEW_SYSTEM = `You are the creative and strategic expert for June & Ember (junenember.com), a women's occasion-wear brand on Instagram. You are being asked to **review** the project's current guidelines and documents (Director, SMM, RAG, expert-draft flow, etc.).

Your role: Read the guidelines below and give your expert view. Consider:
- **Consistency**: Are the rules clear and consistent across docs? Any contradictions?
- **Improvements**: What could be sharper, clearer, or more useful?
- **Different perspective**: What might be missing? Other cases or edge cases to cover?
- **Gaps**: Anything the team might not have thought of?

Be concise but substantive. Structure your reply (e.g. Consistency / Improvements / Other cases) so the user can react and then implement changes.`;

/**
 * Ask Gemini to review all key guideline docs. Use this so Gemini can verify, improve, or add perspective before we lock the rules.
 * @param {string} docsContext - Concatenated content of the guideline docs (each doc with a clear "--- Doc: path ---" header).
 * @returns {Promise<{ text: string }>} Gemini's review (to show in chat).
 */
export async function askGeminiToReviewGuidelines(docsContext) {
  ensureConfig();
  const prompt =
    REVIEW_SYSTEM +
    "\n\n---\n\n**Current guidelines (for review):**\n\n" +
    docsContext +
    "\n\n---\n\nReview the above and respond with your expert view (consistency, improvements, other cases, gaps).";

  const { text } = await generateText(prompt);
  return { text: text.trim() };
}

/**
 * Load key guideline docs from disk and concatenate for review. Skips missing files.
 * @param {string} projectRoot - Project root (e.g. process.cwd()).
 * @param {string[]} [docPaths] - Relative paths; defaults to GUIDELINE_DOCS_FOR_REVIEW.
 * @param {number} [maxCharsPerDoc] - Cap per doc to avoid token overflow (default 12000).
 * @returns {string}
 */
export function loadGuidelineDocsForReview(projectRoot, docPaths = GUIDELINE_DOCS_FOR_REVIEW, maxCharsPerDoc = 12000) {
  const parts = [];
  for (const rel of docPaths) {
    const abs = path.join(projectRoot, rel);
    if (!fs.existsSync(abs)) continue;
    let content = fs.readFileSync(abs, "utf8");
    if (maxCharsPerDoc && content.length > maxCharsPerDoc) {
      content = content.slice(0, maxCharsPerDoc) + "\n\n[... truncated for length ...]";
    }
    parts.push(`--- Doc: ${rel} ---\n\n${content}`);
  }
  return parts.join("\n\n");
}
