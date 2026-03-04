import { refineImageWithNanoBanana, refineWithReferenceImage, refineWithMultipleImages } from "./google-ai.js";
import { getProduct, getProductImageUrl, fetchImageBytes } from "./shopify.js";
import { ensureConfig } from "./config.js";
import fs from "fs";
import path from "path";

/** Instruction when generating back pose using the product's actual back image(s) from Shopify. IMAGE 1 = our scene. IMAGE 2 (and optional IMAGE 3) = actual back of the dress. Output = same room, model from behind, dress back identical to the reference(s). */
function getBackWithProductBackReferenceInstruction(numBackImages) {
  const refText = numBackImages === 1
    ? "IMAGE 2: The actual back of this dress from the product catalog."
    : "IMAGE 2 and IMAGE 3: The actual back of this dress from the product catalog (two reference angles).";
  const matchText = numBackImages === 1
    ? "The BACK of the dress she is wearing must look EXACTLY like IMAGE 2. Copy the back design from IMAGE 2 precisely."
    : "The BACK of the dress she is wearing must look EXACTLY like IMAGE 2 and IMAGE 3. Copy the back design from these references precisely — same details, positions, and style.";
  return `You are given ${numBackImages + 1} image(s).

IMAGE 1: Our approved detail shot — a woman in a dress in a room (same room we want to keep). This is the scene and lighting.

${refText}

TASK: Generate ONE image. The image must have:
- The SAME room, same floor, same walls, same lighting as IMAGE 1. Same scale (model not oversized; environment has presence).
- The model is shown FROM BEHIND, looking over her shoulder toward the camera (so she is still posing for the camera).
- ${matchText} Same number of details (e.g. criss-cross, lacing, appliqué), same positions, same style. Do not add, remove, or alter any element.

Output: One image. Same quality, same room, dress back identical to the product reference(s). June & Ember aesthetic.`;
}

/** Instruction when using a reference image. Images are sent as: IMAGE 1 = reference (scene), IMAGE 2 = our product (dress). Copy scene from IMAGE 1; put dress from IMAGE 2 on the model; new face. */
const REFERENCE_INSTRUCTION_BASE = `You are given two images. The OUTPUT must combine them as described below.

IMAGE 1 (reference — the SCENE): A fashion photo (e.g. boutique, dressing room). The person in it is wearing some outfit (e.g. a pink or light-colored dress). You will NOT keep that outfit. Keep everything else from this image exactly:
- Exact composition, framing, and camera angle
- The full environment: the mirror (and its reflection), the clothing rack with all the dresses on hangers, the walls, the floor, the circular platform or pedestal the model stands on
- The model's pose, stance, and body position (e.g. arms raised to the mirror, weight on one leg)
- Her shoes and heels — identical to IMAGE 1
- Her hair — same style, length, and placement (only the face will change)
- Lighting, shadows, color temperature, and mood

IMAGE 2 (our product — the DRESS): A dress on a model. This is the ONLY garment the person in the output may wear.

WHAT TO DO:
1. Take the full scene from IMAGE 1 (same background, platform, mirror, rack, pose, heels, hair).
2. Remove the outfit the person is wearing in IMAGE 1. Do not draw any pink sequined corset, mini skirt, or the reference's dress. Replace it entirely with the dress from IMAGE 2. The person in the output must be wearing the dress from IMAGE 2 only — same color, fabric, design, and length (e.g. if it is a maxi dress, show it full length; if it has wide straps or is backless, show that).
3. Change the model's face to a different person — natural, confident. Keep the same hair style as IMAGE 1; new face.

Output: One image. Same photo as IMAGE 1 in every way (scene, platform, heels, hair, hangers, mirror, lighting) except: the model is wearing the dress from IMAGE 2 and has a new face. If there is a mirror reflection of the model in the scene, the reflection must also show her wearing the same dress (from IMAGE 2), not the outfit from IMAGE 1. Sharp, high-resolution, natural fashion photography. June & Ember aesthetic.`;

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
    "Refine this product image for Instagram. Keep the garment/dress exactly as is — do not change its color, pattern, or fabric. Output must be sharp, clear, and high-resolution; professional fashion-photography quality. The model (person) must look natural: relaxed natural pose, natural hair with soft movement or natural fall, natural expression and relaxed body language, like a real fashion photograph. Any look that fits an elegant occasion-wear brand (hair color, ethnicity open); focus is the dress and the mood. Improve only background and lighting: one clear directional light source (e.g. soft window or daylight from one side), soft shadows that match the scene, subtle warmth. Elegant interior or resort setting, well-lit. Product as hero, center frame. June & Ember aesthetic. Preserve original product colors 100%.",
};

