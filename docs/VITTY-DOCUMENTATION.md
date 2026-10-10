# Vitty documentation handoff

Documented 10 October 2026. Disposition: `ship`, scoped to the reviewed Vitty surface and supplied finish evidence. Public deployment and main promotion remain pending at this handoff.

Release follow-up: the subsequent main/public promotion is recorded separately in [VITTY-RELEASE.md](VITTY-RELEASE.md). The reviewed UI source did not change after these captures.

This is a code-led Operate extension of Việt Y. The [surface brief](VITTY-SURFACE-BRIEF.md) supplies the direction contract; [PRODUCT.md](../PRODUCT.md) supplies product truth; [DESIGN.md](../DESIGN.md) and the existing schema-version-2 [.impeccable/design.json](../.impeccable/design.json) remain the incumbent design authority. No global visual-world or design-system change was approved. This pass writes only PRODUCT.md and this document. Route-local values below describe the observed implementation and are not new global tokens.

## Overview

Vitty connects a cultural question to a readable answer and a next action in the existing Workshop or Library. The compact approved guide face, photographic user faces, fan disclosure, and real catalogue selections carry its identity. The conversation retains the established paper grounds, crimson controls, restrained gold, Be Vietnam Pro, and collapsible left navigation. Home's B hero and local studio palette remain Home-specific.

| Incumbent system | Vitty extension | Scope |
| --- | --- | --- |
| Ivory paper, crimson active states, quiet gold | Paper transcript and composer, crimson send/user messages, gold list markers and waiting dots | Existing shared palette retained; auxiliary fills stay local |
| Serif brand/editorial accents and sans-serif interaction | Sans-serif guide title and structured answer hierarchy; serif Việt Y brand retained | Conversation typography only |
| Collapsible rail and isolated mobile drawer | Vitty navigation entry, addressable `/vitty`, route title and conversation shell modifier | Routing/nav additions retain incumbent behavior |
| Separately scrolling Workshop controls | Separately scrolling transcript between a header and composer | Conversation frame only |
| Photograph-backed outfit scene and cultural pages | Real outfit scene links and validated internal article links | Existing catalogue/data destinations reused |
| Nearly square photographs and softer controls | Directional message corners, rounded composer and compact disclosures | Route-specific shapes; no shared radius replacement |

The approved original `src/assets/vitty/vitty-a-cultural-guide.png` is reused. CSS viewport positioning crops it to head/face and black khăn đóng; this pass creates no altered or generated asset. The user choices reuse `/assets/outfit-photo-v1/avatar.webp` and `/assets/viet-y-v2/nguthan-female-ivory.webp`, cropped to their actual model faces. Avatar choice is cosmetic and saved on each turn; it does not infer gender or outfit preference.

## Colors

The route consumes `vy-paper`, `vy-soft`, `vy-line`, `vy-ink`, `vy-red`, `vy-red-dark`, `vy-gold`, and `vy-sans` from the existing CSS system. The shared red/dark-red distinction continues to identify actions and their hover states. Warm light answer/composer surfaces (`#FFFCF7`) support reading; user messages use light ivory (`#FFF5E8`) on the shared deep crimson. Metadata uses the incumbent navigation-muted ink (`#67575C`).

Other observed local states include avatar hover (`#EEDDD3`), context text/divider (`#F3D7BA`, `#C0857855`), composer border (`#BFA997`), focus tint (`#951D2A22`), disabled send fill (`#E2D8C9`), and disclosure shadow tint (`#30252825`). These literals record the route as implemented. Catalogue colours remain content, and written design palettes remain words rather than new interface swatches.

## Typography

Be Vietnam Pro carries the conversation. The source inherits the shared sans family and local font faces; it does not introduce a font or a global type scale.

| Conversation role | Desktop source | Phone adaptation |
| --- | --- | --- |
| Guide title | 22px, weight 650, line height 1.35, tracking −.02em | 19px |
| Answer title | 18px, weight 650, line height 1.45, tracking −.015em | 17px |
| Section heading | 14px, weight 600, line height 1.55 | Outfit title 13px |
| Answer body | 14px, line height 1.8, maximum measure 72ch | 13px, line height 1.75 |
| Composer | 14px, line height 1.65 | 16px, line height 1.5 |
| Starter options | 13px | 13px |
| Metadata | 11–12px | Speaker/shared labels 10px; subtitle 11px |

