// ─────────────────────────────────────────────────────────────
// Shared Report Data Adapter
// Single source of truth for report data consumed by both
// the web report (TelcharReport.jsx) and the PDF renderer.
// Focused on data shaping and report-ready derivation only.
// No layout logic, no UI concerns.
// ─────────────────────────────────────────────────────────────

import { buildEngineOutput } from "./reportEngine";

// ── Report version ───────────────────────────────────────────
export const REPORT_VERSION = "2.0";

// ── Category taxonomy ────────────────────────────────────────
export const CATEGORY_LABELS = {
  operations: "Operations Efficiency",
  sales:      "Sales & Customer Experience",
  data:       "Data & Performance Visibility",
  content:    "Content & Knowledge Management",
  technology: "Technology Readiness",
};

export const CATEGORY_KEYS = ["operations", "sales", "data", "content", "technology"];

// ── Benchmark ────────────────────────────────────────────────
// Benchmark is now computed per-report by the engine (industry + size).
// The structured benchmark object lives on engine output:
//   benchmark.overall, benchmark.categories.{key}, benchmark.meta

// ── Tier metadata ────────────────────────────────────────────
// Two tiers only: Free Diagnostic + AI Action Plan (early access — pricing TBD)
export const TIERS = {
  free: { key: "free", label: "Free Diagnostic", price: null, pageCount: 3,  sections: ["cover", "summary", "quickWins"] },
  full: { key: "full", label: "AI Action Plan",  price: 150,  pageCount: 15, sections: ["cover", "summary", "quickWins", "actionPlan", "categories", "roadmap", "risk", "dataInfra", "engagement", "implementationGuide"] },
};

// Map URL tier params to internal tier names
export const TIER_MAP = { free: "free", plan: "full", report: "full" };

// ── Section visibility ───────────────────────────────────────
export function getSectionVisibility(tier) {
  const isFull = tier === "full";
  return {
    cover:      true,
    summary:    true,
    quickWins:  true,
    actionPlan: isFull,
    categories: isFull,
    roadmap:    isFull,
    risk:       isFull,
    dataInfra:  isFull,
    engagement: isFull,
    implementationGuide: isFull,
  };
}

// ── Site URLs ──────────────────────────────────────────────────
// Single source of truth for external-facing URLs.
// Update SITE_BASE when the custom domain is configured.
export const SITE_BASE = "https://www.telcharai.com";
export const APPLY_URL = `${SITE_BASE}/apply`;

// ── Report disclaimers and notes ─────────────────────────────
export const REPORT_NOTES = {
  classification: "Confidential",
  disclaimer: "This report presents findings from the Telchar AI Readiness Index™ across five operational dimensions. Scores reflect self-reported data collected via structured questionnaire and facilitated analysis.",
  impactDisclaimer: "Estimates based on modeled expectations for businesses of similar industry and size. Actual results depend on implementation scope and workflow complexity.",
  engagementDisclaimer: "Implementation support is informed by program and product leadership experience from large-scale delivery environments, adapted for small business execution.",
  availabilityNote: "Availability is limited. We assess mutual fit before any engagement begins.",
};

// ── Demo / sample data (Meridian Roofing Group) ─────────────
const DEMO_CO  = "Meridian Roofing Group";
const DEMO_IND = "Construction / Trades";
const DEMO_CLIENT_TOOLS = ["QuickBooks", "Gmail", "Google Calendar"];
const DEMO_SCORES = {
  overall: 52,
  cats: [
    { key: "operations", label: "Operations Efficiency",          score: 48 },
    { key: "sales",      label: "Sales & Customer Experience",    score: 52 },
    { key: "data",       label: "Data & Performance Visibility",  score: 42 },
    { key: "content",    label: "Content & Knowledge Management", score: 58 },
    { key: "technology", label: "Technology Readiness",           score: 62 },
  ]
};
// ── Make template URL builder ────────────────────────────────
function buildMakeTemplateUrl(scores, clientTools) {
  const weakest = [...scores.cats].sort((a, b) => a.score - b.score)[0];
  const catKeyword = {
    operations: "invoice", sales: "follow-up", data: "reporting",
    content: "content", technology: "automation",
  }[weakest?.key] || "automation";
  const toolQuery = clientTools.slice(0, 2).map(t => t.replace(/ /g, "+")).join("+");
  return "https://www.make.com/en/templates?page=1&q=" + toolQuery + "+" + catKeyword;
}

