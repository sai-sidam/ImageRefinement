# Director's brief and vision — how to approach every post

This doc is **one part** of the pipeline. The full pipeline has **many roles** (Producer, Creative Director, Art Director, Stylist, Photographer, MUA, Hair, Set Decorator, Retoucher, Content Strategist, Social Media Manager, etc.). See [OPERATIONAL_WORKFLOWS_AND_ROLES.md](OPERATIONAL_WORKFLOWS_AND_ROLES.md) for the complete list (researched) and how we map to them.

Here we focus on the **Creative Director + Art Director** layer: concept, story, set, references. Your inputs (e.g. story, set) feed this layer; the Director also considers strategy, audience, mood, and visual references — not only what you provide.

---

## Why director's view

- **Less guesswork:** You're not asking the AI to "make it look good" — you're giving a clear creative brief (story, set, moment, concept, lighting, pose) so the output has intent.
- **Consistency:** Every post has a one-line concept and a clear brief, so the feed stays cohesive. (Reference/inspiration is set aside for now; future = live Instagram, holistic view of an account.)

---

## Story and set — your variables (Director layer)

You give **story** and **set** as inputs. The Director uses them and adds everything else they normally consider (see [OPERATIONAL_WORKFLOWS_AND_ROLES](OPERATIONAL_WORKFLOWS_AND_ROLES.md)): strategy, audience, mood, references, shot list.

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
| **Set / environment** | Elegant interior (hotel or resort): corridor or lobby feel, warm neutrals, soft daylight from a window or archway; clean, no clutter. The set does *not* have to be different from previous posts — it must be **creative and bold enough** to capture the audience, and it doesn't have to look the same every time. |
| **Moment** | What is she *doing* in the frame? A specific activity that fits the story — not just posing for the camera. Examples are illustrative only; full creative freedom (no fixed list to pick from). |
| **Concept** | First post hero; aspirational but welcoming. Concept can be broader too: bold editorial, understated luxury, playful, etc. |
| **Lighting** | Can be one main source, soft and warm — or LA light, NYC golden hour, Greece sunset, Monaco sunset, sunrise, harsh afternoon beach; whatever fits the story and location. Full creative freedom.
| **Pose & model** | Pose that supports the moment and concept. Can be natural and confident; can also be bold (Vogue-style), out-of-the-box, unorthodox, unconventional. Not limited to "relaxed" only. |
| **Face** | Hero = with face (first image); detail = no face (carousel slide 2+). |

Use this for **every** post: story → set → **moment** → concept → lighting → pose, then generate.

**Why each element matters:**  
- **Story:** Anchors the image in a narrative so it feels intentional, not random.  
- **Set / environment:** A specific place (not generic "elegant interior") makes the feed recognizable and bold.  
- **Moment:** What she's *doing* makes the image dynamic and avoids generic "model standing" shots.  
- **Concept:** One sentence aligns SMM and Director on the goal of the post.  
- **Lighting:** Tied to location and mood; defines the feel of the image.  
- **Pose & model:** Supports the moment and concept; can be natural or bold editorial.

---

## Reference / inspiration (set aside for now)

We are **not** using reference or inspiration in the Director brief right now. The previous approach (short style one-liners per account, e.g. "talbotsofficial — timeless elegance") is set aside.

**Future vision:** When we build it, inspiration should mean: an AI agent goes **live to Instagram**, looks at an account's feed (e.g. ohpolly, Miss Circle, Two Sisters the Label), views their last **20–30 pictures**, and either **picks one image** to reference or **understands their whole design language**. That requires Instagram integration and image handling — we'll revisit when we have that. See [INSPIRATION_STRATEGY.md](INSPIRATION_STRATEGY.md).

*(The following is kept for future use and for the optional manual `--reference-path` / `--reference-url` flow; the Director brief does not include a Reference section.)*

**Accounts we may use when we have live inspiration:** **ohpolly**, **outcastclothing**, **misscirclenewyork**. Optional: you can still pass a saved image with `--reference-path` or `--reference-url`; the tool will composite our dress onto that scene. See CLI help. Per-brand folders: `instagram-output/inspiration/{brand}/`; see [INSPIRATION_STRATEGY.md](INSPIRATION_STRATEGY.md).

