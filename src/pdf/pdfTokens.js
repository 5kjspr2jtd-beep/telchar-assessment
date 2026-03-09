// ── PDF Design Tokens ────────────────────────────────────────
// Print-optimized subset of the Telchar design system.
// References the same color values as telcharDesign.jsx but
// adapted for PDF rendering (no CSS gradients, no rgba with
// backdrop-filter, solid fills only).

// ── Colors ───────────────────────────────────────────────────
export const C = {
  // Dark pages (cover + engagement)
  navy:       "#080f1e",
  navy2:      "#0d1628",
  blue:       "#2563eb",
  blue2:      "#4a80f5",
  white:      "#ffffff",
  dimWhite:   "#808080",   // print-safe equivalent of rgba(255,255,255,0.5)
  mutedWhite: "#474747",   // print-safe equivalent of rgba(255,255,255,0.28)
  lineWhite:  "#1a2540",   // print-safe equivalent of rgba(255,255,255,0.07) on navy

  // Light pages (body)
  offwhite:   "#f5f6fa",
  darkText:   "#0a0f1e",
  dimDark:    "#4a4f5e",   // print-safe secondary text — slightly stronger for PDF readability
  mutedDark:  "#7d8494",   // print-safe tertiary text — slightly stronger for PDF readability
  cardBg:     "#ffffff",
  cardBorder: "#dcdee5",   // slightly more defined card borders
  lineDark:   "#dfe1e7",   // slightly more visible dividers for print

  // Score colors (same as web)
  green:      "#22c55e",
  amber:      "#f59e0b",
  red:        "#ef4444",
};

// ── Typography ───────────────────────────────────────────────
export const FONT = "DM Sans";
export const SERIF = "Instrument Serif";

export const TYPE = {
  micro:     8,
  label:     9,
  smallBody: 10,
  body:      11,
  subhead:   14,
  section:   18,
  headline:  26,
  hero:      48,
};

// ── Spacing ──────────────────────────────────────────────────
export const SP = {
  pageMargin:  40,   // pt — all sides
  sectionGap:  20,   // pt — between major sections
  cardPad:     14,   // pt — inside cards
  cardRadius:  6,    // pt — card border radius
  accentStrip: 3,    // pt — top accent bar height
};

// ── Page dimensions (A4) ─────────────────────────────────────
export const PAGE = {
  width:  595.28,  // pt
  height: 841.89,  // pt
};
