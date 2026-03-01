import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./config.js";

/** Nano Banana = Gemini 2.5 Flash Image (text-to-image & image editing) */
export const NANO_BANANA_MODEL = "gemini-2.5-flash-image";

let genAI = null;

function getClient() {
  if (!config.google.apiKey) {
    throw new Error(
      "GOOGLE_AI_STUDIO_API_KEY is not set. Add it to your .env file."
    );
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.google.apiKey);
  }
  return genAI;
}

/**
 * Build an image part for Gemini from a buffer or base64 string.
 * @param {Buffer|string} imageData - Raw buffer or base64 string
 * @param {string} mimeType - e.g. "image/png", "image/jpeg"
 */
export function imagePart(imageData, mimeType = "image/png") {
  const base64 =
    typeof imageData === "string"
      ? imageData.replace(/^data:image\/\w+;base64,/, "")
      : Buffer.from(imageData).toString("base64");
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
}

/**
 * Refine an image using Gemini with a text prompt (e.g. improve lighting, clean background).
 * Uses gemini-1.5-flash for text/analysis; for image OUTPUT use generateImage or refineImageWithNanoBanana.
 * @param {Buffer|string} imageData - Image buffer or base64
 * @param {string} prompt - Refinement instructions
 * @param {string} mimeType - Image mime type
 * @returns {Promise<{ text?: string, imageParts?: Array }>}
 */
export async function refineImageWithPrompt(imageData, prompt, mimeType = "image/jpeg") {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  const part = imagePart(imageData, mimeType);
  const result = await model.generateContent([prompt, part]);
  const response = result.response;
  const text = response.text?.() ?? "";
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imageParts = parts.filter((p) => p.inlineData);
  return { text, imageParts, raw: response };
}

/**
 * Generate an image with Nano Banana (gemini-2.5-flash-image). Same API key as Google AI Studio.
 * @param {string} prompt - Text description of the image to generate
 * @param {object} options - { aspectRatio: "1:1" | "16:9" | "4:5" etc., responseModalities: ["Image"] }
 * @returns {Promise<{ text?: string, imageParts: Array }>} - imageParts have inlineData.data (base64)
 */
export async function generateImageWithNanoBanana(prompt, options = {}) {
  const { aspectRatio = "1:1", responseModalities = ["TEXT", "IMAGE"] } = options;
  const client = getClient();
  const generationConfig = {
    responseModalities: Array.isArray(responseModalities) ? responseModalities : ["TEXT", "IMAGE"],
    ...(aspectRatio && { imageConfig: { aspectRatio } }),
  };
  const model = client.getGenerativeModel({
    model: NANO_BANANA_MODEL,
    generationConfig,
  });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text?.() ?? "";
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imageParts = parts.filter((p) => p.inlineData);
  return { text, imageParts, raw: response };
}

/**
 * Edit/refine an image with Nano Banana: send image + instruction, get back (optionally) a new image.
 * @param {Buffer|string} imageData - Current image
 * @param {string} instruction - e.g. "Replace the background with a clean white studio background"
 * @param {string} mimeType - Image mime type
 * @param {object} options - { aspectRatio, responseModalities }
 * @returns {Promise<{ text?: string, imageParts: Array }>}
 */
export async function refineImageWithNanoBanana(imageData, instruction, mimeType = "image/jpeg", options = {}) {
  const { aspectRatio, responseModalities = ["TEXT", "IMAGE"] } = options;
  const client = getClient();
  const generationConfig = {
    responseModalities: Array.isArray(responseModalities) ? responseModalities : ["TEXT", "IMAGE"],
    ...(aspectRatio && { imageConfig: { aspectRatio } }),
  };
  const model = client.getGenerativeModel({
    model: NANO_BANANA_MODEL,
    generationConfig,
  });
  const part = imagePart(imageData, mimeType);
  const result = await model.generateContent([instruction, part]);
  const response = result.response;
  const text = response.text?.() ?? "";
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imageParts = parts.filter((p) => p.inlineData);
  return { text, imageParts, raw: response };
}

/**
 * Refine with a reference image: combine reference scene with our product (dress on model).
 * Use reference for composition, pose, lighting, setting; put our dress on the model; different natural face.
 * @param {Buffer|string} productImageData - Our product (dress) image
 * @param {Buffer|string} referenceImageData - Reference photo (scene to keep)
 * @param {string} instruction - What to do (or use default)
 * @param {string} productMime - Mime for product image
 * @param {string} referenceMime - Mime for reference image
 * @param {object} options - { aspectRatio, responseModalities, referenceFirst }
 * @param {boolean} [options.referenceFirst] - If true, send reference then product (scene first, dress second) so model composites "put dress from IMAGE 2 on person in IMAGE 1"
 */
export async function refineWithReferenceImage(
  productImageData,
  referenceImageData,
  instruction,
  productMime = "image/jpeg",
  referenceMime = "image/jpeg",
  options = {}
) {
  const { aspectRatio, responseModalities = ["TEXT", "IMAGE"], referenceFirst = true } = options;
  const client = getClient();
  const generationConfig = {
    responseModalities: Array.isArray(responseModalities) ? responseModalities : ["TEXT", "IMAGE"],
    ...(aspectRatio && { imageConfig: { aspectRatio } }),
  };
  const model = client.getGenerativeModel({
    model: NANO_BANANA_MODEL,
    generationConfig,
  });
  const productPart = imagePart(productImageData, productMime);
  const referencePart = imagePart(referenceImageData, referenceMime);
  const parts = referenceFirst
    ? [instruction, referencePart, productPart]
    : [instruction, productPart, referencePart];
  const result = await model.generateContent(parts);
  const response = result.response;
  const text = response.text?.() ?? "";
  const imageParts = (response.candidates?.[0]?.content?.parts ?? []).filter((p) => p.inlineData);
  return { text, imageParts, raw: response };
}

/**
 * Generate with one instruction and multiple images (e.g. scene + two product back references).
 * @param {string} instruction - Full prompt
 * @param {Array<{ data: Buffer|string, mime: string }>} imageParts - In order: [scene, ref1, ref2, ...]
 * @param {object} options - { aspectRatio, responseModalities }
 */
export async function refineWithMultipleImages(instruction, imageParts, options = {}) {
  const { aspectRatio, responseModalities = ["TEXT", "IMAGE"] } = options;
  const client = getClient();
  const generationConfig = {
    responseModalities: Array.isArray(responseModalities) ? responseModalities : ["TEXT", "IMAGE"],
    ...(aspectRatio && { imageConfig: { aspectRatio } }),
  };
  const model = client.getGenerativeModel({
    model: NANO_BANANA_MODEL,
    generationConfig,
  });
  const parts = [
    instruction,
    ...imageParts.map((p) => imagePart(p.data, p.mime)),
  ];
  const result = await model.generateContent(parts);
  const response = result.response;
  const text = response.text?.() ?? "";
  const outParts = (response.candidates?.[0]?.content?.parts ?? []).filter((p) => p.inlineData);
  return { text, imageParts: outParts, raw: response };
}

/**
 * Get alt text or product description suggestions for a product image (useful for Shopify SEO).
 * @param {Buffer|string} imageData
 * @param {string} productTitle - Optional product title for context
 */
export async function suggestAltText(imageData, productTitle = "") {
  const prompt = productTitle
    ? `Describe this product image in 1–2 short sentences for use as alt text (SEO). Product: ${productTitle}. Be concise and descriptive.`
    : "Write a short, SEO-friendly alt text (1–2 sentences) for this product image.";
  const { text } = await refineImageWithPrompt(imageData, prompt);
  return text?.trim() ?? "";
}
