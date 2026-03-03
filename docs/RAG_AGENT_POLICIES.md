# RAG retrieval policies per agent

Each agent has a **retrieval policy**: which sources they are allowed to read, what is always relevant, and how query-specific retrieval should be shaped. This doc is the source of truth; code in `src/rag/policies.js` mirrors it for filtering.

---

## Social Media Manager (SMM)

**Role:** First and last in the pipeline. Decides post goal, format (**default = carousel**; single only by exception), content mix, caption/hashtags, and what actually gets published.

### Allowed sources (SMM may retrieve from)

| Source | Use for |
|--------|--------|
| `docs/SOCIAL_MEDIA_EXPERT.md` | Content pillars, face vs no-face, format mix, schedule, grid, captions, Reels, Stories. |
| `docs/INSTAGRAM_GUIDE.md` | Strategy, content types, posting frequency, hashtags, captions. |
| `docs/INSTAGRAM_RESEARCH_MULTI_PERSPECTIVE.md` | Industry research: brand maintenance, success stories, early-stage goals, algorithm, occasion-wear, mistakes to avoid. |
| `docs/JUNE_EMBER_BRAND.md` | Brand voice, mood board, inspiration accounts, do-not list. |
| `docs/CUSTOMER_AND_EMPATHY_ANGLE.md` | Who she is, what she wants; empathy angle for every post. |
| `docs/CAPTION_AND_HASHTAG_SETS.md` | Rotating caption hooks and hashtag sets (A/B/C). |
| `docs/VISUAL_SYSTEM.md` | Grid, color, lighting, safe zones. |
| `instagram-output/ALL_POSTS_READY.md` | Per-post plan: which image, caption, hashtags, checklist. |
| `docs/NO_GAPS_CHECKLIST.md` | Pre-ship checklist (customer, empathy, trust, brand, creative, quality). |
| Future: `knowledge/exemplars/` (SMM) | Approved captions and “why it worked” notes. |
| Future: `knowledge/lessons/` | Mistakes and fixes (e.g. “over-promo”, “wrong format”). |

**Not in SMM scope:** Director’s-scene technical standards (set variety, approved-image workflow, pose prompts). Those are Director/Photographer; SMM uses the *output* (brief, final image) not the production rules.

### Always-on intent (every SMM decision)

When building the RAG query for SMM, always bias toward:

- **Content mix:** 60% product, ~20% community, ~15% brand, ~5% promo.
- **Format rules:** Default = carousel (slide 1 hero with face, then detail); single only by exception; face on first slide, no-face on detail; Reels/Stories mix.
- **Early-stage goals:** Community over vanity metrics; profile as shop window; 80/20 value vs promo.
- **Algorithm:** Watch time, saves/shares, sends (DM shares); consistency.

So the **query template** for SMM should include a stable prefix like:  
“June & Ember Social Media Manager: content mix, format rules, caption and hashtag guidance, early-stage goals, algorithm best practices. Then: [task-specific part].”

### Query-specific (per task)

- **Deciding format (default = carousel):** Retrieve “single image vs carousel”, “scene suitability”, “Director’s Scene standard” summary (so SMM knows the pipeline expects carousels), and any lessons from ALL_POSTS_READY about Post 2/3.
- **Writing caption / choosing hashtags:** Retrieve caption sets, brand voice, empathy angle, and the specific post line from ALL_POSTS_READY.
- **Grid / calendar:** Retrieve visual system, content pillars, and posting schedule.
- **What to post this week:** Retrieve ALL_POSTS_READY, content mix, and research on mistakes to avoid.

### Policy config (for code)

- **Agent id:** `smm`
- **Allowed path patterns:**  
  `docs/SOCIAL_MEDIA_EXPERT`, `docs/INSTAGRAM_GUIDE`, `docs/INSTAGRAM_RESEARCH`, `docs/JUNE_EMBER_BRAND`, `docs/CUSTOMER_AND_EMPATHY`, `docs/CAPTION_AND_HASHTAG`, `docs/VISUAL_SYSTEM`, `docs/NO_GAPS`, `instagram-output/ALL_POSTS_READY`, `knowledge/exemplars`, `knowledge/lessons`
