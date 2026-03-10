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
      `Create a free Make account and watch a 10-minute walkthrough video before connecting anything`,
      `Connect your first tool (${clientTools?.[0] || "Gmail"}) to Make — just the connection, no automation yet`,
      `Write down every manual step in your most important task: ${win1?.title || "first improvement"}`,
      `Pick one number you want to improve in 30 days — that is how you will know this is working`,
    );
  } else if (isHighReadiness) {
    block1Actions.push(
      `Create a Make account and connect your main tools (${toolList})`,
      `Pick the number you want to improve (${goalFrame}) and write down what it is today`,
      `Build the first automated workflow in test mode: ${win1?.title || "highest-priority improvement"}`,
      `Run it with real data a few times to make sure every step works before turning it on`,
    );
  } else {
    block1Actions.push(
      `Create a Make account and connect your main tools (${toolList})`,
      `Write down every manual step in your most important task: ${win1?.title || "first improvement"}`,
      `Decide what "done" looks like — what triggers the task, what comes out, and what number you will track (${goalFrame})`,
      `Build the first automated workflow in test mode and run it a few times before turning it on`,
    );
  }

  const block1Outcome = isLowReadiness
    ? "Make is set up, your first tool is connected, and you have a complete list of steps for the first task you are going to automate. The team knows what is changing."
    : "Your tools are connected, the first automated task is built and tested, and the team is aligned on what is changing.";

  // Block 2: Days 8-14
  const block2Actions = [];
  if (isLowReadiness) {
    block2Actions.push(
      `Turn on the first workflow — start with a small number of runs per day to make sure it works`,
      `Tell the team what is now automated, what to watch for, and who to ask if something looks wrong`,
      `Write it down: what triggers the task, what happens at each step, what should come out, and what can go wrong`,
      `Start mapping out the second task you want to automate: ${win2?.title || "next improvement"}`,
    );
  } else if (isHighReadiness) {
    block2Actions.push(
      `Turn on the first workflow with notifications set up so you know if something goes wrong`,
      `Tell the team how the new workflow works and ask for feedback after a couple of days`,
      `Start building the second workflow in test mode: ${win2?.title || "next improvement"}`,
      `Track what is happening each day — how many times it ran, whether anything failed, and how much time it saved`,
    );
  } else {
    block2Actions.push(
      `Turn on the first workflow with notifications set up so you know if something goes wrong`,
      `Tell the team: what is automated now, what to watch for, and when to raise a concern`,
      `Start planning the second task you want to automate: ${win2?.title || "next improvement"}`,
      `Track what is happening for the first week — write down anything that fails or looks off`,
    );
  }

  const block2Outcome = isHighReadiness
    ? "First workflow is running and you are tracking the results. Second workflow is built and being tested."
    : "One workflow is running for real. The second one is planned and ready to build.";

  // Block 3: Days 15-30
  const block3Actions = [];
  if (signals.wantsExit) {
    block3Actions.push(
      `Turn on the second workflow and start building the third: ${win3?.title || "remaining priority"}`,
      `Write up every automated task — what triggers it, what it does, who owns it, and what to do if it breaks`,
      `Make a list of everything that is automated and everything that is still manual`,
      `Compare the actual time savings to what this report estimated — get ready for an operational review`,
    );
  } else if (signals.wantsRevenue) {
    block3Actions.push(
      `Turn on the second workflow and start building the third: ${win3?.title || "remaining priority"}`,
      `Check the revenue-related numbers: Are responses faster? Are follow-ups more consistent? Are more leads moving forward?`,
      `Decide which revenue-impacting task to automate next in the 90-day roadmap`,
      `Write up all running workflows — what triggers them, what they do, who owns them`,
    );
  } else if (signals.wantsWorkloadReduction) {
    block3Actions.push(
      `Turn on the second workflow and start building the third: ${win3?.title || "remaining priority"}`,
      `Compare actual admin hours this week to what they were before automation started`,
      `Decide which time-consuming task to automate next in the 90-day roadmap`,
      `Write up all running workflows — what triggers them, what they do, who owns them`,
    );
  } else {
    block3Actions.push(
      `Build and turn on the second automated task, using the same test-then-launch approach`,
      `Start building the third: ${win3?.title || "remaining priority"}`,
      `Compare actual results (${goalFrame}) to what this report estimated`,
      `Write up all running workflows — what triggers them, what they do, who owns them`,
    );
  }

  const block3Outcome = isLowReadiness
    ? "Two automated tasks are running, the third is in progress. Your team has real experience with automation. You are ready for the 90-day roadmap."
    : signals.wantsExit
      ? "Two automated tasks are running, the third is in progress. All processes are documented. Ready for operational review."
      : `Two automated tasks are running, the third is in progress. You have real numbers showing ${goalFrame}. Ready for the 90-day roadmap.`;

  return [
    {
      window: "Days 1 – 7",
      label: isLowReadiness ? "Get Set Up" : isHighReadiness ? "Connect and Build" : "Get Set Up",
      objective: isLowReadiness
        ? `Set up Make, connect your first tool, and map out the first task you are going to automate: ${win1?.title || "highest-priority improvement"}. This week is about understanding the task clearly, not rushing.`
        : `Set up Make, connect your tools, and build the first automated task: ${win1?.title || "highest-priority improvement"}.`,
      actions: block1Actions,
      outcome: block1Outcome,
      tool: win1?.tool || "Make",
    },
    {
      window: "Days 8 – 14",
      label: isLowReadiness ? "Turn It On" : isHighReadiness ? "Launch and Start the Next One" : "Turn It On",
      objective: isHighReadiness
        ? `First automated task is running and you are tracking results. Second one is being built: ${win2?.title || "next improvement"}.`
        : `Turn on the first automated task and start planning the second: ${win2?.title || "next improvement"}.`,
      actions: block2Actions,
      outcome: block2Outcome,
      tool: win2?.tool || "Make + Claude chat",
    },
    {
      window: "Days 15 – 30",
      label: isLowReadiness ? "Expand and Measure" : isHighReadiness ? "Add More and Check Results" : "Expand and Measure",
      objective: `Turn on the second automated task and start the third: ${win3?.title || "remaining priority"}. Compare your results to what you had before.`,
      actions: block3Actions,
      outcome: block3Outcome,
      tool: win3?.tool || "Make + Claude chat",
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
    label: "Team pushback on new tools",
    severity: "High",
    eligible: (s) => s.techResistant,
    reason: "Your team has shown resistance to new technology. If people do not want to use the new tools, they will go back to doing things the old way and the automation will sit unused.",
    watch: "People refusing to use the new tools in the first two weeks, going back to the manual process, or not showing up for training.",
    mitigation: "Start with one task that everyone hates doing by hand. Show real time savings in the first week before asking the team to change anything else.",
  },
  {
    id: "cautious_adoption",
    label: "Team is cautious about change",
    severity: "Medium",
    eligible: (s) => s.techCautious && !s.techResistant,
    reason: "Your team is open to trying new tools but wants to see proof that they work before committing. That is reasonable, but it means the first automation needs to show clear results quickly.",
    watch: "People wanting to keep testing instead of using the automation for real work, or being reluctant to stop doing things by hand.",
    mitigation: "Pick a simple, repetitive task for the first automation. Share the results (time saved, mistakes avoided) after the first week so the team can see it is working.",
  },
  {
    id: "ai_unfamiliarity",
    label: "No experience with AI",
    severity: "Medium",
    eligible: (s) => s.aiNone,
    reason: "Your team has not used AI tools before. How the first experience goes will determine whether people trust it or avoid it going forward.",
    watch: "Confusion about what AI can and cannot do, expecting too much too soon, or not trusting what the AI produces.",
    mitigation: "Start with AI drafting something that a person reviews before it goes out — for example, a follow-up email or a summary. Let people get comfortable before removing the review step.",
  },
  // ── Integration / Technical ──
  {
    id: "tool_fragmentation",
    label: "Too many disconnected tools",
    severity: "Medium",
    eligible: (s) => {
      const tools = s._clientTools || [];
      return tools.length >= 5;
    },
    reason: "You use a lot of different tools. The more tools that need to talk to each other, the more connections you have to set up and maintain — and each one is a place where something can break.",
    watch: "Connections that stop working because a login expired, a tool changed its settings, or two tools send information in different formats.",
    mitigation: "Connect the three most important tools first. Get those working reliably before adding the rest one at a time.",
  },
  {
    id: "integration_gaps",
    label: "Some tools may not connect easily",
    severity: "Medium",
    eligible: () => true, // universal but low-priority
    weight: 1,
    reason: "Not every tool has a ready-made connector in Make. Some older or specialized software may need extra setup or a workaround to pass information back and forth.",
    watch: "Tools that do not offer any way to connect to outside software, tools that charge extra for connections, or tools with limited documentation.",
    mitigation: "Before you start building, check that every tool you plan to connect has a working connector in Make. If one does not, flag it early and plan a workaround.",
  },
  // ── Data quality ──
  {
    id: "data_quality",
    label: "Bad data in your current tools",
    severity: "High",
    eligible: (s) => s.noConsistentTracking || s.knowledgeInHeads,
    reason: "Automation makes existing data problems worse, not better. If your records have duplicates, missing information, or outdated entries, the automated tasks will produce bad output — faster.",
    watch: "Duplicate entries, missing fields, names spelled different ways in different places, or records that have not been updated in months.",
    mitigation: "Before turning on the first automation, clean up the data it will use. You do not need to fix everything at once — just the information that feeds into the first automated task.",
  },
  {
    id: "data_quality_moderate",
    label: "Messy spreadsheet data",
    severity: "Medium",
    eligible: (s) => s.tracksWithSpreadsheets && !s.noConsistentTracking,
    reason: "Spreadsheets often have inconsistent formatting — dates written different ways, blank rows, or notes typed into fields that should have numbers. Automation will choke on those.",
    watch: "Errors in the automation caused by blank fields, unexpected text in number columns, or dates that are not in a consistent format.",
    mitigation: "Set up the first automation to check its inputs before running. Define what the data should look like (for example: dates as MM/DD/YYYY, no blank rows) and have it flag anything that does not match.",
  },
  // ── Process / Scope ──
  {
    id: "scope_creep",
    label: "Trying to automate too much at once",
    severity: "Medium",
    eligible: (s) => s.implementationReadiness >= 3,
    reason: "Teams that are ready to go often want to automate everything right away. But if you add too many automations before the first ones are running smoothly, problems in one can cause problems in all of them.",
    watch: "Requests to add new automations before existing ones have been tested and measured, or pressure to skip the testing step.",
    mitigation: "Stick to the plan. Only start a new automation after the previous one has been running without issues for at least one week.",
  },
  {
    id: "dependency_on_champion",
    label: "Only one person knows how it works",
    severity: "Medium",
    eligible: (s) => s.teamSize === "1 to 5" || s.teamSize === "Just me",
    reason: "On small teams, one person usually ends up building and managing all the automations. If that person is sick, on vacation, or leaves, no one else knows how to keep things running.",
    watch: "Only one person understands how the automations are set up, or only one person has the login to the automation platform.",
    mitigation: "Write down how each automation works: what starts it, what it does, what to do if it breaks, and who to contact. Make sure at least one other person can pause or change any automation.",
  },
  // ── Goal-specific ──
  {
    id: "exit_documentation",
    label: "Processes are not written down",
    severity: "High",
    eligible: (s) => s.wantsExit && (s.knowledgeInHeads || s.knowledgeUnstructured),
    reason: "If you are preparing to sell or hand off the business, a buyer needs to see how everything works on paper. Knowledge that lives only in people's heads or scattered files will lower the value of the business.",
    watch: "Important processes that no one can explain without the person who runs them, or documentation that is out of date or does not exist.",
    mitigation: "Start writing things down from day one. Every automation should have a written description of how it works before it gets turned on.",
  },
  {
    id: "revenue_measurement",
    label: "Hard to tell what is driving revenue",
    severity: "Medium",
    eligible: (s) => s.wantsRevenue && s.noConsistentTracking,
    reason: "Without consistent tracking, you will not be able to tell whether the automation is actually helping revenue or whether the change came from something else. Your ROI becomes a guess.",
    watch: "Not being able to answer 'how much revenue did this automation help with?' after the first 30 days.",
    mitigation: "Before you start automating, write down your current revenue numbers for the tasks you plan to change. Track the same numbers after automation so you can compare.",
  },
  {
    id: "workload_expectation",
    label: "Expecting too much time savings too fast",
    severity: "Low",
    eligible: (s) => s.wantsWorkloadReduction && s.highAdminBurden,
    reason: "When admin work is heavy, there is pressure to fix it all at once. But automation saves time on specific tasks — it does not eliminate all manual work overnight. If expectations are too high, it will feel like it is not working even when it is.",
    watch: "Frustration after the first week that 'nothing has changed,' even when specific tasks are measurably faster.",
    mitigation: "Before you start, write down how many hours each task takes. Report time saved per task, not total workload reduction, during the first 30 days.",
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
    `List every task your team does repeatedly — across operations, sales, content, and admin`,
    `For one week, track how long each recurring task takes (use a simple spreadsheet or shared tracker)`,
    `Pick the top 3 tasks that take the most time and happen most often — those are the ones to automate first`,
    `Create a free Make.com account and watch a setup walkthrough before connecting anything`,
    `Connect your first tool (${clientTools?.[0] || "your primary tool"}) to Make — just the connection, no automation yet`,
    `Decide how you will measure whether automating the first task is working: ${win1?.title || "highest-priority improvement"}`,
  ] : isHigh ? [
    `Review the connections between your current tools (${toolList}) — what talks to what, and where are the gaps`,
    `For each of the top 3 ${goalContext} tasks, write down the steps from start to finish and where data moves between tools`,
    `Create a Make.com account and connect all your primary tools in one session`,
    `Test each connection to make sure it works — check that permissions are set correctly and data flows through`,
    `For each task, write down what should trigger it, what the output should be, and what ${goalMetric} you want to hit`,
    `Build the first automation in test mode: ${win1?.title || "highest-priority improvement"}`,
  ] : [
    `List every task your team does repeatedly — across operations, sales, content, and admin`,
    `Track how long each recurring task takes for one week (use a simple spreadsheet or shared tracker)`,
    `Pick the top 3 tasks that take the most time and happen most often — those are the ones to automate first`,
    `Create a Make.com account and connect your primary tools (${toolList})`,
    `Test each connection to make sure it works and permissions are set correctly`,
    `Decide how you will measure success for each task you plan to automate (${goalMetric})`,
  ];

  // Phase 2: Pilot
  const p2Steps = isLow ? [
    `Build the first automation in Make from start to finish in test mode: ${win1?.title || "highest-priority improvement"}`,
    `Set up notifications so you get an alert if anything fails or gets skipped`,
    `Run it 5–10 times with real data — check that the output matches what you would have done by hand`,
    `Turn it on for real, but start with low volume for the first 3 days to make sure it works`,
    `Tell the team what is now automated, what to watch for, and who to ask if something looks wrong`,
    `Check results daily for the first week — how many tasks ran, any failures, and time saved`,
  ] : isHigh ? [
    `Turn on the first automation with notifications set up so you know if something fails`,
    `Run it alongside the manual process for 48 hours to make sure results match`,
    `Walk the team through the new automation and get their feedback after the first week`,
    `Build the second automation in test mode: ${win2?.title || "next priority"}`,
    `Track daily results: ${goalMetric}, anything that failed, and any unusual situations that came up`,
    `Write down how the first automation works: what starts it, what it does, what comes out, and who owns it`,
  ] : [
    `Build the first automation from start to finish in test mode: ${win1?.title || "highest-priority improvement"}`,
    `Set up notifications so you get an alert if anything fails, and a log of anything that gets skipped`,
    `Run it 5–10 times with real data — check that the output matches what you would have done by hand`,
    `Turn it on for real with Make's activity log open so you can watch the first few runs`,
    `Train 1–2 team members on how it works: what starts it, how to check if it ran, and when to ask for help`,
    `Check results daily for the first week, then weekly after that`,
  ];

  // Phase 3: Expand
  const crossFunctionalExample = signals.salesIsReactive
    ? "lead intake → follow-up sequence"
    : signals.highAdminBurden
      ? "job completion → invoice generation"
      : "sales → operations handoff";

  const p3Steps = [
    `Turn on the second automation using what you learned from the first: ${win2?.title || "next priority"}`,
    `Build and turn on the third — pick one that connects two parts of the business (${crossFunctionalExample})`,
    signals.aiNone
      ? `Try using AI for one writing or communication task: have it draft something, then review it yourself before sending`
      : `Add AI to at least one writing or communication task — drafting, summarizing, or sorting incoming messages`,
    `Compare your current ${goalMetric} to what you measured in Week 1–2 for all three automated tasks`,
    `Look for situations where the automations did not handle something correctly and fix them`,
    `Write down how each automation works: what starts it, what it does, what comes out, and who owns it`,
  ];

  // Phase 4: Stabilize
  const p4Steps = [
    `Review the last 30 days of activity for each automation — look for anything that failed or ran incorrectly`,
    `Fine-tune each automation: fix anything that triggers when it should not, skips records it should catch, or produces incorrect output`,
    signals.wantsExit
      ? `Finish writing up how every process works — automated and manual — including who owns it, what to do if it breaks, and how to hand it off`
      : `Finish writing up how every process works: what to do if something breaks, who to call, and how to fix common problems`,
    `Walk the whole team through what is automated and what is still done by hand so everyone is on the same page`,
    isLow
      ? `Make sure at least one person besides the project lead knows how to pause, check, or restart any automation`
      : `Make sure at least one team member can change or pause any automation without outside help`,
  ];

  // Phase 5: Measure
  const p5Steps = [
    `Add up the total ${signals.wantsWorkloadReduction ? "hours saved" : signals.wantsRevenue ? "revenue influenced" : "time and effort saved"} per week across all three automations`,
    `Compare your actual results to the estimates from this report — are you ahead, behind, or on track?`,
    `Pick the next 2–3 ${goalContext} tasks to automate based on what you have learned so far`,
    signals.wantsExit
      ? `Put together a complete summary of how the business runs: what is automated, what is manual, who owns each process, and what needs to keep running`
      : `Decide whether you need to connect more tools or add AI to more tasks`,
    `Write a one-page summary: what you automated, what changed (${goalMetric}), and what to do next`,
  ];

  return [
    {
      phaseNum: "01", window: "Week 1 – 2",
      label: isLow ? "Learn the Tools" : isHigh ? "Connect and Plan" : "Get Set Up",
      accentColor: PHASE_COLORS[0],
      goal: isLow
        ? "You know which tasks to automate first, you have tracked how long they take, and Make is set up with your first tool connected."
        : isHigh
          ? "All your tools are connected, you have picked the top 3 tasks to automate, and the first one is built in test mode."
          : "Accounts are set up, tools are connected, and you have picked the tasks to automate first.",
      steps: p1Steps,
    },
    {
      phaseNum: "02", window: "Week 3 – 4",
      label: isLow ? "Build and Test" : isHigh ? "Launch and Build the Next One" : "Turn It On",
      accentColor: PHASE_COLORS[1],
      goal: isLow
        ? "The first automation is built, tested, and running with real data at low volume."
        : isHigh
          ? "The first automation is running and you are tracking results. The second is being built."
          : "One automation is running with real data and you have notifications set up in case something goes wrong.",
      steps: p2Steps,
    },
    {
      phaseNum: "03", window: "Week 5 – 8",
      label: "Add More and Measure",
      accentColor: PHASE_COLORS[2],
      goal: `Three tasks are automated and you can see a measurable change in ${goalMetric.split(" and ")[0]}.`,
      steps: p3Steps,
    },
    {
      phaseNum: "04", window: "Week 9 – 10",
      label: "Clean Up and Document",
      accentColor: PHASE_COLORS[3],
      goal: signals.wantsExit
        ? "All automations are running smoothly, everything is documented, and the business is ready to hand off or review."
        : "All automations are running smoothly, the team knows how everything works, and it is all written down.",
      steps: p4Steps,
    },
    {
      phaseNum: "05", window: "Week 11 – 12",
      label: "Check Results and Plan Ahead",
      accentColor: PHASE_COLORS[4],
      goal: `You have clear ${goalMetric} numbers, you know what to automate next, and the team can keep things running without outside help.`,
      steps: p5Steps,
    },
  ];
}

