// ── Risk Page (Light) ────────────────────────────────────────
// Four implementation risks with severity ratings.
// Compact enough to potentially share a page with DataInfra.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfCard } from "../primitives";

const RISKS = [
  {
    label: "Tool integration gaps",
    severity: "Medium",
    desc: "Make requires active integrations for each tool in use. If a tool does not have a Make connector, custom API configuration may be needed. Identify all tools in the stack before build begins.",
  },
  {
    label: "Team adoption friction",
    severity: "Low",
    desc: "Cowork operates through natural language, which reduces the learning curve significantly. Brief team orientation on what is automated — and what is not — prevents confusion.",
  },
  {
    label: "Data quality issues",
    severity: "Medium",
    desc: "Automation is only as reliable as the data it processes. Inconsistent job records or duplicate entries in QuickBooks will produce incorrect outputs. A data audit is recommended before automation is deployed at scale.",
  },
  {
    label: "Scope creep",
    severity: "Low",
    desc: "AI capability expands quickly. Attempting to automate too many workflows simultaneously increases risk and reduces quality. The phased roadmap is structured to prevent this by design.",
  },
];

const SEVERITY_COLOR = {
  High: C.red,
  Medium: C.amber,
  Low: C.green,
};

export default function RiskPage({ data }) {
  const { co } = data;

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
        Four implementation risks identified based on assessment findings. All are manageable within a structured engagement. None represent blockers.
      </Text>

      {RISKS.map((risk, i) => (
        <View key={i} wrap={false} style={{
          backgroundColor: C.cardBg,
          borderWidth: 1,
          borderColor: C.cardBorder,
          borderRadius: SP.cardRadius,
          padding: SP.cardPad,
          marginBottom: 8,
          flexDirection: "row",
          gap: 14,
        }}>
          {/* Risk content */}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: FONT, fontSize: TYPE.body, fontWeight: 500,
              color: C.darkText, marginBottom: 4,
            }}>
              {risk.label}
            </Text>
            <Text style={{
              fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300,
              color: C.dimDark, lineHeight: 1.6,
            }}>
              {risk.desc}
            </Text>
          </View>

          {/* Severity */}
          <View style={{ width: 60, alignItems: "flex-end" }}>
            <Text style={{
              fontFamily: FONT, fontSize: 7, fontWeight: 600,
              letterSpacing: 1.2, textTransform: "uppercase",
              color: C.mutedDark, marginBottom: 3,
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
      ))}

      <PdfFooter />
    </Page>
  );
}
