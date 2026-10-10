---
name: Việt Y
description: "Việt Y — biên tập di sản và trang chủ Phòng phối sáng tạo."
colors:
  vy-red: "#951D2A"
  vy-red-dark: "#761524"
  vy-gold: "#AC8145"
  vy-ink: "#302528"
  vy-muted: "#756367"
  vy-paper: "#F7F0E4"
  vy-soft: "#F7EEDD"
  vy-line: "#DECFB9"
  interface-white: "#FFFFFF"
  ornament-red: "#8E101A"
  ornament-gold: "#B18C52"
  control-border: "#DCCFC4"
  reading-muted: "#66565B"
  navigation-muted: "#67575C"
  studio-crimson: "#74121C"
  studio-gold: "#EAC77E"
  studio-ivory: "#FCF8F2"
  studio-indigo: "#193C54"
  studio-jade: "#214B3B"
  studio-ochre: "#896328"
  studio-display-ink: "#FFFAF3"
  studio-body-light: "#F9E8DD"
  studio-action-ink: "#2F201B"
  studio-reading-muted: "#675C56"
  studio-preview-paper: "#F5EDE2"
  studio-collection-paper: "#EDE5D7"
  studio-garment-paper: "#DDD0BB"
typography:
  studio-display:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "clamp(34px, 3.65vw, 55px)"
    fontWeight: 700
    lineHeight: 1.19
    letterSpacing: "-.03em"
  studio-introduction:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "14px"
    lineHeight: 1.7
  studio-section-heading:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "22px"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-.025em"
  studio-editorial-heading:
    fontFamily: '"Noto Serif Display", "Noto Serif", serif'
    fontSize: "25px"
    lineHeight: 1.25
    letterSpacing: "-.015em"
  studio-garment-title:
    fontFamily: '"Noto Serif Display", "Noto Serif", serif'
    fontSize: "20px"
    fontWeight: 550
    lineHeight: 1.25
  headline:
    fontFamily: '"Noto Serif Display", "Noto Serif", serif'
    fontSize: "clamp(36px, 4vw, 58px)"
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: "-.025em"
  section-heading:
    fontFamily: '"Noto Serif Display", "Noto Serif", serif'
    fontSize: "clamp(30px, 3.2vw, 46px)"
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: "-.025em"
  title:
    fontFamily: '"Noto Serif Display", "Noto Serif", serif'
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
  body:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "14px"
    lineHeight: 1.65
  reading:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "13px"
    lineHeight: 1.9
  control-heading:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: '"Be Vietnam Pro", sans-serif'
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.65
rounded:
  image: "2px"
  thumbnail: "4px"
  action: "5px"
  filter: "6px"
  compact: "8px"
  control: "10px"
  preview: "12px"
  studio-action: "24px"
  studio-garment: "7px"
  studio-theme: "20px"
  circle: "50%"
spacing:
  step-4: "4px"
  step-8: "8px"
  step-12: "12px"
  step-16: "16px"
  step-20: "20px"
  step-24: "24px"
  step-32: "32px"
  step-48: "48px"
  step-72: "72px"
