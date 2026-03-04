# Inspiration strategy — audit, reference, and future workflow

**Purpose:** One place to record what we observe about our inspiration accounts (ohpolly, outcastclothing, misscirclenewyork). Whatever we might reuse later — format mix, captions, activity, reference images, hashtags, timing, or new use cases — we capture here (or in the per-brand folder) and update when we check. No re-checking every time; one audit, many uses.

---

## Reference & inspiration workflow (current state)

**Current state:** We are **not** using reference or inspiration in the Director brief. The previous approach (short style one-liners per account, e.g. "talbotsofficial — timeless elegance") is **set aside** — that was not the intended meaning of "inspiration."

**Future vision (when we build it):** When we talk about **inspiration** or **reference** in the future, we mean: an **AI agent goes live to Instagram** (or has access to an account's feed); it **looks at that account's pictures** (e.g. ohpolly, Miss Circle, Two Sisters the Label); it either **picks one picture** to use as a visual reference (same composition/pose/lighting, our dress) or **understands their whole design language** from the last **20–30 pictures**. That requires working with Instagram and images (API or scraping, image ingestion). We're keeping reference/inspiration aside until we have that capability.

**What still works today:** Director brief has no Reference section (Story, Set, Moment, Concept, Lighting, Pose, Face only). **Optional manual reference image:** You can pass a saved image with `--reference-path` or `--reference-url` when generating; the tool will composite our dress onto that scene (same pose/lighting, new face). See [DIRECTOR_BRIEF_AND_VISION.md](DIRECTOR_BRIEF_AND_VISION.md) § "Reference / inspiration (set aside for now)".

**Scalable:** Each brand has a **section** below and a **folder** (`instagram-output/inspiration/{brand}/`). Add new subsections or new file types when a new use case appears (e.g. "Captions", "Activity", "Stories"). Don’t lock into a fixed table.

---

## How to add a new use case

1. Decide what you want to track (e.g. captions, posting frequency, hashtags).
2. Either add a **subsection** under that brand below (e.g. **Captions**, **Activity**) or add a **file** in that brand’s folder (e.g. `captions-samples.txt`, `activity-notes.md`).
3. Note it in "What we track" below so we know where to look.

---

## What we track (expand as needed)

| Use case | Where it lives |
|----------|----------------|
| Format mix (single / carousel / Reels) | Per-brand section → **Format mix** |
| Captions (samples, style, hooks) | Per-brand section → **Captions** and/or `inspiration/{brand}/caption-samples.txt` |
| Activity (frequency, timing, engagement) | Per-brand section → **Activity** and/or `inspiration/{brand}/activity-notes.md` |
| Reference images (for —reference-path, Director) | Per-brand folder + **Reference images** list in section |
| Hashtags, Stories, other | Add subsection or file when needed |

---

## Oh Polly — @ohpolly

**Last checked:** *(date)*

**Format mix**  
*(e.g. Single image: Yes. Carousel: Yes. Reels: Yes. Mix: …)*

**Captions**  
*(Samples or: “See inspiration/ohpolly/caption-samples.txt”)*

**Activity**  
*(e.g. Posting frequency, best times, or: “See inspiration/ohpolly/activity-notes.md”)*

**Reference images**  
*(List files in inspiration/ohpolly/ and what each is for. Use with —reference-path.)*

**Other**  
*(Hashtags, Stories, anything else. Add rows as needed.)*

---

## Outcast Clothing — @outcastclothing

**Last checked:** *(date)*

**Format mix**  
*(…)*

**Captions**  
*(…)*

**Activity**  
*(…)*

**Reference images**  
*(…)*

**Other**  
*(…)*

---

## Miss Circle NYC — @misscircle_newyork

**Last checked:** *(date)*

**Format mix**  
*(…)*

**Captions**  
*(…)*

**Activity**  
*(…)*

**Reference images**  
*(…)*

**Other**  
*(…)*

---

## Folder structure

```
instagram-output/inspiration/
  ohpolly/           — images, caption-samples.txt, activity-notes.md, etc.
  outcastclothing/
  misscircle_newyork/
```

Put anything you save or export there (screenshots, copied captions, notes). Update the brand section above to point to the files or summarise them. New use case = new subsection or new file type; no change to this doc’s overall shape.
