// ─────────────────────────────────────────────────────────────
// Report Engine — Central business logic for report generation
// ─────────────────────────────────────────────────────────────
// Pure functions only. No React, no UI, no layout.
// Input: raw answers + category scores
// Output: normalized report object consumed by web + PDF
//
// Layers:
//   1. Derived signals (from raw answers)
//   2. Score band classification (5-band model)
//   3. Recommendation engine (candidate library → ranked → top 3)
//   4. Summary narrative
//   5. Category analysis (per-category)
//   6. 30-Day Action Plan
//   7. 90-Day Roadmap
//   8. Risk engine
// ─────────────────────────────────────────────────────────────

// Category constants duplicated here to avoid circular dependency
// (reportData.js imports from reportEngine.js)
const CATEGORY_LABELS = {
  operations: "Operations Efficiency",
  sales:      "Sales & Customer Experience",
  data:       "Data & Performance Visibility",
  content:    "Content & Knowledge Management",
  technology: "Technology Readiness",
};

const CATEGORY_KEYS = ["operations", "sales", "data", "content", "technology"];

// ── 0. Benchmark Model ─────────────────────────────────────────
// Category-specific, industry-aware, size-aware reference baselines.
// Represents modeled expectations for businesses of similar profile.

const INDUSTRY_BENCHMARKS = {
  "Construction / Trades":       { operations: 35, sales: 30, data: 30, content: 25, technology: 40 },
  "Food & Beverage":             { operations: 50, sales: 35, data: 45, content: 30, technology: 45 },
  "Manufacturing":               { operations: 55, sales: 35, data: 50, content: 45, technology: 45 },
  "Logistics / Transportation":  { operations: 55, sales: 35, data: 50, content: 45, technology: 45 },
  "Healthcare":                  { operations: 60, sales: 40, data: 45, content: 45, technology: 50 },
  "Retail / E-commerce":         { operations: 50, sales: 50, data: 55, content: 40, technology: 55 },
  "Real Estate":                 { operations: 50, sales: 60, data: 45, content: 45, technology: 60 },
  "Insurance":                   { operations: 55, sales: 60, data: 60, content: 50, technology: 60 },
  "Professional Services":       { operations: 55, sales: 50, data: 50, content: 55, technology: 60 },
  "Legal":                       { operations: 55, sales: 50, data: 50, content: 50, technology: 55 },
  "Financial Services":          { operations: 55, sales: 60, data: 60, content: 50, technology: 60 },
  "Marketing / Creative Agency": { operations: 60, sales: 55, data: 50, content: 65, technology: 65 },
};

const DEFAULT_INDUSTRY_BENCHMARK = { operations: 50, sales: 45, data: 48, content: 42, technology: 50 };

const SIZE_OFFSETS = {
  "Just me":   -6,
  "2 to 4":    -4,
  "5 to 10":   -2,
  "11 to 25":   0,
  "26 to 50":  +2,
  "51 to 100": +4,
  "100+":      +6,
};

const BENCHMARK_NOTE = "Reference baselines represent modeled expectations for businesses of similar industry and size, informed by published research, recognized maturity frameworks, and practitioner analysis. Baselines are refined over time as more assessment data is collected.";

export function computeBenchmark(industry, teamSize) {
  // Resolve industry profile — strip "Other: " prefix and try match
  let profile = INDUSTRY_BENCHMARKS[industry];
  if (!profile) {
    // Try matching after stripping "Other: " prefix
    const stripped = (industry || "").replace(/^Other:\s*/i, "");
    profile = INDUSTRY_BENCHMARKS[stripped] || DEFAULT_INDUSTRY_BENCHMARK;
  }

  const sizeOffset = SIZE_OFFSETS[teamSize] ?? 0;

  const clamp = (v) => Math.max(20, Math.min(80, Math.round(v)));

  const categories = {};
  let sum = 0;
  for (const key of CATEGORY_KEYS) {
    const val = clamp(profile[key] + sizeOffset);
    categories[key] = val;
    sum += val;
  }

  return {
    overall: Math.round(sum / CATEGORY_KEYS.length),
    categories,
    meta: {
      industry: industry || "General",
      sizeBand: teamSize || "Unknown",
      label: "Reference Baseline",
      source: "Telchar AI Readiness Index™",
      framework: "v2.4 · Five Category",
      note: BENCHMARK_NOTE,
    },
  };
}

// ── 1. Score Band Model ────────────────────────────────────────
// 5 interpretation bands. Used for narrative selection, NOT visual color.
// Visual color system (scoreColor) remains unchanged at 3 tiers.

export const SCORE_BANDS = [
  { key: "fragile",     label: "Fragile",     min: 0,  max: 39 },
  { key: "developing",  label: "Developing",  min: 40, max: 54 },
  { key: "progressing", label: "Progressing", min: 55, max: 69 },
  { key: "advancing",   label: "Advancing",   min: 70, max: 84 },
  { key: "leading",     label: "Leading",     min: 85, max: 100 },
];

export function getScoreBand(score) {
  for (const band of SCORE_BANDS) {
    if (score <= band.max) return band;
  }
  return SCORE_BANDS[SCORE_BANDS.length - 1];
}

// ── 2. Derived Signals ─────────────────────────────────────────
// Structured observations extracted from raw answers.
// These drive recommendation ranking, narrative branching,
// and plan/roadmap variation.

export function deriveSignals(answers) {
  const goals = Array.isArray(answers.growth_priority) ? answers.growth_priority : [];
  const acqChannels = Array.isArray(answers.customer_acquisition) ? answers.customer_acquisition : [];

  return {
    // Team profile
    teamSize: answers.employee_count || "Unknown",
    industry: answers.industry || "General",

    // Goal signals
    goals,
    wantsRevenue: goals.includes("Increase revenue"),
    wantsMargins: goals.includes("Improve margins"),
    wantsWorkloadReduction: goals.includes("Reduce operational workload"),
    wantsStability: goals.includes("Stabilize growth"),
    wantsExit: goals.includes("Prepare for exit"),
    revenueFocus: answers.revenue_focus || null,
    workloadFocus: answers.workload_focus || null,
    exitStage: answers.exit_stage || null,

    // Operations signals
    intakeIsManual: answers.customer_intake === "Phone/email manually" || answers.customer_intake === "We don't have a defined process",
    intakeIsMixed: answers.customer_intake === "A mix of both",
    intakeIsAutomated: answers.customer_intake === "A CRM or intake system",
    schedulingIsManual: answers.scheduling === "Manually via phone/email/text" || answers.scheduling === "We struggle with this",
    schedulingIsMixed: answers.scheduling === "A mix",
    schedulingIsAutomated: answers.scheduling === "A scheduling tool or software",

    // Admin burden
    adminHours: answers.admin_hours || "Unknown",
    highAdminBurden: answers.admin_hours === "30+ hours" || answers.admin_hours === "15 to 30 hours",
    moderateAdminBurden: answers.admin_hours === "5 to 15 hours",

    // Sales signals
    salesIsReactive: answers.sales_process === "We respond when people reach out",
    salesIsBasic: answers.sales_process === "We have a basic follow-up process",
    salesIsStructured: answers.sales_process === "We have a structured pipeline with stages",
    salesIsMature: answers.sales_process === "We use a CRM to manage everything",
    acquisitionChannels: acqChannels,
    narrowAcquisition: acqChannels.length <= 2 && !acqChannels.includes("We're not sure"),

    // Data signals
    tracksWithSpreadsheets: answers.performance_tracking === "Spreadsheets",
    tracksWithAccounting: answers.performance_tracking === "Accounting software like QuickBooks",
    tracksWithDashboard: answers.performance_tracking === "A dashboard or BI tool",
    noConsistentTracking: answers.performance_tracking === "We don't track this consistently",

    // Content signals
    knowledgeInHeads: answers.knowledge_management === "In people's heads",
    knowledgeUnstructured: answers.knowledge_management === "Shared drives or folders with no real structure",
    knowledgeOrganized: answers.knowledge_management === "A wiki or knowledge base" || answers.knowledge_management === "We have documented and organized systems",
    contentNone: answers.content_creation === "We don't do much of this",
    contentAdHoc: answers.content_creation === "We do it ourselves when we have time",
    contentDedicated: answers.content_creation === "We have someone dedicated to it",

    // Technology signals
    techResistant: answers.tech_comfort === "Resistant",
    techCautious: answers.tech_comfort === "Cautious but open",
    techComfortable: answers.tech_comfort === "Generally comfortable",
    techEarlyAdopter: answers.tech_comfort === "We adopt early and often",
    aiNone: answers.ai_experience === "No, never",
    aiExperimented: answers.ai_experience === "We've experimented a little",
    aiRegular: answers.ai_experience === "We use AI for a few things regularly",
    aiEmbedded: answers.ai_experience === "AI is already embedded in our operations",

    // Composite readiness signal
    get implementationReadiness() {
      let r = 0;
      if (this.techComfortable || this.techEarlyAdopter) r += 2;
      else if (this.techCautious) r += 1;
      if (this.aiRegular || this.aiEmbedded) r += 2;
      else if (this.aiExperimented) r += 1;
      if (this.tracksWithDashboard || this.tracksWithAccounting) r += 1;
      // 0-5 scale: 0-1 = low, 2-3 = moderate, 4-5 = high
      return r;
    },
  };
}

