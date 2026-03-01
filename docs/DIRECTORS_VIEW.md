# Director's view — how to approach every post

This doc is **one part** of the pipeline. The full pipeline has **many roles** (Producer, Creative Director, Art Director, Stylist, Photographer, MUA, Hair, Set Decorator, Retoucher, Content Strategist, Social Media Manager, etc.). See [BRIEF_TO_POST_FLOW.md](BRIEF_TO_POST_FLOW.md) for the complete list (researched) and how we map to them.

Here we focus on the **Creative Director + Art Director** layer: concept, story, set, references. Your inputs (e.g. story, set) feed this layer; the Director also considers strategy, audience, mood, and visual references — not only what you provide.

---

## Why director's view

- **Less guesswork:** You're not asking the AI to "make it look good" — you're giving a clear creative brief (mood, reference, lighting, pose) so the output has intent.
- **Use inspiration, not invent from zero:** Pull from the listed inspiration accounts. Describe their shot (or use a reference image) and put our dress in that world. You get their proven composition and lighting; we only swap garment and face.
- **Consistency:** Every post has a one-line concept and a reference style, so the feed stays cohesive.

---

## Story and set — your variables (Director layer)

You give **story** and **set** as inputs. The Director uses them and adds everything else they normally consider (see [BRIEF_TO_POST_FLOW](BRIEF_TO_POST_FLOW.md)): strategy, audience, mood, references, shot list.

- **Story** = the narrative of the shot. *What moment are we in?* (e.g. “just arrived at the hotel,” “resort afternoon, pre-dinner.”) You provide this; the Director checks it fits brand and campaign.
- **Set** = the physical place and how it supports the story. *Where is she, and what does that say?* You provide this; the Art Director adds detail (materials, props, light direction) so it’s specific, not generic.
- **Environment details** = what an art director would put in frame: archways, plants, light through a window, warm walls — one specific moment in one specific place.

So for every post: **define the story first, then the set that tells it.** When you write the prompt, include story and set; we combine them with the full Director and Photographer scope so the image has clear “why,” “where,” and proper execution.

---

## The brief (every post)

Before generating, lock in:

| Question | Example (Post 1) |
|----------|-------------------|
| **Story** | “June & Ember is here” — she’s just arrived or just stepped into the light; first moment of the brand, welcoming and aspirational. |
| **Set / environment** | Elegant interior (hotel or resort): corridor or lobby feel, warm neutrals, soft daylight from a window or archway; clean, no clutter. The space says “you’ve arrived somewhere special.” |
| **Concept** | First post hero; aspirational but welcoming. |
| **Reference** | Style of **talbotsofficial** — timeless elegance, subtle glamour; elegant interior, soft light. |
| **Lighting** | One main source (window or doorway left), soft shadows, subtle warmth — supports “just stepped into the light” story. |
| **Pose & model** | Natural, confident; full-length; relaxed body language, natural hair — at ease in the space. |
| **Face** | Hero = with face (first image); detail = no face (carousel slide 2+). |

Use this for **every** post: story → set → reference → lighting → pose, then generate.

---

## Inspiration accounts → how to use them

**Option A — Describe in the prompt (no reference image)**  
Use the account’s style as text: e.g. *"In the style of astee_official: LA aesthetics, sleek semi-formal, clean lines, elegant interior, soft window light, full-length, confident pose."* The model replicates that feel with our product. No need to have their actual image.

**Option B — Literal copy with our product (use when you have a reference photo)**  
Take a **literal photo** from any Instagram page (e.g. inspiration account). Save or screenshot it. The tool takes **two images**: (1) our product image, (2) that reference photo. It **copies that photo** — same composition, pose, lighting, set — then **replaces the clothing** with our dress and **changes the model's face**. You get that exact shot with our product and a new face; no need to describe the scene. Run with `--reference-path=./saved-photo.jpg` or `--reference-url=...`. See CLI help.

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

## Director's-scene standard (finalized)

