#!/usr/bin/env node
import { ensureConfig } from "./config.js";
import { refineProductAltText } from "./refine.js";
import { refineProductForInstagram } from "./instagram.js";
import { listProducts } from "./shopify.js";

const args = process.argv.slice(2);
const command = args[0];

function parseArgs(flags) {
  const out = {};
  for (const f of flags) {
    if (f === "--apply") out.apply = true;
    if (f === "--all") out.allImages = true;
    if (f.startsWith("--aspect=")) out.aspectRatio = f.slice(9);
    if (f.startsWith("--output=")) out.outputDir = f.slice(9);
    if (f.startsWith("--max=")) out.maxImages = parseInt(f.slice(6), 10);
    if (f.startsWith("--style=")) out.style = f.slice(8);
    if (f.startsWith("--type=")) out.contentType = f.slice(7);
    if (f.startsWith("--post=")) out.postId = parseInt(f.slice(7), 10);
    if (f.startsWith("--prompt=")) {
      let v = f.slice(9);
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      out.prompt = v;
    }
    if (f.startsWith("--variant=")) out.variant = f.slice(10);
    if (f.startsWith("--reference-url=")) out.referenceImageUrl = f.slice(16);
    if (f.startsWith("--reference-path=")) out.referenceImagePath = f.slice(16);
  }
  return out;
}

async function main() {
  if (!command || command === "help" || command === "-h" || command === "--help") {
    console.log(`
Image Refinement Tool for Shopify (Google AI Studio)

Usage:
  node src/cli.js help                    Show this help
  node src/cli.js list                     List first 10 products
  node src/cli.js alt <productId>          Suggest alt text for product's first image
  node src/cli.js alt <productId> --apply   Suggest and update alt text in Shopify

  Instagram: edit product images (saved by type: post/, story/, reel/)
  node src/cli.js instagram <productId>                    Post 1, single image → post/post_01_slide-01_*.png
  node src/cli.js instagram <productId> --post=2           Post 2, single image → post/post_02_slide-01_*.png
  node src/cli.js instagram <productId> --all --post=5      Post 5, carousel → post/post_05_slide-01_*.png, slide-02, ...
  node src/cli.js instagram <productId> --type=story --post=1   Story 1 → story/story_01_slide-01_*.png
  node src/cli.js instagram <productId> --style=juneember --type=post --post=3
  node src/cli.js instagram <productId> --post=1 --type=post --style=juneember --prompt="..."   Custom prompt (overrides style text; hero face still added if style=juneember)
  node src/cli.js instagram <productId> --post=1 --variant=02   Save as ..._v02.png (keeps all variants).
  node src/cli.js instagram <productId> --post=1 --reference-url=URL   Use reference image: same pose/lighting, our dress, new face. Or --reference-path=./ref.png
  Naming: {type}_{id}_slide-{nn}_{slug}.png or ..._v{variant}.png. Director's view: docs/DIRECTORS_VIEW.md

Setup:
  Copy .env.example to .env and set:
  - GOOGLE_AI_STUDIO_API_KEY (from https://aistudio.google.com/apikey)
  - SHOPIFY_STORE (e.g. mystore.myshopify.com)
  - SHOPIFY_ACCESS_TOKEN (Admin API access token)
`);
    return;
  }

  ensureConfig();

  if (command === "list") {
    const products = await listProducts(10);
    console.log("Products (first 10):\n");
    for (const p of products) {
      console.log(`  ${p.id}  ${p.title}`);
    }
    return;
  }

  if (command === "alt") {
    const productId = args[1];
    const apply = args.includes("--apply");
    if (!productId) {
      console.error("Usage: node src/cli.js alt <productId> [--apply]");
      process.exit(1);
    }
    const result = await refineProductAltText(productId, { apply });
    console.log("Product:", result.productTitle);
    console.log("Suggested alt text:", result.suggestedAltText);
    if (apply && result.applied) {
      console.log("(Updated in Shopify)");
    }
    return;
  }

  if (command === "instagram") {
    const productId = args[1];
    if (!productId) {
      console.error("Usage: node src/cli.js instagram <productId> [--all] [--aspect=4:5] [--output=dir]");
      process.exit(1);
    }
    const opts = parseArgs(args.slice(2));
    console.log("Fetching product and refining images for Instagram...");
    const result = await refineProductForInstagram(productId, opts);
    console.log("Product:", result.productTitle);
    console.log("Saved", result.saved.length, "image(s) to", result.outputDir);
    result.saved.forEach((p) => console.log("  ", p));
    return;
  }

  console.error("Unknown command:", command);
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
