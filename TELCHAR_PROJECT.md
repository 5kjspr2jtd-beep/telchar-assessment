# Telchar AI — Project Reference

> Single-source reference for continuing development in a new Claude session.
> Last verified: 2026-03-07

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + React Router v6 |
| Build | Vite |
| Styling | 100% inline styles (no CSS modules, no Tailwind) |
| Design tokens | `src/design/telcharDesign.jsx` — all colors, fonts, type scale, CTA, UI primitives |
| Global CSS | `src/index.css` — dark-mode reset, shared `@keyframes` (fade-up, float-a/b/c, bar-in) |
| Entry | `index.html` → `src/main.jsx` → `src/App.jsx` |
| Dev server | `npm run dev` (Vite, default port 5204) |

---

## Routes (defined in `src/App.jsx`)

| Path | Component | File |
|---|---|---|
| `/` | `TelcharLandingPage` | `src/pages/TelcharLandingPage.jsx` (1630 lines) |
| `/?page=roi` | `ROICalculator` | `src/ROICalculator.jsx` (765 lines) |
| `/assessment` | `TelcharAssessment` | `src/pages/TelcharAssessment.jsx` (1872 lines) |
| `/report` | `TelcharReport` | `src/pages/TelcharReport.jsx` (1286 lines) |
| `/apply` | `TelcharImplementation` | `src/pages/TelcharImplementation.jsx` (942 lines) |

Query params on `/report`: `?tier=free|report|plan` and `?demo=true`.

---

## File Map (10 source files, 6760 lines total)

```
Claude Projects/
├── index.html                          (12 lines) — dark-mode HTML shell
├── vite.config.js                      — standard Vite + React plugin
├── package.json
├── public/
│   ├── white_decal.svg                 — logo (white wordmark + anvil icon, 173KB)
│   ├── horizontal-decal-1.png          — decorative asset (used by TelcharImplementation)
│   └── horizontal-decal-2.png          — decorative asset (used by TelcharImplementation)
├── src/
│   ├── main.jsx                        (13 lines) — React root + BrowserRouter
│   ├── index.css                       (35 lines) — dark reset + @keyframes
│   ├── App.jsx                         (30 lines) — route definitions
│   ├── ROICalculator.jsx               (765 lines) — savings calculator
│   ├── design/
│   │   └── telcharDesign.jsx           (175 lines) — design system tokens
│   └── pages/
│       ├── TelcharLandingPage.jsx      (1630 lines) — marketing homepage
│       ├── TelcharAssessment.jsx       (1872 lines) — AI readiness questionnaire
│       ├── TelcharReport.jsx           (1286 lines) — scored report (2 tiers)
│       └── TelcharImplementation.jsx   (942 lines) — implementation support application
```

---

## Design System v3 (`src/design/telcharDesign.jsx`)

### Colors (`TELCHAR` / imported as `P`)

| Token | Value | Usage |
|---|---|---|
| `navy` | `#080f1e` | Primary background |
| `navy2` | `#0d1628` | Secondary panels |
| `navy3` | `#111e38` | Tertiary / bar gradients |
| `navylt` | `#162240` | Lighter navy accent |
| `blue` | `#2563eb` | Primary accent, CTAs, links |
| `blue2` | `#4a80f5` | Secondary blue, gradient endpoints |
| `blueglow` | `rgba(37,99,235,0.15)` | Selected state backgrounds |
| `bluebrd` | `rgba(37,99,235,0.25)` | Blue border accents |
| `white` | `#ffffff` | Primary text on dark |
| `offwhite` | `#f5f6fa` | Light section backgrounds |
| `dim` | `rgba(255,255,255,0.5)` | Secondary text |
| `muted` | `rgba(255,255,255,0.28)` | Tertiary text, labels |
| `linedark` | `rgba(255,255,255,0.07)` | Dividers on dark bg |
| `linelight` | `rgba(10,15,30,0.07)` | Dividers on light bg |
| `green` | `#22c55e` | Score: Strong/Good |
| `amber` | `#f59e0b` | Score: Developing/Warning |
| `red` | `#ef4444` | Score: Critical/Low |

### Text hierarchies

```
TEXT       → { primary: "#ffffff", secondary: "rgba(255,255,255,0.5)", muted: "rgba(255,255,255,0.28)" }
LIGHT_TEXT → { primary: "#0a0f1e", secondary: "rgba(10,15,30,0.55)", muted: "rgba(10,15,30,0.35)" }
```

### Typography

