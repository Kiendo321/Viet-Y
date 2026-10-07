# Photo asset MVP QA — 2026-10-07

- Local source snapshot: photo-assets-mvp-2026-10-07; carried forward the current AI Studio workbench source.
- TypeScript lint: pass. Vite production build: pass.
- Node/React tests: 17 passed, zero failures. Real Gemini responses were mocked in lifecycle tests; this is not proof of a successful live Gemini request.
- Browser: the real AI Studio preview loaded all six coat colors, preserving avatar, black headwear and trousers. Matching ivory headwear, charcoal trousers and wooden clogs loaded together.
- Closeups reuse the same coat URL and crop the raster images. Fabric crop adjusted inward to avoid showing the edge of the coat.
- Zoom: image loaded; Escape closed dialog and restored scrolling.
- Mobile browser: 390 × 844, document scroll width 375 (no horizontal overflow), preview above inspector; details collapsed by default.
- AI Studio preview server paused during a long external-tab review. This caused image load errors; after reloading the app the same static files loaded successfully. The retry control recovered the preview; no fake image fallback was substituted.
- The product header and App.tsx were not edited for this change.
- 18 WebP assets total 798,356 bytes; checksums and 1024 × 1536 dimensions recorded in public/assets/outfit-photo-v1/manifest.json.

This validates the fixed-model asset composer. It does not validate virtual try-on, body fitting, fabric physics, exact historical reconstruction, or live image-generation quota availability.
