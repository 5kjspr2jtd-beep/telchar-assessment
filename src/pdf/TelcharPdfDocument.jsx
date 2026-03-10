// ── Telchar PDF Document ─────────────────────────────────────
// Root <Document> that assembles pages based on tier.
//
// FREE: Cover + Summary + QuickWins (1 win)
// FULL: + all Quick Wins + Impact + 30-Day Action Plan
//       + 5 Categories + Roadmap + Risk + DataInfra + Engagement

import React from "react";
import { Document } from "@react-pdf/renderer";
import { CATEGORY_KEYS } from "../data/reportData";
import CoverPage from "./pages/CoverPage";
import SummaryPage from "./pages/SummaryPage";
import QuickWinsPage from "./pages/QuickWinsPage";
import ActionPlanPage from "./pages/ActionPlanPage";
import CategoryPage from "./pages/CategoryPage";
import RoadmapPage from "./pages/RoadmapPage";
import RiskPage from "./pages/RiskPage";
import DataInfraPage from "./pages/DataInfraPage";
import EngagementPage from "./pages/EngagementPage";

export default function TelcharPdfDocument({ data }) {
  const { tier } = data;
  const isFull = tier === "full";

  return (
    <Document
      title={`Telchar AI Report - ${data.co}`}
      author="Telchar AI"
      subject="AI Readiness Diagnostic Report"
      keywords="AI, readiness, diagnostic, automation"
    >
      {/* ── All tiers ── */}
      <CoverPage data={data} />
      <SummaryPage data={data} />
      <QuickWinsPage data={data} />

      {/* ── Full only ── */}
      {isFull && <ActionPlanPage data={data} />}
      {isFull && CATEGORY_KEYS.map(key => (
        <CategoryPage key={key} catKey={key} data={data} />
      ))}
      {isFull && <RoadmapPage data={data} />}
      {isFull && <RiskPage data={data} />}
      {isFull && <DataInfraPage data={data} />}
      {isFull && <EngagementPage data={data} />}
    </Document>
  );
}
