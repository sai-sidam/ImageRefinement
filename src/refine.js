import { refineImageWithPrompt, suggestAltText } from "./google-ai.js";
import {
  getProduct,
  getProductImageUrl,
  fetchImageBytes,
  updateProductImageAlt,
} from "./shopify.js";
import { ensureConfig } from "./config.js";

/**
 * Refine a product image with Gemini and optionally update Shopify (e.g. alt text).
 * @param {string} productId - Shopify product ID
 * @param {string} refinementPrompt - e.g. "Clean white background, professional lighting"
 * @param {object} options - { imageIndex: 0, updateAltText: false }
 * @returns {Promise<{ product, suggestion?: string, refined?: object }>}
 */
export async function refineProductImage(productId, refinementPrompt, options = {}) {
  ensureConfig();
  const { imageIndex = 0, updateAltText = false } = options;

  const product = await getProduct(productId);
  const imageUrl = getProductImageUrl(product, imageIndex);
  if (!imageUrl) {
    throw new Error(`Product ${productId} has no image at index ${imageIndex}`);
  }

  const imageBytes = await fetchImageBytes(imageUrl);
  const result = await refineImageWithPrompt(
    imageBytes,
    refinementPrompt,
    "image/jpeg"
  );

  const out = { product: { id: product.id, title: product.title }, refined: result };

  if (updateAltText && result.text) {
    const image = product.images?.[imageIndex];
    if (image?.id) {
      const updated = await updateProductImageAlt(productId, image.id, result.text);
      out.updatedAlt = updated?.altText;
    }
  }

  return out;
}

/**
 * Generate and optionally apply SEO alt text for a product image.
 * @param {string} productId - Shopify product ID
 * @param {object} options - { imageIndex: 0, apply: false }
 */
export async function refineProductAltText(productId, options = {}) {
  ensureConfig();
  const { imageIndex = 0, apply = false } = options;

  const product = await getProduct(productId);
  const imageUrl = getProductImageUrl(product, imageIndex);
  if (!imageUrl) {
    throw new Error(`Product ${productId} has no image at index ${imageIndex}`);
  }

  const imageBytes = await fetchImageBytes(imageUrl);
  const suggestion = await suggestAltText(imageBytes, product.title);

  const out = { productId, productTitle: product.title, suggestedAltText: suggestion };

  if (apply && suggestion) {
    const image = product.images?.[imageIndex];
    if (image?.id) {
      await updateProductImageAlt(productId, image.id, suggestion);
      out.applied = true;
    }
  }

  return out;
}
