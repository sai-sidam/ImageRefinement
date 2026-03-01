import { refineImageWithNanoBanana, refineWithReferenceImage } from "./google-ai.js";
import { getProduct, getProductImageUrl, fetchImageBytes } from "./shopify.js";
import { ensureConfig } from "./config.js";
import fs from "fs";
import path from "path";

/** Instruction when using a reference image: copy composition/pose/lighting from reference, keep our dress, new face. */
const REFERENCE_INSTRUCTION_BASE =
  "You are given two images. IMAGE 1 is our product: a dress on a model. IMAGE 2 is a reference photo from a fashion brand. Create one new image that: (1) uses the same composition, pose, lighting, setting, and mood as IMAGE 2; (2) the garment worn must be the dress from IMAGE 1 — keep its exact color, pattern, and design; (3) the model's face must be different from both images — natural, diverse, confident. Output sharp, high-resolution, natural-looking fashion photography. June & Ember aesthetic.";

/** Default prompt for Instagram-ready product photos. Preserve garment color when refining existing images. */
const DEFAULT_INSTAGRAM_PROMPT =
  "Refine this product image for Instagram: do not change the garment's color, pattern, or fabric — keep the product exactly as shown. Only improve background, lighting, and composition. Clean, professional look, suitable for social media. Product as hero. Output a high-quality image ready for Instagram feed.";

/**
 * Style presets for women's clothing / fashion Instagram (see docs/INSTAGRAM_GUIDE.md).
 * Use options.style = key (e.g. "lifestyle") or options.prompt for custom text.
 */
export const INSTAGRAM_STYLE_PRESETS = {
  clean:
    "Clean white or neutral studio background, professional product photography, even lighting, product centered. High-quality image for Instagram feed and e-commerce. No props or distractions.",
  lifestyle:
    "Lifestyle product shot: editorial style, soft natural lighting, aspirational but relatable setting. Instagram-ready, on-brand for a women's fashion feed. Product is the hero.",
  flatlay:
    "Flat-lay product shot from directly above, minimal props, clean and aesthetic. Cohesive with a curated Instagram grid. Soft shadows, balanced composition.",
  editorial:
    "Editorial fashion style: strong composition, professional lighting, magazine-quality. Instagram feed ready. Sophisticated and on-brand for women's clothing.",
  minimal:
    "Minimalist product image: clean background, soft lighting, focus on fabric and shape. Simple and elegant, suitable for a refined women's fashion Instagram.",
  /** June & Ember (junenember.com): natural-model style — sharp, natural pose/hair/expression, directional light (see docs/AI_VS_NATURAL_IMAGERY.md). */
  juneember:
    "Refine this product image for Instagram. Keep the garment/dress exactly as is — do not change its color, pattern, or fabric. Output must be sharp, clear, and high-resolution; professional fashion-photography quality. The model (person) must look natural: relaxed natural pose, natural hair with soft movement or natural fall, natural expression and relaxed body language, like a real fashion photograph. Improve only background and lighting: one clear directional light source (e.g. soft window or daylight from one side), soft shadows that match the scene, subtle warmth. Elegant interior or resort setting, well-lit. Product as hero, center frame. June & Ember aesthetic. Preserve original product colors 100%.",
};

/** Expert rule: hero = with face, detail = no face. See docs/SOCIAL_MEDIA_EXPERT.md */
const FRAME_HERO_SUFFIX =
  " Include model face with natural, confident expression; full or three-quarter frame so the outfit is shown in context.";
const FRAME_DETAIL_SUFFIX =
  " Crop at shoulders or show garment only; no face visible. Focus entirely on the outfit and fabric.";

function getPromptForStyle(style, customPrompt) {
  if (customPrompt) return customPrompt;
  const key = String(style || "").toLowerCase().replace(/-/g, "");
  return INSTAGRAM_STYLE_PRESETS[key] || DEFAULT_INSTAGRAM_PROMPT;
}

/** Returns prompt for this image index: hero (0) = with face, detail (1+) = no face. Used when frameStrategy is true (e.g. juneember). */
function getPromptWithFrameStrategy(basePrompt, style, imageIndex) {
  const key = String(style || "").toLowerCase().replace(/-/g, "");
  const useFrameStrategy = key === "juneember";
  if (!useFrameStrategy) return basePrompt;
  const suffix = imageIndex === 0 ? FRAME_HERO_SUFFIX : FRAME_DETAIL_SUFFIX;
  return basePrompt + suffix;
}

/** Allowed content types; each has its own folder. Reel = future (video). */
export const CONTENT_TYPES = ["post", "story", "reel"];

/**
 * Build filename per NAMING_CONVENTION: {type}_{id}_slide-{nn}_{slug}.png or with _v{variant} for variants
 * @param {string} contentType - post | story | reel
 * @param {number} postId - 1-based post/story/reel number
 * @param {number} slideIndex - 0-based slide (01, 02, …)
 * @param {string} slug - product or content slug (lowercase, hyphens)
 * @param {string} [variant] - optional variant label (e.g. "01", "02", "natural-model"); added as _v{variant} before .png
 */