// ── 3. Recommendation Engine ───────────────────────────────────
// Candidate library → conditional eligibility → weighted scoring → top 3.
// Always returns exactly 3. Deduped by title. Fallback guaranteed.

const RECOMMENDATION_CANDIDATES = [
  // ── Operations ──
  {
    id: "ops-automate-intake",
    category: "operations",
    title: "Automate Customer Intake",
    desc: "Every inquiry that sits in an inbox or voicemail is revenue at risk. AI can categorize, route, and auto-respond to common requests so your team focuses on qualified conversations.",
    eligible: (signals, scores) => scores.operations < 80 && signals.intakeIsManual,
    weight: (signals, scores) => 10 + (80 - scores.operations) * 0.3 + (signals.wantsRevenue ? 5 : 0),
  },
  {
    id: "ops-streamline-scheduling",
    category: "operations",
    title: "Streamline Scheduling and Coordination",
    desc: "Manual scheduling creates missed appointments and wasted back-and-forth. Automated scheduling tools can reduce coordination time by 60% or more.",
    eligible: (signals, scores) => scores.operations < 80 && signals.schedulingIsManual,
    weight: (signals, scores) => 9 + (80 - scores.operations) * 0.3 + (signals.highAdminBurden ? 4 : 0),
  },
  {
    id: "ops-consolidate-scheduling",
    category: "operations",
    title: "Consolidate Your Scheduling Workflow",
    desc: "You're partially automated but still relying on manual coordination. Unifying your scheduling into a single automated system eliminates the gaps where things fall through.",
    eligible: (signals, scores) => scores.operations < 80 && signals.schedulingIsMixed,
    weight: (signals, scores) => 7 + (80 - scores.operations) * 0.2,
  },
  // ── Sales ──
  {
    id: "sales-build-pipeline",
    category: "sales",
    title: "Build a Proactive Sales Pipeline",
    desc: "Waiting for inbound means you're leaving revenue on the table. AI can identify warm leads, automate initial outreach, and keep prospects engaged without adding headcount.",
    eligible: (signals, scores) => scores.sales < 80 && signals.salesIsReactive,
    weight: (signals, scores) => 10 + (80 - scores.sales) * 0.3 + (signals.wantsRevenue ? 6 : 0),
  },
  {
    id: "sales-strengthen-followup",
    category: "sales",
    title: "Strengthen Your Follow-Up System",
    desc: "You have a process, but leads are likely slipping through. AI-assisted follow-up sequences ensure every prospect gets timely, consistent touchpoints without manual tracking.",
    eligible: (signals, scores) => scores.sales < 80 && signals.salesIsBasic,
    weight: (signals, scores) => 8 + (80 - scores.sales) * 0.25 + (signals.wantsRevenue ? 4 : 0),
  },
  {
    id: "sales-diversify-channels",
    category: "sales",
    title: "Diversify How Customers Find You",
    desc: "You're relying on a narrow set of channels. AI-powered content and ad targeting can open new acquisition paths without requiring a dedicated marketing team.",
    eligible: (signals, scores) => scores.sales < 80 && signals.narrowAcquisition,
    weight: (signals, scores) => 7 + (signals.wantsRevenue ? 5 : 0) + (signals.acquisitionChannels.length <= 1 ? 3 : 0),
  },
  {
    id: "sales-maximize-ltv",
    category: "sales",
    title: "Maximize Customer Lifetime Value",
    desc: "Your sales operations are strong. The next lever is identifying which customers generate the highest margins and where expansion revenue is hiding. AI can analyze purchase patterns, predict churn risk, and surface upsell opportunities your team would otherwise miss.",
    eligible: (signals, scores) => scores.sales >= 70,
    weight: (signals, scores) => 6 + (signals.wantsMargins ? 4 : 0) + (signals.wantsRevenue ? 3 : 0),
  },
  {
    id: "sales-unlock-existing-revenue",
    category: "sales",
    title: "Unlock Revenue You're Already Sitting On",
    desc: "Most businesses focus on new customer acquisition and overlook the revenue sitting in their existing base. AI-powered customer segmentation can identify your highest-margin clients, predict which prospects look like them, and flag upsell opportunities that your team can act on this month.",
    eligible: (signals, scores) => scores.sales < 70,
    weight: (signals, scores) => 5 + (signals.wantsRevenue ? 3 : 0) + (signals.wantsMargins ? 3 : 0),
  },
  // ── Data ──
  {
    id: "data-reduce-admin",
    category: "data",
    title: "Reduce Admin Overhead",
    desc: "Your team is burning 15+ hours a week on tasks a machine can handle. Invoicing, follow-ups, data entry, and reporting are all candidates for immediate automation.",
    eligible: (signals, scores) => scores.data < 80 && signals.highAdminBurden,
    weight: (signals, scores) => 10 + (80 - scores.data) * 0.3 + (signals.wantsWorkloadReduction ? 6 : 0),
  },
  {
    id: "data-eliminate-bottlenecks",
    category: "data",
    title: "Eliminate Remaining Manual Bottlenecks",
    desc: "You've kept admin work manageable, but there are still hours being spent on tasks AI can handle faster. Targeted automation on your top 2 to 3 repetitive workflows will free up capacity.",
    eligible: (signals, scores) => scores.data < 80 && signals.moderateAdminBurden,
    weight: (signals, scores) => 6 + (80 - scores.data) * 0.2,
  },
  {
    id: "data-establish-tracking",
    category: "data",
    title: "Establish Automated Performance Tracking",
    desc: "You're running your business without consistent visibility into what's working. AI dashboards can pull data from your existing tools and surface the metrics that matter most.",
    eligible: (signals, scores) => scores.data < 80 && signals.noConsistentTracking,
    weight: (signals, scores) => 9 + (80 - scores.data) * 0.3 + (signals.wantsMargins ? 4 : 0),
  },
  {
    id: "data-upgrade-from-spreadsheets",
    category: "data",
    title: "Upgrade from Spreadsheets to Automated Reporting",
    desc: "Spreadsheets require manual updates and are prone to error. AI-connected dashboards pull live data from your systems and keep your numbers current without the manual lift.",
    eligible: (signals, scores) => scores.data < 80 && signals.tracksWithSpreadsheets,
    weight: (signals, scores) => 8 + (80 - scores.data) * 0.25,
  },
  {
    id: "data-expand-beyond-financial",
    category: "data",
    title: "Expand Beyond Financial Tracking",
    desc: "Your accounting data tells part of the story. AI can connect your financial tools with customer, operations, and sales data to give you a complete picture of business performance.",
    eligible: (signals, scores) => scores.data < 80 && signals.tracksWithAccounting,
    weight: (signals, scores) => 7 + (signals.wantsMargins ? 3 : 0),
  },
  // ── Content ──
  {
    id: "content-capture-knowledge",
    category: "content",
    title: "Capture and Organize Company Knowledge",
    desc: "When key people leave, their knowledge walks out the door. AI can help extract, document, and organize institutional knowledge into a searchable system your whole team can use.",
    eligible: (signals, scores) => scores.content < 80 && signals.knowledgeInHeads,
    weight: (signals, scores) => 9 + (80 - scores.content) * 0.3 + (signals.wantsExit ? 5 : 0),
  },
  {
    id: "content-structure-knowledge",
    category: "content",
    title: "Bring Structure to Your Shared Knowledge",
    desc: "Your files exist but nobody can find them. AI-powered search and auto-tagging can turn your messy shared drives into an organized, instantly searchable knowledge base.",
    eligible: (signals, scores) => scores.content < 80 && signals.knowledgeUnstructured,
    weight: (signals, scores) => 7 + (80 - scores.content) * 0.2,
  },
  {
    id: "content-launch-creation",
    category: "content",
    title: "Launch AI-Assisted Content Creation",
    desc: "You're invisible to prospects who search before they buy. AI can draft social posts, proposals, and marketing copy in your voice so you show up where your customers are looking.",
    eligible: (signals, scores) => scores.content < 80 && signals.contentNone,
    weight: (signals, scores) => 8 + (signals.wantsRevenue ? 4 : 0) + (signals.narrowAcquisition ? 3 : 0),
  },
  {
    id: "content-accelerate-output",
    category: "content",
    title: "Accelerate Your Content Output",
    desc: "Your team creates content when they can, which means inconsistently. AI writing tools can turn a 2-hour blog post into a 20-minute review, keeping your pipeline of content steady.",
    eligible: (signals, scores) => scores.content < 80 && signals.contentAdHoc,
    weight: (signals, scores) => 6 + (signals.wantsRevenue ? 3 : 0),
  },
  // ── Technology ──
  {
    id: "tech-start-simple",
    category: "technology",
    title: "Start with Simple AI Tools",
    desc: "Your team hasn't used AI yet, which means every improvement is net new value. There are low-risk tools you can adopt this week that will save hours immediately.",
    eligible: (signals, scores) => scores.technology < 80 && signals.aiNone,
    weight: (signals, scores) => 8 + (80 - scores.technology) * 0.2,
  },
  {
    id: "tech-experiment-to-execution",
    category: "technology",
    title: "Move from Experimentation to Execution",
    desc: "You've tested the waters. The next step is identifying 1 to 2 workflows where AI becomes a permanent part of how your team operates, with measurable time savings.",
    eligible: (signals, scores) => scores.technology < 80 && signals.aiExperimented,
    weight: (signals, scores) => 7 + (80 - scores.technology) * 0.2,
  },
  {
    id: "tech-build-confidence",
    category: "technology",
    title: "Build Team Confidence with Quick Wins",
    desc: "Resistance to new technology usually comes from bad past experiences. Starting with tools that solve a visible daily pain point builds trust and opens the door to bigger changes.",
    eligible: (signals, scores) => scores.technology < 80 && signals.techResistant,
    weight: (signals, scores) => 7 + (80 - scores.technology) * 0.25,
  },
  {
    id: "tech-turn-openness-into-adoption",
    category: "technology",
    title: "Turn Openness into Adoption",
    desc: "Your team is willing to try new tools. The key is giving them something that makes their job easier within the first week, with minimal training required.",
    eligible: (signals, scores) => scores.technology < 80 && signals.techCautious,
    weight: (signals, scores) => 5 + (80 - scores.technology) * 0.15,
  },
];

