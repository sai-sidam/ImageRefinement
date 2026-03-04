# Instagram output

This folder holds **generated images** and **post-by-post instructions** for Instagram.

---

## What’s here

| Item | Purpose |
|------|--------|
| [ALL_POSTS_READY.md](ALL_POSTS_READY.md) | **Master post list:** Summary at top, then Post 1, 2, 3… with image (or “not yet generated”), caption, hashtags, checklist. Update image status and add links as you generate. |
| [NAMING_CONVENTION.md](NAMING_CONVENTION.md) | **Naming & folders:** Files in `post/`, `story/`, `reel/` — e.g. `post_01_slide-01_slug.png`. |
| `post/` | Feed post images (single or carousel). |
| `story/` | Story frames. |
| `reel/` | Reel frames (future). |

---

## Commands (from project root)

```bash
# List products
npm run refine -- list

# Post 1, single image → post/post_01_slide-01_<slug>.png
npm run refine -- instagram <productId> --style=juneember --post=1 --type=post

# Post 5, carousel (hero + details)
npm run refine -- instagram <productId> --all --style=juneember --post=5 --type=post

# Story 1 → story/story_01_slide-01_<slug>.png
npm run refine -- instagram <productId> --style=juneember --type=story --post=1
```

---

## Docs (strategy & copy)

- **Expert playbook, captions, hashtags:** [../docs/README.md](../docs/README.md)
