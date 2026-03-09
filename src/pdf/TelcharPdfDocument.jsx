// ── Telchar PDF Document ─────────────────────────────────────
// Root <Document> that assembles pages based on tier.
//
// FREE:    Cover + Summary + QuickWins (1 win)
// STARTER: + all 5 Categories + full QuickWins + Impact
// FULL:    + Roadmap + Risk + DataInfra + Engagement

import React from "react";
import { Document } from "@react-pdf/renderer";
import { CATEGORY_KEYS } from "../data/reportData";
import CoverPage from "./pages/CoverPage";
import SummaryPage from "./pages/SummaryPage";
import QuickWinsPage from "./pages/QuickWinsPage";
import CategoryPage from "./pages/CategoryPage";
import RoadmapPage from "./pages/RoadmapPage";
import RiskPage from "./pages/RiskPage";
import DataInfraPage from "./pages/DataInfraPage";
import EngagementPage from "./pages/EngagementPage";

export default function TelcharPdfDocument({ data }) {
  const { tier } = data;
  const isStarter = tier === "starter" || tier === "full";
  const isFull = tier === "full";

  return (
    <Document
      title={`Telchar AI Report - ${data.co}`}
      author="Telchar AI"
      subject="AI Readiness Assessment Report"
      keywords="AI, readiness, assessment, automation"
    >
      {/* ── All tiers ── */}
      <CoverPage data={data} />
      <SummaryPage data={data} />
      <QuickWinsPage data={data} />

      {/* ── Starter + Full ── */}
      {isStarter && CATEGORY_KEYS.map(key => (
        <CategoryPage key={key} catKey={key} data={data} />
      ))}

      {/* ── Full only ── */}
      {isFull && <RoadmapPage data={data} />}
      {isFull && <RiskPage data={data} />}
      {isFull && <DataInfraPage data={data} />}
      {isFull && <EngagementPage data={data} />}
    </Document>
  );
}
