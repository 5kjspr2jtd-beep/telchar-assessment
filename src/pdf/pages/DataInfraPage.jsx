// ── Data Infrastructure Page (Light) ─────────────────────────
// Four-layer data architecture visualization.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfDiamond } from "../primitives";

const LAYERS = [
  {
    num: "01", title: "Source Systems", accentColor: "#2563eb",
    desc: "QuickBooks (financial), Gmail (communications), Google Calendar (scheduling). These are the authoritative data sources. All automation reads from and writes to these systems.",
  },
  {
    num: "02", title: "Integration Layer", accentColor: "#22c55e",
    desc: "Make connects the source systems and routes data between them on a defined schedule or trigger. No data is duplicated manually — it flows through Make automatically.",
  },
  {
    num: "03", title: "Intelligence Layer", accentColor: "#a855f7",
    desc: "Claude receives structured inputs from Make (job details, customer records, financial summaries) and produces outputs (drafted messages, summaries, analysis). Outputs are delivered back through Make.",
  },
  {
    num: "04", title: "Visibility Layer", accentColor: "#f59e0b",
    desc: "A lightweight dashboard (Looker Studio or equivalent, cost: $0) pulls from QuickBooks and Make data to provide a live view of business performance without manual compilation.",
  },
];

export default function DataInfraPage({ data }) {
  const { co } = data;

  return (
    <Page size="A4" style={{
      backgroundColor: C.offwhite,
      paddingTop: SP.accentStrip + SP.pageMargin,
      paddingBottom: SP.pageMargin + 20,
      paddingHorizontal: SP.pageMargin,
    }}>
      <PdfAccentStrip />
      <PdfHeader sectionTitle="Data Infrastructure" co={co} />

      <PdfSecLabel>Data Infrastructure Plan</PdfSecLabel>
      <Text style={{
        fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
        color: C.dimDark, lineHeight: 1.7, marginBottom: 14,
      }}>
        A four-layer data architecture built on tools already in use. No new software subscriptions beyond Make and Claude Pro. Total infrastructure cost under $30 per month.
      </Text>

      {LAYERS.map((layer, i) => (
        <View key={i} wrap={false} style={{
          backgroundColor: C.cardBg,
          borderWidth: 1,
          borderColor: C.cardBorder,
          borderLeftWidth: 3,
          borderLeftColor: layer.accentColor,
          borderRadius: SP.cardRadius,
          padding: SP.cardPad,
          marginBottom: 10,
          flexDirection: "row",
          gap: 12,
        }}>
          {/* Number badge */}
          <View style={{
            width: 26, height: 26, borderRadius: 5,
            backgroundColor: `${layer.accentColor}18`,
            alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Text style={{
              fontFamily: FONT, fontSize: 9, fontWeight: 700,
              color: layer.accentColor,
            }}>
              {layer.num}
            </Text>
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: FONT, fontSize: TYPE.subhead - 2, fontWeight: 500,
              color: C.darkText, marginBottom: 4,
            }}>
              {layer.title}
            </Text>
            <Text style={{
              fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300,
              color: C.dimDark, lineHeight: 1.6,
            }}>
              {layer.desc}
            </Text>
          </View>
        </View>
      ))}

      <PdfFooter />
    </Page>
  );
}
