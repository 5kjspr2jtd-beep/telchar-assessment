// ── Data Infrastructure Page (Light) ─────────────────────────
// Four-layer data architecture visualization.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfDiamond } from "../primitives";

const LAYERS = [
  {
    num: "01", title: "Your Business Tools", accentColor: "#2563eb",
    desc: "QuickBooks (financial), Gmail (communications), Google Calendar (scheduling). These are the tools where your real data lives. Every automation reads from and writes back to these systems — they stay your single source of truth.",
  },
  {
    num: "02", title: "Connections Between Tools", accentColor: "#22c55e",
    desc: "Make connects your tools and moves data between them automatically — on a schedule or when something happens (like a new order or a completed job). No one has to copy and paste information from one tool to another.",
  },
  {
    num: "03", title: "AI That Reads and Writes for You", accentColor: "#a855f7",
    desc: "Claude gets information from Make (job details, customer records, financial summaries) and produces useful output — drafted emails, summaries, or analysis. The results are sent back through Make to wherever they need to go.",
  },
  {
    num: "04", title: "A Dashboard So You Can See What Is Happening", accentColor: "#f59e0b",
    desc: "A free dashboard (Looker Studio or similar) pulls from your tools and Make to show you how the business is performing — without anyone having to build a report by hand.",
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
        How your tools, automations, AI, and reporting fit together — built on the tools you already use. No new software beyond Make and Claude. Total cost under $30 per month.
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
