#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { ensureConfig } from "./config.js";
import { refineProductAltText } from "./refine.js";
import { refineProductForInstagram, refinePoseFromImage, refineImageFromFile } from "./instagram.js";
import { generateAndSaveDirectorBrief } from "./director-brief.js";
import { listProducts } from "./shopify.js";
import { runRagIndex, runRagQuery } from "./rag/index.js";
import {
  askGeminiForGuidelineAdvice,
  askGeminiToReviewGuidelines,
  loadGuidelineDocsForReview,
} from "./expert-draft.js";

const args = process.argv.slice(2);
const command = args[0];

function parseArgs(flags) {
  const out = {};
  for (let i = 0; i < flags.length; i++) {
    const f = flags[i];
    if (f === "--apply") out.apply = true;
    if (f === "--all") out.allImages = true;
    if (f === "--rag") out.rag = true;
    if (f.startsWith("--angles=")) out.angles = f.slice(9);
    if (f.startsWith("--aspect=")) out.aspectRatio = f.slice(9);
    if (f.startsWith("--output=")) out.outputDir = f.slice(9);
    if (f.startsWith("--max=")) out.maxImages = parseInt(f.slice(6), 10);
    if (f.startsWith("--style=")) out.style = f.slice(8);
    if (f.startsWith("--type=")) out.contentType = f.slice(7);
    if (f.startsWith("--post=")) out.postId = parseInt(f.slice(7), 10);
    if (f.startsWith("--paths=")) out.paths = f.slice(8);
    if (f.startsWith("--index=")) out.indexPath = f.slice(8);
    if (f.startsWith("--k=")) out.k = parseInt(f.slice(4), 10);
    if (f.startsWith("--model=")) out.model = f.slice(8);
    if (f.startsWith("--max-chars=")) out.maxChars = parseInt(f.slice(12), 10);
    if (f.startsWith("--overlap-lines=")) out.overlapLines = parseInt(f.slice(16), 10);
    if (f.startsWith("--rag-index=")) out.ragIndexPath = f.slice(12);
    if (f.startsWith("--rag-k=")) out.ragK = parseInt(f.slice(8), 10);
    if (f.startsWith("--agent=")) out.agent = f.slice(8).trim().toLowerCase();
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
  node src/cli.js brief <productId> --post=N --rag [--rag-index=.rag/index.json] [--rag-k=6]  (optional) retrieve context into brief

  Expert-draft (Gemini = brain for guidelines; answer shown in chat for you to react, then implement)
  node src/cli.js expert "<your message or question>"   Ask Gemini for creative/strategic advice (Director, SMM, process).
  node src/cli.js expert "<message>" --rag [--agent=director|smm]   Include current guidelines from RAG in the prompt.
  node src/cli.js review   Have Gemini review all guideline docs (consistency, improvements, other cases). Output in chat; you react, then implement.

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
  Naming: {type}_{id}_slide-{nn}_{slug}.png or ..._v{variant}.png. Director's view: docs/DIRECTOR_BRIEF_AND_VISION.md

RAG (retrieval-augmented generation): index docs/prompts and query relevant context
  node src/cli.js rag index [--paths=docs,instagram-output/prompts,instagram-output] [--index=.rag/index.json] [--model=gemini-embedding-001]
  node src/cli.js rag query "<question>" [--index=.rag/index.json] [--k=6] [--agent=smm|director]

Setup:
  Copy .env.example to .env and set:
  - GOOGLE_AI_STUDIO_API_KEY (from https://aistudio.google.com/apikey)
  - SHOPIFY_STORE (e.g. mystore.myshopify.com)
  - SHOPIFY_ACCESS_TOKEN (Admin API access token)
`);
    return;
  }

  if (command === "review") {
    ensureConfig();
    const projectRoot = process.cwd();
    const docsContext = loadGuidelineDocsForReview(projectRoot);
    const result = await askGeminiToReviewGuidelines(docsContext);
    console.log(result.text);
    return;
  }

  if (command === "expert") {
    ensureConfig();
    const message = args[1];
    if (!message) {
      console.error('Usage: node src/cli.js expert "<your message or question>" [--rag] [--agent=director|smm]');
      process.exit(1);
    }
    const opts = parseArgs(args.slice(2));
    let retrievedContext;
    if (opts.rag) {
      const ragRes = await runRagQuery({
        indexPath: opts.ragIndexPath,
        query: opts.agent === "smm"
          ? "SMM content mix, format rules, post types, captions, hashtags."
          : "Director brief, story, set, moment, concept, lighting, pose, quality bar.",
        k: opts.ragK || 6,
        agentId: opts.agent || "director",
      });
      retrievedContext = ragRes.context;
    }
    const result = await askGeminiForGuidelineAdvice(message, {
      retrievedContext,
    });
    console.log(result.text);
    return;
  }

  if (command === "rag") {
    const sub = args[1];
    const opts = parseArgs(args.slice(2));

    if (!sub || sub === "help" || sub === "-h" || sub === "--help") {
      console.log(`RAG commands:
  node src/cli.js rag index [--paths=docs,instagram-output/prompts,instagram-output] [--index=.rag/index.json] [--model=gemini-embedding-001] [--max-chars=1800] [--overlap-lines=8]
  node src/cli.js rag query "<question>" [--index=.rag/index.json] [--k=6]`);
      return;
    }

    if (sub === "index") {
      const roots = opts.paths ? opts.paths.split(",").map((p) => p.trim()).filter(Boolean) : undefined;
      const { indexPath, indexData } = await runRagIndex({
        sourceRoots: roots,
        indexPath: opts.indexPath,
        model: opts.model,
        maxChars: Number.isFinite(opts.maxChars) ? opts.maxChars : undefined,
        overlapLines: Number.isFinite(opts.overlapLines) ? opts.overlapLines : undefined,
        log: (m) => console.log(m),
      });
      console.log("\nRAG index saved:", indexPath);
      console.log("Files:", indexData.stats.files);
      console.log("Chunks:", indexData.stats.chunks);
      console.log("Reused chunks:", indexData.stats.reusedChunks);
      console.log("Embedded chunks:", indexData.stats.embeddedChunks);
      return;
    }

    if (sub === "query") {
      const q = args[2];
      if (!q) {
        console.error('Usage: node src/cli.js rag query "<question>" [--index=.rag/index.json] [--k=6] [--agent=smm|director]');
        process.exit(1);
      }
      const { hits, context } = await runRagQuery({
        indexPath: opts.indexPath,
        query: q,
        k: opts.k,
        model: opts.model,
        agentId: opts.agent,
      });
      if (opts.agent) console.log("\nPolicy:", opts.agent);
      console.log("\nTop hits:");
      for (const h of hits) {
        const rel = path.relative(process.cwd(), h.absPath);
        console.log(`  ${h.score.toFixed(4)}  ${rel}:${h.startLine}-${h.endLine}`);
      }
      console.log("\n---\n\nRetrieved context:\n");
      console.log(context);
      return;
    }

    console.error("Unknown rag subcommand:", sub);
    process.exit(1);
  }

  if (command === "brief") {
    ensureConfig();
    const productId = args[1];
    if (!productId) {
      console.error("Usage: node src/cli.js brief <productId> --post=N [--caption=\"...\"] [--format=single|carousel] [--output=dir]");
      process.exit(1);
    }
    const opts = parseArgs(args.slice(2));
    let retrievedContext = undefined;
    if (opts.rag) {
      const taskQuery = `Product: ${productId}. Post: ${opts.postId || 1}. Format: ${opts.format || ""}. Caption angle: ${opts.captionAngle || ""}. Retrieve the most relevant standards and examples for this brief.`;
      const ragRes = await runRagQuery({
        indexPath: opts.ragIndexPath,
        query: taskQuery,
        k: opts.ragK,
        agentId: "director",
      });
      retrievedContext = ragRes.context;
    }
    const result = await generateAndSaveDirectorBrief(productId, {
      postId: opts.postId || 1,
      captionAngle: opts.captionAngle,
      format: opts.format,
      outputDir: opts.outputDir || "./instagram-output",
      retrievedContext,
    });
    console.log("Director's brief (Gemini 1.5 Flash)");
    console.log("Product:", result.productTitle);
    console.log("Saved:", result.savedPath);
    return;
  }

  if (command === "list") {
    ensureConfig();
    const products = await listProducts(10);
    console.log("Products (first 10):\n");
    for (const p of products) {
      console.log(`  ${p.id}  ${p.title}`);
    }
    return;
  }

  if (command === "alt") {
    ensureConfig();
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
    ensureConfig();
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
