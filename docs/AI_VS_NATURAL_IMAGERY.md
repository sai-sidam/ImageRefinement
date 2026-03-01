# AI-like vs natural imagery: what to avoid and what to ask for

Use this when writing or tuning prompts so generated images feel like **real photography**, not obviously AI. The tool refines real product photos; the output should keep a natural, lived-in look.

---

## Why some AI images feel “off”

Research and practice point to:

1. **Too perfect** — Over-smooth skin, flawless symmetry, no pores or micro-detail. Viewers read this as “synthetic” even when there are no clear glitches.
2. **Flat or generic lighting** — Even, diffuse light with no clear direction or depth. Real photos usually have a main light source, fill, and soft but visible shadows.
3. **Disconnected from the scene** — Skin and hair don’t react to the same light as the background; shadows and color temperature don’t match the environment.
4. **Over-corrected color** — Neutral, “balanced” color can look sterile. Real shots often have a slight warmth or coolness that ties the scene together.
5. **Plastic / airbrushed look** — Lack of subtle texture (skin, fabric, walls). AI tends to smooth everything toward a uniform, glossy finish.

---

## What tends to feel **natural**

| Element | Prefer | Avoid |
|--------|--------|--------|
| **Lighting** | One clear direction (e.g. window, sun), soft but visible shadows, slight falloff | Flat, even light everywhere; no shadow direction |
| **Skin** | Natural texture, subtle variation, pores and micro-detail | Perfectly smooth, plastic, or airbrushed |
| **Color** | Slight warmth or coolness that fits the scene; natural color variation | Over-neutral, “correct” white balance; uniform color everywhere |
| **Shadows** | Soft, directional, consistent with one main light | No shadows; multiple conflicting shadow directions; harsh or fake-looking |
| **Environment** | Subject and background share the same light and color temperature | Subject lit differently from the background; “pasted in” look |
| **Imperfection** | Subtle asymmetry, natural variation, lived-in feel | Perfect symmetry and flawless execution |

---

## Prompt guidance for this tool

When writing or editing prompts (e.g. juneember preset or custom `--prompt`):

- **Do ask for:** “Natural skin texture,” “directional light with soft shadows,” “one main light source,” “subtle warmth” (if on-brand), “lived-in,” “authentic,” “like real photography.”
- **Avoid over-asking for:** “Perfect,” “flawless,” “clean” (use sparingly), “neutral white balance,” “even lighting,” “studio-perfect.” These push the model toward a more AI-like, over-processed look.
- **Warmth vs AI look:** Slightly warm, golden-hour or warm-daylight scenes often feel more natural than aggressively neutral or cool. If an image feels “too warm,” pull back with “slightly warm” or “neutral-to-slightly-warm” rather than “cool” or “fully neutral,” which can make the result look flat and synthetic.
- **Preserve the source:** We start from real product photos. Prompts should say “preserve garment color” and “improve background and lighting” so the model doesn’t replace the whole scene with a generic AI look.

---

- **Clarity first:** Asking for "natural texture" or "do not make perfect" can backfire — the model may reduce sharpness. Prioritize **sharp, clear, high-resolution** and **directional lighting**; avoid instructions that suggest lowering quality.

## Applied to June & Ember

- **Original juneember** (“soft flattering natural light, warm neutral setting”) often produced a **warmer** image that felt more natural but sometimes too warm.
- **Cooler one-off prompt** (“neutral-to-slightly-warm balance; avoid golden or amber cast”) reduced warmth but in our test made the image feel **more AI-like** (flatter, more “perfect,” less like a real photo).
- **Takeaway:** Prefer **subtle warmth** and **directional natural light** over maximum neutrality. Tweak with phrases like “soft natural light with a gentle warmth” or “slightly warm, not overly golden” rather than “neutral” or “no warm cast” when aiming for a natural feel.

---

## References (summary)

- Studies on AI image perception: “too perfect” and uncanny even without obvious errors; detection harder with newer models.
- Realism cues: directional lighting, micro-texture (skin, fabric), natural asymmetry, shadows that match the environment.
- Fashion/photo tools that aim for “natural” often stress: preserve skin texture, directional light, avoid over-smoothing.

*Use this doc when updating style presets or adding new prompts so the feed stays natural and on-brand.*