components:
  button-primary:
    backgroundColor: "{colors.vy-red}"
    textColor: "{colors.interface-white}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "15px 24px"
  button-primary-hover:
    backgroundColor: "{colors.vy-red-dark}"
  studio-primary:
    backgroundColor: "{colors.studio-gold}"
    textColor: "{colors.studio-action-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.studio-action}"
    padding: "11px 20px"
  studio-primary-hover:
    backgroundColor: "#F6DFA6"
  studio-secondary:
    backgroundColor: "transparent"
    textColor: "#FFF8EB"
    typography: "{typography.label}"
    rounded: "{rounded.studio-action}"
    padding: "11px 20px"
  studio-hero-heading:
    textColor: "{colors.studio-display-ink}"
    typography: "{typography.studio-display}"
  studio-step:
    backgroundColor: "{colors.studio-preview-paper}"
    rounded: "{rounded.preview}"
    padding: "10px 12px"
  studio-garment-cover:
    backgroundColor: "{colors.studio-indigo}"
    rounded: "{rounded.studio-garment}"
    height: "220px"
  studio-collection:
    backgroundColor: "{colors.studio-collection-paper}"
    padding: "35px clamp(22px,3vw,46px)"
  link-quiet:
    textColor: "{colors.vy-red}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.vy-red}"
    padding: "8px 10px"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.vy-red}"
    rounded: "{rounded.compact}"
  navigation-item:
    textColor: "{colors.navigation-muted}"
    rounded: "{rounded.control}"
    padding: "11px 14px"
  navigation-item-active:
    backgroundColor: "{colors.vy-red}"
    textColor: "{colors.interface-white}"
  concept-filter:
    backgroundColor: "transparent"
    textColor: "{colors.vy-muted}"
    rounded: "{rounded.filter}"
    padding: "10px 16px"
  concept-filter-active:
    backgroundColor: "{colors.vy-red}"
    textColor: "{colors.interface-white}"
  choice-picker:
    rounded: "{rounded.control}"
  choice-picker-summary:
    padding: "13px 14px"
  segmented-option:
    backgroundColor: "transparent"
    rounded: "{rounded.action}"
  segmented-option-selected:
    backgroundColor: "{colors.vy-red}"
    textColor: "{colors.interface-white}"
  accessory-card:
    backgroundColor: "{colors.interface-white}"
    rounded: "{rounded.control}"
    padding: "9px 5px"
  accessory-card-selected:
    backgroundColor: "#FBF3EE"
  empty-gallery-card:
    backgroundColor: "#FAF8F5"
    textColor: "{colors.vy-red}"
    rounded: "{rounded.image}"
  empty-gallery-card-hover:
    backgroundColor: "#F3EAE3"
  photo-frame:
    backgroundColor: "{colors.vy-soft}"
    rounded: "{rounded.image}"
  workshop-preview:
    backgroundColor: "{colors.vy-soft}"
    rounded: "{rounded.preview}"
---

# Design System: Việt Y

## Overview

**Creative North Star: "Biên tập di sản"**

Nền giấy ngà ấm, sắc đỏ có chủ đích và hình ảnh trang phục giữ bản sắc Việt Y. Noto Serif Display tạo nhịp biên tập cho tư liệu, tên áo và thương hiệu; Be Vietnam Pro phục vụ thao tác và tiêu đề thẳng rõ của trang chủ. Nội dung đọc có khoảng thở, xưởng ưu tiên scan và thao tác.

Home now implements the user-approved B direction, “Phòng phối sáng tạo”: a compact crimson textile hero with an authored fashion plate, strong upright sans-serif copy and warm gold workshop action. Ivory sections introduce the composition flow, actual garment covers, a graphic Lookbook introduction and cultural reading. This is a Home-specific expression of the product; the existing navigation, workshop, shared Lookbook and cultural routes retain their established palette and component grammar. The old oversized heritage hero and its flourish/wave composition are superseded on Home.

**Key Characteristics:**

- Warm ivory paper and deliberate red; Home uses warm gold for its primary action.
- Serif editorial accents paired with Vietnamese sans-serif controls and Home display type.
- Compact crimson Home hero, followed immediately by tangible catalogue previews.
- A collapsible left navigation and compact selection controls.
- Separate rhythms for reading, image browsing, and outfit composition.

Extraction sources: `src/homeStudio.css` and `src/components/Home.tsx` define the shipped Home vocabulary and behavior. `src/assets/landing/studio-hero.webp` supplies the hero; its generated-art provenance is in `docs/HOME-STUDIO-ASSET-PROVENANCE.json`. `src/data/vietYCatalog.ts` supplies real occasion, garment, color and accessory previews. `src/vietY.css` and the existing shell/workshop/Lookbook/library components remain the source of shared and other-route guidance. `HeritageOrnaments.tsx` supplies the braided flower used on Home; `AppShell.tsx` supplies the shared diamond brand. `index.html` and `public/fonts/fonts.css` supply language, theme color and local fonts. Qualitative authority for the Home replacement is `docs/HOME-STUDIO-SURFACE-BRIEF.md`, recording the user's approved B direction. The sidecar uses schema version 2.

Current Home evidence is `D:/AI Arena/output/home-studio-release-2026-10-10/desktop.jpg`, `user-1280.jpg` and `mobile.jpg`. `docs/HOME-STUDIO-FINISH-REVIEW.md` independently inspected the repaired valid captures and records disposition `ship` for Home only. This documentation pass reads the code and that report; it does not repeat browser review or claim new tests, automated comp-diff, build-gate or QUALITY BAR receipts. The older `ux-v2-review-2026-10-10` captures retain historical evidence for other routes and navigation; their old Home hero is superseded. The supplied functional/test/build evidence and remaining small-caption/internal-scroll advisories are attributed to the finish report, not reproduced here.

