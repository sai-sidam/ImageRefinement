# Brief to post: full pipeline and all roles

**Primary intention:** Build June & Ember's **Instagram presence** as a social media platform for the brand. Everything in this project — pipeline, director's view, variants, naming, prompts, reference workflow — is a **subpart of that process**. The outcome we're working toward is a strong, consistent Instagram for June & Ember.

**What went wrong before:** We treated "director, photographer, social manager" as the only three roles. The real pipeline involves more roles; this doc lists them (from research) and shows how we map to them.

---

## All roles in the pipeline (researched)

Below are the roles that appear in fashion/photography production and content pipelines. They are grouped by **phase**. Not every project has every role (e.g. small teams combine roles), but this is the full set.

### Pre-production

| Role | What they consider | What they produce |
|------|--------------------|-------------------|
| **Producer** | Budget, schedule, contracts; location scouting; model casting; wardrobe/prop sourcing; liaison between client, photographer, and crew; keeping shoot on time and on budget. | Shoot plan, call sheets, booked talent and locations, agreed deliverables. |
| **Creative Director** | Campaign objectives, brand positioning, story and concept, target audience, mood and tone, message. The "why" and "what." | Creative brief, overall vision, sign-off on concept. |
| **Art Director** | Set/environment, styling direction, color palette, references and mood board, shot list/storyboard; visual consistency with brand. The "how it looks." | Mood board, shot list, visual direction for the team. |
| **Stylist** (pre) | Which pieces to shoot, outfit order, accessories, how looks align with story and brand. | Wardrobe list, outfit breakdown per shot, prep (steam, etc.). |
| **Casting** | Model choice: fit for brand, posing ability, look that supports the story. | Booked model(s). |
| **Location scout / Set decorator** (pre) | Locations that match the brief; props and set elements that support the story. | Selected location(s), prop list, set plan. |

### Production (on shoot)

| Role | What they consider | What they produce |
|------|--------------------|-------------------|
| **Photographer** | Composition, camera angle, lens, lighting execution, shot list delivery, technical quality, model direction. | Captured images (raw/selected). |
| **Photo assistant** | Lighting setup, equipment, tethered capture, BTS tech support. | Supported capture, BTS material. |
| **Stylist** (on set) | Fit, drape, accessories on the day; adjustments between shots. | Styled looks in frame. |
| **Makeup artist (MUA)** | Makeup that fits concept and lighting; touch-ups; consistency across shots. | Makeup on model. |
| **Hair stylist** | Hair that fits concept, MUA, and clothing; changes between looks. | Hair on model. |
| **Set decorator** (on set) | Props, furniture, set dressing to match art direction. | Dressed set. |
| **Model** | Pose, expression, movement; interpreting direction. | Performance in frame. |
| **BTS content creator** | Behind-the-scenes footage and stills for social and marketing. | BTS assets. |
| **Brand representative / Client** | That the shoot meets brand objectives and approves direction. | Sign-off, feedback. |

### Post-production

| Role | What they consider | What they produce |
|------|--------------------|-------------------|
| **Retoucher / Post-production** | Color and tone, skin/clothing refinement, cleanup, compositing if needed; polish while keeping image natural and on-brief. | Final retouched image(s). |
| **Editor / Post-production director** | Which selects to retouch, consistency across selects, alignment with creative vision. | Final selects, brief for retoucher. |

### Distribution and strategy

| Role | What they consider | What they produce |
|------|--------------------|-------------------|
| **Content strategist / Content lead** | Content pillars, calendar, mix of formats (feed, Reels, Stories); how each asset fits the strategy; performance and iteration. | Content strategy, calendar, briefs for social. |
| **Social media manager** | Platform specs, caption, hashtags, timing, grid, engagement, scheduling. | Published posts, community management, performance. |

---

## How the phases connect (flow)

```
Pre-production:
  Producer, Creative Director, Art Director, Stylist (pre), Casting, Location/Set (pre)
       → Creative brief, mood board, shot list, talent & location locked

Production:
  Photographer, Photo Assistant, Stylist (on set), MUA, Hair, Set Decorator, Model, BTS, Brand
       → Captured images (+ BTS assets)

Post-production:
  Editor, Retoucher
       → Final image(s) ready for distribution

Distribution:
  Content Strategist, Social Media Manager
       → Published post + performance
```