// Universal fallbacks — always eligible, low weight. Used only to guarantee 3.
const FALLBACK_CANDIDATES = [
  {
    id: "fallback-workflow-audit",
    category: "operations",
    title: "Audit Your Most Time-Intensive Workflows",
    desc: "Even well-run operations have hidden inefficiencies. A targeted workflow audit can identify 2 to 3 processes where AI automation delivers immediate ROI.",
    weight: () => 2,
  },
  {
    id: "fallback-ai-roadmap",
    category: "technology",
    title: "Build an AI Adoption Roadmap",
    desc: "Knowing where you stand is the first step. A structured 90-day plan can move your team from awareness to active AI usage without disrupting what's already working.",
    weight: () => 1.5,
  },
  {
    id: "fallback-response-time",
    category: "sales",
    title: "Improve Response Time to Customer Inquiries",
    desc: "Speed to response is one of the biggest drivers of conversion. AI-assisted responses can cut your reply time from hours to minutes for common inquiries.",
    weight: () => 1,
  },
];

export function generateRecommendations(signals, categoryScores) {
  // Flatten scores for easy lookup
  const scores = {};
  CATEGORY_KEYS.forEach(key => {
    scores[key] = categoryScores[key]?.score ?? 50;
  });

  // Score all eligible candidates
  const scored = RECOMMENDATION_CANDIDATES
    .filter(c => c.eligible(signals, scores))
    .map(c => ({
      ...c,
      computedWeight: c.weight(signals, scores),
    }))
    .sort((a, b) => b.computedWeight - a.computedWeight);

  // Select top 3.
  // Category diversity is a preference, not an absolute rule.
  // If the top 3 by weight happen to share categories, that's fine —
  // it means the signal strength genuinely concentrates there.
  // We apply a mild diversity bonus: if a candidate would add a new category,
  // give it a small boost. This prefers diversity when candidates are close,
  // but doesn't override large weight gaps.
  const selected = [];
  const usedCategories = new Set();
  const usedTitles = new Set();
  const DIVERSITY_BONUS = 3; // mild nudge, not override

  const remaining = [...scored];
  while (selected.length < 3 && remaining.length > 0) {
    // Re-sort with diversity bonus applied
    remaining.sort((a, b) => {
      const aBonus = usedCategories.has(a.category) ? 0 : DIVERSITY_BONUS;
      const bBonus = usedCategories.has(b.category) ? 0 : DIVERSITY_BONUS;
      return (b.computedWeight + bBonus) - (a.computedWeight + aBonus);
    });
    const pick = remaining.shift();
    if (usedTitles.has(pick.title)) continue;
    selected.push(pick);
    usedCategories.add(pick.category);
    usedTitles.add(pick.title);
  }

  // Fallback: if still < 3, use fallbacks
  for (const fb of FALLBACK_CANDIDATES) {
    if (selected.length >= 3) break;
    if (usedTitles.has(fb.title)) continue;
    selected.push({
      ...fb,
      computedWeight: fb.weight(),
      eligible: () => true,
    });
    usedTitles.add(fb.title);
  }

  // Map to output shape
  return selected.slice(0, 3).map((c, i) => ({
    n: i + 1,
    cat: CATEGORY_LABELS[c.category] || c.category,
    categoryKey: c.category,
    title: c.title,
    desc: c.desc,
    time: "2–4 weeks",
    tool: "Make + Claude Pro",
    toolCost: "~$29/mo total",
  }));
}

// ── 4. Summary Narrative Generator ─────────────────────────────
// Generates a multi-sentence interpretation from overall score,
// band, signals, and top recommendations.

export function generateSummaryNarrative(overall, overallBand, signals, wins, benchmarkOverall, co) {
  const delta = overall - benchmarkOverall;
  const deltaText = delta >= 0
    ? `${delta} points above the reference baseline of ${benchmarkOverall}`
    : `${Math.abs(delta)} points below the reference baseline of ${benchmarkOverall}`;

  // Baseline-relative position: below (<-4), near (-4 to +4), above (>+4)
  const baselinePos = delta < -4 ? "below" : delta > 4 ? "above" : "near";

  // Baseline-relative urgency framing — appended to band intro
  const baselineFrame = baselinePos === "below"
    ? " Closing the gap to baseline is the first priority — stabilizing core operations and addressing the specific weaknesses driving the shortfall."
    : baselinePos === "near"
      ? " This is a foundational improvement opportunity — tightening existing processes and addressing key gaps will create measurable separation."
      : " The stronger-than-typical foundation means the business can move faster on implementation. The opportunity is capturing efficiency and margin gains that most competitors are not yet positioned to pursue.";

  // What the score means — varies by band
  const bandIntro = ({
    fragile: `A score of ${overall} places ${co} in the Fragile tier, ${deltaText}. Core operational processes are largely manual, with limited system integration and significant automation gaps across multiple categories.`,
    developing: `A score of ${overall} places ${co} in the Developing tier, ${deltaText}. The organization has established basic operational infrastructure but carries identifiable automation gaps that limit efficiency and visibility.`,
    progressing: `A score of ${overall} places ${co} in the Progressing tier, ${deltaText}. Foundational systems are in place and the team has demonstrated willingness to adopt structured tools. The opportunity now is targeted automation in specific workflow gaps.`,
    advancing: `A score of ${overall} places ${co} in the Advancing tier, ${deltaText}. The organization operates with structured systems and has meaningful experience with technology adoption. The focus shifts from foundational setup to optimization and integration.`,
    leading: `A score of ${overall} places ${co} in the Leading tier, ${deltaText}. Operational maturity is high, with integrated systems and active technology adoption. The opportunity is advanced automation, predictive tooling, and competitive differentiation.`,
  }[overallBand.key] || `A score of ${overall} places ${co} at ${deltaText}.`) + baselineFrame;

  // What is working — varies by signal profile
  const strengths = [];
  if (signals.salesIsStructured || signals.salesIsMature) strengths.push("a structured sales process");
  if (signals.tracksWithDashboard) strengths.push("dashboard-level performance tracking");
  if (signals.tracksWithAccounting) strengths.push("accounting software for financial tracking");
  if (signals.knowledgeOrganized) strengths.push("organized knowledge management");
  if (signals.contentDedicated) strengths.push("dedicated content capabilities");
  if (signals.schedulingIsAutomated) strengths.push("automated scheduling");
  if (signals.intakeIsAutomated) strengths.push("CRM-based customer intake");
  if (signals.techComfortable || signals.techEarlyAdopter) strengths.push("strong team comfort with new technology");
  if (signals.aiRegular || signals.aiEmbedded) strengths.push("active AI adoption");

  const strengthText = strengths.length > 0
    ? ` The business shows operational strength in ${strengths.slice(0, 3).join(", ")}.`
    : overallBand.key === "fragile"
      ? ` The business has maintained operations through a period of limited tooling — that resilience is a starting point, not a ceiling.`
      : ` The business has established working processes that keep day-to-day operations running, providing a foundation for targeted improvement.`;

  // What is holding them back — varies by weakest signals
  const gaps = [];
  if (signals.intakeIsManual) gaps.push("manual customer intake");
  if (signals.schedulingIsManual) gaps.push("manual scheduling and coordination");
  if (signals.highAdminBurden) gaps.push("high administrative time burden");
  if (signals.noConsistentTracking) gaps.push("no consistent performance tracking");
  if (signals.knowledgeInHeads) gaps.push("undocumented institutional knowledge");
  if (signals.salesIsReactive) gaps.push("reactive sales process");
  if (signals.contentNone) gaps.push("no content creation activity");
  if (signals.aiNone) gaps.push("no AI adoption yet");
  if (signals.techResistant) gaps.push("team resistance to new technology");

  const gapText = gaps.length > 0
    ? ` The primary constraints are ${gaps.slice(0, 3).join(", ")}.`
    : overallBand.key === "advancing" || overallBand.key === "leading"
      ? ` No single constraint dominates, but cross-system integration gaps and manual handoffs between tools are likely limiting compound efficiency.`
      : ` While no single issue dominates, the cumulative weight of manual processes across categories is constraining throughput and visibility.`;

  // What kind of next move — driven by recommendations + baseline position
  const winNames = wins.map(w => w.title).filter(Boolean);
  const focusVerb = baselinePos === "above"
    ? "capitalize on the existing foundation"
    : baselinePos === "near"
      ? "create measurable separation"
      : "close the most impactful gaps";
  const focusText = winNames.length > 0
    ? ` The recommended starting points — ${winNames.slice(0, 2).join(" and ")} — are the most direct way to ${focusVerb} within a structured 90-day window.`
    : ` The 30-day action plan below outlines the most direct way to ${focusVerb} based on this profile.`;

  return bandIntro + strengthText + gapText + focusText;
}

