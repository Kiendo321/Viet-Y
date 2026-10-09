---
name: Việt Y
description: "Biên tập di sản — Nếp xưa. Cách mặc hôm nay."
colors:
  vy-red: "#951D2A"
  vy-red-dark: "#761524"
  vy-gold: "#AC8145"
  vy-ink: "#302528"
  vy-muted: "#756367"
  vy-paper: "#FFFFFF"
  vy-soft: "#F6F3EE"
  vy-line: "#E9E1D8"
  control-border: "#DCCFC4"
  reading-muted: "#66565B"
  navigation-muted: "#67575C"
typography:
  display:
    fontFamily: '"Noto Serif Display", "Noto Serif", serif'
    fontSize: "clamp(40px, 4.3vw, 66px)"
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: "-.025em"
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
    textColor: "{colors.vy-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "15px 24px"
  button-primary-hover:
    backgroundColor: "{colors.vy-red-dark}"
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
    textColor: "{colors.vy-paper}"
  concept-filter:
    backgroundColor: "transparent"
    textColor: "{colors.vy-muted}"
    rounded: "{rounded.filter}"
    padding: "10px 16px"
  concept-filter-active:
    backgroundColor: "{colors.vy-red}"
    textColor: "{colors.vy-paper}"
  choice-picker:
    rounded: "{rounded.control}"
  choice-picker-summary:
    padding: "13px 14px"
  segmented-option:
    backgroundColor: "transparent"
    rounded: "{rounded.action}"
  segmented-option-selected:
    backgroundColor: "{colors.vy-red}"
    textColor: "{colors.vy-paper}"
  accessory-card:
    backgroundColor: "{colors.vy-paper}"
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

Trang giấy trắng, đỏ son dùng có chủ đích, vàng đồng làm nét nhỏ. Typography Noto Serif Display cho nhịp biên tập và Be Vietnam Pro cho thao tác, tiếng Việt đầy đủ. Ảnh người mặc và địa điểm thực sự là vật liệu; không dùng box/icon để thay ảnh. Nội dung đọc có khoảng thở, xưởng thì ưu tiên scan và thao tác.

The confirmed heritage editorial world is preserved here as an extraction of the current implementation. Photography carries the garments and settings; white and warm paper surfaces support reading, while compact controls support selection. This document records code, not a rendered visual approval: no current screenshots or computed-style inspection were available during extraction, and browser visual verification remains pending.

**Key Characteristics:**

- White paper, deliberate red, restrained gold details.
- Serif editorial headings paired with Vietnamese sans-serif controls.
- Photography leads; the interface gives images space.
- A collapsible left navigation and compact selection controls.
- Separate rhythms for reading, image browsing, and outfit composition.

Extraction sources: `src/vietY.css` supplies the palette, type assignments, layout, radius, motion, and state styles; `src/components/AppShell.tsx`, `Home.tsx`, `Workshop.tsx`, `OutfitScene.tsx`, `Lookbook.tsx`, and `Library.tsx` supply structure and behavior. `index.html` supplies the Vietnamese document language, title, theme color, and local font stylesheet link; `public/fonts/fonts.css` supplies font registrations. Qualitative language comes from `PRODUCT.md` and `docs/VIET-Y-DESIGN-CONTRACT.md`. The sidecar uses schema version 2 from Impeccable's `reference/document.md`.

## Colors

The frontmatter preserves CSS values rather than introducing a replacement palette. The eight `vy-*` color entries correspond directly to root custom properties. The remaining neutral entries capture literal colors reused for control borders, reading copy, and navigation labels; they are not new CSS variables.

### Primary

- **Đỏ son — vy-red:** primary actions, active navigation and filters, selected borders, italic heading accents, links, focus outlines, and caret color. Also the HTML theme color.
- **Đỏ son đậm — vy-red-dark:** hover state of primary and selected segmented actions; occasion photo captions.

### Secondary

- **Vàng đồng — vy-gold:** fine editorial lines and small status details. Its observed use is restrained, matching the confirmed brand direction.

### Neutral

- **Trang giấy trắng — vy-paper:** body canvas, primary text on red, image captions, and selection surfaces.
- **Giấy ấm — vy-soft:** sidebar, editorial sections, preview support, and image backing.
- **Mực — vy-ink:** default text and headings.
- **Mực dịu — vy-muted:** descriptions, small labels, and secondary copy.
- **Đường giấy — vy-line:** subtle dividers and section boundaries.
- **Control border:** stronger warm stroke for pickers, segmented controls, and accessory choices.
- **Reading muted:** explanatory paragraphs and cultural reading copy.
- **Navigation muted:** resting navigation and collapse control labels.

**The Restrained Gold Rule.** Keep gold as the confirmed small cultural accent; red carries action and selection.

State colors remain local to their components, including muted rose selection backgrounds, the green ready indicator, and the translucent ink drawer backdrop. Garment swatch colors describe catalogue content and are separate from the interface palette. Sidecar tonal ramps are synthesized OKLCH swatch previews, not extracted application colors or an implemented tonal scale.

