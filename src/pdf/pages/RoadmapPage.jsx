// ── Roadmap Page (Light) ─────────────────────────────────────
// Engine-generated 90-day implementation roadmap.
// Content flows naturally across pages — no forced breaks.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfDiamond } from "../primitives";

function PhaseBlock({ phase }) {
  return (
    <View wrap={false} style={{
      backgroundColor: C.cardBg,
      borderWidth: 1,
      borderColor: C.cardBorder,
      borderLeftWidth: 3,
      borderLeftColor: phase.accentColor,
      borderRadius: SP.cardRadius,
      padding: SP.cardPad,
      marginBottom: 10,
    }}>
      {/* Phase header */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 8 }}>
        {/* Phase number badge */}
        <View style={{
          width: 24, height: 24, borderRadius: 5,
          backgroundColor: `${phase.accentColor}18`,
          alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{
            fontFamily: FONT, fontSize: 9, fontWeight: 600,
            color: phase.accentColor,
          }}>
            {phase.phaseNum}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: FONT, fontSize: 8, fontWeight: 600,
            letterSpacing: 1, textTransform: "uppercase",
            color: phase.accentColor, marginBottom: 2,
          }}>
            {phase.window}
          </Text>
          <Text style={{
            fontFamily: FONT, fontSize: TYPE.subhead - 2, fontWeight: 500,
            color: C.darkText,
          }}>
            {phase.label}
          </Text>
        </View>
      </View>

      {/* Goal */}
      {phase.goal && (
        <Text style={{
          fontFamily: SERIF, fontSize: TYPE.smallBody - 1, fontStyle: "italic",
          color: C.mutedDark, lineHeight: 1.55, marginBottom: 8, marginLeft: 36,
        }}>
          {phase.goal}
        </Text>
      )}

      {/* Steps */}
      <View style={{ marginLeft: 36 }}>
        {(phase.steps || []).map((step, j) => (
          <View key={j} style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
            <View style={{ marginTop: 3 }}>
              <PdfDiamond size={5} fill={phase.accentColor} />
            </View>
            <Text style={{
              fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300,
              color: C.dimDark, lineHeight: 1.55, flex: 1,
            }}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function RoadmapPage({ data }) {
  const { co, roadmap } = data;
  const phases = roadmap || [];

  return (
    <Page size="A4" style={{
      backgroundColor: C.offwhite,
      paddingTop: SP.accentStrip + SP.pageMargin,
      paddingBottom: SP.pageMargin + 20,
      paddingHorizontal: SP.pageMargin,
    }}>
      <PdfAccentStrip />
      <PdfHeader sectionTitle="90-Day Roadmap" co={co} />

      <PdfSecLabel>90-Day Implementation Roadmap</PdfSecLabel>
      <Text style={{
        fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
        color: C.dimDark, lineHeight: 1.7, marginBottom: 14,
      }}>
        Structured as five progressive phases: setup, pilot, expansion, stabilization, and measurement. Each phase builds on the prior without disrupting operational continuity.
      </Text>

      {phases.map((phase) => (
        <PhaseBlock key={phase.phaseNum} phase={phase} />
      ))}

      <PdfFooter />
    </Page>
  );
}
