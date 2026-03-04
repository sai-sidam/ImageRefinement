# Naming convention — generated content

All generated assets live under **type folders** and follow a single naming pattern so posts, stories, and (later) reels stay easy to find and scale.

---

## Variables

| Variable | Meaning | Examples |
|----------|--------|----------|
| **type** | Content type: feed post, story, or reel | `post`, `story`, `reel` |
| **id** | Which post / story / reel (1-based) | `01`, `02`, `15` |
| **slide** | Position in that piece (single image = 01; carousel = 01, 02, 03…) | `01`, `02`, `03` |
| **slug** | Short descriptor (product or content); lowercase, hyphens | `backless-maxi`, `floral-bodycon` |
| **variant** | Optional variant label (same post, different edit); use `--variant=02` or `--variant=natural-model` | `01`, `02`, `natural-model` |
| **ext** | File extension | `.png`, `.jpg`, `.mp4` (reels, future) |

---

## Folder structure

```
instagram-output/
├── post/          # Feed posts (single image or carousel)
├── story/         # Stories (single or multi-slide)
├── reel/          # Reels (video; future)
├── ALL_POSTS_READY.md
├── README.md
└── NAMING_CONVENTION.md  (this file)
```

Everything is grouped by **type**. One post with 3 carousel images = 3 files in `post/` with the same `id`, `slide` 01, 02, 03.

---

## File name pattern

**Images (post, story):**

```
{type}_{id}_slide-{nn}_{slug}[_v{variant}].{ext}
```

- **type:** `post` | `story` | `reel` (reel may use same pattern for thumbnails; video naming below)
- **id:** 2-digit number, e.g. `01`, `02`, `12`
- **slide:** 2-digit number, e.g. `01`, `02`, `03` (carousel = multiple slides)
- **slug:** lowercase, hyphens, no spaces (e.g. product name or theme)
- **variant:** optional; add `--variant=02` or `--variant=natural-model` so each run saves a new file (e.g. `_v02.png`, `_vnatural-model.png`). Keeps all variants for every post.
- **ext:** `png` or `jpg`

**Reels (future):**

- video file (mp4): YYYYMMDD_IG_REEL_VID_SHORTTITLE.mp4 (e.g., 20231026_IG_REEL_VID_AutumnGowns.mp4)
- video thumbnail (jpg): YYYYMMDD_IG_REEL_THUMB_SHORTTITLE.jpg (e.g., 20231026_IG_REEL_THUMB_AutumnGowns.jpg)

---

## Examples

| Content | Path | File name |
|---------|------|-----------|
| Post 1, single image | post/ | post_01_slide-01_backless-maxi.png |
| Post 1, variant (natural model) | post/ | post_01_slide-01_backless-wide-strap-maxi-dress_vnatural-model.png |
| Post 2, single image | post/ | post_02_slide-01_checkered-jumpsuit.png |
| Post 5, carousel (3 images) | post/ | post_05_slide-01_floral-bodycon.png |
| | post/ | post_05_slide-02_floral-bodycon.png |
| | post/ | post_05_slide-03_floral-bodycon.png |
| Story 1, single image | story/ | story_01_slide-01_outing.png |
| Story 2, 3 slides | story/ | story_02_slide-01_*.png, story_02_slide-02_*.png, story_02_slide-03_*.png |
| Reel 1 (future) | reel/ | reel_01_product-name.mp4 |

---

## How the tool uses it

When you run:

```bash
# Post 1, single image → post/post_01_slide-01_{product-slug}.png
npm run refine -- instagram <productId> --style=juneember --post=1 --type=post

# Post 5, carousel (3 images) → post/post_05_slide-01_*.png, post_05_slide-02_*.png, post_05_slide-03_*.png
npm run refine -- instagram <productId> --all --style=juneember --post=5 --type=post
```

- **--type=post|story|reel** → chooses folder and filename prefix.
- **--post=N** → sets `id` in the filename (which post/story/reel).
- **--variant=label** → adds `_v{label}.png` so you keep all variants (e.g. `--variant=02`, `--variant=natural-model`). Use for every post when trying different prompts.
- Single image → one file, `slide-01`. **--all** → multiple files, `slide-01`, `slide-02`, …

Default: `--type=post`, `--post=1`. Without `--variant` you get `post/post_01_slide-01_{slug}.png`. With `--variant=02` you get `..._v02.png`.