## Typography

**Display Font:** Noto Serif Display, with Noto Serif and serif fallbacks.

**Body Font:** Be Vietnam Pro, with a sans-serif fallback.

The serif gives editorial headings and image stories their heritage cadence. The sans-serif makes controls, metadata, and longer factual reading easier to scan. Heading emphasis uses italic red at weight 400; regular major headings use weight 500 and balanced wrapping. There is no separate monospace role or declared mathematical type scale.

The frontmatter captures observed roles: landing display, page headline, section heading, garment record title, page body, cultural reading, control heading, and primary action label. It is not a universal base font-size declaration: `body` itself sets its family and line-height but leaves its size to the browser; the documented body role is used by page descriptions. Smaller labels vary by context from 9–13px, so the single label role does not replace every metadata style.

Major headings use the shared serif tracking and line-height in the frontmatter, unless explicitly overridden. At phone widths, the landing heading becomes 42px, page headings 37px, and the workshop heading 25px; at the smallest breakpoint the landing heading becomes 37px. Reading measures are local: page descriptions use 58ch, article leads 62ch, image stories 60ch, and meaning paragraphs 68ch.

Local font files register Be Vietnam Pro normal weights 400, 500, 600, and 700; Noto Serif Display normal weights 400, 500, and 600 plus italic 400. `font-display: swap` is implemented. Font rendering and Vietnamese glyph appearance still require browser inspection.

**The Two Voices Rule.** Preserve the serif for editorial expression and the sans-serif for interaction and scanning.

## Layout

Values below describe the implementation; surface compositions remain in the design contract.

| Pattern | Observed implementation |
| --- | --- |
| Desktop shell | Fixed left navigation, 184px wide; content margin follows the nav width; collapsed navigation is 76px. |
| Tablet shell | At viewport widths up to 1080px, expanded navigation is 156px. |
| Phone shell | At widths up to 759px, a 56px header replaces the content offset; the sidebar becomes a 240px drawer with a backdrop. |
| General page | Maximum width 1320px; desktop padding `44px clamp(20px,4.2vw,68px) 72px`; phone padding `30px 20px 48px`. |
| Landing frame | Maximum width 1500px; two-column hero uses `1.05fr 1fr`; phone sections stack. |
| Workshop | `100dvh` shell, hidden shell overflow, flex content; controls have their own vertical scroll and overscroll containment. |
| Workshop columns | `minmax(265px,330px) minmax(0,1fr)` with 26px gap; at up to 1080px, `minmax(245px,290px)` with 16px gap. |
| Phone workshop | Preview is above controls, starts at 46% of available content height with 180px minimum; at up to 380px it uses 43% and 155px minimum. Caption row reduces from 72px to 49px. |
| Lookbook | Three columns with `32px 24px` gaps; four columns from 1500px; two columns with `25px 14px` gaps on phones. |
| Library index | Two columns, `1.1fr 1fr` on desktop and `1fr 1fr` on phones; phone gap 16px, reducing to 12px at up to 380px. |
| Detail layouts | Look and cultural articles place image and copy side by side on desktop and stack on phones. |

Repeated spacing values are captured as numeric steps in the frontmatter; these are extracted literals, not a CSS custom-property spacing API. Larger editorial sections use more breathing room than workshop controls. Portrait imagery is commonly 3:4; phone hero imagery uses 4:5, while occasion cards temporarily use 5:4 at the tablet breakpoint. Garment cutouts use `object-fit: contain`; editorial people and places use `cover`.

## Elevation & Depth

The stylesheet declares no box shadows. Depth comes from warm paper blocks, thin borders, crop boundaries, white captions on photography, and the drawer backdrop. Floating modal depth is not the grammar of ordinary workshop choices: pickers expand inline with their options capped at 320px height, reducing to 260px on phones.

Navigation is layered above content (z-index 30), its phone backdrop is 29, the phone header is 25, and the skip link is 100. This is interface layering, not a shadow scale.

**The Paper Layers Rule.** Use the implemented paper tones, borders, and image framing to distinguish surfaces.

## Shapes

Photography has nearly square corners; the small image radius is distinct from the softer control radii. Buttons and segmented options use the action radius, navigation and selection cards use the control radius, and the outfit preview uses the largest observed container radius. Circles are reserved for swatches, loading/status dots, and photo-open affordances. The brand symbol is the nested diamond line mark from `AppShell.tsx`.

Observed outlines include thin warm borders and a red 2px keyboard focus outline with a 4px offset on buttons, links, and summaries. Selected swatches use a separate red 2px outline with a 3px offset. The empty gallery tile uses a dashed border; most editorial content is organized by dividers rather than boxed cards.

## Components

### Actions

