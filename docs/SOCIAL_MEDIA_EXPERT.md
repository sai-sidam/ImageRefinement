# Social Media Expert Playbook — Everything, No Asking

This doc is the **single expert source** for every decision: content mix, formats, face vs no-face, captions, hashtags, schedule, Reels, Stories, grid, calendar, and tool behavior. Follow it; don’t ask “what should I do?” — the rules are below.

---

## 0. First Instagram Post (Account Launch)

**Before you post:** Profile is Business/Creator. Bio has brand name, one line (who you are / what you offer), and link (e.g. junenember.com). No need to wait for followers — post first, then grow.

**What the first post is:**
- **Format:** **Carousel.** Slide 1 = hero with face; slides 2–3 = same garment, detail (no face). Same as every other post — we do carousels by default.
- **Slide 1:** Hero shot — **with face**, on-model, confident. Use an image from this tool with `--style=juneember` (e.g. your best-selling or signature piece). 4:5, warm, elegant, product as hero.
- **Slides 2–3:** Same dress, detail (back, fabric, neckline); no face. Generate with `--from-image` and `--pose=back` / `--pose=side` from the approved slide 1.
- **Caption:** Short intro. Hook line (who you are or what this is) + one sentence why you’re here + one CTA. Example: *“June & Ember is here — elegant, effortless pieces for the moments that matter. So glad you’re here. Tap the link to shop.”* No long essay; save “our story” for a later post or carousel.
- **Hashtags:** Use your main set (25–30). Include #junenember or your brand tag so it’s findable from day one.
- **When:** Post in your chosen window (e.g. Tue–Thu 10 AM–1 PM or 6–8 PM). Then stay consistent from there.

**First 9 posts (grid):** Plan so your first 3×3 looks intentional. Suggested mix: **Every feed post = carousel** (slide 1 hero with face, then detail). Suggested mix: 1 intro carousel, 2–3 more product carousels (hero + detail), 1 “why we started” or brand moment carousel if you want. All same visual system (juneember style, 4:5, warm). Schedule over 1–2 weeks or batch — consistency after that matters more than speed.

**Rule:** First post = carousel (hero then detail), short intro caption, one CTA, full hashtag set. Then every post follows the same carousel playbook.

---

## 1. Face vs. No-Face

- **First image in a post or carousel:** Hero — **with face**. On-model, natural confident expression, full or 3/4 frame.
- **Second image onward:** Detail — **no face**. Crop at shoulders or garment only; focus on outfit and fabric.
- **Single image post:** Hero — **with face**.
- **Grid over 9–12 posts:** ~60% hero (with face) / ~40% detail (no face). Use checkerboard or rows.

The tool applies this automatically for `juneember`: image 1 = hero, image 2+ = detail.

---

## 2. Content Pillars & Ratios (What to Post)

| Pillar | Share of content | What it is |
|--------|------------------|------------|
| **Product / commerce** | ~60% | Shoppable feed posts, Reels, hero + detail carousels from this tool. |
| **Community & social proof** | ~20% | UGC, testimonials, BTS, customer features. |
| **Brand story & authority** | ~15% | Founder, values, how it’s made, brand voice. |
| **Promo / sale / urgency** | ~5% | Sales, drops, limited offers. |

Stick to this mix. Don’t flip to 80% promo; keep product and community dominant.

---

## 2b. Post types (what the SMM chooses)

These are the **visual/content types** the SMM can plan and publish. Pick one (or a sequence for carousels) per post.

