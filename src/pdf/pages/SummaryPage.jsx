// ── Summary Page (Light) ─────────────────────────────────────
// Overall score, interpretation, benchmark comparison,
// and category breakdown table.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfRule, PdfDiamondRule, PdfScoreBar, PdfScoreBlock, PdfBenchmarkBlock } from "../primitives";
import { scoreColor, scoreTier } from "../../design/telcharDesign";

export default function SummaryPage({ data }) {
  const { co, ind, scores, benchmark } = data;
  const delta = scores.overall - benchmark;
  const sorted = [...scores.cats].sort((a, b) => a.score - b.score);
  const lowest2 = sorted.slice(0, 2).map(c => c.label).join(" and ");

  const interp = `A score of ${scores.overall} places ${co} in the ${scoreTier(scores.overall)} tier, ${delta >= 0 ? delta + " points above" : Math.abs(delta) + " points below"} the SMB benchmark of ${benchmark}. ${scores.overall < 65
    ? "The organization has established operational infrastructure but carries identifiable automation gaps across scheduling, reporting, and customer follow-up."
    : "The organization demonstrates strong operational foundations with clear opportunity for targeted AI implementation."
  } ${lowest2} represent the most direct path to measurable improvement within a structured 90-day window.`;

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
            ["SMB Benchmark", `${benchmark} / 100`],
          ].map(([label, value]) => (
            <View key={label} style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 4,
              borderBottomWidth: 1,
              borderBottomColor: C.lineDark,
            }}>
              <Text style={{ fontFamily: FONT, fontSize: 7, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: C.mutedDark }}>
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
          <PdfBenchmarkBlock score={scores.overall} benchmark={benchmark} />
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
