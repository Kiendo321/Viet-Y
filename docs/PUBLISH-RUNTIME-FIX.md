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

## Verified deployment — 2026-10-08

The production application is now deployed and verified:
https://viet-y-171206540455.asia-southeast1.run.app

- Cloud Run service: viet-y, project c3-app-162, region asia-southeast1.
- Ready revision: viet-y-runtime-fix-20261008, receiving 100% traffic.
- Image digest: sha256:5764bc0becd0b91f9103879ee454bc64ae433eaa17427890acce293701d54eb6.
- Cloud Build: c2a2716f-1b81-4733-844d-15329accb354, SUCCESS.
- Clean npm install on Linux, lint, 17/17 tests, build and production startup checks passed.
- Public HTTP checks passed for health, homepage, SPA route, both frontend bundles,
  JSON API routing and all 18 WebP assets (verified against their original SHA-256).
- The existing GEMINI_API_KEY environment variable was preserved. Health reports that
  a key is configured; this does not prove model/quota availability. No live Gemini
  call was made during deployment verification.

The later Linux checks supersede the local-only limitations described above.
Evidence: DEPLOYMENT-REVISION.json and DEPLOYMENT-HTTP-CHECK.json.

### Repeatable build and deploy

Use package-lock.json and npm ci; bun.lock is retained from the original AI Studio
snapshot but is not the lockfile used for this deployment. Do not mix lockfiles.
The esbuild dependency was upgraded to ^0.28.0 to satisfy Vite 8's peer requirement.
.gcloudignore and .dockerignore exclude local dependencies, secrets and generated
output; the Dockerfile builds on Linux and installs only production dependencies
into the runtime stage. The deployed runtime runs as the unprivileged node user.

```powershell
gcloud builds submit . --project=c3-app-162 --region=asia-southeast1 --tag=asia-southeast1-docker.pkg.dev/c3-app-162/viet-y/app:YOUR_TAG
# Obtain the immutable image digest from the successful build, then:
./scripts/deploy-cloud-run.ps1 -Image 'asia-southeast1-docker.pkg.dev/c3-app-162/viet-y/app@sha256:YOUR_DIGEST'
node scripts/verify-deployment.mjs 'https://viet-y-171206540455.asia-southeast1.run.app'
```

The existing AI Studio deployment used prebuilt-source annotations and a matching
runtimeClassName. Switching to a container image requires clearing those fields
while preserving service configuration and env values. The helper uses the official
Cloud Run v1 API and keeps credentials/env values in memory; it never saves or prints
secrets. Deployment uses the current resourceVersion to avoid overwriting concurrent
service edits.

Deployment was performed directly on Cloud Run. AI Studio's publish panel can retain
its old failure status; import/sync the fixed source before publishing from that
panel again so it does not restore the old startup command.
