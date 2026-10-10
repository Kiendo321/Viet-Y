# Vitty — conversation surface

Mode: Operate. Code-led extension of the existing Việt Y system.

## Direction contract

THESIS: Ask a cultural guide; understand the garment or leave with an actionable outfit/design idea.
OWN-WORLD: Existing ivory paper, crimson controls, quiet gold accents, Be Vietnam Pro. Actual approved Vitty A image, cropped to face and khăn đóng; actual model faces from the catalog. No large mascot, generic hero, eyebrow, decorative card grid or new visual world.
STORY: Question → structured answer → matching cultural article or a real selection in Xưởng phối.
FIRST VIEWPORT: Existing collapsible left navigation gains Vitty. Compact avatar/header, assistant left/user right, conversation scrolls independently, composer anchored below. A welcome message demonstrates answer formatting. Fan disclosure above input exposes exactly three approved starters.
FORM: One shared anonymous conversation across all demo visitors. No reset/delete/new-chat control. Cosmetic model-avatar choice; labels distinguish Bạn/Khách. Normal URLs and browser history. Mobile composer stays visible, drawer retains keyboard isolation.
FINISH: Working Gemini API, validated cards, durable file storage, honest recoverable errors, desktop/mobile verification and independent review. No VTO or image generation in this scope.

## Interactions and data

- `/vitty`; welcome text, headings, paragraphs and lists. Structured outfit, article and written design-brief cards.
- Starters: Có những trang phục và sự kiện nào? / Tôi nên mặc gì? / Tôi muốn thử đồ.
- Enter sends; Shift+Enter adds a line; IME composition must not send. Draft survives navigation/reload. Retry reuses turn ID; no duplicate user message. Auto-scroll only near bottom; new-message button when reading history.
- Avatar choices use the existing male and female model; choice is not a preference/gender inference and is persisted with each submitted turn.
- Backend uses existing createGenaiClient/model configuration; curated catalog and library ground the prompt. All model IDs validated before display; no arbitrary HTML, URLs, assets or invented cultural dates. Unknown design is a written brief, never a mislabeled catalog photo.
- Shared history is JSON turn files: local atomic file writes for Studio; private Cloud Storage objects with generation preconditions for Cloud Run. Pending leases and stable IDs prevent duplicate replies across retries/instances. History pagination keeps old files. Cloud Run without configured durable storage must fail explicitly.
- No secret exposed to frontend, no local dev runtime. Author source locally, upload to actual Studio tab, inspect Studio preview. Production build verification belongs to Cloud Build.

## Scope boundary

Preserve Home B, Workshop detail composition, Library and Lookbook. Avatar provenance: approved `output/vitty-concepts-2026-10-10/vitty-a-cultural-guide.png`, copyright acknowledgement approved by user. Crop is CSS viewport positioning of the original image, not a new generated asset.