// ── 5. Category Analysis Generator ─────────────────────────────
// For each category: diagnosis, strength, gap, implication, focus.
// Driven by category band + signals within that category.

function generateCategoryAnalysis(catKey, catScore, catBand, signals, industry, catBenchmark) {
  const analysis = { diagnosis: "", strength: "", gap: "", implication: "", focus: "" };
  const bandKey = catBand.key;
  const ind = industry || "your industry";
  const catDelta = catScore - (catBenchmark || 51);
  const aboveBaseline = catDelta > 4;

  if (catKey === "operations") {
    // Diagnosis by band
    if (bandKey === "fragile" || bandKey === "developing") {
      analysis.diagnosis = "Operational workflows rely heavily on manual coordination. Scheduling, intake, and job-to-invoice handoffs involve repeated human steps that introduce delays and errors.";
    } else if (bandKey === "progressing") {
      analysis.diagnosis = "Core operational processes are partially systematized. Some workflows use scheduling or intake tools, but integration between steps still requires manual oversight.";
    } else {
      analysis.diagnosis = aboveBaseline
        ? "Operations are stronger than most businesses of this type and size — but manual handoffs between systems still create friction that compounds with volume. The foundation supports faster optimization than a typical business at this stage."
        : "Operations are well-structured with functional automation in key areas. The focus is on eliminating remaining manual handoffs and improving cross-system integration.";
    }
    // Strength
    if (signals.schedulingIsAutomated) analysis.strength = "Scheduling is already handled through dedicated software, reducing coordination overhead.";
    else if (signals.intakeIsAutomated) analysis.strength = "Customer intake is managed through a CRM or structured system, ensuring inquiries are tracked.";
    else if (signals.schedulingIsMixed || signals.intakeIsMixed) analysis.strength = "There is partial tool adoption for scheduling or intake, showing willingness to systematize.";
    else analysis.strength = "The team handles multi-step coordination across scheduling, intake, and delivery without system support — that operational discipline is the foundation automation builds on.";
    // Gap
    if (signals.schedulingIsManual && signals.intakeIsManual) analysis.gap = "Both scheduling and customer intake are fully manual, creating compounding delays at every handoff point.";
    else if (signals.schedulingIsManual) analysis.gap = "Scheduling and coordination are handled manually, leading to missed appointments and wasted back-and-forth.";
    else if (signals.intakeIsManual) analysis.gap = "Customer inquiries are managed through phone and email without structured routing, risking dropped leads.";
    else analysis.gap = "Individual tools handle their own step, but handoffs between scheduling, intake, and job completion still require someone to manually move data or trigger the next action.";
    // Implication
    analysis.implication = signals.highAdminBurden
      ? "The manual operational load is directly contributing to high admin hours and limiting the team's capacity for revenue-generating work."
      : "Manual operational steps add friction to daily execution. As volume grows, these bottlenecks will become more acute.";
    // Focus
    if (signals.schedulingIsManual && signals.intakeIsManual) analysis.focus = "Priority: automate customer intake routing first, then connect scheduling to reduce end-to-end coordination time.";
    else if (signals.intakeIsManual) analysis.focus = "Priority: automate intake categorization and routing so the team focuses on qualified conversations, not triage.";
    else if (signals.schedulingIsManual) analysis.focus = "Priority: consolidate scheduling into a single automated system to eliminate the manual coordination loop.";
    else analysis.focus = aboveBaseline
      ? "Priority: leverage the operational foundation to connect existing tools through end-to-end automation — the stronger starting position means faster time to value than most peers."
      : "Priority: connect existing tools through workflow automation to eliminate the remaining manual handoffs between systems.";
  }

  else if (catKey === "sales") {
    if (bandKey === "fragile" || bandKey === "developing") {
      analysis.diagnosis = "The sales process is largely reactive, with limited structure around follow-up timing, pipeline stages, or lead qualification.";
    } else if (bandKey === "progressing") {
      analysis.diagnosis = "A basic sales structure exists with some follow-up cadence. The gap is consistent execution and systematic pipeline tracking.";
    } else {
      analysis.diagnosis = aboveBaseline
        ? "Sales operations are more structured than most businesses of this type and size. The pipeline works — the upside is optimization: faster response times, higher close rates, and systematic re-engagement of existing contacts for additional revenue."
        : "Sales operations are structured with pipeline stages and systematic follow-up. The opportunity is optimization — targeting close rates, response speed, and customer lifetime value.";
    }
    if (signals.salesIsStructured || signals.salesIsMature) analysis.strength = "A structured sales pipeline with defined stages provides a solid foundation for targeted optimization.";
    else if (signals.salesIsBasic) analysis.strength = "A basic follow-up process is in place, demonstrating awareness that systematic outreach improves conversion.";
    else analysis.strength = "Revenue is being generated without a formal sales system, which means demand exists organically. Structuring the response to that demand is one of the highest-leverage moves available.";

    if (signals.salesIsReactive) analysis.gap = "Inbound-only sales means revenue depends entirely on the prospect's initiative. No outbound structure exists to recapture lost leads or nurture existing relationships.";
    else if (signals.salesIsBasic) analysis.gap = "Follow-up happens but without consistent timing or escalation. Leads that don't convert on first contact are likely falling out of the pipeline.";
    else if (signals.narrowAcquisition) analysis.gap = "Customer acquisition depends on a narrow set of channels. Any disruption to those channels puts revenue at risk.";
    else analysis.gap = "The pipeline is operational, but existing customer data is underutilized for re-engagement, upsell timing, and retention triggers — leaving revenue on the table with contacts already in the system.";

    analysis.implication = signals.wantsRevenue
      ? "With revenue growth as a stated priority, the gaps in the sales process represent the most direct constraint on achieving that goal."
      : "Sales process efficiency directly impacts revenue predictability and the team's ability to grow without adding headcount.";

    if (signals.salesIsReactive) analysis.focus = "Priority: build a basic follow-up sequence that triggers automatically when a lead comes in. One workflow can recover a meaningful share of dropped opportunities.";
    else if (signals.narrowAcquisition) analysis.focus = "Priority: diversify acquisition channels. AI-powered content and targeted outreach can open new paths without requiring a dedicated marketing team.";
    else analysis.focus = aboveBaseline
      ? "Priority: the pipeline foundation is stronger than most — now add AI-assisted follow-up timing and re-engagement sequences to capture revenue that is currently left on the table."
      : "Priority: tighten follow-up timing and add AI-assisted messaging to ensure consistent, timely prospect engagement.";
  }

  else if (catKey === "data") {
    if (bandKey === "fragile" || bandKey === "developing") {
      analysis.diagnosis = "Performance visibility is limited. The business lacks consistent metrics, and what tracking exists relies on manual compilation or siloed tools.";
    } else if (bandKey === "progressing") {
      analysis.diagnosis = "Basic tracking is in place through accounting software or spreadsheets, but the picture is incomplete. Key operational and sales metrics are not consistently visible.";
    } else {
      analysis.diagnosis = aboveBaseline
        ? "Data infrastructure is ahead of most businesses of this type and size. The visibility foundation is in place — the upside is connecting data sources into real-time, cross-functional reporting that turns existing data into margin and efficiency gains."
        : "Data infrastructure supports regular visibility into key metrics. The opportunity is connecting data sources for real-time, cross-functional reporting.";
    }
    if (signals.tracksWithDashboard) analysis.strength = "Dashboard or BI tooling is in place, providing structured performance visibility beyond manual reporting.";
    else if (signals.tracksWithAccounting) analysis.strength = "Financial data is tracked through accounting software, providing a reliable foundation for business performance visibility.";
    else if (signals.tracksWithSpreadsheets) analysis.strength = "Spreadsheet-based tracking shows discipline around data collection, even if the format limits scalability.";
    else analysis.strength = "Decisions are made on operational experience and direct observation, which means the team already acts on data — it is just not captured in a system yet.";

    if (signals.noConsistentTracking) analysis.gap = "There is no consistent performance tracking. Decisions are made without reliable data on revenue trends, margins, or operational throughput.";
    else if (signals.tracksWithSpreadsheets) analysis.gap = "Spreadsheet-based tracking requires manual updates, is prone to error, and does not provide real-time visibility.";
    else if (signals.tracksWithAccounting) analysis.gap = "Financial tracking tells part of the story, but operational, sales, and customer data are not connected to the same view.";
    else analysis.gap = "Individual data sources exist across tools, but they are not connected — revenue, pipeline, operations, and customer data live in separate views, making cross-functional analysis manual.";

    analysis.implication = signals.highAdminBurden
      ? "Without automated reporting, the team spends significant hours on manual data compilation — time that could be recovered through connected dashboards."
      : signals.wantsMargins
        ? "Without visibility into cost drivers and margin trends, improving profitability requires guesswork rather than targeted intervention."
        : "Limited data visibility means missed patterns — revenue trends, margin shifts, and workflow bottlenecks remain hidden until they become problems.";

    if (signals.noConsistentTracking) analysis.focus = "Priority: establish a basic automated dashboard pulling from your existing tools. Even one view of revenue, pipeline, and open work changes how decisions are made.";
    else if (signals.tracksWithSpreadsheets) analysis.focus = "Priority: migrate from manual spreadsheets to automated reporting. Connect your data sources to a dashboard that updates without human intervention.";
    else analysis.focus = aboveBaseline
      ? "Priority: the data foundation is stronger than typical — now connect sources into a unified dashboard for real-time visibility across revenue, operations, and customer metrics."
      : "Priority: expand beyond financial tracking to include operational and customer metrics in a unified view.";
  }

  else if (catKey === "content") {
    if (bandKey === "fragile" || bandKey === "developing") {
      analysis.diagnosis = "Content and knowledge management are largely informal. Institutional knowledge is not documented, and customer-facing content is produced inconsistently or not at all.";
    } else if (bandKey === "progressing") {
      analysis.diagnosis = "Some content practices exist, and knowledge is partially organized. The gap is consistency — both in content output cadence and in knowledge accessibility.";
    } else {
      analysis.diagnosis = aboveBaseline
        ? "Content and knowledge systems are better organized than most businesses of this type and size. The foundation supports scaling output — leveraging AI for faster production cycles can multiply visibility without adding headcount."
        : "Content and knowledge systems are organized and actively maintained. The opportunity is scaling output and leveraging AI for faster production cycles.";
    }
    if (signals.knowledgeOrganized) analysis.strength = "Knowledge management is structured, with a wiki or documented system that makes institutional knowledge accessible.";
    else if (signals.contentDedicated) analysis.strength = "Dedicated content capabilities mean the business already invests in consistent external communication.";
    else if (signals.contentAdHoc) analysis.strength = "Content is created when time allows, showing awareness that external visibility matters for growth.";
    else if (signals.knowledgeUnstructured) analysis.strength = "Files and documents exist in shared drives, providing a starting point for organized knowledge management.";
    else analysis.strength = "The team carries deep operational and customer knowledge built over years of direct work — once captured in a system, that knowledge compounds instead of depending on individual memory.";

    if (signals.knowledgeInHeads) analysis.gap = "Institutional knowledge lives in people's heads. When key people are unavailable or leave, that knowledge is lost.";
    else if (signals.knowledgeUnstructured) analysis.gap = "Shared drives exist but lack structure. Finding the right document takes time, and outdated versions create confusion.";
    else analysis.gap = "Knowledge exists in organized form, but it is not connected to daily workflows — the right document does not surface at the right moment without someone going to find it.";

    if (signals.contentNone) {
      analysis.implication = "Without content, the business is invisible to prospects who search online before they reach out. Every competitor producing content is capturing attention you are not.";
      analysis.focus = "Priority: begin AI-assisted content creation. Draft social posts, proposals, and follow-up messages from existing job data and customer interactions.";
    } else if (signals.contentAdHoc) {
      analysis.implication = "Inconsistent content output means the business appears and disappears from prospect awareness. Steady cadence matters more than perfection.";
      analysis.focus = "Priority: use AI writing tools to reduce the time per piece from hours to minutes, making a consistent cadence sustainable.";
    } else {
      analysis.implication = signals.wantsExit
        ? "Documented knowledge and organized systems increase business value. Buyers pay more for businesses that do not depend on individual knowledge."
        : "Organized content and knowledge systems reduce onboarding time and ensure consistent communication as the team grows.";
      analysis.focus = aboveBaseline
        ? "Priority: the content foundation is stronger than most — now automate the pipeline: turn job completions into review requests, project photos into social posts, and customer data into personalized follow-ups at scale."
        : "Priority: connect content workflows to automation — turn job completions into review requests, project photos into social posts, and customer data into personalized follow-ups.";
    }
  }

  else if (catKey === "technology") {
    if (bandKey === "fragile" || bandKey === "developing") {
      analysis.diagnosis = "Technology adoption is limited. The team has minimal experience with AI tools and may show caution or resistance toward new technology.";
    } else if (bandKey === "progressing") {
      analysis.diagnosis = "The team has experimented with technology and shows openness. The next step is converting that openness into consistent, structured adoption.";
    } else {
      analysis.diagnosis = aboveBaseline
        ? "Technology adoption is ahead of most businesses of this type and size. The team is already comfortable with AI and digital tools — the opportunity is deepening integration and capturing compound efficiency gains that less-prepared competitors cannot yet pursue."
        : "Technology adoption is strong, with the team actively using AI and digital tools. The focus is on deepening integration and expanding use cases.";
    }
    if (signals.techEarlyAdopter) analysis.strength = "The team adopts technology early, providing a strong foundation for rapid AI implementation.";
    else if (signals.techComfortable) analysis.strength = "General comfort with new technology means adoption friction will be low when the right tools are introduced.";
    else if (signals.aiExperimented || signals.aiRegular) analysis.strength = "Direct experience with AI tools, even if limited, means the team understands the basic value proposition.";
    else if (signals.techCautious) analysis.strength = "The team is cautious but open, which is often the ideal starting posture — it means they will adopt when they see clear, immediate value.";
    else analysis.strength = "The team has not yet committed to specific AI tools, which means implementation can start with best-fit solutions — no legacy integrations to work around or replace.";

    if (signals.aiNone && signals.techResistant) analysis.gap = "No AI adoption combined with team resistance creates a compounding barrier. The first experience with AI tools needs to be frictionless and immediately useful.";
    else if (signals.aiNone) analysis.gap = "AI has not been used in the business, meaning the team has no firsthand reference point for what is possible or practical.";
    else if (signals.aiExperimented) analysis.gap = "AI experimentation has not translated into consistent operational use. Without structured implementation, the initial interest may not convert.";
    else analysis.gap = "Individual tools work in isolation — data entered in one system must be manually re-entered or exported to reach another, creating friction that scales with volume.";

    analysis.implication = signals.techResistant
      ? "Team resistance to technology is the primary adoption risk. Implementation plans must prioritize visible, quick wins that build trust before expanding scope."
      : "Technology readiness determines how quickly the recommendations in this report can be implemented. Higher readiness means faster time to value.";

    if (signals.aiNone && signals.techResistant) analysis.focus = "Priority: start with a single, visible pain point. Choose a tool that solves a daily frustration in the first week — build trust before expanding.";
    else if (signals.aiNone) analysis.focus = "Priority: introduce one AI tool into one existing workflow. The goal is a first successful experience, not full-scale adoption.";
    else if (signals.aiExperimented) analysis.focus = "Priority: identify 1–2 workflows where AI becomes a permanent part of the process. Move from occasional use to embedded operation.";
    else analysis.focus = aboveBaseline
      ? "Priority: the technology foundation is stronger than most — now connect existing tools through end-to-end workflow automation to unlock the compound efficiency gains that this readiness level makes possible."
      : "Priority: connect existing tools through workflow automation to eliminate manual transfer steps and unlock compound efficiency.";
  }

  return analysis;
}

