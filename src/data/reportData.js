// ─────────────────────────────────────────────────────────────
// Shared Report Data Adapter
// Single source of truth for report data consumed by both
// the web report (TelcharReport.jsx) and the PDF renderer.
// Focused on data shaping and report-ready derivation only.
// No layout logic, no UI concerns.
// ─────────────────────────────────────────────────────────────

// ── Category taxonomy ────────────────────────────────────────
export const CATEGORY_LABELS = {
  operations: "Operations Efficiency",
  sales:      "Sales & Customer Experience",
  data:       "Data & Performance Visibility",
  content:    "Content & Knowledge Management",
  technology: "Technology Readiness",
};

export const CATEGORY_KEYS = ["operations", "sales", "data", "content", "technology"];

// ── Benchmark metadata ───────────────────────────────────────
export const BENCHMARK = 51;
export const BENCHMARK_META = {
  value: 51,
  label: "SMB Average",
  source: "Telchar AI Readiness Index™",
  framework: "v2.4 · Five Category",
  note: "Based on SMB automation benchmarks across comparable operational profiles.",
};

// ── Tier metadata ────────────────────────────────────────────
export const TIERS = {
  free:    { key: "free",    label: "Free Report",    price: null, pageCount: 3,  sections: ["cover", "summary", "quickWins"] },
  starter: { key: "starter", label: "Starter Report", price: 50,   pageCount: 8,  sections: ["cover", "summary", "quickWins", "categories"] },
  full:    { key: "full",    label: "Full Scorecard",  price: 150,  pageCount: 12, sections: ["cover", "summary", "quickWins", "categories", "roadmap", "risk", "dataInfra", "engagement"] },
};

// Map URL tier params to internal tier names
export const TIER_MAP = { free: "free", report: "starter", plan: "full" };

// ── Section visibility ───────────────────────────────────────
export function getSectionVisibility(tier) {
  const t = TIERS[tier] || TIERS.free;
  return {
    cover:      true,
    summary:    true,
    quickWins:  true,
    categories: t.sections.includes("categories"),
    roadmap:    t.sections.includes("roadmap"),
    risk:       t.sections.includes("risk"),
    dataInfra:  t.sections.includes("dataInfra"),
    engagement: t.sections.includes("engagement"),
  };
}

// ── Site URLs ──────────────────────────────────────────────────
// Single source of truth for external-facing URLs.
// Update SITE_BASE when the custom domain is configured.
export const SITE_BASE = "https://telchar-assessment.vercel.app";
export const APPLY_URL = `${SITE_BASE}/apply`;

// ── Report disclaimers and notes ─────────────────────────────
export const REPORT_NOTES = {
  classification: "Confidential",
  disclaimer: "This report presents findings from the Telchar AI Readiness Index™ across five operational dimensions. Scores reflect self-reported data collected via structured questionnaire and facilitated analysis.",
  impactDisclaimer: "Estimates based on SMB automation benchmarks across comparable operational profiles. Actual results depend on implementation scope and workflow complexity.",
  engagementDisclaimer: "Implementation support is informed by program and product leadership experience from large-scale delivery environments, adapted for small business execution.",
  availabilityNote: "Availability is limited. We assess mutual fit before any engagement begins.",
};

// ── Demo / sample data (Meridian Roofing Group) ─────────────
const DEMO_CO  = "Meridian Roofing Group";
const DEMO_IND = "Construction / Trades";
const DEMO_CLIENT_TOOLS = ["QuickBooks", "Gmail", "Google Calendar"];
const DEMO_SCORES = {
  overall: 54,
  cats: [
    { key: "operations", label: "Operations Efficiency",          score: 48 },
    { key: "sales",      label: "Sales & Customer Experience",    score: 52 },
    { key: "data",       label: "Data & Performance Visibility",  score: 42 },
    { key: "content",    label: "Content & Knowledge Management", score: 58 },
    { key: "technology", label: "Technology Readiness",           score: 62 },
  ]
};
const DEMO_WINS = [
  { n: 1, cat: "Data & Performance Visibility", title: "Connect Your Tools into a Single Automated Workflow",
    desc: "Your data lives in QuickBooks, Gmail, and spreadsheets that don't talk to each other. Make connects them and automates the handoffs — job completed triggers invoice, invoice triggers follow-up, data feeds your dashboard. One platform manages all of it. Setup takes a few hours, not weeks.",
    time: "1-2 weeks", tool: "Make", toolCost: "From $9/mo" },
  { n: 2, cat: "Operations Efficiency", title: "Automate Job Completion to Invoice to Follow-Up",
    desc: "Every completed job should trigger an invoice and a customer follow-up automatically. Build this once in Make. It runs every time, without supervision. Your crew closes the job in the field. QuickBooks and Gmail handle the rest.",
    time: "1 week", tool: "Make + Claude Pro", toolCost: "~$29/mo total" },
  { n: 3, cat: "Sales & Customer Experience", title: "Use Claude to Draft Every Customer-Facing Message",
    desc: "Every quote follow-up, review request, and job summary can be drafted by Claude automatically. Make collects the job details, Claude writes the message, it lands in Gmail ready to send or goes out automatically. Your team stops writing the same emails manually every week.",
    time: "1-2 weeks", tool: "Make + Claude Pro", toolCost: "~$29/mo total" },
];

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
        { label: "What Claude can do", url: "https://claude.com/product/overview" },
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
      desc: "Claude Code builds software tools customized to how your business actually works. A job intake form that feeds directly into QuickBooks. A cost estimator your customers can use on your website. A dashboard that shows your 5 most important numbers, updated automatically. You do not build this yourself. Telchar AI scopes it, Claude Code builds it, and you get a tool that fits your workflow exactly — with no monthly seat fee.",
      examples: [
        "Job intake form that feeds directly into QuickBooks — built once, runs forever",
        "Cost estimator on your website — customers get a number, you get a lead",
        "Internal dashboard showing revenue, close rate, and open jobs — updated daily"
      ],
      resources: [
        { label: "What is Claude Code? (plain-English overview)", url: "https://www.anthropic.com/claude-code" },
        { label: "Examples of what Claude Code has built", url: "https://code.claude.com" },
        { label: "Ask Telchar AI if this fits your business", url: "https://telchar.ai" },
      ]
    }
  };
}