*(Reference/inspiration is set aside; no Director brief section. The table below is for **future vision only** — do not use these in the Director brief today.)*

| Handle (future only) | Style one-liner (for prompts or briefs) |
|--------|----------------------------------------|
| **ohpolly** | Bold, aspirational occasion wear; confidence, statement pieces. *(Primary inspiration.)* |
| **outcastclothing** | Trendy, party, bold; nightlife and occasions; edgy, confident. *(Primary inspiration.)* |
| **misscirclenewyork** | Glamorous, confident occasion wear; "all eyes on me"; statement dresses, NYC energy. *(Primary inspiration.)* |
| **astee_official** | LA aesthetics, sleek semi-formal, clean lines, accessible luxury; dinners to black-tie. |
| **talbotsofficial** | Timeless elegance, subtle glamour, sophisticated draping; evening and occasion. |
| **Vici** | Trend-forward, effortless chic, blogger-style; feminine + edgy; aspirational but wearable. |
| **babyboofashion** | Romantic, figure-enhancing; modern tailoring; casual to semi-formal. |
| **twosistersthelabel** | Timeless, whimsical, beautiful occasion wear; "feel beautiful and powerful." |

---

## Director's-scene standard (finalized)

**Creative quality bar for every post:** full environment, story, same light (bar that high); the set can differ per post (Post 1 used boutique; others can use resort, lobby, etc.). Same reasoning applied for every product (brief, prompts, bar); no full reasoning doc per post; full Post 1 reasoning in [EXAMPLE_POST_1.md](EXAMPLE_POST_1.md). **Approved-image workflow:** Get one image approved; for more poses (back, side), send that approved image to the LLM and change only the model’s pose so the environment stays consistent. Full quality bar, set rules, approved-image workflow, carousel, and detail-shot guidance are in *Quality standards & approved-image workflow (full)* below. Pose variations are implemented via `--from-image` and `--pose=back` or `--pose=side` (CLI help). **Post 1 final image:** directors-scene-front ([FIRST_POST_READY.md](../instagram-output/FIRST_POST_READY.md)).

---

## Director's shoot = many images, then selection

On a real shoot, the director has a **story**; the photographer captures **many** frames (different angles, poses, moments). Then the **social media manager** (or creative) **selects** which images go to Instagram. We mirror that:

1. **Director's shot list per product:** At least **front**, **back**, and **side** (or three-quarter) so the dress is shown from multiple angles — like a real lookbook or editorial.
2. **Generate the set:** Use `--angles=front,back,side` so the tool produces one image per angle from the same story/set/lighting. Prompts live in `instagram-output/prompts/post-{id}-pro-grade-{angle}.txt`.
3. **Social manager selects:** From the generated set (and any other variants), choose which image(s) to use for the post. **Default = carousel** (slide 1 hero, then front + back + detail). Single image only by exception.

**Command (Post 1):**  
`npm run refine -- instagram 8560310976600 --post=1 --type=post --style=juneember --angles=front,back,side`

**Output:**  
`post_01_slide-01_backless-wide-strap-maxi-dress_vpro-grade-front.png`  
`post_01_slide-01_backless-wide-strap-maxi-dress_vpro-grade-back.png`  
`post_01_slide-01_backless-wide-strap-maxi-dress_vpro-grade-side.png`

Then open [FIRST_POST_READY.md](../instagram-output/FIRST_POST_READY.md) or the Post 1 section in [ALL_POSTS_READY.md](../instagram-output/ALL_POSTS_READY.md) and **pick which files to upload** for the post — carousel (slide 1 hero + slide 2–3 detail) by default.

---

## Shot list (director's checklist)

Before you hit generate:

- [ ] **Story** in one line (what moment? e.g. "just arrived at the hotel," "resort afternoon, pre-dinner").
- [ ] **Set / environment** concretely specific — not generic; examples are illustrative only (full creative freedom).
- [ ] **Moment** defined: what is she *doing*? (e.g. playing piano, walking stairs, walking through a street) — not just posing for camera.
- [ ] **Concept** in one sentence (e.g. "Hero shot for first post; welcoming, aspirational").
- [ ] **Lighting** defined — fits the story and location (e.g. soft warm, LA light, NYC golden hour, Greece sunset, harsh beach afternoon; full creative freedom).
- [ ] **Pose** supports the moment and concept (natural and confident, or bold/Vogue-style, unorthodox, unconventional — as the concept needs).
- [ ] **Face** rule: hero = with face; detail = no face.
- [ ] **Garment** unchanged (color, pattern, fabric); only scene/lighting/pose change.