// ── STACK builder (depends on scores + clientTools) ──────────
function buildStack(scores, clientTools) {
  return {
    make: {
      name: "Make",
      role: "Central Command — connects your tools",
      url: "https://make.com",
      color: "#6E5FD8",
      pricing: "Free to start · $9/mo for 10,000 runs",
      totalNote: "Start free, upgrade when ready",
      desc: "Make is a visual tool that connects the software you already use — QuickBooks, Gmail, Google Calendar — and automates the handoffs between them. You draw the workflow on screen like a flowchart. No code. No IT help needed. When a job closes in the field, Make triggers the invoice, sends the follow-up, and updates your dashboard. You set it up once. It runs on its own.",
      examples: [
        "Job closed in field → invoice sent → customer follow-up delivered",
        "New lead fills out form → contact added to your list → sequence starts",
        "Every Monday: pull last week's numbers → update dashboard → email summary to you"
      ],
      resources: [
        { label: "What is Make? (official explainer)", url: "https://help.make.com/what-is-make" },
        { label: "Create a free Make account", url: "https://www.make.com/en/register" },
        { label: "See templates built for your tools", url: buildMakeTemplateUrl(scores, clientTools) },
      ],
      startHere: [
        { label: "What is Make? (official explainer)", url: "https://help.make.com/what-is-make" },
        { label: "Learn the basics", url: "https://help.make.com/learn-the-basics" },
        { label: "Create a free account", url: "https://www.make.com/en/register" },
        ...(clientTools.includes("QuickBooks") ? [{ label: "QuickBooks integration", url: "https://www.make.com/en/integrations/quickbooks" }] : []),
      ]
    },
    claude: {
      name: "Claude",
      role: "AI writing and thinking — inside your workflows",
      url: "https://claude.ai",
      color: "#C96442",
      pricing: "Free to try · $20/mo for Pro (includes Cowork)",
      totalNote: "Make + Claude Pro: ~$29/mo total",
      desc: "Claude is an AI assistant made by Anthropic. Think of it as a very capable employee who reads your job notes and drafts a professional email, writes a social post from a photo you took, or summarizes your week in plain English. Claude works inside your Make automations as a step — it gets the details, writes the output, sends it where it needs to go. You review or it goes automatically.",
      examples: [
        "Job completed → Claude drafts a personalized review request → Gmail sends it",
        "Photo of finished work → Claude writes a social caption → ready for your approval",
        "End of week → Claude reads your numbers → writes a plain-English summary for you"
      ],
      resources: [
        { label: "Try Claude free — no account needed to start", url: "https://claude.ai" },
        { label: "How Claude is different from ChatGPT", url: "https://www.anthropic.com/claude" },
        { label: "How to add Claude as a step in Make", url: "https://www.make.com/en/integrations/anthropic-claude" },
      ],
      startHere: [
        { label: "Try Claude — free, no account needed", url: "https://claude.ai" },
        { label: "What Claude can do", url: "https://www.anthropic.com/claude" },
        { label: "How to add Claude as a step in Make", url: "https://www.make.com/en/integrations/anthropic-claude" },
      ]
    },
    cowork: {
      name: "Claude Cowork",
      role: "Your AI assistant — runs tasks you ask for",
      url: "https://claude.ai",
      color: "#4a80f5",
      pricing: "Included with Claude Pro ($20/mo)",
      totalNote: "No extra cost — comes with Claude Pro",
      desc: "Cowork is a desktop tool from Anthropic. Once your tools are connected through Make, Cowork lets you operate them by typing what you need in plain language. You do not log into a dashboard or pull a report. You type 'show me open quotes from this week' and it pulls them. Type 'draft follow-ups for jobs we finished yesterday' and it drafts them. It works across your connected tools without you navigating between them.",
      examples: [
        "Type: Show me all open quotes from the last 7 days",
        "Type: Draft follow-ups for jobs completed this week",
        "Type: What did we bill last month vs the month before"
      ],
      resources: [
        { label: "What is Cowork? (Anthropic product page)", url: "https://www.anthropic.com/products/claude-for-work" },
        { label: "Get Claude Pro — Cowork is included", url: "https://claude.ai/upgrade" },
        { label: "See all Claude Pro features", url: "https://www.anthropic.com/claude" },
      ]
    },
    code: {
      name: "Claude Code",
      role: "Custom tools built for your exact process",
      url: "https://claude.ai",
      color: "#22C55E",
      pricing: "Included with Claude Pro or Max",
      totalNote: "No extra cost on Claude Pro",
      desc: "Claude Code builds software tools customized to how your business actually works. A job intake form that feeds directly into QuickBooks. A cost estimator your customers can use on your website. A dashboard that shows your 5 most important numbers, updated automatically. You do not build this yourself. Telchar AI\u2122 scopes it, Claude Code builds it, and you get a tool that fits your workflow exactly — with no monthly seat fee.",
      examples: [
        "Job intake form that feeds directly into QuickBooks — built once, runs forever",
        "Cost estimator on your website — customers get a number, you get a lead",
        "Internal dashboard showing revenue, close rate, and open jobs — updated daily"
      ],
      resources: [
        { label: "What is Claude Code? (plain-English overview)", url: "https://www.anthropic.com/claude-code" },
        { label: "Examples of what Claude Code has built", url: "https://www.anthropic.com/claude-code" },
        { label: "Ask Telchar AI\u2122 if this fits your business", url: "https://www.telcharai.com/apply" },
      ]
    }
  };
}