// ── 6. 30-Day Action Plan Generator ────────────────────────────
// Three blocks: Days 1-7, 8-14, 15-30.
// Varies by: selected priorities, readiness, goals, tech comfort,
// tool profile, industry context.

export function generateActionPlan(wins, signals, clientTools) {
  const toolList = (clientTools || []).join(", ") || "your existing tools";
  const win1 = wins[0], win2 = wins[1], win3 = wins[2];
  const readiness = signals.implementationReadiness; // 0-5

  // Readiness-adaptive language
  const isLowReadiness = readiness <= 1;
  const isHighReadiness = readiness >= 4;

  // Goal-driven framing
  const goalFrame = signals.wantsRevenue ? "revenue impact"
    : signals.wantsWorkloadReduction ? "time recovery"
    : signals.wantsMargins ? "margin improvement"
    : signals.wantsExit ? "operational documentation"
    : "operational efficiency";

  // Block 1: Days 1-7
  const block1Actions = [];
  if (isLowReadiness) {
    block1Actions.push(
      `Create a Make account (free tier) and watch a 10-minute setup walkthrough before connecting any tools`,
      `Connect your first tool (${clientTools?.[0] || "Gmail"}) to Make — one connection, nothing automated yet`,
      `Map out the manual steps in your highest-priority workflow: ${win1?.title || "first improvement"}`,
      `Define one clear success metric — the specific number you want to change in 30 days`,
    );
  } else if (isHighReadiness) {
    block1Actions.push(
      `Create a Make account and connect your core tools (${toolList})`,
      `Build the first workflow in test mode: ${win1?.title || "highest-priority improvement"}`,
      `Define success criteria: expected trigger, output, and the ${goalFrame} metric you will track`,
      `Run end-to-end testing with real data — validate every step before going live`,
    );
  } else {
    block1Actions.push(
      `Create a Make account and connect your core tools (${toolList})`,
      `Audit the manual steps in your highest-priority workflow: ${win1?.title || "first improvement"}`,
      `Define what "done" looks like: expected trigger, output, and ${goalFrame} metric`,
      `Run a test scenario end-to-end in a sandbox before going live`,
    );
  }

  const block1Outcome = isLowReadiness
    ? "Platform set up, first tool connected, first workflow fully mapped on paper. Team understands what will change."
    : "Platform configured, first workflow scoped and tested, team aligned on what changes.";

  // Block 2: Days 8-14
  const block2Actions = [];
  if (isLowReadiness) {
    block2Actions.push(
      `Move the first workflow from test to production — start with low-volume runs`,
      `Brief the team: explain what is automated, what to watch for, and who to ask if something looks wrong`,
      `Document the first workflow: trigger, steps, expected output, and known edge cases`,
      `Begin mapping the second priority: ${win2?.title || "next improvement"}`,
    );
  } else if (isHighReadiness) {
    block2Actions.push(
      `Deploy first workflow to production with error handling, alerts, and logging`,
      `Brief the team on the new workflow and collect initial feedback after 48 hours`,
      `Build the second workflow in test mode: ${win2?.title || "next improvement"}`,
      `Track daily performance — log volume processed, failures, and time saved`,
    );
  } else {
    block2Actions.push(
      `Move the first workflow from test to production with error handling and alerts`,
      `Brief the team: what is automated, what to watch for, when to escalate`,
      `Begin scoping the second workflow: ${win2?.title || "next improvement"}`,
      `Track daily performance for the first week — log any failures or edge cases`,
    );
  }

  const block2Outcome = isHighReadiness
    ? "First workflow running and measured. Second workflow built and in testing."
    : "One workflow running in production. Second workflow scoped and ready to build.";

  // Block 3: Days 15-30
  const block3Actions = [];
  if (signals.wantsExit) {
    block3Actions.push(
      `Deploy the second workflow and begin the third: ${win3?.title || "remaining priority"}`,
      `Document all automated workflows with trigger maps, error handling, and ownership`,
      `Build a process inventory: what is automated, what is manual, what is next`,
      `Compare actual time savings against this report's estimates — prepare for operational review`,
    );
  } else if (signals.wantsRevenue) {
    block3Actions.push(
      `Deploy the second workflow and begin the third: ${win3?.title || "remaining priority"}`,
      `Measure revenue-related impact: response time, follow-up consistency, pipeline volume`,
      `Identify the next revenue-impacting workflow to automate in the 90-day roadmap`,
      `Document all live workflows: trigger, steps, owner, and error handling`,
    );
  } else if (signals.wantsWorkloadReduction) {
    block3Actions.push(
      `Deploy the second workflow and begin the third: ${win3?.title || "remaining priority"}`,
      `Measure hours recovered: compare actual admin time this week vs. the baseline before automation`,
      `Identify the next time-intensive workflow to automate in the 90-day roadmap`,
      `Document all live workflows: trigger, steps, owner, and error handling`,
    );
  } else {
    block3Actions.push(
      `Build and deploy the second automation with the same test-then-deploy pattern`,
      `Scope and start building the third workflow: ${win3?.title || "remaining priority"}`,
      `Compare actual ${goalFrame} against the estimated impact from this report`,
      `Document all live workflows: trigger, steps, owner, and error handling`,
    );
  }

  const block3Outcome = isLowReadiness
    ? "Two workflows live, third in progress. Team has firsthand experience with automation. Foundation set for the 90-day roadmap."
    : signals.wantsExit
      ? "Two workflows live, third in progress. Process documentation complete. Operational profile ready for review."
      : `Two workflows live, third in progress. Measurable ${goalFrame} confirmed. Foundation set for the 90-day roadmap.`;

  return [
    {
      window: "Days 1 – 7",
      label: isLowReadiness ? "Setup and Orientation" : isHighReadiness ? "Configure and Test" : "Foundation",
      objective: isLowReadiness
        ? `Set up the automation platform and map your first workflow: ${win1?.title || "highest-priority improvement"}. The goal this week is understanding, not speed.`
        : `Set up your primary automation platform and scope the first workflow: ${win1?.title || "highest-priority improvement"}.`,
      actions: block1Actions,
      outcome: block1Outcome,
      tool: win1?.tool || "Make",
    },
    {
      window: "Days 8 – 14",
      label: isLowReadiness ? "First Workflow Live" : isHighReadiness ? "Deploy and Build" : "First Workflow Live",
      objective: isHighReadiness
        ? `First workflow in production and measured. Second workflow built and in testing: ${win2?.title || "next improvement"}.`
        : `Deploy your first automation and begin scoping the second priority: ${win2?.title || "next improvement"}.`,
      actions: block2Actions,
      outcome: block2Outcome,
      tool: win2?.tool || "Make + Claude Pro",
    },
    {
      window: "Days 15 – 30",
      label: isLowReadiness ? "Deploy and Baseline" : isHighReadiness ? "Scale and Validate" : "Expand and Measure",
      objective: `Deploy the second workflow and begin the third: ${win3?.title || "remaining priority"}. Measure results against baseline.`,
      actions: block3Actions,
      outcome: block3Outcome,
      tool: win3?.tool || "Make + Claude Pro",
    },
  ];
}

