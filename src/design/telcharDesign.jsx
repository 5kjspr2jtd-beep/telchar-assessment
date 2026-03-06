// ── Telchar Design System — Single Source of Truth ──────────────────────────
// Shared across TelcharLandingPage, TelcharAssessment, and ROICalculator.
// Do not duplicate these values in consuming files.

import React from "react";

// ── Color system ────────────────────────────────────────────────────────────
export const TELCHAR = {
  paper:      "#F5F0E8",
  paperShade: "#EDE6D6",
  paperRule:  "#CEC4B2",
  navy:       "#0E1B2D",
  navyText:   "#8AACC8",
  navyDim:    "#253848",
  navyFaint:  "#162438",
  gold:       "#B8912A",
  goldLight:  "#CAAA4E",
  goldFaint:  "#E4D5AA",
  ink:        "#1A1714",
  inkMid:     "#3C3530",
  inkLight:   "#6A6055",
  inkFaint:   "#8C8376",
  green:      "#4E7C45",
  amber:      "#B8912A",
  red:        "#8A2A2A",
};

// ── Typography ──────────────────────────────────────────────────────────────
export const FONT = "'IBM Plex Sans', sans-serif";
export const MONO = "'IBM Plex Mono', monospace";
export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap";

// ── Score color system ──────────────────────────────────────────────────────
export function scoreColor(s) {
  if (s < 25) return "#A23A3A";
  if (s < 45) return "#D26A2C";
  if (s < 60) return "#E0B93B";
  if (s < 75) return "#7C8E3A";
  return "#4E7C45";
}

export function scoreTier(s) {
  if (s < 25) return "Critical";
  if (s < 45) return "Early Stage";
  if (s < 60) return "Developing";
  if (s < 75) return "Advancing";
  return "Strong";
}

// ── Layout constants ────────────────────────────────────────────────────────
export const LAYOUT = {
  maxWidth: 980,
  padding: "0 32px",
  sectionSpacing: 64,
};

// ── UI Primitives ───────────────────────────────────────────────────────────

export function Diamond({ size = 8, fill = TELCHAR.navy, stroke = TELCHAR.goldLight, sw = 1.5, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "block", flexShrink: 0, ...style }}>
      <polygon points="5,0 10,5 5,10 0,5" fill={fill} stroke={stroke} strokeWidth={sw} />
    </svg>
  );
}

export function Rule({ diamond = false, weight = 1, color, style = {} }) {
  const c = color || TELCHAR.paperRule;
  if (diamond) return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
      <div style={{ flex: 1, height: weight, background: c }} />
      <Diamond size={8} fill={TELCHAR.goldLight} stroke="none" sw={0} />
      <div style={{ flex: 1, height: weight, background: c }} />
    </div>
  );
  return <div style={{ height: weight, background: c, ...style }} />;
}

// ── Navy-background text hierarchy ───────────────────────────────────────────
export const NAVY_TEXT = {
  primary:   "#E6EEF8",
  secondary: "#9BB1C7",
};

export function SecLabel({ children, color, style = {} }) {
  return (
    <div style={{
      fontFamily: FONT, fontSize: 12, fontWeight: 700,
      letterSpacing: "0.22em", textTransform: "uppercase",
      color: color || TELCHAR.inkFaint, marginBottom: 14, ...style,
    }}>{children}</div>
  );
}