// ── Load assessment data from sessionStorage ─────────────────
function loadFromSession() {
  try {
    const saved = sessionStorage.getItem("telchar_assessment_data");
    if (!saved) return null;
    const data = JSON.parse(saved);
    if (!data.scores || !data.scores.overall) return null;

    const cats = Object.entries(data.scores.categories || {}).map(([key, cat]) => ({
      key,
      label: cat.label || CATEGORY_LABELS[key] || key,
      score: cat.score,
    }));
    const scores = { overall: data.scores.overall, cats };

    let co = "Your Business";
    let ind = "General";
    let clientTools = ["Gmail", "Google Calendar"];

    if (data.answers) {
      co  = data.answers.company_name || "Your Business";
      ind = data.answers.industry     || "General";
      const tools = [];
      if (data.answers.performance_tracking === "Accounting software like QuickBooks") tools.push("QuickBooks");
      tools.push("Gmail", "Google Calendar");
      clientTools = tools;
    }

    // Return raw answers and raw scores for the engine
    return { co, ind, clientTools, scores, answers: data.answers || {}, rawScores: data.scores };
  } catch (e) {
    return null;
  }
}

// ── Demo answers (for engine to produce demo recommendations) ──
const DEMO_ANSWERS = {
  industry: "Construction / Trades",
  employee_count: "5 to 10",
  admin_hours: "15 to 30 hours",
  scheduling: "Manually via phone/email/text",
  customer_intake: "Phone/email manually",
  growth_priority: ["Increase revenue", "Reduce operational workload"],
  sales_process: "We have a basic follow-up process",
  performance_tracking: "Accounting software like QuickBooks",
  knowledge_management: "Shared drives or folders with no real structure",
  content_creation: "We do it ourselves when we have time",
  customer_acquisition: ["Word of mouth", "Our website"],
  tech_comfort: "Cautious but open",
  ai_experience: "We've experimented a little",
  company_name: DEMO_CO,
};

// ── Demo raw scores (for engine category lookups) ──
const DEMO_RAW_SCORES = {
  overall: 52,
  categories: {
    operations:  { score: 48, label: "Operations Efficiency" },
    sales:       { score: 52, label: "Sales & Customer Experience" },
    data:        { score: 42, label: "Data & Performance Visibility" },
    content:     { score: 58, label: "Content & Knowledge Management" },
    technology:  { score: 62, label: "Technology Readiness" },
  },
};

// ── Main entry point ─────────────────────────────────────────
// Returns a complete, immutable report data object.
// Both web report and PDF consume this same shape.
export function getReportData(demo = false) {
  let co, ind, clientTools, scores, answers, rawScores;

  if (demo) {
    co = DEMO_CO;
    ind = DEMO_IND;
    clientTools = [...DEMO_CLIENT_TOOLS];
    scores = { ...DEMO_SCORES, cats: DEMO_SCORES.cats.map(c => ({ ...c })) };
    answers = DEMO_ANSWERS;
    rawScores = DEMO_RAW_SCORES;
  } else {
    const session = loadFromSession();
    if (session) {
      ({ co, ind, clientTools, scores } = session);
      answers = session.answers;
      rawScores = session.rawScores;
    } else {
      // No session data — fall back to demo
      co = DEMO_CO;
      ind = DEMO_IND;
      clientTools = [...DEMO_CLIENT_TOOLS];
      scores = { ...DEMO_SCORES, cats: DEMO_SCORES.cats.map(c => ({ ...c })) };
      answers = DEMO_ANSWERS;
      rawScores = DEMO_RAW_SCORES;
    }
  }

  // Run the engine to get recommendations, signals, bands,
  // benchmark, narrative, category analyses, and action plan
  const engine = buildEngineOutput(answers, rawScores, clientTools, null, co);

  const stack = buildStack(scores, clientTools);
  const date = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return {
    co,
    ind,
    clientTools,
    scores,
    wins: engine.wins,
    stack,
    benchmark: engine.benchmark,
    date,
    notes: REPORT_NOTES,
    // Engine outputs
    signals: engine.signals,
    overallBand: engine.overallBand,
    categoryBands: engine.categoryBands,
    summaryNarrative: engine.summaryNarrative,
    categoryAnalyses: engine.categoryAnalyses,
    actionPlan: engine.actionPlan,
    risks: engine.risks,
    roadmap: engine.roadmap,
    categoryToolRecs: engine.categoryToolRecs,
    implementationGuide: engine.implementationGuide,
  };
}