export function buildOutputFilename(contentType, postId, slideIndex, slug, variant) {
  const id = String(postId).padStart(2, "0");
  const nn = String(slideIndex + 1).padStart(2, "0");
  const base = `${contentType}_${id}_slide-${nn}_${slug}`;
  const v = variant != null ? String(variant).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "";
  return v ? `${base}_v${v}.png` : `${base}.png`;
}

/**
 * Refine product image(s) for Instagram using Nano Banana. Fetches from Shopify, edits, saves to disk.
 * Uses type folders (post/, story/, reel/) and naming convention: {type}_{id}_slide-{nn}_{slug}.png
 * @param {string} productId - Shopify product ID
 * @param {object} options
 * @param {string} [options.contentType] - "post" | "story" | "reel". Default "post"
 * @param {number} [options.postId] - Which post/story/reel (1-based). Default 1
 * @param {string} [options.style] - Preset: "clean" | "lifestyle" | "flatlay" | "editorial" | "minimal" | "juneember"
 * @param {string} [options.aspectRatio] - "4:5" (feed), "1:1", "16:9" etc. Default "4:5"
 * @param {string} [options.outputDir] - Base directory; images go to outputDir/{contentType}/. Default "./instagram-output"
 * @param {string} [options.prompt] - Custom edit instruction (overrides style)
 * @param {string} [options.variant] - Variant label for filename (e.g. "02", "natural-model"); produces ..._v02.png
 * @param {string} [options.referenceImageUrl] - URL of reference image (inspiration shot); use its composition/pose/lighting, our dress, new face
 * @param {string} [options.referenceImagePath] - Local path to reference image (alternative to URL)
 * @param {boolean} [options.allImages] - If true, process all product images (carousel); otherwise first only
 * @param {number} [options.maxImages] - Max images when allImages is true. Default 10
 * @returns {Promise<{ productId, productTitle, saved: string[], outputDir: string }>}
 */
export async function refineProductForInstagram(productId, options = {}) {
  ensureConfig();
  const {
    contentType = "post",
    postId = 1,
    style,
    aspectRatio = "4:5",
    outputDir: baseOutputDir = "./instagram-output",
    prompt: customPrompt,
    variant,
    referenceImageUrl,
    referenceImagePath,
    allImages = false,
    maxImages = 10,
  } = options;

  const type = CONTENT_TYPES.includes(String(contentType).toLowerCase()) ? String(contentType).toLowerCase() : "post";
  const prompt = getPromptForStyle(style, customPrompt);

  const product = await getProduct(productId);
  const images = product?.images ?? [];
  if (!images.length) {
    throw new Error(`Product ${productId} has no images.`);
  }

  const toProcess = allImages ? images.slice(0, maxImages) : [images[0]];
  const slug = product.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/gi, "").toLowerCase() || String(productId);
  const outPath = path.resolve(baseOutputDir, type);
  fs.mkdirSync(outPath, { recursive: true });

  let referenceBytes = null;
  if (referenceImageUrl || referenceImagePath) {
    if (referenceImagePath && fs.existsSync(referenceImagePath)) {
      referenceBytes = fs.readFileSync(referenceImagePath);
    } else if (referenceImageUrl) {
      referenceBytes = await fetchImageBytes(referenceImageUrl);
    }
    if (!referenceBytes) {
      throw new Error("Reference image could not be loaded (check --reference-url or --reference-path).");
    }
  }

  const saved = [];

  for (let i = 0; i < toProcess.length; i++) {
    const img = toProcess[i];
    const imageUrl = img.src || getProductImageUrl(product, i);
    if (!imageUrl) continue;

    const imageBytes = await fetchImageBytes(imageUrl);
    let result;
    if (referenceBytes) {
      const refInstruction = getPromptWithFrameStrategy(REFERENCE_INSTRUCTION_BASE, style, i);
      result = await refineWithReferenceImage(
        imageBytes,
        referenceBytes,
        refInstruction,
        "image/jpeg",
        "image/jpeg",
        { aspectRatio, responseModalities: ["TEXT", "IMAGE"] }
      );
    } else {
      const imagePrompt = getPromptWithFrameStrategy(prompt, style, i);
      result = await refineImageWithNanoBanana(
        imageBytes,
        imagePrompt,
        "image/jpeg",
        { aspectRatio, responseModalities: ["TEXT", "IMAGE"] }
      );
    }

    const imageParts = result.imageParts ?? [];
    if (imageParts.length === 0) {
      console.warn(`No image returned for product ${productId} image ${i + 1}.`);
      continue;
    }

    const baseName = buildOutputFilename(type, postId, i, slug, variant);
    const filePath = path.join(outPath, baseName);
    const data = imageParts[0].inlineData?.data;
    if (data) {
      fs.writeFileSync(filePath, Buffer.from(data, "base64"));
      saved.push(filePath);
    }
  }

  return {
    productId,
    productTitle: product.title,
    saved,
    outputDir: outPath,
  };
}
