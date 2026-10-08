# Publish runtime fix — 2026-10-08

## Evidence

Project: c3-app-162. Cloud Run: viet-y, asia-southeast1.
Failed revision: viet-y-00001-klj, created 2026-10-06 17:40 UTC.
The startup log reports `node server.ts` followed by `ERR_MODULE_NOT_FOUND` for
`/workspace/src/data/catalog.js`. The process exits before it can listen on PORT=3000.
The same error was reproduced locally from GitHub snapshot 9c6a0a2.

## Change

- `npm run build` builds the frontend and bundles local backend TypeScript modules
  into a root-level `server.js` using esbuild.
- `npm start` runs `node server.js`.
- The backend build fixes NODE_ENV to production, so deployment does not accidentally
  start Vite development middleware when the environment variable is absent or wrong.
- External npm dependencies remain external; install them in the runtime image.
- Keeping server.js at the project root preserves the existing public/ and dist/ paths.
- No port or startup timeout change is needed for the observed missing-module error.

The build environment must install devDependencies, including esbuild. Do not prune
those before `npm run build`. After building, runtime needs server.js, package.json,
dist/, public/ and the production npm dependencies. Do not commit generated server.js.

## Verification

Node.js v22.19.0 on Windows (failed Cloud Run container used v22.23.2).
Dependencies reused from the previously installed verification workspace via junction;
this is not a clean lockfile install or a Linux container test.

Passed:
- Frontend + backend production build.
- `npm run lint`.
- Existing test suite: 17 passed, 0 failed.
- Compiled server starts from a staged directory with no server.ts, src/ or .env.
- A dynamically chosen PORT is respected, and /api/health returns 200.
- Homepage and SPA route return the exact production index.html.
- Both linked JS/CSS bundles match their build output byte for byte.
- All 18 outfit WebP assets return image/webp and match the files byte for byte.
- Unknown API returns JSON 404; missing-key stylist fallback returns two suggestions.

Repeat with `npm run test:production` after installing dependencies.
The smoke test uses an empty Gemini key and does not make paid AI calls.

## Deployment status

No GCP deployment or AI Studio source was changed by this local trial.
Before republishing, apply these source changes in AI Studio (including scripts/),
then ensure the new deployment actually runs `node server.js` and produces a Ready
revision. Verify the published URL's /api/health, homepage and assets again.
Gemini access, model availability and quota require a separate live API check.
