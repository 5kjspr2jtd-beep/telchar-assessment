// ── Roadmap Page (Light) ─────────────────────────────────────
// 90-day implementation roadmap with 5 progressive phases.
// Content flows naturally across pages — no forced breaks.

import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { C, FONT, SERIF, TYPE, SP } from "../pdfTokens";
import { PdfAccentStrip, PdfHeader, PdfFooter, PdfSecLabel, PdfDiamond } from "../primitives";

const PHASES = [
  {
    phaseNum: "01", window: "Week 1 – 2", label: "Setup and Baseline",
    accentColor: "#2563eb",
    goal: "Accounts configured, tools connected, priority list locked.",
    steps: [
      "Audit all manual workflows across operations, sales, content, and data categories",
      "Log time spent per task to establish baseline hours (use a shared tracker or spreadsheet)",
      "Rank workflows by frequency × time cost to identify top 3 automation candidates",
      "Create Make.com account, connect primary tools (CRM, email, invoicing, file storage)",
      "Verify API access and permissions for each connected tool",
      "Define success metrics for each candidate workflow (time saved, error rate, throughput)",
    ],
  },
  {
    phaseNum: "02", window: "Week 3 – 4", label: "First Pilot Live",
    accentColor: "#22c55e",
    goal: "One automated workflow running in production with error handling.",
    steps: [
      "Build the highest-priority Make scenario end-to-end in a test environment",
      "Add error handling: retry logic, fallback notifications, dead-letter logging",
      "Run 5–10 test cycles with real data, validate outputs match manual process",
      "Deploy to production with a monitoring dashboard (Make execution logs + alerts)",
      "Train 1–2 team members: what triggers it, how to check status, when to escalate",
      "Track pilot performance daily for the first week, then weekly",
    ],
  },
  {
    phaseNum: "03", window: "Week 5 – 8", label: "Expand and Validate",
    accentColor: "#f59e0b",
    goal: "Three workflows automated, measurable time recovery confirmed.",
    steps: [
      "Deploy second automation scenario using lessons from the pilot build",
      "Deploy third scenario — prioritize a cross-functional workflow (e.g., sales → operations handoff)",
      "Integrate Claude for at least one content or communication workflow (drafting, summarization, or classification)",
      "Compare actual time savings against Week 1–2 baseline for all three workflows",
      "Identify and fix edge cases or failure modes surfaced during the first 4 weeks of operation",
      "Document each workflow: trigger, steps, expected output, error handling, owner",
    ],
  },
  {
    phaseNum: "04", window: "Week 9 – 10", label: "Stabilize and Harden",
    accentColor: "#a855f7",
    goal: "All workflows stable, team operating independently, documentation complete.",
    steps: [
      "Review 30-day execution logs for each automation — flag error rates above 2%",
      "Refine scenarios: tighten filters, improve data validation, reduce false triggers",
      "Finalize team documentation: runbooks, escalation paths, troubleshooting guides",
      "Conduct a team walkthrough so all stakeholders understand what is automated and what is not",
      "Ensure at least one team member can modify or pause any scenario without outside help",
    ],
  },
  {
    phaseNum: "05", window: "Week 11 – 12", label: "Measure and Plan Next Phase",
    accentColor: "#4a80f5",
    goal: "Clear ROI data, next automation candidates identified, practice self-sustaining.",
    steps: [
      "Calculate total hours recovered per week across all automated workflows",
      "Compare actual ROI against the estimates in this report",
      "Identify the next 2–3 automation candidates based on updated workflow audit",
      "Assess whether additional tool integrations or Claude use cases are warranted",
      "Produce a one-page summary: what was automated, hours saved, cost impact, next steps",
    ],
  },
];

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
            fontFamily: FONT, fontSize: 9, fontWeight: 700,
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
        {phase.steps.map((step, j) => (
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
  const { co } = data;

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

      {PHASES.map((phase) => (
        <PhaseBlock key={phase.phaseNum} phase={phase} />
      ))}

      <PdfFooter />
    </Page>
  );
}
