# Operational workflows and roles — what each role does and where they get it from

Like the **Director** (who got a "brain" via Gemini 2.5 Flash for briefs), every role in our pipeline has a **job**, **inputs**, and a **brain** (who or what makes the decisions). This doc spells that out so we can see what’s human, what’s prompt/template, and what could be automated next.

---

## How to read the table

- **Role** — The job title in our pipeline.
- **What they do** — Their output or decision.
- **Where they get information** — Inputs (docs, tool, API, human).
- **Brain** — Who/what decides: **Human**, **Prompt/template** (fixed text or file), **LLM** (e.g. Gemini), **Tool** (code rule, no free-form text).

---

## Pre-production

| Role | What they do | Where they get information | Brain |
|------|----------------|-----------------------------|--------|
| **Director** (Creative Director + Art Director) | Decide story, set, concept, reference, lighting, pose for the post. Produce the **director’s brief** (text) that the next steps use. | Product title (Shopify), post number, optional caption angle, format (single/carousel), **set variety** (list of sets already used — from DIRECTOR_BRIEF_AND_VISION or config), **inspiration accounts** (from DIRECTOR_BRIEF_AND_VISION), **brand** (June & Ember). | **LLM** (Gemini 2.5 Flash) via `brief` command. Optional: human can edit the generated brief or write it by hand. |
| **Stylist** (pre) | “Which garment, no changes.” In our pipeline: the product is fixed; we never swap or redesign the outfit. | Product images from **Shopify** (which look we use). Decision: “keep garment exactly.” | **Tool** (we never change garment in prompts; style presets say “preserve product 100%”). |
| **Producer / Casting / Location scout** | In a real shoot: plan, cast, location. In our pipeline: **no separate output**. We don’t cast (we use product image + “natural model” in prompt); we don’t book locations (set is in the brief). | N/A for tool. Human can set post plan (which product per post) in ALL_POSTS_READY. | **Human** (you decide which product is Post 5, etc.). Out of scope for automation for now. |

---

## Production (image creation)

| Role | What they do | Where they get information | Brain |
|------|----------------|-----------------------------|--------|
| **Photographer** | “Execute the shot”: composition, lighting, angle, pose, technical quality. Output = **one image** (or one per angle) that matches the brief. | **Director’s brief** (story, set, lighting, pose) — from `post-NN-directors-scene-brief.txt` or hand-written; **directors-scene-front prompt** (`post-NN-directors-scene-front.txt`) that turns brief + product into full prompt; **product image** from **Shopify**; **aspect ratio** (CLI/default). | **LLM** (Gemini 2.5 Flash Image / Nano Banana). Prompt = the “instruction”; product image = the visual input. The prompt file is the **script** the photographer follows. |
| **Stylist** (on set) | Garment fits, no changes. Same as pre: we never alter the dress/jumpsuit. | Product image (Shopify); prompt text that says “keep garment exactly.” | **Tool** (hard-coded in prompts + presets). |
| **MUA / Hair** | Look (natural vs glam) that fits the scene. | Prompt line (e.g. “natural hair, natural expression” in juneember preset or in director’s brief). No separate MUA/Hair doc. | **Prompt/template** (we write “natural” or “soft glam” in the brief or style preset; LLM interprets). |
| **Set decorator** (on set) | What the room looks like. | **Director’s brief** → “Set / environment” section. That text is in the **front prompt** (or in the LLM’s image prompt). | **Director’s output** (brief) + **LLM** (image model draws the set from that text). |
| **Model** | Pose, expression. We don’t cast a person; we direct “a” model via text. | **Director’s brief** → “Pose & model” and “Face”; **pose-change instructions** (for back/side) in instagram.js (`getPoseChangeInstruction`, `getPoseChangeInstructionDetail`). | **Prompt/template** (pose is in brief and in fixed instructions for back/side). **LLM** (image model) executes. |

---

## Post-production

| Role | What they do | Where they get information | Brain |
|------|----------------|-----------------------------|--------|
| **Retoucher** | Polish: lighting, color, background, natural look. In our pipeline there is **no separate retouch step** — the refinement *is* the retouch. | **Input image** (product image or approved scene); **prompt** (same as photographer: “improve lighting, keep garment, same room,” etc.). | **LLM** (Gemini 2.5 Flash Image). Same model as “photographer”; we’re just refining an existing image instead of generating from product only. |
| **Editor** | Choose which image(s) go live. “This is the final for Post 4.” | **Generated files** in `instagram-output/post/`; **ALL_POSTS_READY** (which file is “Use for Post N”). | **Human** (you pick the file and update ALL_POSTS_READY). No tool/LLM. |

---

## Distribution