## Colors

The frontmatter preserves CSS values rather than introducing a replacement palette. The eight `vy-*` entries are root custom properties. The six `studio-*` palette primitives are local properties on Home; they do not change the shared shell or other routes. Remaining entries record observed literals, not new CSS variables. Legacy ornament colors belong to the existing SVG asset vocabulary, not the current Home hero.

### Primary

- **Đỏ son — vy-red:** shared/other-route primary actions, active navigation and filters, selected borders, italic heading accents, links, focus outlines, and caret color. Also the HTML theme color.
- **Đỏ dệt trầm — studio-crimson:** Home textile ground, sequence markers, collection headings and quiet route links.
- **Đỏ son đậm — vy-red-dark:** hover state of primary and selected segmented actions; occasion photo captions.
- **Đỏ nét di sản — ornament-red:** the red line and small floral detail in the existing headline flourish.

### Secondary

- **Vàng đồng — vy-gold:** fine editorial lines and small status details. Its observed use is restrained, matching the confirmed brand direction.
- **Vàng nét di sản — ornament-gold:** the existing flourish and curved paper divider thread.
- **Vàng ấm — studio-gold:** Home workshop action. Unlike the quieter shared gold, this is a filled action surface.
- **Chàm — studio-indigo; ngọc — studio-jade; đất vàng — studio-ochre:** Home garment-cover grounds differentiated by garment. They support catalogue photography rather than selectable outfit colors.

### Neutral

- **Giấy ngà — vy-paper:** shared body canvas and phone shell.
- **Giấy ngà ấm — vy-soft:** sidebar, editorial sections, preview support, image backing, and curved paper divider fill.
- **Interface white:** action text on red and literal-white picker, accessory, and photo-caption surfaces.
- **Mực — vy-ink:** default text and headings.
- **Mực dịu — vy-muted:** descriptions, small labels, and secondary copy.
- **Đường giấy — vy-line:** subtle dividers and section boundaries.
- **Control border:** stronger warm stroke for pickers, segmented controls, and accessory choices.
- **Reading muted:** explanatory paragraphs and cultural reading copy.
- **Navigation muted:** resting navigation and collapse control labels.
- **Studio ivory / preview paper / collection paper / garment paper:** Home canvas, connected preview steps, graphic collection band and light giao lĩnh cover respectively.
- **Studio display ink / body light / action ink / reading muted:** light hero headline, lighter hero description, dark text on gold and repeated muted Home explanations.

**The Route Palette Rule.** Preserve shared red action/selection states; Home alone uses warm gold for the hero workshop action and its local studio palette.

State colors remain local to their components, including muted rose selection backgrounds, the green ready indicator, and the translucent ink drawer backdrop. Garment swatch colors describe catalogue content and are separate from the interface palette. Sidecar tonal ramps are synthesized OKLCH swatch previews, not extracted application colors or an implemented tonal scale.

## Typography

**Display Font:** Be Vietnam Pro on Home; Noto Serif Display, with Noto Serif and serif fallbacks, for shared editorial page headings.

**Body Font:** Be Vietnam Pro, with a sans-serif fallback.

The serif gives editorial headings and image stories their heritage cadence. The sans-serif makes controls, metadata, and longer factual reading easier to scan. Heading emphasis uses italic red at weight 400; regular major headings use weight 500 and balanced wrapping. There is no separate monospace role or declared mathematical type scale.

The frontmatter captures shared roles plus Home's sans display/introduction/section headings and serif flow/garment headings. It is not a universal base font-size declaration: `body` itself leaves its size to the browser; the documented body role is used by page descriptions. Smaller Home preview labels vary from 9–11px, with 12–14px explanation/action copy; the single label role does not replace every metadata style. CSS weights 550 and 650 are recorded as authored values; local font faces register discrete weights rather than a variable font.

Home's two-line upright headline uses the `studio-display` role, becomes 36px from 760–1150px and uses `clamp(30px,8.6vw,42px)` on phones. The hero description is 14px desktop and 13px phone, limited to 46ch. Home's flow introduction and garment names explicitly restore serif; collection and knowledge headings remain sans. Collection heading is 27px/1.3 at weight 650; step headings are 14px desktop and 15px phone. Page headings remain 37px and the workshop heading 25px on phones. Reading measures remain local: page descriptions 58ch, article leads 62ch, image stories 60ch, meaning paragraphs 68ch and Home collection explanation 54ch.

