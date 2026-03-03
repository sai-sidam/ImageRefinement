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
- **Post 3 used:** White/plaster or terrazzo detail room (detail shot carousel). Do not reuse that combination.
- **Post 4 used:** Light-filled corridor or arched interior — warm stone/tile/plaster, archway, minimal greenery. Do not reuse that combination.
- **Post 5 and onward:** Choose a different type of place each time: e.g. outdoor terrace, minimal bedroom with linen, etc. Different materials, different furniture, different props. So the feed has variety, not the same room in different clothes.

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

## Default: carousel (scene suitability)

**All posts are planned as carousels.** We decide the format before we start generation. Default = carousel (slide 1 hero with face, slides 2–3 same scene, back/side or detail). Single image only when there is a stated exception.

**When we plan a carousel (every post):** We choose a scene and brief that support multiple angles from the start (e.g. mirror; standing by window; walking; detail shot in a room that allows back/side). The first image is approved with that in mind — same room must work for slide 2 and 3.

**Lesson from Post 2:** Post 2 was once planned as single. The approved front = model seated on couch, lobby/lounge. We later tried to add a back shot. Problems: (1) No natural story reason for her to turn; (2) Generating back from scratch gave a different room, felt AI; (3) Editing the front to "pose only" caused artifacts. **Conclusion:** That scene was not suitable for a back pose. So we now **plan every post as carousel** and choose scenes that support back/side before generating the first image. We do not add back/side after the fact to a single-hero-only scene.

**Process reminder:** Plan carousel first. When approving slide 1, confirm the scene supports a second angle (story reason, same room). If we ever need a single-image exception, the scene can be one strong hero only — but default is always carousel.

---

## Detail-shot carousel (Post 3 — what worked)

When the approved image is a **detail shot** (no face) and the scene is distinct (not the same as other posts), we can add back and side poses with `--from-image --pose=back|side --detail`. What made it work:

1. **Dress consistency (critical):** The dress must be **identical** across all slides — same color, pattern, fabric, cut, length, straps, neckline. State explicitly in the prompt: "Only the camera angle and pose change; the dress does not." Preserve original product colors and design 100%.
2. **Back pose:** Model can **look over her shoulder** toward the camera — so we see the back of the garment but she is still posing for the camera, not fully turned away. Feels intentional, not random.
3. **Side pose:** **Same scale** as slide 1 and 2. Model must not be oversized; environment has presence; she is in the room, not filling it. Match proportion across the set.
4. **Same room:** Room must look identical in every slide — same walls, floor, materials, light. So the carousel feels like one shoot.

Use this reasoning for any future detail-shot carousels. Tool: `npm run refine -- instagram <productId> --post=N --from-image=path/to/approved-detail.png --pose=back|side --detail`.

**Back-image consistency checklist (when reviewing slide 2):** (1) Back design — criss-cross, lacing, appliqué, or cutout matches the product and slide 1 in style, count, spacing, and proportion; not reinterpreted. (2) Fabric drape natural on back/waist. (3) Straps aligned and natural. (4) Single light source; shadows consistent with the room.

**Product back reference (when the generated back doesn’t match the real product):** If the model invents or misrepresents the back design, lock it to the catalog by sending Shopify product image(s) that show the actual back. The model gets: IMAGE 1 = approved scene (slide 1), IMAGE 2 (and optionally IMAGE 3) = product photo(s) of the back. It is instructed to keep the same room and only change the pose, with the dress back matching the product image(s) exactly.

- **Find the right images:** In the Shopify product media, identify which image index (0-based) shows the back — e.g. 3rd and 5th image = indices **2** and **4**.
- **Single reference:** `--product-back-image=2`
- **Multiple references (recommended when back is shown in two angles):** `--product-back-image=2,4`
- **Example (Post 3):**  
  `npm run refine -- instagram 8556632473688 --post=3 --from-image=instagram-output/post/post_03_slide-01_contrast-mini-cami-dress_vdirectors-scene-detail.png --pose=back --detail --product-back-image=2,4`

Reuse this flow for any future post where the back slide must match the product’s real back (detail carousels or full-scene back shots).

---

## Post 1 (finalized)

- **Final image:** `post_01_slide-01_backless-wide-strap-maxi-dress_vdirectors-scene-front.png`
- **Product:** Backless Wide Strap Maxi Dress
- **Format:** Published as single image in the past. **Going forward, all posts (including first) = carousel** (slide 1 hero with face, then detail). Strong intro: face + front of dress; add slides 2–3 (back/detail) for new posts.
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
- **Default = carousel:** All posts are planned as carousels. Choose a scene that supports multiple angles (mirror, window, walking, detail in same room). See "Default: carousel (scene suitability)" above. Single image only by stated exception.
- **Post 1:** Final image = directors-scene-front. Set used for Post 1 = boutique (mirror, platform, hangers, curtains); that set was for this post only. Published as single historically; new posts = carousel.
- **Post 2:** Executed as single (front) in the past; scene was not suitable for back. Going forward we plan carousels and pick scene suitability up front. Finalized.
- **Post 3 / detail carousel:** When scene supports it, use --detail for back/side. Reasoning in prompt: dress identical across slides; back = look over shoulder; side = same scale; same room. See "Detail-shot carousel" above. If the generated back doesn’t match the product, use **product back reference**: `--product-back-image=<index>` or `--product-back-image=2,4` (comma-separated) so the model copies the real back from Shopify product image(s).
