// ── Telchar Design System v3 — Single Source of Truth ────────────────────────
// Shared across TelcharLandingPage, TelcharAssessment, ROICalculator, TelcharReport.
// Do not duplicate these values in consuming files.

import React from "react";

// ── Color system (v3: dark navy + electric blue) ─────────────────────────────
export const TELCHAR = {
  // ── v3 primary tokens ──
  navy:       "#080f1e",
  navy2:      "#0d1628",
  navy3:      "#111e38",
  navylt:     "#162240",
  blue:       "#2563eb",
  blue2:      "#4a80f5",
  blueglow:   "rgba(37,99,235,0.15)",
  bluebrd:    "rgba(37,99,235,0.25)",
  white:      "#ffffff",
  offwhite:   "#f5f6fa",
  dim:        "rgba(255,255,255,0.5)",
  muted:      "rgba(255,255,255,0.28)",
  linedark:   "rgba(255,255,255,0.07)",
  linelight:  "rgba(10,15,30,0.07)",

  // ── Score colors (v3: vibrant) ──
  green:      "#22c55e",
  amber:      "#f59e0b",
  red:        "#ef4444",
};

// ── Text color hierarchy (v3: white on dark) ─────────────────────────────────
export const TEXT = {
  primary:   "#ffffff",
  secondary: "rgba(255,255,255,0.5)",
  muted:     "rgba(255,255,255,0.28)",
};

// ── Light-section text (for offwhite backgrounds) ────────────────────────────
export const LIGHT_TEXT = {
  primary:   "#0a0f1e",
  secondary: "rgba(10,15,30,0.55)",
  muted:     "rgba(10,15,30,0.35)",
};

// ── Typography (v3: DM Sans + Instrument Serif) ──────────────────────────────
export const FONT = "'DM Sans', system-ui, sans-serif";
export const SERIF = "'Instrument Serif', Georgia, serif";
export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap";

// ── Type scale (v3) ──────────────────────────────────────────────────────────
export const TYPE = {
  micro:     10,   // labels, eyebrows
  label:     13,   // section labels, secondary info
  smallBody: 14,   // secondary body text
  body:      15,   // primary body text
  subhead:   20,   // subsection headers
  section:   24,   // section headers (pages may override with clamp)
  headline:  32,   // major headlines (pages may override with clamp)
};

// ── Score color system (v3: vibrant three-tier) ──────────────────────────────
export function scoreColor(s) {
  if (s >= 70) return "#22c55e";
  if (s >= 50) return "#f59e0b";
  return "#ef4444";
}

export function scoreTier(s) {
  if (s < 25) return "Critical";
  if (s < 45) return "Early Stage";
  if (s < 60) return "Developing";
  if (s < 75) return "Advancing";
  return "Strong";
}

// ── Color utility ────────────────────────────────────────────
export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ── Layout constants ─────────────────────────────────────────────────────────
export const LAYOUT = {
  maxWidth: 980,
  padding: "0 32px",
  sectionSpacing: 64,
};

// ── CTA Button standards (v3: blue primary + ghost) ──────────────────────────
export const CTA = {
  width: 320,
  height: 44,
  style: {
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    width: 320,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.15s ease",
    margin: "24px auto",
  },
  ghost: {
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding: "15px 28px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    margin: "24px auto",
  },
};

// ── Selected option card standard (v3: dark glass) ───────────────────────────
export const OPTION_CARD = {
  selected: {
    background: "rgba(37,99,235,0.15)",
    border: "2px solid rgba(37,99,235,0.4)",
    color: "#ffffff",
    fontWeight: 500,
    borderRadius: 12,
  },
  unselected: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "rgba(255,255,255,0.5)",
    fontWeight: 400,
    borderRadius: 12,
  },
};

// ── UI Primitives ────────────────────────────────────────────────────────────

export function Diamond({ size = 8, fill = "#2563eb", stroke = "#4a80f5", sw = 1.5, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "block", flexShrink: 0, ...style }}>
      <polygon points="5,0 10,5 5,10 0,5" fill={fill} stroke={stroke} strokeWidth={sw} />
    </svg>
  );
}

export function Rule({ diamond = false, weight = 1, color, style = {} }) {
  const c = color || "rgba(255,255,255,0.07)";
  if (diamond) return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
      <div style={{ flex: 1, height: weight, background: c }} />
      <Diamond size={8} fill="#4a80f5" stroke="none" sw={0} />
      <div style={{ flex: 1, height: weight, background: c }} />
    </div>
  );
  return <div style={{ height: weight, background: c, ...style }} />;
}

export function SecLabel({ children, color, style = {} }) {
  return (
    <div style={{
      fontFamily: FONT, fontSize: TYPE.micro, fontWeight: 600,
      letterSpacing: "0.22em", textTransform: "uppercase",
      color: color || "rgba(255,255,255,0.5)", marginBottom: 14, ...style,
    }}>{children}</div>
  );
}
