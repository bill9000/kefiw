# Article Hero Images — Discover Prompts

One markdown file per article. Each captures the **emotion** and **promise** of the article so the generated image can actually carry the headline click-through in Google Discover.

## Workflow

1. **Generate** each image with the prompt + negative prompt in the file. Target at least **1200×630** (16:9) — the Discover card minimum. 1536×864 or 1792×1024 are safer if your pipeline supports it.
2. **Save** the output as `public/og/{slug}.jpg` (or `.png`). The filename at the top of each prompt file already matches the article slug.
3. **Wire** it into the article config — substantial guides should set `discoverHeadline`. `src/data/content-pages.ts` then adds the default `imageAsset` links: `docs/images/{slug}.md`, the prompt-adjacent generated files, and the deployed `/og/{slug}.png` + `/og/{slug}-social.png` paths. If filenames differ, set `imageAsset` explicitly on the `ContentPageConfig`. Use `ogImage` only when you need to override the social image path.
4. **Test** the card preview before deploying. Use the Facebook Sharing Debugger or the Google Rich Results Test to confirm the image is being picked up. Google Discover itself doesn't have a preview tool — the card only appears once the article is indexed and picked up by Discover ranking.

## Discover image rules (enforced by Google)

- **No text overlays, logos, or watermarks.** Google explicitly penalizes image-with-title cards — they signal "site thumbnail, not article photo" and don't earn Discover cards.
- **No composites, no branded frames.** The image must be a single scene.
- **High quality**, photographic or illustrative, **not** graphic-design-on-color.
- **Subject must represent the article**, not the site.
- **Crawlable URL** (not JS-injected). The static `/og/{slug}.jpg` path satisfies this.

## Prompt anatomy

Every prompt file has the same structure:

```
# {article id}
Slug, article title, discover headline, emotion, promise

## Prompt
Positive prompt — subject + mood + style + technical tokens

## Negative prompt
Shared baseline (text, logos, etc.) + article-specific exclusions
```

The **positive prompt** is written to bake the emotion and promise into the composition — e.g. "a hand hovering thoughtfully" signals regret+revelation; "a hand placing the final tile" signals triumph; "a pencil paused mid-grid" signals curiosity+focus. The style tokens (editorial photography, warm lamp light, shallow depth of field) keep the set visually consistent across the current substantial/discovery guide set.

## Guide linkage contract

For the standard case, keep all three names aligned:

```
guide slug:       {slug}
prompt source:    docs/images/{slug}.md
source image:     docs/images/{slug}.png
source social:    docs/images/{slug}-social.png
deployed image:   public/og/{slug}.png
deployed social:  public/og/{slug}-social.png
```

The guide config carries this through `imageAsset`. `GuideLayout` uses `imageAsset.socialImage` for `og:image` and `twitter:image` only when the file exists, so missing generated images fall back safely to the site-wide image instead of producing broken meta tags.

Override only when needed:

```ts
imageAsset: {
  promptPath: 'docs/images/custom-source.md',
  sourceImage: 'docs/images/custom-source.png',
  sourceSocialImage: 'docs/images/custom-source-social.png',
  image: '/og/custom-image.png',
  socialImage: '/og/custom-social.png',
}
```

## Shared negative prompt (apply to every generation)

```
text, letters, numbers, words on tiles, logos, watermarks, signatures, captions, UI elements, cartoon, illustration (unless specified), blurry, distorted, extra fingers, extra limbs, low quality, jpeg artifacts, frame, border
```

## Target aspect & size

- **1200×630** minimum (Google Discover threshold)
- **1792×1024** ideal if your model supports it (downscales cleanly, survives Google's re-compression)
- **16:9** crop for Discover card
- Keep the subject roughly centered — Google sometimes crops square for mobile search.