| Export | Value |
|---|---|
| `FONT` | `'DM Sans', system-ui, sans-serif` |
| `SERIF` | `'Instrument Serif', Georgia, serif` |
| `GOOGLE_FONTS_URL` | loads DM Sans (300–600) + Instrument Serif (regular + italic) |

### Type scale (`TYPE`)

| Token | px | Usage |
|---|---|---|
| `micro` | 10 | Labels, eyebrows |
| `label` | 13 | Section labels, secondary info |
| `smallBody` | 14 | Secondary body |
| `body` | 15 | Primary body |
| `subhead` | 20 | Subsection headers |
| `section` | 24 | Section headers (pages may use `clamp()`) |
| `headline` | 32 | Major headlines (pages may use `clamp()`) |

### CTA buttons

- `CTA.style` — blue primary: `#2563eb` bg, white text, 320×44, borderRadius 8
- `CTA.ghost` — transparent bg, faint border, dim text, borderRadius 8

### Option cards (`OPTION_CARD`)

- `.selected` — `blueglow` bg, blue border, white text, borderRadius 12
- `.unselected` — `rgba(255,255,255,0.04)` bg, faint border, dim text, borderRadius 12

### UI Primitives (exported components)

- `Diamond({ size, fill, stroke, sw, style })` — SVG diamond accent
- `Rule({ diamond, weight, color, style })` — horizontal rule, optionally with center diamond
- `SecLabel({ children, color, style })` — uppercase tracking label (micro size)

### Score functions

- `scoreColor(score)` → green (≥70), amber (≥50), red (<50)
- `scoreTier(score)` → "Strong" / "Advancing" / "Developing" / "Early Stage" / "Critical"

---

## Logo

All pages use `/white_decal.svg` from the `public/` folder. This is the full Telchar AI wordmark (anvil icon + "TELCHAR AI" text) in white, designed for dark backgrounds.

### Logo component patterns per file

| File | Component | Heights | Notes |
|---|---|---|---|
| TelcharLandingPage.jsx | `LogoMark({ variant })` | header=20, footer=16 | Used in nav + footer |
| TelcharAssessment.jsx | `LogoMark({ size })` | default=18, large=28 | Used in navbar + landing hero |
| TelcharAssessment.jsx | (inline img) | 18 | In fixed NavBar during assessment |
| TelcharReport.jsx | (inline img) | 18 | In ReportPage nav + App shell nav |
| TelcharImplementation.jsx | (inline img) | 18 | In header bar |
| ROICalculator.jsx | `NavLogo()` | 18 | In nav bar |

---

## Visual Patterns (recurring across pages)

### Glass card
```js
{
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 14,
  backdropFilter: "blur(20px)",
}
```

### Atmosphere overlay (absolute, pointer-events none)
```js
background: `
  radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(13,22,40,0.4) 40%, transparent 70%),
  radial-gradient(ellipse 50% 40% at 85% 60%, rgba(37,99,235,0.08) 0%, transparent 60%),
  radial-gradient(ellipse 40% 30% at 10% 70%, rgba(13,22,40,0.6) 0%, transparent 60%)
`
```

### Grid overlay (absolute, pointer-events none)
```js
{
  opacity: 0.025,
  backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
  backgroundSize: "60px 60px",
}
```

### Nav bar (fixed, blur)
```js
{
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 64,
  background: "rgba(8,15,30,0.85)",
  backdropFilter: "blur(20px)",
  zIndex: 1000,
}
```

### Priority accent colors (used for numbered cards, data layers)
```
Blue:   #2563eb / rgb(37,99,235)
Green:  #22c55e / rgb(34,197,94)
Purple: #a855f7 / rgb(168,85,247)
Amber:  #f59e0b / rgb(245,158,11)
```

---

## Page-by-Page Details

### TelcharLandingPage.jsx

**Sections (top to bottom):**
1. Fixed nav bar (logo, Assessment/Reports/About links, Start Free CTA)
2. Hero — two-column: headline left, floating glass scorecard right, stats strip below
3. How It Works — light bg (`P.offwhite`), 3 numbered steps
4. Who This Is For — light bg, persona cards
5. What You Get — dark bg (`P.navy2`), report tier cards
6. ROI Calculator — embedded `<ROICalculator />` with "Calculate My Savings →" toggle button
7. Final CTA — dark bg + blue glow
8. Footer — logo (small), copyright

**Key components defined locally:** `LogoMark`, `useIsMobile`, `FloatingScoreCard`, `StatsStrip`

**Atmosphere/grid:** Hero section has atmosphere + grid overlays

### TelcharAssessment.jsx

**Flow:** Landing → Industry Select → Company Size → Question Loop → Results