**Creative quality bar for every post:** full environment, story, same light (bar that high); the set can differ per post (Post 1 used boutique; others can use resort, lobby, etc.). Same reasoning applied for every product (brief, prompts, bar); no full reasoning doc per post — Post 1 doc is the reference. **Approved-image workflow:** Get one image approved; for more poses (back, side), send that approved image to the LLM and change only the model’s pose so the environment stays consistent. See [DIRECTORS_SCENE_STANDARD.md](DIRECTORS_SCENE_STANDARD.md). **Post 1 final image:** directors-scene-front ([FIRST_POST_READY.md](../instagram-output/FIRST_POST_READY.md)).

---

## Director's shoot = many images, then selection

On a real shoot, the director has a **story**; the photographer captures **many** frames (different angles, poses, moments). Then the **social media manager** (or creative) **selects** which images go to Instagram. We mirror that:

1. **Director's shot list per product:** At least **front**, **back**, and **side** (or three-quarter) so the dress is shown from multiple angles — like a real lookbook or editorial.
2. **Generate the set:** Use `--angles=front,back,side` so the tool produces one image per angle from the same story/set/lighting. Prompts live in `instagram-output/prompts/post-{id}-pro-grade-{angle}.txt`.
3. **Social manager selects:** From the generated set (and any other variants), choose which image(s) to use for the post — e.g. one hero for Post 1, or a carousel of front + back + detail.

**Command (Post 1):**  
`npm run refine -- instagram 8560310976600 --post=1 --type=post --style=juneember --angles=front,back,side`

**Output:**  
`post_01_slide-01_backless-wide-strap-maxi-dress_vpro-grade-front.png`  
`post_01_slide-01_backless-wide-strap-maxi-dress_vpro-grade-back.png`  
`post_01_slide-01_backless-wide-strap-maxi-dress_vpro-grade-side.png`

Then open [FIRST_POST_READY.md](../instagram-output/FIRST_POST_READY.md) or the Post 1 section in [ALL_POSTS_READY.md](../instagram-output/ALL_POSTS_READY.md) and **pick which file to upload** for the first post (or use in a carousel).

---

## Shot list (director's checklist)

Before you hit generate:

- [ ] **Story** in one line (what moment? e.g. "just arrived at the hotel," "resort afternoon, pre-dinner").
- [ ] **Set / environment** defined so it supports the story (where is she? what does the space say? e.g. "hotel corridor, soft daylight, warm walls").
- [ ] **Concept** in one sentence (e.g. "Hero shot for first post; welcoming, aspirational").
- [ ] **Reference** chosen (account name or reference image).
- [ ] **Lighting** defined (one direction, soft shadows, warm) — fits the story and set.
- [ ] **Pose** defined (natural, full-length, confident; or detail crop).
- [ ] **Face** rule: hero = with face; detail = no face.
- [ ] **Garment** unchanged (color, pattern, fabric); only scene/lighting/pose change.

---

## Tool usage

- **Default (no reference image):** Use `--style=juneember` and/or a custom prompt that includes the **reference style** and **director’s brief** (e.g. "In the style of talbotsofficial: timeless elegance, elegant interior, soft window light…").
- **With reference image:** Use `--reference-url=<url>` or `--reference-path=<path>`. The tool sends product image + reference image and asks: same composition/pose/lighting as reference, our dress, different natural face. See [INSTAGRAM_GUIDE.md](INSTAGRAM_GUIDE.md) or CLI help.

---

## Example: Post 1 director's brief

- **Story:** “June & Ember is here” — she’s just arrived or just stepped into the light; the first moment of the brand. Welcoming, aspirational, “you’ve arrived somewhere special.”
- **Set / environment:** Elegant hotel or resort interior: corridor, lobby, or light-filled room with warm neutrals; soft daylight from a window or archway; clean, uncluttered. The space tells the story: arrival, ease, understated luxury.
- **Concept:** First post hero; elegant, welcoming, aspirational.
- **Reference:** Talbotsofficial — timeless elegance, subtle glamour; elegant interior, soft daylight.
- **Lighting:** One soft window or doorway light from frame left; soft shadows; subtle warmth — “just stepped into the light.”
- **Pose:** Natural, confident; full-length; at ease in the space; relaxed pose and natural hair.
- **Output:** Sharp, high-res; natural model (pose, hair, expression); our dress unchanged.

*Use this brief (including story and set) in the prompt when generating Post 1 or its variants.*

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
