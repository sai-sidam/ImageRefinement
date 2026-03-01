# Director's view — how to approach every post

Use this lens every time you plan or generate a post. Think like a **creative director**, **photographer**, or **creative strategist**: concept first, then execution.

---

## Why director's view

- **Less guesswork:** You're not asking the AI to "make it look good" — you're giving a clear creative brief (mood, reference, lighting, pose) so the output has intent.
- **Use inspiration, not invent from zero:** Pull from the listed inspiration accounts. Describe their shot (or use a reference image) and put our dress in that world. You get their proven composition and lighting; we only swap garment and face.
- **Consistency:** Every post has a one-line concept and a reference style, so the feed stays cohesive.

---

## The brief (every post)

Before generating, lock in:

| Question | Example (Post 1) |
|----------|-------------------|
| **Concept** | First post: hero shot, aspirational but welcoming; "we're here" moment. |
| **Reference** | Style of **talbotsofficial** — timeless elegance, subtle glamour, sophisticated; elegant interior, soft light. |
| **Lighting** | One main source (window left), soft shadows, subtle warmth. |
| **Pose & model** | Natural, confident; full-length; relaxed body language, natural hair. |
| **Setting** | Resort / elegant interior; warm neutrals; no clutter. |
| **Face** | Hero = with face (first image); detail = no face (carousel slide 2+). |

Use this for **every** post: pick a reference (from inspiration accounts or a specific reference image), describe the shot, then generate.

---

## Inspiration accounts → how to use them

**Option A — Describe in the prompt (no reference image)**  
Use the account’s style as text: e.g. *"In the style of astee_official: LA aesthetics, sleek semi-formal, clean lines, elegant interior, soft window light, full-length, confident pose."* The model replicates that feel with our product. No need to have their actual image.

**Option B — Use a reference image (recommended when you have one)**  
Provide a reference photo (from their feed, a saved screenshot, or a stock shot that matches). The tool can take **two images**: (1) our product image, (2) reference image. Instruction: *Use reference for composition, pose, lighting, and setting; keep the dress from our product; use a different natural face.* You get their exact framing and mood with our dress and a new face — minimal work on scene details.

| Handle | Style one-liner (for prompts or briefs) |
|--------|----------------------------------------|
| **astee_official** | LA aesthetics, sleek semi-formal, clean lines, accessible luxury; dinners to black-tie. |
| **talbotsofficial** | Timeless elegance, subtle glamour, sophisticated draping; evening and occasion. |
| **Vici** | Trend-forward, effortless chic, blogger-style; feminine + edgy; aspirational but wearable. |
| **babyboofashion** | Romantic, figure-enhancing; modern tailoring; casual to semi-formal. |
| **ohpolly** | Bold, aspirational occasion wear; confidence, statement pieces. |
| **twosistersthelabel** | Timeless, whimsical, beautiful occasion wear; "feel beautiful and powerful." |
| **outcastclothing** | Trendy, party, bold; nightlife and occasions; edgy, confident. |

---

## Shot list (director's checklist)

Before you hit generate:

- [ ] **Concept** in one sentence (e.g. "Hero shot for first post; welcoming, aspirational").
- [ ] **Reference** chosen (account name or reference image).
- [ ] **Lighting** defined (one direction, soft shadows, warm).
- [ ] **Pose** defined (natural, full-length, confident; or detail crop).
- [ ] **Setting** defined (elegant interior / resort / warm neutrals).
- [ ] **Face** rule: hero = with face; detail = no face.
- [ ] **Garment** unchanged (color, pattern, fabric); only scene/lighting/pose change.

---

## Tool usage

- **Default (no reference image):** Use `--style=juneember` and/or a custom prompt that includes the **reference style** and **director’s brief** (e.g. "In the style of talbotsofficial: timeless elegance, elegant interior, soft window light…").
- **With reference image:** Use `--reference-url=<url>` or `--reference-path=<path>`. The tool sends product image + reference image and asks: same composition/pose/lighting as reference, our dress, different natural face. See [INSTAGRAM_GUIDE.md](INSTAGRAM_GUIDE.md) or CLI help.

---

## Example: Post 1 director's brief

- **Concept:** First post hero; "June & Ember is here" — elegant, welcoming, aspirational.
- **Reference:** Talbotsofficial — timeless elegance, subtle glamour; elegant interior, soft daylight.
- **Lighting:** One soft window light from frame left; soft shadows; subtle warmth.
- **Pose:** Natural, confident; full-length; relaxed pose and natural hair.
- **Setting:** Elegant interior (warm neutrals, clean); resort feel.
- **Output:** Sharp, high-res; natural model (pose, hair, expression); our dress unchanged.

*Use this brief in the prompt (or with a reference image) when generating Post 1 or its variants.*

---

## Example generated: Post 1 director-talbots variant

An **example post** was generated using the director's brief above and the talbotsofficial reference style (text-only; no reference image). Result saved as:

- **File:** `instagram-output/post/post_01_slide-01_backless-wide-strap-maxi-dress_vdirector-talbots.png`
- **Prompt used:** [instagram-output/prompts/post-01-director-talbots-prompt.txt](../instagram-output/prompts/post-01-director-talbots-prompt.txt)

To regenerate:  
`npm run refine -- instagram 8560310976600 --post=1 --type=post --style=juneember --variant=director-talbots --prompt="$(cat instagram-output/prompts/post-01-director-talbots-prompt.txt)"`

To use a **reference image** (same pose/lighting as the reference, our dress, new face):  
`npm run refine -- instagram <productId> --post=1 --reference-url=<image-url> --variant=from-ref`  
or `--reference-path=./path/to/reference.jpg`
