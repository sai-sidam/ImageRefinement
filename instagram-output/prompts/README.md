# Prompt variants

- **post-01-clear-natural-prompt.txt** — Sharp, clear, high-res; one directional light, subtle warmth. Use for default (no `--variant`).
- **post-01-natural-model-prompt.txt** — Same as clear-natural plus: natural pose, hair, expression. Use with `--variant=natural-model` (recommended for Post 1).
- **post-01-director-talbots-prompt.txt** — Director's view example: talbotsofficial style. Use with `--variant=director-talbots`. See [DIRECTORS_VIEW.md](../../docs/DIRECTORS_VIEW.md).
- **post-01-pro-grade-prompt.txt** — **Post 1 professional bar:** lighting that reveals fabric, coherent environment, natural model/skin, no AI tells. Director- and photographer-level. Use with `--variant=pro-grade`. See [POST_1_PROFESSIONAL_BRIEF.md](../../docs/POST_1_PROFESSIONAL_BRIEF.md).
- **post-02-directors-scene-brief.txt** / **post-02-directors-scene-front.txt** — Post 2 director's-scene (same bar as Post 1; set = lobby/lounge). Post 2 = single image only (scene not suitable for back/side). Generate: `npm run refine -- instagram <productId> --post=2 --angles=front --scene=directors --style=juneember`. See [DIRECTORS_SCENE_STANDARD.md](../../docs/DIRECTORS_SCENE_STANDARD.md) "Single image vs carousel" before adding back/side to any post.
- **post-03-directors-scene-brief.txt** / **post-03-directors-scene-detail.txt** — Post 3 director's-scene (detail, no face; set = light-filled / getting-ready). Generate: `npm run refine -- instagram 8556632473688 --post=3 --type=post --style=juneember --prompt="$(cat instagram-output/prompts/post-03-directors-scene-detail.txt)" --variant=directors-scene-detail`.
- **post-01-natural-prompt.txt** — "Natural texture" emphasis; in testing **less clear**. Prefer clear-natural or natural-model.
- **post-01-cooler-prompt.txt** — Cooler lighting; in testing looked **more AI-like**. See [docs/AI_VS_NATURAL_IMAGERY.md](../../docs/AI_VS_NATURAL_IMAGERY.md).