---

## Tool usage

- **Default:** Use `--style=juneember` and/or a custom prompt that includes the **director’s brief** (story, set, moment, concept, lighting, pose).
- **Optional — reference image:** Use `--reference-url=<url>` or `--reference-path=<path>`. The tool sends product image + reference image and asks: same composition/pose/lighting as reference, our dress, different natural face. See [INSTAGRAM_GUIDE.md](INSTAGRAM_GUIDE.md) or CLI help.

---

## Example: Post 1 director's brief

- **Story:** “June & Ember is here” — she’s just arrived or just stepped into the light; the first moment of the brand. Welcoming, aspirational, “you’ve arrived somewhere special.”
- **Set / environment:** Elegant hotel or resort interior: corridor, lobby, or light-filled room with warm neutrals; soft daylight from a window or archway; clean, uncluttered. The space tells the story: arrival, ease, understated luxury.
- **Moment:** What she's doing — e.g. stepping through an archway into the light, or pausing at a window (not just standing and looking at camera).
- **Concept:** First post hero; elegant, welcoming, aspirational.
- **Lighting:** One soft window or doorway light from frame left; soft shadows; subtle warmth — (Other posts: LA light, Greece sunset, harsh beach, etc.) “just stepped into the light.”
- **Pose:** Natural, confident; full-length; at ease in the space. (Other posts can use bold editorial, Vogue-style, or unorthodox poses when the concept calls for it.)
- **Output:** Sharp, high-res; natural model (pose, hair, expression); our dress unchanged.

*Use this brief (including story and set) in the prompt when generating Post 1 or its variants.*

---

## Example generated: Post 1 director-talbots variant

An **example post** was generated using the director's brief above. Result saved as:

- **File:** `instagram-output/post/post_01_slide-01_backless-wide-strap-maxi-dress_vdirector-talbots.png`
- **Prompt used:** [instagram-output/prompts/post-01-director-talbots-prompt.txt](../instagram-output/prompts/post-01-director-talbots-prompt.txt)

To regenerate:  
`npm run refine -- instagram 8560310976600 --post=1 --type=post --style=juneember --variant=director-talbots --prompt="$(cat instagram-output/prompts/post-01-director-talbots-prompt.txt)"`

To use a **reference image** (same pose/lighting as the reference, our dress, new face):  
`npm run refine -- instagram <productId> --post=1 --reference-url=<image-url> --variant=from-ref`  
or `--reference-path=./path/to/reference.jpg`

---

## Quality standards & approved-image workflow (full)

**This is the creative quality bar for every post.** Same level of detail, same reasoning — applied to every post (brief, prompts, bar). We do **not** write a full reasoning doc per post; the full written reasoning was Post 1 only ([EXAMPLE_POST_1.md](EXAMPLE_POST_1.md)). Post 2+ get the same reasoning applied, not the same doc written. Finalized from Post 1.

### Creative quality bar (finalized)

Every post image must meet **this level** of quality — full environment, story, same light. The **set** (specific location and props) can change per post; the **bar** does not.

- **Full environment:** A real place, not just a background. Specific, considered setting that fits the product and the story (e.g. boutique, resort corridor, lobby, light-filled room — whatever serves that post).
- **Story:** The scene and the dress feel like they belong together; there's a clear "moment" or narrative.
- **Same light:** Dress and environment lit by the same light; no pasted-in look.
- **Moment:** Every brief must specify what she is *doing* in the frame — a real activity that fits the story, not just posing for the camera. Examples (e.g. playing piano, walking stairs, walking through a street) are illustrative only; the Director has **full creative freedom** to propose any moment that fits. No fixed menu to pick from.
- **Model detail:** Pose, hair, expression (and heels if visible) — all considered and coherent with the scene; pose supports the moment.

