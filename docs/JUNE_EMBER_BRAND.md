# June & Ember — Brand & Visual System

**Company:** June and Ember LLC  
**Brand name:** June & Ember  
**Website:** junenember.com  

*Use this as the single reference for the June & Ember Instagram visual system. Locked to the mood board (elegant, feminine, aspirational; warm neutrals + jewel accents; resort/luxe settings).*

---

## Mood Board Summary (Visual Foundation)

The June & Ember mood board sets the visual foundation: **elegant, feminine, aspirational** — like a curated scrapbook with a warm, luxurious base.

- **Base:** Textured warm neutrals (beige, light brown, soft pinks), gold accents, pearl/ribbon touches. Feels inviting and elevated.
- **Product:** Dresses as hero — mini to maxi, form-fitting silhouettes, feminine details (deep V, halter, one-shoulder, wrap, ruching, slits). Silky/satin, knit, denim. Jewel tones (burgundy, magenta, teal, shimmery purple) and crisp white, denim blue, olive, warm brown.
- **Settings:** Light architecture, archways, stone, greenery; Mediterranean/resort feel. Elegant interiors (e.g. ornate gold, clean bedroom). Well-lit, clean, aspirational — no cluttered or overly casual.
- **Posing & vibe:** Confident, graceful, natural. Approachable but polished. Minimalist jewelry, small chic bags, straw hats with earthy looks; wine/cocktail for occasion. Content should feel **luxurious yet approachable**.

---

## Inspiration Accounts (What We’re Pulling From)

| Handle | What they’re known for |
|--------|------------------------|
| **shoplane201** | *(Add a line if you want: e.g. clean feed, minimal product.)* |
| **Vici** | Trend-forward, effortless chic, blogger-style styling, feminine + edgy; matching sets, occasion-based; aspirational but wearable. |
| **amoris.la** | *(Add a line if you want.)* |
| **astee_official** | LA aesthetics, sleek semi-formal, clean lines, accessible luxury; dresses for dinners to black-tie. |
| **babyboofashion** | Romantic, figure-enhancing silhouettes, mini dresses, modern tailoring; casual to semi-formal; strong collections. |
| **talbotsofficial** | Timeless elegance, subtle glamour, sophisticated draping; evening and occasion; “know where to stop.” |
| **hutch_design** | *(Add a line if you want.)* |
| **ohpolly** | Bold, aspirational occasion wear; vibrant dresses; “Always Iconic”; confidence and statement pieces. |
| **enme_me** | *(Add a line if you want.)* |
| **twosistersthelabel** | Timeless, whimsical, beautiful occasion wear; accessible price, quality fabrics; “feel beautiful and powerful.” |
| **outcastclothing** | Trendy, party, bold statement pieces; nightlife and occasions; edgy, confident tone. |

**Combined direction:** Occasion-focused women’s fashion; mix of **effortless chic** and **refined elegance**; trend-aware but cohesive; **accessible luxury**; strong, Instagram-ready visuals. Start with the mood board, then refine.

---

## Mood in 3 Words

*From mood board: elegant, feminine, aspirational.*

- **Elegant** · **Feminine** · **Aspirational**

*Your tweak (optional):* _________________________________

---

## Primary Lighting

- **Soft, flattering, warm** — Natural light preferred; bright but diffused (e.g. by architecture, greenery, or window). Golden-hour warmth or clean daylight. No harsh midday or cold blue hour. Settings feel **well-lit, clean, and elevated** (resort / Mediterranean / elegant interior). Keep lighting consistent across the feed.

*Your tweak (optional):* _________________________________

---

## Color Palette (From Mood Board)

**Base (backgrounds, props, “glue”):** Warm neutrals and soft metallics so the feed feels cohesive.

| Role | Direction | Hex (fill in when you lock it) |
|------|-----------|--------------------------------|
| Base 1 | Warm beige / sand | # |
| Base 2 | Light brown / tan | # |
| Base 3 | Soft pink (muted) | # |
| Accent | Gold (chains, hardware, warmth) | # |
| Neutral | Off-white / warm white | # |

**Product & styling:** Jewel tones and classic neutrals pop on this base — deep burgundy/maroon, magenta/fuchsia, teal/cobalt blue, shimmery purple; crisp white, light denim blue, olive green, warm brown. Use these for garments and accents so the feed stays recognizable.