Your inputs (e.g. story, set, message) feed **pre-production** (Creative Director + Art Director). The **photographer** executes in production. The **social media manager** executes in distribution. But **Producer, Stylist, MUA, Hair, Set Decorator, Retoucher, Content Strategist**, and others are also part of the real pipeline; we don’t ignore them.

---

## How we map to this (our tool and docs)

We don’t have a physical shoot or a full crew. We do have: **your inputs** (story, set, message, reference) and a **refinement tool** that produces images and a **post plan** (captions, hashtags). So we map the **concerns** of the full pipeline onto what we can control:

| Phase | Roles in the real pipeline | How we cover their concerns |
|-------|----------------------------|------------------------------|
| **Pre-production** | Producer, Creative Director, Art Director, Stylist (pre), Casting, Location/Set | **Creative Director + Art Director:** [DIRECTORS_VIEW](DIRECTORS_VIEW.md) — story, set, mood, references, shot list. Your inputs go here. We don’t have a separate Producer (no physical logistics); we don’t cast (we use product images and prompt for “model” look). Styling = “keep garment, improve scene”; set = in the brief. |
| **Production** | Photographer, Stylist on set, MUA, Hair, Set, Model, BTS, Brand | **Photographer:** composition, lighting, pose, quality are in our prompts and presets. **Stylist:** garment fixed; we don’t change clothes. **MUA/Hair:** we prompt for “natural” or “glam” look (e.g. natural-model prompt). **Set:** described in brief. **Model:** we don’t cast; we direct via prompt (pose, expression). BTS/Brand = out of scope for the tool. |
| **Post-production** | Editor, Retoucher | **Retoucher:** our tool *is* a form of refinement (we “refine” the product image — lighting, background, pose). We don’t have a separate retouch step; the model output is the final image. Editor = we choose variants and which file to use (ALL_POSTS_READY). |
| **Distribution** | Content Strategist, Social Media Manager | **Content Strategist:** [SOCIAL_MEDIA_EXPERT](SOCIAL_MEDIA_EXPERT.md), [INSTAGRAM_GUIDE](INSTAGRAM_GUIDE.md) — pillars, calendar, mix. **Social Media Manager:** [ALL_POSTS_READY](../instagram-output/ALL_POSTS_READY.md), [CAPTION_AND_HASHTAG_SETS](CAPTION_AND_HASHTAG_SETS.md) — caption, hashtags, timing, grid. |

So: **Director, Photographer, and Social Media Manager** are three roles you named; they sit inside a **larger set of roles**. We don’t only optimize for those three — we align with the **full pipeline** and make explicit which roles’ concerns we encode (brief, prompt, refinement, caption/calendar) and which we don’t (e.g. Producer logistics, physical MUA/hair, BTS).

---

## What to do when you give inputs

- Your inputs (story, set, message, reference) are **Creative Director + Art Director** inputs. We combine them with everything else those roles consider (and with Photographer, Stylist, MUA/Hair, Set, Retouch where we can) so the outcome matches a **full pipeline** mindset, not only three job titles.
- If you want a role we’re not yet encoding (e.g. “think like a Producer” or “what would the Retoucher do?”), we can add a short section or checklist for that role and fold it into the brief or the prompt.
- The intention: **due diligence on the full pipeline, then map you and us onto it** — not to do only what you said, but to satisfy what you meant (complete, professional flow with all relevant roles considered).
- **Post 1 full reasoning (one-time doc):** [POST_1_COMPLETE_REASONING.md](POST_1_COMPLETE_REASONING.md) spells out every role's decision for Post 1. We **apply** that same reasoning to Post 2+ (brief, prompts, bar) but do **not** write a new reasoning doc per post.
- **No gaps:** Before locking any post or strategy, run [NO_GAPS_CHECKLIST.md](NO_GAPS_CHECKLIST.md). Customer and empathy angle: [CUSTOMER_AND_EMPATHY_ANGLE.md](CUSTOMER_AND_EMPATHY_ANGLE.md).