Local font files register Be Vietnam Pro normal weights 400, 500, 600, and 700; Noto Serif Display normal weights 400, 500, and 600 plus italic 400. `font-display: swap` is implemented. The independent Home report confirms upright display type and serif accents in the current captures; this is not a separate font-file or all-glyph audit.

**The Two Voices Rule.** Preserve serif editorial accents and sans-serif interaction; Home also uses the sans-serif for its main display message.

## Layout

Values below describe the implementation; surface compositions remain in the design contract.

| Pattern | Observed implementation |
| --- | --- |
| Desktop shell | Fixed left navigation, 184px wide; content margin follows the nav width; collapsed navigation is 76px. |
| Tablet shell | At viewport widths up to 1080px, expanded navigation is 156px. |
| Phone shell | At widths up to 759px, a 56px header replaces the content offset; the sidebar becomes a 240px drawer with a backdrop. |
| General page | Maximum width 1320px; desktop padding `44px clamp(20px,4.2vw,68px) 72px`; phone padding `30px 20px 48px`. |
| Home frame / hero | Maximum width 1660px; hero minimum height 380px, rising to 410px from 1550px. Copy is 46% wide, at most 590px, with `30px 0 28px clamp(26px,3.4vw,52px)` padding. Art covers the scene at center. |
| Home tablet | From 760–1150px, copy is 51% wide with 24px left padding; art position becomes `60% center`, the copy gradient strengthens, flow intro spans above the three steps, and garment covers use a 155px minimum column / 205px height. |
| Home phone hero | Up to 759px, copy comes first on crimson paper, followed by a 175px model crop at `78% center`; the desktop overlay is removed. Copy padding is `28px 22px 24px`. |
| Home flow | Desktop intro/steps grid `minmax(155px,.72fr) minmax(0,3fr)`, gap 20px; steps use three equal columns with 16px gaps. Phone steps stack, connector chevrons disappear, and preview rows retain their own horizontal scroll. |
| Home garment lineup | Auto-fit columns at minimum 175px, gap 10px, covers 220px high. Phones use two equal columns with 12px gaps and 220px covers. |
| Home collection / reading | Graphic collection band has `.7fr 2fr 1fr` columns and 30px gap; phones use one column and wrapping theme labels. Knowledge row wraps and footer navigation moves onto its own row. |
| Workshop | `100dvh` shell, hidden shell overflow, flex content; controls have their own vertical scroll and overscroll containment. |
| Workshop columns | `minmax(265px,330px) minmax(0,1fr)` with 26px gap; at up to 1080px, `minmax(245px,290px)` with 16px gap. |
| Phone workshop | Preview is above controls, starts at 46% of available content height with 180px minimum; at up to 380px it uses 43% and 155px minimum. Caption row reduces from 72px to 49px. |
| Lookbook | Three columns with `32px 24px` gaps; four columns from 1500px; two columns with `25px 14px` gaps on phones. |
| Library index | Two columns, `1.1fr 1fr` on desktop and `1fr 1fr` on phones; phone gap 16px, reducing to 12px at up to 380px. |
| Detail layouts | Look and cultural articles place image and copy side by side on desktop and stack on phones. |

Repeated spacing values are extracted literals, not a CSS custom-property spacing API. Home uses compact sections with `clamp(22px,3vw,46px)` horizontal padding, changing to 20–22px on phones; the existing editorial routes retain their more spacious rhythm. Gallery portrait imagery is commonly 3:4, while occasion cards temporarily use 5:4 at the tablet breakpoint. Home art crops to its scene dimensions. Garment cutouts use `contain`; editorial people and places use `cover`. The partially clipped last mini garment at 1280px is an internal scroll affordance recorded by the finish reviewer; the complete garment lineup appears below. Do not hide this internal overflow as the catalogue expands.

## Elevation & Depth

Shared `vietY.css` uses no box shadows; its depth comes from ivory blocks, thin borders, crop boundaries, photo captions and the drawer backdrop. Home adds a directional crimson gradient over its raster for readable left-hand copy, and garment-cover gradients protect text over cutouts. Its gold action alone gains the soft hover shadow recorded in the sidecar; resting surfaces remain flat. Floating modal depth is not the grammar of ordinary workshop choices: pickers expand inline with their options capped at 320px height, reducing to 260px on phones.

