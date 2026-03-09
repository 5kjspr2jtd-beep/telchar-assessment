// ── PDF Primitives ───────────────────────────────────────────
// Reusable building blocks for the PDF report.
// All components use @react-pdf/renderer primitives only.

import React from "react";
import { View, Text, Svg, Polygon, Path, Line } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "./pdfTokens";
import { scoreColor, scoreTier } from "../design/telcharDesign";

// ── Section eyebrow label ────────────────────────────────────
export function PdfSecLabel({ children, dark = false, style = {} }) {
  return (
    <Text style={{
      fontFamily: FONT,
      fontSize: TYPE.micro,
      fontWeight: 600,
      letterSpacing: 1.8,
      textTransform: "uppercase",
      color: dark ? C.dimWhite : C.mutedDark,
      marginBottom: 8,
      ...style,
    }}>
      {children}
    </Text>
  );
}

// ── Horizontal rule ──────────────────────────────────────────
export function PdfRule({ dark = false, style = {} }) {
  return (
    <View style={{
      height: 1,
      backgroundColor: dark ? C.lineWhite : C.lineDark,
      marginVertical: 10,
      ...style,
    }} />
  );
}

// ── Diamond marker (SVG) ─────────────────────────────────────
export function PdfDiamond({ size = 6, fill = C.blue2 }) {
  const s = size;
  const half = s / 2;
  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Polygon points={`${half},0 ${s},${half} ${half},${s} 0,${half}`} fill={fill} />
    </Svg>
  );
}

// ── Diamond rule (line — diamond — line) ─────────────────────
export function PdfDiamondRule({ dark = false, style = {} }) {
  const lineColor = dark ? C.lineWhite : C.lineDark;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 12, ...style }}>
      <View style={{ flex: 1, height: 1, backgroundColor: lineColor }} />
      <View style={{ marginHorizontal: 8 }}>
        <PdfDiamond size={6} fill={C.blue2} />
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: lineColor }} />
    </View>
  );
}

// ── Score bar ────────────────────────────────────────────────
export function PdfScoreBar({ score, width = "100%", height = 8, dark = false }) {
  const col = scoreColor(score);
  const trackColor = dark ? C.lineWhite : "#e0e2e8";
  return (
    <View style={{ width, height, backgroundColor: trackColor, borderRadius: 2 }}>
      <View style={{
        width: `${Math.min(score, 100)}%`,
        height: "100%",
        backgroundColor: col,
        borderRadius: 2,
      }} />
    </View>
  );
}

// ── Score number + tier label block ──────────────────────────
export function PdfScoreBlock({ score, size = TYPE.hero, dark = true }) {
  const col = scoreColor(score);
  return (
    <View>
      <Text style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 300,
        color: col,
        lineHeight: 1,
        letterSpacing: -1,
      }}>
        {score}
      </Text>
      <Text style={{
        fontFamily: FONT,
        fontSize: TYPE.micro,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: col,
        marginTop: 3,
      }}>
        {scoreTier(score)}
      </Text>
    </View>
  );
}

// ── Benchmark comparison block ───────────────────────────────
export function PdfBenchmarkBlock({ score, benchmark, dark = false }) {
  const delta = score - benchmark;
  const deltaStr = (delta >= 0 ? "+" : "") + delta;
  const deltaCol = delta >= 0 ? C.green : C.red;
  const items = [
    { label: "YOUR SCORE", value: String(score), color: scoreColor(score) },
    { label: "SMB AVERAGE", value: String(benchmark), color: dark ? C.white : C.darkText },
    { label: "DELTA", value: deltaStr, color: deltaCol },
  ];

  return (
    <View style={{
      flexDirection: "row",
      backgroundColor: dark ? "#0d1628" : C.cardBg,
      borderWidth: 1,
      borderColor: dark ? "rgba(37,99,235,0.25)" : C.cardBorder,
      borderLeftWidth: 3,
      borderLeftColor: C.blue,
      borderRadius: SP.cardRadius,
      padding: SP.cardPad,
    }}>
      {items.map((item, i) => (
        <View key={item.label} style={{
          flex: 1,
          paddingLeft: i > 0 ? 12 : 0,
          paddingRight: i < 2 ? 12 : 0,
          borderRightWidth: i < 2 ? 1 : 0,
          borderRightColor: dark ? C.lineWhite : C.lineDark,
        }}>
          <Text style={{
            fontFamily: FONT,
            fontSize: 7,
            fontWeight: 600,
            letterSpacing: 1.2,
            color: dark ? C.dimWhite : C.mutedDark,
            marginBottom: 3,
          }}>
            {item.label}
          </Text>
          <Text style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 300,
            color: item.color,
          }}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ── Card wrapper ─────────────────────────────────────────────
export function PdfCard({ children, dark = false, accentColor, style = {} }) {
  return (
    <View style={{
      backgroundColor: dark ? "#0d1628" : C.cardBg,
      borderWidth: 1,
      borderColor: dark ? C.lineWhite : C.cardBorder,
      borderLeftWidth: accentColor ? 3 : 1,
      borderLeftColor: accentColor || (dark ? C.lineWhite : C.cardBorder),
      borderRadius: SP.cardRadius,
      padding: SP.cardPad,
      ...style,
    }}>
      {children}
    </View>
  );
}

// ── Page header ──────────────────────────────────────────────
export function PdfHeader({ sectionTitle, co, dark = false }) {
  const textColor = dark ? C.dimWhite : C.mutedDark;
  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: dark ? C.lineWhite : C.lineDark,
    }}>
      <Text style={{ fontFamily: FONT, fontSize: 8, fontWeight: 600, letterSpacing: 1.5, color: dark ? C.blue2 : C.blue, textTransform: "uppercase" }}>
        TELCHAR AI
      </Text>
      <Text style={{ fontFamily: FONT, fontSize: TYPE.label, fontWeight: 400, color: textColor }}>
        {sectionTitle}
      </Text>
      <Text style={{ fontFamily: FONT, fontSize: TYPE.label, fontWeight: 500, color: dark ? C.white : C.darkText }}>
        {co}
      </Text>
    </View>
  );
}

// ── Page footer ──────────────────────────────────────────────
export function PdfFooter({ dark = false }) {
  return (
    <View style={{
      position: "absolute",
      bottom: SP.pageMargin,
      left: SP.pageMargin,
      right: SP.pageMargin,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }} fixed>
      <Text style={{
        fontFamily: FONT,
        fontSize: 7,
        fontWeight: 600,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: dark ? C.mutedWhite : C.mutedDark,
      }}>
        TELCHAR AI · CONFIDENTIAL
      </Text>
      <Text style={{
        fontFamily: FONT,
        fontSize: TYPE.label,
        color: dark ? C.dimWhite : C.dimDark,
      }} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

// ── Blue accent strip at top of every page ───────────────────
export function PdfAccentStrip() {
  return (
    <View style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: SP.accentStrip,
      backgroundColor: C.blue,
    }} fixed />
  );
}
