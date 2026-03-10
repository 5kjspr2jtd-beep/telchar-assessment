// ── Category Page (Light) ────────────────────────────────────
// One per category. Score header, analysis text,
// benchmark comparison, recommended tool approach.
// Aims to fit one page per category where composition is strong;
// allows natural overflow if content needs more room.

import React from "react";
import { Page, View, Text, Link } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfRule, PdfDiamondRule, PdfScoreBar, PdfBenchmarkBlock, PdfCard, PdfDiamond } from "../primitives";
import { scoreColor, scoreTier } from "../../design/telcharDesign";
import { getCategoryTool } from "../../data/reportData";

export default function CategoryPage({ catKey, data }) {
  const { co, scores, benchmark: bench, stack, categoryAnalyses } = data;
  const cat = scores.cats.find(c => c.key === catKey);
  if (!cat) return null;

  const rec = getCategoryTool(catKey, cat.score, stack);
  const tool = rec.tool;
  const col = scoreColor(cat.score);

  // Use engine-generated category analysis
  const analysis = categoryAnalyses?.[catKey] || {};
  const hasAnalysis = analysis.diagnosis;

  return (
    <Page size="A4" style={{ backgroundColor: C.offwhite, paddingTop: SP.accentStrip + SP.pageMargin, paddingBottom: SP.pageMargin + 20, paddingHorizontal: SP.pageMargin }}>
      <PdfAccentStrip />
      <PdfHeader sectionTitle="Category Analysis" co={co} />

      <PdfSecLabel>Category Analysis</PdfSecLabel>

      {/* Category header: score + name + bar */}
      <View style={{ flexDirection: "row", gap: 20, marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.lineDark }}>
        <View>
          <Text style={{ fontFamily: FONT, fontSize: 40, fontWeight: 300, color: col, lineHeight: 1, letterSpacing: -1 }}>
            {cat.score}
          </Text>
          <Text style={{ fontFamily: FONT, fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: col, marginTop: 2 }}>
            {scoreTier(cat.score)}
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontFamily: FONT, fontSize: TYPE.subhead, fontWeight: 500, color: C.darkText, marginBottom: 6 }}>
            {cat.label}
          </Text>
          <PdfScoreBar score={cat.score} height={7} />
        </View>
      </View>

      <PdfDiamondRule />

      {/* Analysis */}
      <PdfSecLabel>Analysis</PdfSecLabel>
      {hasAnalysis ? (
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300, color: C.dimDark, lineHeight: 1.75, marginBottom: 8 }}>
            {analysis.diagnosis}
          </Text>
          {[
            ["What is working", analysis.strength],
            ["Clearest gap", analysis.gap],
            ["Why it matters", analysis.implication],
            ["Where to focus next", analysis.focus],
          ].map(([label, text]) => text ? (
            <View key={label} style={{ marginBottom: 5 }}>
              <Text style={{ fontFamily: FONT, fontSize: 7, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: C.mutedDark, marginBottom: 2 }}>
                {label}
              </Text>
              <Text style={{ fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300, color: C.dimDark, lineHeight: 1.65 }}>
                {text}
              </Text>
            </View>
          ) : null)}
        </View>
      ) : (
        <Text style={{ fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300, color: C.dimDark, lineHeight: 1.75, marginBottom: 14 }}>
          Category analysis unavailable.
        </Text>
      )}

      {/* Benchmark comparison */}
      <PdfBenchmarkBlock score={cat.score} benchmark={bench?.categories?.[catKey] ?? bench?.overall ?? 51} />

      <View style={{ marginTop: 14 }} />

      {/* Recommended approach */}
      <PdfSecLabel>Recommended Approach</PdfSecLabel>
      <PdfCard accentColor={C.blue}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <Link src={tool.url} style={{ fontFamily: FONT, fontSize: TYPE.subhead - 2, fontWeight: 500, color: C.darkText, textDecoration: "none" }}>
            {tool.name}
          </Link>
          <Text style={{ fontFamily: FONT, fontSize: 7, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: C.blue }}>
            {tool.role}
          </Text>
        </View>

        <Text style={{ fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300, color: C.dimDark, lineHeight: 1.65, marginBottom: 10 }}>
          {rec.focus}
        </Text>

        <PdfRule />

        <Text style={{ fontFamily: FONT, fontSize: 7, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: C.mutedDark, marginBottom: 6 }}>
          HOW IT APPLIES HERE
        </Text>
        {tool.examples.map((ex, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
            <View style={{ marginTop: 3 }}>
              <PdfDiamond size={5} fill={C.blue2} />
            </View>
            <Text style={{ fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300, color: C.dimDark, lineHeight: 1.55, flex: 1 }}>
              {ex}
            </Text>
          </View>
        ))}

        {tool.startHere && tool.startHere.length > 0 && (
          <>
            <PdfRule />
            <Text style={{ fontFamily: FONT, fontSize: 7, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: C.mutedDark, marginBottom: 6 }}>
              START HERE
            </Text>
            {tool.startHere.map((link, i) => (
              <Link key={i} src={link.url} style={{ fontFamily: FONT, fontSize: TYPE.smallBody, color: C.blue, marginBottom: 3, textDecoration: "none" }}>
                {link.label} →
              </Link>
            ))}
          </>
        )}
      </PdfCard>

      <PdfFooter />
    </Page>
  );
}
