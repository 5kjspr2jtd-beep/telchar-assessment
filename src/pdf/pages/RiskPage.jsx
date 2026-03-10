// ── Risk Page (Light) ────────────────────────────────────────
// Engine-generated risks with structured fields.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel } from "../primitives";

const SEVERITY_COLOR = {
  High: C.red,
  Medium: C.amber,
  Low: C.green,
};

export default function RiskPage({ data }) {
  const { co, risks } = data;
  const riskList = risks || [];
  const hasHigh = riskList.some(r => r.severity === "High");
  const highCount = riskList.filter(r => r.severity === "High").length;
  const introText = hasHigh
    ? `Based on your answers, we identified ${riskList.length} things that could slow down implementation. ${highCount === 1 ? "One needs" : "Some need"} attention early. All of them are manageable — here is what to watch for and what to do about each one.`
    : `Based on your answers, we identified ${riskList.length} things that could slow down implementation. None of them are serious, but they are worth knowing about. Here is what to watch for and what to do about each one.`;

  return (
    <Page size="A4" style={{
      backgroundColor: C.offwhite,
      paddingTop: SP.accentStrip + SP.pageMargin,
      paddingBottom: SP.pageMargin + 20,
      paddingHorizontal: SP.pageMargin,
    }}>
      <PdfAccentStrip />
      <PdfHeader sectionTitle="Risk Analysis" co={co} />

      <PdfSecLabel>Risk Analysis</PdfSecLabel>
      <Text style={{
        fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
        color: C.dimDark, lineHeight: 1.7, marginBottom: 14,
      }}>
        {introText}
      </Text>

      {riskList.map((risk, i) => (
        <View key={i} wrap={false} style={{
          backgroundColor: C.cardBg,
          borderWidth: 1,
          borderColor: C.cardBorder,
          borderRadius: SP.cardRadius,
          padding: SP.cardPad,
          marginBottom: 8,
        }}>
          {/* Header row: label + severity */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Text style={{
              fontFamily: FONT, fontSize: TYPE.body, fontWeight: 500,
              color: C.darkText, flex: 1,
            }}>
              {risk.label}
            </Text>
            <View style={{ width: 60, alignItems: "flex-end" }}>
              <Text style={{
                fontFamily: FONT, fontSize: 7, fontWeight: 600,
                letterSpacing: 1.2, textTransform: "uppercase",
                color: C.mutedDark, marginBottom: 2,
              }}>
                SEVERITY
              </Text>
              <Text style={{
                fontFamily: FONT, fontSize: TYPE.body, fontWeight: 500,
                color: SEVERITY_COLOR[risk.severity] || C.darkText,
              }}>
                {risk.severity}
              </Text>
            </View>
          </View>

          {/* Structured fields */}
          {risk.reason && (
            <Text style={{ fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300, color: C.dimDark, lineHeight: 1.6, marginBottom: 3 }}>
              <Text style={{ fontWeight: 500 }}>Why it matters: </Text>{risk.reason}
            </Text>
          )}
          {risk.watch && (
            <Text style={{ fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300, color: C.dimDark, lineHeight: 1.6, marginBottom: 3 }}>
              <Text style={{ fontWeight: 500 }}>What to watch: </Text>{risk.watch}
            </Text>
          )}
          {risk.mitigation && (
            <Text style={{ fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300, color: C.dimDark, lineHeight: 1.6 }}>
              <Text style={{ fontWeight: 500 }}>Mitigation: </Text>{risk.mitigation}
            </Text>
          )}
        </View>
      ))}

      <PdfFooter />
    </Page>
  );
}