Navigation is layered above content (z-index 30), its phone backdrop is 29, the phone header is 25, and the skip link is 100. This is interface layering, not a shadow scale.

**The Paper Layers Rule.** Use the implemented paper tones, borders, and image framing to distinguish surfaces.

## Shapes

Gallery and record photography has nearly square corners, distinct from softer control radii. Home uses an edge-to-edge rectangular hero, rounded action pills (studio-action), softly rounded steps (preview), compact garment covers (studio-garment) and outlined theme pills (studio-theme). Preview image corners use filter and action radii; caption corners use thumbnail. The studio action radius is not a change to shared buttons. Navigation and selection cards retain the control radius, and the outfit preview retains preview. Circles identify Home sequence numbers, color previews, garment arrows, shared swatches and status/open affordances. The shared brand is the nested diamond line mark; the braided flower is a separate cultural motif in the Home signature and collection divider.

Observed outlines include thin warm borders and a red 2px keyboard focus outline with a 4px offset on buttons, links, and summaries. Selected swatches use a separate red 2px outline with a 3px offset. The empty gallery tile uses a dashed border; most editorial content is organized by dividers rather than boxed cards.

## Components

### Actions

Primary actions are solid red with white text and a dark red hover state; their minimum height is 50px and their spacing is in the frontmatter. Active presses move down 1px. Quiet and back links have a 44px minimum height and underline on hover with a 5px underline offset. Text actions use smaller sans-serif labels, a 44px minimum height, and a pale warm hover fill; icon actions have a 44px minimum width and height. Disabled buttons retain the shared not-allowed cursor and 0.42 opacity.

Home's workshop action is warm gold with dark text and its knowledge action is outlined on crimson. Both have 45px minimum height (44px phone), with spacing/radius in the frontmatter; phone padding reduces to `10px 16px`. Gold hover lightens and adds the sidecar shadow; the outlined action gains a translucent warm fill. Hero focus uses a pale gold outline, retaining the shared 2px width and 4px offset. Other Home route links retain a 44px minimum height and hover underline.

### Studio hero and previews

Home uses `studio-hero.webp`, an authored 2172×724 fashion plate with no baked text or controls. Its alt text describes male indigo ngũ thân and female red Nhật Bình models beside a material board; HTML holds the message “Mặc nét Việt. / Phối chất riêng.” and the actions. The artwork loads with high fetch priority and declared dimensions. Catalogue previews below are lazy-loaded; occasion and garment links pass real IDs through `composerUrl`, while the larger covers link to garment articles. Ordered step numbers express the choosing sequence, not inventory totals. Home swatches and accessories are static decorative previews rather than landing selection controls; colour swatches have name tooltips, while action links have explicit names. The mobile copy/art order is specified in Layout.

### Garment covers and collection divider

Garment covers use the actual `GARMENTS` data, locally toned backgrounds, contained cutouts enlarged/cropped in their frames, serif names, concise subtitles and an outlined circular arrow. Hover shifts the image 3px left and lightly fills the arrow. Home has no fixed inventory count. The Lookbook section is an ivory-toned graphic introduction: image-stack icon, label and braided flower; sans heading and collection-purpose copy; decorative outlined theme labels. Its single action opens `/lookbook`. It contains no starter photographs and claims no personal collection management. The existing destination remains a shared mock gallery with starter images, detail/download and generated introductory copy; no auth, personal upload, VTO or workshop-save capability is introduced.

### Navigation

Navigation rows use sans-serif labels, line icons, 48px minimum height, warm neutral resting text, a pale warm hover background, and a solid red current-page state. The collapsed desktop state removes visible labels while retaining accessible names and titles. The mobile drawer is coded to trap Tab focus among visible links and enabled buttons, filtering candidates by `getClientRects()` and excluding nodes inside inert ancestors. It closes with Escape and route changes and restores prior focus. While the modal drawer is open, the main content and mobile header are inert and hidden from assistive technology; the clickable backdrop has `tabIndex=-1` and `aria-hidden=true`. The hidden drawer itself remains inert and hidden from assistive technology. These interaction details are code observations; static screenshots alone do not establish keyboard or assistive-technology behavior.

### Concept filters

Lookbook concept filters are softly rounded, minimally filled buttons with a 44px minimum height. Active filters use red and white and expose `aria-pressed`. On phones the row scrolls horizontally instead of wrapping.

