import { generateText } from "./google-ai.js";
import { getProduct } from "./shopify.js";
import { ensureConfig } from "./config.js";
import fs from "fs";
import path from "path";

/** Sets already used (from DIRECTOR_BRIEF_AND_VISION). The LLM must pick a different type of place. */
const SETS_ALREADY_USED = [
  "Post 1: Boutique — ornate mirror, platform/pedestal, clothing rack with hangers, sheer curtains, warm wall.",
  "Post 2: Lobby/lounge — couch/sofa, armchair, side table, potted plant, large window, warm neutrals.",
  "Post 3: White/plaster or terrazzo detail room (detail shot carousel).",
  "Post 4: Light-filled corridor or arched interior — warm stone/tile/plaster, archway, minimal greenery.",
];

/**
 * Build the prompt for Gemini 1.5 Flash to generate a director's brief.
 * @param {object} context - { productTitle, postId, captionAngle?, format?, retrievedContext? }
 * @returns {string}
 */
function buildDirectorBriefPrompt(context) {
  const { productTitle, postId, captionAngle, format, retrievedContext } = context;
  const setsList = SETS_ALREADY_USED.join("\n- ");

  return `You are the Creative Director for June & Ember (junenember.com), a women's occasion-wear brand. Generate a short director's brief for one Instagram post. The brief will be used to write the image-generation prompt later.

**Product for this post:** ${productTitle}
**Post number:** ${postId}
${captionAngle ? `**Caption angle (use to inform story/mood):** ${captionAngle}` : ""}
${format ? `**Format:** ${format} (single image = one hero shot; carousel = scene must support multiple angles).` : ""}

${retrievedContext ? `**Retrieved context (internal standards, prior notes, exemplars):**\n${retrievedContext}\n` : ""}

**Set / environment:** The set does **not** have to be different from previous posts. It must be **creative and bold enough** to capture the audience, and it does not have to look the same every time. You have full creative freedom: same type of place is fine if it feels fresh and intentional; a new type of place is fine too. Prioritise specific, striking environments over generic ones. For context, these sets have been used before (use only to inform your choice, not as a hard "must avoid" list):
- ${setsList}

**Moment (required):** Every image must have a **moment** — what is she *doing* in the frame, not just posing for the camera. You MUST name one specific, concrete activity (e.g. "walking toward the railing, hand trailing along it," "pausing with a glass, looking at the city lights," "stepping through the doorway into the light," "adjusting her earring while looking away from camera"). Avoid: "standing elegantly," "leaning confidently," "showcasing the dress," "posing" — these read as static and AI-like. The moment should feel like a candid slice of life, not a deliberate pose for the camera. Be concrete and specific.

**Output format:** Write the brief in plain text. Use these section headers exactly. Keep each section 1–3 sentences.

Director's scene brief for Post ${postId} — ${productTitle}

**Story**
(What moment are we in? e.g. "just arrived at the hotel," "resort afternoon." One clear narrative.)

**Set / environment**
(Where is she? Be concretely specific — not generic "elegant interior." Name a real, specific place (examples of the level of specificity: brownstone steps in Brooklyn, piano in a moody lounge, SoHo street at golden hour; you are not limited to these). Materials, one or two key elements. State what this post is NOT and what it IS.)

**Moment**
(What is she *doing* in the frame? One clear activity or moment that fits the story. Not "posing for camera" — a real moment. You have full creative freedom; examples are only to show the kind of specificity we want.)

**Concept**
(One sentence: e.g. "Hero shot for post N; aspirational, welcoming" or "Editorial hero; bold, understated luxury" or another concept that fits — aspirational and understated luxury are options, not the only options.)

**Lighting**
(Define the light that fits the story and location. Full creative freedom: e.g. one soft source and warm shadows, or LA light, NYC golden hour, Greece sunset, Monaco sunset, sunrise, harsh afternoon beach light, moody interior — whatever supports the story. Not limited to "one main source, soft, warm.")

**Pose & model**
(Pose that supports the moment and concept. Can be natural and confident; can also be bold editorial (Vogue-style), out-of-the-box, unorthodox, or unconventional when it serves the story. Full-length or as needed; she can be in the middle of the moment or in a striking, deliberate pose. Not limited to "relaxed" only.)

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
