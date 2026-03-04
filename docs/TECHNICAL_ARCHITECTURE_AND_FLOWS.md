# Architecture and process flow

How the Image Refinement tool is structured and how a run goes from command → image(s). Use this when adding flows, debugging, or onboarding.

---

## 1. High-level architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CLI (src/cli.js)                                                        │
│  Commands: list | alt <productId> | instagram <productId> [flags]         │
│  Parses flags → picks flow → calls one of the modules below              │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ├── list / alt ──────► shopify.js + refine.js (alt text only)
         │
         └── instagram ───────► instagram.js (orchestration)
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
              shopify.js        google-ai.js       config.js
              (product,         (Gemini API:       (env: API key,
               images, URLs)    refine / ref+img   Shopify store)
```

- **Entry point:** `npm run refine -- <command> ...` → `node src/cli.js <command> ...`
- **Config:** `.env` → `config.js` (GOOGLE_AI_STUDIO_API_KEY, SHOPIFY_STORE, SHOPIFY_ACCESS_TOKEN). Required before any command that hits APIs.
- **Instagram logic:** All Instagram behavior lives in `instagram.js`; it uses `shopify.js` for product/images and `google-ai.js` for model calls. The CLI only parses args and delegates.

---

## 2. Instagram: how the CLI picks a flow

The CLI branches on **flags**, in this order:

| Condition | Flow | What runs |
|-----------|------|-----------|
| `--from-image` + `--pose` | **Pose from approved image** | `refinePoseFromImage()` — same scene, change pose (back/side); optional `--detail`, `--product-back-image` |
| `--from-image` and no `--pose` | **Refine local image with prompt** | `refineImageFromFile()` — one image in, prompt (or post prompt file), one image out |
| `--angles=...` (e.g. front,back,side) | **Director’s shoot by angle** | Loop: load `post-{id}-directors-scene-{angle}.txt` (or pro-grade), call `refineProductForInstagram()` once per angle with that prompt |
| (default) | **Generate from product** | `refineProductForInstagram()` — fetch first (or `--all`) product image(s), apply style/prompt, save |

So:

- **“Generate a new post image from Shopify”** → no `--from-image`, no `--angles` → default `refineProductForInstagram`; or use `--angles=front --scene=directors` to use prompt files.
- **“Same scene, different pose (back/side)”** → `--from-image=... --pose=back|side` → `refinePoseFromImage`.
- **“Upgrade this file with the director’s-scene prompt”** → `--from-image=...` and no `--pose` → `refineImageFromFile`.

---

## 3. Data flow by flow

### 3.1 Generate from product (default or with `--angles`)

1. **CLI** passes `productId`, `postId`, `style`, `prompt` (or prompt from file when `--angles` + `--scene=directors`).
2. **instagram.js** `refineProductForInstagram()`:
   - Gets product + images from **Shopify** (`getProduct`, then first image or slice for `--all`).
   - Resolves prompt: custom `--prompt`, or style preset (e.g. juneember), or file `instagram-output/prompts/post-{NN}-directors-scene-{angle}.txt`.
   - For each image to process: **google-ai.js** `refineImageWithNanoBanana(productImageBytes, prompt, mime, { aspectRatio })` → Gemini returns new image.
   - Builds filename with `buildOutputFilename(type, postId, slideIndex, slug, variant)`, writes to `outputDir/type/` (e.g. `instagram-output/post/`).
3. **Output:** `post_{NN}_slide-{nn}_{slug}.png` or `..._v{variant}.png`.

### 3.2 Pose from approved image (carousel back/side)

1. **CLI** passes `fromImage`, `productId`, `pose` (back|side), optional `detailShot`, `productBackImageIndex`.
2. **instagram.js** `refinePoseFromImage()`:
   - Loads approved image from path; gets product (for slug, title, and optional product back image URLs).
   - **If `pose === "back"` and `productBackImageIndex` set:** fetch product image(s) at that index (or comma-separated indices), build instruction with `getBackWithProductBackReferenceInstruction(n)`. Then:
     - 1 ref image → **google-ai.js** `refineWithReferenceImage(approved, productBackRef, instruction, ...)`.
     - 2+ ref images → **google-ai.js** `refineWithMultipleImages(instruction, [approved, ref1, ref2], ...)`.
   - **Else:** pose-only instruction (e.g. `getPoseChangeInstruction(pose)` or `getPoseChangeInstructionDetail(pose)` for `--detail`), then **google-ai.js** `refineImageWithNanoBanana(approvedBytes, instruction, ...)`.
   - Saves to same output dir with variant like `directors-scene-detail-back`.
3. **Output:** e.g. `post_03_slide-02_..._vdirectors-scene-detail-back.png`.

### 3.3 Refine local image with prompt

1. **CLI** passes `fromImage`, `productId`, `postId`, `scene` (e.g. directors), optional `prompt`, `variant`.
2. **instagram.js** `refineImageFromFile()`:
   - Reads image from `fromImage` path; gets product (for slug).
   - If no `prompt` and `scene=directors`: loads `outputDir/prompts/post-{NN}-directors-scene-front.txt`.
   - **google-ai.js** `refineImageWithNanoBanana(imageBytes, prompt, mime, ...)`.
   - Saves with `buildOutputFilename(..., variant)` (default variant `directors-scene-refined`).
3. **Output:** e.g. `post_04_slide-01_..._vdirectors-scene-refined.png`.

---

## 4. Modules and responsibilities

| Module | Role |
|--------|------|
| **cli.js** | Parse args; dispatch to list, alt, or instagram; no business logic. |
| **instagram.js** | All Instagram flows: prompt resolution, filename building, calling Shopify + Google AI, writing files. Exports: `refineProductForInstagram`, `refinePoseFromImage`, `refineImageFromFile`, `buildOutputFilename`, style presets. |
| **google-ai.js** | Gemini (Nano Banana) only: `refineImageWithNanoBanana`, `refineWithReferenceImage`, `refineWithMultipleImages`, `generateImageWithNanoBanana`, `suggestAltText`, `imagePart`. |
| **shopify.js** | Product fetch, image URLs, list products, update alt text, `fetchImageBytes`. |
| **refine.js** | Product image refinement + alt text suggestion/apply (used by `alt` command). |
| **config.js** | Load env; `ensureConfig()` for API keys and Shopify credentials. |

---

## 5. Prompts and files

- **Prompt files:** Under `instagram-output/prompts/`. Naming: `post-{NN}-{directors-scene|pro-grade}-{front|back|side}.txt`. The CLI and `refineImageFromFile` resolve paths relative to `outputDir` (default `./instagram-output`).
- **Output files:** `instagram-output/{type}/` with `type` = post | story | reel. Naming: `{type}_{id}_slide-{nn}_{slug}.png` or `..._v{variant}.png` (see `buildOutputFilename` in instagram.js).
- **Slug:** From product title (lowercase, hyphens). Product comes from Shopify via `productId`.

---

## 6. Adding a new flow or option

1. **New CLI flag:** Add parsing in `parseArgs()` in cli.js, then a branch that calls the right function with the new option.
2. **New “generate” path:** Either a new prompt file (e.g. `post-05-directors-scene-front.txt`) and existing `--angles=front --scene=directors --post=5`, or a new branch in cli that loads a different prompt and still calls `refineProductForInstagram`.
3. **New “pose” behavior:** Extend `refinePoseFromImage()` (e.g. new pose type or new reference pattern) and/or add a new instruction builder in instagram.js; keep calling existing google-ai helpers where possible.
4. **New model API usage:** Add a function in google-ai.js (e.g. new signature for multi-image or new endpoint), then call it from instagram.js.

---

## 7. Quick reference: command → flow

| You want to… | Command shape | Flow |
|--------------|----------------|------|
| Generate one image from product (style or custom prompt) | `instagram <productId> --post=N [--style=juneember] [--prompt="..."]` | refineProductForInstagram |
| Generate front (and optionally back/side) from prompt files | `instagram <productId> --post=N --angles=front[,back,side] --scene=directors` | CLI loop → refineProductForInstagram per angle |
| Same scene, new pose (back or side) from approved image | `instagram <productId> --post=N --from-image=path --pose=back\|side [--detail] [--product-back-image=2,4]` | refinePoseFromImage |
| Upgrade one local image with director’s-scene prompt | `instagram <productId> --post=N --from-image=path [--scene=directors]` | refineImageFromFile |

This doc should stay in sync with `src/cli.js` and `src/instagram.js` when flags or flows change.