// ── Category → tool recommendation ───────────────────────────
const CATEGORY_GUIDANCE = {
  operations: "Scheduling, dispatch, and job-to-invoice handoffs are the highest-friction manual processes in this category. A single Make workflow connecting your field tools to QuickBooks eliminates the most common failure points.",
  sales:      "Pipeline leakage between day two and day ten post-quote is recoverable without new lead generation. Claude-drafted follow-up sequences running automatically inside Make address this directly.",
  data:       "Reporting relies on manual compilation. Connecting QuickBooks to a lightweight dashboard layer through Make replaces weekly spreadsheet work with a live view of revenue, margins, and open jobs.",
  content:    "Customer-facing content is produced inconsistently. Claude running inside Make workflows converts job notes and photos into draft social posts and review requests in under a minute per job.",
  technology: "Core tools are in place and the team demonstrates adoption capacity. The gap is integration — tools that do not talk to each other create the manual work that Make is designed to eliminate.",
};

const CATEGORY_TOOL_MAP = {
  operations: { key: "make",   focus: "Automate job completion → invoice → follow-up. One workflow, runs every time." },
  sales:      { key: "claude", focus: "Claude drafts every follow-up, quote response, and review request inside Make." },
  data:       { key: "make",   focus: "Make pulls your data on a schedule. Cowork reads it. You stop compiling spreadsheets." },
  content:    { key: "claude", focus: "Job photos and notes in → social posts and customer messages out. 20 minutes a week." },
  technology: { key: "cowork", focus: "Cowork operates your connected tools in plain language. No new UI. Start here." },
};

export function getCategoryTool(catKey, score, stack) {
  const high = score < 55;
  const m = CATEGORY_TOOL_MAP[catKey];
  if (!m) return null;
  return { ...m, high, tool: stack[m.key] };
}

export function getCategoryGuidance(catKey) {
  return CATEGORY_GUIDANCE[catKey] || "";
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

    let wins = DEMO_WINS;
    if (data.quickWins && data.quickWins.length > 0) {
      wins = data.quickWins.map((w, i) => ({
        n: i + 1,
        cat: w.category || "",
        title: w.title || "",
        desc: w.desc || "",
        time: "2-4 weeks",
        tool: "Make + Claude Pro",
        toolCost: "~$29/mo total",
      }));
    }

    return { co, ind, clientTools, scores, wins };
  } catch (e) {
    return null;
  }
}

// ── Main entry point ─────────────────────────────────────────
// Returns a complete, immutable report data object.
// Both web report and PDF consume this same shape.
export function getReportData(demo = false) {
  let co, ind, clientTools, scores, wins;

  if (demo) {
    co = DEMO_CO;
    ind = DEMO_IND;
    clientTools = [...DEMO_CLIENT_TOOLS];
    scores = { ...DEMO_SCORES, cats: DEMO_SCORES.cats.map(c => ({ ...c })) };
    wins = DEMO_WINS.map(w => ({ ...w }));
  } else {
    const session = loadFromSession();
    if (session) {
      ({ co, ind, clientTools, scores, wins } = session);
    } else {
      co = DEMO_CO;
      ind = DEMO_IND;
      clientTools = [...DEMO_CLIENT_TOOLS];
      scores = { ...DEMO_SCORES, cats: DEMO_SCORES.cats.map(c => ({ ...c })) };
      wins = DEMO_WINS.map(w => ({ ...w }));
    }
  }

  const stack = buildStack(scores, clientTools);
  const date = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return {
    co,
    ind,
    clientTools,
    scores,
    wins,
    stack,
    benchmark: BENCHMARK,
    benchmarkMeta: BENCHMARK_META,
    date,
    notes: REPORT_NOTES,
  };
}
