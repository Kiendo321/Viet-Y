# QA — male relaxed_front layers v5
Status: prototype reviewed, not deployed or integrated.

- Four accepted PNGs, all 1024×1536 RGBA with alpha range 0–254 and extensive fully transparent pixels. See file-manifest.json for alpha counts, bounds and SHA-256.
- Original alpha and RGB preserved. No Python image editing, cropping, recoloring or normalization.
- Rejected three attempts: enlarged/recentered coat, misplaced trousers, rescaled avatar correction. Accepted corrected coat/trousers and original avatar + footwear.
- Same canvas and shared scale. Render order: shoes, trousers, head/neck, tunic, hands.
- Avatar is displayed twice with non-overlapping CSS clip regions: top45% for head/neck, bottom55% for hands. Hands translated up1.5% (23.04px native canvas) to close wrist gaps.
- Head/neck must be behind collar; hands must be in front. Do not draw un-clipped avatar beneath foreground hands, which would duplicate them.
- Headless Chrome rendered actual accepted PNGs. Desktop screenshot reviewed against master: head/collar, cuffs/hands, hem/trousers and shoes connect plausibly at prototype scale. Fine anatomy/fabric and silhouette differ from source; this is regenerated extraction, not pixel-exact segmentation.
- JSDOM checks: image paths, four independent on/off controls (including both avatar passes), three backgrounds/checker, source overlay toggle.
- Only one coat colorway exists. Separate layers support a future static-file-swap pipeline, but color swapping is NOT yet demonstrated or production-ready.
- Full body, accessories/headwear, other poses and custom fit are not included.
- AI illustration inspired by áo ngũ thân, not a validated historical reconstruction. Generated through Codex image_gen, not Gemini.
- Existing application source, old asset set and live deployment are untouched.

Integration gate: choose compatible variants, verify seams for every combination, add explicit male/pose asset mapping and disabled-state handling, then test the in-app selector.

- Additional visual QA: actual desktop stack on campus and studio backgrounds, plus mobile480px checkerboard view. All inspected; no missing images or horizontal clipping observed. Screenshots included.
