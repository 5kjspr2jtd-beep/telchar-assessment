// ── Implementation Guide Page (Light) ────────────────────────
// Practical how-to modules referenced by the 30-Day Action Plan
// and 90-Day Roadmap. Only modules needed by this report are shown.
// Content may span multiple PDF pages.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfDiamond } from "../primitives";

function GuideModule({ mod, index }) {
  return (
    <View wrap={false} style={{
      backgroundColor: C.cardBg,
      borderWidth: 1,
      borderColor: C.cardBorder,
      borderLeftWidth: 3,
      borderLeftColor: C.blue,
      borderRadius: SP.cardRadius,
      padding: SP.cardPad,
      marginBottom: 10,
    }}>
      {/* Module header */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 6 }}>
        <View style={{
          width: 22, height: 22, borderRadius: 5,
          backgroundColor: `${C.blue}18`,
          alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{
            fontFamily: FONT, fontSize: 9, fontWeight: 600, color: C.blue,
          }}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </View>
        <Text style={{
          fontFamily: FONT, fontSize: TYPE.subhead - 2, fontWeight: 500,
          color: C.darkText, flex: 1,
        }}>
          {mod.title}
        </Text>
      </View>

      {/* When to use */}
      <Text style={{
        fontFamily: SERIF, fontSize: TYPE.smallBody - 1, fontStyle: "italic",
        color: C.mutedDark, lineHeight: 1.5, marginBottom: 8, marginLeft: 32,
      }}>
        {mod.when}
      </Text>

      {/* Steps */}
      <View style={{ marginLeft: 32 }}>
        {(mod.steps || []).map((step, j) => (
          <View key={j} style={{ flexDirection: "row", gap: 5, marginBottom: 4 }}>
            <View style={{ marginTop: 3 }}>
              <PdfDiamond size={4} fill={C.blue} />
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

export default function ImplementationGuidePage({ data }) {
  const { co, implementationGuide } = data;
  const modules = implementationGuide || [];

  return (
    <Page size="A4" style={{
      backgroundColor: C.offwhite,
      paddingTop: SP.accentStrip + SP.pageMargin,
      paddingBottom: SP.pageMargin + 20,
      paddingHorizontal: SP.pageMargin,
    }}>
      <PdfAccentStrip />
      <PdfHeader sectionTitle="Implementation Guide" co={co} />

      <PdfSecLabel>Implementation Guide</PdfSecLabel>
      <Text style={{
        fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
        color: C.dimDark, lineHeight: 1.7, marginBottom: 14,
      }}>
        Step-by-step instructions for the tasks referenced in your 30-day action plan and 90-day roadmap. Each section tells you exactly how to do one thing. Start with the ones your plan references, then come back for the rest when you need them.
      </Text>

      {modules.map((mod, i) => (
        <GuideModule key={mod.id} mod={mod} index={i} />
      ))}

      <PdfFooter />
    </Page>
  );
}
