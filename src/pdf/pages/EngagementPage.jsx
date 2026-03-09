// ── Engagement Page (Dark) ───────────────────────────────────
// Dark bookend page — CTA for implementation support.
// Mirrors the cover page's dark navy treatment.

import React from "react";
import { Page, View, Text, Link } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfFooter, PdfDiamondRule } from "../primitives";
import { REPORT_NOTES, APPLY_URL } from "../../data/reportData";

export default function EngagementPage({ data }) {
  const { co } = data;

  return (
    <Page size="A4" style={{ backgroundColor: C.navy, padding: 0 }}>
      <PdfAccentStrip />

      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: SP.pageMargin + 30,
        paddingTop: 80,
        paddingBottom: 100,
      }}>
        {/* Eyebrow */}
        <Text style={{
          fontFamily: FONT, fontSize: 8, fontWeight: 600,
          letterSpacing: 2, textTransform: "uppercase",
          color: C.blue2, marginBottom: 20,
          textAlign: "center",
        }}>
          NEXT STEPS
        </Text>

        {/* Headline */}
        <Text style={{
          fontFamily: FONT, fontSize: 28, fontWeight: 300,
          color: C.white, lineHeight: 1.25,
          letterSpacing: -0.3,
          marginBottom: 24,
          maxWidth: 420,
          textAlign: "center",
        }}>
          Do you want project and program leadership support to help implement these recommendations with your team?
        </Text>

        {/* Divider */}
        <View style={{ width: 360, height: 1, backgroundColor: C.lineWhite, marginBottom: 24 }} />

        {/* Body paragraphs */}
        <Text style={{
          fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
          color: C.dimWhite, lineHeight: 1.75,
          marginBottom: 14,
          textAlign: "center",
          maxWidth: 440,
        }}>
          Receiving a detailed report with recommendations, tools, and steps is valuable — but many businesses find the gap between knowing what to do and actually doing it difficult to close on their own. That hesitation is common and understandable.
        </Text>

        <Text style={{
          fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
          color: C.dimWhite, lineHeight: 1.75,
          marginBottom: 36,
          textAlign: "center",
          maxWidth: 440,
        }}>
          Structured implementation support may be available to help your team move from report to execution — with clear milestones, accountability, and hands-on guidance. Support is selective and fit-based.
        </Text>

        {/* CTA block — centered, clickable */}
        <Link src={APPLY_URL} style={{ textDecoration: "none" }}>
          <View style={{
            backgroundColor: C.blue,
            borderRadius: 6,
            paddingVertical: 14,
            paddingHorizontal: 40,
            alignItems: "center",
            marginBottom: 10,
          }}>
            <Text style={{
              fontFamily: FONT, fontSize: 10, fontWeight: 600,
              letterSpacing: 1.2, textTransform: "uppercase",
              color: C.white,
            }}>
              APPLY FOR IMPLEMENTATION SUPPORT
            </Text>
          </View>
        </Link>

        <Text style={{
          fontFamily: FONT, fontSize: 8, fontWeight: 400,
          color: C.dimWhite, marginBottom: 16,
          textAlign: "center",
        }}>
          www.telcharai.com/apply
        </Text>

        {/* Fine print */}
        <Text style={{
          fontFamily: FONT, fontSize: 9, fontWeight: 300,
          color: C.mutedWhite, marginBottom: 24,
          textAlign: "center",
        }}>
          {REPORT_NOTES.availabilityNote}
        </Text>

        <PdfDiamondRule dark style={{ marginBottom: 20, width: 360 }} />

        {/* Disclaimer */}
        <Text style={{
          fontFamily: SERIF, fontSize: TYPE.smallBody,
          fontStyle: "italic",
          color: C.mutedWhite, lineHeight: 1.6,
          textAlign: "center",
          maxWidth: 400,
        }}>
          {REPORT_NOTES.engagementDisclaimer}
        </Text>
      </View>

      <PdfFooter dark />
    </Page>
  );
}
