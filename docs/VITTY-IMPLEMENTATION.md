# Vitty implementation

## Workflow

Source authored by Codex locally and imported into the existing AI Studio app; Gemini's earlier coding turn was canceled before it edited any file. Preview/UX checks run in Studio. Production verification runs in Cloud Build's Docker stage (lint, test suite, Vite/backend build and production smoke), not a second local dev server. Studio API paths returned startup HTML during direct verification, so its frontend uses the stable Cloud Run ux-preview backend; an explicit VITE_VITTY_API_BASE can override this. Only the current Studio preview origin and public Việt Y origin are allowed in the deployed Vitty CORS configuration; requests from other browser origins are refused. Public UI remains same-origin.

## Runtime

- `GET /api/vitty?before=<turn UUID>` returns the latest/preceding 40 turns. User and reply render as a pair; previous files are retained.
- `POST /api/vitty/turns` submits UUID, anonymous author UUID, avatar, text (1–4000 chars), optional validated selection context. Repeated ID with different author/text/context returns 409. A pending 100s lease excludes duplicate model calls; expired/failed requests can retry. Completed request returns the original result.
- Gemini runs server-side through existing provider config. Curated catalog and library ground the system instruction; structured JSON is validated and rendered with React text nodes. Invalid outfit combinations and article IDs are removed, never silently normalized into a different recommendation. No model-supplied HTML, URL or asset is accepted.
- Avatar is cosmetic, saved with each message; no gender inference. Local browser storage contains avatar choice, anonymous ID, draft and pending outbox only. Shared answers/history reside on the server.
- Stored questions are public to demo visitors in this one shared chat by the user's explicit choice. UI indicates Trò chuyện chung; no reset/delete control.

## File persistence

Development: `.vitty-data/<UUID>.json` is written through temp file + atomic rename under a per-file queue. Single dev server process. Excluded from Git, Docker and Cloud Build.

Production: `gs://c3-app-162-vitty-history/vitty/shared/<UUID>.json`. Uniform bucket access, public access prevention. Attached service identity `171206540455-compute@developer.gserviceaccount.com` already has project Editor access; its existing permissions were sufficient in a real read/write verification. No new IAM role was granted for this feature. For a future least-privilege service identity, bucket-scoped `roles/storage.objectUser` is sufficient; do not add project-wide Storage Admin or browser access. Writes compare object generations, including generation=0 for creation; reads pin metadata generation to avoid conflicting leases. Deployment environment: `VITTY_STORAGE_BUCKET=c3-app-162-vitty-history`. Cloud Run without this setting returns a storage configuration error, rather than silently using ephemeral disk.

The MVP lists JSON turn files to build chronological pages/context. This is appropriate for the demo's small history; a larger public launch needs a paged manifest/index and storage read quotas before long-running traffic. No data or fake model fallback is seeded into production. File history should not be described as a private personal chat.

## Source boundaries

Vitty-specific component/CSS; only routing/nav item/import additions to existing shared files. Existing Home, Workshop, Library and Lookbook are preserved. Original approved Vitty A PNG is reused without image modification; CSS head viewport and existing model face viewports keep avatars compact.
