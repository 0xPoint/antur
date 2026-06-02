# Image Optimization Plan

Goal: keep original assets, serve visually lossless responsive images, and keep Lighthouse Performance above 93 on mobile and desktop.

## Current Audit

Largest current assets:

- `public/images/og-image.png` — 1.9 MB, 1731x909.
- `public/images/faq-preview.png` — 1.9 MB, 1731x909.
- `public/images/location-buhta-russkaya.jpg` — 864 KB, 1800x1350.
- `public/images/hero-kamchatka-boat.jpg` — 772 KB, 2200x1238.
- `public/images/hero-orca-breach.jpg` — 516 KB, 1920x1276.
- `public/images/location-three-brothers.jpg` — 484 KB, 1800x1205.

All image filenames are short, semantic, and accurate for their usage. The weakest previous name, `faq-social-preview`, was renamed to `faq-preview`.

## Target Output

Keep originals in `public/images/`. Generate derived files into `public/images/generated/`:

- Hero desktop: 1920, 1440, 1080 widths.
- Hero mobile: 920, 720, 480 widths.
- Route cards: 1080, 720, 480 widths.
- Content images: 1200, 900, 640 widths.
- Social/OG: keep `og-image.png` for compatibility, add `og-image.webp`.

Formats:

- WebP quality 84-88 for photos.
- JPEG fallback quality 82-86, progressive.
- PNG only for icons or assets needing transparency.
- SVG remains SVG for messenger marks.

## Estimated WebP Savings

Probe with `cwebp -q 86`:

- `og-image.png`: 1.9 MB -> 168 KB.
- `faq-preview.png`: 1.9 MB -> 148 KB.
- `hero-orca-breach.jpg`: 516 KB -> 272 KB.
- `hero-kamchatka-boat.jpg`: 772 KB -> 412 KB.
- `fishing-deck.jpg`: 240 KB -> 104 KB.
- `crab-tasting.jpg`: 312 KB -> 156 KB.

## Implementation Steps

1. Add a build-time image script that reads originals and writes responsive WebP/JPEG variants.
2. Keep source originals untouched for future reprocessing.
3. Replace plain `<img>` usage with `<picture>` for hero, route cards, booking, FAQ and gallery images.
4. Add `srcset` and `sizes` for every responsive image.
5. Keep explicit `width` and `height` on rendered images to prevent layout shift.
6. Keep `fetchpriority="high"` only for the first hero image.
7. Keep all below-the-fold images as `loading="lazy"` and `decoding="async"`.
8. Re-run Lighthouse after deployment. Any score below 93 triggers further action.

## Suggested Commands

Create WebP variants:

```sh
cwebp -q 86 public/images/hero-orca-breach.jpg -o public/images/generated/hero-orca-breach-1920.webp
cwebp -q 86 public/images/hero-orca-breach-mobile.jpg -o public/images/generated/hero-orca-breach-920.webp
```

Create progressive JPEG fallback with `cjpeg`:

```sh
cjpeg -quality 84 -progressive public/images/hero-orca-breach.jpg > public/images/generated/hero-orca-breach-1920.jpg
```

For resized variants, use a dedicated transformer such as Sharp in a Node script. Do not resize with ad hoc CSS-only scaling; the browser still downloads the original bytes.

## Acceptance Criteria

- Initial page image transfer under 750 KB on mobile.
- No single below-the-fold image above 250 KB.
- Hero LCP image under 300 KB for desktop and under 120 KB for mobile.
- Lighthouse Performance, SEO, Best Practices and Accessibility all at least 93.
- No CLS caused by images.