/** Expert rule: hero = with face, detail = no face. See docs/SOCIAL_MEDIA_EXPERT.md */
const FRAME_HERO_SUFFIX =
  " Include model face with natural, confident expression; full or three-quarter frame so the outfit is shown in context.";
const FRAME_DETAIL_SUFFIX =
  " Crop at shoulders or show garment only; no face visible. Focus entirely on the outfit and fabric.";

/** When using a director's brief as customPrompt, append this so the image feels real, not AI-posed. */
const NATURAL_PHOTOGRAPHY_REINFORCEMENT =
  " Critical: this must look like real fashion photography — a candid moment, not a model posing for the camera. One clear directional light source; natural skin texture (no plastic or over-smooth); she is in the middle of the activity, not staring at the lens. Avoid flat lighting and perfect symmetry.";

function getPromptForStyle(style, customPrompt) {
  if (customPrompt) {
    const looksLikeDirectorBrief =
      customPrompt.includes("**Story**") || customPrompt.includes("**Moment**") || customPrompt.includes("Director's scene");
    return looksLikeDirectorBrief ? customPrompt + "\n\n" + NATURAL_PHOTOGRAPHY_REINFORCEMENT : customPrompt;
  }
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
 * Refine a single local image with a prompt (e.g. director's-scene). Use when you have an existing image to upgrade to the same quality bar.
 * @param {string} imagePath - Absolute or relative path to the image file
 * @param {string} productId - Shopify product ID (for slug and title in filename)
 * @param {object} options
 * @param {number} [options.postId] - Post number for filename and prompt lookup. Default 1
 * @param {string} [options.scene] - "directors" to load post-{id}-directors-scene-front.txt when prompt not provided
 * @param {string} [options.prompt] - Refinement prompt (if not set and scene=directors, loaded from prompts folder)
 * @param {string} [options.variant] - Variant label for filename. Default "directors-scene-refined"
 * @param {string} [options.contentType] - "post" | "story" | "reel". Default "post"
 * @param {string} [options.outputDir] - Base directory; images go to outputDir/{contentType}/. Default "./instagram-output"
 * @param {string} [options.aspectRatio] - "4:5" etc. Default "4:5"
 * @returns {Promise<{ productTitle, saved: string[], outputDir: string }>}
 */
export async function refineImageFromFile(imagePath, productId, options = {}) {
  ensureConfig();
  const {
    postId = 1,
    scene,
    prompt: customPrompt,
    variant = "directors-scene-refined",
    contentType = "post",
    outputDir: baseOutputDir = "./instagram-output",
    aspectRatio = "4:5",
  } = options;

  const type = CONTENT_TYPES.includes(String(contentType).toLowerCase()) ? String(contentType).toLowerCase() : "post";
  const outPath = path.resolve(baseOutputDir, type);
  fs.mkdirSync(outPath, { recursive: true });

  let prompt = customPrompt;
  if (!prompt && String(scene || "").trim().toLowerCase() === "directors") {
    const idStr = String(postId).padStart(2, "0");
    const promptPath = path.join(path.resolve(baseOutputDir), "prompts", `post-${idStr}-directors-scene-front.txt`);
    if (fs.existsSync(promptPath)) {
      prompt = fs.readFileSync(promptPath, "utf8");
    }
  }
  if (!prompt) {
    throw new Error("Refine-from-file requires a prompt. Use --prompt=... or --scene=directors with --post=N and a post-NN-directors-scene-front.txt file.");
  }

  const product = await getProduct(productId);
  const slug = product.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/gi, "").toLowerCase() || String(productId);
  const resolvedPath = path.resolve(imagePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Image file not found: ${resolvedPath}`);
  }
  const imageBytes = fs.readFileSync(resolvedPath);
  const mime = "image/png";
  const result = await refineImageWithNanoBanana(
    imageBytes,
    prompt,
    mime,
    { aspectRatio, responseModalities: ["TEXT", "IMAGE"] }
  );
  const imageParts = result.imageParts ?? [];
  if (imageParts.length === 0) {
    throw new Error("No image returned from refinement.");
  }
  const baseName = buildOutputFilename(type, postId, 0, slug, variant);
  const filePath = path.join(outPath, baseName);
  const data = imageParts[0].inlineData?.data;
  fs.writeFileSync(filePath, Buffer.from(data, "base64"));
  return {
    productTitle: product.title,
    saved: [filePath],
    outputDir: outPath,
  };
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
    const rawPath = referenceImagePath ? String(referenceImagePath).replace(/^=/, "").trim() : null;
    const refPath = rawPath ? path.resolve(rawPath) : null;
    if (refPath && fs.existsSync(refPath)) {
      referenceBytes = fs.readFileSync(refPath);
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
      const productHint = product.title
        ? ` Our product in IMAGE 2 is: ${product.title}. The model in the output must wear this exact garment (from IMAGE 2), not the outfit from IMAGE 1.`
        : "";
      const refInstruction =
        getPromptWithFrameStrategy(REFERENCE_INSTRUCTION_BASE + productHint, style, i);
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

/** Pose-change prompt: same scene, same garment, same position (e.g. still seated). Only camera/view changes so we see back or side of outfit. Story must flow. */
function getPoseChangeInstruction(pose, productTitle) {
  const garment = productTitle || "the garment";
  if (pose === "back") {
    return `This image is one shot from a fashion shoot — same model, same outfit (${garment}), in a lobby/lounge with couch, furniture, window.

Generate a SECOND shot from the SAME shoot. Critical: the room must look IDENTICAL — same couch, same furniture, same walls, same lighting, same window. It must feel like the photographer moved to the other side of the room, not a different place.

In this second shot: the camera is behind her. She is still SEATED on the same couch, but she has turned to look out the window. We see her back and the back of the jumpsuit. Same moment, same room; we are just seeing her from behind. Her feet/shoes natural and coherent. Do not change or invent new furniture or walls — match the room from the image exactly. June & Ember aesthetic. Output one image.`;
  }
  if (pose === "side") {
    return `This image shows a model in a full environment — she is SEATED on a couch, chair, or similar (lobby/lounge). Keep EVERYTHING the same: same environment, same furniture, same lighting, same room, same garment (${garment}). She must STAY in the same position — still seated on the same couch/chair. Do not make her stand up.

ONLY change the viewpoint so we see the SIDE of the outfit: camera from the side, or she turns slightly while still seated so we see the side of the jumpsuit. She remains seated; same moment, same seat. The story must flow. Natural, coherent. June & Ember aesthetic. Output one image.`;
  }
  throw new Error("pose must be 'back' or 'side'");
}

/**
 * Pose-change for DETAIL shots (no face): same room, same dress; show back or side of garment.
 * Reasoning (Post 3 — keep in prompt): (1) Dress consistency: identical garment across slides — same color, pattern, cut, length, straps; only angle changes. (2) Back: model looks over shoulder toward camera so she's still posing for camera while showing back of dress. (3) Side: same scale as other slides — model not oversized, environment has presence. (4) Same room in every slide. See docs/DIRECTOR_BRIEF_AND_VISION.md "Detail-shot carousel".
 */
function getPoseChangeInstructionDetail(pose, productTitle) {
  const garment = productTitle || "the garment";
  if (pose === "back") {
    return `This image is a detail shot (no face) from a fashion shoot — same room, same outfit (${garment}), same lighting, same floor and walls.

CRITICAL — DRESS CONSISTENCY: The dress in the output must be IDENTICAL to the dress in this image. Same color, same pattern, same fabric, same cut, same length, same straps, same neckline. Do not change, simplify, or reinterpret the garment. Only the camera angle and pose change; the dress does not.

CRITICAL — BACK DESIGN: Look at the input image. The output back must be a direct copy of the dress back from the input — same number of elements (e.g. same number of criss-cross or lace details), same positions, same spacing, same style (appliqué vs lacing vs cutout). Do not add, remove, or alter any decorative detail. Do not reinterpret or redesign. Fabric drape and strap placement must match the input. If the input shows a plain back, output a plain back; if it shows X's or lacing, output the same in the same layout.

Generate a SECOND shot from the SAME shoot. The room must look IDENTICAL — same walls, same floor, same materials, same light.

In this second shot: we see the BACK of the dress. The model can look over her shoulder toward the camera — so we see the back of the garment but she is still posing for the camera. Same dress, same environment, same scale. June & Ember aesthetic. Preserve original product colors and design 100%. Output one image.`;
  }
  if (pose === "side") {
    return `This image is a detail shot (no face) from a fashion shoot — same room, same outfit (${garment}), same lighting, same floor and walls.

CRITICAL — DRESS CONSISTENCY: The dress in the output must be IDENTICAL to the dress in this image. Same color, same pattern, same fabric, same cut, same length, same straps, same neckline. Do not change, simplify, or reinterpret the garment. Only the camera angle and pose change; the dress does not.

Generate a SECOND shot from the SAME shoot. The room must look IDENTICAL — same walls, same floor, same materials, same light.

In this second shot: we see the SIDE of the dress. Same scale as the first image — model not oversized; environment has presence. Same dress. June & Ember aesthetic. Preserve original product colors and design 100%. Output one image.`;
  }
  throw new Error("pose must be 'back' or 'side'");
}

/**
 * Generate a new pose (back or side) from an approved image. Same scene, same garment; only the model's pose changes. For carousel slide 2/3.
 * Fallback (Post 2): Not every scene supports back/side — e.g. seated on couch facing camera is great as single image but hard for same-room back. If the scene doesn't naturally support a second angle (story reason + same room), use single image; see docs/DIRECTOR_BRIEF_AND_VISION.md "Single image vs carousel".
 * @param {string} approvedImagePath - Path to the approved front image (e.g. post_02_..._vdirectors-scene-front.png)
 * @param {string} productId - Shopify product ID (used to get slug and title for filename and prompt)
 * @param {object} options - { postId, pose: 'back'|'side', contentType, outputDir, aspectRatio }
 * @returns {Promise<{ productId, productTitle, saved: string[], outputDir: string }>}
 */
export async function refinePoseFromImage(approvedImagePath, productId, options = {}) {
  ensureConfig();
  const {
    postId = 1,
    pose,
    variant: variantSuffix,
    detailShot = false,
    productBackImageIndex,
    contentType = "post",
    outputDir: baseOutputDir = "./instagram-output",
    aspectRatio = "4:5",
  } = options;
  if (!pose || !["back", "side"].includes(pose)) {
    throw new Error("refinePoseFromImage requires pose: 'back' or 'side'");
  }
  const product = await getProduct(productId);
  const slug = product.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/gi, "").toLowerCase() || String(productId);
  const rawPath = path.resolve(String(approvedImagePath).replace(/^=/, "").trim());
  if (!fs.existsSync(rawPath)) {
    throw new Error(`Approved image not found: ${rawPath}`);
  }
  const approvedBytes = fs.readFileSync(rawPath);
  const mime = rawPath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";

  let result;
  if (pose === "back" && productBackImageIndex != null) {
    const indices = typeof productBackImageIndex === "string"
      ? productBackImageIndex.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n))
      : [Number(productBackImageIndex)];
    if (indices.length === 0) throw new Error("productBackImageIndex must be a number or comma-separated numbers (e.g. 2,4)");
    const productBackBuffers = await Promise.all(
      indices.map(async (idx) => {
        const url = getProductImageUrl(product, idx);
        if (!url) throw new Error(`Product has no image at index ${idx}`);
        return fetchImageBytes(url);
      })
    );
    const instruction = getBackWithProductBackReferenceInstruction(indices.length);
    if (indices.length === 1) {
      result = await refineWithReferenceImage(
        productBackBuffers[0],
        approvedBytes,
        instruction,
        "image/jpeg",
        mime,
        { aspectRatio, responseModalities: ["TEXT", "IMAGE"], referenceFirst: true }
      );
    } else {
      const imageParts = [
        { data: approvedBytes, mime },
        ...productBackBuffers.map((buf) => ({ data: buf, mime: "image/jpeg" })),
      ];
      result = await refineWithMultipleImages(instruction, imageParts, {
        aspectRatio,
        responseModalities: ["TEXT", "IMAGE"],
      });
    }
  } else {
    const instruction = detailShot
      ? getPoseChangeInstructionDetail(pose, product.title)
      : getPoseChangeInstruction(pose, product.title);
    result = await refineImageWithNanoBanana(
      approvedBytes,
      instruction,
      mime,
      { aspectRatio, responseModalities: ["TEXT", "IMAGE"] }
    );
  }
  const imageParts = result.imageParts ?? [];
  if (imageParts.length === 0) {
    throw new Error("No image returned from pose change.");
  }
  const slideIndex = pose === "back" ? 1 : 2; // back = slide-02, side = slide-03
  const variant = variantSuffix
    ? `directors-scene-${pose}-${variantSuffix}`
    : detailShot
      ? `directors-scene-detail-${pose}`
      : `directors-scene-${pose}`;
  const outPath = path.resolve(baseOutputDir, contentType);
  fs.mkdirSync(outPath, { recursive: true });
  const baseName = buildOutputFilename(contentType, postId, slideIndex, slug, variant);
  const filePath = path.join(outPath, baseName);
  const data = imageParts[0].inlineData?.data;
  fs.writeFileSync(filePath, Buffer.from(data, "base64"));
  return {
    productId,
    productTitle: product.title,
    saved: [filePath],
    outputDir: outPath,
  };
}
