# Image Refinement Tool for Shopify

Refine product images using **Google AI Studio** (Gemini / Nano Banana) and sync with your **Shopify** store. Use your existing Google AI Studio API key and Shopify access token.

## What it does

- **Instagram-ready edits** – Take product images from Shopify, edit them with AI (clean background, lighting, crop) and save files ready for Instagram. Uses the **Nano Banana** (Gemini 2.5 Flash Image) model.
- **Refine images** – Send a product image + prompt to Gemini for text or image output.
- **Alt text** – Generate SEO-friendly alt text for product images and optionally update them in Shopify.
- **Shopify integration** – Fetch products/images and update image alt text via the Admin API.

## Setup

### 1. Get credentials

- **Google AI Studio API key**  
  [Create an API key](https://aistudio.google.com/apikey) in Google AI Studio.

- **Shopify**  
  - Store hostname: `your-store.myshopify.com`  
  - [Create a custom app](https://help.shopify.com/en/manual/apps/app-types/custom-apps) (or use an existing app) and create an **Admin API access token**.  
  - Required scope: **Products – read and write** (for updating image alt text).

### 2. Install and configure

```bash
cd ImageRefinement
npm install
cp .env.example .env
```

Edit `.env` and set:

```env
GOOGLE_AI_STUDIO_API_KEY=your_google_ai_studio_api_key
SHOPIFY_STORE=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxx
```

Do not commit `.env` or share these values.

## Usage

### CLI

```bash
# List first 10 products
npm run refine -- list

# Post 1, single image → instagram-output/post/post_01_slide-01_<slug>.png
npm run refine -- instagram <productId> --style=juneember --post=1 --type=post

# Carousel (e.g. post 5), or custom output
npm run refine -- instagram <productId> --all --post=5 --type=post --output=./instagram-output

# Suggest alt text for a product (first image)
npm run refine -- alt <productId>

# Suggest and update alt text in Shopify
npm run refine -- alt <productId> --apply

# (Optional) RAG: index internal docs/prompts, then query
npm run refine -- rag index
npm run refine -- rag query "What is the director's-scene standard?"
```

### Instagram workflow

1. Run `npm run refine -- list` to get product IDs.
2. Run `npm run refine -- instagram <productId> --post=1 --type=post` to fetch the product’s first image, edit it for Instagram, and save under `instagram-output/post/` with naming like `post_01_slide-01_<slug>.png`.
3. Use `--post=N` and `--type=post|story|reel` so files go into the right folder; use `--all` for carousels (multiple slides). See [instagram-output/NAMING_CONVENTION.md](instagram-output/NAMING_CONVENTION.md).

**Style presets:** `--style=juneember` (June & Ember) | `clean` | `lifestyle` | `flatlay` | `editorial` | `minimal`. **Docs:** [docs/README.md](docs/README.md) (index). Expert playbook: [docs/SOCIAL_MEDIA_EXPERT.md](docs/SOCIAL_MEDIA_EXPERT.md). Captions & hashtags: [docs/CAPTION_AND_HASHTAG_SETS.md](docs/CAPTION_AND_HASHTAG_SETS.md). **Output:** [instagram-output/ALL_POSTS_READY.md](instagram-output/ALL_POSTS_READY.md) (post-by-post plan).

**Aspect ratios** (Instagram feed): `4:5` (default, portrait), `1:1` (square), `16:9` (landscape).

### In code

```javascript
import { ensureConfig, refineProductForInstagram, refineProductAltText } from "./src/index.js";

ensureConfig();

// Edit product images for Instagram and save to disk
const result = await refineProductForInstagram("8560310976600", {
  aspectRatio: "4:5",
  outputDir: "./instagram-output",
  allImages: false,
});
console.log("Saved:", result.saved);

// Custom edit prompt
await refineProductForInstagram("8560310976600", {
  prompt: "Clean white background, soft shadow, lifestyle product shot for Instagram.",
  aspectRatio: "1:1",
  outputDir: "./posts",
});
```

## Project structure

```
ImageRefinement/
├── src/                    # App code
│   ├── config.js           # Env: GOOGLE_AI_STUDIO_API_KEY, SHOPIFY_*, etc.
│   ├── google-ai.js        # Gemini + Nano Banana (image gen/edit)
│   ├── shopify.js          # Shopify REST + GraphQL (products, images, alt text)
│   ├── refine.js           # Refine image, suggest/apply alt text
│   ├── instagram.js        # Fetch → edit for Instagram → save
│   ├── cli.js              # CLI: list, instagram, alt
│   └── index.js            # Exports
├── docs/                   # Strategy, brand, templates (see docs/README.md)
│   ├── README.md           # Index of all docs
│   ├── INSTAGRAM_GUIDE.md  # How to run the account
│   ├── SOCIAL_MEDIA_EXPERT.md  # Expert playbook (content, schedule, face/no-face)
│   ├── VISUAL_SYSTEM.md    # Visual system (color, lighting, grid)
│   ├── JUNE_EMBER_BRAND.md # June & Ember one-pager
│   ├── VISUAL_SYSTEM_TEMPLATE.md  # Blank visual-system template
│   └── CAPTION_AND_HASHTAG_SETS.md  # Copy-paste captions & hashtags
├── instagram-output/       # Generated images + post plan (see instagram-output/README.md)
│   ├── README.md           # What this folder is for
│   ├── NAMING_CONVENTION.md # post/story/reel folders, {type}_{id}_slide-{nn}_{slug}.png
│   ├── ALL_POSTS_READY.md  # Post 1–9 (and beyond): image, caption, checklist
│   ├── post/               # Feed post images (post_01_slide-01_*.png, …)
│   ├── story/              # Story frames
│   └── reel/               # Reel frames (future)
├── .env.example            # Credentials template (copy to .env)
├── package.json
└── README.md               # This file
```

## Notes

- **Instagram edits** use the Nano Banana model (`gemini-2.5-flash-image`) to produce new image files (PNG) from your product photos. Generated files are saved locally for you to post.
- **Shopify API**: Image alt updates use the GraphQL Admin API (`productImageUpdate`) so it stays compatible with current and future Shopify versions.
- Keep your API key and access token only in `.env` and out of version control.

## License

MIT