**Sections:**
1. NavBar (fixed, with logo)
2. Landing page (hero with LogoMark large, "Start Free Assessment" CTA)
3. Multi-step questionnaire (industry, size, adaptive questions)
4. Results page (overall score, category breakdown, tier description, CTA to report)

**Key components:** `LogoMark`, `NavBar`, `LandingPage`, `OptionCard`, `ProgressBar`, `ResultsPage`, `CategoryBar`

**Option cards use:** `OPTION_CARD.selected` / `OPTION_CARD.unselected` from design system

### TelcharReport.jsx

**Structure:** Multi-page report with two tiers (Free Diagnostic / $150 AI Action Plan)

**Pages (internal pagination):**
- Cover (score, tier badge, category bars)
- Category deep-dives (per-category analysis, scores, recommendations)
- Data Infrastructure (4 accent-colored layer cards: blue/green/purple/amber)
- Engagement / Next Steps (full-width, centered CTA)

**Key components:** `AnalyticalScale`, `ReportPage`, `PageCover`, `PageCategory`, `PageDataInfra`, `PageEngagement`

**Two nav bars:** ReportPage has its own nav (logo + page title + tier tabs + pagination), plus App shell nav

### TelcharImplementation.jsx

**Structure:** Application form for implementation support

**Sections:**
1. Header bar (logo, title, "Confidential")
2. Intro text
3. "What Implementation Leadership Includes" — blue glass box with blue diamond bullets
4. "What This Is Not" — gray box with muted diamonds
5. Multi-section form (contact info, company, current tools, goals, budget, timeline)
6. Submit CTA
7. Footer

**Visual features:** Atmosphere + grid overlays on main wrapper, blue glass treatment on "includes" box

**Decorative assets:** Uses `horizontal-decal-1.png` and `horizontal-decal-2.png` from public/ with `filter: brightness(0) invert(1)`

### ROICalculator.jsx

**Structure:** Interactive savings calculator

**Flow:** Role chips → Slider inputs → Savings output → CTA

**Key components:** `NavLogo`, `Chip`, `SliderInput`, `SavingsDisplay`

**Embedded:** Can be accessed standalone at `/?page=roi` or embedded in TelcharLandingPage

---

## Imports Cheat Sheet

All pages import from the shared design system. Here's what each file imports:

```js
// TelcharLandingPage.jsx
import { TELCHAR as P, FONT, SERIF, GOOGLE_FONTS_URL, scoreColor, Diamond, Rule, SecLabel, TEXT, LIGHT_TEXT, TYPE, CTA, OPTION_CARD } from '../design/telcharDesign';
import ROICalculator from '../ROICalculator';

// TelcharAssessment.jsx
import { TELCHAR as P, FONT, SERIF, scoreColor, scoreTier, GOOGLE_FONTS_URL, TEXT, TYPE, CTA, OPTION_CARD } from "../design/telcharDesign";

// TelcharReport.jsx
import { TELCHAR as P, FONT, SERIF, GOOGLE_FONTS_URL, TEXT, LIGHT_TEXT, TYPE, CTA, scoreColor, scoreTier, Diamond, Rule, SecLabel } from "../design/telcharDesign";

// TelcharImplementation.jsx
import { TELCHAR as P, FONT, SERIF, GOOGLE_FONTS_URL, Diamond, Rule, SecLabel, TEXT, TYPE, CTA } from "../design/telcharDesign";

// ROICalculator.jsx (note: relative path differs — not in pages/)
import { TELCHAR as P, FONT, SERIF, GOOGLE_FONTS_URL, Diamond, Rule, SecLabel, TYPE, CTA } from "./design/telcharDesign";
```

---

## Known Constraints

- **No CSS classes** — everything is inline `style={{}}`. Use the design tokens.
- **No component library** — all components are locally defined in their respective files.
- **Font loading** — each page loads Google Fonts via a `<link>` tag injected with `useEffect` using `GOOGLE_FONTS_URL`.
- **No global state** — assessment answers are local state, passed to report via URL params.
- **Public assets** — served from `public/` at root path (`/white_decal.svg`, `/horizontal-decal-1.png`, etc.).
- **Dark mode forced** — `index.html` has `data-theme="dark" style="color-scheme:dark;background:#080f1e;"`, `index.css` sets `:root { color-scheme: dark }`.

---

## Quick Start for New Session

```
1. Read this file first
2. Read src/design/telcharDesign.jsx for current tokens
3. Read the specific page file you need to modify
4. Dev server: npm run dev (port 5204)
5. Preview: http://localhost:5204
```