| Role | What they do | Where they get information | Brain |
|------|----------------|-----------------------------|--------|
| **Content strategist** | Pillars, calendar, mix (feed vs Reels vs Stories), what each post is for. | **SOCIAL_MEDIA_EXPERT.md**, **INSTAGRAM_GUIDE.md**. Decides *what* to post when. | **Human** (you), using the docs. Docs are the **reference**, not an automated brain. |
| **Social media manager** | Publish: caption, hashtags, timing, grid. Copy-paste caption and hashtags; upload the chosen image. | **ALL_POSTS_READY** (caption + hashtags per post, link to final image); **CAPTION_AND_HASHTAG_SETS.md** (rotating sets A/B/C). | **Human** (you) does the upload. Caption/hashtag text is **written in ALL_POSTS_READY** (human or future LLM). |

---

## Summary: brains at a glance

| Brain | Roles that use it |
|-------|--------------------|
| **LLM (Gemini 2.5 Flash)** | Director (brief generation). |
| **LLM (Gemini 2.5 Flash Image)** | Photographer (image from product + prompt), Retoucher (refine image with prompt), pose-from-approved (back/side). |
| **Prompt / template** | Stylist (keep garment), MUA/Hair (natural/glam line), Set (from brief text), Model (pose in brief + fixed back/side instructions). |
| **Tool (code)** | Stylist (no garment change in code), filename/variant rules, which prompt file to load. |
| **Human** | Producer/Casting/Location (post plan), Editor (final select), Content strategist (strategy), Social manager (publish). |

---

## Information flow (where things come from)

```
Shopify (product, images)
    ↓
Director ← product title, post #, caption angle, set variety, brand/docs
    ↓ (brief: story, set, lighting, pose, reference)
Prompt files (post-NN-directors-scene-front.txt, etc.) ← brief (or hand-written)
    ↓
Photographer (Gemini Image) ← product image + prompt
    ↓
Image(s) on disk
    ↓
Editor (human) ← files + ALL_POSTS_READY → "final" image per post
    ↓
Social manager (human) ← ALL_POSTS_READY (caption, hashtags, file) → publish
```

Optional branch: **Pose from approved image** — approved image + pose instruction (+ optional product back ref) → same image model → back/side slide.

---

## What we could give a “brain” next

- **Content strategist:** LLM that suggests “post 6 = detail, post 7 = hero” and calendar notes (input: SOCIAL_MEDIA_EXPERT, INSTAGRAM_GUIDE, current ALL_POSTS_READY).
- **Social manager (caption):** LLM that drafts caption + hashtags per post from product + caption angle (input: product title, caption angle, CAPTION_AND_HASHTAG_SETS).
- **Editor:** Tool that lists variants for a post and lets you mark “final” (writes ALL_POSTS_READY) — still human choice, but structured.

When we add or change a role's brain (e.g. new LLM step), update this table and the summary. See [TECHNICAL_ARCHITECTURE_AND_FLOWS.md](TECHNICAL_ARCHITECTURE_AND_FLOWS.md).

---

## Brief-to-Post Pipeline (full role list)

**Primary intention:** Build June & Ember's **Instagram presence** as a social media platform for the brand. Everything in this project — pipeline, director's view, variants, naming, prompts, reference workflow — is a **subpart of that process**.

**What went wrong before:** We treated "director, photographer, social manager" as the only three roles. The real pipeline involves more roles; below we list them (from research) and show how we map to them.

**Pre-production:** Producer, Creative Director, Art Director, Stylist pre, Casting, Location scout / Set decorator pre. **Production:** Photographer, Photo assistant, Stylist on set, MUA, Hair, Set decorator on set, Model, BTS, Brand. **Post-production:** Retoucher, Editor. **Distribution:** Content strategist, Social media manager.

Your inputs (story, set, message) feed **pre-production** (Creative Director + Art Director). We map the **concerns** of the full pipeline onto what we can control: Director = [DIRECTOR_BRIEF_AND_VISION.md](DIRECTOR_BRIEF_AND_VISION.md); Photographer = prompts and presets; Stylist = garment fixed; MUA/Hair = prompt line; Retoucher = our refinement tool; Editor = ALL_POSTS_READY; Content strategist = SOCIAL_MEDIA_EXPERT, INSTAGRAM_GUIDE; Social manager = ALL_POSTS_READY, CAPTION_AND_HASHTAG_SETS. **Post 1 full reasoning:** [EXAMPLE_POST_1.md](EXAMPLE_POST_1.md). **No gaps:** [NO_GAPS_CHECKLIST.md](NO_GAPS_CHECKLIST.md). Customer and empathy: section in [JUNE_EMBER_BRAND.md](JUNE_EMBER_BRAND.md).g. new LLM step), update this table and the summary.
