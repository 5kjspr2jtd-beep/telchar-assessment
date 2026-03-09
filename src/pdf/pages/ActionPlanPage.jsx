// ── 30-Day Action Plan Page (Light) ──────────────────────────
// Practical first-month operating plan derived from top 3 wins,
// roadmap phases, and recommended tools already in the report.
// Three blocks: Days 1-7, Days 8-14, Days 15-30.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfDiamond } from "../primitives";

const BLOCK_ACCENTS = [
  { color: "#2563eb", label: "FOUNDATION" },
  { color: "#22c55e", label: "FIRST WORKFLOW" },
  { color: "#f59e0b", label: "EXPAND & MEASURE" },
];

function ActionBlock({ block, index }) {
  const accent = BLOCK_ACCENTS[index];

  return (
    <View wrap={false} style={{
      backgroundColor: C.cardBg,
      borderWidth: 1,
      borderColor: C.cardBorder,
      borderLeftWidth: 3,
      borderLeftColor: accent.color,
      borderRadius: SP.cardRadius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    }}>
      {/* Header row */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 6 }}>
        <View style={{
          width: 22, height: 22, borderRadius: 5,
          backgroundColor: `${accent.color}18`,
          alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, color: accent.color }}>
            0{index + 1}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: FONT, fontSize: 8, fontWeight: 600,
            letterSpacing: 1, textTransform: "uppercase",
            color: accent.color, marginBottom: 1,
          }}>
            {block.window}
          </Text>
          <Text style={{
            fontFamily: FONT, fontSize: TYPE.body, fontWeight: 500,
            color: C.darkText,
          }}>
            {block.label}
          </Text>
        </View>
        <Text style={{
          fontFamily: FONT, fontSize: 7, fontWeight: 600,
          letterSpacing: 0.8, textTransform: "uppercase",
          color: accent.color,
          backgroundColor: `${accent.color}12`,
          borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2,
          alignSelf: "flex-start",
        }}>
          {accent.label}
        </Text>
      </View>

      {/* Objective */}
      <Text style={{
        fontFamily: SERIF, fontSize: TYPE.smallBody - 1, fontStyle: "italic",
        color: C.mutedDark, lineHeight: 1.5, marginBottom: 6, marginLeft: 32,
      }}>
        {block.objective}
      </Text>

      {/* Actions */}
      <View style={{ marginLeft: 32, marginBottom: 6 }}>
        {block.actions.map((action, j) => (
          <View key={j} style={{ flexDirection: "row", gap: 5, marginBottom: 3 }}>
            <View style={{ marginTop: 3 }}>
              <PdfDiamond size={4} fill={accent.color} />
            </View>
            <Text style={{
              fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300,
              color: C.dimDark, lineHeight: 1.5, flex: 1,
            }}>
              {action}
            </Text>
          </View>
        ))}
      </View>

      {/* Outcome + Tool row */}
      <View style={{
        flexDirection: "row", marginLeft: 32,
        borderTopWidth: 1, borderTopColor: C.lineDark, paddingTop: 6,
      }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{
            fontFamily: FONT, fontSize: 7, fontWeight: 600,
            letterSpacing: 1.2, textTransform: "uppercase",
            color: C.mutedDark, marginBottom: 2,
          }}>
            Expected Outcome
          </Text>
          <Text style={{
            fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 300,
            color: C.dimDark, lineHeight: 1.45,
          }}>
            {block.outcome}
          </Text>
        </View>
        <View style={{
          minWidth: 80, paddingLeft: 12,
          borderLeftWidth: 1, borderLeftColor: C.lineDark,
        }}>
          <Text style={{
            fontFamily: FONT, fontSize: 7, fontWeight: 600,
            letterSpacing: 1.2, textTransform: "uppercase",
            color: C.mutedDark, marginBottom: 2,
          }}>
            Primary Tool
          </Text>
          <Text style={{
            fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 500,
            color: C.darkText,
          }}>
            {block.tool}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function ActionPlanPage({ data }) {
  const { co, wins, clientTools } = data;

  const win1 = wins[0], win2 = wins[1], win3 = wins[2];
  const toolList = (clientTools || []).join(", ");

  const blocks = [
    {
      window: "Days 1 – 7", label: "Foundation",
      objective: `Set up your primary automation platform and scope the first workflow: ${win1?.title || "highest-priority improvement"}.`,
      actions: [
        `Create a ${win1?.tool || "Make"} account and connect your core tools (${toolList})`,
        "Audit the manual steps in your highest-priority workflow and document each handoff",
        "Define what 'done' looks like: expected trigger, output, and success metric",
        "Run a test scenario end-to-end in a sandbox before going live",
      ],
      outcome: "Platform configured, first workflow scoped and tested, team aligned on what changes.",
      tool: win1?.tool || "Make",
    },
    {
      window: "Days 8 – 14", label: "First Workflow Live",
      objective: `Deploy your first automation and begin scoping the second priority: ${win2?.title || "next improvement"}.`,
      actions: [
        "Move the first workflow from test to production with error handling and alerts",
        "Brief the team: what is automated, what to watch for, when to escalate",
        `Begin scoping the second workflow using ${win2?.tool || "Claude + Make"}`,
        "Track daily performance for the first week — log any failures or edge cases",
      ],
      outcome: "One workflow running in production. Second workflow scoped and ready to build.",
      tool: win2?.tool || "Make + Claude Pro",
    },
    {
      window: "Days 15 – 30", label: "Expand and Measure",
      objective: `Deploy the second workflow and begin the third: ${win3?.title || "remaining priority"}. Measure results against baseline.`,
      actions: [
        "Build and deploy the second automation with the same test-then-deploy pattern",
        `Scope and start building the third workflow using ${win3?.tool || "Claude + Make"}`,
        "Compare actual time savings against the estimated impact from this report",
        "Document all live workflows: trigger, steps, owner, and error handling",
      ],
      outcome: "Two workflows live, third in progress. Measurable time recovery confirmed.",
      tool: win3?.tool || "Make + Claude Pro",
    },
  ];

  return (
    <Page size="A4" style={{
      backgroundColor: C.offwhite,
      paddingTop: SP.accentStrip + SP.pageMargin,
      paddingBottom: SP.pageMargin + 20,
      paddingHorizontal: SP.pageMargin,
    }}>
      <PdfAccentStrip />
      <PdfHeader sectionTitle="30-Day Action Plan" co={co} />

      <PdfSecLabel>30-Day Action Plan</PdfSecLabel>
      <Text style={{
        fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
        color: C.dimDark, lineHeight: 1.6, marginBottom: 10,
      }}>
        A practical first-month operating plan built from your top three priorities. Each block has a clear objective, concrete actions, and expected outcome. This plan feeds directly into the full 90-day roadmap.
      </Text>

      {blocks.map((block, i) => (
        <ActionBlock key={i} block={block} index={i} />
      ))}

      <PdfFooter />
    </Page>
  );
}
