# June & Ember — All Posts (Info & Instructions, Post by Post)

One file, every post in order. Each section has image(s), caption, hashtags, and checklist. Generate images as needed, then copy-paste and publish in sequence.

---

# Summary

**Where we are:** Images generated for **Post 1**, **Post 2**, **Post 3**, and **Post 4**. Next: **Post 5**.

| Post | Format    | Image focus      | Hashtag set | Image status        |
|------|-----------|------------------|-------------|---------------------|
| 1    | Single    | Hero (face)      | A           | Ready               |
| 2    | Single   | Hero (face)      | B           | Ready                |
| 3    | Carousel  | Detail front/back/side | A           | Ready                |
| 4    | Single    | Hero (face)      | B           | Ready               |
| 5    | Carousel  | Hero → detail    | A           | Ready               |
| 6    | Single    | Detail (no face) | B           | Not yet generated   |
| 7    | Single    | Hero (face)      | A           | Not yet generated   |
| 8    | Single    | Hero or detail   | B           | Not yet generated   |
| 9    | Single    | Hero or brand    | A           | Not yet generated   |

**Hashtag sets:** See [docs/CAPTION_AND_HASHTAG_SETS.md](../docs/CAPTION_AND_HASHTAG_SETS.md) for full Set A, B, C. **Docs index:** [docs/README.md](../docs/README.md).

**Generate images:** From project root, `npm run refine -- instagram <productId> --style=juneember --post=<N> --type=post (single; add --all for carousel). Files → post/post_{id}_slide-{nn}_{slug}.png. See NAMING_CONVENTION.md`. After generating, replace "(not yet generated)" with a link to the file in that post’s section.

---

# POST 1

**→ Ready to publish:** [FIRST_POST_READY.md](FIRST_POST_READY.md) (image, caption, hashtags, checklist)

**Format:** Single image (hero)

**Image (finalized)**  
- **Use for Post 1:** [post/post_01_slide-01_backless-wide-strap-maxi-dress_vdirectors-scene-front.png](post/post_01_slide-01_backless-wide-strap-maxi-dress_vdirectors-scene-front.png) — Director's-scene front (mirror, platform, hangers, curtains, story). Face + full front of dress; strong intro image with dresses on hangers visible.

**Quality bar (finalized):** Director's-scene level for every post — full environment, story, same light on dress and scene. The *set* can differ per post (Post 1 used boutique: mirror, platform, hangers, curtains; other posts can use different sets). See [DIRECTOR_BRIEF_AND_VISION.md](../docs/DIRECTOR_BRIEF_AND_VISION.md). **Approved-image workflow:** Get one image approved; for more poses (back, side), send that approved image to the LLM and change only the model’s pose so the environment stays consistent.

**Other variants (reference only; not used for Post 1)**
| Label | File | Notes |
|-------|------|--------|
| directors-scene (mirror moment) | [post/post_01_slide-01_backless-wide-strap-maxi-dress_vdirectors-scene.png](post/post_01_slide-01_backless-wide-strap-maxi-dress_vdirectors-scene.png) | Same scene, different pose |
| from-ref-v4 | [post/post_01_slide-01_backless-wide-strap-maxi-dress_vfrom-ref-v4.png](post/post_01_slide-01_backless-wide-strap-maxi-dress_vfrom-ref-v4.png) | Reference-image swap (boutique) |
| pro-grade, natural-model, etc. | See post folder | Earlier iterations |

**Caption (copy below)**
```
June & Ember is here — elegant, effortless pieces for the moments that matter. So glad you're here. Tap the link to shop.

#fashion #ootd #style #womensfashion #fashionblogger #womenswear #fashionstyle #outfitoftheday #fashionista #dress #occasionwear #dresslovers #femininestyle #elegant #womenstyle #ladiesfashion #fashioninspo #styleinspo #outfitinspiration #fashionable #fashionpost #lookoftheday #instafashion #fashiondaily #fashionaddict #fashiontrends #junenember #junenemberstyle
```

**Checklist**
- [ ] Profile: Business/Creator, bio + link (junenember.com)
- [ ] **Upload:** `post_01_slide-01_backless-wide-strap-maxi-dress_vdirectors-scene-front.png` (final Post 1 image)
- [ ] Paste caption + hashtags above
- [ ] Post in your window (e.g. Tue–Thu 10 AM–1 PM or 6–8 PM)