Primary actions are solid red with white text and a dark red hover state; their minimum height is 50px and their spacing is in the frontmatter. Active presses move down 1px. Quiet and back links have a 44px minimum height and underline on hover with a 5px underline offset. Text actions use smaller sans-serif labels, a 44px minimum height, and a pale warm hover fill; icon actions have a 44px minimum width and height. Disabled buttons retain the shared not-allowed cursor and 0.42 opacity.

### Navigation

Navigation rows use sans-serif labels, line icons, 48px minimum height, warm neutral resting text, a pale warm hover background, and a solid red current-page state. The collapsed desktop state removes visible labels while retaining accessible names and titles. The mobile drawer is coded to trap Tab focus among visible links and enabled buttons, filtering candidates by `getClientRects()` and excluding nodes inside inert ancestors. It closes with Escape and route changes and restores prior focus. While the modal drawer is open, the main content and mobile header are inert and hidden from assistive technology; the clickable backdrop has `tabIndex=-1` and `aria-hidden=true`. The hidden drawer itself remains inert and hidden from assistive technology. These behaviors are code observations and have not been exercised in the browser in this extraction.

### Concept filters

Lookbook concept filters are softly rounded, minimally filled buttons with a 44px minimum height. Active filters use red and white and expose `aria-pressed`. On phones the row scrolls horizontally instead of wrapping.

### Compact pickers and selections

Ordinary choices use native details/summary pickers with a label, selected value, rotating chevron, and a bordered rounded frame. Options are thumbnail rows with a pale hover fill, muted rose selected fill, and a check icon. Choosing an option closes the picker and returns focus to its summary with `preventScroll`; Escape does the same when the picker is open, preventing the default action and stopping propagation. Moving focus outside closes the picker without returning focus. This is an inline expanding picker, not a positioned popover. The sidecar's picker sample demonstrates the closed summary and native disclosure; live option data, thumbnails, selection handlers, and focus-return behavior are provided by the application.

Person controls use a segmented group with 38px minimum-height options; unavailable options are disabled. Color swatches combine a circular color, selected outline, check, accessible color name, and `aria-pressed`. Accessories are compact three-column image choices with warm borders, red selection borders, pale selected fill, and checkmarks. The photographic turban thumbnail crops the source sprite with SVG `viewBox="410 20 200 140"`, placing the 1024 × 1536 source image inside a 66px × 55px thumbnail; other accessory images keep their 52px × 52px contained-image treatment. The documented no-accessory sample corresponds to the existing diagonal-line option. No standalone text input or text-field system appears in the inspected surfaces, so none is invented here.

### Photography and cultural records

Look tiles are links containing portrait photos, a circular arrow affordance, serif titles, and compact concept labels. Hover enlarges the image slightly while clipping it inside its frame. The empty gallery tile is an actual route to the workshop, with a camera icon and dashed border. Cultural garment records pair cutout imagery with concise text and a directional arrow; event records put a white caption on a place photograph. Detail pages use normal navigation and full-size imagery rather than modal article readers.

### Outfit scene and feedback

The outfit scene uses a fixed SVG composition plane (1086 × 1448) to place photographic background, figure, and accessory assets. Garment color changes select pre-rendered image files. Images preload as a group; the scene displays a loading status, retry action on load failure, and a ready caption indicator. Workshop updates use a polite live region. Look stories retain existing introductory copy while loading and expose a refresh action for fallback content. The shared gallery content is supplied from catalogue data; its empty tile does not claim an implemented VTO or upload flow.

Motion is functional and restrained: navigation width/drawer transitions, picker-chevron rotation, primary hover background, small photo zooms, and a loading spinner. Exact durations are recorded in the sidecar. Reduced motion switches smooth scrolling to automatic and reduces animation/transition duration to 0.01ms.

Implementation scope: `index.html` declares Vietnamese, the theme color agrees with the primary token, and font faces are local. `test/viet-y-experience.test.ts` contains focused checks for drawer isolation, focus wrapping and Escape restoration, and picker focus return after selection or Escape. Its drawer test models visibility through mocked `getClientRects()` because JSDOM has no layout. These tests do not establish rendered viewport fit, font appearance, image loading, hover/focus rendering, real-browser drawer interaction, or clipping. Browser rendered verification remains pending after localhost access was denied; this document makes no ship verdict.

## Do's and Don'ts

### Do:

- Do preserve white and red as the primary palette with gold as a small cultural accent.
- Do keep editorial headings in Noto Serif Display and controls in Be Vietnam Pro.
- Do let photographs of garments and places carry the cultural content.
- Do keep workshop controls independently scrollable while the preview stays visible.
- Do preserve explicit selected, loading, empty, retry, and disabled states.
- Do keep cultural detail pages and image details addressable through normal navigation.

### Don't:

- Don't replace garment or location photography with decorative boxes or icons.
- Don't add long technology labels or disclaimers to the main workshop flow.
- Don't present demo testimonials as verified customer evidence.
- Don't imply VTO, personal uploads, or workshop saving are implemented.
- Don't reinterpret catalogue garment colors as the interface palette.
