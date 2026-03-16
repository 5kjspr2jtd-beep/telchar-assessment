// ── Execution Prompts Page (Light) ───────────────────────────
// Ready-to-use Claude prompts tied to the buyer's actual
// recommendations and tool path. Full tier only.
// Content may span multiple PDF pages.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfDiamond } from "../primitives";

function PromptCard({ prompt, index }) {
  const ac = prompt.accentColor || C.blue;

  return (
    <View wrap={false} style={{
      backgroundColor: C.cardBg,
      borderWidth: 1,
      borderColor: C.cardBorder,
      borderLeftWidth: 3,
      borderLeftColor: ac,
      borderRadius: SP.cardRadius,
      padding: SP.cardPad,
      marginBottom: 10,
    }}>
      {/* Prompt header */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 6 }}>
        <View style={{
          width: 22, height: 22, borderRadius: 5,
          backgroundColor: `${ac}18`,
          alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{
            fontFamily: FONT, fontSize: 9, fontWeight: 600, color: ac,
          }}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: FONT, fontSize: TYPE.subhead - 2, fontWeight: 500,
            color: C.darkText,
          }}>
            {prompt.title}
          </Text>
        </View>
      </View>

      {/* When to use */}
      <Text style={{
        fontFamily: SERIF, fontSize: TYPE.smallBody - 1, fontStyle: "italic",
        color: C.mutedDark, lineHeight: 1.5, marginBottom: 8, marginLeft: 32,
      }}>
        {prompt.when}
      </Text>

      {/* Prompt body */}
      <View style={{
        marginLeft: 32,
        backgroundColor: `${ac}08`,
        borderWidth: 1,
        borderColor: `${ac}15`,
        borderRadius: 4,
        padding: 10,
      }}>
        <Text style={{
          fontFamily: FONT, fontSize: 7, fontWeight: 600,
          color: ac, letterSpacing: 0.8,
          marginBottom: 6,
        }}>
          PROMPT — COPY AND PASTE INTO CLAUDE
        </Text>
        <Text style={{
          fontFamily: FONT, fontSize: TYPE.smallBody - 1, fontWeight: 300,
          color: C.dimDark, lineHeight: 1.55,
        }}>
          {prompt.promptBody}
        </Text>
      </View>
    </View>
  );
}

export default function ExecutionPromptsPage({ data }) {
  const { co, executionPrompts } = data;
  const prompts = executionPrompts || [];

  return (
    <Page size="A4" style={{
      backgroundColor: C.offwhite,
      paddingTop: SP.accentStrip + SP.pageMargin,
      paddingBottom: SP.pageMargin + 20,
      paddingHorizontal: SP.pageMargin,
    }}>
      <PdfAccentStrip />
      <PdfHeader sectionTitle="Execution Prompts" co={co} />

      <PdfSecLabel>Execution Prompts</PdfSecLabel>
      <Text style={{
        fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
        color: C.dimDark, lineHeight: 1.7, marginBottom: 6,
      }}>
        Ready-to-use prompts for Claude, tied to your actual recommendations and tool path. Copy any prompt, paste it into Claude chat at claude.ai, replace the bracketed placeholders with your real details, and get useful output immediately.
      </Text>
      <Text style={{
        fontFamily: SERIF, fontSize: TYPE.smallBody - 1, fontStyle: "italic",
        color: C.mutedDark, lineHeight: 1.5, marginBottom: 14,
      }}>
        All prompts are designed for Claude chat. Open a free conversation, paste the prompt, and follow the output.
      </Text>

      {prompts.map((prompt, i) => {
        const ac = prompt.accentColor || C.blue;
        const showCat = i === 0 || prompt.category !== prompts[i - 1]?.category;
        return (
          <View key={prompt.id}>
            {showCat && (
              <View style={{ marginTop: i === 0 ? 0 : 14, marginBottom: 8, paddingLeft: 2 }}>
                <Text style={{
                  fontFamily: FONT, fontSize: TYPE.micro, fontWeight: 600,
                  letterSpacing: 1.6, textTransform: "uppercase", color: ac,
                }}>
                  {prompt.category === "BASE" ? "CORE PROMPTS" : "BASED ON YOUR RECOMMENDATIONS"}
                </Text>
              </View>
            )}
            <PromptCard prompt={prompt} index={i} />
          </View>
        );
      })}

      <PdfFooter />
    </Page>
  );
}