---

# POST 2

**Format:** Single image (hero, with face)

**Quality bar:** Same director's-scene level as Post 1; set = lobby/lounge (not boutique). See [DIRECTOR_BRIEF_AND_VISION.md](../docs/DIRECTOR_BRIEF_AND_VISION.md). Prompts: [post-02-directors-scene-brief.txt](prompts/post-02-directors-scene-brief.txt), [post-02-directors-scene-front.txt](prompts/post-02-directors-scene-front.txt).

**Image**
- **Use for Post 2:** [post/post_02_slide-01_checkered-print-crew-neck-wide-leg-jumpsuit_vdirectors-scene-front.png](post/post_02_slide-01_checkered-print-crew-neck-wide-leg-jumpsuit_vdirectors-scene-front.png) — Director's-scene front (lobby/lounge). Face + full front of jumpsuit.

**Regenerate front:** `npm run refine -- instagram 8560379330648 --post=2 --type=post --angles=front --scene=directors --style=juneember`

**Caption (copy below)**
```
This one goes from brunch to evening without a single change. Tap the link to shop.

#fashion #ootd #style #womensfashion #lifestyle #fashionblogger #womenswear #elegant #occasionwear #feminine #styleinspo #fashioninspo #dress #outfitoftheday #fashionista #womenstyle #fashionstyle #lookoftheday #instafashion #fashionable #fashionpost #fashionaddict #fashiontrends #fashioninspiration #fashiondiaries #junenember #junenemberstyle
```

**Checklist**
- [ ] **Upload:** `post_02_slide-01_..._vdirectors-scene-front.png` (single image)
- [ ] Paste caption + hashtags above (Set B)
- [ ] Post in same window as Post 1

---

# POST 3

**Format:** Carousel (3 slides) — detail front, back, side (no face; same room)

**Quality bar:** Same director's-scene level; set = distinct (white/plaster or terrazzo; not same as Post 1 or 2). See [DIRECTOR_BRIEF_AND_VISION.md](../docs/DIRECTOR_BRIEF_AND_VISION.md). Prompts: [post-03-directors-scene-brief.txt](prompts/post-03-directors-scene-brief.txt), [post-03-directors-scene-detail.txt](prompts/post-03-directors-scene-detail.txt).

**Images (upload in order)**
| Slide | File | Notes |
|-------|------|--------|
| 1 | [post/post_03_slide-01_contrast-mini-cami-dress_vdirectors-scene-detail.png](post/post_03_slide-01_contrast-mini-cami-dress_vdirectors-scene-detail.png) | Front detail (no face) |
| 2 | [post/post_03_slide-02_contrast-mini-cami-dress_vdirectors-scene-detail-back.png](post/post_03_slide-02_contrast-mini-cami-dress_vdirectors-scene-detail-back.png) | Back detail — same room |
| 3 | [post/post_03_slide-03_contrast-mini-cami-dress_vdirectors-scene-detail-side.png](post/post_03_slide-03_contrast-mini-cami-dress_vdirectors-scene-detail-side.png) | Side detail — same room |

**Regenerate**
- **Slide 1 (front detail):** `npm run refine -- instagram 8556632473688 --post=3 --type=post --style=juneember --prompt="$(cat instagram-output/prompts/post-03-directors-scene-detail.txt)" --variant=directors-scene-detail`
- **Slide 2 (back):** `npm run refine -- instagram 8556632473688 --post=3 --from-image=instagram-output/post/post_03_slide-01_contrast-mini-cami-dress_vdirectors-scene-detail.png --pose=back --detail`
- **Slide 3 (side):** `npm run refine -- instagram 8556632473688 --post=3 --from-image=instagram-output/post/post_03_slide-01_contrast-mini-cami-dress_vdirectors-scene-detail.png --pose=side --detail`

**Caption (copy below)**
```
The kind of piece you reach for when you want to feel put-together in 10 minutes. Tap the link to shop.

#fashion #ootd #style #womensfashion #fashionblogger #womenswear #fashionstyle #outfitoftheday #fashionista #dress #occasionwear #dresslovers #femininestyle #elegant #womenstyle #ladiesfashion #fashioninspo #styleinspo #outfitinspiration #fashionable #fashionpost #lookoftheday #instafashion #fashiondaily #fashionaddict #fashiontrends #junenember #junenemberstyle
```