### Compact pickers and selections

Ordinary choices use native details/summary pickers with a label, selected value, rotating chevron, and a bordered rounded frame. Options are thumbnail rows with a pale hover fill, muted rose selected fill, and a check icon. Choosing an option closes the picker and returns focus to its summary with `preventScroll`; Escape does the same when the picker is open, preventing the default action and stopping propagation. Moving focus outside closes the picker without returning focus. This is an inline expanding picker, not a positioned popover. The sidecar's picker sample demonstrates the closed summary and native disclosure; live option data, thumbnails, selection handlers, and focus-return behavior are provided by the application.

Person controls use a segmented group with 38px minimum-height options; unavailable options are disabled. Color swatches combine a circular color, selected outline, check, accessible color name, and `aria-pressed`. Accessories are compact three-column image choices with warm borders, red selection borders, pale selected fill, and checkmarks. The photographic turban thumbnail crops the source sprite with SVG `viewBox="410 20 200 140"`, placing the 1024 × 1536 source image inside a 66px × 55px thumbnail; other accessory images keep their 52px × 52px contained-image treatment. The documented no-accessory sample corresponds to the existing diagonal-line option. No standalone text input or text-field system appears in the inspected surfaces, so none is invented here.

### Photography and cultural records

Look tiles are links containing portrait photos, a circular arrow affordance, serif titles, and compact concept labels. Hover enlarges the image slightly while clipping it inside its frame. The empty gallery tile is an actual route to the workshop, with a camera icon and dashed border. Cultural garment records pair cutout imagery with concise text and a directional arrow; event records put a white caption on a place photograph. Detail pages use normal navigation and full-size imagery rather than modal article readers.

### Outfit scene and feedback

The outfit scene uses a fixed SVG composition plane (1086 × 1448) to place photographic background, figure, and accessory assets. Garment color changes select pre-rendered image files. Images preload as a group; the scene displays a loading status, retry action on load failure, and a ready caption indicator. Workshop updates use a polite live region. Look stories retain existing introductory copy while loading and expose a refresh action for fallback content. The shared gallery content is supplied from catalogue data; its empty tile does not claim an implemented VTO or upload flow.

Motion is functional and restrained: navigation width/drawer transitions, picker-chevron rotation, hover backgrounds, small photo transforms and a loading spinner. Home action/mini-garment state transitions use 0.2s ease and cover translation 0.3s ease. Home's reduced-motion query removes all descendant transitions; shared rules switch smooth scrolling to automatic and reduce animation/transition duration to 0.01ms. Exact durations are recorded in the sidecar.

Implementation scope: `index.html` declares Vietnamese, the theme color agrees with shared red, and font faces are local. Existing experience tests cover drawer isolation, focus wrapping/Escape restoration and picker focus return; the drawer visibility model uses mocked `getClientRects()` because JSDOM has no layout. The independent finish report supplies the Home `ship` disposition and attributes navigation shortcuts, Back, 33 passing tests and passing lint/build/smoke to the implementation packet. This documentation pass does not reproduce those checks, certify other routes or deployment, or claim a full assistive-technology audit. Preview captions at 9–11px remain the report's readability advisory.

## Do's and Don'ts

### Do:

- Do preserve shared ivory/red identity and Home's local crimson, warm gold and garment-cover palette.
- Do preserve the approved compact Home hero and code-based message/actions; use the documented mobile copy-then-art order.
- Do keep serif editorial accents and Be Vietnam Pro Home display/interaction roles distinct.
- Do generate Home previews and garment links from catalogue data without fixed inventory-count copy.
- Do keep Home's Lookbook introduction photographic-tile-free and its shared mock destination truthfully described.
- Do let photographs of garments and places carry the cultural content.
- Do keep workshop controls independently scrollable while the preview stays visible.
- Do preserve explicit selected, loading, empty, retry, and disabled states.
- Do keep cultural detail pages and image details addressable through normal navigation.

### Don't:

- Don't apply Home's gold actions, display scale or compact section rhythm to other routes without a separate design decision.
- Don't replace garment or location photography with decorative boxes or icons.
- Don't add long technology labels or disclaimers to the main workshop flow.
- Don't present demo testimonials as verified customer evidence.
- Don't imply VTO, personal uploads, or workshop saving are implemented.
- Don't reinterpret catalogue garment colors as the interface palette.
