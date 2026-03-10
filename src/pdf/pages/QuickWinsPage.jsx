// ── Quick Wins Page (Light) ──────────────────────────────────
// Priority improvement areas with win cards and estimated impact.
// Tier-aware: free sees 1 win, full sees all 3 + impact row.
// Spacing is tuned so 3 cards + impact fit on a single page.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfRule, PdfDiamondRule, PdfDiamond, PdfCard } from "../primitives";
import { REPORT_NOTES } from "../../data/reportData";

const PRIORITY_ACCENTS = [
  { border: "#2563eb", label: "HIGHEST IMPACT", labelColor: "#4a80f5" },
  { border: "#22c55e", label: "HIGH IMPACT",    labelColor: "#22c55e" },
  { border: "#f59e0b", label: "MEDIUM IMPACT",  labelColor: "#f59e0b" },
];

function WinCard({ win, index }) {
  const accent = PRIORITY_ACCENTS[index] || PRIORITY_ACCENTS[2];

  return (
    <View wrap={false} style={{
      backgroundColor: C.cardBg,
      borderWidth: 1,
      borderColor: C.cardBorder,
      borderLeftWidth: 3,
      borderLeftColor: accent.border,
      borderRadius: SP.cardRadius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 6,
    }}>
      {/* Header: number + title + impact badge */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Text style={{
          fontFamily: FONT, fontSize: 9, fontWeight: 600,
          color: accent.labelColor,
          width: 16, textAlign: "center",
        }}>
          0{index + 1}
        </Text>
        <Text style={{
          fontFamily: FONT, fontSize: TYPE.body, fontWeight: 500,
          color: C.darkText, flex: 1,
        }}>
          {win.title}
        </Text>
        <Text style={{
          fontFamily: FONT, fontSize: 7, fontWeight: 600,
          letterSpacing: 0.8, textTransform: "uppercase",
          color: accent.labelColor,
          backgroundColor: `${accent.border}15`,
          borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2,
        }}>
          {accent.label}
        </Text>
      </View>

      {/* Category badge */}
      <View style={{ marginBottom: 5, marginLeft: 24 }}>
        <Text style={{
          fontFamily: FONT, fontSize: 8, fontWeight: 500,
          color: C.blue,
          backgroundColor: `${C.blue}12`,
          borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2,
          alignSelf: "flex-start",
        }}>
          {win.cat}
        </Text>
      </View>

      {/* Description */}
      <Text style={{
        fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300,
        color: C.dimDark, lineHeight: 1.5,
        marginBottom: 7, marginLeft: 24,
      }}>
        {win.desc}
      </Text>

      {/* Meta row: tool, cost, timeline */}
      <View style={{
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: C.lineDark,
        paddingTop: 6,
        marginLeft: 24,
      }}>
        {[
          ["Built with", win.tool],
          ["Monthly cost", win.toolCost],
          ["Timeline", win.time],
        ].map(([label, value], j) => (
          <View key={label} style={{
            flex: 1,
            paddingRight: j < 2 ? 12 : 0,
            paddingLeft: j > 0 ? 12 : 0,
            borderRightWidth: j < 2 ? 1 : 0,
            borderRightColor: C.lineDark,
          }}>
            <Text style={{
              fontFamily: FONT, fontSize: 7, fontWeight: 600,
              letterSpacing: 1.2, textTransform: "uppercase",
              color: C.mutedDark, marginBottom: 2,
            }}>
              {label}
            </Text>
            <Text style={{
              fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 500,
              color: C.darkText,
            }}>
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ImpactRow() {
  const items = [
    ["Manual hours recovered", "12 – 18 hrs / week"],
    ["Estimated annual value", "$28,000 – $44,000"],
    ["Estimated payback", "Under 90 days"],
  ];

  return (
    <View wrap={false}>
      <PdfDiamondRule style={{ marginTop: 10, marginBottom: 8 }} />
      <PdfSecLabel>Estimated Impact — 90-Day Implementation</PdfSecLabel>

      <View style={{ flexDirection: "row", marginBottom: 6 }}>
        {items.map(([label, value], i) => (
          <View key={label} style={{
            flex: 1,
            paddingRight: i < 2 ? 14 : 0,
            paddingLeft: i > 0 ? 14 : 0,
            borderRightWidth: i < 2 ? 1 : 0,
            borderRightColor: C.lineDark,
          }}>
            <Text style={{
              fontFamily: FONT, fontSize: 7, fontWeight: 600,
              letterSpacing: 1.5, textTransform: "uppercase",
              color: C.mutedDark, marginBottom: 3,
            }}>
              {label}
            </Text>
            <Text style={{
              fontFamily: FONT, fontSize: TYPE.subhead - 2,
              fontWeight: 500, color: C.blue,
            }}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      <Text style={{
        fontFamily: FONT, fontSize: 8, fontWeight: 300,
        color: C.mutedDark, lineHeight: 1.5, marginTop: 2,
      }}>
        {REPORT_NOTES.impactDisclaimer}
      </Text>
    </View>
  );
}

export default function QuickWinsPage({ data }) {
  const { co, wins, tier } = data;
  const visibleWins = tier === "free" ? wins.slice(0, 1) : wins;
  const showImpact = tier !== "free";

  return (
    <Page size="A4" style={{
      backgroundColor: C.offwhite,
      paddingTop: SP.accentStrip + SP.pageMargin,
      paddingBottom: SP.pageMargin + 20,
      paddingHorizontal: SP.pageMargin,
    }}>
      <PdfAccentStrip />
      <PdfHeader sectionTitle="Priority Improvements" co={co} />

      <PdfSecLabel>Priority Improvement Areas</PdfSecLabel>
      <Text style={{
        fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
        color: C.dimDark, lineHeight: 1.6, marginBottom: 10,
      }}>
        {visibleWins.length === 1
          ? "Your highest-priority starting point based on assessment findings. Setup, configuration, and testing timelines depend on your team's capacity and technical comfort."
          : "Three recommended starting points. Each requires setup, configuration, and testing. Timelines depend on your team's capacity and technical comfort."}
      </Text>

      {visibleWins.map((win, i) => (
        <WinCard key={i} win={win} index={i} />
      ))}

      {showImpact && <ImpactRow />}

      {/* Free tier — nudge toward upgrade */}
      {tier === "free" && (
        <View style={{
          marginTop: 20,
          backgroundColor: C.cardBg,
          borderWidth: 1,
          borderColor: C.cardBorder,
          borderLeftWidth: 3,
          borderLeftColor: C.blue,
          borderRadius: SP.cardRadius,
          padding: SP.cardPad,
        }}>
          <Text style={{
            fontFamily: FONT, fontSize: TYPE.micro, fontWeight: 600,
            letterSpacing: 1.5, textTransform: "uppercase",
            color: C.blue, marginBottom: 6,
          }}>
            AI ACTION PLAN INCLUDES
          </Text>
          <Text style={{
            fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
            color: C.dimDark, lineHeight: 1.65,
          }}>
            Two additional priority improvements, 30-day action plan, 90-day implementation roadmap, five detailed category analyses, risk analysis, data infrastructure guidance, and a downloadable branded PDF.
          </Text>
        </View>
      )}

      <PdfFooter />
    </Page>
  );
}
