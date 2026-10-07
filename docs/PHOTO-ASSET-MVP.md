# Fixed-model photographic asset MVP

The composer uses one generated adult male model, six prepared coat files and independent headwear, trousers and footwear. Color selection changes URLs. There is no runtime hue transformation, image-generation request, uploaded user photo, body-size control or custom-fit model in this feature.

## Asset contract

All transparent layers are WebP on a 1024 × 1536 canvas. Layer order: shoes → trousers → avatar face/neck/hands → coat → optional headwear. The stage backdrop is a separate decorative photograph. `src/data/outfitPhotoAssets.ts` owns selection mapping, precedence and detail crop windows. Full body, collar, fasteners and fabric detail use the same image layers.

The fixed coat envelope is x286–739, y255–1119; cuffs end near y775. Headwear: x427–590, y33–143. Dark trousers: x356–670, y680–1398. Shoes: approximately x355–665, y1375–1466. These are prepared positions for this single mannequin, not user body fitting coordinates.

Before integration, the generated layers were cropped, transparency cleaned, resized and manually calibrated to the fixed pose. Pixel colors were not transformed. Garment variants can differ slightly in folds and AI textile details. The images do not establish construction, fiber composition or historical authenticity.

## Generation and prompts

Generated with the built-in Codex `image_gen` tool, not the app's Gemini endpoint. This asset library is design material; the live Gemini stylist feature remains separate. Do not present these as Gemini-generated runtime results.

`photo-generation-provenance.json` records generated file names and the exact stored prompts for the color-variant calls. Earlier calls used these briefs:

- Canonical avatar: photoreal Vietnamese male student aged 22; front upright catalog pose; ivory sleeveless undershirt, white trousers, black Oxford shoes; neutral hands beside hips; transparent 1024 × 1536 portrait; no setting or text.
- Indigo master: preserve face, pose and camera; add an indigo áo ngũ thân inspired tunic with band collar, ivory inner edging, five fasteners on wearer right/viewer left and long hem; no headwear or invented cultural symbols.
- Coat cutout: isolate only that garment; retain collar, sleeves, folds, front closure and five fasteners; no head, skin, hands, pants or shoes; transparent background.
- Headwear: low wrapped Vietnamese khăn đóng, front view; black cloth folds; transparent; no person or invented symbols. Color edits preserve this shape.
- Dark trousers: isolated charcoal front-view trousers corresponding to the fixed avatar stance; no body, shirt or shoes.
- Clogs: a front-facing pair of natural wooden clogs with dark brown straps and visible toes, aligned to the fixed stance; no other body.
- Backdrop: empty warm ivory studio, plaster wall, stone floor, wooden lattice at the far left and small vase/branches; center unobstructed; soft light. Decorative heritage styling, not a historical reconstruction.

## Loading and failure behavior

All active layers must finish loading before the composite appears. A missing file shows an explicit error and retry instead of displaying an incomplete outfit. Late responses from an old selection are ignored. Browser caching makes subsequent swaps small and local to the static asset library.

## Cultural scope

The museum article documents a black áo ngũ thân sa kép with white lining. Other colors, matching headwear and footwear are contemporary styling suggestions. The model, cloth texture and backdrop are AI illustrations, not authenticated photographs of that artifact. Source context remains available in the composer accordion.

## Validation

- TypeScript lint and production Vite build passed.
- 17 tests passed: validator safeguards, API fallback, quota behavior, six color URL swaps, fixed avatar/pants/black hat, shared detail sources, exclusive accessory groups, image failure/retry, zoom Escape and note retention.
- Static photo library: 18 WebP files, 798,356 bytes before documentation.
- Browser verification: all six coats loaded in AI Studio preview, matching headwear, dark trousers and clogs displayed; zoom/Escape worked. At 390 × 844 the preview precedes controls and details start collapsed. See PHOTO-ASSET-QA.md.