*Your tweak (optional):* _________________________________

---

## Content Pillars & Rotation

1. **Product hero** — Clean or soft warm-background dress shot (store + feed); product centered.
2. **Lifestyle** — Dress in aspirational context: light architecture, archways, greenery, or elegant interior; confident, graceful pose.
3. **Flat-lay / detail** — Fabric, texture, or curated flat-lay (warm neutrals, minimal props) for grid rhythm.
4. **Occasion / styling** — “How to wear” or event-ready look; optional subtle accessories (minimal jewelry, small bag, straw hat with earthy looks).

**Face vs. no-face (expert rule):** First image in a post/carousel = **with face** (hero, connection). Second image onward = **no face** (detail, focus on garment). Single image = with face. The tool applies this automatically for `--style=juneember`. See [SOCIAL_MEDIA_EXPERT.md](SOCIAL_MEDIA_EXPERT.md).

**Settings to use:** Mediterranean/resort feel (stone, arches, plants), elegant interiors (clean, soft light, optional gold accents), or simple elevated neutrals. **Avoid:** cluttered backgrounds, overly casual or cold environments.

**Grid pattern (starter):** Product → Lifestyle → Product (or Hero with face → Detail no face). Keep a repeating rhythm.

*Your tweak (optional):* _________________________________

---

## Technical (Instagram)

- **Aspect ratio:** **4:5** (1080 × 1350 px) for feed.
- **Safe zone:** Key subject (product, face) in the **center 70%**; avoid important detail in top/bottom 15% and far edges (profile grid crops to 3:4).
- **Width:** 1080 px.

---

## Edit Style

- **Warm, soft, slightly lifted** — Warmth +10–15, shadows lifted, soft contrast. Muted beige/brown/gold undertones so the feed feels like the mood board. No cold blues or harsh contrast unless it’s a deliberate one-off.
- *Optional:* One filter or preset name (e.g. VSCO, Lightroom) once you lock it: _________________

*Your tweak (optional):* _________________________________

---

## Tool Defaults (This App)

Use these so every generated image matches the **mood board** (elegant, feminine, aspirational; warm base + jewel-friendly):

| Setting | Value |
|---------|--------|
| **Default style** | `juneember` |
| **Default aspect** | `4:5` |
| **Custom prompt addition** | *“Elegant, feminine, aspirational. Soft flattering light, warm neutrals and soft tones; resort or elegant interior feel. Product as hero, center frame. June & Ember aesthetic.”* |

**CLI examples:**
```bash
# First image, June & Ember mood-board style, 4:5
npm run refine -- instagram <productId> --style=juneember

# All images, same style, custom output folder
npm run refine -- instagram <productId> --all --style=juneember --output=./june-ember-posts
```

**Custom prompt in code:** When calling `refineProductForInstagram`, use `style: "juneember"` or pass the custom prompt above so outputs stay on-brand.

---

## Do Not

- **Change the product’s color** — Refined images must keep the garment’s exact color, pattern, and fabric. Only background/lighting/setting may change.
- Mix lighting (e.g. cold and warm in the same 9-post block).
- Use cluttered, overly casual, or cold/clinical backgrounds.
- Put key subject (product, face) at the very edges — keep in center safe zone.
- Use random accent colors; stick to warm neutrals + jewel/classic palette from the mood board.
- Overpower the dress with busy props or heavy accessories (keep jewelry and props minimal and elegant).
- Post without checking how the tile looks next to the last 2–3 posts.

*Your add (optional):* _________________________________

---

## Mood Board Reference

*Mood board is on file; it defines elegant feminine aspirational look, warm beige/brown/gold base, jewel tones on product, resort/elegant settings, confident natural poses, minimalist accessories. Use `--style=juneember` so generated images align.* 

---

## Quick Reference

- **Strategy & posting:** [INSTAGRAM_GUIDE.md](INSTAGRAM_GUIDE.md)
- **Visual system deep-dive:** [VISUAL_SYSTEM.md](VISUAL_SYSTEM.md)
- **One-pager template (blank):** [VISUAL_SYSTEM_TEMPLATE.md](VISUAL_SYSTEM_TEMPLATE.md)

*Update this file whenever you lock in a change (e.g. hex codes, filter name, or “do not” rules) so the tool and team stay aligned.*