The welcome answer demonstrates semantic headings, paragraphs and lists. Model text renders through React text nodes in this same hierarchy. The 10–12px metadata is an observed compact role, not guidance to shrink primary answer text. The finish review records readability at the supplied viewports; it does not constitute a full assistive-technology audit.

## Layout

The conversation fills the available viewport using a three-row grid: header, `minmax(0,1fr)` transcript, composer. Desktop main content is 100dvh; below 760px it subtracts the incumbent 56px mobile navigation bar. Overflow is contained in the transcript, leaving the header and composer in place. Transcript and composer contents share a maximum width of 860px. The transcript has desktop padding of 32px 28px 22px and phone padding of 24px 14px 14px; message gaps reduce from 26px to 22px.

Assistant messages align left; user messages reverse the avatar/content order and align right. User text caps at 60ch. The header guide face is 48px desktop and 42px phone; ordinary message faces are 42px desktop and 30px phone. The phone avatar control face is 30px. These keep the approved character compact.

The fan opens upward above the composer, with exactly the three contracted starters. Its width is capped at 350px desktop and 330px phone, with viewport margins. Real outfit cards use a 110px image column and 160px image height; phone cards use 78px and 140px respectively. Article actions wrap. The composer textarea grows to a maximum of 120px and the outer zone includes safe-area bottom padding.

The final captures show a scrolled transcript. Reply content clipped at its internal boundary is expected; the application frame remains visible. Supplied `review/scroll-geometry.json` records transcript scroll changing from 1881.14 to 0 while header and composer rectangles remain identical.

## Elevation & Depth

Paper tones and thin warm borders provide the ordinary surface separation. Only the small avatar picker and fan disclosure use an offset shadow (`0 10px 32px #30252825`) to distinguish temporary choices above the conversation. This is a route-local disclosure treatment; it does not change the incumbent Paper Layers Rule.

Waiting dots and a sending spinner communicate work in progress. Fan/send colour transitions use 0.18s. The route removes animations and transitions under reduced-motion preference and keeps waiting dots visible.

## Shapes

Assistant bubbles use a small origin corner and softer remaining corners (3px/16px); user bubbles mirror that origin corner. Outfit/design surfaces and disclosures use 12px corners, the composer 14px, and its send action 9px. Auxiliary options and context/new-message controls use 8px; written palette labels use 6px. Faces and the 46px fan control are circular. These support conversation roles and stay local to Vitty.

All route buttons have a 44px minimum height. Send is 44px square. The composer uses a red border and tinted focus-within outline; transcript focus uses a gold outline, and shared button/link keyboard focus styling remains inherited. Disabled send has its explicit local fill and full opacity.

## Components

The log is keyboard-focusable and independently scrollable. It avoids announcing the entire shared transcript repeatedly (`aria-live="off"`); a separate polite status reports sending/completion. Auto-scroll follows new content only when the reader is near the bottom; “Tin nhắn mới” provides a return action. Older history loads in 40-turn pages while preserving the reader's scroll position and retaining server files.

The composer supports Enter to send, Shift+Enter for a newline, and an IME composition guard. Draft, cosmetic avatar, anonymous author identifier, and pending outbox live in browser storage; shared questions/answers live on the server. A retry reuses the turn UUID. Errors retain a recoverable turn and expose a retry when appropriate. Fan and avatar disclosures close on Escape/outside pointer interaction; Escape returns focus to their trigger. The inherited mobile drawer retains its keyboard isolation.

The exact fan options are “Có những trang phục và sự kiện nào?”, “Tôi nên mặc gì?”, and “Tôi muốn thử đồ.” The third option leads toward the existing asset workshop; it does not add VTO. The shared-history label is “Trò chuyện chung”, and user messages distinguish “Bạn” from “Khách”. There is one anonymous shared conversation, with no account, new-chat, reset or delete control.

Structured replies support titled prose/lists, at most three validated outfit selections, at most four validated article references, and an optional written design brief. Outfit cards render the actual `OutfitScene` and navigate using `composerUrl`; article IDs navigate to existing garment/event pages. Invalid combinations and IDs are discarded rather than converted into invented recommendations. Model-provided HTML, arbitrary URLs or asset paths are not accepted. Outside-catalogue design fields describe inspiration, silhouette, palette, materials, details and cultural notes in text.