| Post type | What it is | Example | Face | Tool / source |
|-----------|------------|---------|------|----------------|
| **Lifestyle (on-model)** | Woman wearing our product in an aspirational setting — full environment, story, same light (Director's Scene). Confident pose, natural expression. | "Woman in our dress in a resort corridor, soft light, archway." | **Yes** (hero) | This tool: `instagram … --scene=directors`, director's brief + prompt. |
| **Hero (on-model, with face)** | Single strong shot: model in our garment, full or 3/4, face visible. Can be lifestyle (in a set) or cleaner background. | "Front-facing hero in backless maxi dress, warm interior." | **Yes** | This tool: post-NN prompt + product image. |
| **Detail (no face)** | Same garment, crop at shoulders or garment only; focus on fabric, back, neckline, silhouette. | "Back of dress, criss-cross detail; same room as slide 1." | **No** | This tool: `--from-image … --pose=back --detail` or `--pose=side`. |
| **Director's-scene carousel** | Slide 1 = hero (with face) in a full set; slides 2–3 = same scene, same dress, back/side pose only. One approved image = "scene lock." | "Lobby shot → slide 2 back, slide 3 side, same room." | Slide 1 **yes**, 2+ **no** | This tool: approve slide 1, then `--from-image … --pose=back` or `--pose=side`. |
| **Product hero (soft background)** | Dress as hero, centered; soft or warm background (not full lifestyle set). Good for store + feed. | "Dress on model, soft neutral background, product centered." | **Yes** (or no for catalog feel) | This tool with simpler prompt; or catalog asset. |
| **Flat-lay** | Garment or accessories arranged on a surface (bed, floor, table). Fabric, texture, color; minimal props, warm neutrals. | "Dress laid out with minimal jewelry, warm beige background." | **No** | Styled photo or future tool support. |
| **Ghost mannequin / invisible mannequin** | Product only, no model — dress on form or "floating" so fit/silhouette is clear. Classic e‑comm catalog. | "Dress on mannequin, white or neutral, clean for PDP." | **No** | Catalog/studio asset; not produced by this tool today. |
| **UGC-style / "as seen on"** | Customer or influencer wearing our product; reposted or recreated. Feels authentic, social proof. | "Customer photo in our dress at a wedding; we repost with credit." | Depends | UGC repost or influencer content. |
| **BTS / brand moment** | Behind-the-scenes, founder, or "why we started." Humanizes the brand; ~15% of mix. | "Founder in the studio" or "How we shot this." | Optional | Photo/video, not from product image tool. |
| **Same dress, multiple locations (carousel)** | One dress, multiple slides: different models and/or different locations per slide. Carousel of 5 (or 3–7) — "same dress, five ways" or "same dress in five places." | "Carousel of 5: same maxi dress on 5 different models in 5 different locations (resort, lobby, terrace, bedroom, garden)." | **Yes** per slide (each has a model) | This tool: generate one image per slide with same product, different brief/location; or styled shoot / future multi-slide workflow. |
| **Two models, two products (carousel)** | Carousel: slide 1 = one image with two people, each wearing a different June & Ember product ("two friends in our looks"). Following slides = each dress on its own (hero or detail per dress). | "Slide 1: two models in one frame (dress A + dress B). Slide 2: dress A hero. Slide 3: dress B hero. Slide 4–5: detail of each." | **Yes** (slide 1 both; later slides per dress) | Slide 1 = styled shoot or future tool (multi-figure); slides 2+ = this tool or catalog per product. |

**SMM decides:** For each slot in the calendar, which of these types to use. **Default format = carousel** (slide 1 hero with face, then detail). Use single image only when there is a stated exception. Brief the Director for lifestyle/hero/detail; use catalog/UGC for the rest. Never open a carousel with headless or flat-lay only — hero first, then detail.

---

## 3. Format Mix (Feed vs Reels vs Stories)

| Format | Per week | Purpose |
|--------|----------|---------|
| **Feed posts** | 3–5 | **Carousels** (default). Slide 1 hero + face, then detail; consistency and shoppability. |
| **Reels** | 3–7 | Reach and discovery; prioritize these for growth. |
| **Stories** | 1–3 per day (7–21/week) | Daily touch, polls, BTS, links. |

**All feed posts = carousels.** Carousels get strong engagement (~0.55%) and match what audiences expect on Instagram. Slide 1 = hero with face; slides 2+ = detail (no face). Use single image only when there is a stated exception. Reels get more reach; use for hooks and discovery.

---

## 4. Posting Schedule (When to Post)

- **Best days (general):** Tue–Thu for feed; Wed, Fri, Sat for Reels. Weekend 10–12 for relaxed browsing.
- **Best times (general):** 10 AM–1 PM and 6–8 PM local. Fashion/e‑comm often peaks 12 PM and 8 PM Wed/Fri/Sat.
- **Rule:** Post at the **same windows** each week. Consistency beats perfect timing; algorithms reward predictable posting.
- **Use Instagram Insights** to see when your audience is active and adjust once a month.

**Weekly template (default):**
- Mon: Reel (trending audio / hook).
- Tue: Feed **carousel** (hero + detail).
- Wed: Feed carousel or Reel (educational / styling).
- Thu: Feed **carousel** (product hero + detail).
- Fri: Reel or entertaining feed carousel.
- Sat: Feed carousel or Reel.
- Sun: Lighter feed carousel or Story-heavy.
- Stories: 1–3 every day.

Batch create weekly; schedule in advance.

---

## 5. Carousel Order (Every Time)

1. **Slide 1:** On-model hero — **with face**, confident pose.
2. **Slides 2–3:** Same garment, detail — **no face**; fabric, back, close-up.
3. **Optional:** Flat-lay or “one piece, three ways.”
4. **Last:** CTA or product name if needed.

Never open a carousel with headless or flat-lay only. Hero first, then detail.

---

## 6. Grid Pattern

- **Checkerboard:** Hero ↔ Detail or Product ↔ Lifestyle. Alternating.
- **Rows:** One row heroes, next row details.
- **Columns:** One column product-only, one on-model.

Pick one and keep it for 9–12 posts. Plan in 3×3 blocks so the grid always looks intentional.

---

## 7. Captions (Structure Every Time)

- **Hook (first line, ~125 chars):** Stop the scroll. Use a question, bold claim, or direct call-out. Include a **keyword** for search.
- **Body:** Short paragraphs. Story, tip, or why this piece matters. 300+ chars often gets more comments when it’s genuine.
- **CTA (one per post):** One clear action. “Tap the link to shop,” “Save this for your next event,” “Which color would you choose?”
- **Hashtags:** 25–30 at the end (or first comment). See section 8.

Tone: match your brand (June & Ember = elegant, approachable, confident). No wall of text; use line breaks.

---

## 8. Hashtags (Set and Rotate)

- **Total:** 25–30 per post.
- **Mix:** 2–3 high (100M+), 3–4 medium (10M–100M), rest niche/low. Example high: #fashion #ootd #style #womensfashion. Medium: #fashionblogger #fashionstyle #womenswear. Niche: #occasionwear #dresslovers #junenember (brand).
- **Rotation:** Use 2–3 different sets and rotate every 5–7 posts to avoid fatigue.
- **Placement:** Caption or first comment; algorithm treats both the same.

Save sets in a doc (e.g. “Set A: product launch,” “Set B: lifestyle,” “Set C: sale”) and paste. Don’t invent new sets every post.

---

## 9. Reels (Rules)

- **First 3 seconds:** Hook only. Visual or spoken. 50% of viewers leave by 3 seconds; hook must stop the scroll. Aim for 60%+ hold rate past 3 seconds.
- **Length:** 30–90 seconds for fashion. Hook in under 1 second, then content.
- **Hook types that work:** Question (“Ever wonder why this styling trick works?”), problem–solution (“You’re styling this wrong. Here’s what works.”), tease/reveal (transformation), direct promise (“This outfit trick takes 20 seconds”).
- **Write hook first,** then build the Reel. Same visual style as feed (lighting, color) so it’s on-brand.
- **Frequency:** 3–7 per week. Prioritize for reach.

---

## 10. Stories (Rules)

- **Frequency:** 1–3 per day minimum. Up to 5 for active accounts.
- **Use:** BTS, polls (“Which color?”), Q&A, swipe-up/link, drop announcements, UGC reposts (with permission).
- **Design:** Brand colors and clean type. Polls and CTAs in lower half for thumb reach. Consistent look with feed.
- **Polls:** 2–4 options max. Product votes, style choices, “Yes/No” for engagement.

Stories don’t need to be perfect; they need to be consistent and interactive.

---

## 11. Content Calendar (How to Plan)

- **Plan 9–12 feed posts ahead** so the grid pattern holds.
- **Batch weekly:** One session to create/schedule feed + Reels + caption drafts.
- **Track per post:** Format (Reel/Carousel/Single), pillar (product/community/brand/promo), caption status, hashtag set, date/time.
- **Review monthly:** Which pillar and format performed best; adjust next month’s mix slightly. Don’t guess — use Insights.

Use a spreadsheet or scheduler. Columns: Date | Format | Pillar | Caption hook | Hashtag set | Status.

---

## 12. Promo & Sales (How Much, When)

- **Share of content:** ~5% of posts. No more than 1 in 10 posts as hard promo.
- **When:** Align to real sales (e.g. Black Friday, end of season). Tease in Stories 1–2 days before; one clear CTA in caption.
- **Rest of the time:** Product and community content. Promo is the exception, not the default.

---

## 13. UGC & Community

- **Use:** Repost customer photos (with permission). Feature in feed or Stories. Tag and thank.
- **Ask:** “Tag us for a chance to be featured.” One branded hashtag (e.g. #junenemberstyle) to collect.
- **Ratio:** Part of the 20% community pillar. Mix with BTS and testimonials.

---

## 14. What the Tool Does (Expert Defaults)

| Output | Rule |
|--------|------|
| **Image 1 (hero)** | With face, natural confident expression, full or 3/4 frame. |
| **Image 2+ (detail)** | No face, crop at shoulders or garment only. |
| **Color** | Never change garment color/pattern/fabric. Only background and lighting. |
| **Aspect ratio** | 4:5 (1080×1350) for feed. |
| **Style (juneember)** | Warm, elegant, aspirational; resort or elegant interior; product as hero. |

Use `--style=juneember` for June & Ember. Use `--all` for carousels (hero + detail automatically).

---

## 15. Master Quick Reference

| Topic | Do this |
|-------|--------|
| First image | Hero, **with face**. |
| Second image onward | Detail, **no face**. |
| Single image | Hero, **with face**. |
| Carousel order | Hero → Detail → flat-lay/CTA. |
| Content mix | ~60% product, ~20% community, ~15% brand, ~5% promo. |
| Feed posts/week | 3–5. |
| Reels/week | 3–7. |
| Stories/day | 1–3. |
| Caption | Hook (125 chars) + body + one CTA + hashtags. |
| Hashtags | 25–30, high/medium/niche mix, rotate sets. |
| Reels hook | First 3 seconds; write hook first. |
| Grid | One pattern (checkerboard/rows/columns), 9–12 posts. |
| Calendar | Plan 9–12 ahead; batch weekly; review monthly. |
| Promo | ~5%; align to real sales; tease in Stories. |

---

## 16. A/B testing (best practices)

Systematically test content to optimize engagement and reach. Rotating hashtag sets (see §8) is one form; extend to:

- **Content types:** Test different post types (e.g. Director's-scene carousel vs same-dress-multiple-locations) and measure saves, shares, and sends.
- **Caption hooks:** Test two hook lines for the same visual; keep one variable, compare performance.
- **Visual style:** Test different lighting or set families (e.g. indoor vs golden-hour) and compare engagement.

Define one variable per test; run for a set period or until a clear winner; document what worked and fold into the playbook. Use Instagram Insights and any link/shop metrics to decide.

---

## 17. Localization and cultural sensitivity (future)

If the brand expands into other markets, SMM and Director should research and incorporate culturally appropriate stories, sets, and model presentation. Avoid assumptions that work only in one region; when in doubt, ask or defer to local expertise.

---

## 18. Research & multi-perspective insights

Industry research from several angles: brand maintenance, success stories, business metrics, early-stage goals, inspiration brands, platform algorithm, occasion-wear niche, customer journey, and mistakes to avoid. Use to inform SMM decisions, RAG retrieval, and goal-setting.

**Brand perspective:** Move from "post and hope" to distribution and relationship platform. Content pillars: episodic series, Reels (~22% more interaction), broadcast channels (90%+ open rates). Messaging: connection (BTS, founder), thought reversal, value (styling tips), social proof. Shopping: shoppable posts, 130M+ tap shopping posts monthly.

**Success stories:** Oh Polly (eBay to £113M, 9M+ followers): micro-influencer imagery from day one, UGC, TikTok. Common tactics: high-quality product visuals + UGC, micro-influencers (5K–20K), consistent storytelling, Instagram Ads + retargeting (3–9x ROAS).

**Business/KPIs:** Track new vs repeat customer; first-party attribution critical; ROAS by segment (Advantage+ can underperform above ~$50 AOV). Funnel: capture (~40%), converse (~30%), convert & retain. ~72% discover fashion via creators; ~71% Gen Z buy from social.

**Early-stage:** Community over numbers; 100 followers who care > 10K who don't. Profile = shop window; niche clearly defined. Carousels drive saves/shares; Reels for reach; shares > likes. 20–30 posts to establish; 3–5 posts/week. Avoid: buying followers, follow-for-follow, automation.

**Inspiration brands (occasion-wear):** Oh Polly, Phase Eight, Azazie, Showpo — shoppable feeds, UGC, influencer models, seasonal occasion themes, "as seen on" roundups.

**Algorithm (2024–2025):** Separate algorithms per surface (Feed, Reels, Stories, Explore, Search). Top factors: watch time (past first 3s), likes per reach, sends per reach (shares via DM). Reels/Explore = entertainment, discovery; Feed = mix of interaction + suggested; no watermarks, has audio, under 3 min, original.

**Customer journey:** Awareness (Reels, Explore) → consideration (carousels, Stories, UGC) → purchase (shoppable, product tags). Content by stage: 40% discovery, 30% engagement, rest conversion/loyalty.

**Mistakes to avoid:** No strategy, inconsistent posting, promo overload (80/20 rule), algorithm ignorance, private account, poor production planning, ignoring seasonality.

**Summary for June & Ember:** Build community and trust first; clear niche (occasion wear); 20–30 posts to establish; content mix per this playbook; Reels for algorithm; track new vs repeat; avoid no strategy, inconsistency, 80% promo. *Sources: industry articles and case studies (BitBranding, Shopify, Skedsocial, Later, and others).*

---

*Sources: Dreamshot, WearView, PixUp AI, FASHN, PostQuickAI, Quso, PostPlanify, BitBranding, InfluenceFlow, QuickCreator, Sked Social, Coschedule, SocialBee, InstaBaba, Yarnit, Postly, Listing Forge, Zeely, PostMood AI, AutoShorts, Inro, CreatorsJet, Billo, Marq, Blogging Wizard, Zigpoll, Mojo, Social Rails, RiteTag, The Hope Factory (2024–2026).*
