# Việt Y — documentation of the Library and detail extension

Recorded 10 October 2026 from the completed local implementation. This is an ordinary extension of **Biên tập di sản**, using the incumbent warm ivory, red and restrained gold, Noto Serif Display and Be Vietnam Pro. The approved magazine composition is a surface decision; it does not establish a replacement brand or a universal type scale.

`DESIGN.md` and `.impeccable/design.json` are preserved unchanged. Their global primitives and named rules remain authoritative. The tables below record roles local to `src/editorialDetails.css`; they are extraction records of literal styles, not new CSS custom properties or additional global tokens. Their scope is the workshop detail rail and Library magazine pages. The durable surface brief is `LIBRARY-DETAILS-SURFACE-BRIEF.md`; the user's approved scope is in `LIBRARY-DETAILS-DESIGN-CONTRACT.md`.

## Local color roles

| Local role | Source value | Actual application |
| --- | --- | --- |
| Detail paper | `#FFFCF7` | Scrollable rail and sticky rail header. |
| Detail connectors | `#B58B48` | Thin static SVG wires and dots, within the incumbent gold family. |
| Reading ink | `#59483D` | Opening and chapter paragraphs on ivory. |
| Contents ink | `#6C4D42` | Contents links; hover returns to `--vy-red`. |
| Event caption text | `#F0DCCC` | Short supporting copy over the dark red event image caption. |
| Event caption arrow | `#E3C79B` | Small arrow on that same caption. |
| Red spread copy | `#F7E9D8` | Contemporary spread text over `--vy-red-dark`. |
| Red spread heading | `#FFF4E8` | Contemporary heading over the same dark red. |
| Practical paper | `#F1E4D4` | Event preparation spread. |

The existing `#66565B` reading neutral and `#756367` muted neutral are reused for detail copy, leads, facts, FAQ and captions. Main actions, index heading, borders and red spreads reference the incumbent variables. Plain detail crops retain OutfitScene's `#F4EFE6` backing; it is a scene material, not a new application palette. No shadows or replacement font family are introduced.

## Local type roles

All editorial headings inherit the incumbent serif voice unless a sans-serif fact/control role is explicitly assigned. Controls and paragraphs inherit the incumbent sans-serif voice. These sizes describe the built surface; they are not a prescription to replace the landing scale.

| Role | Observed CSS |
| --- | --- |
| Article title | `clamp(36px,4.4vw,64px)`, line-height `1.14`; `36px` at viewport ≤759px. |
| Opening heading | `clamp(34px,3.5vw,50px)`; contemporary heading `36px`, `32px` on phones. |
| Chapter heading | `31px`, `29px` on phones. |
| Anatomy heading / detail title | `36px` / `24px`, serif title weight `500`; anatomy heading `30px` on phones. |
| Construction note title | `21px`, serif. |
| Index record title | `25px`, `24px` on phones. |
| Rail header / row title | `23px` / `20px`, row title weight `500`; header `20px` at container ≤650px. |
| Article prose | `14px`, line-height `1.95`, maximum `68ch`; lead `14px`, line-height `1.85`, maximum `67ch` (`13px` lead on phones). |
| Anatomy / construction copy | `13px`, line-height `1.85`. |
| Rail copy | `12px`, line-height `1.8`; `13px` when preview container ≥820px. |
| Contents / compact metadata | `12px`; fact labels sans-serif weight `600`; opening figure caption `11px`. |
| FAQ | `14px` summary and answer; answer line-height `1.9`, maximum `70ch`. |

Other section sizes remain local: FAQ/related headings `30px`, event look heading `34px`, practical heading `28px`, event cover caption `25px` (`22px` phone). These are observed editorial relationships, not a new global heading taxonomy. Small fact labels are factual labels, not invented decorative kickers.

## Local composition and behavior

The preview with details open uses `minmax(0,1fr) minmax(286px,43%)`. Rows place square crops left and descriptive copy right, using `80px` crops and `14px` gaps; at preview container ≥820px crops become `100px`. The rail scrolls independently with a sticky header. At preview container ≤650px it stacks below the figure, receives a top border and hides connectors. At viewport ≤759px the open-detail preview flex basis becomes `65%`. These container and viewport decisions are local to the workshop extension.

Each garment supplies three detail records. Each crop renders OutfitScene with the current selection; connector points and crop data come from `garmentDetails.ts`. Wires are noninteractive and omit rows outside the visible rail. Opening focuses the close button; close and Escape return focus to the trigger without changing the selection. This behavior is observed in source, not established by static screenshots alone.

Article width is capped at `1440px`. Desktop garment openings use a three-panel image band at `400px` height and ratio `1.2fr .85fr 1.2fr`; at viewport ≤759px it becomes a two-panel `285px` band. The phone composition intentionally omits the third image. Contents wrap, chapters use serif headings next to long prose, anatomy has three columns, and contemporary contexts sit on a dark red spread. At ≤759px chapters/anatomy/related records stack; the contemporary spread uses `25px 20px` padding and a local `-20px` inline margin to meet the page edge. Event preparation is a two-column pale spread that stacks on phones. At ≤1100px article heading/action stack and the opening prose becomes one column.

Library index keeps its two categories on desktop and stacks them at ≤759px. Photographs and OutfitScene renders carry garment and location content. Ordinary links retain addressable routes; article calls to action pass garment or event selection to the workshop. Native disclosure supplies FAQ expansion. Historical source IDs and source scope remain internal in `libraryArticles.ts` and `CULTURAL-RESEARCH-V2.md`; practical styling advice is editorial, without a specialist-review claim.

## Evidence and limits

Source checked: `src/vietY.css`, `src/editorialDetails.css`, `src/components/Library.tsx`, `OutfitDetails.tsx`, `OutfitScene.tsx`, `src/data/garmentDetails.ts`, and internal research; compared to `PRODUCT.md`, `DESIGN.md` and schema-v2 `.impeccable/design.json`.

This documentation pass directly opened `.impeccable/review/desktop.jpg`, `garment-desktop.jpg` and `garment-mobile.jpg`. They show the three-row rail and full figure, serif article lead/triptych, and phone title/action/contents/two-image sequence. The independent finish reviewer reports directly opening all 13 captures and records its **ship** disposition in `LIBRARY-DETAILS-FINISH-REVIEW.md`; that report owns the complete capture review. No browser interaction, detector, build or test was rerun for documentation, and no fresh deployment or external-source authentication is claimed.

The supplied detector has 33 advisory entries (25 type-size and 8 color entries), with zero primary findings. The local roles above explain the coherent extension without adding every literal to the global machine-readable system merely to silence advisories.

## Drift not canonized or repaired

The root system remains the earlier incumbent snapshot: its Library mobile two-column layout, compact record imagery and white event caption prose no longer describe this approved local magazine surface. This extension-specific delta belongs in this note and its surface brief. Earlier documentation also already acknowledges contextual 9–13px metadata outside its single label role; those pre-existing exceptions are not expanded into a global scale or repaired. No unrelated brand drift was identified in the sampled code. The finish review found no material defect; this pass introduces no global rule legitimizing a defect and changes no UI.
