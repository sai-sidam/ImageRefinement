# SMM "plan this post" — handoff to Director

The SMM decides **what** we post (format, post type, product, slide count, face pattern); the Director decides **how** it looks (story, set, moment, concept, lighting, pose). This doc describes the handoff so the Director receives a clear, structured brief.

---

## What SMM outputs (handoff to Director)

For each planned post, SMM should produce a short handoff that includes:

| Field | Example | Note |
|-------|---------|------|
| **Post number** | 3 | Slot in calendar. |
| **Format** | carousel | Or single by exception. |
| **Post type** | Director's-scene carousel | Or same-dress-multiple-locations, flat-lay, etc. See SOCIAL_MEDIA_EXPERT §2b. |
| **Product** | Backless maxi dress (product ID if known) | Which product(s). |
| **Slide count** | 3 | 2, 3, 5, 7, etc. |
| **Face pattern** | Slide 1 with face; slides 2–3 no face | Which slides show face vs no face. |
| **Sets used before (context)** | [lobby, terrace] | So Director has context; not a strict avoid list. |
| **Optional: unique product feature** | e.g. "Highlight the back criss-cross detail" | If the product has a distinctive detail to capture. |
| **Optional: caption angle** | e.g. "Resort afternoon" | To inform story/mood. |

Example one-line handoff:

*"Post 3. Carousel, Director's-scene. Product: backless maxi dress. 3 slides, face on 1, no face on 2–3. Sets used (context only): lobby, terrace. Caption angle: resort afternoon."*

That handoff is the input to the Director (or to the `brief` command). The Director then produces the full creative brief (story, set, moment, concept, lighting, pose, face).

---

## SMM-Director interaction example (Post 3)

**Setup:** Planning the third feed post. Posts 1 and 2 already used: Post 1 = hotel lobby/corridor, Post 2 = outdoor terrace. Product for Post 3 = backless maxi dress. We choose: **carousel**, **Director's-scene** type, **3 slides**, **slide 1 with face, slides 2–3 no face**. Those are SMM choices for this post — not fixed rules.

**Who does what:** **SMM** decides: format (carousel/single), post type (Director's-scene, lifestyle, flat-lay, etc.), product, slide count (2, 3, 5, 7…), face pattern (which slides with/without face), slot in calendar. SMM does **not** decide: story, set, moment, lighting, pose — that's Director. **Director** decides: story (e.g. "Resort afternoon, pre-dinner"), set/environment (e.g. "Moody lounge with piano, warm wood"; set does *not* have to be different — must be creative and bold; "sets already used" from SMM is context only), moment (what she's *doing*), lighting, pose & model, concept. Director does **not** decide: carousel vs single, caption/hashtags, which product.

**SMM output for Post 3 (handoff to Director):** "Post 3. Format: carousel. Post type: Director's-scene (hero in set, then detail from same scene). Product: backless maxi dress. Slides: 3. Face: slide 1 with face, slides 2–3 no face. Sets used before (context only): [lobby, terrace]."

**Flow:** SMM handoff → Director writes brief (story, set, moment, concept, lighting, pose) → Tool generates image(s); for extra slides, approved-image workflow (see [DIRECTOR_BRIEF_AND_VISION.md](DIRECTOR_BRIEF_AND_VISION.md)) → SMM caption, hashtags, schedule, publish.

**Codebase today:** Director brief from (postId, product, sets used, format) = Yes (`brief` in CLI, `src/director-brief.js`, `brief --rag`). SMM "plan this post" command = Not yet. Generate image from brief = Yes. Approve image → detail slides = Yes (DIRECTOR_BRIEF_AND_VISION). SMM caption/hashtags = Partial (caption/hashtag sets in docs).

---

## Implementation status

- **Documented:** This doc (handoff + example above).
- **Director brief command:** Implemented (`node src/cli.js brief <productId> --post=N`); accepts caption angle, format, and uses RAG for Director context.
- **SMM "plan post" command:** Not yet implemented. A future `smm plan-post --product=<ID> --post=N` (or similar) could output the handoff text above so the pipeline always starts from a structured SMM decision.

---

*Source: Expert review (Gemini); implemented per project guidelines.*