// ── 7. Risk Engine ──────────────────────────────────────────────
// Structured risk library → signal-based selection → top 4.
// Each risk: { label, severity, reason, watch, mitigation }

const RISK_LIBRARY = [
  // ── Adoption / Team ──
  {
    id: "team_resistance",
    label: "Team adoption resistance",
    severity: "High",
    eligible: (s) => s.techResistant,
    reason: "The team has indicated resistance to new technology. Without buy-in, automated workflows will be bypassed or ignored.",
    watch: "Early refusal to use new tools, reverting to manual processes within the first two weeks, or lack of engagement during onboarding.",
    mitigation: "Start with a single workflow that eliminates a universally disliked manual task. Demonstrate time savings within the first week before expanding scope.",
  },
  {
    id: "cautious_adoption",
    label: "Slow adoption curve",
    severity: "Medium",
    eligible: (s) => s.techCautious && !s.techResistant,
    reason: "The team is open but cautious. Adoption will require visible proof of value before expanding beyond the first workflow.",
    watch: "Hesitation to move from pilot to production, requests for extended testing periods, or reluctance to hand off manual control.",
    mitigation: "Build the first automation on a low-stakes, high-frequency task. Share measurable results (time saved, errors avoided) after the first week to build confidence.",
  },
  {
    id: "ai_unfamiliarity",
    label: "AI unfamiliarity",
    severity: "Medium",
    eligible: (s) => s.aiNone,
    reason: "The team has no prior experience with AI tools. First impressions will shape long-term willingness to adopt.",
    watch: "Confusion about what AI can and cannot do, unrealistic expectations, or distrust of AI-generated outputs.",
    mitigation: "Introduce AI through a supervised, human-in-the-loop workflow — AI drafts, a person reviews. Build trust before moving to fully automated execution.",
  },
  // ── Integration / Technical ──
  {
    id: "tool_fragmentation",
    label: "Tool stack fragmentation",
    severity: "Medium",
    eligible: (s) => {
      const tools = s._clientTools || [];
      return tools.length >= 5;
    },
    reason: "A large number of tools in the stack increases the number of integrations required. Each connection point is a potential failure surface.",
    watch: "API rate limits, authentication token expiry, or data format mismatches between connected tools.",
    mitigation: "Prioritize integrations for the three highest-impact tools first. Add remaining connections incrementally after the core workflows are stable.",
  },
  {
    id: "integration_gaps",
    label: "Missing tool connectors",
    severity: "Medium",
    eligible: () => true, // universal but low-priority
    weight: 1,
    reason: "Not all tools have pre-built automation connectors. Niche or legacy software may require custom API configuration or workarounds.",
    watch: "Tools that lack API access entirely, require paid API tiers, or have undocumented endpoints.",
    mitigation: "Verify connector availability for every tool in the stack before starting build. Flag gaps early and scope workarounds during the setup phase.",
  },
  // ── Data quality ──
  {
    id: "data_quality",
    label: "Data quality issues",
    severity: "High",
    eligible: (s) => s.noConsistentTracking || s.knowledgeInHeads,
    reason: "Automation amplifies existing data problems. If records are inconsistent, duplicated, or incomplete, automated workflows will produce unreliable outputs.",
    watch: "Duplicate entries, missing required fields, inconsistent naming conventions, or outdated records in the primary system of record.",
    mitigation: "Run a targeted data audit on the systems feeding into the first automated workflow. Clean the immediate inputs before deploying — full cleanup can happen in parallel.",
  },
  {
    id: "data_quality_moderate",
    label: "Inconsistent data formatting",
    severity: "Medium",
    eligible: (s) => s.tracksWithSpreadsheets && !s.noConsistentTracking,
    reason: "Spreadsheet-based tracking often contains format inconsistencies — mixed date formats, free-text where structured data is expected, or incomplete rows.",
    watch: "Automation errors caused by unexpected data formats, blank fields, or values outside expected ranges.",
    mitigation: "Add input validation to the first workflow. Define expected data formats explicitly and build error handling for common exceptions.",
  },
  // ── Process / Scope ──
  {
    id: "scope_creep",
    label: "Scope creep",
    severity: "Medium",
    eligible: (s) => s.implementationReadiness >= 3,
    reason: "Higher readiness teams often want to automate everything at once. Expanding scope before the first workflows are stable increases failure risk across all of them.",
    watch: "Requests to add new workflows before existing ones are documented and measured, or pressure to skip testing phases.",
    mitigation: "Hold to the phased roadmap. Each new workflow enters production only after the previous one has run stable for at least one week.",
  },
  {
    id: "dependency_on_champion",
    label: "Single-person dependency",
    severity: "Medium",
    eligible: (s) => s.teamSize === "1 to 5" || s.teamSize === "Just me",
    reason: "In small teams, automation knowledge often concentrates in one person. If that person is unavailable, automated workflows cannot be maintained or debugged.",
    watch: "Only one person understands how the workflows are configured, or only one person has admin access to the automation platform.",
    mitigation: "Document every workflow with a runbook: trigger, steps, expected output, error handling, and escalation path. Ensure at least one other person can pause or modify any scenario.",
  },
  // ── Goal-specific ──
  {
    id: "exit_documentation",
    label: "Insufficient process documentation",
    severity: "High",
    eligible: (s) => s.wantsExit && (s.knowledgeInHeads || s.knowledgeUnstructured),
    reason: "Exit readiness requires demonstrable, documented processes. Knowledge that exists only in people's heads or unstructured drives will reduce business valuation.",
    watch: "Key workflows that cannot be explained without the person who runs them, or documentation that is outdated or incomplete.",
    mitigation: "Make documentation a parallel workstream from day one. Every automated workflow should produce a runbook before it goes live.",
  },
  {
    id: "revenue_measurement",
    label: "Unclear revenue attribution",
    severity: "Medium",
    eligible: (s) => s.wantsRevenue && s.noConsistentTracking,
    reason: "Without consistent tracking, it is difficult to attribute revenue changes to automation improvements. ROI becomes a guess rather than a measurement.",
    watch: "Inability to answer 'how much revenue did this workflow influence?' after the first 30 days.",
    mitigation: "Establish a baseline revenue metric before automation begins. Track the specific metric each workflow is designed to influence.",
  },
  {
    id: "workload_expectation",
    label: "Unrealistic time-saving expectations",
    severity: "Low",
    eligible: (s) => s.wantsWorkloadReduction && s.highAdminBurden,
    reason: "High admin burden creates urgency, but automation reduces specific task time — it does not eliminate all manual work overnight. Misaligned expectations lead to perceived failure.",
    watch: "Frustration after the first week that 'nothing has changed,' even when specific workflows are measurably faster.",
    mitigation: "Quantify the baseline hours for each automated task before starting. Report time saved per workflow, not overall workload reduction, during the first 30 days.",
  },
];