// ── 10. Category Tool Recommendation Generator ──────────────────
// AI-first, capability-specific recommendation per category.
// Signal-driven: reads diagnostic answers to produce contextual output.
// Primary capability = Claude (chat, Projects, Cowork, Code).
// Secondary capability = Make (orchestration, scheduling, integration).
// No generic SaaS. No hardcoded pricing. Existing tools as context only.

function generateCategoryToolRec(catKey, catScore, catBand, signals, clientTools, catBenchmark) {
  const readiness = signals.implementationReadiness; // 0-5
  const isLow = readiness <= 1;
  const isHigh = readiness >= 4;
  const aboveBaseline = catScore - (catBenchmark || 51) > 4;
  const toolContext = clientTools.length > 0 ? clientTools.join(", ") : "your current tools";

  // ── Per-category recommendation logic ──
  // Each block selects: title, operationalProblem, primary/secondary capability,
  // whyThisFits, aiApproach steps, expectedResult, planFit, startHere.
  //
  // Capability labels must be explicit:
  //   "Claude chat", "Claude Projects", "Claude Cowork", "Claude Code", "Make"
  // Never use bare "Claude" as a label.

  let rec;

  switch (catKey) {
    case "operations": {
      // Signal-driven problem identification
      const problem = signals.intakeIsManual
        ? `Customer inquiries come in by phone and email, and every one has to be read, sorted, and answered by hand. With ${toolContext}, there is no automatic connection between taking in a request, scheduling the work, and sending the invoice.`
        : signals.schedulingIsManual
          ? `Scheduling and dispatch are done by hand, which means things fall through the cracks. Work gets finished but the invoice does not go out right away, which slows down cash flow.`
          : signals.highAdminBurden
            ? `The team spends 15+ hours per week on admin work that follows the same pattern every time — entering data, updating statuses, and moving information between ${toolContext}.`
            : `The daily work follows a predictable pattern, but each step still has to be done by hand. Every time someone has to stop and do a routine step manually, it slows things down and introduces mistakes.`;

      if (aboveBaseline) {
        rec = {
          recommendationTitle: "Put Your Operational Know-How to Work Automatically",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "projects", label: "Claude Projects" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Your operations are already stronger than most businesses your size. Claude Projects keeps your procedures, how-to guides, and process notes in one place so anyone on the team can get answers without asking the owner. Make moves information between your tools automatically — when a job is done, the invoice goes out and the follow-up gets scheduled without anyone doing it by hand.",
          aiApproach: [
            "Add your most important process documents and how-to guides into a Claude Project",
            "When someone has a question about how to handle a situation, they ask the Project instead of interrupting you",
            "Set up Make so the routine steps (job done → invoice → follow-up) happen on their own",
          ],
          expectedResult: "Your team gets answers about how things work without waiting on one person. The routine steps that used to require someone to remember and act now happen automatically.",
          planFit: isHigh
            ? { level: "Max", rationale: "Your team is ready for heavy daily use across multiple areas. Max gives you longer conversations and higher limits for working with large documents." }
            : { level: "Pro", rationale: "Claude Projects keeps your process documents available for the whole team to use on an ongoing basis. That requires a Pro account." },
          startHere: [
            { step: "Open Claude chat and describe a recent situation where someone had to ask you how to handle something", url: "https://claude.ai" },
            { step: "Create a Project and add your top 5 process documents or how-to guides", url: "https://claude.ai/projects" },
            { step: "Connect your job management tool to Make so completed jobs trigger the next steps automatically", url: "https://www.make.com/en/integrations" },
          ],
        };
      } else if (signals.intakeIsManual) {
        // O2 — Claude chat led: customer message reading + response
        rec = {
          recommendationTitle: "Handle Customer Inquiries Faster with AI",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Claude chat can read a customer message, figure out what kind of request it is, and write a reply — all in one step. Make connects this to your email and calendar so the whole process runs without you doing it by hand each time.",
          aiApproach: [
            "Paste a customer inquiry into Claude chat — it writes a response you can review and send",
            "Once you trust the output, connect Make so new inquiries get a drafted response automatically",
            "Set up Make to send the response through your email and add the job to your calendar",
          ],
          expectedResult: "Customers hear back in minutes instead of hours. Every inquiry gets a professional, consistent response. Your team stops spending time sorting through messages one by one.",
          planFit: isLow
            ? { level: "Free", rationale: "Start free. Paste a few real customer messages into Claude chat and see if the responses save you time before you pay for anything." }
            : { level: "Pro", rationale: "You will use this every day for incoming messages. Pro gives you the volume you need and lets you save your response instructions in a Project." },
          startHere: [
            { step: "Open Claude chat and paste a real customer inquiry — ask it to write a response", url: "https://claude.ai" },
            { step: "Save your response instructions as a Claude Project so every reply follows the same approach", url: "https://claude.ai/projects" },
            { step: "Connect your email to Make so new messages get drafted responses automatically", url: "https://www.make.com/en/integrations/gmail" },
          ],
        };
      } else if (signals.schedulingIsManual) {
        // O3 — Make led: scheduling, dispatch, and invoicing triggers
        rec = {
          recommendationTitle: "Automate What Happens After Each Job",
          operationalProblem: problem,
          primaryCapability: { name: "Make", product: "make", label: "Make" },
          secondaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          whyThisFits: `The core problem is timing — work gets finished but the next steps do not happen automatically. Make watches for triggers in ${toolContext} (job marked complete, new request comes in) and kicks off the next step: send the invoice, schedule the follow-up, notify the customer. Claude chat helps where a message needs to be written or a decision needs to be made.`,
          aiApproach: [
            "Map out the steps that should happen after a job is scheduled or completed — which ones could be triggered automatically?",
            "Build a Make scenario that watches for completed jobs and triggers the invoice and follow-up",
            "Add Claude chat as a step where the workflow needs to write a customer message or make a judgment call",
          ],
          expectedResult: "Invoices go out the same day the work is done. Follow-ups happen on schedule without anyone remembering to send them. The gap between finishing work and getting paid shrinks.",
          planFit: isLow
            ? { level: "Free", rationale: "Start free with Make's trial and Claude's free tier. Get one scheduling automation running before you pay for anything." }
            : { level: "Pro", rationale: "Running scheduling automations daily with Claude writing customer messages requires a Pro account." },
          startHere: [
            { step: "Create a Make account and look at the connectors for your scheduling and invoicing tools", url: "https://www.make.com/en/register" },
            { step: "Build your first scenario: when a job is marked complete, send the invoice automatically", url: "https://www.make.com/en/integrations" },
            { step: "Open Claude chat and ask it to write a follow-up message template for completed jobs", url: "https://claude.ai" },
          ],
        };
      } else if (signals.highAdminBurden) {
        // O4 — Make led: data movement between tools
        rec = {
          recommendationTitle: "Stop Moving Data Between Tools by Hand",
          operationalProblem: problem,
          primaryCapability: { name: "Make", product: "make", label: "Make" },
          secondaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          whyThisFits: `With 15+ hours a week going to admin, the biggest win is not writing better — it is moving data between ${toolContext} automatically. Make watches for changes in one tool and updates the others without anyone touching it. Claude chat steps in when the workflow needs to read something, categorize it, or write a summary.`,
          aiApproach: [
            `List the top 3 places where you copy data from one tool to another by hand (for example: job management → invoicing → email)`,
            "Build a Make scenario that connects the first two tools so data flows when something changes",
            "Add Claude chat as a step where the workflow needs to read, summarize, or categorize information",
          ],
          expectedResult: "The 15+ hours of admin work drops significantly because data moves between tools without anyone doing it by hand. Your team stops doing data entry and starts doing the work that actually needs a person.",
          planFit: isLow
            ? { level: "Free", rationale: "Start free. Build one Make scenario connecting your two most-used tools before paying for anything." }
            : { level: "Pro", rationale: "Running multiple automations daily with Claude handling the thinking steps requires a Pro account." },
          startHere: [
            { step: "Create a Make account and check which of your tools have ready-made connectors", url: "https://www.make.com/en/register" },
            { step: "Build your first scenario: connect the two tools you copy data between most often", url: "https://www.make.com/en/integrations" },
            { step: "Open Claude chat and describe the admin tasks that take the most time — ask it to help prioritize what to automate next", url: "https://claude.ai" },
          ],
        };
      } else {
        // O5 — Claude chat only: plan before building
        rec = {
          recommendationTitle: "Figure Out What to Automate First",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: null,
          whyThisFits: "Before connecting tools or building anything, the first step is figuring out which task is worth automating. Claude chat helps you think through your daily routine, identify the biggest time sinks, and plan the first automation step by step — no setup required.",
          aiApproach: [
            "Open Claude chat and describe your daily routine — ask it to identify which tasks follow a repeatable pattern",
            "Pick the one that takes the most time and ask Claude chat to outline how you would automate it",
            "Try the first step by hand using Claude chat before investing in any tools or setup",
          ],
          expectedResult: "You have a clear picture of which task to automate first and a step-by-step plan for how to do it — tested with Claude chat before you commit to anything.",
          planFit: isLow
            ? { level: "Free", rationale: "Start free. Use Claude chat to plan your first automation before paying for anything." }
            : { level: "Pro", rationale: "Once you start using Claude chat daily to plan and manage automations, Pro gives you the room for that." },
          startHere: [
            { step: "Open Claude chat and describe the task you repeat most often — ask it to break down how to automate it", url: "https://claude.ai" },
            { step: "Try the first step manually using Claude chat — does the output match what you would have done by hand?", url: "https://claude.ai" },
            { step: "When you are ready to connect tools, create a Make account", url: "https://www.make.com/en/register" },
          ],
        };
      }
      break;
    }

    case "sales": {
      const problem = signals.salesIsReactive
        ? `The business waits for customers to reach out and does not have a way to follow up. If someone does not buy on the first conversation, they are usually lost because nobody goes back to them.`
        : signals.salesIsBasic
          ? `There is some follow-up, but it is inconsistent. Between day 2 and day 10 after first contact, leads go quiet because there is no system sending messages on a schedule. Every follow-up depends on someone remembering to do it.`
          : signals.narrowAcquisition
            ? `New customers come from ${signals.acquisitionChannels.length <= 1 ? "one main source" : "a small number of sources"}. When that source slows down, revenue slows with it. There is no backup.`
            : `The sales process has some structure, but the important moments — following up after a quote, asking for a review, reaching back out to someone who went quiet — still depend on someone doing it by hand.`;

      if (aboveBaseline) {
        rec = {
          recommendationTitle: "Use AI to Win More of the Right Jobs",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "projects", label: "Claude Projects" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Your sales process is already stronger than most businesses your size. Claude Projects keeps your pricing, past proposals, and notes about what worked and what didn't in one place. Before you write a proposal, you ask the Project — it tells you how to position the deal based on what has actually won before. Make pulls in new leads automatically so you always have fresh information to work with.",
          aiApproach: [
            "Add your pricing, service descriptions, and notes from recent wins and losses into a Claude Project",
            "Before writing a proposal, ask the Project what approach is most likely to win based on your history",
            "Set up Make to pull new lead information into a weekly summary that Claude can review for you",
          ],
          expectedResult: "Your proposals get stronger because they are based on what has actually worked, not just memory. You spot opportunities to sell more to existing customers. New leads get reviewed consistently every week.",
          planFit: isHigh
            ? { level: "Max", rationale: "Your team is ready to use this across multiple deals every day. Max gives you longer conversations and higher limits for working with large proposals and sales data." }
            : { level: "Pro", rationale: "Keeping your sales history and pricing in a Project and using it regularly requires a Pro account." },
          startHere: [
            { step: "Open Claude chat and paste a recent proposal — ask it to point out what is strongest and what could be better", url: "https://claude.ai" },
            { step: "Create a Sales Project with your pricing, notes from past wins and losses, and a description of your ideal customer", url: "https://claude.ai/projects" },
            { step: "Set up a weekly Make scenario that pulls new lead data for Claude to review", url: "https://www.make.com/en/integrations" },
          ],
        };
      } else if (signals.salesIsReactive) {
        rec = {
          recommendationTitle: "Stop Losing Leads After First Contact",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Claude chat writes follow-up messages, quote reminders, and review requests — each one written for the specific customer and job. Make sends them on a schedule so they go out without anyone having to remember.",
          aiApproach: [
            "Paste a recent quote or inquiry into Claude chat — it writes a follow-up sequence (day 1, day 3, day 7)",
            "Review the messages and adjust the tone, then set up Make to send them automatically through Gmail",
            "After completed work, use Claude chat to write a review request for that specific customer",
          ],
          expectedResult: "Every lead gets followed up on, on time, every time. Review requests go out after every job. You stop losing deals just because no one remembered to send the second message.",
          planFit: isLow
            ? { level: "Free", rationale: "Start free. Use Claude chat on a few real follow-up messages first. If it helps you respond faster and more consistently, move up to Pro." }
            : { level: "Pro", rationale: "Writing follow-ups for multiple leads every day adds up. Pro gives you the volume and lets you save your templates in a Project." },
          startHere: [
            { step: "Open Claude chat and paste a recent customer inquiry — ask it to write a 3-message follow-up sequence", url: "https://claude.ai" },
            { step: "Save your follow-up templates as a Claude Project so the tone stays consistent", url: "https://claude.ai/projects" },
            { step: "Connect Gmail to Make so follow-ups go out on a schedule without you sending them", url: "https://www.make.com/en/integrations/gmail" },
          ],
        };
      } else if (signals.salesIsBasic) {
        // S3 — Make led: follow-up timing and scheduling
        rec = {
          recommendationTitle: "Put Your Follow-Ups on Autopilot",
          operationalProblem: problem,
          primaryCapability: { name: "Make", product: "make", label: "Make" },
          secondaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          whyThisFits: "Your team already does some follow-up — the problem is consistency and timing. Make sends messages on a schedule so every lead gets followed up at the right time, automatically. Claude chat writes the messages so they sound personal, not like a mass email.",
          aiApproach: [
            "Use Claude chat to write a set of follow-up messages for common situations — after a quote, after a job, after a stalled conversation",
            "Set up Make to send the right message at the right time: day 2 after a quote, day 7 if no response, day 14 for a final check-in",
            "After completed work, Make triggers a review request written by Claude chat — specific to that customer and job",
          ],
          expectedResult: "Follow-ups go out on time, every time, without anyone remembering to send them. Leads that used to go quiet between day 2 and day 10 now get consistent contact. Your team focuses on closing, not on chasing.",
          planFit: { level: "Pro", rationale: "Sending follow-ups daily with Claude writing personalized messages requires a Pro account." },
          startHere: [
            { step: "Create a Make account and connect your email (Gmail or Outlook)", url: "https://www.make.com/en/register" },
            { step: "Build your first scenario: when a quote is sent, schedule a follow-up email for 3 days later", url: "https://www.make.com/en/integrations" },
            { step: "Open Claude chat and write the follow-up message templates — one for day 3, one for day 7, one for day 14", url: "https://claude.ai" },
          ],
        };
      } else if (signals.narrowAcquisition) {
        // S4 — Claude Projects led: market research and channel diversification
        rec = {
          recommendationTitle: "Find New Ways to Reach Customers",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "projects", label: "Claude Projects" },
          secondaryCapability: null,
          whyThisFits: `You are relying on ${signals.acquisitionChannels?.length <= 1 ? "one main source" : "a small number of sources"} for new customers. Claude Projects keeps your customer data, your market context, and your acquisition history in one place. You ask it where the best opportunities are and what channels you should test next — based on your actual numbers, not guessing.`,
          aiApproach: [
            "Create a Claude Project with your customer list, where each customer came from, and their value to the business",
            "Ask the Project which customer types are most profitable and where they came from — look for patterns",
            "Ask Claude to research 2-3 new channels that fit your best customer profile and outline a simple test for each",
          ],
          expectedResult: "You have a clear picture of where your best customers come from and a plan to test new channels. Revenue becomes less dependent on a single source.",
          planFit: { level: "Pro", rationale: "Keeping your customer and market data in a Project for ongoing analysis requires a Pro account." },
          startHere: [
            { step: "Create a Claude Project and upload your customer list — include where each one came from if you can", url: "https://claude.ai/projects" },
            { step: "Ask the Project which customers are most profitable and what they have in common", url: "https://claude.ai/projects" },
            { step: "Ask Claude to suggest 2-3 new channels that match your best customer profile", url: "https://claude.ai" },
          ],
        };
      } else {
        // S5 — Claude chat + Make: touchpoint consistency
        rec = {
          recommendationTitle: "Make Every Customer Touchpoint Consistent",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Claude chat writes the messages — follow-ups, proposals, review requests, check-ins — each one written for that specific customer. Make sends them at the right time so nothing gets forgotten.",
          aiApproach: [
            "Use Claude chat to write follow-up messages after quotes, completed work, and conversations that stalled",
            "Save your service descriptions and the way you like to sound in a Claude Project so every message matches your voice",
            "Connect Make to send these messages automatically when a quote has been sitting or a job was just finished",
          ],
          expectedResult: "Customers hear from you at every stage — after the quote, after the job, and when it is time to come back. Communication stays professional without anyone spending hours writing messages.",
          planFit: { level: "Pro", rationale: "Writing customer messages regularly and keeping your brand voice saved in a Project requires a Pro account." },
          startHere: [
            { step: "Open Claude chat and describe a deal that went quiet — ask it to write a message to re-open the conversation", url: "https://claude.ai" },
            { step: "Create a Project with your service list and the way you like to sound in messages", url: "https://claude.ai/projects" },
            { step: "Set up Make to send a follow-up automatically when a quote has been open for 3+ days", url: "https://www.make.com/en/integrations" },
          ],
        };
      }
      break;
    }

    case "data": {
      const problem = signals.noConsistentTracking
        ? `There is no regular way to see how the business is doing. Decisions are based on gut feel instead of numbers. If someone wants a report, they have to pull the data together by hand.`
        : signals.tracksWithSpreadsheets
          ? `The numbers live in spreadsheets that someone has to update by hand. By the time anyone looks at them, they are usually out of date. There is no automatic way to keep the reports fresh.`
          : signals.tracksWithAccounting
            ? `Financial data comes through ${clientTools.includes("QuickBooks") ? "QuickBooks" : "accounting software"}, but other numbers — jobs, sales activity, customer pipeline — are tracked separately or not at all. You can see revenue, but not what is driving it.`
            : signals.highAdminBurden
              ? `More than 15 hours a week goes to reporting, data entry, and pulling numbers together. The data is there, but getting it into a useful format is the problem.`
              : `Data lives in several different tools but none of them talk to each other. Getting a clear picture of how the business is doing means logging into multiple systems and putting the pieces together by hand.`;

      if (aboveBaseline) {
        rec = {
          recommendationTitle: "See What Is Coming, Not Just What Happened",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "projects", label: "Claude Projects" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Your data tracking is already better than most businesses your size. Claude Projects keeps your key numbers, targets, and past results in one place. Each week you paste in fresh numbers and it tells you what changed, what looks off, and what to pay attention to. Make pulls the numbers from your tools automatically so you do not have to export them yourself.",
          aiApproach: [
            "Add your key metrics, targets, and recent results into a Claude Project",
            "Each week, paste updated numbers and ask the Project what changed and what to watch",
            "Set up Make to pull weekly data from your tools automatically so the numbers are always ready",
          ],
          expectedResult: "You stop compiling reports by hand and start getting told what matters. Problems show up earlier because you are looking at patterns, not just last month's totals.",
          planFit: isHigh
            ? { level: "Max", rationale: "Your team reviews data frequently and works with large exports. Max gives you the longer conversations and higher limits for heavy analytical work." }
            : { level: "Pro", rationale: "Reviewing your numbers regularly with saved context in a Project requires a Pro account." },
          startHere: [
            { step: "Open Claude chat and paste last month's key numbers — ask it what stands out", url: "https://claude.ai" },
            { step: "Create a Project with your key metrics and targets so it can compare week to week", url: "https://claude.ai/projects" },
            { step: "Set up Make to pull your weekly numbers from your tools automatically", url: "https://www.make.com/en/integrations" },
          ],
        };
      } else if (signals.noConsistentTracking) {
        // No tracking at all — start with Claude chat to prove data analysis value
        rec = {
          recommendationTitle: "Start Seeing Your Numbers Clearly",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: null,
          whyThisFits: "Claude chat can read whatever data you have — an exported report, a list of numbers, even a photo of a whiteboard — and tell you what it means in plain language. The first step is getting in the habit of looking at your numbers every week. Automation comes later.",
          aiApproach: [
            "Export your most important data (revenue, jobs completed, open quotes) and paste it into Claude chat — ask for a plain-language summary",
            "Ask Claude chat which 3-5 numbers matter most for a business like yours and how to start tracking them",
            "Do this weekly until it becomes a habit, then add Make to collect the data for you automatically",
          ],
          expectedResult: "For the first time, you have a regular view of how the business is actually doing. Decisions start coming from real numbers instead of gut feel. The habit comes first — the tools follow.",
          planFit: { level: "Free", rationale: "Start free. The first step is building the habit of looking at your numbers every week. You can upgrade once you are doing it regularly." },
          startHere: [
            { step: "Open Claude chat and paste your last week's revenue numbers — ask what they tell you", url: "https://claude.ai" },
            { step: "Ask Claude chat which numbers matter most for your industry and size", url: "https://claude.ai" },
            { step: "Bookmark Claude chat and paste your numbers in again next week — the habit is the first step", url: "https://claude.ai" },
          ],
        };
      } else if (signals.tracksWithSpreadsheets) {
        // Has spreadsheets — bridge to automated pipeline
        rec = {
          recommendationTitle: "Get Your Spreadsheets Working for You Automatically",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Claude chat can read your spreadsheets and tell you what matters faster than you can do it by hand. Make pulls fresh numbers from your tools on a schedule so your spreadsheets stay up to date without anyone manually updating them.",
          aiApproach: [
            "Upload your current spreadsheet to Claude chat — ask it to summarize what stands out and flag anything unusual",
            "Ask Claude chat which parts of your reporting you could stop doing by hand",
            "Set up a Make scenario that pulls data from your tools weekly and puts it in a format Claude can read",
          ],
          expectedResult: "You stop spending hours updating spreadsheets by hand. Your numbers are always current. What used to take a morning of work now takes a few minutes of review.",
          planFit: { level: "Pro", rationale: "Uploading spreadsheets and reviewing data regularly requires a Pro account. You can also save your reporting setup in a Project." },
          startHere: [
            { step: "Open Claude chat and upload your most important spreadsheet — ask what stands out", url: "https://claude.ai" },
            { step: "Save your reporting definitions as a Claude Project so the analysis stays consistent week to week", url: "https://claude.ai/projects" },
            { step: "Create a Make account to start pulling data from your tools automatically", url: "https://www.make.com/en/register" },
          ],
        };
      } else {
        rec = {
          recommendationTitle: "Bring Your Numbers Together in One Place",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "projects", label: "Claude Projects" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: `Claude Projects keeps your business context, the numbers you care about, and what you have seen in the past all in one place. When you paste in fresh data from ${clientTools.includes("QuickBooks") ? "QuickBooks" : "your accounting tools"}, the Project compares it to what it already knows and tells you what is different. Make connects your tools so the data flows in without you pulling it by hand.`,
          aiApproach: [
            `Export data from ${clientTools.includes("QuickBooks") ? "QuickBooks" : "your main system"} and paste it into your Claude Project — ask a question about how the business is doing`,
            "Ask the Project to compare your financial data against your operational numbers — what is driving revenue, where money is leaking",
            "Set up Make to pull data from your tools automatically every week so it is ready when you need it",
          ],
          expectedResult: "For the first time, your financial numbers and your operational numbers are analyzed side by side. You see not just what happened, but why. The data shows up automatically instead of you pulling it by hand.",
          planFit: { level: "Pro", rationale: "Keeping your business context in a Project and reviewing data regularly requires a Pro account." },
          startHere: [
            { step: `Open Claude chat and paste a ${clientTools.includes("QuickBooks") ? "QuickBooks" : "financial"} export — ask what stands out`, url: "https://claude.ai" },
            { step: "Create a Project with your business context and key numbers so the analysis gets better over time", url: "https://claude.ai/projects" },
            { step: `Connect ${clientTools.includes("QuickBooks") ? "QuickBooks" : "your accounting tool"} to Make so weekly exports happen automatically`, url: clientTools.includes("QuickBooks") ? "https://www.make.com/en/integrations/quickbooks" : "https://www.make.com/en/integrations" },
          ],
        };
      }
      break;
    }

    case "content": {
      const problem = signals.knowledgeInHeads
        ? `Important business knowledge lives in people's heads. When someone is out sick, on vacation, or leaves, that knowledge goes with them. There is no written system for how things work.`
        : signals.knowledgeUnstructured
          ? `Files and documents exist but they are scattered across shared drives with no real organization. Finding the right document takes longer than it should. Bringing on new team members is slow because nothing is in one place.`
          : signals.contentNone || signals.contentAdHoc
            ? `Marketing content — social posts, case studies, email campaigns — gets produced inconsistently or not at all. When it does happen, it takes a lot of time for each piece.`
            : `Content gets written one piece at a time by hand. There is no way to turn the work you already do (job photos, customer feedback, project results) into marketing without starting from scratch each time.`;

      const isLargerTeam = signals.teamSize && signals.teamSize !== "Just me" && signals.teamSize !== "1 to 5";

      if (aboveBaseline && signals.knowledgeOrganized) {
        // C1 — Strong content + organized knowledge → scale production
        rec = {
          recommendationTitle: "Produce More Content Without Hiring Anyone",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "projects", label: "Claude Projects" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Your content is already better organized than most businesses your size. Claude Projects keeps your brand voice, your best past content, and your messaging notes in one place. When you ask it to write something new — a blog post, a social update, an email — it sounds like you from the start. Make handles the posting schedule so drafts get reviewed and published without extra work.",
          aiApproach: [
            "Add your brand voice notes, your best past content, and your customer testimonials into a Claude Project",
            "Use the Project to write new content — blog posts, social updates, emails — in your established voice",
            "Set up Make to move finished drafts into your review queue and schedule them for publishing",
          ],
          expectedResult: "You put out more content without adding staff. Everything sounds consistent because it all draws from the same source. Publishing happens on schedule instead of whenever someone remembers.",
          planFit: isHigh
            ? { level: "Max", rationale: "Your team produces content frequently and works with large documents. Max gives you the longer conversations and higher limits needed for daily production." }
            : { level: "Pro", rationale: "Producing content regularly with your brand voice saved in a Project requires a Pro account." },
          startHere: [
            { step: "Open Claude chat and paste your best-performing post or email — ask it what made it work", url: "https://claude.ai" },
            { step: "Create a Project with your voice guidelines, sample content, and key messages", url: "https://claude.ai/projects" },
            { step: "Set up Make to move drafts into your review and publishing workflow", url: "https://www.make.com/en/integrations" },
          ],
        };
      } else if (signals.knowledgeInHeads && isLargerTeam) {
        // C2a — Claude Cowork: team knowledge capture for larger teams
        rec = {
          recommendationTitle: "Get Your Team's Knowledge Written Down — Together",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "cowork", label: "Claude Cowork" },
          secondaryCapability: null,
          whyThisFits: "With a team of 6 or more, the knowledge is not just in one person's head — it is scattered across the whole team. Claude Cowork lets multiple people work with Claude at the same time on the same document. Each person describes how their part of the business works, and Claude turns it all into organized documentation that anyone can search and use.",
          aiApproach: [
            "Start a Claude Cowork session with your team — each person describes the processes they own",
            "Claude combines everyone's input into step-by-step guides, organized by department or function",
            "Review the documentation as a team, fill in gaps, and publish it as your internal reference",
          ],
          expectedResult: "What used to live only in people's heads is now written down in one place. New hires get up to speed faster. No single person is the only one who knows how something works.",
          planFit: { level: "Pro", rationale: "Claude Cowork with your team for ongoing documentation work requires a Pro account." },
          startHere: [
            { step: "Open Claude Cowork and invite 1-2 team members to describe how one key process works", url: "https://claude.ai" },
            { step: "Ask Claude to organize the descriptions into a step-by-step guide with common questions answered", url: "https://claude.ai" },
            { step: "Create a Claude Project to store the finished documentation so anyone can search it later", url: "https://claude.ai/projects" },
          ],
        };
      } else if (signals.knowledgeInHeads) {
        rec = {
          recommendationTitle: "Get What You Know Out of Your Head and Into a System",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "projects", label: "Claude Projects" },
          secondaryCapability: null,
          whyThisFits: "Claude Projects works like a living reference guide for your business. You describe how things work — your processes, your rules, what to do when something goes wrong — and Claude organizes it into clear documentation. After that, anyone on the team can ask the Project a question and get the answer instead of interrupting you.",
          aiApproach: [
            "Start a Claude Project and describe your top 5 processes — how they work, who does what, and what goes wrong",
            "Ask Claude to turn those descriptions into step-by-step guides and common-question lists",
            "When a team member has a question about how to do something, they ask the Project instead of coming to you",
          ],
          expectedResult: "What used to live only in your head is now written down and available to the whole team. New people get up to speed faster. You stop being the only person who knows how things work.",
          planFit: { level: "Pro", rationale: "Building a knowledge base you use regularly and your team relies on requires a Pro account." },
          startHere: [
            { step: "Open Claude chat and describe how your most important process works — ask it to turn it into a step-by-step guide", url: "https://claude.ai" },
            { step: "Create a Knowledge Base Project and add your top processes one at a time", url: "https://claude.ai/projects" },
            { step: "Have a team member ask the Project a real question to see if it gives a useful answer", url: "https://claude.ai/projects" },
          ],
        };
      } else if (signals.knowledgeUnstructured) {
        // Messy shared drives → structure first, content second
        rec = {
          recommendationTitle: "Turn Your Messy Files into Answers Your Team Can Find",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "projects", label: "Claude Projects" },
          secondaryCapability: null,
          whyThisFits: "Claude Projects can read your existing documents and turn them into something your team can actually search. Instead of digging through folders trying to find the right file, your team asks the Project a question and gets the answer — plus a pointer to where the information lives.",
          aiApproach: [
            "Create a Claude Project and upload the documents your team asks about most often",
            "Ask Claude to make a list of what each document covers and what is missing",
            "Start using the Project as the first place anyone goes when they need to find something",
          ],
          expectedResult: "Finding information goes from a 10-minute dig through folders to a 30-second question. Your team stops wasting time looking for files. You can see where your documentation has gaps.",
          planFit: { level: "Pro", rationale: "Uploading documents and keeping a searchable knowledge base going requires a Pro account." },
          startHere: [
            { step: "Open Claude chat and describe the question your team wastes the most time trying to answer", url: "https://claude.ai" },
            { step: "Create a Knowledge Base Project and upload the 10 documents your team uses most", url: "https://claude.ai/projects" },
            { step: "Ask the Project a real question that usually takes 10+ minutes to track down — compare the speed", url: "https://claude.ai/projects" },
          ],
        };
      } else if (signals.contentNone) {
        // No content at all — start with Claude chat, prove the concept
        rec = {
          recommendationTitle: "Start Getting Your Work Out There",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: null,
          whyThisFits: "Claude chat can write a social post, a case study, or a customer email from just a few sentences about what you did. What used to take an hour of writing takes five minutes of review. You do not need a content plan to start — just one finished job and a description of what happened.",
          aiApproach: [
            "After a completed job, open Claude chat and describe what you did — ask it to write a social media post",
            "Ask Claude chat to write a review request email you can send to the customer",
            "Once you have 3-5 posts, ask Claude chat to sketch out a simple content calendar for next month",
          ],
          expectedResult: "You go from posting nothing to posting regularly — without hiring a marketer or spending hours writing. Every job becomes a piece of marketing.",
          planFit: isLow
            ? { level: "Free", rationale: "Start free. Write your first few posts with Claude chat to see how it works before paying for anything." }
            : { level: "Pro", rationale: "Once you are writing content weekly, Pro gives you the room for that and lets you save your voice in a Project." },
          startHere: [
            { step: "Open Claude chat and describe your most recent completed job — ask it to write a social post and a review request email", url: "https://claude.ai" },
            { step: "Adjust the tone, then post it — notice how much faster that was than writing it yourself", url: "https://claude.ai" },
            { step: "Save the way you like to sound in a Claude Project so future posts match your voice", url: "https://claude.ai/projects" },
          ],
        };
      } else {
        // Ad-hoc or dedicated content — systematize with Projects + Make
        rec = {
          recommendationTitle: "Turn Every Finished Job into Marketing",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Claude chat takes what you already have — job photos, completion notes, customer feedback — and turns it into a finished social post, case study, or review request. A photo and two sentences become a ready-to-post piece. Make moves the finished content where it needs to go so you do not have to do it by hand.",
          aiApproach: [
            "After each completed job, paste your notes and photos into Claude chat — it writes a social post and a review request",
            "Save the way you like to sound and your content templates in a Claude Project so everything stays consistent",
            "Set up Make to send completed job information to Claude automatically and put the drafts in your review queue",
          ],
          expectedResult: "Content gets produced as a side effect of doing the work, not as a separate task. You go from sporadic posting to consistent output. Each finished job creates marketing for the next one.",
          planFit: { level: "Pro", rationale: "Writing content regularly and keeping your brand voice saved in a Project requires a Pro account." },
          startHere: [
            { step: "Open Claude chat and describe a recently completed job — ask it to write a social media post", url: "https://claude.ai" },
            { step: "Create a Project with the way you like to sound and any templates you use", url: "https://claude.ai/projects" },
            { step: "Set up Make to send completed job info to Claude and put drafts in your review queue", url: "https://www.make.com/en/integrations" },
          ],
        };
      }
      break;
    }

    case "technology": {
      const problem = signals.techResistant
        ? `The team does not want more technology. The tools you have are not fully used. Anything new has to be invisible — no new dashboards, no new logins, no learning curve.`
        : signals.techCautious
          ? `The team is open to trying new tools but cautious. New things work best when they fit into how people already work instead of asking them to change. Past attempts at new tools have had mixed results.`
          : signals.aiNone
            ? `The business has not tried AI. The team may not know what AI can actually do for a business like this, or they may think it is more complicated than it is.`
            : signals.aiExperimented
              ? `The team has tried AI a few times but has not made it part of the daily routine. There is interest, but no regular habit yet.`
              : `The tools you use are fine, but they do not talk to each other. Each one works on its own, and information does not move between them automatically.`;

      if (aboveBaseline && isHigh) {
        // High readiness + above baseline → advanced: Projects + Make
        rec = {
          recommendationTitle: "Run Your Business from One Place Instead of Many",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "projects", label: "Claude Projects" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: "Your team is already comfortable with technology and ready for more. Claude Projects gives you one place to ask questions about your data, write content, and check on how things are running — instead of logging into five different tools. Make moves the information between those tools automatically so everything stays in sync.",
          aiApproach: [
            "Create a Claude Project for each area of the business — sales, operations, content",
            "Set up Make to pull data from all your connected tools and keep it flowing into your Projects",
            "Every week, ask Claude to review the numbers and write a summary of what matters and what to do next",
          ],
          expectedResult: "Instead of logging into multiple tools to figure out how the business is doing, you ask one place and get the answer. Decisions happen faster because the analysis is already done.",
          planFit: { level: "Max", rationale: "Using multiple Projects with large documents every day across your team gets the most out of Max, which gives you longer conversations and higher limits." },
          startHere: [
            { step: "Open Claude chat and ask it how your current tools could work together better", url: "https://claude.ai" },
            { step: "Create a Project for the area of your business that needs the most attention right now", url: "https://claude.ai/projects" },
            { step: "Build a Make scenario connecting your two most-used tools so data flows between them", url: "https://www.make.com/en/integrations" },
          ],
        };
      } else if (aboveBaseline) {
        // Above baseline but not high readiness → Make-led integration focus
        rec = {
          recommendationTitle: "Get Your Tools Talking to Each Other",
          operationalProblem: `Your technology is solid, but ${toolContext} each work on their own. The opportunity is connecting what you already have so information flows between tools automatically.`,
          primaryCapability: { name: "Make", product: "make", label: "Make" },
          secondaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          whyThisFits: "Your tools are good. The problem is they do not talk to each other. Make connects them so information moves between tools automatically — no new apps to learn, no new logins. Claude chat helps where the workflow needs someone to read something, make a decision, or write a response.",
          aiApproach: [
            "List which of your tools need to share information with each other — find the top 3 places where you copy data by hand",
            "Build a Make scenario connecting your two busiest tools so data flows between them automatically",
            "Add Claude chat as a step where the workflow needs a decision, a summary, or something written",
          ],
          expectedResult: "Your tools start working as one system instead of separate pieces. You stop copying information between them by hand. Your team keeps using the tools they already know.",
          planFit: { level: "Pro", rationale: "Connecting multiple tools with Claude doing the thinking steps is daily work. Pro gives you the access for that." },
          startHere: [
            { step: "Create a Make account and look at what integrations are available for your tools", url: "https://www.make.com/en/register" },
            { step: "Build your first scenario: connect your two most-used tools with a simple trigger and action", url: "https://www.make.com/en/integrations" },
            { step: "Open Claude chat and describe something that is hard to connect — ask it to help you figure out the workflow", url: "https://claude.ai" },
          ],
        };
      } else if (signals.techResistant || signals.aiNone) {
        rec = {
          recommendationTitle: "Try AI on One Real Task — No Setup Required",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: null,
          whyThisFits: "Claude chat works like a text conversation — no software to install, no dashboard to learn, no training needed. You type what you need in plain English and it gives you a useful result. This is the easiest way to see what AI can do without asking anyone to change how they work.",
          aiApproach: [
            "Pick one task your team does every week — writing a customer email, summarizing a job, drafting a document",
            "Do it in Claude chat instead — compare the result to doing it by hand",
            "If it works well, try a second task. Build confidence before adding anything else",
          ],
          expectedResult: "Your team sees firsthand that AI can do useful work. It feels like typing, not like learning new software. That experience makes the next step much easier.",
          planFit: { level: "Free", rationale: "Start free. No commitment. Upgrade only after your team sees it work on a real task." },
          startHere: [
            { step: "Open Claude chat and type something you would normally do by hand — a customer email, a job summary, a status update", url: "https://claude.ai" },
            { step: "Try a different task the next day — notice what Claude chat does well", url: "https://claude.ai" },
            { step: "Show a team member and let them try their own task", url: "https://claude.ai" },
          ],
        };
      } else {
        // Cautious or experimented — Claude chat + Make, building toward regular use
        rec = {
          recommendationTitle: "Connect the Tools You Already Use",
          operationalProblem: problem,
          primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
          secondaryCapability: { name: "Make", product: "make", label: "Make" },
          whyThisFits: `Your team already uses ${toolContext}, but each one works on its own. Make connects them so information moves between tools automatically. Claude chat helps where the workflow needs reading, writing, or a decision. Together they turn separate tools into one system.`,
          aiApproach: [
            "Figure out where information gets stuck between your tools — what do you end up copying or re-entering by hand?",
            "Build one Make scenario connecting your two busiest tools, with Claude chat handling the steps that need thinking or writing",
            "Once the first connection works, add the next pair of tools",
          ],
          expectedResult: "Your tools start working together instead of separately. You stop copying data between systems by hand. Your team keeps using what they know while Make and Claude handle the connections.",
          planFit: { level: "Pro", rationale: "Connecting your tools and using Claude for the thinking steps is regular work. Pro gives you the daily access for that." },
          startHere: [
            { step: "Open Claude chat and describe which of your tools need to share information — ask it to help plan the connections", url: "https://claude.ai" },
            { step: "Create a Make account and look at what integrations exist for your tools", url: "https://www.make.com/en/register" },
            { step: "Build your first scenario: connect your two most-used tools with a simple trigger and action", url: "https://www.make.com/en/integrations" },
          ],
        };
      }
      break;
    }

    default:
      rec = {
        recommendationTitle: "Start Using AI on Your Most Repetitive Work",
        operationalProblem: "There are tasks in this area that follow the same pattern every time. AI can take over the repetitive parts.",
        primaryCapability: { name: "Claude", product: "chat", label: "Claude chat" },
        secondaryCapability: { name: "Make", product: "make", label: "Make" },
        whyThisFits: "Claude chat does the thinking and writing — reading information, deciding what matters, drafting the output. Make moves data between your tools so work does not get stuck.",
        aiApproach: [
          "Find the task in this area that takes the most time and follows the same pattern",
          "Try it in Claude chat to see if AI does a good job with the core work",
          "Build a Make scenario to trigger and deliver the work automatically",
        ],
        expectedResult: "The repetitive work takes less time and comes out more consistent. You focus on the parts that actually need a person.",
        planFit: { level: "Pro", rationale: "Using this regularly requires a Pro account for the daily volume." },
        startHere: [
          { step: "Open Claude chat and describe the biggest time sink in this area", url: "https://claude.ai" },
          { step: "Ask Claude chat to outline how to automate it step by step", url: "https://claude.ai" },
          { step: "Create a Make account to start connecting your tools", url: "https://www.make.com/en/register" },
        ],
      };
  }

  return rec;
}

// ── 11. Engine Entry Point ──────────────────────────────────────
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

  // Category tool recommendations (AI-first, signal-driven)
  const categoryToolRecs = {};
  CATEGORY_KEYS.forEach(key => {
    const score = categoryScores[key]?.score ?? 0;
    categoryToolRecs[key] = generateCategoryToolRec(
      key, score, categoryBands[key], signals, clientTools, benchmark.categories[key]
    );
  });

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
    categoryToolRecs,
  };
}