**Checklist**
- [ ] **Upload carousel:** slide 1 = front detail, slide 2 = back detail, slide 3 = side detail (files above)
- [ ] Paste caption + hashtags above (Set A)
- [ ] Post in same window

---

# POST 4

**Format:** Single image (hero, with face)

**Quality bar:** Same director's-scene level as Posts 1–3; set = light-filled corridor/arched interior (not boutique, lobby, or Post 3’s terrazzo room). See [DIRECTOR_BRIEF_AND_VISION.md](../docs/DIRECTOR_BRIEF_AND_VISION.md). Prompts: [post-04-directors-scene-brief.txt](prompts/post-04-directors-scene-brief.txt), [post-04-directors-scene-front.txt](prompts/post-04-directors-scene-front.txt).

**Final image (finalized)**  
- **Use for Post 4:** [post/post_04_slide-01_crisscross-halter-neck-jumpsuit_vdirectors-scene-front.png](post/post_04_slide-01_crisscross-halter-neck-jumpsuit_vdirectors-scene-front.png) — Director's-scene front (corridor/arched interior). Face + full front of Crisscross Halter Neck Jumpsuit. This is the only image to publish for Post 4.

**Regenerate front:** `npm run refine -- instagram 8560365666392 --post=4 --type=post --angles=front --scene=directors --style=juneember`

**Caption (copy below)**
```
We keep coming back to this cut for a reason. Tap the link to shop.

#fashion #ootd #style #womensfashion #lifestyle #fashionblogger #womenswear #elegant #occasionwear #feminine #styleinspo #fashioninspo #dress #outfitoftheday #fashionista #womenstyle #fashionstyle #lookoftheday #instafashion #fashionable #fashionpost #fashionaddict #fashiontrends #fashioninspiration #fashiondiaries #junenember #junenemberstyle
```

**Checklist**
- [ ] **Upload:** `post_04_slide-01_crisscross-halter-neck-jumpsuit_vdirectors-scene-front.png`
- [ ] Paste caption + hashtags above (Set B)
- [ ] Post in same window

---

# POST 5

**Format:** Carousel (2–3 images: hero then detail)

**Images (upload in order)**
| Slide | File | Notes |
|-------|------|--------|
| 1 | [post/post_05_slide-01_floral-lace-halter-deep-v-neck-bodycon-dress_vdirectors-scene.png](post/post_05_slide-01_floral-lace-halter-deep-v-neck-bodycon-dress_vdirectors-scene.png) | **Use this:** Hero with concrete moment (walking to railing, turning to view; not posing for camera). Director's brief + natural-photography reinforcement. |
| 2 | [post/post_05_slide-02_floral-lace-halter-deep-v-neck-bodycon-dress.png](post/post_05_slide-02_floral-lace-halter-deep-v-neck-bodycon-dress.png) | Detail |
| 3 | [post/post_05_slide-03_floral-lace-halter-deep-v-neck-bodycon-dress.png](post/post_05_slide-03_floral-lace-halter-deep-v-neck-bodycon-dress.png) | Detail |

