#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { ensureConfig } from "./config.js";
import { refineProductAltText } from "./refine.js";
import { refineProductForInstagram, refinePoseFromImage, refineImageFromFile } from "./instagram.js";
import { generateAndSaveDirectorBrief } from "./director-brief.js";
import { listProducts } from "./shopify.js";

const args = process.argv.slice(2);
const command = args[0];

function parseArgs(flags) {
  const out = {};
  for (let i = 0; i < flags.length; i++) {
    const f = flags[i];
    if (f === "--apply") out.apply = true;
    if (f === "--all") out.allImages = true;
    if (f.startsWith("--angles=")) out.angles = f.slice(9);
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
    if (f.startsWith("--scene=")) out.scene = f.slice(8).replace(/^=/, "");
    if (f.startsWith("--reference-url=")) out.referenceImageUrl = f.slice(16);
    if (f === "--reference-path" && flags[i + 1] != null) {
      out.referenceImagePath = flags[i + 1];
      i++;
    } else if (f.startsWith("--reference-path=")) {
      out.referenceImagePath = f.slice(16);
    }
    if (f.startsWith("--from-image=")) out.fromImage = f.slice(13).replace(/^=/, "");
    if (f.startsWith("--pose=")) out.pose = f.slice(7).replace(/^=/, "").toLowerCase();
    if (f === "--detail") out.detailShot = true;
    if (f.startsWith("--product-back-image=")) out.productBackImageIndex = f.slice(21).trim() || undefined;
    if (f.startsWith("--caption=")) out.captionAngle = f.slice(10).trim() || undefined;
    if (f.startsWith("--format=")) out.format = f.slice(9).trim().toLowerCase() || undefined;
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
  node src/cli.js brief <productId> --post=N   Generate director's brief (Gemini 1.5 Flash) → prompts/post-NN-directors-scene-brief.txt
  node src/cli.js brief <productId> --post=N --caption="..." [--format=single|carousel] [--output=path]

  Instagram: edit product images (saved by type: post/, story/, reel/)
  node src/cli.js instagram <productId>                    Post 1, single image → post/post_01_slide-01_*.png
  node src/cli.js instagram <productId> --post=2           Post 2, single image → post/post_02_slide-01_*.png
  node src/cli.js instagram <productId> --all --post=5      Post 5, carousel → post/post_05_slide-01_*.png, slide-02, ...
  node src/cli.js instagram <productId> --type=story --post=1   Story 1 → story/story_01_slide-01_*.png
  node src/cli.js instagram <productId> --style=juneember --type=post --post=3
  node src/cli.js instagram <productId> --post=1 --type=post --style=juneember --prompt="..."   Custom prompt (overrides style text; hero face still added if style=juneember)
  node src/cli.js instagram <productId> --post=1 --variant=02   Save as ..._v02.png (keeps all variants).
  node src/cli.js instagram <productId> --post=1 --angles=front,back,side   Director's shoot: 3 poses (prompts post-01-pro-grade-{angle}.txt). Social manager selects which to post.
  node src/cli.js instagram <productId> --post=1 --angles=front,back,side --scene=directors   Same but director's-scene detail (mirror, platform, hangers, curtains). Prompts: post-01-directors-scene-{angle}.txt. Output: _vdirectors-scene-front.png etc.
  node src/cli.js instagram <productId> --post=1 --reference-url=URL   Use reference image: same pose/lighting, our dress, new face. Or --reference-path=./ref.png
  node src/cli.js instagram <productId> --post=2 --from-image=path/to/front.png --pose=back   Same scene, same garment; only change pose to back (carousel slide 2). Use --pose=side for slide 3.
  node src/cli.js instagram <productId> --post=3 --from-image=path/to/detail.png --pose=back --detail   Detail shot: same room, show back of dress (no face). Use --pose=side for side detail.
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

  if (command === "brief") {
    const productId = args[1];
    if (!productId) {
      console.error("Usage: node src/cli.js brief <productId> --post=N [--caption=\"...\"] [--format=single|carousel] [--output=dir]");
      process.exit(1);
    }
    const opts = parseArgs(args.slice(2));
    const result = await generateAndSaveDirectorBrief(productId, {
      postId: opts.postId || 1,
      captionAngle: opts.captionAngle,
      format: opts.format,
      outputDir: opts.outputDir || "./instagram-output",
    });
    console.log("Director's brief (Gemini 1.5 Flash)");
    console.log("Product:", result.productTitle);
    console.log("Saved:", result.savedPath);
    return;
  }

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
      console.error("Usage: node src/cli.js instagram <productId> [--all] [--aspect=4:5] [--output=dir] [--angles=front,back,side]");
      process.exit(1);
    }
    const opts = parseArgs(args.slice(2));

    // Pose from approved image: same scene, same garment, only change pose (back or side) for carousel.
    if (opts.fromImage && opts.pose) {
      const result = await refinePoseFromImage(opts.fromImage, productId, {
        postId: opts.postId || 1,
        pose: opts.pose,
        variant: opts.variant,
        detailShot: opts.detailShot,
        productBackImageIndex: opts.productBackImageIndex,
        contentType: opts.contentType || "post",
        outputDir: opts.outputDir,
        aspectRatio: opts.aspectRatio,
      });
      console.log("Pose from approved image:", opts.pose);
      console.log("Product:", result.productTitle);
      console.log("Saved", result.saved.length, "image(s) to", result.outputDir);
      result.saved.forEach((p) => console.log("  ", p));
      return;
    }

    // Refine a local image with a prompt (e.g. director's-scene). Same product/post for filename and optional prompt file.
    if (opts.fromImage && !opts.pose) {
      const result = await refineImageFromFile(opts.fromImage, productId, {
        postId: opts.postId || 1,
        scene: opts.scene,
        prompt: opts.prompt,
        variant: opts.variant || "directors-scene-refined",
        contentType: opts.contentType || "post",
        outputDir: opts.outputDir,
        aspectRatio: opts.aspectRatio,
      });
      console.log("Refined image with director's-scene prompt");
      console.log("Product:", result.productTitle);
      console.log("Saved", result.saved.length, "image(s) to", result.outputDir);
      result.saved.forEach((p) => console.log("  ", p));
      return;
    }

    const angleList = opts.angles ? opts.angles.split(",").map((a) => a.trim().toLowerCase()) : [];

    if (angleList.length > 0) {
      // Director's shoot: generate one image per angle (front, back, side) so social manager can select.
      const outputDir = opts.outputDir || "./instagram-output";
      const postId = opts.postId || 1;
      const idStr = String(postId).padStart(2, "0");
      const useDirectorsScene = String(opts.scene || "").trim().toLowerCase() === "directors";
      const promptPrefix = useDirectorsScene ? "directors-scene" : "pro-grade";
      const variantPrefix = useDirectorsScene ? "directors-scene" : "pro-grade";
      const allSaved = [];
      console.log(
        "Director's shoot: generating",
        angleList.length,
        "angle(s) for post",
        postId,
        useDirectorsScene ? "(director's-scene detail)" : "",
        "..."
      );
      for (const angle of angleList) {
        const promptPath = path.join(outputDir, "prompts", `post-${idStr}-${promptPrefix}-${angle}.txt`);
        if (!fs.existsSync(promptPath)) {
          console.warn("Prompt file not found:", promptPath, "- skipping angle", angle);
          continue;
        }
        const prompt = fs.readFileSync(promptPath, "utf8");
        const result = await refineProductForInstagram(productId, {
          ...opts,
          prompt,
          variant: `${variantPrefix}-${angle}`,
        });
        allSaved.push(...result.saved);
        console.log("  ", angle + ":", result.saved[0] || "(no image)");
      }
      console.log("Product: (see above)");
      console.log("Saved", allSaved.length, "image(s) to", path.join(outputDir, opts.contentType || "post"));
      allSaved.forEach((p) => console.log("  ", p));
      return;
    }

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
