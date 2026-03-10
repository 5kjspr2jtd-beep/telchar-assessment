// ── Cover Page (Dark) ────────────────────────────────────────
// Full-bleed navy background. Centered hero: logo, company name,
// score, tier, metadata row. Sets the Telchar brand tone.

import React from "react";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfFooter, PdfDiamondRule } from "../primitives";
import { scoreColor, scoreTier } from "../../design/telcharDesign";
import { REPORT_NOTES } from "../../data/reportData";
import telcharLogo from "../fonts/telchar-logo-white.png";

export default function CoverPage({ data }) {
  const { co, ind, scores, date, benchmark: bench } = data;
  const col = scoreColor(scores.overall);

  return (
    <Page size="A4" style={{ backgroundColor: C.navy, padding: 0 }}>
      <PdfAccentStrip />

      {/* Centered content */}
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: SP.pageMargin + 20,
        paddingTop: 60,
        paddingBottom: 80,
      }}>
        {/* Logo */}
        <Image
          src={telcharLogo}
          style={{ width: 140, height: "auto", marginBottom: 32, objectFit: "contain" }}
        />

        {/* Eyebrow */}
        <Text style={{
          fontFamily: FONT,
          fontSize: 7,
          fontWeight: 600,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: C.mutedWhite,
          marginBottom: 24,
        }}>
          AI READINESS INDEX™
        </Text>

        {/* Company name */}
        <Text style={{
          fontFamily: FONT,
          fontSize: 38,
          fontWeight: 300,
          color: C.white,
          letterSpacing: -0.5,
          textAlign: "center",
          marginBottom: 8,
        }}>
          {co}
        </Text>

        {/* Industry */}
        <Text style={{
          fontFamily: FONT,
          fontSize: TYPE.body,
          fontWeight: 300,
          color: C.dimWhite,
          marginBottom: 36,
        }}>
          {ind}
        </Text>

        {/* Score */}
        <Text style={{
          fontFamily: FONT,
          fontSize: 72,
          fontWeight: 300,
          color: col,
          lineHeight: 1,
          letterSpacing: -2,
          marginBottom: 6,
        }}>
          {scores.overall}
        </Text>

        {/* Tier */}
        <Text style={{
          fontFamily: FONT,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: col,
          marginBottom: 4,
        }}>
          {scoreTier(scores.overall)}
        </Text>

        {/* Out of 100 */}
        <Text style={{
          fontFamily: FONT,
          fontSize: 8,
          color: C.mutedWhite,
          marginBottom: 20,
        }}>
          out of 100
        </Text>

        {/* Score bar */}
        <View style={{ width: 200, height: 3, backgroundColor: C.lineWhite, borderRadius: 1, marginBottom: 28 }}>
          <View style={{
            width: `${scores.overall}%`,
            height: "100%",
            backgroundColor: col,
            borderRadius: 1,
          }} />
        </View>

        {/* Disclaimer */}
        <Text style={{
          fontFamily: FONT,
          fontSize: 9,
          fontWeight: 300,
          color: C.dimWhite,
          textAlign: "center",
          lineHeight: 1.7,
          maxWidth: 380,
          marginBottom: 28,
        }}>
          {REPORT_NOTES.disclaimer}
        </Text>

        {/* Metadata row */}
        <View style={{ flexDirection: "row", gap: 0 }}>
          {[
            ["ASSESSMENT DATE", date],
            ["FRAMEWORK", bench?.meta?.framework || "v2.4 · Five Category"],
            ["CLASSIFICATION", REPORT_NOTES.classification],
          ].map(([label, value], i) => (
            <View key={label} style={{
              paddingHorizontal: 16,
              borderRightWidth: i < 2 ? 1 : 0,
              borderRightColor: C.lineWhite,
              alignItems: "center",
            }}>
              <Text style={{
                fontFamily: FONT,
                fontSize: 6,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: C.mutedWhite,
                marginBottom: 4,
              }}>
                {label}
              </Text>
              <Text style={{
                fontFamily: FONT,
                fontSize: 9,
                fontWeight: 500,
                color: C.white,
              }}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <PdfFooter dark />
    </Page>
  );
}