**Regenerate hero (director's brief + moment):**  
`npm run refine -- instagram 8556630311000 --post=5 --type=post --style=juneember --prompt="$(cat instagram-output/prompts/post-05-directors-scene-brief.txt)" --variant=directors-scene`  
**Regenerate all 3 (generic style):** `npm run refine -- instagram 8556630311000 --all --style=juneember --post=5 --type=post --max=3`

**Caption (copy below)**
```
Your next event? Sorted. Swipe for details — then tap the link to shop.

#fashion #ootd #style #womensfashion #fashionblogger #womenswear #fashionstyle #outfitoftheday #fashionista #dress #occasionwear #dresslovers #femininestyle #elegant #womenstyle #ladiesfashion #fashioninspo #styleinspo #outfitinspiration #fashionable #fashionpost #lookoftheday #instafashion #fashiondaily #fashionaddict #fashiontrends #junenember #junenemberstyle
```

**Checklist**
- [ ] Generate carousel images (command above)
- [ ] Upload slides in order: hero first, then detail(s)
- [ ] Paste caption + hashtags above (Set A)
- [ ] Post in same window

---

# POST 6

**Format:** Single image (detail, no face)

**Image**
- **Generate:** `npm run refine -- instagram 8560359800920 --all --style=juneember --post=6 --type=post` (add `--variant=02` to keep variants)

**Variants**
| Label | File | Notes |
|-------|------|--------|
| *(none yet)* | post/post_06_slide-02_*.png | Add links and variant rows as you generate |

**Caption (copy below)**
```
Style that doesn't try too hard — that's the goal. Tap the link to shop.

#fashion #ootd #style #womensfashion #lifestyle #fashionblogger #womenswear #elegant #occasionwear #feminine #styleinspo #fashioninspo #dress #outfitoftheday #fashionista #womenstyle #fashionstyle #lookoftheday #instafashion #fashionable #fashionpost #fashionaddict #fashiontrends #fashioninspiration #fashiondiaries #junenember #junenemberstyle
```

**Checklist**
- [ ] Generate image (detail for grid)
- [ ] Upload image
- [ ] Paste caption + hashtags above (Set B)
- [ ] Post in same window

---

# POST 7

**Format:** Single image (hero, with face)

**Image**
- **Generate:** `npm run refine -- instagram 8556633096280 --style=juneember --post=7 --type=post` (add `--variant=02` to keep variants)

**Variants**
| Label | File | Notes |
|-------|------|--------|
| *(none yet)* | post/post_07_slide-01_*.png | Add links and variant rows as you generate |

**Caption (copy below)**
```
The piece that gets the most "where's that from?" in our DMs. Tap the link to shop.

#fashion #ootd #style #womensfashion #fashionblogger #womenswear #fashionstyle #outfitoftheday #fashionista #dress #occasionwear #dresslovers #femininestyle #elegant #womenstyle #ladiesfashion #fashioninspo #styleinspo #outfitinspiration #fashionable #fashionpost #lookoftheday #instafashion #fashiondaily #fashionaddict #fashiontrends #junenember #junenemberstyle
```

**Checklist**
- [ ] Generate image, then upload hero (with face)
- [ ] Paste caption + hashtags above (Set A)
- [ ] Post in same window

---

# POST 8

**Format:** Single image (detail or hero — your choice for grid balance)

**Image**
- **Generate:** `npm run refine -- instagram 8555179376728 --style=juneember --post=8 --type=post` (or `--all`; add `--variant=02` to keep variants)

**Variants**
| Label | File | Notes |
|-------|------|--------|
| *(none yet)* | post/post_08_slide-01_*.png or slide-02 | Add links and variant rows as you generate |

**Caption (copy below)**
```
Which color would you wear first? Tap the link to shop.

#fashion #ootd #style #womensfashion #lifestyle #fashionblogger #womenswear #elegant #occasionwear #feminine #styleinspo #fashioninspo #dress #outfitoftheday #fashionista #womenstyle #fashionstyle #lookoftheday #instafashion #fashionable #fashionpost #fashionaddict #fashiontrends #fashioninspiration #fashiondiaries #junenember #junenemberstyle
```

**Checklist**
- [ ] Generate image, then upload
- [ ] Paste caption + hashtags above (Set B)
- [ ] Post in same window

---

# POST 9

**Format:** Single image (brand moment or hero)

**Image**
- **Option A:** Generate `npm run refine -- instagram 8560334831704 --style=juneember --post=9 --type=post` (add `--variant=02` to keep variants)
- **Option B:** Brand moment — e.g. flat-lay, BTS, or a hero you love. Same visual system (warm, 4:5, juneember feel)

**Variants**
| Label | File | Notes |
|-------|------|--------|
| *(none yet)* | post/post_09_slide-01_*.png | Add links and variant rows as you generate |

**Caption (copy below)**
```
Hi, we're June & Ember. Women's occasion wear that feels as good as it looks. Thanks for being here — tap the link when you're ready to shop.

#fashion #ootd #style #womensfashion #fashionblogger #womenswear #fashionstyle #outfitoftheday #fashionista #dress #occasionwear #dresslovers #femininestyle #elegant #womenstyle #ladiesfashion #fashioninspo #styleinspo #outfitinspiration #fashionable #fashionpost #lookoftheday #instafashion #fashiondaily #fashionaddict #fashiontrends #junenember #junenemberstyle
```

**Checklist**
- [ ] Generate or choose image (hero or brand moment)
- [ ] Upload image
- [ ] Paste caption + hashtags above (Set A)
- [ ] Post in same window
- [ ] First 3×3 grid complete