Server-side Gemini uses the existing Vertex/provider configuration and curated catalogue/library grounding. Private Cloud Storage JSON objects at `gs://c3-app-162-vitty-history/vitty/shared/<UUID>.json` retain the shared history. Object generations and pending leases guard writes/retries across instances; Cloud Run fails explicitly without configured durable storage. Private bucket access does not make the application conversation personal or private. The existing service identity's project Editor permissions were sufficient according to the supplied implementation verification; no IAM role was added. The MVP lists files for context/pagination; growth beyond the small demo history needs an index/manifest and storage read quotas, as recorded in the implementation handoff.

## Do's and Don'ts

- Keep the compact approved head-only face, existing photographic model faces, exact starters, readable answer hierarchy, independent log and pinned composer.
- Continue to use validated real catalogue selections and internal articles; use written briefs for designs outside the catalogue.
- Preserve the one shared anonymous conversation and truthful capabilities. Keep Home B, Workshop details, Library and Lookbook within their existing authority.
- Keep this route's type sizes, corners, auxiliary colours and disclosure depth local; do not promote them into global tokens without a separate system decision.
- Do not claim VTO, image generation, personal uploads, accounts, chat reset/deletion or workshop saving from this feature.

## Checked evidence and remaining documentation advisories

This pass read the documenter reference, PRODUCT.md, DESIGN.md, the existing sidecar, Vitty brief/implementation/fresh finish review, `src/components/Vitty.tsx`, `src/vitty.css`, routing/nav/import additions in `src/App.tsx`, `src/components/AppShell.tsx` and `src/main.tsx`, and the navigation, answer-contract, agent and storage sources. It opened the actual final Studio JPGs at original resolution:

- `D:/AI Arena/output/vitty-implementation-2026-10-10/review/desktop.jpg` (1440×900).
- `D:/AI Arena/output/vitty-implementation-2026-10-10/review/user-1086.jpg` (1086×638).
- `D:/AI Arena/output/vitty-implementation-2026-10-10/review/mobile.jpg` (390×844).

All three show loaded product content and the compact conversation frame; the phone capture shows all three starter choices and a full composer. Their dark top toolbar is actual Studio chrome. No blank product region or horizontal product overflow is visible. This documenter did not open a browser, start a local server, prompt Gemini, run a test, or generate a new capture/detector.

The supplied `docs/VITTY-FINISH-REVIEW.md` records `ship` against final `b0ce8fd` source, with no material fixes. Its actual Studio behavior evidence covers real Gemini answers, shared durable history, reload, a correct Workshop selection and browser Back. Those behavior checks are attributed to the reviewer/implementation packet; static JPGs alone do not establish them.

The checked receipt `D:/AI Arena/output/vitty-implementation-2026-10-10/cloud-build-final.txt` identifies build `324069d3-e70b-49a3-aede-b55827fb5de4`, the Docker verification sequence (lint, tests, client/backend build, production smoke), 39 passing tests with zero failures, and completed image push digest `sha256:19d965738a72220bad6ec291107624a816e23e8d42255d8f8af8c156cbf090f8`. These checks were not reproduced by this documenter. Source was authored locally and uploaded to actual AI Studio; Gemini's coding turn was cancelled before editing. Studio frontend uses the stable ux-preview backend because its own API returned startup HTML; public frontend uses same-origin API calls. This evidence does not establish public deployment or main promotion.

The supplied `output/vitty-implementation-2026-10-10/detector.json` contains 30 advisory findings, all in `src/vitty.css`: 18 type-size, six colour and six radius occurrences. It flags local 10/11/12/16/17px sizes, 3/9/14/16px corners, and six auxiliary colours recorded above. These are documentation alignment advisories, retained with the review's route-local adaptation disposition; no detector suppressions or global token changes were made.

Pre-existing documentation coverage remains scoped to the previously inspected surfaces: DESIGN.md's statement that no standalone text field was observed and the sidecar's incumbent primitives predate Vitty's composer. Their Home evidence and small-caption advisories retain their original scope. This pass reports that coverage gap and the supplied local drift advisories without repairing DESIGN.md or the sidecar, and it establishes no additional global visual drift. The present document is the explicit Vitty supplement.