**Post 1 only:** We used a specific set (mirror, platform, hangers, curtains — boutique/dressing room). That set was for Post 1. Future posts can use different sets or revisit a similar place; the set does not have to be different — it must be **creative and bold enough** to capture the audience.

### Set and environment — creative and bold

**The set does not have to be different from previous posts.** It has to be **creative and bold enough** to capture the audience. It also does **not** have to look the same every time — so we have room for both variety and repetition when it serves the concept.

- **Priority:** Set and environment should feel intentional, specific, and striking — not generic or copy-pasted. That can mean a new type of place, or a fresh take on a similar place, or a deliberate callback when it fits the story.
- **What we avoid:** Same room with only the dress changed, with no creative or mood shift — that can feel repetitive. So: either vary the place/mood, or make the same "family" of set feel distinctly different (lighting, moment, pose).
- **For context:** If we're tracking what's been used (e.g. Post 1 = boutique, Post 2 = lobby, Post 3 = terrazzo room, Post 4 = corridor), the Director can use that to **inform** choice — but "must pick a different set" is not a hard rule. The rule is: **creative and bold**, and not samey unless we're doing it on purpose.

When writing prompts, be concretely specific about the set (what it IS and, if helpful, what it is NOT) so the image has a clear place and mood.

**Unique product features:** If a product has a distinctive detail (embroidery, hardware, draping, back design), SMM or the brief should call it out so the Director includes it in the brief/shot list and we capture it (e.g. product back reference, or a dedicated detail shot).

### Prompt exemplars (good vs bad)

**Good:** Specific set (boutique, mirror, platform, rack), clear moment ("trying on something special"), same light on dress and environment, concrete materials and props. Example: `instagram-output/prompts/post-01-directors-scene-brief.txt`.

**Bad:** Generic descriptors only ("elegant interior," "woman in a dress"), no moment (just "standing"), no specific set, vague lighting. Avoid prompts that could apply to any brand or any room.

### Approved-image workflow (finalized)

We do **not** generate three separate images (front, back, side) and hope the environment matches. Environment often drifts between runs.

**Process:** (1) Get one image approved for the post (e.g. front pose at director's-scene level). (2) For additional poses (back, side): Send that **approved image** to the LLM with the instruction: "Keep this image exactly as is — same environment, same dress, same lighting. Only change the model's pose: replace the current [front] pose with a [back] pose" (or side pose). (3) Output: Same scene, same dress; only the model's pose changes. Environment stays consistent across front, back, and side. So: one approved image = the "scene lock." Pose variations: `--from-image` and `--pose=back` or `--pose=side` (CLI help).

### Default: carousel (scene suitability)

**All posts are planned as carousels.** Default = carousel (slide 1 hero with face, slides 2–3 same scene, back/side or detail). Single image only when there is a stated exception. Choose a scene and brief that support multiple angles from the start (e.g. mirror; standing by window; walking; detail shot in a room that allows back/side). Plan carousel first; when approving slide 1, confirm the scene supports a second angle (story reason, same room).

### Detail-shot carousel (Post 3 — what worked)

When the approved image is a **detail shot** (no face), add back and side poses with `--from-image --pose=back|side --detail`. Dress must be **identical** across all slides. Back pose: model can look over her shoulder toward the camera. Side pose: same scale as slide 1 and 2. Same room in every slide. **Product back reference (when the generated back doesn't match the real product):** Use `--product-back-image=<index>` or `--product-back-image=2,4` (Shopify product image indices). Example: `npm run refine -- instagram 8556632473688 --post=3 --from-image=.../post_03_slide-01_..._vdirectors-scene-detail.png --pose=back --detail --product-back-image=2,4`.

### Post 1 (finalized)

- **Final image:** `post_01_slide-01_backless-wide-strap-maxi-dress_vdirectors-scene-front.png`
- **Product:** Backless Wide Strap Maxi Dress
- **Format:** Going forward, all posts = carousel (slide 1 hero with face, then detail). **Publish:** See [FIRST_POST_READY.md](../instagram-output/FIRST_POST_READY.md).

### How to generate the first image (per post)

`npm run refine -- instagram <productId> --post=<N> --type=post --variant=directors-scene --prompt="$(cat instagram-output/prompts/post-01-directors-scene-brief.txt)"` (use the prompt file that matches the post/product).
