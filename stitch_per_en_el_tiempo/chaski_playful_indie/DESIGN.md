---
name: Chaski Playful Indie
colors:
  surface: '#faf8ff'
  surface-dim: '#d1d8ff'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2ff'
  surface-container: '#ebedff'
  surface-container-high: '#e4e7ff'
  surface-container-highest: '#dce1ff'
  on-surface: '#071747'
  on-surface-variant: '#3c4947'
  inverse-surface: '#202d5d'
  inverse-on-surface: '#eff0ff'
  outline: '#6c7a77'
  outline-variant: '#bbcac6'
  surface-tint: '#006b5f'
  primary: '#006b5f'
  on-primary: '#ffffff'
  primary-container: '#14b8a6'
  on-primary-container: '#00423b'
  inverse-primary: '#4fdbc8'
  secondary: '#a93349'
  on-secondary: '#ffffff'
  secondary-container: '#fe7488'
  on-secondary-container: '#730425'
  tertiary: '#795900'
  on-tertiary: '#ffffff'
  tertiary-container: '#d09c00'
  on-tertiary-container: '#4c3700'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#71f8e4'
  primary-fixed-dim: '#4fdbc8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#ffdadc'
  secondary-fixed-dim: '#ffb2b9'
  on-secondary-fixed: '#400010'
  on-secondary-fixed-variant: '#891933'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#f9bd22'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#faf8ff'
  on-background: '#071747'
  surface-variant: '#dce1ff'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 42px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '800'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '800'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system powers a narrative-driven 2D adventure game tailored for secondary school students exploring the rich cultural, ecological, and historical landscapes of Peru. The visual personality balances the infectious energy of beloved indie platformers with the legible precision needed for pedagogical engagement. 

### Aesthetic Philosophy
The visual direction fuses **Modern Indie Game UI** with **Warm Illustrated Tactility**:
- **Playful Tactility:** Interactive elements carry physical feedback through crisp contours, offset drop-surfaces, and buoyant motion rather than heavy photorealistic textures.
- **Narrative Warmth:** High-contrast focal elements rest against gentle, atmospheric field tones (cerulean Andean skies and coastal sands) ensuring sustained reading comfort across extended gameplay sessions.
- **Clear Wayfinding:** Primary actions stand out with urgency and joy, signaling historical portals, humming discoveries, and active choices without visual exhaustion.
- **Heroic Spark:** The visual presence of the hummingbird protagonist (Kinti) anchors the interface with fluid kinetic cues, cheerful radial badges, and dialogue capsules.

## Colors

The palette establishes an immediate atmosphere of exploration, drawing on the vibrant avian plumage of Kinti, golden relics, temporal rifts, and high Andean clarity.

### Color Roles & Semantic Application
- **Primary (`#14B8A6` - Kinti Turquoise):** Interactive world nodes, traversal progress gauges, active states, inventory tabs, and energy bars.
- **Secondary (`#FB7185` - Inca Coral):** Primary action buttons (CTA), critical mission alerts, directional jump cues, and interactive highlights.
- **Tertiary (`#FBBF24` - Sun God Gold):** Temporal medal fragments, discovery spark counters, achievement trophies, and critical interactive rewards.
- **Magical Portal Accent (`#C4B5FD` - Temporal Lavender):** Time-slip interfaces, lore codex entries, mystic relics, and dimensional transition borders.
- **Neutral Deep (`#172554` - Night Navy):** High-contrast structural strokes (2px - 3px borders), expressive typography, HUD glyph outlines, and dark-surface dialog backdrops.
- **Canvas & Surface System:**
  - Ambient Game Canvas: Soft Sky Blue (`#DDF4FF`)
  - Elevated Container / Parchment: Cream (`#FFF8EB`)
  - Subdued Panel Backdrop: Pale Cloud (`#F0F9FF`)

## Typography

Typography prioritizes rapid legibility during motion while expressing a friendly, contemporary adventure spirit. `Plus Jakarta Sans` delivers geometric roundness paired with tight, punchy kerning suited for gameplay HUDs, character nameplates, and dialogue ribbons.

### Typographic Rules
- **Display & Chapter Titles:** Set in ExtraBold (`800`) with tight tracking (`-0.02em`) to command presence without aggressive weight.
- **HUD Counters & Timers:** Use Tabular Figures (`tnum`) in `label-lg` and `headline-md` weights to prevent jitter during real-time updates.
- **Dialogue & Story Text:** Maintain generous line height (`1.55x` body size) using medium weights (`500`) to alleviate reading friction for adolescent players navigating multilingual or Quechua vocabulary.
- **Strokes and Readability:** When overlaying typography directly atop dynamic 2D game scenes, apply a 2px outward text stroke in Night Navy (`#172554`) or place inside opaque parchment panels.

## Layout & Spacing

The interface accommodates two distinct contexts: full-screen immersion during gameplay (HUD overlays, dialogue overlays, quick-action rings) and structured presentation during codex reviews, level maps, and educational quiz checkpoints.

