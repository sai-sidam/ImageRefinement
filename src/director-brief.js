import { generateText } from "./google-ai.js";
import { getProduct } from "./shopify.js";
import { ensureConfig } from "./config.js";
import fs from "fs";
import path from "path";

/** Sets already used (from DIRECTORS_SCENE_STANDARD). The LLM must pick a different type of place. */
const SETS_ALREADY_USED = [
  "Post 1: Boutique — ornate mirror, platform/pedestal, clothing rack with hangers, sheer curtains, warm wall.",
  "Post 2: Lobby/lounge — couch/sofa, armchair, side table, potted plant, large window, warm neutrals.",
  "Post 3: White/plaster or terrazzo detail room (detail shot carousel).",
  "Post 4: Light-filled corridor or arched interior — warm stone/tile/plaster, archway, minimal greenery.",
];

/** Inspiration accounts (from DIRECTORS_VIEW). Primary: ohpolly, outcastclothing, misscirclenewyork. */
const REFERENCE_ACCOUNTS = [
  "ohpolly — Bold, aspirational occasion wear; confidence, statement pieces. (Primary inspiration.)",
  "outcastclothing — Trendy, party, bold; nightlife and occasions; edgy, confident. (Primary inspiration.)",
  "misscirclenewyork — Glamorous, confident occasion wear; all eyes on me; statement dresses, NYC energy. (Primary inspiration.)",
  "astee_official — LA aesthetics, sleek semi-formal, clean lines, accessible luxury.",
  "talbotsofficial — Timeless elegance, subtle glamour, sophisticated draping; evening and occasion.",
  "Vici — Trend-forward, effortless chic, blogger-style; feminine + edgy; aspirational but wearable.",
  "babyboofashion — Romantic, figure-enhancing; modern tailoring; casual to semi-formal.",
  "twosistersthelabel — Timeless, whimsical, beautiful occasion wear; feel beautiful and powerful.",
];

/**
 * Build the prompt for Gemini 1.5 Flash to generate a director's brief.
 * @param {object} context - { productTitle, postId, captionAngle?, format?, retrievedContext? }
 * @returns {string}
 */
function buildDirectorBriefPrompt(context) {
  const { productTitle, postId, captionAngle, format, retrievedContext } = context;
  const setsList = SETS_ALREADY_USED.join("\n- ");
  const refList = REFERENCE_ACCOUNTS.join("\n- ");

  return `You are the Creative Director for June & Ember (junenember.com), a women's occasion-wear brand. Generate a short director's brief for one Instagram post. The brief will be used to write the image-generation prompt later.

**Product for this post:** ${productTitle}
**Post number:** ${postId}
${captionAngle ? `**Caption angle (use to inform story/mood):** ${captionAngle}` : ""}
${format ? `**Format:** ${format} (single image = one hero shot; carousel = scene must support multiple angles).` : ""}

${retrievedContext ? `**Retrieved context (internal standards, prior notes, exemplars):**\n${retrievedContext}\n` : ""}

**Set variety (mandatory):** Each post must look distinctly different. These sets are ALREADY USED — do NOT reuse them. Pick a NEW type of place.
- ${setsList}

For Post ${postId}, choose a different type of place (e.g. outdoor terrace, minimal bedroom with linen, garden, stone courtyard, rooftop, etc.). Different materials, different furniture, different props.

**Output format:** Write the brief in plain text. Use these section headers exactly. Keep each section 1–3 sentences.

Director's scene brief for Post ${postId} — ${productTitle}

**Story**
(What moment are we in? e.g. "just arrived at the hotel," "resort afternoon." One clear narrative.)

**Set / environment**
(Where is she? Physical place that supports the story. Be specific: materials, one or two key elements. Explicitly state what this post is NOT — e.g. "Not a lobby with couch; not a boutique with mirror" — and what it IS.)

**Concept**
(One sentence: e.g. "Hero shot for post N; aspirational, welcoming.")

**Reference**
(Pick one inspiration style from this list and name it, or suggest a mood: ${refList})

**Lighting**
(One main source, soft shadows, warm or natural. Must support the story.)

**Pose & model**
(Natural, confident; full-length or as needed; relaxed body language, natural hair; at ease in the space.)

**Face**
(Hero = with face; detail = no face. Say which for this post.)

Do not add any other sections. Output only the brief text, no preamble.`;
}

/**
 * Generate a director's brief using Gemini 1.5 Flash.
 * @param {string} productId - Shopify product ID (for title and context)
 * @param {object} options
 * @param {number} [options.postId] - Post number (default 1)
 * @param {string} [options.captionAngle] - Optional caption angle to inform story/mood
 * @param {string} [options.format] - "single" | "carousel" — affects set choice (carousel = scene must support back/side)
 * @returns {Promise<{ text: string, productTitle: string }>}
 */
export async function generateDirectorBrief(productId, options = {}) {
  ensureConfig();
  const { postId = 1, captionAngle, format, retrievedContext } = options;

  const product = await getProduct(productId);
  const productTitle = product?.title ?? "Unknown product";

  const prompt = buildDirectorBriefPrompt({
    productTitle,
    postId,
    captionAngle,
    format,
    retrievedContext,
  });

  const { text } = await generateText(prompt);
  return { text: text.trim(), productTitle };
}

/**
 * Generate brief and save to a file.
 * @param {string} productId
 * @param {object} options - generateDirectorBrief options plus outputPath or outputDir
 * @param {string} [options.outputPath] - Full path to output file (overrides outputDir + default name)
 * @param {string} [options.outputDir] - Directory for prompts (default instagram-output); filename = post-{NN}-directors-scene-brief.txt
 * @returns {Promise<{ text: string, productTitle: string, savedPath: string }>}
 */
export async function generateAndSaveDirectorBrief(productId, options = {}) {
  const { outputPath, outputDir = "./instagram-output", postId = 1, ...rest } = options;

  const { text, productTitle } = await generateDirectorBrief(productId, { postId, ...rest });

  const resolvedPath = outputPath
    ? path.resolve(outputPath)
    : path.join(path.resolve(outputDir), "prompts", `post-${String(postId).padStart(2, "0")}-directors-scene-brief.txt`);

  const dir = path.dirname(resolvedPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(resolvedPath, text, "utf8");

  return { text, productTitle, savedPath: resolvedPath };
}
