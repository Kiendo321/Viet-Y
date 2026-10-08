# Male pose masters v4 — QA — 2026-10-08

Status: draft assets only; not integrated or deployed.

- Three full-body PNG masters: 1024 × 1536 RGBA, with more than 1.14 million fully transparent pixels each.
- Alpha range 0–254 (near-opaque subject, not fully opaque 255). No alpha normalization or raster processing applied.
- All heads and shoes are within the canvas. Visual review: front closure visible, relaxed shoulders, subtle turn/step, same indigo/white/black outfit direction.
- Pose B's hand overlaps the tunic; future extraction needs correct foreground-hand ordering.
- Separate generation may vary face and fabric details slightly. An expert has not validated historical construction; label these as AI contemporary styling inspired by áo ngũ thân.
- A is intended for future independent-layer composition; A/B/C are currently COMPLETE OUTFIT masters. Existing straight-pose layers must not be overlaid on these masters.
- HTML review script syntax, three cards, relative image references, B selection and all three backgrounds/checker checked through JSDOM. Native browser unavailable; no rendered screenshot verification claimed.
- Review HTML overlays the original PNGs without changing their pixels. Its CSS shadow is review-only.
- Contact sheet is independently AI-regenerated for aesthetic comparison; use HTML/original PNGs to review exact assets.
- SHA-256, dimensions and alpha measurements are recorded in file-manifest.json.
- Generated through Codex image_gen, not Gemini. Exact prompts and references are in prompts-and-provenance.json.

Next integration gate: review poses, extract and validate A layers, add compatible asset IDs/colorways, then wire selector and perform in-app visual QA.