### HUD Safe Zones & Grid Structure
- **Game Screen Safe Area:** All interactive HUD elements (sun shards, health counters, map compass) maintain an inset margin of `1.5rem` on tablet/desktop and `1rem` on mobile landscape to accommodate varied screen cutouts and thumb zones.
- **Modal & Codex Content Grid:** Structured menus deploy an 8-column layout on tablets and a 12-column layout on desktops with `1.5rem` - `2rem` gutters.
- **Reflow & Device Ergonomics:**
  - **Mobile Landscape / Handheld:** Critical navigation anchors strictly to bottom corners (left: virtual stick/directional nodes; right: action jump/interact clusters).
  - **Desktop / Tablet:** Codex entries shift to a two-pane split layout: 4 columns for illustrated regional artifact preview, 8 columns for historical scroll and challenges.

## Elevation & Depth

To maintain visual cohesion with hand-drawn 2D vector environments, depth is communicated through distinct cartoon offset layering, hard-edged isometric drop-surfaces, and clear structural borders rather than realistic diffuse shadows.

### Elevation Levels
- **Level 0 (Atmospheric Surface):** Ground zero viewport `#DDF4FF` with zero elevation.
- **Level 1 (Parchment & Canvas Panels):** Surface `#FFF8EB` bordered by a 2.5px solid stroke of Night Navy (`#172554`) with an offset hard shadow: `0px 4px 0px #172554`.
- **Level 2 (Interactive Cards & Dialogue Modules):** Crisp cream cards with `0px 6px 0px #172554`. In hover or focus states, the surface rises slightly (`0px 8px 0px #172554`) accompanied by an ease-out bounce.
- **Level 3 (HUD Quick Controls & Modals):** High-priority overlays surrounded by a 3px border, featuring a double offset: hard exterior shadow `0px 8px 0px #172554` backed by a subtle soft ambient rim glow (`0 0 16px rgba(20, 184, 166, 0.25)`).
- **Active / Pressed State:** All buttons and interactive surfaces physically depress when pressed: `transform: translateY(4px)` with shadow dropping to `0px 0px 0px #172554`.

## Shapes

The design system uses generous, buoyant geometry. Sharp, pointed corners are reserved strictly for dangerous in-game hazards. All UI cards, containers, and interactive anchors embrace softened curvatures that evoke animated comic panels and polished arcade consoles.

### Rounding Matrix
- **Standard Controls & Badges (Base: `0.5rem` / 8px):** Mini tags, status chips, inventory grid tiles.
- **Cards & Dialogue Panels (`rounded-lg`: `1rem` / 16px to `1.5rem` / 24px):** Main modal dialogues, mission summary boards, codex parchment sheets.
- **HUD Badges & Key Actions (`rounded-xl` to Full Pill):** Primary action buttons, energy capsules, protagonist character portrait vignettes.

## Components

### 1. Buttons
- **Primary Action (Inca Coral `#FB7185`):** Text set in `label-lg`, white lettering, 2.5px Night Navy outline, `0px 5px 0px #172554` offset block base. Used for "Comenzar", "Saltar", and "Confirmar".
- **Secondary Action (Kinti Turquoise `#14B8A6`):** For traversal, map reopening, and secondary answers.
- **Controller/HUD Action Buttons:** Circular (`48px` to `64px`), embossed appearance with single-letter glyphs, controller button prompts, or icon outlines (A, B, X, Y).

### 2. Dialogue & Character Speech Bubbles
- Built on Cream Parchment (`#FFF8EB`) with a prominent 3px outline (`#172554`) and an asymmetric downward or directional pointer anchor directed toward the speaker sprite.
- Character nameplate is an overlapping pill-badge resting on the top-left boundary, filled with Kinti Turquoise or Temporal Lavender.

### 3. Cards & Codex Panels
- **Anatomy:** Cream surface (`#FFF8EB`), solid 2.5px Night Navy border, `1.25rem` padding, corner radius of `20px`.
- Features an inner inset highlight: 1.5px solid stroke with 10% opacity white, giving a subtle pressed glass bevel effect.
- Header bands can be tinted with Lavender `#C4B5FD` for temporal relics or Gold `#FBBF24` for mastered historical milestones.

### 4. Chips & Reward Badges
- Pill-shaped counters with thick borders. Left-aligned circular icon slot (holding Sun Shards or Quill markers) nestled within a neutral cream pill containing numeric tallies in `label-md`.

### 5. Input Fields & Multiple Choice Checkpoints
- **Educational Quizzes:** High-height buttons (`56px`), rounded-lg, cream background. On hover/focus, transitions to light turquoise wash. Active selection triggers Coral or Turquoise fill with a bold white checkmark indicator.
- **Text Inputs:** Padded inputs with a soft white-blue surface (`#F0F9FF`), 2px dark border, and large rounded cursors.

### 6. Temporal Time-Portals & Progression Rings
- Circular concentric rings styled with Temporal Lavender (`#C4B5FD`) dashes and pulsating glowing edges, communicating chronological leaps between Pre-Inca, Inca, and Colonial eras.