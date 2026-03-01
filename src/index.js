import { ensureConfig } from "./config.js";
import { refineProductImage, refineProductAltText } from "./refine.js";
import { refineProductForInstagram, INSTAGRAM_STYLE_PRESETS } from "./instagram.js";
import { getProduct, listProducts } from "./shopify.js";
import {
  refineImageWithPrompt,
  suggestAltText,
  generateImageWithNanoBanana,
  refineImageWithNanoBanana,
  NANO_BANANA_MODEL,
} from "./google-ai.js";

export {
  ensureConfig,
  refineProductImage,
  refineProductAltText,
  refineProductForInstagram,
  INSTAGRAM_STYLE_PRESETS,
  getProduct,
  listProducts,
  refineImageWithPrompt,
  suggestAltText,
  generateImageWithNanoBanana,
  refineImageWithNanoBanana,
  NANO_BANANA_MODEL,
};