export function generateRisks(signals, clientTools) {
  // Attach clientTools to signals for library access
  const s = { ...signals, _clientTools: clientTools || [] };

  // Score each risk: eligible → base priority by severity + small weight bonus
  const SEV_SCORE = { High: 30, Medium: 20, Low: 10 };
  const scored = RISK_LIBRARY
    .filter(r => r.eligible(s))
    .map(r => ({
      label: r.label,
      severity: r.severity,
      reason: r.reason,
      watch: r.watch,
      mitigation: r.mitigation,
      score: (SEV_SCORE[r.severity] || 15) + (r.weight || 0),
    }))
    .sort((a, b) => b.score - a.score);

  // Take top 4, dedupe by label
  const selected = [];
  const seen = new Set();
  for (const r of scored) {
    if (seen.has(r.label)) continue;
    seen.add(r.label);
    selected.push({ label: r.label, severity: r.severity, reason: r.reason, watch: r.watch, mitigation: r.mitigation });
    if (selected.length >= 4) break;
  }

  // Guarantee 4 risks — fill with universal fallbacks
  const FALLBACKS = [
    { label: "Missing tool connectors", severity: "Medium", reason: "Not all tools have pre-built automation connectors. Niche or legacy software may require custom API work.", watch: "Tools that lack API access, require paid API tiers, or have undocumented endpoints.", mitigation: "Verify connector availability for every tool in the stack before starting build." },
    { label: "Scope creep", severity: "Low", reason: "AI capability expands quickly. Automating too many workflows at once increases failure risk across all of them.", watch: "Requests to add workflows before existing ones are stable and documented.", mitigation: "Hold to the phased roadmap. New workflows enter production only after the previous one runs stable for one week." },
    { label: "Change management overhead", severity: "Low", reason: "Even well-received automation changes how daily work feels. Some adjustment friction is normal.", watch: "Temporary productivity dips in the first week after a workflow goes live, or questions about whether the automation is 'working.'", mitigation: "Set explicit expectations: the first week is adjustment, the second week is measurement. Share results weekly." },
  ];
  for (const fb of FALLBACKS) {
    if (selected.length >= 4) break;
    if (seen.has(fb.label)) continue;
    seen.add(fb.label);
    selected.push(fb);
  }

  return selected;
}

// ── 8. 90-Day Roadmap Generator ─────────────────────────────────
// Five phases: setup → pilot → expand → stabilize → measure.
// Varies by: priorities, readiness, goals, tools, industry.

const PHASE_COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#a855f7", "#4a80f5"];

