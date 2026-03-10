// ── Summary Page (Light) ─────────────────────────────────────
// Overall score, interpretation, benchmark comparison,
// and category breakdown table.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfRule, PdfDiamondRule, PdfScoreBar, PdfScoreBlock, PdfBenchmarkBlock } from "../primitives";
import { scoreColor, scoreTier } from "../../design/telcharDesign";

export default function SummaryPage({ data }) {
  const { co, ind, scores, benchmark: bench, summaryNarrative } = data;
  const benchOverall = bench?.overall ?? 51;

  // Use engine-generated narrative; fall back to simple template if missing
  const interp = summaryNarrative || `A score of ${scores.overall} places ${co} in the ${scoreTier(scores.overall)} tier.`;

  return (
    <Page size="A4" style={{ backgroundColor: C.offwhite, paddingTop: SP.accentStrip + SP.pageMargin, paddingBottom: SP.pageMargin + 20, paddingHorizontal: SP.pageMargin }}>
      <PdfAccentStrip />
      <PdfHeader sectionTitle="Score Summary" co={co} />

      {/* Two-column: score left, interpretation right */}
      <View style={{ flexDirection: "row", gap: 28, marginBottom: 16 }}>
        {/* Left column: score */}
        <View style={{ width: 120 }}>
          <PdfSecLabel>Overall Score</PdfSecLabel>
          <PdfScoreBlock score={scores.overall} size={52} dark={false} />
          <PdfRule style={{ marginTop: 12, marginBottom: 8 }} />
          {[
            ["Industry", ind],
            ["Categories", "5 of 5 scored"],
            ["Reference Baseline", `${benchOverall} / 100`],
          ].map(([label, value]) => (
            <View key={label} style={{
              paddingVertical: 4,
              borderBottomWidth: 1,
              borderBottomColor: C.lineDark,
            }}>
              <Text style={{ fontFamily: FONT, fontSize: 7, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: C.mutedDark, marginBottom: 2 }}>
                {label}
              </Text>
              <Text style={{ fontFamily: FONT, fontSize: 9, fontWeight: 400, color: C.dimDark }}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        {/* Right column: interpretation + benchmark */}
        <View style={{ flex: 1 }}>
          <PdfSecLabel>Score Interpretation</PdfSecLabel>
          <Text style={{
            fontFamily: FONT,
            fontSize: TYPE.body,
            fontWeight: 300,
            color: C.dimDark,
            lineHeight: 1.7,
            marginBottom: 14,
          }}>
            {interp}
          </Text>
          <PdfBenchmarkBlock score={scores.overall} benchmark={benchOverall} />
          <Text style={{
            fontFamily: FONT, fontSize: 7, fontWeight: 300, fontStyle: "italic",
            color: C.mutedDark, lineHeight: 1.6, marginTop: 8,
          }}>
            {bench?.meta?.note || "Reference baselines represent modeled expectations for businesses of similar industry and size."}
          </Text>
        </View>
      </View>

      <PdfDiamondRule />

      {/* Category breakdown */}
      <PdfSecLabel>Category Breakdown</PdfSecLabel>

      {/* Table header */}
      <View style={{
        flexDirection: "row",
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: C.lineDark,
        marginBottom: 2,
      }}>
        <Text style={{ width: 36, fontFamily: FONT, fontSize: 7, fontWeight: 600, letterSpacing: 1, color: C.mutedDark, textAlign: "center" }}>
          SCORE
        </Text>
        <Text style={{ flex: 1, fontFamily: FONT, fontSize: 7, fontWeight: 600, letterSpacing: 1, color: C.mutedDark, paddingLeft: 10 }}>
          CATEGORY
        </Text>
        <Text style={{ width: 70, fontFamily: FONT, fontSize: 7, fontWeight: 600, letterSpacing: 1, color: C.mutedDark, textAlign: "right" }}>
          MATURITY
        </Text>
      </View>

      {/* Category rows */}
      {scores.cats.map(cat => {
        const col = scoreColor(cat.score);
        return (
          <View key={cat.key} style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: C.lineDark,
          }}>
            {/* Score number */}
            <Text style={{
              width: 36,
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 300,
              color: col,
              textAlign: "center",
            }}>
              {cat.score}
            </Text>

            {/* Category name + bar */}
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={{
                fontFamily: FONT,
                fontSize: TYPE.body,
                fontWeight: 500,
                color: C.darkText,
                marginBottom: 4,
              }}>
                {cat.label}
              </Text>
              <PdfScoreBar score={cat.score} height={6} />
            </View>

            {/* Maturity tier */}
            <Text style={{
              width: 70,
              fontFamily: FONT,
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: col,
              textAlign: "right",
            }}>
              {scoreTier(cat.score)}
            </Text>
          </View>
        );
      })}

      <PdfFooter />
    </Page>
  );
}