- **k:** 8 (SMM needs broader context: mix + caption + research).
- **Query prefix:** “June & Ember Social Media Manager. Content mix, format rules, captions, hashtags, early-stage goals, algorithm. ”

---

## Director (Creative Director / Art Director)

**Role:** Decides story, set, concept, reference, lighting, pose. Produces the director’s brief used by Photographer and downstream.

### Allowed sources (Director may retrieve from)

| Source | Use for |
|--------|--------|
| `docs/DIRECTORS_SCENE_STANDARD.md` | Quality bar, set variety (sets already used), approved-image workflow, single vs carousel scene suitability, detail-shot carousel rules, product back reference. |
| `docs/DIRECTORS_VIEW.md` | Story, set, references, brief template, inspiration accounts, shot list. |
| `docs/JUNE_EMBER_BRAND.md` | Mood, inspiration accounts, brand constraints. |
| `docs/ARCHITECTURE_AND_FLOW.md` | Director-relevant flow (brief → prompt files → image). |
| `instagram-output/prompts/` | Prior successful prompts (exemplars) for similar posts. |
| `instagram-output/ALL_POSTS_READY.md` | Per-post notes (what set was used, what worked). |
| Future: `knowledge/exemplars/` (Director) | Best briefs and “why it worked”. |
| Future: `knowledge/lessons/` | Set/carousel/pose mistakes and fixes. |

**Not in Director scope:** SMM-only docs (caption sets, hashtag rotation, publishing schedule). Director cares about *creative* inputs, not distribution.

### Always-on intent (every Director brief)

- **Director’s-scene quality bar:** Full environment, story, same light; set can differ per post.
- **Set variety:** Do not reuse sets already used (list from DIRECTORS_SCENE_STANDARD).
- **Approved-image workflow:** One image approved first; extra poses = pose-only from that image.
- **Single vs carousel:** Decided before generation; scene must support it if carousel.

So the **query template** for Director should include:  
“June & Ember Creative Director. Director’s scene standard, set variety, approved-image workflow, single vs carousel. Then: [product, post number, format, caption angle].”

### Query-specific (per brief)

- **Carousel post:** Retrieve “single vs carousel”, “detail-shot carousel”, and any Post 2/3 lessons.
- **Detail shot / back pose:** Retrieve “detail-shot carousel”, “product back reference”, and relevant prompt exemplars.
- **New post number:** Retrieve “set variety” and ALL_POSTS_READY lines for previous posts so the new set is distinct.

### Policy config (for code)

- **Agent id:** `director`
- **Allowed path patterns:**  
  `docs/DIRECTORS_SCENE_STANDARD`, `docs/DIRECTORS_VIEW`, `docs/JUNE_EMBER_BRAND`, `docs/ARCHITECTURE`, `instagram-output/prompts`, `instagram-output/ALL_POSTS_READY`, `knowledge/exemplars`, `knowledge/lessons`
- **k:** 6 (current default for brief --rag).
- **Query prefix:** “June & Ember Creative Director. Director’s scene standard, set variety, approved-image workflow, single vs carousel. ”

---

## Summary table

| Agent   | Primary sources | k | Query prefix emphasis |
|---------|------------------|---|------------------------|
| **SMM** | SOCIAL_MEDIA_EXPERT, INSTAGRAM_*, JUNE_EMBER_BRAND, CAPTION_*, ALL_POSTS_READY, research, exemplars, lessons | 8 | Content mix, format, captions, early-stage, algorithm |
| **Director** | DIRECTORS_SCENE_STANDARD, DIRECTORS_VIEW, JUNE_EMBER_BRAND, prompts, ALL_POSTS_READY, exemplars, lessons | 6 | Quality bar, set variety, approved-image, single vs carousel |

---

*When adding a new agent (e.g. QA/Reviewer), add a section here and a corresponding entry in `src/rag/policies.js`.*