export function generateRoadmap(wins, signals, clientTools) {
  const toolList = (clientTools || []).join(", ") || "CRM, email, invoicing, file storage";
  const readiness = signals.implementationReadiness;
  const isLow = readiness <= 1;
  const isHigh = readiness >= 4;
  const win1 = wins[0], win2 = wins[1], win3 = wins[2];

  const goalMetric = signals.wantsRevenue ? "pipeline volume and close rate"
    : signals.wantsWorkloadReduction ? "hours recovered per week"
    : signals.wantsMargins ? "cost per workflow and margin trend"
    : signals.wantsExit ? "process documentation coverage"
    : "throughput and error rate";

  const goalContext = signals.wantsRevenue ? "revenue-impacting"
    : signals.wantsWorkloadReduction ? "time-intensive"
    : signals.wantsMargins ? "cost-driving"
    : signals.wantsExit ? "undocumented"
    : "high-frequency";

  // Phase 1: Setup
  const p1Steps = isLow ? [
    `Audit all manual workflows — list every recurring task across operations, sales, content, and data`,
    `Log time spent per task for one week to establish a baseline (use a shared tracker or simple spreadsheet)`,
    `Rank workflows by frequency × time cost to identify top 3 automation candidates`,
    `Create Make.com account (free tier) and watch a setup walkthrough before connecting tools`,
    `Connect first tool (${clientTools?.[0] || "your primary tool"}) to Make — one connection, nothing automated yet`,
    `Define success metrics for the first workflow: ${win1?.title || "highest-priority improvement"}`,
  ] : isHigh ? [
    `Audit existing tool integrations and API access across the stack (${toolList})`,
    `Map the end-to-end data flow for the top 3 ${goalContext} workflows`,
    `Create Make.com account and connect all primary tools in one session`,
    `Verify API permissions, rate limits, and authentication for each connection`,
    `Define success criteria for each workflow: expected trigger, output, and ${goalMetric} target`,
    `Build the first scenario in test mode: ${win1?.title || "highest-priority improvement"}`,
  ] : [
    `Audit all manual workflows across operations, sales, content, and data categories`,
    `Log time spent per task to establish baseline hours (use a shared tracker or spreadsheet)`,
    `Rank workflows by frequency × time cost to identify top 3 automation candidates`,
    `Create Make.com account, connect primary tools (${toolList})`,
    `Verify API access and permissions for each connected tool`,
    `Define success metrics for each candidate workflow (${goalMetric})`,
  ];

  // Phase 2: Pilot
  const p2Steps = isLow ? [
    `Build the first Make scenario end-to-end in test mode: ${win1?.title || "highest-priority improvement"}`,
    `Add basic error handling: failure notifications and a log of skipped records`,
    `Run 5–10 test cycles with real data — validate outputs match what the manual process produces`,
    `Deploy to production with low-volume runs for the first 3 days`,
    `Brief the team: what is automated, what to watch for, and who to ask if something looks wrong`,
    `Track results daily for the first week — log volume processed, failures, and time saved`,
  ] : isHigh ? [
    `Deploy first workflow to production with error handling, retry logic, and alerting`,
    `Run in parallel with the manual process for 48 hours to validate accuracy`,
    `Brief the team on the new workflow and collect feedback after the first week`,
    `Build the second scenario in test mode: ${win2?.title || "next priority"}`,
    `Track daily performance: ${goalMetric}, failure rate, and edge cases`,
    `Begin documenting the first workflow: trigger, steps, expected output, error handling, owner`,
  ] : [
    `Build the highest-priority scenario end-to-end in a test environment: ${win1?.title || "highest-priority improvement"}`,
    `Add error handling: retry logic, fallback notifications, dead-letter logging`,
    `Run 5–10 test cycles with real data, validate outputs match manual process`,
    `Deploy to production with a monitoring dashboard (Make execution logs + alerts)`,
    `Train 1–2 team members: what triggers it, how to check status, when to escalate`,
    `Track pilot performance daily for the first week, then weekly`,
  ];

  // Phase 3: Expand
  const crossFunctionalExample = signals.salesIsReactive
    ? "lead intake → follow-up sequence"
    : signals.highAdminBurden
      ? "job completion → invoice generation"
      : "sales → operations handoff";

  const p3Steps = [
    `Deploy second automation using lessons from the pilot: ${win2?.title || "next priority"}`,
    `Deploy third scenario — prioritize a cross-functional workflow (${crossFunctionalExample})`,
    signals.aiNone
      ? `Introduce AI for one content or communication task: supervised drafting with human review before sending`
      : `Integrate AI into at least one content or communication workflow (drafting, summarization, or classification)`,
    `Compare actual ${goalMetric} against Week 1–2 baseline for all three workflows`,
    `Identify and fix edge cases or failure modes surfaced during the first 4 weeks of operation`,
    `Document each workflow: trigger, steps, expected output, error handling, owner`,
  ];

  // Phase 4: Stabilize
  const p4Steps = [
    `Review 30-day execution logs for each automation — flag error rates above 2%`,
    `Refine scenarios: tighten filters, improve data validation, reduce false triggers`,
    signals.wantsExit
      ? `Finalize process documentation for all automated and manual workflows — runbooks, escalation paths, and ownership maps`
      : `Finalize team documentation: runbooks, escalation paths, troubleshooting guides`,
    `Conduct a team walkthrough so all stakeholders understand what is automated and what is not`,
    isLow
      ? `Verify at least one team member beyond the project lead can pause, monitor, or restart any scenario`
      : `Ensure at least one team member can modify or pause any scenario without outside help`,
  ];

  // Phase 5: Measure
  const p5Steps = [
    `Calculate total ${signals.wantsWorkloadReduction ? "hours recovered" : signals.wantsRevenue ? "revenue influenced" : "efficiency gained"} per week across all automated workflows`,
    `Compare actual results against the estimates in this report`,
    `Identify the next 2–3 ${goalContext} workflows to automate based on updated audit`,
    signals.wantsExit
      ? `Compile operational documentation package: what is automated, what is manual, process owners, and maintenance requirements`
      : `Assess whether additional tool integrations or AI use cases are warranted`,
    `Produce a one-page summary: what was automated, ${goalMetric} impact, and next steps`,
  ];

  return [
    {
      phaseNum: "01", window: "Week 1 – 2",
      label: isLow ? "Audit and Orientation" : isHigh ? "Configure and Scope" : "Setup and Baseline",
      accentColor: PHASE_COLORS[0],
      goal: isLow
        ? "Manual workflows audited, baseline hours logged, automation platform set up, first workflow mapped."
        : isHigh
          ? "Stack connected, top 3 workflows scoped, first scenario built in test mode."
          : "Accounts configured, tools connected, priority list locked.",
      steps: p1Steps,
    },
    {
      phaseNum: "02", window: "Week 3 – 4",
      label: isLow ? "First Pilot Build" : isHigh ? "Deploy and Iterate" : "First Pilot Live",
      accentColor: PHASE_COLORS[1],
      goal: isLow
        ? "First workflow built, tested, and running in production at low volume."
        : isHigh
          ? "First workflow in production and measured. Second workflow built in test mode."
          : "One automated workflow running in production with error handling.",
      steps: p2Steps,
    },
    {
      phaseNum: "03", window: "Week 5 – 8",
      label: "Expand and Validate",
      accentColor: PHASE_COLORS[2],
      goal: `Three workflows automated, measurable ${goalMetric.split(" and ")[0]} confirmed.`,
      steps: p3Steps,
    },
    {
      phaseNum: "04", window: "Week 9 – 10",
      label: "Stabilize and Harden",
      accentColor: PHASE_COLORS[3],
      goal: signals.wantsExit
        ? "All workflows stable, documentation complete, operational profile ready for review."
        : "All workflows stable, team operating independently, documentation complete.",
      steps: p4Steps,
    },
    {
      phaseNum: "05", window: "Week 11 – 12",
      label: "Measure and Plan Forward",
      accentColor: PHASE_COLORS[4],
      goal: `Clear ${goalMetric} data, next automation candidates identified, practice self-sustaining.`,
      steps: p5Steps,
    },
  ];
}

// ── 9. Engine Entry Point ──────────────────────────────────────
// Consumes raw answers + calculated scores.
// Returns the full engine output to be merged into the report object.

export function buildEngineOutput(answers, calculatedScores, clientTools, _legacyBenchmark, co) {
  const signals = deriveSignals(answers || {});
  const categoryScores = calculatedScores?.categories || {};
  const overall = calculatedScores?.overall || 0;

  // Compute structured benchmark from industry + size
  const benchmark = computeBenchmark(signals.industry, signals.teamSize);

  // Generate recommendations (always exactly 3)
  const wins = generateRecommendations(signals, categoryScores);

  // Score bands
  const overallBand = getScoreBand(overall);
  const categoryBands = {};
  CATEGORY_KEYS.forEach(key => {
    const score = categoryScores[key]?.score ?? 0;
    categoryBands[key] = getScoreBand(score);
  });

  // Summary narrative
  const summaryNarrative = generateSummaryNarrative(
    overall, overallBand, signals, wins, benchmark.overall, co || "Your Business"
  );

  // Category analyses
  const categoryAnalyses = {};
  CATEGORY_KEYS.forEach(key => {
    const score = categoryScores[key]?.score ?? 0;
    categoryAnalyses[key] = generateCategoryAnalysis(
      key, score, categoryBands[key], signals, signals.industry, benchmark.categories[key]
    );
  });

  // 30-Day Action Plan
  const actionPlan = generateActionPlan(wins, signals, clientTools);

  // Risks
  const risks = generateRisks(signals, clientTools);

  // 90-Day Roadmap
  const roadmap = generateRoadmap(wins, signals, clientTools);

  return {
    signals,
    wins,
    overallBand,
    categoryBands,
    benchmark,
    summaryNarrative,
    categoryAnalyses,
    actionPlan,
    risks,
    roadmap,
  };
}
