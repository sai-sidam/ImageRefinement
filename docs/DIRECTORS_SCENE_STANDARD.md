# Director's scene standard — every post (finalized)

**This is the creative quality bar for every post.** Same level of detail, same reasoning — applied to every post (brief, prompts, bar). We do **not** write a full reasoning doc per post; the full written reasoning was Post 1 only ([POST_1_COMPLETE_REASONING.md](POST_1_COMPLETE_REASONING.md)). Post 2+ get the same reasoning applied, not the same doc written. Finalized from Post 1.

---

## Creative quality bar (finalized)

Every post image must meet **this level** of quality — full environment, story, same light. The **set** (specific location and props) can change per post; the **bar** does not.

- **Full environment:** A real place, not just a background. Specific, considered setting that fits the product and the story (e.g. boutique, resort corridor, lobby, light-filled room — whatever serves that post).
- **Story:** The scene and the dress feel like they belong together; there’s a clear “moment” or narrative.
- **Same light:** Dress and environment lit by the same light; no pasted-in look.
- **Model detail:** Pose, hair, expression (and heels if visible) — all considered and coherent with the scene.

**Post 1 only:** We used a specific set (mirror, platform, hangers, curtains — boutique/dressing room). That set was for Post 1. Future posts can use different sets (e.g. resort, lobby, interior) as long as they meet this bar.

---

## Set variety (mandatory)

**Each post must look distinctly different.** Do NOT repeat the same elements across posts — same curtains, same carpet, same mirror, same chair, same plant makes the feed feel copy-pasted and AI.

- **Post 1 used:** Boutique — ornate mirror, platform/pedestal, clothing rack with hangers, sheer curtains, warm wall. Do not reuse that combination.
- **Post 2 used:** Lobby/lounge — couch/sofa, armchair, side table, potted plant, large window, warm neutrals. Do not reuse that combination.
- **Post 3 and onward:** Choose a different type of place each time: e.g. white plaster or stone wall, tile or terrazzo floor, outdoor terrace, minimal bedroom with linen, corridor with archway, etc. Different materials, different furniture, different props. So the feed has variety, not the same room in different clothes.

When writing prompts, explicitly say what this post is NOT (e.g. "Not a lobby with couch; not a boutique with mirror") and what it IS (e.g. "White plaster room with terrazzo floor" or "Outdoor terrace with stone and greenery").

---

## Approved-image workflow (finalized)

We do **not** generate three separate images (front, back, side) and hope the environment matches. Environment often drifts between runs.

**Process:**

1. **Get one image approved** for the post (e.g. front pose at director's-scene level).
2. **For additional poses (back, side):** Send that **approved image** to the LLM with the instruction: “Keep this image exactly as is — same environment, same dress, same lighting, mirror, rack, everything. Only change the model’s pose: replace the current [front] pose with a [back] pose” (or side pose).
3. **Output:** Same scene, same dress; only the model’s pose changes. Environment stays consistent across front, back, and side.

So: one approved image = the “scene lock.” Further poses are **pose-only variations** from that image, not new scene generations.

---

## Single image vs carousel — scene suitability (Post 2 learnings)

**Fallback:** A scene can be **excellent for a single hero shot** but **not suitable for a back or side shot** in the same room. Do not force a carousel. When in doubt, use **single image**.

**Why (from Post 2):** Post 2 had an approved front = model seated on couch, lobby/lounge. Great single image. We tried to add a back shot. Problems: (1) No natural story reason for her to turn; (2) Generating back from scratch gave a different room, felt AI; (3) Editing the front to "pose only" caused artifacts (e.g. messed-up feet). **Conclusion:** That scene was not suitable for a back pose. We use single image only for Post 2.

**Before planning a carousel with back/side, check:** (1) **Story reason** — Is there a clear in-scene reason for a second angle? (e.g. mirror, walking, standing by window and turning to look.) (2) **Same room** — Can we get a second shot that matches the same room? If not, carousel will feel inconsistent. If either is unclear, **use single image**.

**When carousel makes sense:** Scene is designed for multiple angles from the start (e.g. mirror; standing by window; walking). When the scene is a strong single-hero moment (seated, one pose), prefer single image.

**Process reminder:** When approving the first image, note whether the scene supports a second angle. If it is optimized for one strong hero shot, lock as single image; do not add back/side.

---

## Detail-shot carousel (Post 3 — what worked)

When the approved image is a **detail shot** (no face) and the scene is distinct (not the same as other posts), we can add back and side poses with `--from-image --pose=back|side --detail`. What made it work:

1. **Dress consistency (critical):** The dress must be **identical** across all slides — same color, pattern, fabric, cut, length, straps, neckline. State explicitly in the prompt: "Only the camera angle and pose change; the dress does not." Preserve original product colors and design 100%.
2. **Back pose:** Model can **look over her shoulder** toward the camera — so we see the back of the garment but she is still posing for the camera, not fully turned away. Feels intentional, not random.
3. **Side pose:** **Same scale** as slide 1 and 2. Model must not be oversized; environment has presence; she is in the room, not filling it. Match proportion across the set.
4. **Same room:** Room must look identical in every slide — same walls, floor, materials, light. So the carousel feels like one shoot.

Use this reasoning for any future detail-shot carousels. Tool: `npm run refine -- instagram <productId> --post=N --from-image=path/to/approved-detail.png --pose=back|side --detail`.

---

## Post 1 (finalized)

- **Final image:** `post_01_slide-01_backless-wide-strap-maxi-dress_vdirectors-scene-front.png`
- **Product:** Backless Wide Strap Maxi Dress
- **Format:** Single image for Post 1 (no carousel). Strong intro: face + front of dress, dresses on hangers visible.
- **Publish:** See [FIRST_POST_READY.md](../instagram-output/FIRST_POST_READY.md).

---

## How to generate the first image (per post)

**Single director's-scene image (e.g. front):**

```bash
npm run refine -- instagram <productId> --post=<N> --type=post --variant=directors-scene --prompt="$(cat instagram-output/prompts/post-01-directors-scene-brief.txt)"
```

(Use the prompt file that matches the post/product; Post 1 uses `post-01-directors-scene-brief.txt` or `post-01-directors-scene-front.txt`.)

**Pose variation from approved image (when implemented):**  
Input = approved image path. Instruction = same scene, same dress, change only pose to back/side. Output = new file (e.g. `_vdirectors-scene-back.png`). Tool support for this flow to be added when needed.

---

## Summary

- **Quality bar:** Director's-scene level (full environment, story, same light, real place) for every post. Bar is that high; the set (location/props) can differ per post. Finalized.
- **Workflow:** One image approved first; additional poses = send approved image to LLM, change only pose. Finalized.
- **Single vs carousel (fallback):** Not every scene supports a back/side shot. If the approved scene is a strong single-hero moment (e.g. seated on couch), use single image; do not force carousel. Carousel only when the scene naturally supports multiple angles (mirror, window, walking). See "Single image vs carousel — scene suitability" above.
- **Post 1:** Final image = directors-scene-front. Set used for Post 1 = boutique (mirror, platform, hangers, curtains); that set was for this post only. Finalized.
- **Post 2:** Single image only (front). Scene was not suitable for back; we do not repeat the mistake. Finalized.
- **Post 3 / detail carousel:** When scene supports it, use --detail for back/side. Reasoning in prompt: dress identical across slides; back = look over shoulder; side = same scale; same room. See "Detail-shot carousel" above.
